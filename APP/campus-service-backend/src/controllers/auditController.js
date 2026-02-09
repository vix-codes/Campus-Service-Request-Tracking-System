const ActionLog = require("../models/ActionLog");
const Request = require("../models/Request");

// 🔵 GET ALL ACTION LOGS (admin only)
const getActionLogs = async (req, res) => {
  try {
    // RBAC: admin/manager can view action logs
    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ message: "Admin/Manager only" });
    }

    const logs = await ActionLog.find()
      .populate("performedBy", "name email role")
      .sort({ createdAt: -1 })
      .limit(200);

    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔵 GET LOGS BY USER (admin only)
const getLogsByUser = async (req, res) => {
  try {
    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ message: "Admin/Manager only" });
    }

    const { userId } = req.params;

    const logs = await ActionLog.find({ performedBy: userId })
      .populate("performedBy", "name email role")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔵 GET LOGS BY ACTION TYPE (admin only)
const getLogsByAction = async (req, res) => {
  try {
    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ message: "Admin/Manager only" });
    }

    const { action } = req.params;

    const logs = await ActionLog.find({ action })
      .populate("performedBy", "name email role")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔵 GET LOGS BY REQUEST (auth: admin / owner / assigned technician)
const getLogsByRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    // RBAC: admin can view any; tenant can view if createdBy; technician can view if assignedTo
    if (!["admin", "manager"].includes(req.user.role)) {
      const isOwner = request.createdBy?.toString() === req.user.id;
      const isAssigned = request.assignedTo?.toString() === req.user.id;
      if (!isOwner && !isAssigned) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    const logs = await ActionLog.find({ requestId })
      .populate("performedBy", "name email role")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getActionLogs,
  getLogsByUser,
  getLogsByAction,
  getLogsByRequest,
};
