"use client";

import React, { useEffect, useRef } from "react";

export function CryptoTicker() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    // Remove existing script and widget if it exists
    const existingScript = container.current.querySelector("script");
    if (existingScript) {
      existingScript.remove();
    }
    const widget = container.current.querySelector(
      ".tradingview-widget-container__widget",
    );
    if (widget) {
      widget.innerHTML = "";
    }

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        {
          proName: "BITSTAMP:BTCUSD",
          title: "Bitcoin",
        },
        {
          proName: "BITSTAMP:ETHUSD",
          title: "Ethereum",
        },
        {
          description: "Solana",
          proName: "BINANCE:SOLUSD",
        },
        {
          description: "BNB",
          proName: "BINANCE:BNBUSD",
        },
        {
          description: "XRP",
          proName: "BITSTAMP:XRPUSD",
        },
        {
          description: "Cardano",
          proName: "BINANCE:ADAUSD",
        },
      ],
      showSymbolLogo: true,
      colorTheme: "light",
      isTransparent: true,
      displayMode: "adaptive",
      locale: "en",
    });

    container.current.appendChild(script);
  }, []);

  return (
    <div
      className="w-full bg-white transition-colors duration-300"
      ref={container}
    >
      <div className="tradingview-widget-container">
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
}
