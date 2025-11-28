const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Read MongoDB URI
const MONGO_URL = process.env.MONGO_URI || "mongodb://localhost:27017/cruddb";

console.log("Using MONGO_URL:", MONGO_URL);

mongoose.set("strictQuery", false);

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend is running." });
});

// Load routes
require("./app/routes/tutorial.routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
