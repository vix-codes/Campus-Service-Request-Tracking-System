const Request = require("../models/Request");
const User = require("../models/User");


// 🟢 CREATE REQUEST (student)
exports.createRequest = async (req, res) => {
  try {
    const { title, description, image } = req.body;

    if (!title || !description)
      return res.status(400).json({ message: "Title & description required" });

    const request = await Request.create({
      title,
      description,
      image: image || "",
      createdBy: req.user.id,
      status: "Open",
      statusHistory: [
        {
          status: "Open",
          by: req.user.id,
          at: new Date(),
        },
      ],
    });

    res.status(201).json({
      success: true,
      data: request,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🟢 GET ALL REQUESTS (role based)
exports.getAllRequests = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "student") {
      filter.createdBy = req.user.id;
    }

    if (req.user.role === "staff") {
      filter.assignedTo = req.user.id;
    }

    const requests = await Request.find(filter)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .populate("closedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🟢 ADMIN ASSIGN REQUEST
exports.assignRequest = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    const { staffId } = req.body;

    const staff = await User.findById(staffId);
    if (!staff || staff.role !== "staff")
      return res.status(400).json({ message: "Invalid staff" });

    const request = await Request.findById(req.params.id);
    if (!request)
      return res.status(404).json({ message: "Request not found" });

    request.assignedTo = staffId;
    request.assignedAt = new Date();
    request.status = "Assigned";

    request.statusHistory.push({
      status: "Assigned",
      by: req.user.id,
      at: new Date(),
    });

    await request.save();

    res.json({ success: true, message: "Assigned successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🟢 STAFF START WORK
exports.startWork = async (req, res) => {
  try {
    if (req.user.role !== "staff")
      return res.status(403).json({ message: "Staff only" });

    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Not found" });

    request.status = "In Progress";

    request.statusHistory.push({
      status: "In Progress",
      by: req.user.id,
      at: new Date(),
    });

    await request.save();

    res.json({ success: true, message: "Work started" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🟢 STAFF CLOSE REQUEST
exports.closeRequest = async (req, res) => {
  try {
    if (req.user.role !== "staff")
      return res.status(403).json({ message: "Staff only" });

    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Not found" });

    request.status = "Closed";
    request.closedBy = req.user.id;
    request.closedAt = new Date();

    request.statusHistory.push({
      status: "Closed",
      by: req.user.id,
      at: new Date(),
    });

    await request.save();

    res.json({ success: true, message: "Closed successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🟢 STAFF REJECT REQUEST
exports.rejectRequest = async (req, res) => {
  try {
    if (req.user.role !== "staff")
      return res.status(403).json({ message: "Staff only" });

    const { reason } = req.body;

    if (!reason)
      return res.status(400).json({ message: "Reason required" });

    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Not found" });

    request.status = "Rejected";
    request.rejectReason = reason;
    request.assignedTo = null;

    request.statusHistory.push({
      status: "Rejected",
      by: req.user.id,
      at: new Date(),
      note: reason,
    });

    await request.save();

    res.json({ success: true, message: "Request rejected" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🟢 DELETE (admin)
exports.deleteRequest = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    await Request.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
