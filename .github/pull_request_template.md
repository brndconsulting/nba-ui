## Description

<!-- Describe your changes here -->

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues

<!-- Link related issues here: Closes #123 -->

---

## 🎨 UI/UX Validation Checklist (MANDATORY)

**All UI changes must pass these checks before merge.**

### Light & Dark Mode
- [ ] Verified in **Light mode** - contrast OK, no sloppy elements
- [ ] Verified in **Dark mode** - contrast OK, no sloppy elements

### All Themes
- [ ] Verified in **all available themes** (default, custom palettes)
- [ ] No visual regressions or broken layouts

### Component States
- [ ] **Skeleton** state - no numbers, clean loading
- [ ] **Empty** state - honest message, no dummy data
- [ ] **Error** state - clear error message from envelope
- [ ] **Stale** state - shows real timestamp
- [ ] **Success** state - renders correctly

### Component Contrast & Focus
- [ ] `Card` - text readable, borders visible
- [ ] `Table` - rows distinguishable, headers clear
- [ ] `Badge` - sufficient contrast with background
- [ ] `Alert` - icon + text + variant clear
- [ ] `Skeleton` - animation visible
- [ ] `Input/Textarea` - focus ring visible (keyboard navigation)
- [ ] `Button` - hover/active/disabled states clear
- [ ] `Dialog/Modal` - backdrop visible, content readable

### Color & Styling Rules
- [ ] No hardcoded colors (`text-black`, `bg-white`, `text-gray-*`, etc.)
- [ ] Only Tailwind tokens used (`bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, `bg-accent`, `text-destructive`, etc.)
- [ ] No inline styles (`style={{...}}`)
- [ ] No custom CSS outside `globals.css`
- [ ] All colors come from theme variables

### Accessibility
- [ ] Focus ring visible on all interactive elements
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] ARIA labels present where needed
- [ ] Color not the only indicator (use icons/text)

---

## Testing

- [ ] Manual testing completed
- [ ] ESLint passes (`pnpm eslint client/src`)
- [ ] TypeScript compiles (`pnpm tsc --noEmit`)
- [ ] No console errors in browser

---

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] No new warnings generated
- [ ] Tests added/updated (if applicable)

---

**Note:** PRs that don't pass the UI/UX validation checklist will be requested for changes. This ensures consistent visual quality across Light/Dark modes and all themes.
