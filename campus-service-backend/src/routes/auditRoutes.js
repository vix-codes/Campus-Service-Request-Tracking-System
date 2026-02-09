const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");

const {
  getActionLogs,
  getLogsByUser,
  getLogsByAction,
  getLogsByComplaint,
} = require("../controllers/auditController");

// 🔵 GET ALL ACTION LOGS (admin)
router.get("/", auth, getActionLogs);

// 🔵 GET LOGS BY USER (admin)
router.get("/user/:userId", auth, getLogsByUser);

// 🔵 GET LOGS BY ACTION (admin)
router.get("/action/:action", auth, getLogsByAction);

// 🔵 GET LOGS BY COMPLAINT (admin/owner/assigned)
router.get("/complaint/:complaintId", auth, getLogsByComplaint);

module.exports = router;
