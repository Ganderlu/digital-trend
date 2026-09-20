"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Tawk_API: any;
    Tawk_LoadStart: any;
  }
}

function safeInsertScriptBeforeAnchor(
  script: HTMLScriptElement,
  anchor: Element | null,
): boolean {
  if (!script) return false;
  if (!anchor || !anchor.parentNode) {
    const target =
      document.documentElement?.lastElementChild?.nodeName === "BODY"
        ? document.body
        : document.head || document.body || document.documentElement;
    if (target) {
      try {
        target.appendChild(script);
        return true;
      } catch {}
    }
    return false;
  }
  const parent = anchor.parentNode;
  if (parent.contains(anchor) && anchor.parentNode === parent) {
    try {
      parent.insertBefore(script, anchor);
      return true;
    } catch {}
  }
  try {
    if (document.head) {
      document.head.appendChild(script);
      return true;
    }
  } catch {}
  try {
    if (document.body) {
      document.body.appendChild(script);
      return true;
    }
  } catch {}
  return false;
}

export function TawkChat() {
  const loadedRef = useRef(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (loadedRef.current) return;
    loadedRef.current = true;

    try {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();

      window.Tawk_API.onLoad = function () {
        try {
          window.Tawk_API.hideWidget();
        } catch {}
      };
    } catch {}

    let cancelled = false;

    const inject = () => {
      if (cancelled) return;
      const s1 = document.createElement("script");
      s1.async = true;
      s1.src = "https://embed.tawk.to/69a3df0eaa21361c33484499/1jik1ukku";
      s1.charset = "UTF-8";
      try {
        s1.setAttribute("crossorigin", "*");
      } catch {}
      let s0: Element | null = null;
      try {
        s0 = document.getElementsByTagName("script")[0] || null;
      } catch {
        s0 = null;
      }
      safeInsertScriptBeforeAnchor(s1, s0);
    };

    if (document.readyState === "loading") {
      const onReady = () => inject();
      try {
        document.addEventListener("DOMContentLoaded", onReady, { once: true });
      } catch {
        onReady();
      }
      return () => {
        cancelled = true;
        try {
          document.removeEventListener("DOMContentLoaded", onReady);
        } catch {}
      };
    } else {
      inject();
    }
  }, []);

  return null;
}
