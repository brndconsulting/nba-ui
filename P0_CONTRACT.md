# 🔒 P0 CONTRACT — NBA UI

**Última actualización:** 2026-01-02  
**Estado:** ✅ ACTIVE | ESLint 0 errores | TypeScript OK | CI Bloqueante

---

## Premisa

> **"No se permite creatividad de UI ni de datos."**
>
> Si un cambio requiere inventar estilos, inventar copy, inventar números o bypass de tokens, **el cambio se considera incorrecto**.
>
> Toda UI debe construirse con **shadcn/ui + tokens**, y toda data debe provenir de **snapshots cache-first**.
>
> Si falta información real, la UI debe declararlo (Empty/Error/Stale) sin números.

---

## 1️⃣ Componentes Permitidos

### ✅ Permitido

- **Solo `components/ui/*`** (shadcn/ui)
- Composición de esos componentes para crear features
- Wrappers que **no repliquen** shadcn (ej: `<ContextGate>`, `<Header>` son OK si usan shadcn internamente)

### ❌ Prohibido

- Librerías UI externas: `@mui`, `antd`, `@chakra-ui`, `react-bootstrap`, `mantine`
- Wrappers "custom" que repliquen shadcn (ej: botón custom con estilos propios)
- Componentes sin usar tokens

---

## 2º Tipografia Gobernada (P0 Lock)

**Fuente de verdad:** `index.css` (@theme inline + @layer base) + Tailwind estándar

### ✅ Permitido (UNICO camino)

```
Clases Tailwind estándar:
  text-xs, text-sm, text-base, text-lg, text-xl, text-2xl
  
Leading (interlineado):
  leading-none, leading-tight, leading-snug, leading-normal, 
  leading-relaxed, leading-loose
  
Tracking (espaciado de letras):
  tracking-tighter, tracking-tight, tracking-normal, 
  tracking-wide, tracking-wider, tracking-widest
  
Fonts (definidas en @theme):
  font-sans, font-mono
```

### ❌ Prohibido (Bloquea ESLint + CI)

```
Valores arbitrarios:
  text-[13px], leading-[1.35], tracking-[0.2px]
  
Estilos inline:
  style={{ fontSize: "14px" }}, style={{ lineHeight: "1.5" }}
  
Mezclar fonts no definidas:
  font-["Custom Font"], font-[Georgia]
  
Cambiar tipografia "porque queda mejor":
  Cada componente debe usar escala estándar
```

**Escala tipografica (P0 Default):**
- Body: `text-sm leading-normal`
- Secondary/muted: `text-sm text-muted-foreground`
- Titles: `text-lg/xl font-semibold leading-tight`
- Labels: `text-xs leading-none tracking-tight`
- Tables: `text-sm` (headers `text-xs uppercase tracking-wide`)

---

## 3º Tokens Permitidos (Colores/Estados))

### ✅ Permitido (Tokens Shadcn)

```
Fondos:
  bg-background, bg-card, bg-muted, bg-popover, bg-accent

Textos:
  text-foreground, text-muted-foreground, text-destructive, 
  text-destructive-foreground, text-primary-foreground, 
  text-secondary-foreground, text-accent-foreground

Bordes/Rings:
  border-border, border-input, border-sidebar-border,
  ring-ring, ring-offset-background

Estados:
  bg-primary, bg-secondary, bg-accent, bg-destructive
  (+ sus -foreground correspondientes)

Status Semánticos (permitidos para warnings/errors):
  text-red-600, text-yellow-600, text-green-600
  (solo para estados de "stale", "error", "success")
```

### ❌ Prohibido (Cualquier archivo, incluye `components/ui/*`)

```
Colores literales:
  text-gray-*, bg-white, text-black, border-gray-*,
  zinc-*, slate-*, stone-*, orange-*, amber-*, lime-*,
  emerald-*, teal-*, cyan-*, sky-*, indigo-*, violet-*,
  purple-*, fuchsia-*, pink-*, rose-*

Valores hex/rgb/hsl:
  #ffffff, #000000, #f8f8f7, rgb(255, 255, 255), hsl(0, 0%, 100%)

Estilos inline:
  style={{ color: "red" }}, style={{ backgroundColor: "#fff" }}
```

**Regla operativa:** Si ESLint marca un literal, se corrige con tokens. **No se "ignora". No se baja a warning.**

---

## 3️⃣ Textos (Copy)

### ✅ Permitido

- 100% desde `copy/*` vía keys
- Ejemplo: `{copy.waiver.title}`, `{copy.common.lastUpdate}`

### ❌ Prohibido

- Strings literales en componentes (salvo keys de copy)
- Hardcoded labels, placeholders, mensajes

---

## 4️⃣ Estados "Sin Dummy"

### ✅ Permitido

- **Skeleton:** Placeholder mientras carga (sin números)
- **EmptyState:** "No hay datos" (sin números inventados)
- **ErrorState:** Error real desde API (desde envelope)
- **StaleState:** Timestamp real de última sincronización

### ❌ Prohibido

- Placeholders con números inventados: `"0 puntos"`, `"100 assists"`
- Porcentajes ficticios: `"45% completado"`
- Rankings inventados: `"#1 en la liga"`
- Fallbacks tipo `my_team.points || '0'` o `leagueId || "77761"`

**Regla operativa:** Prohibido usar `|| 0`, `?? 0`, `|| "—"` para datos Yahoo. Si falta: **no se imprime** (o se oculta el bloque) y se cae a **Empty/Error/Stale**.

---

## 5️⃣ Theme Matrix: Combinaciones Validadas

**Base Colors (5):** zinc, slate, stone, gray, neutral

**Accent Themes (8):** default, blue, green, orange, red, rose, violet, yellow

**Total:** Light/Dark × 5 Base × 8 Accent = **80 combinaciones**

### Validación Obligatoria

Todo PR que toque UI debe incluir evidencia de Theme Matrix:

- Mínimo: validado en combinaciones extremas
  - `base-neutral + theme-yellow` (light)
  - `base-neutral + theme-yellow` (dark)
  - Más 1–2 adicionales (ej: `base-slate + theme-violet`)
- Máximo: captura o link a `/__theme-matrix` con todas las 80 combinaciones

---

## 6️⃣ Definition of Done (DoD) — UI

Marcar cada check con evidencia (link o captura):

- [ ] `npm run lint` = 0 errores
- [ ] `npm run typecheck` = OK
- [ ] Revisado en **Light** + **Dark**
- [ ] Revisado en **todas las paletas** (Base(5) × Accent(8))
- [ ] Contraste OK en: Card / Table / Badge / Alert / Input / Skeleton
- [ ] Focus ring visible (keyboard navigation)
- [ ] Hover/Focus no rompe estados
- [ ] Sin colores hardcodeados (solo tokens)
- [ ] Sin strings literales (copy desde keys)
- [ ] Sin números inventados (Empty/Error/Stale si falta data)

---

## 7️⃣ Evidencia Obligatoria (para PR)

**Mínimo requerido:**

Link o captura de `/__theme-matrix` mostrando:

1. `base-neutral + theme-yellow` (light mode)
2. `base-neutral + theme-yellow` (dark mode)
3. Mínimo 1 combinación adicional (ej: `base-slate + theme-violet`)

**Cómo capturar:**

```bash
# Navegar a la URL
https://tu-frontend.com/__theme-matrix

# Cambiar base/accent con selectores
# Capturar screenshot de cada combinación
# O usar Playwright para validar automáticamente
```

---

### 8º Combinaciones de Temas (80 Total)

**Desglose correcto:**
- **Bases (5):** `zinc`, `slate`, `stone`, `gray`, `neutral`
- **Accents (8):** `default`, `blue`, `green`, `orange`, `red`, `rose`, `violet`, `yellow`
- **Modos (2):** Light, Dark
- **Total:** 5 × 8 × 2 = **80 combinaciones**

**Validación en PR:**
- [ ] Revisado en light + dark
- [ ] Captura de `/__theme-matrix` en base-slate + accent-violet (light)
- [ ] Captura de `/__theme-matrix` en base-neutral + accent-yellow (dark)
- [ ] Contraste OK en Card/Table/Badge/Alert/Input/Skeleton
- [ ] Focus ring visible (tabbing)

---

## 9º CI/CD: Bloqueante (No Bypass)

### GitHub Actions (Obligatorio)

```yaml
- run: npm ci
- run: npm run lint
- run: npm run typecheck
```

**Regla:** No se mergea si falla lint, aunque sea WIP.

### Husky + lint-staged (Pre-commit)

Bloquea commits si aparece:

- Literal prohibido (color, import externo)
- ESLint error
- TypeScript error

---

### 10º Prohibición Anti-Dummy (Data P0)

**Regla de hierro:** Prohibido "seed" inventado para UI. La BD se llena SOLO por:

✅ **Sync real desde Yahoo** (owner real en dev/staging)

✅ **Fixtures grabadas de Yahoo** (snapshots reales capturados una vez, con `source="yahoo"` + `captured_at` explícito)

❌ **Prohibido:** números inventados, ligas fake, teams dummy, porcentajes aleatorios, rankings sin fuente

**Aplicación:** Si falta un atributo de Yahoo, la UI no lo imprime; se oculta columna/bloque o EmptyState. Nunca se inventa.

**Evidencia:** Cada snapshot debe tener `source` y `captured_at` en la BD. ESLint + E2E valida que no hay hardcoded numbers en componentes.

---

## 11º Regla Anti-Creatividad (Explícita)

Si alguien propone:

- ✅ "Agregar un botón con shadcn + tokens" → OK
- ❌ "Crear un botón custom con estilos propios" → RECHAZADO
- ✅ "Mostrar Empty/Error/Stale si falta data" → OK
- ❌ "Mostrar '0 puntos' si falta data" → RECHAZADO
- ✅ "Usar copy keys para textos" → OK
- ❌ "Hardcodear 'Bienvenido' en el componente" → RECHAZADO

---

## 12º Checklist de Validación (Pre-Merge)

**Reviewer debe verificar:**

- [ ] ESLint 0 errores (output de CI)
- [ ] TypeScript OK (output de CI)
- [ ] PR incluye evidencia de Theme Matrix (mínimo 3 combinaciones)
- [ ] Contraste visible en light + dark
- [ ] Focus ring visible en keyboard
- [ ] Sin colores hardcodeados (grep o visual)
- [ ] Sin strings literales (grep en componentes)
- [ ] Sin números inventados (revisar Empty/Error/Stale)
- [ ] DoD UI completado (todos los checks)

---

## Historial de Cambios

| Fecha | Cambio | Status |
|-------|--------|--------|
| 2026-01-02 | P0 CONTRACT creado | ✅ |
| 2026-01-02 | ESLint 0 errores alcanzado | ✅ |
| 2026-01-02 | Guardrails P0 documentados | ✅ |

---

## Referencias

- **ESLint Config:** `eslint.config.js`
- **Tailwind Tokens:** `client/src/index.css`
- **Theme Config:** `client/src/config/themes.ts`
- **shadcn/ui Components:** `client/src/components/ui/*`
- **Theme Matrix:** `/__theme-matrix` (en dev)
- **Copy Keys:** `client/src/lib/copy/es.ts`
