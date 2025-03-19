const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
  },
  mobile_number: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    required: true,
    default: 'user',
  },
})

module.exports = mongoose.model("User", userSchema)
