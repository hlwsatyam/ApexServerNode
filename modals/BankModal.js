const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bankAccountSchema = new Schema({
  accountHolderName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  agentId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  ifscCode: {
    type: String,
    required: true,
  },
});

const BankAccount = mongoose.model("BankAccount", bankAccountSchema);

module.exports = BankAccount;
