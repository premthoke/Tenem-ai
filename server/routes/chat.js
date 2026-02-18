const express = require("express");
const router = express.Router();
const axios = require("axios");

const Chat = require("../models/chat");
const auth = require("../middleware/auth");

// SEND MESSAGE (PROTECTED)
router.post("/", auth, async (req, res) => {
  const { message, chatId } = req.body;

  try {
    let previousMessages = [];

    // Load old messages if chat exists
    if (chatId) {
      const existingChat = await Chat.findById(chatId);

      if (existingChat) {
        previousMessages = existingChat.messages.map(m => ({
          role: m.role,
          content: m.content
        }));
      }
    }

    // Send full conversation to AI
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "You are Tenem AI, a helpful assistant." },
          ...previousMessages,
          { role: "user", content: message },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiReply = response.data.choices[0].message;

    let chat;

    if (chatId) {
      // EXISTING CHAT → append
      chat = await Chat.findById(chatId);

      chat.messages.push(
        { role: "user", content: message },
        { role: "assistant", content: aiReply.content }
      );

      await chat.save();
    } else {
      // NEW CHAT → attach to logged-in user
      chat = await Chat.create({
        userId: req.user.userId,
        messages: [
          { role: "user", content: message },
          { role: "assistant", content: aiReply.content },
        ],
      });
    }

    res.json({ aiReply, chatId: chat._id });

  } catch (err) {
    console.error(err);
    res.status(500).send("AI error");
  }
});

// GET ALL CHATS (ONLY USER'S CHATS)
router.get("/", auth, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching chats");
  }
});

// GET SINGLE CHAT (ONLY USER'S CHAT)
router.get("/:id", auth, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching chat");
  }
});

module.exports = router;
