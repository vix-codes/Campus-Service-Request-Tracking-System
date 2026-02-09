const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// 🟢 LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
      userId: user._id.toString(),
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🟢 ADMIN CREATE USER (tenant/technician/manager)
exports.createUserByAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "All fields required" });

    const allowedRoles = ["tenant", "technician", "manager"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User created",
      data: user,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🟢 GET ALL TECHNICIANS (FOR DROPDOWN)
exports.getTechnicians = async (req, res) => {
  try {
    const staff = await User.find({
      role: "technician",
      isActive: true,
    }).select("name email role");

    res.json({ success: true, data: staff });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟢 GET ALL USERS (ADMIN PANEL)
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: users });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
