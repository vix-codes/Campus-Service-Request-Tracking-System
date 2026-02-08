const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");

const {
  getActionLogs,
  getLogsByUser,
  getLogsByAction,
  getLogsByRequest,
} = require("../controllers/auditController");

// 🔵 GET ALL ACTION LOGS (admin)
router.get("/", auth, getActionLogs);

// 🔵 GET LOGS BY USER (admin)
router.get("/user/:userId", auth, getLogsByUser);

// 🔵 GET LOGS BY ACTION (admin)
router.get("/action/:action", auth, getLogsByAction);

// 🔵 GET LOGS BY REQUEST (admin/owner/assigned)
router.get("/request/:requestId", auth, getLogsByRequest);

module.exports = router;
