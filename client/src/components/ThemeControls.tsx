/**
 * Theme Controls - Selectors for base color and accent theme
 * 
 * 2 shadcn Select components
 * Labels from copy
 * Updates localStorage and applies classes to <html>
 */

import { useTheme } from "@/contexts/ThemeProvider";
import { BASE_COLORS, ACCENT_THEMES, THEME_LABELS, type BaseColor, type AccentTheme } from "@/config/themes";
import { copy } from "@/lib/copy/es";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ThemeControls() {
  const { base, accent, setBase, setAccent } = useTheme();

  return (
    <div className="flex items-center gap-3">
      {/* Base Color Select */}
      <Select value={base} onValueChange={(value) => setBase(value as BaseColor)}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Base" />
        </SelectTrigger>
        <SelectContent>
          {BASE_COLORS.map((b) => (
            <SelectItem key={b} value={b}>
              {THEME_LABELS[b]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Accent Theme Select */}
      <Select value={accent} onValueChange={(value) => setAccent(value as AccentTheme)}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Accent" />
        </SelectTrigger>
        <SelectContent>
          {ACCENT_THEMES.map((a) => (
            <SelectItem key={a} value={a}>
              {THEME_LABELS[a]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
