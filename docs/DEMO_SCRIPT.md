# CMPTS Demo Script (15 minutes)

## Before the Demo

1. Run `npm run build && npm run preview` OR deploy `dist/` to a public URL
2. On Android phone: open the URL → Add to Home Screen (install PWA)
3. Reset demo: Internal Portal → Reset Demo (sidebar)

---

## Flow A — Citizen Transparency (3 min)

1. **Homepage** — show hero, stats, featured projects
2. **Projects** — filter by Division: Raipur, Type: Road
3. Open **NH-30 Raipur-Bilaspur Road Widening** — show 62% progress timeline
4. Click **Lodge Complaint** — fill form, use mobile `9876543210`
5. **Send OTP** — point to amber banner showing demo OTP
6. Submit → receive Ticket ID (e.g. PWD-2026-0006)
7. **Track Complaint** — enter Ticket ID + mobile + OTP → show live status

## Flow B — Officer Accountability (4 min)

1. **Staff Login** → `amit.sharma@pwd.cg.gov.in` / `ee123`
2. **Dashboard** — new complaints, overdue highlighted in red
3. Open complaint **PWD-2026-0005** (safety hazard at Rajim Bridge)
4. Acknowledge → Assign to Vikram Singh → add public remark
5. Logout → login as `vikram.singh@pwd.cg.gov.in` / `handler123`
6. Update status to **In Progress** → **Resolved** with public remark
7. **Integrations** page — show SMS notification logged

## Flow C — Work Order Automation (2 min)

1. Login as Division Officer or Super Admin
2. **Work Orders** → Release new work order:
   - Name: "Raipur Smart City Footpath"
   - WO Ref: WO/CG/2026/1500
   - Division: Raipur, Type: Road
3. Green success banner — project auto-created
4. Open public **Projects** page — new project appears instantly

## Flow D — Governance (2 min)

1. Login as Super Admin: `rajesh.verma@pwd.cg.gov.in` / `admin123`
2. **Audit Log** — show tamper-evident action trail
3. **Reports** → Export Complaints CSV
4. Toggle **हिंदी** on public site — show bilingual UI
5. **Team** page — show role-based staff list

## Flow E — Mobile Demo (2 min)

1. On Android phone — open installed CMPTS app (full-screen PWA)
2. Lodge complaint using phone camera
3. On laptop — show complaint appear on officer dashboard

## Flow F — Roadmap Honesty (2 min)

Walk through `docs/REQUIREMENTS_TRACEABILITY.md`:
- What's live in this demo (Phase 1–2)
- Phase 2: Native Android/iOS apps
- Phase 3: CERT-In audit, GIGW/WCAG hardening
- Phase 4: On-prem production deployment with real DB, SMS, work-order API

---

## Talking Points

- "No manual project entry — work orders auto-create projects"
- "Citizens verify by OTP — only see their own complaints"
- "Every action is logged — full accountability"
- "Deploys as static files today; production architecture documented for on-prem PWD servers"
