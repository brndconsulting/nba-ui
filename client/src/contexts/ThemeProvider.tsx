/**
 * Theme Provider - Manages base colors and accent themes
 * 
 * Separate from next-themes (which handles light/dark mode)
 * Applies classes to <html> and persists to localStorage
 * 
 * Storage contract:
 * - ui.base: "base-zinc" | "base-slate" | "base-stone" | "base-gray" | "base-neutral"
 * - ui.accent: "theme-default" | "theme-blue" | ... | "theme-yellow"
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { BASE_COLORS, ACCENT_THEMES, type BaseColor, type AccentTheme } from "@/config/themes";

interface ThemeContextType {
  base: BaseColor;
  accent: AccentTheme;
  setBase: (_base: BaseColor) => void;
  setAccent: (_accent: AccentTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_BASE: BaseColor = "zinc";
const DEFAULT_ACCENT: AccentTheme = "default";

function getStorageBase(): BaseColor {
  if (typeof window === "undefined") return DEFAULT_BASE;
  
  const stored = localStorage.getItem("ui.base");
  if (stored && BASE_COLORS.includes(stored as BaseColor)) {
    return stored as BaseColor;
  }
  
  // Fallback: reset to default
  localStorage.setItem("ui.base", `base-${DEFAULT_BASE}`);
  return DEFAULT_BASE;
}

function getStorageAccent(): AccentTheme {
  if (typeof window === "undefined") return DEFAULT_ACCENT;
  
  const stored = localStorage.getItem("ui.accent");
  if (stored && ACCENT_THEMES.includes(stored as AccentTheme)) {
    return stored as AccentTheme;
  }
  
  // Fallback: reset to default
  localStorage.setItem("ui.accent", `theme-${DEFAULT_ACCENT}`);
  return DEFAULT_ACCENT;
}

function applyThemeClasses(base: BaseColor, accent: AccentTheme) {
  if (typeof document === "undefined") return;
  
  const html = document.documentElement;
  
  // Remove all base-* classes
  BASE_COLORS.forEach((b) => {
    html.classList.remove(`base-${b}`);
  });
  
  // Remove all theme-* classes
  ACCENT_THEMES.forEach((a) => {
    html.classList.remove(`theme-${a}`);
  });
  
  // Apply current base (only if not default)
  if (base !== DEFAULT_BASE) {
    html.classList.add(`base-${base}`);
  }
  
  // Apply current accent (only if not default)
  if (accent !== DEFAULT_ACCENT) {
    html.classList.add(`theme-${accent}`);
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [base, setBaseState] = useState<BaseColor>(DEFAULT_BASE);
  const [accent, setAccentState] = useState<AccentTheme>(DEFAULT_ACCENT);
  const [mounted, setMounted] = useState(false);

  // Hydrate from storage on mount
  useEffect(() => {
    const storedBase = getStorageBase();
    const storedAccent = getStorageAccent();
    
    setBaseState(storedBase);
    setAccentState(storedAccent);
    applyThemeClasses(storedBase, storedAccent);
    setMounted(true);
  }, []);

  const setBase = (newBase: BaseColor) => {
    setBaseState(newBase);
    localStorage.setItem("ui.base", `base-${newBase}`);
    applyThemeClasses(newBase, accent);
  };

  const setAccent = (newAccent: AccentTheme) => {
    setAccentState(newAccent);
    localStorage.setItem("ui.accent", `theme-${newAccent}`);
    applyThemeClasses(base, newAccent);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ base, accent, setBase, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
