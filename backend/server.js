const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Read MONGO_URL from environment variable
const MONGO_URL = process.env.MONGO_URL;

// Debug log (you will see this in docker logs)
console.log("Using MONGO_URL:", MONGO_URL);

// Connect to MongoDB
mongoose.set("strictQuery", false);

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to CRUD API." });
});

// Load routes
require("./app/routes/tutorial.routes")(app);

// Start backend server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

