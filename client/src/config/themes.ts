/**
 * Theme configuration for Light/Dark × Base × Accent
 * 
 * Base colors: neutral palettes (background/foreground/muted/border/card)
 * Accent themes: primary/ring palettes (primary/primary-foreground)
 */

export type BaseColor = "zinc" | "slate" | "stone" | "gray" | "neutral";
export type AccentTheme = "default" | "blue" | "green" | "orange" | "red" | "rose" | "violet" | "yellow";

export const BASE_COLORS: BaseColor[] = [
  "zinc",
  "slate",
  "stone",
  "gray",
  "neutral",
];

export const ACCENT_THEMES: AccentTheme[] = [
  "default",
  "blue",
  "green",
  "orange",
  "red",
  "rose",
  "violet",
  "yellow",
];

export const THEME_LABELS: Record<BaseColor | AccentTheme, string> = {
  // Base colors
  zinc: "Zinc",
  slate: "Slate",
  stone: "Stone",
  gray: "Gray",
  neutral: "Neutral",
  
  // Accent themes
  default: "Default",
  blue: "Blue",
  green: "Green",
  orange: "Orange",
  red: "Red",
  rose: "Rose",
  violet: "Violet",
  yellow: "Yellow",
};

export interface ThemeConfig {
  base: BaseColor;
  accent: AccentTheme;
  mode: "light" | "dark";
}

export function getThemeClasses(config: ThemeConfig): string {
  const baseClass = config.base === "zinc" ? "" : `base-${config.base}`;
  const accentClass = config.accent === "default" ? "" : `theme-${config.accent}`;
  const darkClass = config.mode === "dark" ? "dark" : "";
  
  return [baseClass, accentClass, darkClass].filter(Boolean).join(" ");
}
