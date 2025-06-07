const User = require("../models/authmodel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Register User
const register = async (req, res) => {
  try {
    const { name, phoneNumber, password } = req.body;

    // Validation
    if (!name || !phoneNumber || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Check if user exists
    const userExists = await User.findOne({ phoneNumber });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      phoneNumber,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error in registration", error: error.message });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Validation
    if (!phoneNumber || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Check for user
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error in login", error: error.message });
  }
};

// Logout User
const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// Get User Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
}; 