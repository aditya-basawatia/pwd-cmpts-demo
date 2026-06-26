# Requirements Traceability Matrix

Mapping PDF sections to demo implementation status.

| PDF Section | Requirement | Demo Status | Notes |
|-------------|-------------|-------------|-------|
| **4.1** | Browse/search/filter projects | ✅ Built | Public projects page |
| **4.2** | Project status + % timeline | ✅ Built | Project detail page |
| **4.3** | Lodge complaint + OTP + media | ✅ Built | OTP simulated on-screen |
| **4.4** | Track own complaint | ✅ Built | Ticket ID + mobile OTP |
| **5.1** | Staff login + dashboard | ✅ Built | Client-side RBAC |
| **5.2** | Complaint management workflow | ✅ Built | 8-state lifecycle |
| **5.3** | Auto project from work orders | ✅ Built | Work Order Simulator |
| **5.4** | Status updates with % | ✅ Built | Internal projects page |
| **5.5** | Team + master data admin | ✅ Partial | Team view; master data read-only |
| **6** | Complaint lifecycle (8 states) | ✅ Built | Full workflow |
| **7** | Milestones by project type | ✅ Partial | Timeline updates; templates in seed |
| **8.1** | Work order auto-creation | ✅ Built | Simulator page |
| **8.2** | SMS/Email/Push | ✅ Simulated | Integration console log |
| **9.1** | Mobile apps | ✅ PWA | Native apps = Phase 2 |
| **9.2** | Bilingual Hindi/English | ✅ Built | Toggle on all screens |
| **9.3** | Security (HTTPS, RBAC, audit) | ⚠️ Demo | Client-side only; prod = Phase 3 |
| **9.4** | GIGW / WCAG accessibility | ⚠️ Partial | Responsive; full audit = Phase 3 |
| **10.1** | On-premises deployment | 📋 Documented | Static demo now; prod in DEPLOYMENT.md |
| **10.2** | Roadmap Phases 1–4 | 📋 Documented | This demo = Phase 1–2 subset |

**Legend:** ✅ Built | ⚠️ Partial/Simulated | 📋 Documented for production | Phase 2+ = post-demo

## Phase Roadmap (from PDF Section 10.2)

| Phase | Focus | Status |
|-------|-------|--------|
| 1 | Project directory, search, status view, work-order auto-creation | ✅ Demo |
| 2 | Complaints, OTP, ticketing, internal workflow, PWA | ✅ Demo |
| 3 | Bilingual completion, accessibility, security audit | Phase 3 |
| 4 | Data migration, training, UAT, on-prem go-live | Phase 4 |
