require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");


// 🟢 CONNECT DATABASE
connectDB();

const PORT = process.env.PORT || 5000;


// 🟢 START SERVER
app.listen(PORT, () => {
  console.log("=================================");
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("=================================");
});
