"use client";

import React, { useEffect, useRef } from "react";

function safeAppendChild(parent: Node | null | undefined, child: Node): boolean {
  if (!parent || !child) return false;
  try {
    if (typeof parent.isConnected === "boolean" && !parent.isConnected) {
      return false;
    }
  } catch {}
  try {
    parent.appendChild(child);
    return true;
  } catch {}
  return false;
}

function safeRemove(el: Element | null | undefined) {
  if (!el) return;
  try {
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  } catch {}
  try {
    el.remove();
  } catch {}
}

function safeClearInner(el: Element | null | undefined) {
  if (!el) return;
  try {
    if (typeof (el as HTMLElement).replaceChildren === "function") {
      (el as HTMLElement).replaceChildren();
      return;
    }
  } catch {}
  try {
    (el as HTMLElement).innerHTML = "";
  } catch {}
}

export function CryptoTicker() {
  const container = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    if (!container.current) return;

    const existingScript = container.current.querySelector("script");
    safeRemove(existingScript);
    const widget = container.current.querySelector(
      ".tradingview-widget-container__widget",
    );
    safeClearInner(widget);

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    try {
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
    } catch {}

    if (safeAppendChild(container.current, script)) {
      loadedRef.current = true;
    }
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
