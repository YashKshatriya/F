const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/authroute.js");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:8000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Root route handler
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// API Routes
app.use("/api/auth", authRoute);

// MongoDB connection
console.log('MongoDB URI:', process.env.MONGODB_URI);
console.log('Attempting to connect to MongoDB...');

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message
  });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;