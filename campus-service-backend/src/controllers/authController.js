const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// 🟢 LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name,
      },
      process.env.JWT_SECRET || "supersecret",
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🟢 ADMIN CREATE USER (staff/student/admin)
exports.createUserByAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      createdBy: req.user.id,
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


// 🟢 GET ALL STAFF (FOR DROPDOWN)
exports.getStaffUsers = async (req, res) => {
  try {
    const staff = await User.find({
      role: "staff",
      isActive: true,
    }).select("name email");

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
