const mongoose = require("mongoose");
const dns = require("dns");
require("dotenv").config();

// Fix for Windows ISP DNS blocking MongoDB SRV queries (querySrv ECONNREFUSED)
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Fall back to system DNS if restricted
}

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://gauravshuklameja_db_user:LkAUZ14CbpXfMxDr@gymcluster0.3b5k5as.mongodb.net/gymBackend?retryWrites=true&w=majority";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    const sanitizedHost = MONGODB_URI.includes("@")
      ? MONGODB_URI.split("@")[1].split("/")[0]
      : MONGODB_URI;
    console.log(`Connected to MongoDB Atlas successfully: ${sanitizedHost}`);
  })
  .catch((err) => {
    console.warn("MongoDB connection notice:", err.message);
    console.warn("Verify your Atlas network access whitelist (0.0.0.0/0) or check network connection.");
  });

module.exports = mongoose;
