import { useEffect, useRef } from "react";

function ChatWindow({ messages, isThinking }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">

      {messages.map((msg, i) => (
        <div
          key={i}
          className={`max-w-xl px-4 py-2 rounded-lg ${
            msg.role === "user"
              ? "bg-cyan-500 text-black ml-auto"
              : "bg-[#0e1424] text-gray-200"
          }`}
        >
          {msg.content}
        </div>
      ))}

      {/* THINKING INDICATOR */}
      {isThinking && (
  <div className="bg-[#0e1424] text-gray-400 px-4 py-2 rounded-lg w-fit flex items-center gap-2">
    Tenem is typing
    <span className="flex gap-1">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
    </span>
  </div>
)}

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatWindow;