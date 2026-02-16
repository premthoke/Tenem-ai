import { useEffect, useState } from "react";
import axios from "axios";

function Sidebar({ onSelectChat, onNewChat, currentChatId }) {
  const [chats, setChats] = useState([]);

  const fetchChats = async () => {
    const res = await axios.get("http://localhost:5000/api/chat");
    setChats(res.data);
  };

  useEffect(() => {
    fetchChats();
  }, [currentChatId]); // REFRESH WHEN CHAT CHANGES

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
          <p
            key={chat._id}
            onClick={() => onSelectChat(chat._id)}
            className="hover:text-cyan-400 cursor-pointer"
          >
            {chat.messages[0]?.content.slice(0, 25)}...
          </p>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
