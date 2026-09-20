"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

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

function removeIntrusiveElements() {
  if (typeof document === "undefined") return;
  for (const sel of INTRUSIVE_SELECTORS) {
    let nodes: NodeListOf<HTMLElement> | undefined;
    try {
      nodes = document.querySelectorAll<HTMLElement>(sel);
    } catch {
      continue;
    }
    if (!nodes || nodes.length === 0) continue;
    nodes.forEach((el) => safeRemove(el));
  }
  try {
    if (document.body) {
      document.body.style.top = "0px";
      document.body.style.marginTop = "0px";
    }
    if (document.documentElement) {
      document.documentElement.style.top = "0px";
    }
  } catch {}
}

function getOrCreateTarget(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  try {
    let el = document.getElementById("google_translate_element");
    if (!el) {
      el = document.createElement("div");
      el.id = "google_translate_element";
      el.className = "gt-fallback";
      if (document.body) {
        document.body.appendChild(el);
      }
    } else {
      el.classList.add("gt-fallback");
    }
    return el;
  } catch {
    return null;
  }
}

function clearTargetChildren(target: HTMLElement) {
  try {
    if (!target) return;
    if (typeof target.replaceChildren === "function") {
      target.replaceChildren();
      return;
    }
  } catch {}
  try {
    target.textContent = "";
  } catch {}
  try {
    target.innerHTML = "";
  } catch {}
  try {
    while (target.lastChild) {
      const last = target.lastChild;
      if (!last || !target.contains(last) || last.parentNode !== target) break;
      target.removeChild(last);
    }
  } catch {}
}

function initGoogleTranslateElement() {
  getOrCreateTarget();
  if (window.google?.translate?.TranslateElement) {
    try {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: INCLUDED_LANG_CODES,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
          multilanguagePage: false,
        },
        "google_translate_element",
      );
    } catch (e) {
      console.error("GT init error:", e);
    }
  }
}

function tryApplySaved() {
  if (typeof document === "undefined") return;
  const saved = readSavedLangCode();
  if (!saved || saved === "en") return;
  let combo: HTMLSelectElement | null = null;
  try {
    combo = document.querySelector(".goog-te-combo");
  } catch {}
  if (combo && combo.value !== saved) {
    try {
      combo.value = saved;
      combo.dispatchEvent(new Event("change", { bubbles: true }));
    } catch {}
  }
}

export function LanguageProvider() {
  const pathname = usePathname();
  const scriptLoadedRef = useRef(false);
  const reapplyTimerRef = useRef<number | undefined>(undefined);
  const cleanupTimerRef = useRef<number | undefined>(undefined);
  const reapplyObsRef = useRef<MutationObserver | undefined>(undefined);
  const comboObsRef = useRef<MutationObserver | undefined>(undefined);
  const firstMountRef = useRef(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    getOrCreateTarget();

    try {
      window.googleTranslateElementInit = () => {
        initGoogleTranslateElement();
        tryApplySaved();
      };
    } catch {}

    try {
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
        if (document.head) {
          document.head.appendChild(s);
        }
      } else if (window.google?.translate?.TranslateElement) {
        window.googleTranslateElementInit?.();
      }
    } catch {}

    if (firstMountRef.current) {
      let target: HTMLElement | null = null;
      try {
        target = document.getElementById("google_translate_element");
      } catch {}
      if (target) {
        clearTargetChildren(target);
      }
      try {
        window.googleTranslateElementInit?.();
      } catch {}
      tryApplySaved();
    }
    firstMountRef.current = true;

    removeIntrusiveElements();
    tryApplySaved();

    if (!reapplyObsRef.current && document.documentElement) {
      try {
        const reapplyObs = new MutationObserver(() => {
          tryApplySaved();
          removeIntrusiveElements();
        });
        reapplyObs.observe(document.documentElement, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["style", "class"],
        });
        reapplyObsRef.current = reapplyObs;
      } catch {}
    }

    if (reapplyTimerRef.current == null) {
      reapplyTimerRef.current = window.setInterval(() => tryApplySaved(), 800);
    }

    if (cleanupTimerRef.current == null) {
      cleanupTimerRef.current = window.setInterval(
        () => removeIntrusiveElements(),
        500,
      );
    }

    const onComboChange = () => {
      if (typeof document === "undefined") return;
      let combo: HTMLSelectElement | null = null;
      try {
        combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      } catch {}
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
      if (typeof document === "undefined") return;
      let combo: HTMLSelectElement | null = null;
      try {
        combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      } catch {}
      if (combo && !(combo as any).__gtProviderBound) {
        try {
          (combo as any).__gtProviderBound = true;
          combo.addEventListener("change", onComboChange);
        } catch {}
      }
    };

    if (!comboObsRef.current && document.documentElement) {
      try {
        const comboObs = new MutationObserver(() => attachComboListener());
        comboObs.observe(document.documentElement, {
          childList: true,
          subtree: true,
        });
        comboObsRef.current = comboObs;
      } catch {}
    }
    attachComboListener();

    removeIntrusiveElements();
  }, [pathname]);

  useEffect(() => {
    return () => {
      try {
        reapplyObsRef.current?.disconnect();
      } catch {}
      try {
        comboObsRef.current?.disconnect();
      } catch {}
      if (reapplyTimerRef.current != null) {
        try {
          window.clearInterval(reapplyTimerRef.current);
        } catch {}
        reapplyTimerRef.current = undefined;
      }
      if (cleanupTimerRef.current != null) {
        try {
          window.clearInterval(cleanupTimerRef.current);
        } catch {}
        cleanupTimerRef.current = undefined;
      }
      try {
        delete (window as any).googleTranslateElementInit;
      } catch {}
    };
  }, []);

  return null;
}
