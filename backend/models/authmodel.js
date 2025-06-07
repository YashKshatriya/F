const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please add a phone number"],
      unique: true,
      trim: true,
      match: [/^[0-9]{10}$/, "Please add a valid 10-digit phone number"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);