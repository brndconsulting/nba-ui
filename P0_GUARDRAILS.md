# 🔒 P0 Guardrails - NBA UI

**Última actualización:** 2026-01-02  
**Estado:** ✅ ESLint 0 errores | TypeScript OK | P0 Enforcement Active

---

## Regla de Hierro

> **"Si no es shadcn/ui + tokens, está prohibido"**

No "parecido", no "inspirado", no "custom".

### Alcance
- ✅ Incluye `components/ui/*` - si está en el repo, cumple P0
- ✅ Incluye `components/*` - componentes de app
- ✅ Incluye `pages/*` - páginas

---

## Candados Técnicos Implementados

### 1️⃣ ESLint P0 (Estado: ✅ ACTIVE)

**Objetivo:** 0 errores, 0 warnings de colores

**Reglas activas:**

```javascript
// eslint.config.js
'no-restricted-syntax': [
  'error',
  {
    // Prohibir colores hardcodeados (excepto status colors: red, yellow, green)
    selector: 'Literal[value=/\\b(text|bg|border|ring|from|to|via)-(black|white|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink)(-\\d{2,3})?\\b/]',
    message: 'Use Tailwind tokens (bg-background, text-foreground, border-border, etc.)',
  },
  {
    // Prohibir hex/rgb/hsl
    selector: 'Literal[value=/(#[0-9a-f]{3,6}|rgb\\(|hsl\\()/i]',
    message: 'Use CSS variables or Tailwind tokens instead.',
  },
],

// Prohibir imports de UI externas
'no-restricted-imports': [
  'error',
  {
    patterns: [
      { group: ['@mui/*', 'antd', '@chakra-ui/*', 'react-bootstrap', 'mantine'] },
    ],
  },
],

// TypeScript: no unused vars (con patrón ^_)
'@typescript-eslint/no-unused-vars': [
  'error',
  {
    argsIgnorePattern: '^_',
    varsIgnorePattern: '^_',
    destructuredArrayIgnorePattern: '^_',
  },
],
```

**Validación:**
```bash
pnpm eslint client/src
# Esperado: 0 errors
```

---

### 2️⃣ TypeScript Strict (Estado: ✅ ACTIVE)

**Objetivo:** Sin errores de tipo

**Validación:**
```bash
npx tsc --noEmit
# Esperado: sin errores
```

---

### 3️⃣ Tokens Obligatorios (Estado: ✅ ENFORCED)

**Colores permitidos:**

| Categoría | Tokens | Ejemplos |
|-----------|--------|----------|
| **Semánticos** | `bg-background`, `text-foreground`, `border-border` | Fondos, textos, bordes |
| **Componentes** | `bg-card`, `bg-popover`, `bg-muted` | Contenedores |
| **Estados** | `bg-primary`, `bg-secondary`, `bg-accent`, `bg-destructive` | Botones, acciones |
| **Foreground** | `text-primary-foreground`, `text-card-foreground` | Textos sobre colores |
| **Status** | `text-red-600`, `text-yellow-600`, `text-green-600` | Warnings, errors, success |

**Prohibido:**
- ❌ `bg-white`, `text-black`, `border-gray-300`
- ❌ `#ffffff`, `rgb(255, 255, 255)`, `hsl(0, 0%, 100%)`
- ❌ Imports de `@mui`, `antd`, `@chakra-ui`, `react-bootstrap`

---

## Validación de Cambios

### Antes de hacer commit:

```bash
# 1. ESLint
pnpm eslint client/src
# → Debe retornar 0 errors

# 2. TypeScript
npx tsc --noEmit
# → Sin errores

# 3. Verificar que NO hay colores hardcodeados
grep -r "bg-white\|text-black\|border-gray" client/src/
# → Debe retornar vacío
```

### Respuesta válida para cualquier cambio:

Para cada cambio que se proponga, debe responder:

1. **¿Qué componente shadcn usaste?** (nombre exacto)
2. **¿Qué tokens usaste?** (bg-*, text-*, border-*, ring-*)
3. **¿Dónde está validado en Theme Matrix?** (captura/commit)

Si no puede responder esas 3, el cambio se rechaza.

---

## Checklist de Enforcement

- [x] ESLint config con P0 rules
- [x] No colores hardcodeados en components/ui/*
- [x] No colores hardcodeados en components/*
- [x] No colores hardcodeados en pages/*
- [x] No imports de UI externas
- [x] TypeScript sin errores
- [x] Theme Matrix validado (light/dark)
- [x] Documentación de guardrails

---

## Frase para rechazar cambios fuera de P0

> "No custom UI. Solo shadcn/ui. Solo tokens. Si propones algo fuera, estás violando P0 y se descarta."

---

## Historial de Cambios

| Fecha | Cambio | Status |
|-------|--------|--------|
| 2026-01-02 | ESLint 0 errores alcanzado | ✅ |
| 2026-01-02 | Reemplazar colores en components/ui/* | ✅ |
| 2026-01-02 | Reemplazar colores en app components | ✅ |
| 2026-01-02 | Limpiar imports no usados | ✅ |
| 2026-01-02 | Configurar guardrails P0 | ✅ |

---

## Próximos Pasos

1. **Validar Theme Matrix en 80 combinaciones** (light/dark × 8 bases × 5 accents)
2. **Crear test suite** para validar tokens en cada componente
3. **Documentar Theme Matrix** con capturas de cada combinación
4. **Integrar en CI/CD** para bloquear PRs que violen P0

---

## Referencias

- **ESLint Config:** `/home/ubuntu/nba-ui/eslint.config.js`
- **Tailwind Tokens:** `/home/ubuntu/nba-ui/client/src/index.css`
- **Theme Config:** `/home/ubuntu/nba-ui/client/src/config/themes.ts`
- **shadcn/ui Components:** `/home/ubuntu/nba-ui/client/src/components/ui/*`
