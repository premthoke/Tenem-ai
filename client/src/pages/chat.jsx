import { useState, useEffect } from "react";
import axios from "../utils/axios";
import Sidebar from "../components/sidebar";
import ChatWindow from "../components/chatwindow";
import MessageInput from "../components/messageinput";

function Chat() {
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  // Load last chat automatically
  useEffect(() => {
  const loadLastChat = async () => {
    try {
      const res = await axios.get(
        "https://tenem-ai.onrender.com/api/chat",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.length > 0) {
        const lastChat = res.data[0];
        setCurrentChatId(lastChat._id);
        setMessages(lastChat.messages);
      }
    } catch (err) {
      console.error("Failed to load chats:", err);
    }
  };

  loadLastChat();
}, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
  };

  // ✅ CORRECT CHAT FUNCTION
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);

    setIsThinking(true);

    try {
      const res = await axios.post(
        "https://tenem-ai.onrender.com/api/chat",
        {
          message: text,
          chatId: currentChatId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const aiReply = {
        role: "assistant",
        content: res.data.aiReply.content,
      };

      setMessages((prev) => [...prev, aiReply]);

      if (!currentChatId) {
        setCurrentChatId(res.data.chatId);
      }
    } catch (err) {
      console.error(err);
    }

    setIsThinking(false);
  };

  const openChat = async (chatId) => {
    const res = await axios.get(
      `https://tenem-ai.onrender.com/api/chat/${chatId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setMessages(res.data.messages);
    setCurrentChatId(chatId);
  };

  return (
    <div className="h-screen w-screen flex bg-[#0b0f19] relative">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-500 px-4 py-1 rounded text-white hover:bg-red-400"
      >
        Logout
      </button>

      <Sidebar
        onSelectChat={openChat}
        onNewChat={startNewChat}
        currentChatId={currentChatId}
      />

      <div className="flex flex-col flex-1">
        <ChatWindow messages={messages} isThinking={isThinking} />
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  );
}

export default Chat;