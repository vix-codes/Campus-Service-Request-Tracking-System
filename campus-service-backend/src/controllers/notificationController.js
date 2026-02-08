const Notification = require("../models/Notification");

// Get notifications for current user
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(200);

    res.json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark a notification read
const markRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notif = await Notification.findById(id);
    if (!notif) return res.status(404).json({ message: "Notification not found" });
    if (notif.userId.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    notif.read = true;
    await notif.save();

    res.json({ success: true, data: notif });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getNotifications, markRead };
