
const normalizeOrigin = (value) => {
  if (!value) return "";
  let v = String(value).trim().replace(/\/+$/, "");
  if (!v) return "";

  if (!/^https?:\/\//i.test(v)) v = `https://${v}`;

  try {
    return new URL(v).origin;
  } catch {
    return "";
  }
};

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map(normalizeOrigin)
  .filter(Boolean);

const allowAllOrigins = allowedOrigins.length === 0 || allowedOrigins.includes("*");

const corsConfig = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);

    const normalized = normalizeOrigin(origin) || origin;
    if (allowAllOrigins || allowedOrigins.includes(normalized)) return cb(null, true);

    return cb(null, false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

module.exports = corsConfig;
