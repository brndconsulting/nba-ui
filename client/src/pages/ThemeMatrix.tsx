/**
 * Theme Matrix - Visual validation of all theme combinations
 * 
 * Renders Light/Dark × Base(5) × Accent(8) = 80 combinations
 * Each cell is scoped with CSS classes to test contrast, focus, hover, borders
 * 
 * Only available in development mode
 */

import * as React from "react";
import { BASE_COLORS, ACCENT_THEMES, THEME_LABELS, getThemeClasses } from "@/config/themes";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";

type Mode = "light" | "dark";

function ThemeScope({
  base,
  accent,
  mode,
  children,
}: {
  base: string;
  accent: string;
  mode: Mode;
  children: React.ReactNode;
}) {
  const themeClasses = getThemeClasses({
    base: base as any,
    accent: accent as any,
    mode,
  });

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-background text-foreground p-3 space-y-2",
        themeClasses
      )}
    >
      {children}
    </div>
  );
}

function StateBlock({ title }: { title: string }) {
  return (
    <div className="space-y-2">
      {/* Skeleton (sin números) */}
      <div className="space-y-1">
        <div className="text-xs font-medium text-muted-foreground">{title}</div>
        <Skeleton className="h-3 w-3/5" />
        <Skeleton className="h-3 w-4/5" />
      </div>

      {/* EmptyState */}
      <Alert className="p-2">
        <AlertTitle className="text-xs">EmptyState</AlertTitle>
        <AlertDescription className="text-xs text-muted-foreground">
          Sin datos
        </AlertDescription>
      </Alert>

      {/* ErrorState */}
      <Alert variant="destructive" className="p-2">
        <AlertCircle className="h-3 w-3" />
        <AlertTitle className="text-xs">Error</AlertTitle>
        <AlertDescription className="text-xs">
          Validado por envelope
        </AlertDescription>
      </Alert>

      {/* Controles */}
      <div className="flex flex-wrap items-center gap-1">
        <Button size="sm" variant="default" className="text-xs h-7">
          Acción
        </Button>
        <Button size="sm" variant="secondary" className="text-xs h-7">
          Sec
        </Button>
        <Button size="sm" variant="outline" className="text-xs h-7">
          Out
        </Button>
        <Input className="h-7 w-24 text-xs" placeholder="Input" />
        <Badge variant="secondary" className="text-xs">Badge</Badge>
      </div>
    </div>
  );
}

export default function ThemeMatrix() {
  // Bloqueo prod
  const isDev =
    (typeof import.meta !== "undefined" && (import.meta as any).env?.DEV) ||
    (typeof process !== "undefined" && process.env?.NODE_ENV !== "production");

  if (!isDev) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not available</AlertTitle>
          <AlertDescription>
            Esta ruta existe solo para validación visual en desarrollo.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const modes: Mode[] = ["light", "dark"];

  return (
    <div className="p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Theme Matrix</h1>
        <p className="text-sm text-muted-foreground">
          Validación obligatoria: contraste, bordes, hover, focus en Light/Dark × Base(5) × Accent(8)
        </p>
      </div>

      {modes.map((mode) => (
        <div key={mode} className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="capitalize text-sm">
              {mode}
            </Badge>
            <p className="text-sm text-muted-foreground">
              Revisar: Card / Badge / Alert / Skeleton / Input / Focus ring / Hover
            </p>
          </div>

          <div className="space-y-6">
            {BASE_COLORS.map((base) => (
              <div key={`${mode}-${base}`} className="space-y-3">
                <div className="text-sm font-semibold text-muted-foreground">
                  Base: {THEME_LABELS[base]}
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {ACCENT_THEMES.map((accent) => (
                    <ThemeScope key={`${mode}-${base}-${accent}`} base={base} accent={accent} mode={mode}>
                      <div className="space-y-2">
                        <div className="text-xs font-medium">
                          {THEME_LABELS[accent]}
                        </div>
                        <StateBlock title="States" />
                      </div>
                    </ThemeScope>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-8 p-4 rounded-lg bg-muted">
        <p className="text-xs text-muted-foreground">
          <strong>Checklist:</strong> Nada "suelto" (bordes, backgrounds). Focus ring visible. Alerts/Badges legibles. Skeletons no desaparecen. Sin colores literales.
        </p>
      </div>
    </div>
  );
}
