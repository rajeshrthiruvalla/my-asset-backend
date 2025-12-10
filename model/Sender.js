const mongoose = require("mongoose");

const senderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  status:{ type: Number }
});

// Prevent same user adding same sender twice
// ignoreSchema.index({ userId: 1, sender: 1 }, { unique: true });

module.exports = mongoose.model("Sender", senderSchema);
