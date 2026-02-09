const Notification = require("../models/Notification");

const sendNotification = async ({
  userId,
  title,
  message,
  type = "SYSTEM",
  complaintId = null,
}) => {
  try {
    await Notification.create({
      userId,
      title,
      message,
      type,
      complaintId,
    });
  } catch (err) {
    console.log("Notification error:", err.message);
  }
};

module.exports = sendNotification;
