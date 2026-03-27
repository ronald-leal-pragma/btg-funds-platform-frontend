# BTG Funds Platform Frontend

Quick start (desarrollo local):

1. Copiar variables de ejemplo:

```bash
cp .env.example .env
```

2. Instalar dependencias y levantar la app:

```bash
npm install
npm run dev
```

Notas de configuración:
- El frontend usa por defecto `VITE_API_BASE=/api/v1` para aprovechar el proxy configurado en [vite.config.ts](vite.config.ts).
- Si prefieres apuntar directamente al backend (sin proxy), establece en `.env` la URL completa, por ejemplo `VITE_API_BASE=http://localhost:8081/api/v1`. En ese caso asegúrate de habilitar CORS en el backend.

Verificaciones rápidas:
- Frontend (Vite) se sirve en `http://localhost:5173` por defecto; si el puerto está ocupado Vite elegirá otro (por ejemplo `5174`).
- Revisa la pestaña Network en el navegador para confirmar llamadas a `/api/v1/*`.

E2E (Playwright):
- Instalación de navegadores (solo la primera vez):

```bash
npx playwright install --with-deps
```

- Ejecutar el test E2E agregado (`tests/e2e.spec.ts`):

```bash
npx playwright test tests/e2e.spec.ts
```

Si quieres ejecutar todos los tests de Playwright añade este script a `package.json` y úsalo:

```json
"scripts": {
	"test:e2e": "playwright test"
}
```

Archivos relevantes:
- `src/services/api.ts` — cliente Axios y `VITE_API_BASE`.
- `vite.config.ts` — proxy dev hacia el backend.
- `tests/e2e.spec.ts` — prueba E2E que simula suscripción/cancelación y verifica transacciones.

Problemas comunes:
- Si la UI muestra un error CORS al hacer peticiones a `http://localhost:8081`, vuelve a `VITE_API_BASE=/api/v1` para usar el proxy local, o configura CORS en el backend.

Si quieres, puedo añadir el script `test:e2e` al `package.json` y una sección con pasos para integración en CI.
