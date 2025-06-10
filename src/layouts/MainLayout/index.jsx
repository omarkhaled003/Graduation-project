import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import UserInfo from "../../Components/UserInfo";
import NotificationRing from "../../Components/NotificationRing";
import Chatbot from "../../Components/Chatbot";
import { FiMessageCircle } from "react-icons/fi";

export default function MainLayout() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage:", e);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      // If no user in localStorage, redirect to login
      navigate("/login");
    }
  }, [navigate]);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <div className="flex min-h-screen bg-[#121212]">
      <Navbar />
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header Bar */}
        <header className="fixed top-0 right-0 left-64 z-40 flex justify-end items-center bg-[#121212] gap-6 p-4">
          <NotificationRing />
          <UserInfo user={user} />
        </header>
        <main className="flex-1 p-8 min-h-0 h-screen overflow-auto pt-16">
          <Outlet />
        </main>
      </div>

      {/* Chatbot Button */}
      <button
        onClick={toggleChatbot}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="Open Chatbot"
      >
        <FiMessageCircle className="w-6 h-6" />
      </button>

      {/* Chatbot Component */}
      <Chatbot isOpen={isChatbotOpen} toggleChatbot={toggleChatbot} />
    </div>
  );
}
