
const express = require("express");
const cors = require("cors");

// Route imports
const complaintRoutes = require("./routes/complaintRoutes");
const authRoutes = require("./routes/authRoutes");
const auditRoutes = require("./routes/auditRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Middleware imports
const errorHandler = require("./middlewares/errorHandler");
const requestLogger = require("./middlewares/requestLogger");
const corsConfig = require("./config/corsConfig");

const app = express();

// ----------------------------------------
// Global Middlewares
// ----------------------------------------
app.use(cors(corsConfig));
app.options("*", cors(corsConfig)); // Pre-flight requests
app.use(express.json({ limit: "10mb" }));
app.use(requestLogger);

// ----------------------------------------
// Public & Health Check Routes
// ----------------------------------------
app.get("/health", (req, res) => {
  res.json({ status: "Server running 🚀" });
});

// ----------------------------------------
// API Routes
// ----------------------------------------
const apiRouter = express.Router();

// Mount the various resource routes
apiRouter.use("/auth", authRoutes);
apiRouter.use("/complaints", complaintRoutes);
apiRouter.use("/audit", auditRoutes);
apiRouter.use("/notifications", notificationRoutes);
apiRouter.use("/admin", adminRoutes);

// All API routes will be prefixed with /api
app.use("/api", apiRouter);

// ----------------------------------------
// Error Handling Middleware (must be last)
// ----------------------------------------
app.use(errorHandler);

module.exports = app;
