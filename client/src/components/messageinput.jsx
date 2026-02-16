import { useState } from "react";

function MessageInput({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    onSend(input);
    setInput("");
  };

  return (
    <div className="p-4 border-t border-cyan-500/20">
      <div className="max-w-3xl mx-auto flex gap-2">
        <input
          type="text"
          placeholder="Ask Tenem anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-[#0e1424] border border-cyan-500/20 outline-none"
        />
        <button
          onClick={handleSend}
          className="px-4 bg-cyan-500/20 border border-cyan-400 rounded-lg hover:bg-cyan-500/40"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default MessageInput;
