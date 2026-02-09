const Request = require("../models/Request");
const User = require("../models/User");
const logAction = require("../utils/actionLogger");
const { createNotification, notifyRoles } = require("../utils/notifier");

const PRIORITY_RULES = {
  critical: ["electricity", "fire", "gas leak", "lift stuck", "water flooding"],
  high: ["water leak", "power issue", "security", "internet down"],
  medium: ["plumbing slow", "fan/light issue", "door lock"],
  low: ["noise", "painting", "cleaning", "minor repair"],
};

const detectPriority = (text) => {
  const haystack = (text || "").toLowerCase();
  if (!haystack) return "medium";
  const matches = (list) => list.some((term) => haystack.includes(term));
  if (matches(PRIORITY_RULES.critical)) return "critical";
  if (matches(PRIORITY_RULES.high)) return "high";
  if (matches(PRIORITY_RULES.medium)) return "medium";
  if (matches(PRIORITY_RULES.low)) return "low";
  return "medium";
};

const normalizeCategory = (category) => {
  if (!category) return "general";
  return String(category).trim().toLowerCase() || "general";
};

const generateToken = async () => {
  const year = new Date().getFullYear();
  const prefix = `APT-${year}-`;
  const latest = await Request.findOne({ token: new RegExp(`^${prefix}`) })
    .sort({ token: -1 })
    .select("token")
    .lean();
  let next = 1;
  if (latest?.token) {
    const raw = latest.token.slice(prefix.length);
    const num = parseInt(raw, 10);
    if (!Number.isNaN(num)) next = num + 1;
  }
  return `${prefix}${String(next).padStart(4, "0")}`;
};

// ==============================
// CREATE COMPLAINT (TENANT)
// ==============================
exports.createRequest = async (req, res) => {
  try {
    if (req.user.role !== "tenant") {
      return res.status(403).json({ message: "Tenant only" });
    }

    const { title, description, image, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title & description required" });
    }

    const token = await generateToken();
    const priority = detectPriority(`${title} ${description}`);

    const request = await Request.create({
      title,
      description,
      image: image || "",
      category: normalizeCategory(category),
      priority,
      token,
      status: "NEW",
      createdBy: req.user.id,
    });

    await logAction({
      action: "COMPLAINT_CREATED",
      requestId: request._id,
      relatedToken: request.token,
      performedBy: req.user.id,
      performedByRole: req.user.role,
      note: `Complaint created: ${title}`,
      req,
    });

    res.status(201).json({ success: true, data: request });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: "Token conflict, try again" });
    }
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// GET REQUESTS (ROLE FILTERED)
// ==============================
exports.getRequests = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user.id;

    const filter = {};
    if (role === "tenant") {
      filter.createdBy = userId;
    } else if (role === "technician") {
      filter.assignedTo = userId;
    }

    const requests = await Request.find(filter)
      .populate("createdBy", "name role")
      .populate("assignedTo", "name role")
      .populate("assignedBy", "name role")
      .populate("completedBy", "name role")
      .populate("closedBy", "name role")
      .populate("rejectedBy", "name role")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// ASSIGN TO TECHNICIAN (MANAGER/ADMIN)
// ==============================
exports.assignRequest = async (req, res) => {
  try {
    if (!["manager", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Manager/Admin only" });
    }

    const { id } = req.params;
    const technicianId = req.body.technicianId || req.body.staffId;

    if (!technicianId) {
      return res.status(400).json({ message: "Technician required" });
    }

    const request = await Request.findById(id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (!["NEW", "REJECTED"].includes(request.status)) {
      return res.status(400).json({ message: "Request not assignable" });
    }

    const tech = await User.findById(technicianId);
    if (!tech || tech.role !== "technician") {
      return res.status(400).json({ message: "Invalid technician" });
    }

    const previousStatus = request.status;
    request.assignedTo = technicianId;
    request.assignedBy = req.user.id;
    request.assignedAt = new Date();
    request.status = "ASSIGNED";
    request.rejectReason = "";
    request.rejectedAt = null;
    request.rejectedBy = null;
    await request.save();

    await logAction({
      action: "COMPLAINT_ASSIGNED",
      requestId: request._id,
      relatedToken: request.token,
      performedBy: req.user.id,
      performedByRole: req.user.role,
      assignedTo: technicianId,
      previousStatus,
      newStatus: "ASSIGNED",
      note: `Assigned to ${tech.name}`,
      req,
    });

    await createNotification({
      userId: technicianId,
      title: "New complaint assigned",
      message: `Complaint ${request.token} assigned to you.`,
      type: "COMPLAINT_ASSIGNED",
      requestId: request._id,
      relatedToken: request.token,
    });

    await createNotification({
      userId: request.createdBy,
      title: "Complaint assigned",
      message: `Your complaint ${request.token} was assigned.`,
      type: "COMPLAINT_ASSIGNED",
      requestId: request._id,
      relatedToken: request.token,
    });

    res.json({ success: true, message: "Assigned to technician" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// UPDATE STATUS
// ==============================
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason, resolutionNote } = req.body;
    const role = req.user.role;
    const userId = req.user.id;

    const request = await Request.findById(id);
    if (!request) return res.status(404).json({ message: "Not found" });

    const previousStatus = request.status;

    if (status === "IN_PROGRESS") {
      if (role !== "technician") {
        return res.status(403).json({ message: "Technician only" });
      }
      if (!request.assignedTo || request.assignedTo.toString() !== userId) {
        return res.status(403).json({ message: "Not assigned to you" });
      }
      if (request.status !== "ASSIGNED") {
        return res.status(400).json({ message: "Invalid status transition" });
      }
      request.status = "IN_PROGRESS";
      request.startedAt = new Date();

      await logAction({
        action: "COMPLAINT_STARTED",
        requestId: request._id,
        relatedToken: request.token,
        performedBy: userId,
        performedByRole: role,
        previousStatus,
        newStatus: "IN_PROGRESS",
        note: "Work started",
        req,
      });
    } else if (status === "COMPLETED") {
      if (role !== "technician") {
        return res.status(403).json({ message: "Technician only" });
      }
      if (!request.assignedTo || request.assignedTo.toString() !== userId) {
        return res.status(403).json({ message: "Not assigned to you" });
      }
      if (request.status !== "IN_PROGRESS") {
        return res.status(400).json({ message: "Invalid status transition" });
      }
      request.status = "COMPLETED";
      request.completedAt = new Date();
      request.completedBy = userId;
      request.resolutionNote = resolutionNote || "";

      await logAction({
        action: "COMPLAINT_COMPLETED",
        requestId: request._id,
        relatedToken: request.token,
        performedBy: userId,
        performedByRole: role,
        previousStatus,
        newStatus: "COMPLETED",
        note: "Marked completed",
        req,
      });

      await notifyRoles({
        roles: ["manager", "admin"],
        title: "Complaint completed",
        message: `Complaint ${request.token} marked completed.`,
        type: "COMPLAINT_COMPLETED",
        requestId: request._id,
        relatedToken: request.token,
      });
    } else if (status === "REJECTED") {
      if (role !== "technician") {
        return res.status(403).json({ message: "Technician only" });
      }
      if (!request.assignedTo || request.assignedTo.toString() !== userId) {
        return res.status(403).json({ message: "Not assigned to you" });
      }
      if (!["ASSIGNED", "IN_PROGRESS"].includes(request.status)) {
        return res.status(400).json({ message: "Invalid status transition" });
      }
      request.status = "REJECTED";
      request.rejectedAt = new Date();
      request.rejectedBy = userId;
      request.rejectReason = reason || "Rejected";
      request.assignedTo = null;

      await logAction({
        action: "COMPLAINT_REJECTED",
        requestId: request._id,
        relatedToken: request.token,
        performedBy: userId,
        performedByRole: role,
        previousStatus,
        newStatus: "REJECTED",
        note: request.rejectReason,
        req,
      });

      await createNotification({
        userId: request.createdBy,
        title: "Complaint rejected",
        message: `Your complaint ${request.token} was rejected.`,
        type: "COMPLAINT_REJECTED",
        requestId: request._id,
        relatedToken: request.token,
      });
    } else if (status === "CLOSED") {
      if (!["manager", "admin"].includes(role)) {
        return res.status(403).json({ message: "Manager/Admin only" });
      }
      if (request.status !== "COMPLETED") {
        return res.status(400).json({ message: "Invalid status transition" });
      }
      request.status = "CLOSED";
      request.closedAt = new Date();
      request.closedBy = userId;

      await logAction({
        action: "COMPLAINT_CLOSED",
        requestId: request._id,
        relatedToken: request.token,
        performedBy: userId,
        performedByRole: role,
        previousStatus,
        newStatus: "CLOSED",
        note: "Closed",
        req,
      });

      await createNotification({
        userId: request.createdBy,
        title: "Complaint closed",
        message: `Your complaint ${request.token} was closed.`,
        type: "COMPLAINT_CLOSED",
        requestId: request._id,
        relatedToken: request.token,
      });
    } else if (status === "NEW") {
      const isManagerOrAdmin = ["manager", "admin"].includes(role);
      const isTenantOwner =
        role === "tenant" && request.createdBy?.toString() === userId;
      if (!isManagerOrAdmin && !isTenantOwner) {
        return res.status(403).json({ message: "Not allowed" });
      }
      if (isTenantOwner && request.status !== "REJECTED") {
        return res.status(400).json({ message: "Invalid status transition" });
      }
      if (isManagerOrAdmin && !["REJECTED", "CLOSED"].includes(request.status)) {
        return res.status(400).json({ message: "Invalid status transition" });
      }
      request.status = "NEW";
      request.assignedTo = null;
      request.assignedBy = null;
      request.assignedAt = null;
      request.startedAt = null;
      request.completedAt = null;
      request.completedBy = null;
      request.closedAt = null;
      request.closedBy = null;
      request.rejectedAt = null;
      request.rejectedBy = null;
      request.rejectReason = "";
      request.resolutionNote = "";

      await logAction({
        action: "COMPLAINT_REOPENED",
        requestId: request._id,
        relatedToken: request.token,
        performedBy: userId,
        performedByRole: role,
        previousStatus,
        newStatus: "NEW",
        note: "Reopened",
        req,
      });
    } else {
      return res.status(400).json({ message: "Unsupported status" });
    }

    request.lastUpdatedBy = userId;
    await request.save();

    res.json({ success: true, message: "Status updated", data: request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// UPDATE PRIORITY (MANAGER/ADMIN)
// ==============================
exports.updatePriority = async (req, res) => {
  try {
    if (!["manager", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Manager/Admin only" });
    }

    const { id } = req.params;
    const { priority } = req.body;

    const allowed = ["low", "medium", "high", "critical"];
    if (!allowed.includes(priority)) {
      return res.status(400).json({ message: "Invalid priority" });
    }

    const request = await Request.findById(id);
    if (!request) return res.status(404).json({ message: "Not found" });

    const previous = request.priority;
    request.priority = priority;
    request.lastUpdatedBy = req.user.id;
    await request.save();

    await logAction({
      action: "PRIORITY_UPDATED",
      requestId: request._id,
      relatedToken: request.token,
      performedBy: req.user.id,
      performedByRole: req.user.role,
      note: `Priority ${previous} -> ${priority}`,
      req,
    });

    res.json({ success: true, message: "Priority updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// DELETE REQUEST (ADMIN)
// ==============================
exports.deleteRequest = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const { id } = req.params;

    const request = await Request.findByIdAndDelete(id);
    if (!request) return res.status(404).json({ message: "Not found" });

    await logAction({
      action: "COMPLAINT_DELETED",
      requestId: id,
      relatedToken: request.token || "",
      performedBy: req.user.id,
      performedByRole: req.user.role,
      note: "Complaint deleted",
      req,
    });

    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
