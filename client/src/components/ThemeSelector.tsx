/**
 * ThemeSelector - Selector de temas de color shadcn
 * 
 * Diseño exacto como el de shadcn.com:
 * - Botón: "Theme: [nombre]" con chevron
 * - Dropdown: lista limpia de nombres con checkmark en el seleccionado
 * 
 * 100% shadcn/ui components
 */
import { useEffect, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const THEMES = [
  { name: "Blue", value: "" },
  { name: "Green", value: "theme-green" },
  { name: "Neutral", value: "theme-neutral" },
  { name: "Orange", value: "theme-orange" },
  { name: "Red", value: "theme-red" },
  { name: "Rose", value: "theme-rose" },
  { name: "Violet", value: "theme-violet" },
  { name: "Yellow", value: "theme-yellow" },
] as const;

type ThemeValue = typeof THEMES[number]["value"];

const STORAGE_KEY = "sport-insider-color-theme";

export function ThemeSelector() {
  const [theme, setTheme] = useState<ThemeValue>("");

  // Load theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeValue | null;
    if (stored) {
      setTheme(stored);
      applyTheme(stored);
    }
  }, []);

  const applyTheme = (newTheme: ThemeValue) => {
    const root = document.documentElement;
    
    // Remove all theme classes
    THEMES.forEach(t => {
      if (t.value) {
        root.classList.remove(t.value);
      }
    });
    
    // Add new theme class if not default
    if (newTheme) {
      root.classList.add(newTheme);
    }
  };

  const handleThemeChange = (newTheme: ThemeValue) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    
    if (newTheme) {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const currentThemeName = THEMES.find(t => t.value === theme)?.name || "Blue";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 gap-1 px-2 text-sm font-normal">
          <span className="text-muted-foreground">Theme:</span>
          <span>{currentThemeName}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {THEMES.map((t) => (
          <DropdownMenuItem
            key={t.value || "default"}
            onClick={() => handleThemeChange(t.value)}
            className="flex items-center justify-between"
          >
            <span>{t.name}</span>
            {theme === t.value && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
