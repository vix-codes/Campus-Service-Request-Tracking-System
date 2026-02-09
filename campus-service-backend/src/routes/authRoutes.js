const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  login,
  createUserByAdmin,
  getTechnicians,
  getAllUsers,
} = require("../controllers/authController");


// 🔓 LOGIN
router.post("/login", login);


// 🔒 ADMIN CREATE USER
router.post("/create-user", authMiddleware, createUserByAdmin);


// 🔒 GET TECHNICIANS LIST (dropdown for assign)
router.get("/technicians", authMiddleware, getTechnicians);


// 🔒 GET ALL USERS (admin panel)
router.get("/all", authMiddleware, getAllUsers);


module.exports = router;
