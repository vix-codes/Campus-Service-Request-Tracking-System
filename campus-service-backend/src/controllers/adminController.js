const User = require("../models/User");
const Complaint = require("../models/Complaint");
const bcrypt = require("bcryptjs");
const logAction = require("../utils/actionLogger");

// 🟢 ADMIN CREATE USER (tenant/technician/manager)
exports.createUserByAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    const allowedRoles = ["tenant", "technician", "manager"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashed,
      role,
    });

    await logAction({
      action: "USER_CREATED",
      performedBy: req.user.id,
      performedByRole: req.user.role,
      note: `Created ${role}: ${name} (${normalizedEmail})`,
    });

    // return safe user object (no password)
    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: safeUser,
    });
  } catch (err) {
    console.error("createUserByAdmin:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// 🟢 ADMIN VIEW ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const users = await User.find().select("-password").lean();

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    console.error("getAllUsers:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// 🟢 GET ALL TECHNICIANS (for dropdown) - returns minimal fields
exports.getAllStaff = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const staff = await User.find({ role: "technician" }).select("name email").lean();

    return res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (err) {
    console.error("getAllStaff:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// 🟢 ADMIN DASHBOARD STATS
exports.getAdminStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const totalUsers = await User.countDocuments();
    const totalComplaints = await Complaint.countDocuments();
    const open = await Complaint.countDocuments({ status: "NEW" });
    const progress = await Complaint.countDocuments({ status: "IN_PROGRESS" });
    const closed = await Complaint.countDocuments({ status: "CLOSED" });

    // Average resolution time (ms) for closed requests
    const avgResAgg = await Complaint.aggregate([
      { $match: { status: "CLOSED", closedAt: { $ne: null } } },
      { $project: { diff: { $subtract: ["$closedAt", "$createdAt"] } } },
      { $group: { _id: null, avgResolutionMs: { $avg: "$diff" } } },
    ]);

    const avgResolutionMs = avgResAgg[0]?.avgResolutionMs || 0;

    // Technician performance: count handled & avg resolution per technician (completedBy)
    const staffPerf = await Complaint.aggregate([
      { $match: { status: "COMPLETED", completedBy: { $ne: null } } },
      {
        $group: {
          _id: "$completedBy",
          handledCount: { $sum: 1 },
          avgResolutionMs: { $avg: { $subtract: ["$completedAt", "$createdAt"] } },
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
          staffId: "$_id",
          name: "$user.name",
          email: "$user.email",
          handledCount: 1,
          avgResolutionMs: 1,
        },
      },
      { $sort: { handledCount: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalComplaints,
        open,
        progress,
        closed,
        avgResolutionMs,
        staffPerformance: staffPerf,
      },
    });
  } catch (err) {
    console.error("getAdminStats:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

