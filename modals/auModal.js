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
  officeEmaill: { type: String, default: "" },
  residenceAddress: {
    line1: { type: String, default: "" },
    line2: { type: String, default: "" },
    line3: { type: String, default: "" },
    landmark: { type: String, default: "" },
    pincode: { type: String, default: "" },
  },
  modalName: { type: String, default: "auForm" },
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
  companyName: { type: String, default: "" },
  designation: { type: String, default: "" },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const auBank = mongoose.model("auForm", userSchema);
module.exports = auBank;
