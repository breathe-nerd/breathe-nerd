# Architecture

This document describes the intended project scaffold and major boundaries for Breathe Nerd.

It is not a task list and it is not a final implementation plan. Students should use it as a shared map while still making implementation decisions in their own code.

## Scope Boundary

The MVP architecture supports:

- React frontend.
- Express backend.
- Supabase PostgreSQL database.
- User signup, login, logout, and auth verification.
- bcrypt password hashing.
- Server-side auth sessions.
- Protected routes.
- One guided breathing exercise page.
- Database structure prepared for future breathing-session tracking.

The MVP does not require:

- Mood check-ins.
- Saving completed breathing sessions.
- Dashboard UI.
- Dashboard stats endpoints.
- Multiple breathing exercises.
- Chrome extension or Pomodoro flow.

## Project Scaffold

The current project shape is:

```text
breathe-nerd/
|-- client/
|   |-- index.html
|   |-- vite.config.ts
|   |-- tsconfig.json
|   |-- favicon.png
|   `-- src/
|       |-- main.tsx
|       |-- App.tsx
|       |-- App.css
|       |-- index.css
|       |-- types.ts
|       |-- assets/
|       |   `-- ocean-waves.mp3
|       `-- components/
|           |-- LoginModal.tsx
|           `-- BreathingPage.tsx
|-- server/
|   |-- server.ts
|   |-- routes/
|   |   `-- auth.ts
|   |-- middleware/
|   |   `-- isAuthenticated.ts
|   |-- db/
|   |   `-- supabaseClient.ts
|   `-- test/
|       |-- signup.test.ts
|       |-- verify.test.ts
|       `-- isAuthenticated.test.ts
|-- docs/
|   |-- README.md
|   |-- PROJECT_BRIEF.md
|   |-- API_CONTRACT.md
|   |-- DATABASE_SCHEMA.md
|   |-- architecture.md
|   |-- roadmap.md
|   |-- TODO.md
|   `-- FEATURE_OWNERSHIP.md
|-- .github/
|   `-- PULL_REQUEST_TEMPLATE.md
|-- package.json
|-- package-lock.json
|-- tsconfig.json
|-- tsconfig.app.json
|-- tsconfig.node.json
|-- vitest.config.ts
|-- eslint.config.js
|-- AGENTS.md
|-- CONTRIBUTING.md
|-- README.md
`-- .gitignore
```

The repo currently uses one root `package.json` for both the client and server scripts. Local environment variables belong in an untracked `.env` file.

## Frontend Responsibilities

The frontend is responsible for user interaction, local UI state, and calling the backend API.

### `main.tsx`

React entry point.

Expected responsibility:

- Mount the React app into the DOM.
- Import global styles.

### `App.tsx`

Top-level frontend shell.

Expected MVP responsibilities:

- Hold the current `user` state.
- Check whether the user is already logged in when the app loads.
- Call the auth verification endpoint.
- Render auth UI when no user is logged in.
- Render the protected breathing page when a user is logged in.
- Handle logout.

Recommended auth check:

```text
GET /auth/verify
```

Use one auth-check route consistently. The project docs currently use `/auth/verify`.

### `LoginModal.tsx`

Login and signup UI.

Expected MVP responsibilities:

- Toggle between login and signup forms.
- Hold `email`, `password`, and `name` form state locally.
- Call signup and login endpoints.
- Pass the logged-in user back up to `App.tsx` after success.

MVP endpoints:

```text
POST /auth/signup
POST /auth/login
```

Use one signup route consistently. The project docs currently prefer `/auth/signup` over `/auth/register`.

### `BreathingPage.tsx`

Protected breathing exercise page.

Expected MVP responsibilities:

- Display one guided breathing exercise.
- Show the current breathing phase, such as `Inhale`, `Hold`, or `Exhale`.
- Run the breathing timer.
- Keep the breathing circle animation synced with the timer.
- Support a simple start to breathing to done flow.

Future stretch responsibilities:

- Add mood check-ins before and after the breathing exercise.
- Save completed breathing sessions.
- Send breathing-session data to the backend.

Stretch endpoint:

```text
POST /breathing-sessions
```

### CSS Files

Suggested split:

- `index.css` for global reset, base font, body styles, and background.
- `App.css` for app layout, modal styling, breathing circle styling, and animation keyframes.

### `types.ts`

Shared frontend types.

Keep this file small. Only add types that are used in more than one place.

Possible MVP type:

```ts
type User = {
  id: string;
  email: string;
  name: string;
};
```

Possible stretch type:

```ts
type BreathingSession = {
  mood_before: number;
  mood_after: number;
  duration_seconds: number;
  completed: boolean;
};
```

## Backend Responsibilities

The backend is responsible for authentication, protected API routes, password hashing, server-side auth sessions, and database access.

### `server.ts`

Express app entry point.

Expected responsibilities:

- Create the Express app.
- Configure JSON parsing.
- Configure session middleware.
- Register routes.
- Start the server.

### `routes/`

Routes define API URLs and connect them to controller functions.

MVP auth routes:

```text
POST /auth/signup
POST /auth/login
POST /auth/logout
GET /auth/verify
```

Future stretch breathing-session routes:

```text
POST /breathing-sessions
GET /breathing-sessions
GET /breathing-sessions/stats
```

Do not name the stretch routes `/sessions`; that can be confused with auth sessions.

### `controllers/`

Controllers hold request and response logic.

For a small app, controllers are optional. If route files become hard to read, move the logic into controllers.

Good controller candidates:

- signup user
- login user
- logout user
- return current logged-in user

Future controller candidates:

- save completed breathing session
- list breathing sessions for the logged-in user
- calculate breathing-session stats

### `middleware/isAuthenticated.ts`

Middleware for protected routes.

Expected responsibilities:

- Check whether an auth session exists.
- Allow the request to continue if the user is logged in.
- Return `401` JSON if the user is not logged in.

For an API used by React, returning JSON is usually better than redirecting from the backend. The frontend can decide what to show after a `401`.

### `db/supabase.ts`

Central Supabase client setup.

Expected responsibilities:

- Read Supabase configuration from environment variables.
- Export a configured Supabase client.
- Keep database connection setup out of route handlers.

## Data Flow

### MVP Auth Flow

```text
User submits signup/login form
-> React calls Express auth route
-> Express validates input
-> Express hashes or verifies password with bcrypt
-> Express reads or writes user data in Supabase
-> Express creates auth session
-> React stores returned safe user object
-> React renders protected breathing page
```

Safe user object means no `password_hash`.

### MVP Protected Route Flow

```text
React loads app
-> React calls GET /auth/verify
-> Express checks auth session
-> If logged in, Express returns current user
-> If not logged in, Express returns 401
-> React renders either LoginModal or BreathingPage
```

### Stretch Breathing-Session Flow

This flow is for later work, after the MVP is stable.

```text
User completes breathing exercise
-> React sends breathing-session data
-> Express reads user ID from auth session
-> Express saves breathing-session record
-> Dashboard fetches user-specific breathing-session history and stats
```

The frontend should not send `user_id` for protected breathing-session data. The backend should get `user_id` from the logged-in auth session.

## Database Boundary

MVP database work:

- Create or prepare the `users` table.
- Prepare structure for future `breathing_sessions`.
- Keep auth session data separate from breathing-session records.

Future stretch database work:

- Save completed breathing-session records.
- Add mood ratings.
- Calculate dashboard stats.

See `DATABASE_SCHEMA.md` for table details.

## API Naming Decisions

Use these names consistently:

```text
POST /auth/signup
POST /auth/login
POST /auth/logout
GET /auth/verify
```

Future stretch routes:

```text
POST /breathing-sessions
GET /breathing-sessions
GET /breathing-sessions/stats
```

Avoid these names:

```text
POST /auth/register
GET /auth/me
POST /sessions
GET /sessions
GET /sessions/stats
```

Those names appeared in early notes, but the current project docs prefer `/auth/signup`, `/auth/verify`, and `/breathing-sessions`.

## Security Notes

- Store bcrypt password hashes, never plain text passwords.
- Do not return `password_hash` to the frontend.
- Store auth state in server-side auth sessions.
- Protect private routes with `isAuthenticated`.
- Return `401` for unauthenticated API requests.
- Never trust `user_id` from the frontend for protected data.
- Keep secrets in `.env`; do not commit them.

## Design Notes From Team Input

Current frontend design choices:

- Calm dark background around `#404040`.
- Warm breathing circle color around `#E8D588`.
- App text uses `Quicksand`.
- Breathing circle animation synced to inhale, hold, and exhale phases.
- Looping ocean-wave audio starts after successful login/signup while audio is enabled.
- A fixed audio toggle lets authenticated users turn the looping audio off or back on.

Browser audio should still only start after user interaction, such as submitting the login/signup form or pressing an audio control. The current app keeps the audio object stable with `useRef` instead of creating a new `Audio` instance on every render.
