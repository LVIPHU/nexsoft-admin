# Environment Variables Setup Guide

## 📁 Where to Place .env Files

In this monorepo, each app needs its own `.env` file in its directory:

```
nexsoft-admin/
├── apps/
│   ├── auth/
│   │   └── .env.local          ← Auth app (Next.js)
│   ├── social/
│   │   └── .env                ← Social app (Vite)
│   └── energy/
│       └── .env                ← Energy app (Vite)
└── .env.example                ← Common template
```

## 🔧 Setup for Each App

### 1. Auth App (`apps/auth/.env.local`)

**Why `.env.local`?** Next.js automatically loads this file and it's gitignored.

Create file `apps/auth/.env.local`:

```env
# Auth Server URL (this app)
AUTH_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_AUTH_SERVER_URL=http://localhost:3000

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Auth Code Expiry (in seconds, default: 300 = 5 minutes)
AUTH_CODE_EXPIRY=300

# Access Token Expiry (in seconds, default: 3600 = 1 hour)
ACCESS_TOKEN_EXPIRY=3600

# External Auth API URL (if using external API for token generation)
# Leave empty if using mock tokens for development
EXTERNAL_AUTH_API_URL=

# SSO Callback Path
SSO_CALLBACK_PATH=/callback
NEXT_PUBLIC_SSO_CALLBACK_PATH=/callback

# Token Storage Type
TOKEN_STORAGE=localStorage
NEXT_PUBLIC_TOKEN_STORAGE=localStorage

# App ID (for SSO)
NEXT_PUBLIC_APP_ID=auth
```

### 2. Social App (`apps/social/.env`)

**Note:** Vite only exposes variables with `VITE_` prefix to client-side.

Create file `apps/social/.env`:

```env
# Auth Server URL (SSO Provider)
VITE_AUTH_SERVER_URL=http://localhost:3000
AUTH_SERVER_URL=http://localhost:3000

# Social App URL
VITE_APP_URL=http://localhost:3001
APP_URL=http://localhost:3001

# App ID (unique identifier for this app in SSO)
VITE_APP_ID=social
APP_ID=social

# SSO Callback Path
VITE_SSO_CALLBACK_PATH=/callback
SSO_CALLBACK_PATH=/callback

# Token Storage Type (localStorage, sessionStorage, cookie, or memory)
VITE_TOKEN_STORAGE=localStorage
TOKEN_STORAGE=localStorage
```

### 3. Energy App (`apps/energy/.env`)

Create file `apps/energy/.env`:

```env
# Auth Server URL (SSO Provider)
VITE_AUTH_SERVER_URL=http://localhost:3000
AUTH_SERVER_URL=http://localhost:3000

# Energy App URL
VITE_APP_URL=http://localhost:3002
APP_URL=http://localhost:3002

# App ID (unique identifier for this app in SSO)
VITE_APP_ID=energy
APP_ID=energy

# SSO Callback Path
VITE_SSO_CALLBACK_PATH=/callback
SSO_CALLBACK_PATH=/callback

# Token Storage Type (localStorage, sessionStorage, cookie, or memory)
VITE_TOKEN_STORAGE=localStorage
TOKEN_STORAGE=localStorage
```

## 🔑 Environment Variables Explanation

### Common Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `AUTH_SERVER_URL` | URL of the auth server (auth.com) | `http://localhost:3000` |
| `APP_URL` | URL of the current app | `http://localhost:3001` (social) |
| `APP_ID` | Unique identifier for the app in SSO | `social`, `energy` |
| `REDIS_URL` | Connection string for Redis | `redis://localhost:6379` |
| `AUTH_CODE_EXPIRY` | Auth code expiration time (seconds) | `300` (5 minutes) |
| `ACCESS_TOKEN_EXPIRY` | Access token expiration time (seconds) | `3600` (1 hour) |
| `TOKEN_STORAGE` | How to store tokens: localStorage, sessionStorage, cookie, memory | `localStorage` |

### Next.js (Auth App):

- **`NEXT_PUBLIC_*`**: Variables with this prefix are exposed to client-side
- **`.env.local`**: This file is automatically gitignored, safe for secrets

### Vite (Social & Energy Apps):

- **`VITE_*`**: Variables with this prefix are exposed to client-side
- **`.env`**: This file needs to be gitignored (already in .gitignore)

## 📝 Quick Setup Steps

1. **Create .env file for Auth app:**
   ```bash
   # From root directory
   cd apps/auth
   # Copy and edit the template
   ```

2. **Create .env file for Social app:**
   ```bash
   cd apps/social
   # Copy and edit the template
   ```

3. **Create .env file for Energy app:**
   ```bash
   cd apps/energy
   # Copy and edit the template
   ```

4. **Start Redis:**
   ```bash
   # In WSL2 terminal
   sudo service redis-server start
   ```

5. **Run the apps:**
   ```bash
   # From root directory
   npm run dev:auth      # Port 3000
   npm run dev:social    # Port 3001
   npm run dev:energy    # Port 3002
   ```

## 🔒 Security

- ✅ `.env.local` and `.env` files have been added to `.gitignore`
- ✅ Never commit `.env` files containing secrets to Git
- ✅ Use `.env.example` or templates in this doc to share configuration
- ⚠️ In production, use environment variables from your hosting platform

## 🚀 Production

In production, environment variables should be set via:
- **Vercel/Netlify**: Through dashboard settings
- **Docker**: Via docker-compose.yml or docker run -e
- **K8s**: Via ConfigMap/Secrets
