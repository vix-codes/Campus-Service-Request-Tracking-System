const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");

const { getNotifications, markRead } = require("../controllers/notificationController");

router.get("/", auth, getNotifications);
router.put("/:id/read", auth, markRead);

module.exports = router;
