
const bcrypt = require("bcryptjs");
const User = require("../src/models/User");

const seedAdmin = async () => {
  if (String(process.env.SEED_ADMIN || "").toLowerCase() !== "true") return;

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";

  if (!email || !password) {
    console.error(
      "SEED_ADMIN=true but missing ADMIN_EMAIL/ADMIN_PASSWORD. Skipping admin bootstrap."
    );
    return;
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const existing = await User.findOne({ email });

    if (existing) {
      existing.password = hash;
      existing.role = "admin";
      existing.isActive = true;
      if (!existing.name) existing.name = name;
      await existing.save();
      console.log(`Bootstrapped admin (updated): ${email}`);
      return;
    }

    await User.create({
      name,
      email,
      password: hash,
      role: "admin",
      isActive: true,
    });

    console.log(`Bootstrapped admin (created): ${email}`);
  } catch (error) {
    console.error("Admin bootstrap failed:", error?.message || error);
  }
};

module.exports = seedAdmin;
