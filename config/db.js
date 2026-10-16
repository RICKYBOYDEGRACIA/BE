const mongoose = require("mongoose");
const mongoDB = process.env.MONGO_URI;

async function main() {
  await mongoose.connect(mongoDB);
  console.log("Connected to MongoDB");
}

main().catch((err) => console.error("MongoDB connection error:", err));

module.exports = main;