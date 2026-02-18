const Chat = require("../models/chat");
const express = require("express");
const router = express.Router();
const axios = require("axios");

// POST MESSAGE
router.post("/", async (req, res) => {
  const { message, chatId } = req.body;

  try {
    let previousMessages = [];

    // If chat exists → load history
    if (chatId) {
      const existingChat = await Chat.findById(chatId);
      if (existingChat) {
        previousMessages = existingChat.messages.map(m => ({
          role: m.role,
          content: m.content
        }));
      }
    }

    // Send FULL conversation to AI
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
      // EXISTING CHAT
      chat = await Chat.findById(chatId);

      chat.messages.push(
        { role: "user", content: message },
        { role: "assistant", content: aiReply.content }
      );

      await chat.save();
    } else {
      // NEW CHAT
      chat = await Chat.create({
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


// ⭐ ADD THIS PART (YOU MISSED THIS)

// GET ALL CHATS
router.get("/", async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 });
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching chats");
  }
});

// GET SINGLE CHAT
router.get("/:id", async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching chat");
  }
});

module.exports = router;
