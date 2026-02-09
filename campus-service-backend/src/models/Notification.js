const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      default: "",
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "REQUEST_CREATED",
        "ASSIGNED",
        "STATUS_UPDATED",
        "CLOSED",
        "REJECTED",
        "COMPLAINT_CREATED",
        "COMPLAINT_ASSIGNED",
        "COMPLAINT_COMPLETED",
        "COMPLAINT_CLOSED",
        "COMPLAINT_REJECTED",
        "SYSTEM"
      ],
      default: "SYSTEM",
    },

    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      default: null,
    },

    relatedToken: {
      type: String,
      default: "",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// performance indexes
notificationSchema.index({ userId: 1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ complaintId: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
