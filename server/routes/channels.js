const router = require("express").Router();
const Channel = require("../models/Channel");

// 1. GET ALL CHANNELS
router.get("/", async (req, res) => {
  try {
    const channels = await Channel.find();
    res.status(200).json(channels);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. CREATE NEW CHANNEL
router.post("/", async (req, res) => {
  try {
    const newChannel = new Channel({
      name: req.body.name,
      description: req.body.description,
    });
    const savedChannel = await newChannel.save();
    res.status(200).json(savedChannel);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;