const Notification = require("../models/Notification");
const User = require("../models/User");

const createNotification = async ({ userId, message, type = "info", relatedRequest = null }) => {
  try {
    await Notification.create({ userId, message, type, relatedRequest });
  } catch (err) {
    console.error("Failed to create notification:", err.message);
  }
};

// send notification to all admins
const notifyAdmins = async ({ message, type = "info", relatedRequest = null }) => {
  try {
    const admins = await User.find({ role: "admin" }).select("_id");
    if (!admins || admins.length === 0) return;
    const docs = admins.map((a) => ({ userId: a._id, message, type, relatedRequest }));
    await Notification.insertMany(docs);
  } catch (err) {
    console.error("Failed to notify admins:", err.message);
  }
};

module.exports = { createNotification, notifyAdmins };
