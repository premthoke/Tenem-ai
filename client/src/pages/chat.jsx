import { useState } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar";
import ChatWindow from "../components/chatwindow";
import MessageInput from "../components/messageinput";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  const startNewChat = () => {
  setMessages([]);
  setCurrentChatId(null);
};

  const sendMessage = async (text) => {
  if (!text.trim()) return;

  const userMessage = { role: "user", content: text };
  setMessages((prev) => [...prev, userMessage]);

  try {
    const res = await axios.post("http://localhost:5000/api/chat", {
      message: text,
      chatId: currentChatId,
    });

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
};

  const openChat = async (chatId) => {
    const res = await axios.get(`http://localhost:5000/api/chat/${chatId}`);
    setMessages(res.data.messages);
    setCurrentChatId(chatId);
  };

  return (
  <div className="h-screen w-screen flex bg-[#0b0f19]">
    <Sidebar 
      onSelectChat={openChat}
      onNewChat={startNewChat}
      currentChatId={currentChatId}
    />

    <div className="flex flex-col flex-1">
      <ChatWindow messages={messages} />
      <MessageInput onSend={sendMessage} />
    </div>
  </div>
);
}

export default Chat;
