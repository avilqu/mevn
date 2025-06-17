// mongodb init
const mongoose = require("mongoose");
// const { seedDatabase } = require("./seed");

async function connectDB() {  
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Connected to MongoDB (${process.env.MONGODB_URL})`);
}

connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// cookies config
const keys = [
  process.env.COOKIE_KEY_1,
  process.env.COOKIE_KEY_2,
  process.env.COOKIE_KEY_3,
];
const cookieSession = require("cookie-session")({
  name: "auth",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 1 month
  keys,
  httpOnly: false,
});

module.exports = {
  cookieSession,
  mongoose,
};
