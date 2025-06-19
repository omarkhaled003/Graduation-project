import React, { useState } from "react";
import { FiMessageCircle, FiX } from "react-icons/fi";
import axios from "axios";

export default function Chatbot({ isOpen, toggleChatbot }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => {
    // Generate a unique session ID when the component mounts
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  });

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = input.trim();
      setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
      setInput("");
      setIsLoading(true);

      try {
        // Get user token from localStorage
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;

        if (!token) {
          throw new Error("No authentication token found");
        }

        console.log("Sending request:", {
          message: userMessage,
          sessionId: sessionId,
        });

        const response = await axios.post(
          "/api/AiChat/chat",
          {
            message: userMessage,
            sessionId: sessionId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Response:", response.data);

        // Handle the response object that contains reply and history
        const botReply = response.data.reply || response.data;
        setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
      } catch (error) {
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        setMessages((prev) => [
          ...prev,
          {
            text:
              error.message === "No authentication token found"
                ? "Please login to use the chatbot."
                : "Sorry, I couldn't process your request. Please try again.",
            sender: "bot",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend(); // Call handleSend on form submission
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-[#1E1E1E] rounded-lg shadow-xl flex flex-col z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-white font-semibold">Chat Support</h3>
            <button
              onClick={toggleChatbot}
              className="text-gray-400 hover:text-white"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4">
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
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-2 rounded-lg bg-[#2A2A2A] text-gray-300">
                  Typing...
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-gray-700"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-[#2A2A2A] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={toggleChatbot}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="Open Chatbot"
      >
        <FiMessageCircle className="w-6 h-6" />
      </button>
    </>
  );
}
