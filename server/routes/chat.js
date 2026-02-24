const express = require("express");
const router = express.Router();
const axios = require("axios");

const Chat = require("../models/chat");
const auth = require("../middleware/auth");

// ================================
// SEND MESSAGE
// ================================
router.post("/", auth, async (req, res) => {
  const { message, chatId } = req.body;

  try {
    let previousMessages = [];

    // load history
    if (chatId) {
      const existingChat = await Chat.findById(chatId);
      if (existingChat) {
        previousMessages = existingChat.messages.map(m => ({
          role: m.role,
          content: m.content
        }));
      }
    }

    // normal OpenRouter call (NO STREAMING)
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        
        messages: [
          {
  role: "system",
  content: `
You are Tenem AI.

Rules:
- Give accurate, factual answers only.
- If unsure, say: "I’m not sure about that."
- Never invent songs, people, movies, or facts.
- Do not guess.
- If user asks vague question, ask clarification.
- Be concise and clear.
`
},
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

    // existing chat
    if (chatId) {
      chat = await Chat.findById(chatId);

      chat.messages.push(
        { role: "user", content: message },
        { role: "assistant", content: aiReply.content }
      );

      await chat.save();
    } 
    // new chat
    else {
      chat = await Chat.create({
        userId: req.user.userId,
        title: message.slice(0, 25),
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

// ================================
// GET ALL CHATS
// ================================
router.get("/", auth, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching chats");
  }
});

// ================================
// GET SINGLE CHAT
// ================================
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

router.put("/:id", auth, async (req, res) => {
  try {
    const { title } = req.body;

    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title },
      { new: true }
    );

    if (!chat) return res.status(404).send("Chat not found");

    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error renaming chat");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!chat) return res.status(404).send("Chat not found");

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting chat");
  }
});

module.exports = router;