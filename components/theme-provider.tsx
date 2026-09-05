"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  isLandingPage,
}: {
  children: React.ReactNode;
  isLandingPage: boolean;
}) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    if (!isLandingPage) return;
    const stored = localStorage.getItem("voltsq-theme") as Theme | null;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    }
  }, [isLandingPage]);

  useEffect(() => {
    if (!isLandingPage) return;
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem("voltsq-theme", theme);
  }, [theme, isLandingPage]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
