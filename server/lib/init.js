// mongodb init
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { seedDatabase } = require("./seed");

let mongod;

async function connectDB() {
  if (process.env.NODE_ENV === 'dev') {
    console.log('Connecting to in-memory MongoDB...');
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log('Connected to in-memory MongoDB!');
        await seedDatabase();
  } else {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB!');
  }
}

async function cleanup() {
  if (mongod) {
    await mongoose.disconnect();
    await mongod.stop();
  }
}

connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

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
