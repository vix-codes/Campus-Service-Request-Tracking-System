const Complaint = require("../models/Complaint");
const User = require("../models/User");

const getAdminAnalytics = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const totalComplaints = await Complaint.countDocuments();
    const open = await Complaint.countDocuments({ status: "NEW" });
    const assigned = await Complaint.countDocuments({ status: "ASSIGNED" });
    const inProgress = await Complaint.countDocuments({ status: "IN_PROGRESS" });
    const completed = await Complaint.countDocuments({ status: "COMPLETED" });
    const closed = await Complaint.countDocuments({ status: "CLOSED" });
    const rejected = await Complaint.countDocuments({ status: "REJECTED" });

    const critical = await Complaint.countDocuments({ priority: "critical" });
    const high = await Complaint.countDocuments({ priority: "high" });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayCreated = await Complaint.countDocuments({ createdAt: { $gte: startOfDay } });
    const todayClosed = await Complaint.countDocuments({
      closedAt: { $gte: startOfDay },
      status: "CLOSED",
    });

    const avgResAgg = await Complaint.aggregate([
      { $match: { status: "CLOSED", closedAt: { $ne: null } } },
      { $project: { diff: { $subtract: ["$closedAt", "$createdAt"] } } },
      { $group: { _id: null, avgResolutionMs: { $avg: "$diff" } } },
    ]);
    const avgResolutionMs = avgResAgg[0]?.avgResolutionMs || 0;

    const techPerf = await Complaint.aggregate([
      { $match: { status: "COMPLETED", completedBy: { $ne: null } } },
      {
        $group: {
          _id: "$completedBy",
          completedCount: { $sum: 1 },
          avgCompletionMs: { $avg: { $subtract: ["$completedAt", "$createdAt"] } },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          technicianId: "$_id",
          name: "$user.name",
          email: "$user.email",
          completedCount: 1,
          avgCompletionMs: 1,
        },
      },
      { $sort: { completedCount: -1 } },
    ]);

    const pendingByTech = await Complaint.aggregate([
      { $match: { status: { $in: ["ASSIGNED", "IN_PROGRESS"] }, assignedTo: { $ne: null } } },
      { $group: { _id: "$assignedTo", pendingCount: { $sum: 1 } } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          technicianId: "$_id",
          name: "$user.name",
          email: "$user.email",
          pendingCount: 1,
        },
      },
      { $sort: { pendingCount: -1 } },
    ]);

    const technicians = await User.countDocuments({ role: "technician" });

    return res.json({
      success: true,
      data: {
        overview: {
          totalComplaints,
          open,
          assigned,
          inProgress,
          completed,
          closed,
          rejected,
        },
        priority: {
          critical,
          high,
        },
        time: {
          avgResolutionMs,
          todayCreated,
          todayClosed,
        },
        technicians: {
          total: technicians,
          performance: techPerf,
          pending: pendingByTech,
        },
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { getAdminAnalytics };
