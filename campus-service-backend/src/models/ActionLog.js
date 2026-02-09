const mongoose = require("mongoose");

const actionLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      // examples:
      // REQUEST_CREATED
      // ASSIGNED_TO_STAFF
      // STATUS_CHANGED
      // CLOSED
      // REJECTED
      // USER_CREATED
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

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    performedByRole: {
      type: String,
      default: "",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    previousStatus: {
      type: String,
      default: "",
    },

    newStatus: {
      type: String,
      default: "",
    },

    note: {
      type: String,
      default: "",
    },

    ipAddress: {
      type: String,
      default: "",
    },

    userAgent: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// fast lookup
actionLogSchema.index({ complaintId: 1 });
actionLogSchema.index({ performedBy: 1 });
actionLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("ActionLog", actionLogSchema);
