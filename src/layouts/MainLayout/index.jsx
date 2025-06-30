import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import NotificationRing from "../../Components/NotificationRing";
import Chatbot from "../../Components/Chatbot";
import { FiMessageCircle } from "react-icons/fi";
import UserInfo from "../../components/UserInfo.jsx";

export default function MainLayout() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isDashboard =
    location.pathname === "/" || location.pathname === "/dashboard";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log(
      "MainLayout useEffect: storedUser from localStorage",
      storedUser
    );
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log(
          "MainLayout useEffect: Parsed user set to state",
          parsedUser
        );
      } catch (e) {
        console.error("Failed to parse user from localStorage:", e);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      console.log(
        "MainLayout useEffect: No user found in localStorage, redirecting to login."
      );
      navigate("/login");
    }
  }, [navigate]);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      {/* Mobile Header (always at top, outside sidebar) */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#1a1a1a]">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white focus:outline-none"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <NotificationRing />
        <UserInfo user={user} />
      </div>
      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex">
          <div className="w-64 bg-[#1a1a1a] h-full p-4">
            <Navbar className="relative h-full w-full" mobile />
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
      {/* Desktop Layout */}
      <div className="flex min-h-0 flex-1 w-full">
        {/* Sidebar (desktop only) */}
        <div className="hidden md:block">
          <Navbar />
        </div>
        {/* Main Area */}
        <div className="w-full px-0 sm:px-4 md:px-8 flex-1 flex flex-col md:ml-64 min-h-0">
          {/* Header (desktop only) */}
          <header className="hidden md:flex sticky top-0 w-full z-40 justify-end items-center bg-[#121212] gap-6 p-4">
            <NotificationRing />
            <UserInfo user={user} />
          </header>
          <main className="flex-1 p-4 md:p-8 min-h-0 h-screen overflow-auto pt-0 md:pt-16">
            <Outlet />
          </main>
        </div>
      </div>
      {/* Chatbot Button (always visible) */}
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
