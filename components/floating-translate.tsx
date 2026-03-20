"use client";

import { Globe } from "lucide-react";
import { useEffect, useState } from "react";
import GoogleTranslate from "./google-translate";

export function FloatingTranslate() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-900 shadow-xl transition-all hover:scale-105 hover:bg-slate-50">
      <div className="relative">
        <Globe className="h-5 w-5 text-emerald-600" />
        <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-blue-400 ring-2 ring-white"></span>
      </div>
      <div className="google-translate-floating-container">
        <GoogleTranslate id="google_translate_element_floating" />
      </div>
    </div>
  );
}
