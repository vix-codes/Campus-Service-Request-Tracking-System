const ActionLog = require("../models/ActionLog");

const logAction = async ({
  action,
  complaintId = null,
  relatedToken = "",
  performedBy,
  performedByRole = "",
  assignedTo = null,
  previousStatus = "",
  newStatus = "",
  note = "",
  req = null,
}) => {
  try {
    await ActionLog.create({
      action,
      complaintId,
      relatedToken,
      performedBy,
      performedByRole,
      assignedTo,
      previousStatus,
      newStatus,
      note,
      ipAddress: req?.ip || "",
      userAgent: req?.headers["user-agent"] || "",
    });
  } catch (err) {
    console.log("Action log error:", err.message);
  }
};

module.exports = logAction;
module.exports.logAction = logAction;
