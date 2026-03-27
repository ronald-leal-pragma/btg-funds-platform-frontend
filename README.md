# BTG Funds Platform — Frontend

Plataforma de gestión de fondos de inversión (FPV/FIC) de BTG Pactual. Permite a un cliente suscribirse a fondos, cancelar suscripciones, consultar su balance y revisar el historial de transacciones.

## Stack

| Tecnología | Uso |
|---|---|
| React 18 + TypeScript | UI |
| Vite | Bundler y dev server |
| TailwindCSS | Estilos |
| TanStack Query (React Query v5) | Estado del servidor y caché |
| Axios | Cliente HTTP |
| Vitest + Testing Library | Tests unitarios |
| Playwright | Tests E2E |

## Estructura del proyecto

```
src/
├── components/       # UI reutilizable (FundCard, TransactionRow, Badge, etc.)
├── context/          # AuthContext (contexto de autenticación)
├── hooks/            # Hooks de datos (useFunds, useClient, useTransactions)
├── pages/            # Vistas (FundsPage, TransactionsPage, ClientPage, LoginPage)
├── services/         # Cliente Axios y llamadas a la API (api.ts)
├── types/            # Tipos TypeScript compartidos (index.ts)
└── test/             # Setup de Vitest (setup.ts)
tests/
├── e2e.spec.ts       # Test E2E: suscripción, cancelación y transacciones
└── diag.spec.ts      # Test de diagnóstico de conectividad
```

## Inicio rápido

### 1. Variables de entorno

```bash
cp .env.example .env
```

El archivo `.env.example` trae `VITE_API_BASE=/api/v1` para aprovechar el proxy de Vite (recomendado). Si prefieres apuntar directo al backend:

```env
VITE_API_BASE=http://localhost:8081/api/v1
```

> En ese caso habilita CORS en el backend para `http://localhost:5173`.

### 2. Instalar y levantar

```bash
npm install
npm run dev
```

La app estará disponible en `http://localhost:5173` (Vite elegirá otro puerto si está ocupado).

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción (`tsc && vite build`) |
| `npm run preview` | Vista previa del build de producción |
| `npm test` | Tests unitarios con Vitest |
| `npm run lint` | Linter ESLint con reglas TypeScript |

## Tests unitarios

```bash
npm test
```

Usa Vitest + Testing Library con JSDOM. El setup global está en [src/test/setup.ts](src/test/setup.ts).

## Tests E2E (Playwright)

Instalar navegadores (solo la primera vez):

```bash
npx playwright install --with-deps
```

Ejecutar tests E2E:

```bash
npx playwright test tests/e2e.spec.ts
```

> Los tests E2E requieren que tanto el backend (`:8081`) como el frontend (`:5173`) estén corriendo.

Para agregar el script al `package.json`:

```json
"scripts": {
  "test:e2e": "playwright test"
}
```

## API

El cliente HTTP está centralizado en [src/services/api.ts](src/services/api.ts). Todos los hooks consumen los siguientes endpoints:

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/v1/funds` | Lista fondos con estado de suscripción |
| `POST` | `/api/v1/funds/{id}/subscribe` | Suscribirse a un fondo |
| `DELETE` | `/api/v1/funds/{id}/cancel` | Cancelar suscripción |
| `GET` | `/api/v1/transactions` | Historial de transacciones |
| `GET` | `/api/v1/client` | Balance y datos del cliente |

## Proxy de desarrollo

El proxy está configurado en [vite.config.ts](vite.config.ts) y redirige `/api/v1/*` al backend en `http://localhost:8081`. Esto evita problemas de CORS durante el desarrollo.

## Problemas comunes

- **Error CORS**: Asegúrate de usar `VITE_API_BASE=/api/v1` para que las peticiones pasen por el proxy de Vite, o configura CORS en el backend para tu origen.
- **Puerto ocupado**: Vite cambiará automáticamente al siguiente puerto disponible (ej. `5174`). Actualiza la URL base en Playwright si usas E2E.
- **Backend no disponible**: Verifica que el backend esté corriendo en el puerto `8081` antes de ejecutar los tests E2E.
