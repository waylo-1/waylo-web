# waylo-web

Next.js frontend for Waylo — deployed on Vercel, reads from Aurora PostgreSQL.

## Pages

- `/` — Landing page + how it works + recent shared guides
- `/g/[id]` — Shared guide viewer (renders steps from DB)
- `/api/guide/[id]` — Serverless: fetch one guide
- `/api/guides` — Serverless: fetch recent guides

## Local dev

```bash
npm install
cp .env.example .env.local
# Fill in DATABASE_URL with your Aurora endpoint
npm run dev
```

## Deploy to Vercel

1. Push this folder to a GitHub repo (e.g. `waylo-1/waylo-web`)
2. Go to vercel.com → Add New Project → import the repo
3. Set environment variable: `DATABASE_URL = postgresql://postgres:Waylo2026!@YOUR_AURORA_ENDPOINT:5432/waylo`
4. Deploy

Vercel auto-deploys on every push to main.

## Aurora connection string format

```
postgresql://postgres:Waylo2026!@waylo-aurora-cluster.cluster-xxxx.ap-south-1.rds.amazonaws.com:5432/waylo?sslmode=require
```

Get the endpoint from AWS Console → RDS → your Aurora cluster → "Writer endpoint".
