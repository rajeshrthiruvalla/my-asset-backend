const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  sms: { type: String, required: true },
  status:{ type: Number },
  processed:{ type: Number }
});

// Prevent same user adding same request twice
// ignoreSchema.index({ userId: 1, request: 1 }, { unique: true });

module.exports = mongoose.model("request", requestSchema);
