# Physician Flow Dashboard

Liquid-glass inspired patient flow dashboard built with Vite, React, and TypeScript. The Node.js backend serves mock physician, patient, and appointment data for the Schedule and Patients views.

## Prerequisites

- Node.js 18+
- npm 10+

## Run frontend + backend together

```bash
npm install
npm --prefix backend install
npm run dev:all
```

- Frontend: http://localhost:3100
- Backend: http://localhost:4000/health

## Run services separately

```bash
# Frontend
npm run dev

# Backend
npm --prefix backend run dev
```

## OpenAPI type sync

The OpenAPI definition lives in `openapi.yaml`. Generate client/server types:

```bash
npm run openapi:typegen
```

## Database (Postgres)

The backend can read from Postgres via Prisma. Provide `DATABASE_URL` (for example in `backend/.env`).

Example connection string:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ehr_mock?schema=public"
```

Run migrations and seed the mock data:

```bash
npm --prefix backend run prisma:migrate
npm --prefix backend run prisma:seed
```

## Deploy on Render (free)

This repo includes a `render.yaml` blueprint that provisions:

- 1 free Postgres database
- 1 Node/Express web service (backend)
- 1 static site (frontend)

Steps:

1. Push the repo to GitHub (or GitLab).
2. In Render, choose **New > Blueprint** and select your repo.
3. When the blueprint creates services, update the env vars:
   - Backend `CORS_ORIGIN`: set to the frontend URL (for example, `https://ehr-mock-frontend.onrender.com`).
   - Frontend `VITE_API_BASE_URL`: set to the backend URL (for example, `https://ehr-mock-backend.onrender.com`).
4. Trigger a deploy for both services.

Notes:

- Free Render web services can sleep after inactivity. The first request may take a few seconds.
- If you want a different DB size or name, edit `render.yaml` before creating the blueprint.

Verify:

- Backend health: `GET https://<backend>.onrender.com/health`
- Frontend loads dashboard and patients data without CORS errors.

## Tests (integration)

```bash
npm install
npx playwright install
npm run test:e2e
```

## Unit tests (Vitest)

```bash
npm run test      # watch mode
npm run test:run  # run once
```

Vitest runs React Testing Library tests in `src/**/*.test.tsx`.

## Linting

```bash
npm run lint
npm --prefix backend run lint
```

## Project structure

- `src/App.tsx` - React Router routes and providers
- `src/pages` - route components and page styles (including `patients/patient`)
- `src/components` - reusable styled-components (glass UI)
- `backend/src` - Node.js API with mock data
- `tests` - Playwright integration tests
