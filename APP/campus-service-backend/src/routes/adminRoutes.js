const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const { getAdminAnalytics } = require("../controllers/analyticsController");

// 🟢 ADMIN ANALYTICS
router.get("/analytics", auth, getAdminAnalytics);

module.exports = router;
