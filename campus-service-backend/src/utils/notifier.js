const Notification = require("../models/Notification");
const User = require("../models/User");

const createNotification = async ({
  userId,
  title = "Notification",
  message,
  type = "SYSTEM",
  complaintId = null,
  relatedToken = "",
}) => {
  try {
    await Notification.create({ userId, title, message, type, complaintId, relatedToken });
  } catch (err) {
    console.error("Failed to create notification:", err.message);
  }
};

const notifyUsers = async ({
  userIds,
  title = "Notification",
  message,
  type = "SYSTEM",
  complaintId = null,
  relatedToken = "",
}) => {
  try {
    if (!userIds || userIds.length === 0) return;
    const docs = userIds.map((id) => ({
      userId: id,
      title,
      message,
      type,
      complaintId,
      relatedToken,
    }));
    await Notification.insertMany(docs);
  } catch (err) {
    console.error("Failed to notify users:", err.message);
  }
};

const notifyRoles = async ({
  roles,
  title = "Notification",
  message,
  type = "SYSTEM",
  complaintId = null,
  relatedToken = "",
}) => {
  try {
    const users = await User.find({ role: { $in: roles } }).select("_id");
    if (!users || users.length === 0) return;
    await notifyUsers({
      userIds: users.map((u) => u._id),
      title,
      message,
      type,
      complaintId,
      relatedToken,
    });
  } catch (err) {
    console.error("Failed to notify roles:", err.message);
  }
};

module.exports = {
  createNotification,
  notifyUsers,
  notifyRoles,
};
