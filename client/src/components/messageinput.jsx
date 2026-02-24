import { useState } from "react";

function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-cyan-500/20 flex gap-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message Tenem..."
        className="flex-1 bg-[#0e1424] text-white p-3 rounded resize-none outline-none"
        rows={1}
      />

      <button
        onClick={handleSend}
        className="bg-cyan-500 px-4 py-2 rounded text-black hover:bg-cyan-400"
      >
        Send
      </button>
    </div>
  );
}

export default MessageInput;