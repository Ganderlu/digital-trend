"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function LiveChatWidget() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Link
      href="/contact"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-105 hover:bg-blue-500 hover:shadow-blue-500/30"
    >
      <div className="relative">
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-blue-600"></span>
      </div>
      <span className="text-lg font-bold">Chat</span>
    </Link>
  );
}
