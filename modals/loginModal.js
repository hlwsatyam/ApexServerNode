const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  occupation: {
    type: String,
  },
  phone: {
    type: String,
  },
  experience: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    set: function (email) {
      return email.toLowerCase();
    },
  },
  adharFrontPic: {
    type: String, // Assuming you'll store the image as a URL or base64 string
    required: true,
  },
  adharBackPic: {
    type: String, // Assuming you'll store the image as a URL or base64 string
    required: true,
  },
  userPic: {
    type: String, // Assuming you'll store the image as a URL or base64 string
    required: true,
  },
});

const UserModal = mongoose.model("User", userSchema);

module.exports = UserModal;
