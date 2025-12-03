const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of users in the channel
  },
  { timestamps: true }
);

module.exports = mongoose.model("Channel", channelSchema);