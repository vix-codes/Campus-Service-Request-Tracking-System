const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  login,
  createUserByAdmin,
  getStaffUsers,
  getAllUsers,
} = require("../controllers/authController");


// 🔓 LOGIN
router.post("/login", login);


// 🔒 ADMIN CREATE USER
router.post("/create-user", authMiddleware, createUserByAdmin);


// 🔒 GET STAFF LIST (dropdown for assign)
router.get("/staff", authMiddleware, getStaffUsers);


// 🔒 GET ALL USERS (admin panel)
router.get("/all", authMiddleware, getAllUsers);


module.exports = router;
