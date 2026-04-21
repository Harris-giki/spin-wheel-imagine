"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type Ctx = { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void };

const ThemeCtx = createContext<Ctx | null>(null);

/**
 * Inline script string: runs synchronously in <head> BEFORE React hydrates,
 * so the first paint already has the correct theme class and we never flash
 * the opposite mode. Reads localStorage first, falls back to system preference.
 */
export const THEME_BOOTSTRAP_SCRIPT = `
(function() {
  try {
    // Dark mode is the brand default. Honor an explicit user override from
    // localStorage; otherwise always start in dark regardless of OS setting.
    var s = localStorage.getItem('ia-theme');
    var t = s === 'light' ? 'light' : 'dark';
    if (t === 'dark') document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = t;
  } catch (e) {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  }
})();
`;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  // Sync state with whatever the bootstrap script set on the <html> element.
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setThemeState(isDark ? "dark" : "light");
  }, []);

  const applyTheme = useCallback((t: Theme) => {
    const root = document.documentElement;
    if (t === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    root.style.colorScheme = t;
    try {
      localStorage.setItem("ia-theme", t);
    } catch {
      // ignore
    }
    setThemeState(t);
  }, []);

  const toggle = useCallback(() => {
    applyTheme(theme === "dark" ? "light" : "dark");
  }, [theme, applyTheme]);

  return (
    <ThemeCtx.Provider value={{ theme, toggle, setTheme: applyTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={
        "relative inline-flex items-center justify-center w-10 h-10 rounded-full " +
        "bg-white/70 dark:bg-white/10 border border-ink-100 dark:border-white/10 " +
        "text-ink-900 dark:text-white transition hover:bg-white dark:hover:bg-white/20 " +
        "shadow-sm " +
        className
      }
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={"w-5 h-5 transition-transform " + (isDark ? "rotate-0" : "-rotate-90")}
      >
        {isDark ? (
          // Sun icon
          <g>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </g>
        ) : (
          // Moon icon
          <path d="M21 12.8A9 9 0 0 1 11.2 3a7 7 0 1 0 9.8 9.8z" fill="currentColor" />
        )}
      </svg>
    </button>
  );
}
