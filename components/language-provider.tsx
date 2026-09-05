"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const INCLUDED_LANG_CODES = [
  "en",
  "es",
  "fr",
  "de",
  "it",
  "pt",
  "zh-CN",
  "zh-TW",
  "ja",
  "ko",
  "ru",
  "ar",
  "hi",
  "id",
  "vi",
  "th",
  "tr",
  "nl",
  "pl",
  "sv",
  "no",
  "da",
  "fi",
  "he",
  "el",
  "cs",
  "hu",
  "ro",
  "uk",
  "bg",
  "hr",
  "sk",
  "sl",
  "et",
  "lv",
  "lt",
  "ms",
  "tl",
  "bn",
  "ta",
  "te",
  "mr",
  "gu",
  "kn",
  "ml",
  "pa",
  "ur",
  "fa",
  "sw",
  "ha",
  "yo",
  "ig",
  "am",
  "af",
  "is",
  "mt",
  "ga",
  "cy",
  "eu",
  "ca",
  "gl",
  "eo",
  "la",
  "haw",
  "sm",
  "ht",
  "jw",
  "su",
  "ceb",
  "hmn",
  "ku",
  "ky",
  "kk",
  "uz",
  "tg",
  "mn",
  "ka",
  "hy",
  "az",
  "be",
  "mk",
  "sr",
  "bs",
  "sq",
  "lb",
  "fy",
  "nn",
  "mi",
].join(",");

function readSavedLangCode(): string {
  if (typeof window === "undefined") return "en";
  try {
    const v =
      localStorage.getItem("googtrans") ||
      document.cookie
        .split("; ")
        .find((r) => r.startsWith("googtrans="))
        ?.split("=")[1];
    if (v) {
      const parts = decodeURIComponent(v).split("/");
      if (parts[2] && parts[2] !== "en") return parts[2];
    }
  } catch {}
  return "en";
}

const INTRUSIVE_SELECTORS = [
  ".goog-te-banner-frame",
  ".goog-te-banner",
  ".goog-te-balloon-frame",
  'iframe[name="google_translate_iframe"]',
  'iframe[src*="translate.google"]',
  ".goog-te-spinner-pos",
  ".goog-te-spinner",
  ".goog-tooltip",
  ".goog-te-menu-frame",
  ".goog-te-menu2",
  ".goog-te-menu-value",
];

function removeIntrusiveElements() {
  for (const sel of INTRUSIVE_SELECTORS) {
    document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
      try {
        el.remove();
      } catch {}
    });
  }
  try {
    document.body.style.top = "0px";
    document.body.style.marginTop = "0px";
    if (document.documentElement) {
      document.documentElement.style.top = "0px";
    }
  } catch {}
}

export function LanguageProvider() {
  const initedRef = useRef(false);
  const scriptLoadedRef = useRef(false);
  const reapplyTimerRef = useRef<number | undefined>(undefined);
  const cleanupTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (initedRef.current) return;
    initedRef.current = true;

    const getOrCreateTarget = (): HTMLElement => {
      let el = document.getElementById("google_translate_element");
      if (!el) {
        el = document.createElement("div");
        el.id = "google_translate_element";
        el.className = "gt-fallback";
        document.body.appendChild(el);
      } else {
        el.classList.add("gt-fallback");
      }
      return el;
    };

    getOrCreateTarget();

    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: INCLUDED_LANG_CODES,
              layout:
                window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
              multilanguagePage: false,
            },
            "google_translate_element",
          );
        } catch (e) {
          console.error("GT init error:", e);
        }
      }
    };

    if (
      !window.google?.translate &&
      !scriptLoadedRef.current &&
      !document.querySelector('script[src*="translate.google.com"]')
    ) {
      scriptLoadedRef.current = true;
      const s = document.createElement("script");
      s.type = "text/javascript";
      s.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      s.async = true;
      s.onerror = () => {
        scriptLoadedRef.current = false;
      };
      document.head.appendChild(s);
    } else if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit();
    }

    const tryApply = () => {
      const saved = readSavedLangCode();
      if (!saved || saved === "en") return;
      const combo: HTMLSelectElement | null =
        document.querySelector(".goog-te-combo");
      if (combo && combo.value !== saved) {
        try {
          combo.value = saved;
          combo.dispatchEvent(new Event("change", { bubbles: true }));
        } catch {}
      }
    };

    tryApply();

    const reapplyObs = new MutationObserver(() => {
      tryApply();
      removeIntrusiveElements();
    });
    reapplyObs.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    reapplyTimerRef.current = window.setInterval(() => tryApply(), 800);

    cleanupTimerRef.current = window.setInterval(
      () => removeIntrusiveElements(),
      500,
    );
    removeIntrusiveElements();

    const onComboChange = () => {
      const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      const v = combo?.value || "en";
      try {
        localStorage.setItem("googtrans", `/en/${v}`);
      } catch {}
      try {
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);
        document.cookie = `googtrans=/en/${v}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
      } catch {}
      try {
        window.dispatchEvent(new CustomEvent("gt:lang-changed", { detail: v }));
      } catch {}
    };

    const attachComboListener = () => {
      const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      if (combo && !(combo as any).__gtBound) {
        (combo as any).__gtBound = true;
        combo.addEventListener("change", onComboChange);
      }
    };

    const comboObs = new MutationObserver(() => attachComboListener());
    comboObs.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
    attachComboListener();

    return () => {
      reapplyObs.disconnect();
      comboObs.disconnect();
      if (reapplyTimerRef.current != null) {
        window.clearInterval(reapplyTimerRef.current);
      }
      if (cleanupTimerRef.current != null) {
        window.clearInterval(cleanupTimerRef.current);
      }
    };
  }, []);

  return null;
}
