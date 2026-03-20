"use client";

import React, { useEffect, useRef } from "react";

export function LiveTradeChart() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    // Clear previous widget if any
    const widget = container.current.querySelector(".tradingview-widget-container__widget");
    if (widget) {
      widget.innerHTML = "";
    }
    const existingScript = container.current.querySelector("script");
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: 600,
      symbol: "BINANCE:BTCUSDT",
      interval: "D",
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com"
    });

    container.current.appendChild(script);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto my-16 overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-2xl transition-all duration-300">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-[#22c55e] via-[#2563eb] to-[#06b6d4] py-6 flex items-center justify-center">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-[0.2em] uppercase">
          Live Trade
        </h2>
      </div>
      
      {/* TradingView Widget Container */}
      <div className="tradingview-widget-container" ref={container}>
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
}
