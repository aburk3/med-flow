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
