"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    Tawk_API: any;
    Tawk_LoadStart: any;
  }
}

export function TawkChat() {
  useEffect(() => {
    // Hide the default Tawk.to bubble so we can use our custom one
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    
    // Config to hide the default bubble
    window.Tawk_API.onLoad = function() {
      window.Tawk_API.hideWidget();
    };

    (function() {
      const s1 = document.createElement("script");
      const s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = "https://embed.tawk.to/69a3df0eaa21361c33484499/1jik1ukku";
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      if (s0 && s0.parentNode) {
        s0.parentNode.insertBefore(s1, s0);
      }
    })();
  }, []);

  return null;
}
