const mongoose = require("mongoose");

mongoose.set('strictQuery', false);

const db = {};
db.mongoose = mongoose;

// USE MONGO_URL FROM ENV
db.url = process.env.MONGO_URL;

if (!db.url) {
  console.error("❌ MONGO_URL is NOT set!");
}

db.tutorials = require("./tutorial.model.js")(mongoose);

module.exports = db;

