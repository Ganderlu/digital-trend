"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, X } from "lucide-react";

interface NotificationData {
  name: string;
  country: string;
  amount: string;
  time: string;
}

const mockData: NotificationData[] = [
  { name: "Charlotte", country: "UAE", amount: "$250", time: "22 seconds ago" },
  { name: "Liam", country: "USA", amount: "$1,200", time: "1 minute ago" },
  { name: "Sophia", country: "Germany", amount: "$500", time: "5 minutes ago" },
  { name: "Ethan", country: "Canada", amount: "$2,500", time: "12 minutes ago" },
  { name: "Isabella", country: "UK", amount: "$10,000", time: "30 minutes ago" },
  { name: "Noah", country: "Australia", amount: "$750", time: "45 minutes ago" },
  { name: "Emma", country: "France", amount: "$3,200", time: "1 hour ago" },
  { name: "Oliver", country: "Singapore", amount: "$5,000", time: "2 hours ago" },
  { name: "Ava", country: "Japan", amount: "$150", time: "just now" },
  { name: "Lucas", country: "Brazil", amount: "$8,000", time: "3 hours ago" },
  // 7 More proof entries
  { name: "Mia", country: "Switzerland", amount: "$15,000", time: "4 minutes ago" },
  { name: "Alexander", country: "Norway", amount: "$4,200", time: "18 minutes ago" },
  { name: "Zoe", country: "Netherlands", amount: "$900", time: "52 minutes ago" },
  { name: "Jackson", country: "New Zealand", amount: "$1,500", time: "2 hours ago" },
  { name: "Aria", country: "South Africa", amount: "$350", time: "15 seconds ago" },
  { name: "Mateo", country: "Mexico", amount: "$2,800", time: "7 minutes ago" },
  { name: "Elena", country: "Spain", amount: "$6,500", time: "1 hour ago" },
];

export function InvestmentNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<NotificationData | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let nextTimeoutId: NodeJS.Timeout;

    const showRandomNotification = () => {
      const randomIndex = Math.floor(Math.random() * mockData.length);
      setCurrentNotification(mockData[randomIndex]);
      setIsVisible(true);

      // Hide after 6 seconds
      timeoutId = setTimeout(() => {
        setIsVisible(false);
        
        // Show next notification after another random interval (between 15 to 30 seconds)
        const nextInterval = Math.floor(Math.random() * 15000) + 15000;
        nextTimeoutId = setTimeout(showRandomNotification, nextInterval);
      }, 6000);
    };

    // Initial delay of 10 seconds before showing the first notification
    const initialTimeout = setTimeout(showRandomNotification, 10000);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(timeoutId);
      clearTimeout(nextTimeoutId);
    };
  }, []);

  if (!currentNotification) return null;

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 transition-all duration-700 transform ${
        isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-12 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="relative flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/90 p-4 pr-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-md sm:min-w-[320px] transition-colors duration-300">
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-2 top-2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-emerald-600"
        >
          <X size={14} />
        </button>

        {/* Icon Container - Using project's emerald color */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <p className="text-sm font-bold text-slate-900">
            {currentNotification.name} from {currentNotification.country}
          </p>
          <p className="mt-0.5 text-sm text-slate-600">
            just invested <span className="font-bold text-emerald-600">{currentNotification.amount}</span>
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            {currentNotification.time}
          </p>
        </div>
      </div>
    </div>
  );
}
