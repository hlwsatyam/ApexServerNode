const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, default: "" },
  mobileNo: { type: String, default: "" },
  motherName: { type: String, default: "" },
  fatherName: { type: String, default: "" },
  panNo: { type: String, default: "" },
  dateOfBirth: { type: String, default: null },
  status: { type: String, default: "null" },
  emailId: { type: String, default: "" },
  residenceAddress: {
    line1: { type: String, default: "" },
    line2: { type: String, default: "" },
    line3: { type: String, default: "" },
    landmark: { type: String, default: "" },
    pincode: { type: String, default: "" },
  },
  officeAddress: {
    line1: { type: String, default: "" },
    line2: { type: String, default: "" },
    landmark: { type: String, default: "" },
    pincode: { type: String, default: "" },
  },
  reapply: {
    type: Boolean,
    default: false,
  },
  modalName: { type: String, default: "yesForm" },
  companyName: { type: String, default: "" },
  designation: { type: String, default: "" },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const yesBank = mongoose.model("yesForm", userSchema);
module.exports = yesBank;
