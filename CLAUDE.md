# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Dev servers
pnpm dev:app:auth      # Next.js auth server on :3000
pnpm dev:app:social    # Vite social app on :3001
pnpm dev:app:energy    # Vite energy app on :3002

# Build
pnpm build:app:auth|social|energy
pnpm build:lib:hooks|models|sso|ui|utils

# Test (libs use vitest; e2e uses playwright)
npx nx test hooks                        # run unit tests for a lib
pnpm test:lib:hooks:coverage             # with coverage
npx nx e2e auth-e2e|social-e2e|energy-e2e

# Lint & format
npx nx lint <project>
pnpm format:write

# i18n (always extract then compile)
pnpm lingui:extract:auth|social|energy
pnpm lingui:compile:auth|social|energy

# Storybook (ui lib)
pnpm storybook:ui      # :3003

# Explore Nx project graph
npx nx graph
```

## Architecture

### Monorepo layout

```
apps/
  auth/       Next.js 16 — SSO auth server (port 3000)
  social/     Vite + React Router 7 — social admin panel (port 3001)
  energy/     Vite + React Router 7 — energy admin panel (port 3002)
libs/
  sso/        Custom SSO client (multi-entry)
  models/     All Zod DTOs, organized by domain
  hooks/      Shared React hooks
  ui/         Component library — atoms/molecules/organisms
  utils/      Shared utilities
```

### Auth / SSO flow

The `auth` app is the central SSO provider. Client apps (`social`, `energy`) are relying parties that use `@nexsoft-admin/sso`.

1. Unauthenticated user → `AuthGuard` calls `login()` → redirects to `auth` app with `redirect_uri` + `app_id`
2. User logs in on `auth` → auth calls its own API `/api/auth/code` → stores auth code + tokens in Redis → redirects back with `?code=`
3. Client `/callback` page calls `SSOClient.handleCallback()` → POSTs to auth `/api/auth/token` → receives `access_token` / `refresh_token` → stores in configured storage (default: `localStorage`)
4. Expired tokens: `SSOClient.getAccessToken()` auto-refreshes 5 min before expiry; the Axios interceptor uses `axios-auth-refresh` to retry 401/403 responses.

**Redis key layout (auth app)**

- `session:{userId}` — global user session
- `app_session:{appId}:{userId}` — per-app session
- `auth_code:{code}` — one-time auth code (5 min TTL)

### SSO lib sub-exports

```ts
import { SSOClient } from '@nexsoft-admin/sso'; // client class + types
import { useSSO, useAuth } from '@nexsoft-admin/sso/react'; // React hooks
import { generateAuthCode } from '@nexsoft-admin/sso/core'; // server-side utils
import type { SSOConfig } from '@nexsoft-admin/sso/config'; // config type
```

Each client app creates a singleton `SSOClient` in `src/libs/sso.ts` using Vite env vars (`VITE_AUTH_SERVER_URL`, `VITE_APP_ID`, `VITE_TOKEN_STORAGE`, etc.).

### Models lib

`@nexsoft-admin/models` exports Zod schemas and inferred TypeScript types for every DTO, organized by domain: `auth`, `user`, `admin`, `profile`, `role`, `activity`, `report-metrics`, `setting`. Import directly from the package; do not duplicate schemas in apps.

### Axios setup (client apps)

Each Vite app has `src/libs/axios.ts` that:

- Sets `baseURL` from `API_BASE` constant, `withCredentials: true`
- Request interceptor: injects `Authorization: Bearer <token>` via `SSOClient.getAccessToken()`
- Response interceptor: transforms `created_at`/`updated_at` ISO strings to `Date` objects via `deepSearchAndParseDates` from `@nexsoft-admin/utils`; translates API error messages with `translateError` and shows a Sonner toast
- `axios-auth-refresh` handles 401/403: retries with refreshed token; if refresh itself fails, clears all queries and calls `client.logout()`

### UI lib

Components follow atoms → molecules → organisms. Each has a dedicated sub-export:

```ts
import { Button } from '@nexsoft-admin/ui/button';
import { Card } from '@nexsoft-admin/ui/card';
```

Variants use `class-variance-authority` (CVA) and live in `*.variants.ts` files. Storybook stories live alongside each component.

### Overlay system (client apps)

A Zustand stack (`src/stores/overlay.store.ts`) drives all modals/drawers. Components are rendered by `OverlayRenderer` (`src/providers/overlay.renderer.tsx`) which maps string keys to component classes via a registry. To add a new overlay: register the component in the renderer, then call `useOverlayStore().open({ name: 'key', id, props })`.

### Routing (Vite apps)

React Router 7 with `createBrowserRouter`. All authenticated routes are wrapped inside `<AuthGuard>`. The `/callback` route must remain outside the guard (handles SSO token exchange). Route files live in `src/pages/<path>/page.tsx`; page-local components in `src/pages/<path>/_components/`.

### Service layer

`src/services/<domain>/` — one file per operation, using the app-local `axios` instance. Return types are inferred from `@nexsoft-admin/models` Zod schemas.

### State

- **Server state**: TanStack Query — query keys defined in `src/constants/query-keys.constant.ts`
- **UI/layout state**: Zustand stores in `src/stores/*.store.ts`

### i18n

LinguiJS with PO format. Source locale is `en`; supported: `en`, `vi`, `zh-Hans`, `zh-Hant`. Always run `extract` then `compile` after adding/changing translatable strings. Use `msg` and `<Trans>` macros from `@lingui/macro`.
