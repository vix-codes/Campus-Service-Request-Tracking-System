const express = require("express");
const cors = require("cors");

const requestRoutes = require("./routes/requestRoutes");
const authRoutes = require("./routes/authRoutes");
const auditRoutes = require("./routes/auditRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");

const errorHandler = require("./middlewares/errorHandler");
const requestLogger = require("./middlewares/requestLogger");

const app = express();


// 🟢 MIDDLEWARES
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error("CORS not allowed"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors());
app.use(express.json({ limit: "10mb" })); // for image base64
app.use(requestLogger);


// 🟢 HEALTH CHECK
app.get("/health", (req, res) => {
  res.json({ status: "Server running 🚀" });
});


// 🟢 ROUTES
app.use("/auth", authRoutes);
app.use("/requests", requestRoutes);
app.use("/audit", auditRoutes);
app.use("/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);


// 🟢 ERROR HANDLER (last)
app.use(errorHandler);


module.exports = app;
