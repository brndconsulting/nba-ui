# ESLint Analysis - 58 Total Errors

## Summary by Rule

- **no-unused-vars**: 20 errors
  - Header.tsx: 7 (ContextGate, NavigationMenuContent, NavigationMenuLink, NavigationMenuTrigger, Badge, cn)
  - ManusDialog.tsx: 1 (open)
  - Map.tsx: 1 (map)
  - ThemeControls.tsx: 1 (copy)
  - carousel.tsx: 1 (api)
  - chart.tsx: 1 (k)
  - dialog.tsx: 1 (composing)
  - sidebar.tsx: 4 (open x3, value)
  - ContextProvider.tsx: 2 (leagueKey, teamKey)
  - ThemeProvider.tsx: 2 (base, accent)
  - useContext.ts: 1 (API_ENDPOINTS)
  - usePersistFn.ts: 1 (args)
  - Matchup.tsx: 1 (CardDescription)
  - ThemeMatrix.tsx: 5 (Card, CardContent, CardHeader, CardTitle, Separator)
  - Waiver.tsx: 2 (context, t)

- **no-restricted-syntax** (hardcoded colors): 38 errors
  - ManusDialog.tsx: 5 (hex/rgb/hsl colors)
  - StaleState.tsx: 4 (hardcoded color classes)
  - alert-dialog.tsx: 1
  - badge.tsx: 1
  - button.tsx: 1
  - chart.tsx: 1 (hex color)
  - dialog.tsx: 1
  - drawer.tsx: 1
  - sheet.tsx: 1
  - sidebar.tsx: 1 (hex color)
  - slider.tsx: 1
  - NotFound.tsx: 8 (hardcoded color classes)

## Fix Strategy (by Phase)

### Phase 1: Remove Unused Variables (20 errors)
- Quick wins: remove unused imports and variables
- Prefixed with underscore if needed for callbacks: `(_unused) => ...`

### Phase 2: Fix components/ui/* Colors (13 errors)
- alert-dialog.tsx, badge.tsx, button.tsx, carousel.tsx, chart.tsx, dialog.tsx, drawer.tsx, sheet.tsx, sidebar.tsx, slider.tsx

### Phase 3: Fix App Components Colors (25 errors)
- ManusDialog.tsx, StaleState.tsx, NotFound.tsx

## Token Mapping Reference

| Hardcoded | Token |
|-----------|-------|
| bg-white | bg-background |
| text-black / text-zinc-950 | text-foreground |
| text-gray-500 / text-zinc-500 | text-muted-foreground |
| border-gray-200 / border-zinc-200 | border-border |
| bg-zinc-100 / bg-gray-100 | bg-muted |
| hover:bg-zinc-100 | hover:bg-accent |
| ring-offset-white | ring-offset-background |
| focus:ring-* literal | focus-visible:ring-ring |
| #hex / rgb() / hsl() | CSS variables or Tailwind tokens |
