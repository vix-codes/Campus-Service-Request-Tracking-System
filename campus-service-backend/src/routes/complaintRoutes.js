const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");

const {
  createComplaint,
  getComplaints,
  assignComplaint,
  updateStatus,
  updatePriority,
  deleteComplaint,
} = require("../controllers/complaintController");

// 🟢 ALL LOGGED IN USERS CAN VIEW (role-filtered)
router.get("/", auth, getComplaints);

// 🟢 TENANT CREATE
router.post("/", auth, createComplaint);

// 🟢 MANAGER/ADMIN ASSIGN
router.put("/assign/:id", auth, assignComplaint);

// 🟢 STATUS UPDATE
router.put("/status/:id", auth, updateStatus);

// 🟢 MANAGER/ADMIN PRIORITY UPDATE
router.put("/priority/:id", auth, updatePriority);

// 🟢 ADMIN DELETE
router.delete("/:id", auth, deleteComplaint);

module.exports = router;
