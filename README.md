# 🟣 Hubbble — Backend API

> A freelancer-focused SaaS backend for managing client portals, project timelines, file sharing, and public-facing project dashboards.

Built with **Fastify**, **Sequelize**, **PostgreSQL**, and **Supabase**.

---

## ✨ Features

- **JWT Authentication** — Register, login, and session management with bcrypt-hashed passwords
- **Client Management** — Create and organize clients under your account
- **Project Portals** — Full CRUD for projects, timeline updates, and file attachments
- **File Uploads** — Direct file uploads via Supabase Storage (multipart, 5 MB limit)
- **Public Portals** — Shareable, read-only project dashboards via unique slugs
- **Portal Branding** — Persist freelancer branding (name, tagline, accent color, avatar) and serve it via the public portal
- **Waitlist** — Pre-launch waitlist collection endpoint
- **Request Validation** — JSON Schema validation on all routes via Fastify
- **CORS Ready** — Pre-configured for cross-origin frontend apps

---

## 🏗️ Tech Stack

| Layer        | Technology                     |
| ------------ | ------------------------------ |
| Runtime      | Node.js                        |
| Framework    | Fastify 5                      |
| ORM          | Sequelize 6                    |
| Database     | PostgreSQL (local or Supabase) |
| Auth         | JWT + bcrypt                   |
| File Storage | Supabase Storage               |
| Dev Tools    | Nodemon, Sequelize CLI         |

---

## 📁 Project Structure

```
Hubbble-BE/
├── src/
│   ├── server.js              # Entry point — starts Fastify server
│   ├── app/
│   │   ├── index.js           # App builder (CORS, multipart, routes)
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── routes/            # Route definitions + JSON schemas
│   │   ├── middlewares/       # Auth middleware (JWT verification)
│   │   └── utils/             # Shared utilities
│   ├── models/                # Sequelize model definitions
│   ├── migrations/            # Database migration files
│   ├── seeders/               # Seed data (optional)
│   ├── config/
│   │   └── database.js        # DB config (dev / test / production)
│   └── lib/                   # Library helpers
├── .env.example               # Environment variable template
├── .sequelizerc               # Sequelize CLI path config
├── package.json
└── LICENSE                    # MIT
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** (local instance or [Supabase](https://supabase.com) project)
- **npm**

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Hubbble-BE.git
cd Hubbble-BE
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

```env
# Server
NODE_ENV=development
PORT=3000
HOST=0.0.0.0

# Database (local PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hubbble_dev
DB_USER=postgres
DB_PASS=postgres

# Supabase (required for auth & file storage)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key
DATABASE_URL=postgres://postgres:password@db.your-project-id.supabase.co:5432/postgres

# Supabase Storage
SUPABASE_STORAGE_BUCKET=project-files
```

### 4. Run database migrations

```bash
npm run db:migrate
```

### 5. Start the server

```bash
# Development (with hot-reload)
npm run dev

# Production
npm start
```

The server will start on `http://localhost:3000` by default.

---

## 📋 API Reference

All endpoints are prefixed with `/api/v1`. Protected routes require a `Bearer` token in the `Authorization` header.

### Health Check

| Method | Endpoint  | Auth | Description                |
| ------ | --------- | ---- | -------------------------- |
| GET    | `/health` | No   | Returns `{ status: 'ok' }` |

---

### 🔐 Authentication

| Method | Endpoint         | Auth | Description                    |
| ------ | ---------------- | ---- | ------------------------------ |
| POST   | `/auth/register` | No   | Register a new user            |
| POST   | `/auth/login`    | No   | Login and receive JWT tokens   |
| GET    | `/auth/me`       | Yes  | Get current authenticated user |

**Register body:**

```json
{
  "email": "you@example.com",
  "password": "min8chars",
  "full_name": "Jane Doe",
  "profession": "Designer"
}
```

**Login body:**

```json
{
  "email": "you@example.com",
  "password": "min8chars"
}
```

---

### 👥 Clients

| Method | Endpoint       | Auth | Description         |
| ------ | -------------- | ---- | ------------------- |
| POST   | `/clients`     | Yes  | Create a new client |
| GET    | `/clients`     | Yes  | List all clients    |
| GET    | `/clients/:id` | Yes  | Get client by ID    |
| DELETE | `/clients/:id` | Yes  | Delete a client     |

---

### 📂 Projects

| Method | Endpoint        | Auth | Description            |
| ------ | --------------- | ---- | ---------------------- |
| POST   | `/projects`     | Yes  | Create a new project   |
| GET    | `/projects`     | Yes  | List all projects      |
| GET    | `/projects/:id` | Yes  | Get project by ID      |
| PATCH  | `/projects/:id` | Yes  | Update project details |
| DELETE | `/projects/:id` | Yes  | Delete a project       |

#### Project Updates (Timeline)

| Method | Endpoint                          | Auth | Description                       |
| ------ | --------------------------------- | ---- | --------------------------------- |
| GET    | `/projects/recent-updates`        | Yes  | Get recent updates (all projects) |
| GET    | `/projects/:id/updates`           | Yes  | List updates for a project        |
| POST   | `/projects/:id/updates`           | Yes  | Add a timeline update             |
| DELETE | `/projects/:id/updates/:updateId` | Yes  | Delete a specific update          |

#### Project Files

| Method | Endpoint                      | Auth | Description               |
| ------ | ----------------------------- | ---- | ------------------------- |
| GET    | `/projects/:id/files`         | Yes  | List files for a project  |
| POST   | `/projects/:id/files`         | Yes  | Add a file link           |
| POST   | `/projects/:id/files/upload`  | Yes  | Upload a file (multipart) |
| DELETE | `/projects/:id/files/:fileId` | Yes  | Delete a specific file    |

---

### 🎨 Portal Branding

| Method | Endpoint    | Auth | Description                        |
| ------ | ----------- | ---- | ---------------------------------- |
| GET    | `/branding` | Yes  | Get my branding settings           |
| PUT    | `/branding` | Yes  | Create or update branding (upsert) |

**Upsert body:**

```json
{
  "name": "Jane Studio",
  "tagline": "Design & Development",
  "accent_color": "#7B61FF",
  "avatar_type": "emoji",
  "avatar_value": "🚀"
}
```

| Field          | Required    | Validation                                            |
| -------------- | ----------- | ----------------------------------------------------- |
| `name`         | Yes         | 1–100 characters                                      |
| `tagline`      | No          | Max 255 characters                                    |
| `accent_color` | Yes         | Hex color code (`#RRGGBB`)                            |
| `avatar_type`  | Yes         | `initials` \| `image` \| `emoji`                      |
| `avatar_value` | Conditional | Required for `image`/`emoji`, nullable for `initials` |

---

### 🌐 Public Portal

| Method | Endpoint        | Auth | Description                    |
| ------ | --------------- | ---- | ------------------------------ |
| GET    | `/public/:slug` | No   | View a project's public portal |

The public portal response includes freelancer branding fields (`accent_color`, `tagline`, `avatar_type`, `avatar_value`) from the `portal_brandings` table when available.

---

### 📝 Waitlist

| Method | Endpoint          | Auth | Description               |
| ------ | ----------------- | ---- | ------------------------- |
| POST   | `/waitlist`       | No   | Join the waitlist         |
| GET    | `/waitlist`       | No   | List all waitlist entries |
| GET    | `/waitlist/count` | No   | Get total waitlist count  |

---

## 🗄️ Data Models

```
User ──< Client ──< Project ──< ProjectUpdate
 │                      │
 │                      ├──< ProjectFile
 │                      │
 │                      └──< PublicPortalAccess
 │
 └── PortalBranding (1:1)

Waitlist (standalone)
```

| Model                | Description                                            |
| -------------------- | ------------------------------------------------------ |
| `User`               | Freelancer accounts with email, password, branding     |
| `Client`             | Clients belonging to a user                            |
| `Project`            | Projects linked to a client (active/waiting/completed) |
| `ProjectUpdate`      | Timeline entries for a project (title + content)       |
| `ProjectFile`        | File links or uploaded files for a project             |
| `PublicPortalAccess` | Tracks public portal slug access                       |
| `PortalBranding`     | Per-user branding: name, tagline, accent color, avatar |
| `Waitlist`           | Pre-launch email collection                            |

---

## 🗃️ Database Commands

```bash
# Run pending migrations
npm run db:migrate

# Undo last migration
npm run db:migrate:undo

# Run migrations in production
npm run db:migrate:prod
```

---

## 📜 Scripts

| Script            | Command                   | Description                     |
| ----------------- | ------------------------- | ------------------------------- |
| `dev`             | `npm run dev`             | Start with Nodemon (hot-reload) |
| `start`           | `npm start`               | Start in production mode        |
| `db:migrate`      | `npm run db:migrate`      | Run Sequelize migrations        |
| `db:migrate:undo` | `npm run db:migrate:undo` | Undo last migration             |
| `db:migrate:prod` | `npm run db:migrate:prod` | Run migrations (production)     |

---

## 🛡️ Environment Variables

| Variable                  | Required | Description                           |
| ------------------------- | -------- | ------------------------------------- |
| `NODE_ENV`                | No       | `development` / `production` / `test` |
| `PORT`                    | No       | Server port (default: `3000`)         |
| `HOST`                    | No       | Bind address (default: `0.0.0.0`)     |
| `DB_HOST`                 | No\*     | PostgreSQL host                       |
| `DB_PORT`                 | No\*     | PostgreSQL port                       |
| `DB_NAME`                 | No\*     | Database name                         |
| `DB_USER`                 | No\*     | Database username                     |
| `DB_PASS`                 | No\*     | Database password                     |
| `DATABASE_URL`            | Yes†     | Full connection string (Supabase)     |
| `SUPABASE_URL`            | Yes      | Supabase project URL                  |
| `SUPABASE_KEY`            | Yes      | Supabase anon/public key              |
| `SUPABASE_STORAGE_BUCKET` | Yes      | Storage bucket name for uploads       |

> \* Not required if `DATABASE_URL` is set.  
> † Required for production; optional in development if `DB_*` vars are set.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with 💜 by <a href="https://github.com/iyashlodaya">Yash Lodaya</a>
</p>
