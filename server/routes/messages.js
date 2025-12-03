const router = require("express").Router();
const Message = require("../models/Message");

// GET ALL MESSAGES FOR A SPECIFIC CHANNEL
router.get("/:channel", async (req, res) => {
  try {
    // Find messages where 'channel' matches the one in the URL
    const messages = await Message.find({ channel: req.params.channel });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;