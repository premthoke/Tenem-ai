const express = require("express");
const router = express.Router();
const axios = require("axios");
const Chat = require("../models/chat");
const auth = require("../middleware/auth");

// ================================
// SEND MESSAGE (STREAMING)
// ================================
router.post("/", auth, async (req, res) => {
  const { message, chatId } = req.body;

  try {
    let previousMessages = [];

    // Load previous chat history
    if (chatId) {
      const existingChat = await Chat.findById(chatId);
      if (existingChat) {
        previousMessages = existingChat.messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));
      }
    }

    // Call OpenRouter streaming
    const openrouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          stream: true,
          messages: [
            { role: "system", content: "You are Tenem AI." },
            ...previousMessages,
            { role: "user", content: message },
          ],
        }),
      }
    );

    // Stream headers
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    let fullReply = "";
    let buffer = "";

    // Parse SSE stream properly
    for await (const chunk of openrouterResponse.body) {
      buffer += chunk.toString();

      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.startsWith("data:")) continue;

        const jsonStr = line.replace("data:", "").trim();
        if (jsonStr === "[DONE]") continue;

        try {
          const parsed = JSON.parse(jsonStr);
          const token = parsed.choices?.[0]?.delta?.content;

          if (token) {
            fullReply += token;
            res.write(token);
          }
        } catch {
          continue;
        }
      }
    }

    res.end();

    // Save conversation after streaming finishes
    let chat;

    if (chatId) {
      chat = await Chat.findById(chatId);

      chat.messages.push(
        { role: "user", content: message },
        { role: "assistant", content: fullReply }
      );

      await chat.save();
    } else {
      chat = await Chat.create({
        userId: req.user.userId,
        title: message.slice(0, 25),
        messages: [
          { role: "user", content: message },
          { role: "assistant", content: fullReply },
        ],
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).send("Streaming error");
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

// ================================
// RENAME CHAT
// ================================
router.put("/:id", auth, async (req, res) => {
  try {
    const { title } = req.body;

    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title },
      { new: true }
    );

    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error renaming chat");
  }
});

// ================================
// DELETE CHAT
// ================================
router.delete("/:id", auth, async (req, res) => {
  try {
    await Chat.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting chat");
  }
});

module.exports = router;