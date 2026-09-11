# Attendly

**Track every lecture. Stay ahead of your attendance.**

Attendly is a student attendance tracker and timetable management web application.

This repository currently contains:
- **Phase 1** — project scaffold, marketing/landing experience, and a production-ready API skeleton.
- **Phase 2** — PostgreSQL + Prisma, JWT authentication, session persistence, and protected routes.
- **Phase 3** — user-scoped Subjects CRUD with validation, Zustand state, dialogs, and toast feedback.
- **Phase 4** — user-scoped Weekly Timetable Management connected to Subjects, persisted in PostgreSQL.

Each completed phase remains deployable without replacing the existing authentication, subject, frontend, or backend architecture.

---

## Tech Stack

**Frontend**
- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router
- React Hook Form + Zod (form state & validation)
- Zustand (auth state, persisted)
- Lucide React (icons)

**Backend**
- Node.js + Express
- TypeScript
- PostgreSQL + Prisma ORM
- JWT authentication (`jsonwebtoken`)
- bcrypt password hashing (`bcryptjs`)
- Zod (request validation)

---

## Project Structure

```
attendly/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/            # Reusable primitives (Button, Input, FormField, ...)
│   │   │   ├── landing/       # Landing-page sections
│   │   │   ├── auth/          # ProtectedRoute, AuthLoadingScreen
│   │   │   ├── toast/         # Toast notification system
│   │   │   ├── subjects/      # Subject CRUD UI
│   │   │   └── timetable/     # Weekly timetable UI
│   │   ├── pages/             # Route-level pages including Subjects and Timetable
│   │   ├── layouts/           # Shared page layouts
│   │   ├── store/             # Zustand auth store (persisted)
│   │   ├── schemas/           # Zod schemas for form validation
│   │   ├── services/          # API client + endpoint wrappers
│   │   ├── hooks/             # Reusable React hooks
│   │   ├── types/             # Shared TypeScript types
│   │   └── utils/             # Helper functions
│   ├── .env.example
│   └── package.json
│
├── server/                    # Express backend
│   ├── prisma/
│   │   ├── schema.prisma      # User model + datasource config
│   │   └── migrations/        # SQL migrations
│   ├── src/
│   │   ├── routes/            # Route definitions (mounted under /api)
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # authenticate, validate, error handling, 404
│   │   ├── validators/        # Zod schemas for request bodies
│   │   ├── config/            # env + Prisma client singleton
│   │   ├── types/             # Shared server types (SafeUser, Express augmentation)
│   │   └── utils/             # ApiError, asyncHandler, password hashing, JWT
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 13+ (local install, or a hosted instance such as Supabase, Neon, or Railway)

---

## Installation

```bash
# Client
cd client
npm install

# Server
cd ../server
npm install
```

---

## PostgreSQL Setup

You need a running PostgreSQL database before the server will start.

**Option A — local install**
```bash
# macOS (Homebrew)
brew install postgresql@16
brew services start postgresql@16
createdb attendly

# Ubuntu/Debian
sudo apt-get install postgresql
sudo service postgresql start
sudo -u postgres createdb attendly
```

**Option B — hosted database**
Create a free Postgres instance on a provider like [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app), and copy the connection string it gives you into `DATABASE_URL`.

Either way, set `server/.env`'s `DATABASE_URL` to point at it (see [Environment Variables](#environment-variables) below).

---

## Prisma Commands

Run these from the `server/` directory.

| Command | What it does |
|---|---|
| `npm run prisma:generate` | Generates the Prisma Client from `prisma/schema.prisma`. Run this after every `npm install` and after any schema change. |
| `npm run prisma:migrate` | Creates and applies a new migration in development (`prisma migrate dev`). Use this the first time you set up the database, and whenever you change `schema.prisma`. |
| `npm run prisma:migrate:deploy` | Applies existing migrations without prompting — the command to run in production/CI (`prisma migrate deploy`). |
| `npm run prisma:studio` | Opens Prisma Studio, a GUI for browsing/editing your database. |

**First-time setup**, after installing dependencies and setting `DATABASE_URL`:
```bash
cd server
npm run prisma:generate
npm run prisma:migrate
```
This generates the client and applies all pending migrations, including users, subjects, and timetable lectures.

> `npx prisma generate` and `npx prisma migrate` download a small database engine binary on first run — this requires normal internet access, which any standard local machine or CI runner has. It's a one-time step for the project, not something you need to repeat per-install (beyond re-running `generate` after `npm install`, since generated client files aren't committed to git).

---

## Environment Variables

Each app has its own `.env.example`. Copy it to `.env` before running.

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

### `client/.env`

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Base URL of the Attendly API | `http://localhost:5000` |

### `server/.env`

| Variable | Description | Default |
|---|---|---|
| `PORT` | Port the Express server listens on | `5000` |
| `NODE_ENV` | `development` \| `production` \| `test` | `development` |
| `CLIENT_URL` | Client origin, used to configure CORS | `http://localhost:5173` |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma | — (required) |
| `JWT_SECRET` | Secret used to sign and verify JWTs — use a long random string | — (required) |
| `JWT_EXPIRES_IN` | How long issued JWTs stay valid (e.g. `1h`, `7d`) | `7d` |

Generate a strong `JWT_SECRET` with:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

---

## Local Development

Run both apps in separate terminals.

**Terminal 1 — API server**
```bash
cd server
npm run prisma:generate   # first time only, or after schema changes
npm run prisma:migrate    # first time only, or after schema changes
npm run dev
```
Runs on `http://localhost:5000` with hot reload (via `tsx watch`).

**Terminal 2 — Client**
```bash
cd client
npm run dev
```
Runs on `http://localhost:5173` with Vite's dev server and HMR.

Visit `http://localhost:5173` and try the full flow: **Sign up → Dashboard → Logout → Log in again.**

---

## API Reference

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | — | API welcome message |
| GET | `/api/health` | — | Health check — `{ success, message }` |
| POST | `/api/auth/register` | — | Create an account. Body: `{ name, email, password }`. Returns `{ user, token }`. |
| POST | `/api/auth/login` | — | Log in. Body: `{ email, password }`. Returns `{ user, token }`. |
| GET | `/api/auth/me` | Bearer token | Returns the authenticated user. |
| POST | `/api/auth/logout` | — | Stateless logout acknowledgement (see note below). |
| GET | `/api/subjects` | Bearer token | List the authenticated user's subjects. |
| POST | `/api/subjects` | Bearer token | Create a subject. Body: `{ name, code?, faculty?, color? }`. |
| GET | `/api/subjects/:id` | Bearer token | Get one subject (`404` if missing, `403` if it belongs to another user). |
| PUT | `/api/subjects/:id` | Bearer token | Update a subject. Same ownership rules as GET. Blank optional fields clear that field. |
| DELETE | `/api/subjects/:id` | Bearer token | Delete a subject. Same ownership rules as GET. |
| GET | `/api/timetable` | Bearer token | List the authenticated user's lectures with subject details. |
| POST | `/api/timetable` | Bearer token | Create a lecture. Body: `{ subjectId, dayOfWeek, startTime, endTime, room? }`. |
| PUT | `/api/timetable/:id` | Bearer token | Update an owned lecture; subject ownership and resulting time range are revalidated. |
| DELETE | `/api/timetable/:id` | Bearer token | Delete an owned lecture. |
| * | `/api/*` (unmatched) / any unmatched route | — | Returns a consistent 404 JSON payload |

**Authentication:** send `Authorization: Bearer <token>` on any protected request. Tokens are stateless JWTs — there is no server-side session store or revocation list in this phase, so `/api/auth/logout` exists mainly as a clean, explicit endpoint for the client to call; the actual "logging out" happens by the client discarding its token. Passwords are hashed with bcrypt (12 salt rounds) and `passwordHash` is never included in any API response.

---

## Build Commands

**Client**
```bash
cd client
npm run build      # outputs static assets to client/dist
npm run preview    # preview the production build locally
```

**Server**
```bash
cd server
npm run prisma:generate     # ensure the Prisma Client is generated
npm run build                # compiles TypeScript to server/dist
npm start                    # runs the compiled server (node dist/server.js)
```

---

## Deployment

This project deploys as two independent services plus a database.

1. **Database** — provision a PostgreSQL instance (see [PostgreSQL Setup](#postgresql-setup)). Run `npx prisma migrate deploy` against it once (from the `server` directory, with `DATABASE_URL` set) to create the schema.
2. **Server** — deploy the `server` folder to any Node host (Render, Railway, Fly.io, EC2, etc.).
   - Build step: `npm install && npm run prisma:generate && npm run build`
   - Start command: `npm start`
   - Environment variables: `PORT`, `NODE_ENV=production`, `CLIENT_URL` (your deployed client's origin), `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`.
3. **Client** — deploy `client/dist` (after `npm run build`) to any static host (Vercel, Netlify, S3 + CloudFront, etc.). Set `VITE_API_URL` at build time to point at your deployed API.
   - Because this is a client-side-routed SPA (React Router), configure your static host to rewrite all paths to `index.html` (most platforms call this an "SPA fallback" or "rewrite rule"), otherwise a direct visit to e.g. `/dashboard` will 404 at the host level.

---

## Testing Checklist (Phase 2)

- [x] `npm run build` succeeds for the client
- [x] `npm run build` succeeds for the server
- [x] No TypeScript errors in client or server
- [x] No broken imports
- [x] `POST /api/auth/register` creates a user, hashes the password with bcrypt, returns `{ user, token }` with no `passwordHash`
- [x] Duplicate email on register returns `409`
- [x] Invalid email / weak password / missing name on register return `400` with a specific, friendly message
- [x] `POST /api/auth/login` with correct credentials returns `{ user, token }`
- [x] `POST /api/auth/login` with wrong password or unknown email returns a generic `401` (no account enumeration)
- [x] `GET /api/auth/me` returns the user for a valid token, `401` for missing/invalid/expired tokens
- [x] `POST /api/auth/logout` clears the client-side session
- [x] Full flow verified end-to-end: **Signup → Dashboard → Logout → Login again**, including a genuine page reload restoring the session via `/api/auth/me`, and an invalid/expired token correctly redirecting to `/login`
- [x] `/dashboard` redirects unauthenticated visitors to `/login`
- [x] Navbar shows Login/Get Started when logged out, Go to Dashboard/Logout when logged in
- [x] Signup and login forms show friendly, field-level validation errors
- [x] Toast notifications appear for login, signup, and logout
- [x] All Phase 1 functionality (landing page, `/api/health`, 404 handling, responsive layout) still works unchanged

---

## Testing Checklist (Phase 3)

- [x] `npm run build` succeeds for the client and server; no TypeScript errors in either
- [x] `npx prisma migrate deploy` applies `20260910000000_add_subjects` cleanly on top of `20260908000000_init`
- [x] `subjects` table has a foreign key to `users(id)` with `ON DELETE CASCADE`, and an index on `userId`
- [x] Every `/api/subjects*` route requires a valid bearer token (`401` without one)
- [x] `POST /api/subjects` requires `name`; `code`/`faculty`/`color` are optional; invalid `color` (not a hex code) returns `400`
- [x] `GET /api/subjects` for User A never returns User B's subjects, and vice versa
- [x] `GET/PUT/DELETE /api/subjects/:id` for a subject that doesn't exist returns `404`
- [x] `GET/PUT/DELETE /api/subjects/:id` for a subject owned by a different user returns `403`
- [x] `PUT /api/subjects/:id` updates only the fields provided, and clears an optional field left blank
- [x] Deleting a subject is permanent and removes it from the list immediately
- [x] `/subjects` redirects unauthenticated visitors to `/login` (via the existing `ProtectedRoute`)
- [x] Empty state, loading skeleton, and error state (with retry) all render correctly on `/subjects`
- [x] Add/Edit dialog validates input client-side and shows a success toast on save
- [x] Delete shows a confirmation dialog before removing a subject, then a "Subject deleted." toast
- [x] Sidebar (Dashboard, Subjects, disabled Timetable/Attendance/Analytics, Profile, Logout) renders on both Dashboard and Subjects pages, with a working responsive drawer on mobile
- [x] Refreshing the browser on `/subjects` re-fetches and shows previously created subjects (data is persisted in Postgres, not local state)
- [ ] Verified against a live-networked Prisma install — the sandbox this phase was built in cannot reach `binaries.prisma.sh` to download the query engine, so schema/isolation logic was instead verified directly against a local Postgres instance with equivalent SQL (see note below). Run `npm run prisma:generate` in a normal environment before first boot.

**Note on verification:** all TypeScript (client + server) compiles and both `npm run build`s succeed. The Prisma schema and hand-written migration were applied to a real local PostgreSQL 16 instance and exercised with the same queries the controllers issue — multi-user isolation (403 vs. 404), create/update/delete, clearing an optional field, and cascade delete were all confirmed to behave correctly. What could *not* be verified inside this build environment is booting the actual Express+Prisma server, because generating the real Prisma Client requires downloading its query engine binary from `binaries.prisma.sh`, which this sandbox has no network access to. This is specific to the sandbox, not the code — run `npm run prisma:generate` (as already documented above) on a machine with normal internet access and it will work as expected.

---

## Testing Checklist (Phase 4)

- [ ] `npm run prisma:generate` succeeds after installing server dependencies
- [ ] `npm run prisma:migrate:deploy` applies `20260910193000_add_timetable` without resetting data
- [ ] `npm run typecheck` and `npm run build` succeed in `server/`
- [ ] `npm run build` and `npm run lint` succeed in `client/`
- [ ] Every `/api/timetable*` endpoint returns `401` without a bearer token
- [ ] `GET /api/timetable` returns only the authenticated user's lectures, including subject details
- [ ] Creating or changing a lecture to another user's subject is rejected
- [ ] Invalid day/time values and start times greater than or equal to end times are rejected
- [ ] Updating/deleting another user's lecture is rejected
- [ ] Add, edit, delete, loading, error, and empty states work on `/timetable`
- [ ] Timetable persists after refresh and logout/login because records are stored in PostgreSQL
- [ ] Existing authentication, dashboard, and Subjects CRUD still work

### Phase 4 migration

For an existing deployed database, do **not** reset it. Apply committed migrations from `server/`:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate:deploy
```

No new environment variables were added in Phase 4. The existing `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`, and other Phase 2/3 variables remain in use.

---

## Architecture Notes for Future Phases

- **Subjects (Phase 3):** implemented — `server/src/routes/subjectRoutes.ts`, `server/src/controllers/subjectController.ts`, `server/src/validators/subjectValidators.ts`, and the `Subject` model in `schema.prisma`. Client: `client/src/pages/SubjectsPage.tsx`, `client/src/store/subjectsStore.ts`, `client/src/services/subjectService.ts`, `client/src/components/subjects/`. The shared authenticated shell (`client/src/layouts/AppLayout.tsx` + `client/src/components/layout/Sidebar.tsx`) is designed to wrap every future authenticated page the same way.
- **Timetable (Phase 4):** implemented — `TimetableLecture` model + additive migration, authenticated `/api/timetable` CRUD, ownership validation, `TimetablePage`, store/service/types/schemas, responsive weekly grid, dialogs, loading/error/empty states, and Sidebar navigation.
- **Attendance data (Phase 5+):** follow the same established route/controller/validator/Prisma/store/service/page pattern. Phase 4 intentionally does not implement attendance yet.
- **Token invalidation / real logout:** the current JWT setup is fully stateless. If you need real server-side logout (e.g. "log out of all devices"), add a denylist table (or a `tokenVersion` column on `User`, bumped on logout and checked in `authenticate`) — `server/src/controllers/authController.ts`'s `logout` function is already the single place to wire that in.
- **Password reset / email verification:** slot into `server/src/routes/authRoutes.ts` and `authController.ts` alongside the existing register/login handlers; the password hashing and JWT utilities in `server/src/utils/` are already reusable for this.

## Phase 5 – Attendance
Attendance records are date-only and use `PRESENT` or `ABSENT`. Scheduled lecture attendance is linked to a timetable lecture; manual records can exist without one. Apply the additive migration with `cd server && npm run prisma:migrate:deploy`, then run `npm run prisma:generate`. The Attendance page supports daily marking, updates, manual records and history.
