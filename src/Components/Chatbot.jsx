import React, { useState } from "react";
import { FiMessageCircle, FiX } from "react-icons/fi";

const Chatbot = ({ isOpen, toggleChatbot }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      // Placeholder for sending message to chatbot logic
      // setTimeout(() => {
      //   setMessages(prev => [...prev, { text: 'This is a placeholder response.', sender: 'bot' }]);
      // }, 500);
    }
  };

  return (
    <div
      className={`fixed bottom-6 right-6 w-80 h-96 bg-[#1E1E1E] rounded-lg shadow-lg flex flex-col transition-transform ${
        isOpen ? "translate-y-0" : "translate-y-[400px]"
      } z-50`}
    >
      <div className="flex justify-between items-center p-3 bg-[#2A2A2A] rounded-t-lg">
        <h3 className="text-white font-semibold">Chatbot</h3>
        <button
          onClick={toggleChatbot}
          className="text-gray-400 hover:text-white"
        >
          <FiX size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-2 rounded-lg max-w-[80%] ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-[#2A2A2A] text-gray-300"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 bg-[#2A2A2A] rounded-b-lg flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-[#1E1E1E] text-white text-sm rounded-l-lg py-2 px-3 focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white rounded-r-lg py-2 px-4 hover:bg-blue-700 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
