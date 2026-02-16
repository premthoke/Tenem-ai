function ChatWindow({ messages }) {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg w-fit ${
              msg.role === "assistant"
                ? "bg-cyan-500/10"
                : "bg-gray-800 ml-auto"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatWindow;
