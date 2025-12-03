const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true }, // Saving Username (e.g. "User1")
    channel: { type: String, required: true }, // Saving Channel Name (e.g. "General")
    content: { type: String, required: true }, // The Message
    timestamp: { type: String, required: true }, // The Time (e.g. "10:30")
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);