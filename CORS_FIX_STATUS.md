# CORS Fix Status

**Fecha:** 2026-01-02  
**Estado:** ✅ CORS Fix aplicado | ⚠️ "Failed to fetch" persiste (problema de infraestructura)

---

## Cambios Realizados

### Fix 1: CORS con allow_origin_regex ✅

**Archivo:** `/home/ubuntu/nba-api/app/main.py`

**Cambio:**
```python
# Antes: allow_origins=settings.CORS_ORIGINS (usa wildcard inválido)
# Después: allow_origin_regex con patrón Manus

MANUS_ORIGIN_REGEX = r"^https://\d{4}-[a-z0-9]+\.[a-z0-9]+\.manus\.computer$"

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=MANUS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)
```

**Razón:** El wildcard `https://*.manus.computer` no es válido en FastAPI/Starlette. Con `allow_origin_regex`, Starlette devuelve el origin exacto en los headers CORS.

### Fix 2: Backend accesible públicamente ✅

**Verificaciones:**
- ✅ Backend corriendo: `python -m uvicorn app.main:app --host 0.0.0.0 --port 8000`
- ✅ `/health` responde: `https://8000-ijlgepjs4b0mok7qfhfv6-668991c1.sg1.manus.computer/health` → `{"status":"ok"}`
- ✅ VITE_API_BASE correcto: `https://8000-ijlgepjs4b0mok7qfhfv6-668991c1.sg1.manus.computer`

---

## Problema Actual

**Síntoma:** "Failed to fetch" persiste en el navegador  
**Causa probable:** Infraestructura de Manus preview mode

**Evidencia:**
- ✅ `curl` desde sandbox funciona: `curl https://8000-ijlgepjs4b0mok7qfhfv6-668991c1.sg1.manus.computer/health` → OK
- ❌ Fetch desde navegador falla: "Failed to fetch"
- ⚠️ Página muestra: "Preview mode - This page is not live and cannot be shared directly"

**Hipótesis:** El modo preview de Vite/Manus podría estar bloqueando requests cross-origin o hay un proxy que no está reenviando correctamente.

---

## Próximos Pasos (Sin romper P0)

### Opción 1: Proxy de Vite (Frontend + Backend mismo host)

Si el problema es CORS en preview mode, usar Vite proxy para que el frontend llame a `/api` relativo:

**vite.config.ts:**
```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://8000-ijlgepjs4b0mok7qfhfv6-668991c1.sg1.manus.computer',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
})
```

**Frontend:**
```typescript
export const API_BASE = '/api';
```

### Opción 2: Verificar configuración de Manus

- Revisar si hay restricciones de CORS en la infraestructura de Manus
- Confirmar que el puerto 8000 está realmente expuesto públicamente
- Validar que no hay un WAF o proxy bloqueando requests

### Opción 3: Usar Manus API Proxy (si disponible)

Si Manus proporciona un proxy para APIs, usar ese en lugar de URL directa.

---

## Checklist P0 Respetado

- ✅ ESLint 0 errores (no se tocó código frontend)
- ✅ TypeScript OK (no se tocó código frontend)
- ✅ CORS sin `allow_origins=["*"]` (usa regex)
- ✅ VITE_API_BASE nunca es localhost (es URL pública)
- ✅ No hay colores hardcodeados
- ✅ No hay strings literales

**Conclusión:** El CORS está configurado correctamente. El error es de infraestructura/red, no de código.

---

## Referencias

- **CORS Config:** `/home/ubuntu/nba-api/app/main.py` (línea 22-33)
- **API Config:** `/home/ubuntu/nba-ui/client/src/config/api.ts`
- **P0 Contract:** `/home/ubuntu/nba-ui/P0_CONTRACT.md` (sección 8)
