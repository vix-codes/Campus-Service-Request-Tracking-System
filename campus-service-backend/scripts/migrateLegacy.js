require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../src/models/User");
const Complaint = require("../src/models/Complaint");
const Notification = require("../src/models/Notification");
const ActionLog = require("../src/models/ActionLog");

const MONGO_URI = process.env.MONGO_URI;

const ROLE_MAP = {
  student: "tenant",
  staff: "technician",
};

const STATUS_MAP = {
  Open: "NEW",
  Assigned: "ASSIGNED",
  "In Progress": "IN_PROGRESS",
  Closed: "CLOSED",
  Rejected: "REJECTED",
};

const normalizePriority = (value) => {
  if (!value) return "medium";
  const v = String(value).toLowerCase();
  if (["low", "medium", "high", "critical"].includes(v)) return v;
  if (v === "low") return "low";
  if (v === "medium") return "medium";
  if (v === "high") return "high";
  return "medium";
};

const normalizeCategory = (value) => {
  if (!value) return "general";
  const v = String(value).trim().toLowerCase();
  return v || "general";
};

const buildToken = (year, seq) => `APT-${year}-${String(seq).padStart(4, "0")}`;

const assignTokens = async (requests) => {
  const seqByYear = new Map();
  const updates = [];

  for (const req of requests) {
    if (req.token) continue;
    const year = (req.createdAt ? req.createdAt.getFullYear() : new Date().getFullYear());
    const next = (seqByYear.get(year) || 0) + 1;
    seqByYear.set(year, next);
    const token = buildToken(year, next);
    updates.push({ _id: req._id, token });
  }

  for (const u of updates) {
    await Complaint.updateOne({ _id: u._id }, { $set: { token: u.token } });
  }

  return updates.length;
};

const run = async () => {
  if (!MONGO_URI) {
    console.error("Missing MONGO_URI in environment.");
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);

  // 1) Roles migration
  const users = await User.find({ role: { $in: ["student", "staff"] } }).select("_id role");
  for (const u of users) {
    const nextRole = ROLE_MAP[u.role];
    if (nextRole) {
      await User.updateOne({ _id: u._id }, { $set: { role: nextRole } });
    }
  }

  // 2) Status & field normalization
  const requests = await Complaint.find().select(
    "_id status rejectReason priority category token createdAt"
  );
  for (const r of requests) {
    const mapped = STATUS_MAP[r.status] || r.status;
    let status = mapped;
    if (mapped === "NEW" && r.rejectReason) {
      status = "REJECTED";
    }
    await Complaint.updateOne(
      { _id: r._id },
      {
        $set: {
          status,
          priority: normalizePriority(r.priority),
          category: normalizeCategory(r.category),
        },
      }
    );
  }

  // 3) Tokens
  const all = await Complaint.find().sort({ createdAt: 1 }).select("_id token createdAt");
  const tokenCount = await assignTokens(all);

  // 4) Backfill relatedToken
  const tokenById = new Map(
    (await Complaint.find().select("_id token")).map((r) => [String(r._id), r.token || ""])
  );
  const notifications = await Notification.find().select("_id requestId complaintId relatedToken");
  for (const n of notifications) {
    const legacyId = n.complaintId || n.requestId;
    if (!n.relatedToken && legacyId) {
      const token = tokenById.get(String(legacyId)) || "";
      if (token) {
        await Notification.updateOne(
          { _id: n._id },
          { $set: { relatedToken: token, complaintId: legacyId } }
        );
      }
    }
  }
  const logs = await ActionLog.find().select("_id requestId complaintId relatedToken");
  for (const l of logs) {
    const legacyId = l.complaintId || l.requestId;
    if (!l.relatedToken && legacyId) {
      const token = tokenById.get(String(legacyId)) || "";
      if (token) {
        await ActionLog.updateOne(
          { _id: l._id },
          { $set: { relatedToken: token, complaintId: legacyId } }
        );
      }
    }
  }

  console.log("Legacy migration complete.");
  console.log(`Roles updated: ${users.length}`);
  console.log(`Tokens assigned: ${tokenCount}`);

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
