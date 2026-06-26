# Deployment Guide

## Demo Deployment (Static — No Server)

### Option 1: Netlify (drag & drop)

1. `npm run build`
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag the `dist/` folder
4. Share the URL with client

### Option 2: Vercel

```bash
npx vercel --prod
```

### Option 3: GitHub Pages

1. Set `base: '/repo-name/'` in `vite.config.ts`
2. Build and push `dist/` to `gh-pages` branch
3. Enable GitHub Pages in repo settings

### Option 4: Any Web Server

Copy `dist/` contents to Nginx/Apache document root:

```nginx
server {
    listen 80;
    server_name cmpts.pwd.cg.gov.in;
    root /var/www/cmpts;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Android PWA Install

1. Open demo URL on Android Chrome
2. Menu → "Add to Home screen" / "Install app"
3. App launches full-screen with PWD icon

---

## Production Architecture (Post-Tender)

For go-live on PWD on-premises infrastructure:

```
Citizen/Staff → Nginx (TLS) → Next.js/Node API → PostgreSQL
                                    ↓
                              Media Storage (NFS)
                                    ↓
                    Work Order API / SMS Gateway / Email SMTP
```

- Database: PostgreSQL at State Data Centre
- Auth: Server-side RBAC + OTP via SMS gateway
- Media: Object storage on PWD servers
- Integrations: Real work-order feed, CERT-In safe-to-host audit
- Mobile: Native Android/iOS apps (Phase 2)

This demo uses client-side simulation; production replaces `localStorage` with API + database.
