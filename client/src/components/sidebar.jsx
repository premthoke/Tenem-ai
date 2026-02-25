import { useEffect, useState } from "react";
import axios from "../utils/axios";

function Sidebar({ onSelectChat, onNewChat, currentChatId }) {
  const [chats, setChats] = useState([]);

  const fetchChats = async () => {
    try {
      const res = await axios.get("https://tenem-ai.onrender.com/api/chat", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
      setChats(res.data);
    } catch (err) {
      console.error("Fetch chats error:", err);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [currentChatId]);

  const handleRename = async (chat) => {
    const newTitle = prompt("Rename chat:", chat.title);
    if (!newTitle) return;

    try {
      await axios.put(`/api/chat/${chat._id}`, {
        title: newTitle,
      });

      fetchChats(); // refresh sidebar without reload
    } catch (err) {
      console.error("Rename error:", err);
    }
  };

  const handleDelete = async (chat) => {
    const confirmDelete = window.confirm("Delete this chat?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/chat/${chat._id}`);
      fetchChats(); // refresh list
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="w-64 bg-[#0e1424] border-r border-cyan-500/20 p-4">
      <h1 className="text-xl font-bold text-cyan-400 mb-6">Tenem</h1>

      <button
        onClick={onNewChat}
        className="w-full py-2 mb-4 bg-cyan-500/10 border border-cyan-400 rounded-lg hover:bg-cyan-500/20"
      >
        + New Chat
      </button>

      <div className="space-y-2 text-sm text-gray-300 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat._id}
            className="group flex items-center justify-between"
          >
            <p
              onClick={() => onSelectChat(chat._id)}
              className="cursor-pointer hover:text-cyan-400"
            >
              {chat.title}
            </p>

            <div className="hidden group-hover:flex gap-2 text-xs">
              <button
                className="text-gray-400"
                onClick={() => handleRename(chat)}
              >
                ✏️
              </button>

              <button
                className="text-red-400"
                onClick={() => handleDelete(chat)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;