const Notification = require("../models/Notification");

const sendNotification = async ({
  userId,
  title,
  message,
  type = "SYSTEM",
  requestId = null,
}) => {
  try {
    await Notification.create({
      userId,
      title,
      message,
      type,
      requestId,
    });
  } catch (err) {
    console.log("Notification error:", err.message);
  }
};

module.exports = sendNotification;
