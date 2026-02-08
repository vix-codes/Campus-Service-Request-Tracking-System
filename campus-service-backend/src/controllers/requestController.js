const Request = require("../models/Request");
const User = require("../models/User");
const logAction = require("../utils/actionLogger");


// ==============================
// CREATE REQUEST (STUDENT)
// ==============================
exports.createRequest = async (req, res) => {
  try {
    const { title, description, image } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title & description required" });
    }

    const request = await Request.create({
      title,
      description,
      image: image || "",
      createdBy: req.user.id,
    });

    // 🟢 LOG
    await logAction({
      action: "REQUEST_CREATED",
      requestId: request._id,
      performedBy: req.user.id,
      performedByRole: req.user.role,
      note: `New request created: ${title}`,
      req,
    });

    res.status(201).json({ success: true, data: request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ==============================
// GET ALL REQUESTS
// ==============================
exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("createdBy", "name role")
      .populate("assignedTo", "name role")
      .populate("closedBy", "name role")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ==============================
// ASSIGN TO STAFF (ADMIN)
// ==============================
exports.assignRequest = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const { id } = req.params;
    const { staffId } = req.body;

    const request = await Request.findById(id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const staff = await User.findById(staffId);
    if (!staff || staff.role !== "staff") {
      return res.status(400).json({ message: "Invalid staff" });
    }

    request.assignedTo = staffId;
    request.status = "Assigned";
    request.assignedAt = new Date();

    await request.save();

    // 🟢 LOG
    await logAction({
      action: "ASSIGNED_TO_STAFF",
      requestId: request._id,
      performedBy: req.user.id,
      performedByRole: req.user.role,
      assignedTo: staffId,
      previousStatus: "Open",
      newStatus: "Assigned",
      note: `Assigned to ${staff.name}`,
      req,
    });

    res.json({ success: true, message: "Assigned to staff" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ==============================
// UPDATE STATUS (STAFF)
// ==============================
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const request = await Request.findById(id);
    if (!request) return res.status(404).json({ message: "Not found" });

    const previousStatus = request.status;

    // 🟢 START WORK
    if (status === "In Progress") {
      request.status = "In Progress";

      await logAction({
        action: "STATUS_CHANGED",
        requestId: request._id,
        performedBy: req.user.id,
        performedByRole: req.user.role,
        previousStatus,
        newStatus: "In Progress",
        note: "Staff started work",
        req,
      });
    }

    // 🟢 CLOSED
    if (status === "Closed") {
      request.status = "Closed";
      request.closedBy = req.user.id;
      request.closedAt = new Date();

      await logAction({
        action: "CLOSED",
        requestId: request._id,
        performedBy: req.user.id,
        performedByRole: req.user.role,
        previousStatus,
        newStatus: "Closed",
        note: "Task closed",
        req,
      });
    }

    // 🟢 REJECT
    if (status === "Rejected") {
      request.status = "Open";
      request.assignedTo = null;
      request.rejectReason = reason || "";

      await logAction({
        action: "REJECTED",
        requestId: request._id,
        performedBy: req.user.id,
        performedByRole: req.user.role,
        previousStatus,
        newStatus: "Open",
        note: reason || "Rejected",
        req,
      });
    }

    await request.save();

    res.json({ success: true, message: "Status updated" });
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
      action: "REQUEST_DELETED",
      requestId: id,
      performedBy: req.user.id,
      performedByRole: req.user.role,
      note: "Request deleted",
      req,
    });

    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
