const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uriCandidates = [
      process.env.MONGO_URI,
      process.env.MONGODB_URI,
      process.env.MONGO_URL,
      process.env.DATABASE_URL,
    ];

    const uri = uriCandidates.find((v) => typeof v === "string" && v.trim().length > 0);

    if (!uri) {
      console.error(
        "MongoDB connection failed: missing connection string. Set one of: MONGO_URI, MONGODB_URI, MONGO_URL, DATABASE_URL"
      );
      process.exit(1);
    }

    await mongoose.connect(uri.trim());

    console.log("🟢 MongoDB connected successfully");

  } catch (error) {
    console.error("🔴 MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
