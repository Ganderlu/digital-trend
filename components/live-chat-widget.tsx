"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    Tawk_API: any;
  }
}

export function LiveChatWidget() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChatOpen = () => {
    if (window.Tawk_API && window.Tawk_API.maximize) {
      window.Tawk_API.maximize();
    } else {
      // Fallback if Tawk isn't loaded yet
      window.location.href = "/contact";
    }
  };

  if (!mounted) return null;

  return (
    <button
      onClick={handleChatOpen}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-105 hover:bg-blue-500 hover:shadow-blue-500/30"
    >
      <div className="relative">
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-blue-600"></span>
      </div>
      <span className="text-lg font-bold">Chat</span>
    </button>
  );
}
