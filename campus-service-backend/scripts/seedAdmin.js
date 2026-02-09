require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../src/models/User");

const MONGO_URI = process.env.MONGO_URI;
const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
const adminPassword = process.env.ADMIN_PASSWORD || "123456";
const adminName = process.env.ADMIN_NAME || "Main Admin";

async function run() {
  if (!MONGO_URI) {
    console.error("Missing MONGO_URI in environment.");
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);

  const hash = await bcrypt.hash(adminPassword, 10);

  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    existing.password = hash;
    existing.role = "admin";
    if (!existing.name) existing.name = adminName;
    await existing.save();
    console.log(`Updated admin: ${adminEmail}`);
  } else {
    await User.create({
      name: adminName,
      email: adminEmail,
      password: hash,
      role: "admin",
      isActive: true,
    });
    console.log(`Created admin: ${adminEmail}`);
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
