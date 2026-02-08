const User = require("../models/User");
const Request = require("../models/Request");
const bcrypt = require("bcryptjs");
const { logAction } = require("../utils/actionLogger");

// 🟢 ADMIN CREATE USER (staff/student/admin)
exports.createUserByAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      await logAction({
        userId: req.user.id,
        userName: req.user.name,
        userRole: req.user.role,
        action: "CREATE_USER",
        resourceType: "user",
        details: "Unauthorized attempt to create user",
        status: "failure",
      });
      return res.status(403).json({ message: "Admin only" });
    }

    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    // basic email normalization
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

    // Log successful action
    await logAction({
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      action: "CREATE_USER",
      resourceType: "user",
      resourceId: user._id.toString(),
      details: `Created new ${role} user: ${name} (${normalizedEmail})`,
      status: "success",
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

// 🟢 GET ALL STAFF (for dropdown) - returns minimal fields
exports.getAllStaff = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const staff = await User.find({ role: "staff" }).select("name email").lean();

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
    const totalRequests = await Request.countDocuments();
    const open = await Request.countDocuments({ status: "Open" });
    const progress = await Request.countDocuments({ status: "In Progress" });
    const closed = await Request.countDocuments({ status: "Closed" });

    // Average resolution time (ms) for closed requests
    const avgResAgg = await Request.aggregate([
      { $match: { status: "Closed", closedAt: { $ne: null } } },
      { $project: { diff: { $subtract: ["$closedAt", "$createdAt"] } } },
      { $group: { _id: null, avgResolutionMs: { $avg: "$diff" } } },
    ]);

    const avgResolutionMs = avgResAgg[0]?.avgResolutionMs || 0;

    // Staff performance: count handled & avg resolution per staff (closedBy)
    const staffPerf = await Request.aggregate([
      { $match: { status: "Closed", closedBy: { $ne: null } } },
      {
        $group: {
          _id: "$closedBy",
          handledCount: { $sum: 1 },
          avgResolutionMs: { $avg: { $subtract: ["$closedAt", "$createdAt"] } },
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
        totalRequests,
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

