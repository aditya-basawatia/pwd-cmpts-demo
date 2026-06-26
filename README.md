# PWD CMPTS — Complaint Management & Project Tracking System

Demo application for **PWD Chhattisgarh** tender presentation.

## Quick Start

```bash
cd cmpts
npm install
npm run dev
```

Open http://localhost:5173

**Live demo:** https://aditya-basawatia.github.io/pwd-cmpts-demo/

## Build for Deployment

```bash
npm run build
```

Output is in `dist/` — upload to **any static host** (Netlify, Vercel, GitHub Pages, S3, Nginx).

```bash
npm run deploy   # rebuilds and publishes to GitHub Pages
```

**Live URL:** https://aditya-basawatia.github.io/pwd-cmpts-demo/

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | rajesh.verma@pwd.cg.gov.in | admin123 |
| Department Admin | sunita.patel@pwd.cg.gov.in | dept123 |
| Division Officer | amit.sharma@pwd.cg.gov.in | ee123 |
| Complaint Handler | vikram.singh@pwd.cg.gov.in | handler123 |
| Viewer | priya.nair@pwd.cg.gov.in | viewer123 |

**Citizen demo mobile:** `9876543210` (OTP shown on screen in demo mode)

## Features

- Public project directory with search/filter
- Citizen complaint lodge + track (OTP demo)
- Internal RBAC portal (5 roles)
- Complaint lifecycle workflow
- Work order simulator (auto-create projects)
- Bilingual Hindi/English
- CSV export, audit log, notification console
- Installable PWA for Android demo
- Reset Demo button restores seed data

## Architecture

Pure static front-end — no database, no server. Data in `src/data/seed.ts`, state in `localStorage`.

See `docs/DEPLOYMENT.md` for hosting options and production roadmap.
