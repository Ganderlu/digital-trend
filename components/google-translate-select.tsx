"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, ChevronDown, Search, CheckCircle2 } from "lucide-react";

type TLang = {
  code: string;
  label: string;
  flag: string;
};

const TOP_LANGS: TLang[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "zh-CN", label: "简体中文", flag: "🇨🇳" },
  { code: "zh-TW", label: "繁體中文", flag: "🇭🇰" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "id", label: "Bahasa", flag: "🇮🇩" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "th", label: "ไทย", flag: "🇹🇭" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
  { code: "sv", label: "Svenska", flag: "🇸🇪" },
  { code: "no", label: "Norsk", flag: "🇳🇴" },
  { code: "da", label: "Dansk", flag: "🇩🇰" },
  { code: "fi", label: "Suomi", flag: "🇫🇮" },
  { code: "he", label: "עברית", flag: "🇮🇱" },
  { code: "el", label: "Ελληνικά", flag: "🇬🇷" },
  { code: "cs", label: "Čeština", flag: "🇨🇿" },
  { code: "hu", label: "Magyar", flag: "🇭🇺" },
  { code: "ro", label: "Română", flag: "🇷🇴" },
  { code: "uk", label: "Українська", flag: "🇺🇦" },
  { code: "bg", label: "Български", flag: "🇧🇬" },
  { code: "hr", label: "Hrvatski", flag: "🇭🇷" },
  { code: "sk", label: "Slovenčina", flag: "🇸🇰" },
  { code: "sl", label: "Slovenščina", flag: "🇸🇮" },
  { code: "et", label: "Eesti", flag: "🇪🇪" },
  { code: "lv", label: "Latviešu", flag: "🇱🇻" },
  { code: "lt", label: "Lietuvių", flag: "🇱🇹" },
  { code: "ms", label: "Melayu", flag: "🇲🇾" },
  { code: "tl", label: "Filipino", flag: "🇵🇭" },
  { code: "bn", label: "বাংলা", flag: "🇧🇩" },
  { code: "ta", label: "தமிழ்", flag: "🇮🇳" },
  { code: "te", label: "తెలుగు", flag: "🇮🇳" },
  { code: "mr", label: "मराठी", flag: "🇮🇳" },
  { code: "gu", label: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn", label: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", label: "മലയാളം", flag: "🇮🇳" },
  { code: "pa", label: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "ur", label: "اردو", flag: "🇵🇰" },
  { code: "fa", label: "فارسی", flag: "🇮🇷" },
  { code: "sw", label: "Kiswahili", flag: "🇰🇪" },
  { code: "ha", label: "Hausa", flag: "🇳🇬" },
  { code: "yo", label: "Yorùbá", flag: "🇳🇬" },
  { code: "ig", label: "Igbo", flag: "🇳🇬" },
  { code: "am", label: "አማርኛ", flag: "🇪🇹" },
  { code: "af", label: "Afrikaans", flag: "🇿🇦" },
  { code: "is", label: "Íslenska", flag: "🇮🇸" },
  { code: "mt", label: "Malti", flag: "🇲🇹" },
  { code: "ga", label: "Gaeilge", flag: "🇮🇪" },
  { code: "cy", label: "Cymraeg", flag: "🏴" },
  { code: "eu", label: "Euskara", flag: "🇪🇸" },
  { code: "ca", label: "Català", flag: "🇪🇸" },
  { code: "gl", label: "Galego", flag: "🇪🇸" },
  { code: "eo", label: "Esperanto", flag: "🌍" },
  { code: "la", label: "Latina", flag: "🏛️" },
  { code: "haw", label: "ʻŌlelo Hawaiʻi", flag: "🌺" },
  { code: "sm", label: "Gagana Sāmoa", flag: "🇼🇸" },
  { code: "ht", label: "Kreyòl Ayisyen", flag: "🇭🇹" },
  { code: "jw", label: "Jawa", flag: "🇮🇩" },
  { code: "su", label: "Basa Sunda", flag: "🇮🇩" },
  { code: "ceb", label: "Cebuano", flag: "🇵🇭" },
  { code: "hmn", label: "Hmoob", flag: "🇱🇦" },
  { code: "ku", label: "Kurdî", flag: "🇰🇺" },
  { code: "ky", label: "Кыргызча", flag: "🇰🇬" },
  { code: "kk", label: "Қазақ", flag: "🇰🇿" },
  { code: "uz", label: "Oʻzbek", flag: "🇺🇿" },
  { code: "tg", label: "Тоҷикӣ", flag: "🇹🇯" },
  { code: "mn", label: "Монгол", flag: "🇲🇳" },
  { code: "ka", label: "ქართული", flag: "🇬🇪" },
  { code: "hy", label: "Հայերեն", flag: "🇦🇲" },
  { code: "az", label: "Azərbaycanca", flag: "🇦🇿" },
  { code: "be", label: "Беларуская", flag: "🇧🇾" },
  { code: "mk", label: "Македонски", flag: "🇲🇰" },
  { code: "sr", label: "Српски", flag: "🇷🇸" },
  { code: "bs", label: "Bosanski", flag: "🇧🇦" },
  { code: "sq", label: "Shqip", flag: "🇦🇱" },
  { code: "lb", label: "Lëtzebuergesch", flag: "🇱🇺" },
  { code: "fy", label: "Frysk", flag: "🇳🇱" },
  { code: "nn", label: "Nynorsk", flag: "🇳🇴" },
  { code: "mi", label: "Māori", flag: "🇳🇿" },
];

function getLangMeta(code: string): TLang {
  const found = TOP_LANGS.find((l) => l.code === code);
  if (found) return found;
  const prefix = code.split("-")[0];
  const normalized = TOP_LANGS.find((l) => l.code.startsWith(prefix));
  return normalized ?? { code, label: code.toUpperCase(), flag: "🌐" };
}

export function readSavedLangCode(): string {
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
      if (parts[2]) return parts[2];
    }
  } catch {}
  return "en";
}

function persistLang(code: string) {
  try {
    localStorage.setItem("googtrans", `/en/${code}`);
  } catch {}
  try {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `googtrans=/en/${code}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  } catch {}
}

function tryApplyOnCombo(code: string) {
  if (typeof document === "undefined") return;
  const combo: HTMLSelectElement | null =
    document.querySelector(".goog-te-combo");
  if (combo && combo.value !== code) {
    try {
      combo.value = code;
      combo.dispatchEvent(new Event("change", { bubbles: true }));
    } catch {}
  }
}

export function GoogleTranslateSelect({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [current, setCurrent] = useState<string>("en");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onComboChange = () => {
      const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      const v = combo?.value || "en";
      setCurrent(v);
    };

    const waitCombo = () => {
      const combo: HTMLSelectElement | null =
        document.querySelector(".goog-te-combo");
      if (combo) {
        if (!(combo as any).__gtSelectBound) {
          (combo as any).__gtSelectBound = true;
          combo.addEventListener("change", onComboChange);
        }
        const saved = readSavedLangCode();
        if (saved && combo.value !== saved) {
          tryApplyOnCombo(saved);
          setCurrent(saved);
        } else {
          setCurrent(combo.value || "en");
        }
      }
    };

    waitCombo();
    const obs = new MutationObserver(() => waitCombo());
    obs.observe(document.documentElement, { childList: true, subtree: true });

    const storageListener = () => {
      const c = readSavedLangCode();
      setCurrent(c);
      tryApplyOnCombo(c);
    };
    window.addEventListener("storage", storageListener);

    const onLangChanged = (e: Event) => {
      const code = (e as CustomEvent<string>).detail;
      if (code) setCurrent(code);
    };
    window.addEventListener("gt:lang-changed", onLangChanged as any);

    const onClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);

    return () => {
      obs.disconnect();
      window.removeEventListener("storage", storageListener);
      window.removeEventListener("gt:lang-changed", onLangChanged as any);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  const applyLang = (code: string) => {
    persistLang(code);
    tryApplyOnCombo(code);
    setCurrent(code);
    setOpen(false);
    try {
      window.dispatchEvent(
        new CustomEvent("gt:lang-changed", { detail: code }),
      );
    } catch {}
  };

  const meta = getLangMeta(current);
  const filtered = TOP_LANGS.filter(
    (l) =>
      search.trim() === "" ||
      l.label.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div ref={wrapperRef} className="relative language-select-root z-[50]">
      <style jsx global>{`
        .language-select-root .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .language-select-root .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .language-select-root .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.2);
          border-radius: 9999px;
        }
        .language-select-root .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.4);
        }
      `}</style>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Select Language"
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`group flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur px-3.5 py-2 text-slate-200 transition-all hover:border-emerald-500/30 hover:bg-white/10 hover:text-white h-10 ${
          compact ? "px-2.5" : ""
        }`}
      >
        {compact ? (
          <>
            {current !== "en" ? (
              <span className="text-[14px] leading-none shrink-0">{meta.flag}</span>
            ) : (
              <Globe className="h-4.5 w-4.5 text-slate-400 group-hover:text-emerald-400" />
            )}
            <ChevronDown
              className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                open ? "rotate-180 text-emerald-400" : ""
              }`}
            />
          </>
        ) : (
          <>
            {current !== "en" ? (
              <span className="text-[14px] leading-none shrink-0 w-6 text-center">{meta.flag}</span>
            ) : (
              <Globe className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-emerald-400" />
            )}
            <span className="text-[12.5px] font-semibold tabular-nums text-slate-300 group-hover:text-white">
              {current !== "en" ? meta.label : "Select Language"}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                open ? "rotate-180 text-emerald-400" : ""
              }`}
            />
          </>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-[80] w-[320px] origin-top-right rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-black/40 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
            <Globe className="h-4 w-4 text-emerald-400 shrink-0" />
            <div className="flex-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                Select Language
              </p>
              <p className="text-[11px] text-slate-400">
                Powered by Google Translate
              </p>
            </div>
          </div>
          <div className="px-3 py-2 border-b border-white/5">
            <div className="relative">
              <Search
                className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
                aria-hidden
              />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search language..."
                className="w-full rounded-lg border border-white/10 bg-slate-950/60 pl-8 pr-3 py-2 text-[12.5px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/40 focus:bg-slate-950"
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-3 py-2 bg-slate-950/40 border-b border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 shrink-0 pr-2">
              Default
            </span>
            <button
              type="button"
              onClick={() => applyLang("en")}
              className={`flex flex-1 items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition ${
                current === "en"
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25"
                  : "text-slate-300 hover:bg-white/5"
              }`}
            >
              <span className="text-[13px]">🇺🇸</span>
              <span className="flex-1 text-left">English</span>
              {current === "en" && (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              )}
            </button>
          </div>

          <div className="max-h-[320px] overflow-y-auto px-2 py-1.5 custom-scrollbar">
            {filtered.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-xs text-slate-500">No languages found.</p>
              </div>
            )}
            {filtered
              .filter((l) => l.code !== "en")
              .map((lang) => {
                const active = current === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => applyLang(lang.code)}
                    className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition ${
                      active
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "text-slate-200 hover:bg-white/5"
                    }`}
                  >
                    <span className="text-[15px] leading-none shrink-0 w-6 text-center">
                      {lang.flag}
                    </span>
                    <span className="flex-1 text-[12.5px] font-medium truncate">
                      {lang.label}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-slate-500 shrink-0">
                      {lang.code}
                    </span>
                    {active && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
          </div>

          <div className="flex items-center justify-between border-t border-white/5 px-4 py-2.5 bg-slate-950/50">
            <p className="text-[10px] text-slate-500">
              {TOP_LANGS.length} languages supported — currently:&nbsp;
              <span className="font-semibold text-slate-400">
                {meta.flag} {meta.label}
              </span>
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[11px] font-semibold text-slate-400 hover:text-white transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
