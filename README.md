<div align="center">

# 🔴 Waylo — Website

**The Waylo landing page, downloads, and shared-guide viewer.** Next.js on Vercel, reads from Aurora PostgreSQL.

[![Live](https://img.shields.io/badge/live-waylo--web.vercel.app-6C4CF1)](https://waylo-web-virid.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-Vercel-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Postgres](https://img.shields.io/badge/Aurora-PostgreSQL-336791?logo=postgresql&logoColor=white)](https://aws.amazon.com/rds/aurora/)

**🌐 [Live site](https://waylo-web-virid.vercel.app)  ·  ⬇️ [Download for Mac](https://waylo-web-virid.vercel.app/Waylo-macOS.dmg)  ·  ⬇️ [Download for Android](https://waylo-web-virid.vercel.app/waylo.apk)**

</div>

The public face of [**Waylo**](https://github.com/waylo-1) — AI on-screen guidance that points a glowing red dot at exactly what to tap next, in any app, on **macOS and Android**. This site hosts the landing page, the app downloads, and a viewer for guides users share.

---

## 📄 Pages & routes

| Route | What it does |
|-------|--------------|
| `/` | Landing page — what Waylo does, how it works, and the **download buttons** (macOS + Android) |
| `/g/[id]` | Shared-guide viewer — renders a saved guide's steps from the database |
| `/api/guides` | Serverless: fetch recent shared guides |
| `/api/guide/[id]` | Serverless: fetch one guide by id |

**Downloads** are served straight from `public/`:
- `Waylo-macOS.dmg` → https://waylo-web-virid.vercel.app/Waylo-macOS.dmg
- `waylo.apk` → https://waylo-web-virid.vercel.app/waylo.apk

---

## 🗂 Structure

```
src/
├── app/
│   ├── page.tsx        → landing page
│   ├── g/[id]/         → shared-guide viewer
│   ├── api/            → serverless routes (guides)
│   ├── layout.tsx, globals.css, not-found.tsx
├── components/         → UI components
└── lib/                → DB access (Aurora / pgvector)
public/                 → Waylo-macOS.dmg, waylo.apk, assets
```

---

## 💻 Local development

```bash
npm install
cp .env.example .env.local     # then fill in DATABASE_URL (see below)
npm run dev                    # http://localhost:3000
```

---

## 🔐 Environment variables

Set these locally in `.env.local` and, in production, in **Vercel → Project Settings → Environment Variables**. **Never commit real values** — keep secrets out of the repo.

| Var | Purpose |
|-----|---------|
| `DATABASE_URL` | Aurora PostgreSQL connection string (see format below) |
| `BACKEND_URL` | *(optional)* base URL if you proxy some calls to the EC2 backend |

**`DATABASE_URL` format** (fill in your own host + password — do **not** paste real credentials into this file):

```
postgresql://<user>:<password>@<aurora-writer-endpoint>:5432/waylo?sslmode=require
```

Get the writer endpoint from **AWS Console → RDS → your Aurora cluster → "Writer endpoint"**. Store the password in the environment only — if it has ever been committed, rotate it.

---

## 🚀 Deploy

Hosted on **Vercel**, auto-deploying on every push to `main`:

1. Import the repo at [vercel.com](https://vercel.com) → **Add New Project**.
2. Add the environment variables above (especially `DATABASE_URL`).
3. Deploy. Every push to `main` redeploys automatically.

---

<div align="center">

**Part of [Waylo](https://github.com/waylo-1)** · [Apps](https://github.com/waylo-1/frontend_systemsettings_overlay) · [Backend](https://github.com/waylo-1/backend_initial)

</div>
