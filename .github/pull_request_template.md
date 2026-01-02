## 📋 P0 CONTRACT — PR Checklist

**Lee primero:** [P0_CONTRACT.md](../P0_CONTRACT.md)

---

## ✅ Validación Obligatoria (Bloqueante)

- [ ] `npm run lint` = **0 errores** (CI output)
- [ ] `npm run typecheck` = **OK** (CI output)
- [ ] Revisado en **Light mode** (contraste OK)
- [ ] Revisado en **Dark mode** (contraste OK)
- [ ] Revisado en **todas las paletas** (Base(5) × Accent(8))
- [ ] Contraste OK en: Card / Table / Badge / Alert / Input / Skeleton
- [ ] Focus ring visible (keyboard navigation)
- [ ] Hover/Focus no rompe estados
- [ ] **Sin colores hardcodeados** (solo tokens)
- [ ] **Sin strings literales** (copy desde keys)
- [ ] **Sin números inventados** (Empty/Error/Stale si falta data)
- [ ] **Tipografía validada** (tamaños/leading/tracking en Light/Dark + todos los themes)
- [ ] **Sin clases tipográficas arbitrarias** (no text-[...], leading-[...], tracking-[...])

---

## 📸 Evidencia Theme Matrix (Obligatoria)

Incluir link o captura de `/__theme-matrix` mostrando:

1. **`base-neutral + theme-yellow` (light)** — [link/captura]
2. **`base-neutral + theme-yellow` (dark)** — [link/captura]
3. **Mínimo 1 combinación adicional** (ej: `base-slate + theme-violet`) — [link/captura]

---

## 📝 Descripción del PR

Qué cambios hace este PR:

- **Componentes shadcn usados:** `[Button, Card, Alert, ...]`
- **Tokens usados:** `[bg-background, text-foreground, ...]`
- **Clases tipográficas usadas:** `[text-sm, leading-normal, tracking-tight, ...]`
- **Copy keys usadas:** `[copy.waiver.title, ...]`
- **Estados manejados:** `[Empty, Error, Stale, ...]`

---

## 🚫 Regla Anti-Creatividad

**Este PR será rechazado automáticamente si:**

- ❌ Contiene colores hardcodeados (no tokens)
- ❌ Contiene imports de UI externas (`@mui`, `antd`, `@chakra-ui`, etc.)
- ❌ Contiene strings literales en componentes (no copy keys)
- ❌ Contiene clases tipográficas arbitrarias (text-[...], leading-[...], tracking-[...])
- ❌ Contiene estilos inline de tipografía (style={{ fontSize, lineHeight, letterSpacing }})
- ❌ Contiene números inventados (sin Empty/Error/Stale)
- ❌ ESLint falla o TypeScript falla
- ❌ No incluye evidencia de Theme Matrix

---

## 🔍 Reviewer Checklist

- [ ] ESLint 0 errores (CI passed)
- [ ] TypeScript OK (CI passed)
- [ ] Evidencia Theme Matrix incluida (mínimo 3 combinaciones)
- [ ] Contraste visible en light + dark
- [ ] Focus ring visible en keyboard
- [ ] Sin colores hardcodeados (grep o visual)
- [ ] Sin strings literales (grep en componentes)
- [ ] Sin números inventados (revisar Empty/Error/Stale)
- [ ] DoD UI completado

---

## 📋 Definition of Done (DoD) — UI

Todos estos checks deben estar marcados antes de merge:

- [ ] Componentes usan **solo shadcn/ui**
- [ ] Colores usan **solo tokens** (bg-background, text-foreground, etc.)
- [ ] Textos vienen de **copy keys** (no hardcoded)
- [ ] Estados son **honestos** (Empty/Error/Stale, sin dummy data)
- [ ] **Light + Dark** validados visualmente
- [ ] **Todas las paletas** validadas en Theme Matrix
- [ ] **Contraste** OK en todos los componentes
- [ ] **Focus ring** visible en keyboard
- [ ] **ESLint 0 errores**
- [ ] **TypeScript OK**

---

## 🚨 Nota Importante

> **No se permite creatividad de UI ni de datos.**
>
> Si un cambio requiere inventar estilos, inventar copy, inventar números o bypass de tokens, **el cambio se considera incorrecto**.

---

**No se mergea sin cumplir P0 Contract. No hay excepciones.**
