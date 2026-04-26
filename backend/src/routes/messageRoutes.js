const express = require("express");
const messageRouter = express.Router();
const Message = require("../model/message");
const upload = require("../middleware/upload");

// GET chat messages
messageRouter.get("/:userId/:targetUserId", async (req, res) => {
    const { userId, targetUserId } = req.params;

    const messages = await Message.find({
        $or: [
            { senderId: userId, receiverId: targetUserId },
            { senderId: targetUserId, receiverId: userId },
        ],
    }).sort({ createdAt: 1 });

    res.json(messages);
});

messageRouter.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      console.log("❌ No file received");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("✅ File uploaded:", req.file);

    const fileUrl = `http://localhost:9193/uploads/${req.file.filename}`;

    res.json({
      fileUrl,
      fileName: req.file.originalname,
    });
  } catch (err) {
    console.error("🔥 Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = {messageRouter};