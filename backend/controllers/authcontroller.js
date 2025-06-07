const User = require("../model/authmodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register user
const register = async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { name, phone, password, confirmPassword } = req.body;

    // Validate input
    if (!name || !phone || !password || !confirmPassword) {
      console.log('Missing required fields:', { name, phone, password: !!password, confirmPassword: !!confirmPassword });
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user exists
    const userExists = await User.findOne({ phone });
    if (userExists) {
      console.log('User already exists with phone:', phone);
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    console.log('Creating new user with data:', { name, phone });
    const user = await User.create({
      name,
      phone,
      password: hashedPassword,
    });

    if (user) {
      console.log('User created successfully:', user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        token: generateToken(user._id),
      });
    } else {
      console.log('Failed to create user');
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: "Registration failed", 
      error: error.message 
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { phone, password } = req.body;

    // Validate input
    if (!phone || !password) {
      console.log('Missing required fields:', { phone: !!phone, password: !!password });
      return res.status(400).json({ message: "Please provide phone and password" });
    }

    // Check for user phone
    const user = await User.findOne({ phone });
    if (!user) {
      console.log('User not found with phone:', phone);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password for user:', phone);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log('Login successful for user:', user._id);
    res.json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: "Login failed", 
      error: error.message 
    });
  }
};

// Logout user
const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        phone: user.phone,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "30d",
  });
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
}; 