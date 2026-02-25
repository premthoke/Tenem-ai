import { useState, useEffect } from "react";
import axios from "../utils/axios";
import Sidebar from "../components/sidebar";
import ChatWindow from "../components/chatwindow";
import MessageInput from "../components/messageinput";


function Chat() {
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  useEffect(() => {
  const loadLastChat = async () => {
    try {
      const res = await axios.get("/api/chat");

      if (res.data.length > 0) {
        const lastChat = res.data[0];

        setCurrentChatId(lastChat._id);
        setMessages(lastChat.messages);
      }
    } catch (err) {
      console.error(err);
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

 const sendMessage = async (text) => {
  if (!text.trim()) return;

  const userMessage = { role: "user", content: text };
  setMessages((prev) => [...prev, userMessage]);

  setIsThinking(true);

  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      message: text,
      chatId: currentChatId,
    }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let aiText = "";

  // create empty assistant bubble
  setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    aiText += chunk;

    setMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        role: "assistant",
        content: aiText,
      };
      return updated;
    });
  }

  setIsThinking(false);
};
  const openChat = async (chatId) => {
    const res = await axios.get(`/api/chat/${chatId}`);
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