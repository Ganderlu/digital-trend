"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: any;
  }
}

export default function GoogleTranslate({ id = "google_translate_element" }: { id?: string }) {
  const initialized = useRef(false);

  useEffect(() => {
    const initWidget = () => {
      if (initialized.current) return;

      if (
        window.google &&
        window.google.translate &&
        window.google.translate.TranslateElement &&
        document.getElementById(id)
      ) {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              layout:
                window.google.translate.TranslateElement.InlineLayout?.SIMPLE ??
                0,
              autoDisplay: false,
            },
            id
          );
          initialized.current = true;
        } catch (e) {
          console.error("Google Translate init error:", e);
        }
      }
    };

    const checkAndInit = () => {
        if (window.google && window.google.translate) {
            initWidget();
        }
    };

    let script = document.querySelector("#google-translate-script") as HTMLScriptElement;

    if (!script) {
      script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        window.dispatchEvent(new Event("google-translate-ready"));
      };
    } else {
        checkAndInit();
    }

    const handleReady = () => checkAndInit();
    window.addEventListener("google-translate-ready", handleReady);

    // Fallback polling in case event is missed
    const intervalId = setInterval(checkAndInit, 1000);

    return () => {
      window.removeEventListener("google-translate-ready", handleReady);
      clearInterval(intervalId);
    };
  }, [id]);

  return <div id={id} className="google-translate-widget"></div>;
}
