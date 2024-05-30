const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, default: "" },
  mobileNo: { type: String, default: "" },
  status: { type: String, default: "null" },
  reapply: {
    type: Boolean,
    default: false,
  },
  reason: { type: String, default: "" },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  modalName: { type: String, default: "loanForm" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const loan = mongoose.model("loanForm", userSchema);
module.exports = loan;
