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

export function LiveTradeChart() {
  const container = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    if (!container.current) return;

    const widget = container.current.querySelector(
      ".tradingview-widget-container__widget",
    );
    safeClearInner(widget);
    const existingScript = container.current.querySelector("script");
    safeRemove(existingScript);

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    try {
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
        support_host: "https://www.tradingview.com",
      });
    } catch {}

    if (safeAppendChild(container.current, script)) {
      loadedRef.current = true;
    }
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto my-16 overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-2xl transition-all duration-300">
      <div className="bg-gradient-to-r from-[#22c55e] via-[#2563eb] to-[#06b6d4] py-6 flex items-center justify-center">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-[0.2em] uppercase">
          Live Trade
        </h2>
      </div>

      <div className="tradingview-widget-container" ref={container}>
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
}
