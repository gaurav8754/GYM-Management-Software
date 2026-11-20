const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/gymBackend";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log(`Connected to MongoDB successfully: ${MONGODB_URI}`))
  .catch((err) => {
    console.warn("MongoDB connection notice:", err.message);
    console.warn("Ensure local MongoDB is running on port 27017 or provide MONGODB_URI in .env");
  });

module.exports = mongoose;
