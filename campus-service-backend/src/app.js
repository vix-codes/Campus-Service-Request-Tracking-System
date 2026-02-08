const express = require("express");
const cors = require("cors");

const requestRoutes = require("./routes/requestRoutes");
const authRoutes = require("./routes/authRoutes");

const errorHandler = require("./middlewares/errorHandler");
const requestLogger = require("./middlewares/requestLogger");

const app = express();


// 🟢 MIDDLEWARES
app.use(cors());
app.use(express.json({ limit: "10mb" })); // for image base64
app.use(requestLogger);


// 🟢 HEALTH CHECK
app.get("/health", (req, res) => {
  res.json({ status: "Server running 🚀" });
});


// 🟢 ROUTES
app.use("/auth", authRoutes);
app.use("/requests", requestRoutes);


// 🟢 ERROR HANDLER (last)
app.use(errorHandler);


module.exports = app;
