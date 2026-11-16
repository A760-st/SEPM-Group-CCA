# Project Risk Management Plan
## College Event Management System (SEPM-Group-CCA)

| Item | Details |
|---|---|
| **Project** | College Event Management System |
| **Document** | Risk Management Plan & Risk Register |
| **Version** | 1.0 |
| **Date** | 16 Nov 2026 |
| **Prepared by** | Person 4 – Project Management & Documentation |
| **Status** | Draft – pending team review |
| **Based on** | Project Plan (12 Nov 2026), System Architecture (13 Nov 2026), WBS |

---

## 1. Purpose

This document identifies, assesses, and plans responses for risks that could affect the successful delivery of the College Event Management System. It serves as the primary risk management artifact for the project and will be updated throughout the project lifecycle as new risks emerge and existing risks evolve.

**Scope**: Covers all project phases from requirements through final delivery (WBS phases 1.0–7.0).

**Risk Management Process**:
1. **Identify** – Capture risks from team input, design reviews, and historical data
2. **Analyze** – Assess probability and impact (qualitative + quantitative where possible)
3. **Plan Response** – Define mitigation, contingency, or acceptance strategies
4. **Monitor & Control** – Review risks at each milestone, update register, escalate when thresholds are exceeded

---

## 2. Risk Assessment Methodology

### 2.1 Probability Scale

| Rating | Score | Description |
|---|---|---|
| Very Low | 1 | Rare; unlikely to occur under normal circumstances |
| Low | 2 | Unlikely; may occur once during project |
| Medium | 3 | Possible; could occur once or twice |
| High | 4 | Likely; expected to occur |
| Very High | 5 | Almost certain; will occur without intervention |

### 2.2 Impact Scale

| Rating | Score | Schedule | Cost / Effort | Quality / Scope |
|---|---|---|---|---|
| Very Low | 1 | < 1 day delay | < 5% budget | Cosmetic only |
| Low | 2 | 1–2 days | 5–10% | Minor rework, non-critical feature |
| Medium | 3 | 3–5 days | 10–20% | Major feature delayed, workaround needed |
| High | 4 | 1–2 weeks | 20–40% | Critical feature at risk, scope reduction likely |
| Very High | 5 | > 2 weeks | > 40% | Project failure, deliverables not met |

### 2.3 Risk Score = Probability × Impact (Range: 1–25)

| Score Range | Priority | Response Urgency |
|---|---|---|
| 1–4 | **Low** | Monitor; no immediate action |
| 5–9 | **Medium** | Plan mitigation; assign owner |
| 10–14 | **High** | Active mitigation required; weekly review |
| 15–25 | **Critical** | Immediate action; daily tracking; escalate to stakeholders |

---

## 3. Risk Register

### 3.1 Technical Risks

| ID | Risk Description | Category | Probability | Impact | Score | Priority | Owner | Trigger / Early Warning |
|---|---|---|---|---|---|---|---|---|
| T-01 | **Backend not implemented** – Frontend currently runs on mock backend (`VITE_USE_MOCK=true`). Real Express/Prisma/PostgreSQL backend does not exist in repository. Integration will require full backend development. | Technical | 5 (Very High) | 5 (Very High) | **25** | **Critical** | Person 3 | No `/server` directory in repo; `BACKEND_INTEGRATION_GUIDE.md` exists but no implementation |
| T-02 | **API contract mismatch** – Frontend services (`apiClient.js`, `authService.js`, `eventService.js`, etc.) expect specific response shapes. Backend implementation may deviate from `API_CONTRACT.md`. | Technical | 4 (High) | 4 (High) | **16** | **Critical** | Person 3 | Frontend services already written against mock data shapes |
| T-03 | **Database schema drift** – Prisma schema (`schema.prisma`) and SQL DDL (`SEPM_Database_Schema.sql`) must stay in sync. Manual changes to one without the other cause migration failures. | Technical | 3 (Medium) | 4 (High) | **12** | **High** | Person 2 / Person 3 | Two schema representations exist; Prisma Migrate vs raw SQL path documented |
| T-04 | **Certificate PDF generation failures** – PDFKit on server + html2canvas/jspdf on client. Font loading, layout shifts, or file system permissions may break certificate downloads. | Technical | 3 (Medium) | 3 (Medium) | **9** | **Medium** | Person 3 | Certificate generation involves multiple libraries (PDFKit, html2canvas, jspdf) |
| T-05 | **Role-based access control gaps** – Frontend route guards (`ProtectedRoute.jsx`) and backend middleware must align. Missing server-side checks = privilege escalation. | Technical | 3 (Medium) | 5 (Very High) | **15** | **Critical** | Person 3 | Security design emphasizes RBAC; architecture docs flag privilege escalation as key concern |
| T-06 | **Unique constraint violations under concurrency** – Duplicate registration prevention relies on DB unique constraint + service check. Race conditions may cause 500 errors instead of clean 409 responses. | Technical | 3 (Medium) | 3 (Medium) | **9** | **Medium** | Person 3 | Architecture docs acknowledge this; service layer must handle `unique_constraint` errors |
| T-07 | **File storage for certificates** – Local disk storage (`certificates/` folder) not backed up, not shared across instances. Scaling or container restarts lose files. | Technical | 3 (Medium) | 3 (Medium) | **9** | **Medium** | Person 3 | Architecture explicitly chooses local disk; no S3/cloud storage planned |
| T-08 | **React 19 + Vite 8 compatibility issues** – New major versions may have breaking changes vs tutorials/docs the team references. | Technical | 2 (Low) | 3 (Medium) | **6** | **Medium** | Person 3 | `package.json` shows React 19.3.1, Vite 8.3.8 – very recent |
| T-09 | **Missing automated tests** – No test files visible in repository. Jest/Supertest/RTL planned but not implemented. Regression risk high during integration. | Technical | 4 (High) | 3 (Medium) | **12** | **High** | Person 3 | Architecture specifies testing stack; no `tests/` directory or test scripts in `package.json` |
| T-10 | **Environment configuration drift** – Frontend uses `.env` for `VITE_API_BASE_URL` and `VITE_USE_MOCK`. Mismatch between local, CI, and production configs causes silent failures. | Technical | 3 (Medium) | 2 (Low) | **6** | **Medium** | Person 3 | Dual-mode architecture documented; `.env` not committed |

---

### 3.2 Schedule Risks

| ID | Risk Description | Category | Probability | Impact | Score | Priority | Owner | Trigger / Early Warning |
|---|---|---|---|---|---|---|---|---|
| S-01 | **Aggressive milestone dates** – Project Plan shows 6 milestones in 6 days (13–18 Nov 2026). Development + testing in 1 day (17 Nov) is unrealistic for full stack. | Schedule | 5 (Very High) | 5 (Very High) | **25** | **Critical** | Person 4 | Milestone table in Project Plan; WBS shows 40+ tasks |
| S-02 | **Sequential dependency chain** – WBS shows Person 1 (requirements) → Person 2 (design) → Person 3 (dev) → Person 3 (test). Any delay in early phases cascades with no buffer. | Schedule | 4 (High) | 4 (High) | **16** | **Critical** | Person 4 | WBS dependencies column; Person 3 has 8 development tasks dependent on design handover |
| S-03 | **Backend development not started** – No server code in repo. Person 3 must build entire Express/Prisma backend from scratch in parallel with frontend integration. | Schedule | 5 (Very High) | 5 (Very High) | **25** | **Critical** | Person 3 | Repository has only `client/` and `docs/`; no `server/` directory |
| S-04 | **Integration testing underestimated** – Connecting mock-backed frontend to real backend typically reveals 20–30% additional defects. Only 1 day allocated for "Development and testing" (17 Nov). | Schedule | 4 (High) | 4 (High) | **16** | **Critical** | Person 3 | WBS 5.0 testing phase depends on 4.9 integration complete |
| S-05 | **Team member availability** – 4-person student team; academic conflicts, exams, or illness could reduce capacity by 25–50%. | Schedule | 4 (High) | 3 (Medium) | **12** | **High** | Person 4 | University coursework context; no dedicated full-time allocation |
| S-06 | **Scope creep from stakeholder feedback** – Demo to stakeholders may generate new feature requests (payments, QR attendance, notifications) that are explicitly out of scope. | Schedule | 3 (Medium) | 3 (Medium) | **9** | **Medium** | Person 4 | Project Plan Section 3.2 lists 5 out-of-scope items; easy to be pulled back in |
| S-07 | **Jira/task tracking overhead** – WBS requires detailed Jira tracking (6.1–6.5). Administrative burden may consume development time if not streamlined. | Schedule | 2 (Low) | 2 (Low) | **4** | **Low** | Person 4 | WBS 6.0–6.5 dedicated to monitoring |

---

### 3.3 Resource / People Risks

| ID | Risk Description | Category | Probability | Impact | Score | Priority | Owner | Trigger / Early Warning |
|---|---|---|---|---|---|---|---|---|
| R-01 | **Single developer for full stack** – Person 3 responsible for all backend + frontend integration + testing. Bus factor = 1. | Resource | 4 (High) | 5 (Very High) | **20** | **Critical** | Person 4 | WBS 4.0–5.0 all assigned to Person 3 |
| R-02 | **Skill gaps in backend technologies** – Team may lack experience with Express, Prisma, PostgreSQL, JWT, bcrypt, PDFKit. Learning curve consumes schedule. | Resource | 3 (Medium) | 3 (Medium) | **9** | **Medium** | Person 3 | Architecture specifies specific stack; university project = learning context |
| R-03 | **Knowledge silos** – Person 1 (requirements), Person 2 (design), Person 3 (dev), Person 4 (PM) have distinct responsibilities. Handoff gaps cause rework. | Resource | 3 (Medium) | 3 (Medium) | **9** | **Medium** | Person 4 | WBS shows clear handoffs (2.6, 3.5) but no overlap |
| R-04 | **No dedicated QA/resource** – Testing (5.0–5.8) also assigned to Person 3. Developer testing own code misses blind spots. | Resource | 4 (High) | 3 (Medium) | **12** | **High** | Person 3 | WBS 5.1–5.8 all Person 3; Person 1 only "supports requirement checks" |
| R-05 | **Communication breakdown** – Distributed/async coordination via Jira + meetings. Missed decisions or unclear requirements cause misaligned implementation. | Resource | 3 (Medium) | 3 (Medium) | **9** | **Medium** | Person 4 | WBS 6.3–6.4 address this but depend on discipline |

---

### 3.4 Scope & Requirements Risks

| ID | Risk Description | Category | Probability | Impact | Score | Priority | Owner | Trigger / Early Warning |
|---|---|---|---|---|---|---|---|---|
| SC-01 | **Incomplete requirements baseline** – Person 1 deliverables (2.1–2.6) may not fully cover edge cases (e.g., waitlists, recurring events, multi-session events, email notifications). | Scope | 3 (Medium) | 3 (Medium) | **9** | **Medium** | Person 1 | Requirements phase not yet reviewed by team (WBS 2.6 pending) |
| SC-02 | **Administrator role ambiguity** – Project Plan says Admin is "optional" (3.1, 10); Architecture implements it as core role. Mismatch causes scope disputes. | Scope | 3 (Medium) | 2 (Low) | **6** | **Medium** | Person 4 | Project Plan Section 3.1 vs Architecture Section 1 Row 21 |
| SC-03 | **Certificate eligibility rules undefined** – When is a participant "eligible"? Architecture says organizer marks it; no automated attendance. Subjective criteria may cause disputes. | Scope | 3 (Medium) | 2 (Low) | **6** | **Medium** | Person 1 / Person 2 | Data Dictionary rule 8; no attendance verification in scope |
| SC-04 | **Venue clash check complexity** – Backend must check overlapping events per venue. Edge cases: timezone, recurring events, setup/teardown time not modeled. | Scope | 2 (Low) | 3 (Medium) | **6** | **Medium** | Person 2 / Person 3 | Architecture rule 7; single start/end time per event |

---

### 3.5 Quality & Testing Risks

| ID | Risk Description | Category | Probability | Impact | Score | Priority | Owner | Trigger / Early Warning |
|---|---|---|---|---|---|---|---|---|
| Q-01 | **No test automation** – Zero test files in repo. Manual testing only. High regression risk during backend integration and iterative development. | Quality | 5 (Very High) | 4 (High) | **20** | **Critical** | Person 3 | Architecture Section 10 specifies Jest/Supertest/RTL; not implemented |
| Q-02 | **Mock backend masks real bugs** – Frontend developed against `mockBackend.js` with perfect responses. Real backend will have latency, errors, validation differences. | Quality | 4 (High) | 4 (High) | **16** | **Critical** | Person 3 | `VITE_USE_MOCK=true` default; `mockBackend.js` simulates ideal behavior |
| Q-03 | **Browser/device compatibility untested** – Tailwind + React should be responsive, but no cross-browser testing plan documented. | Quality | 3 (Medium) | 2 (Low) | **6** | **Medium** | Person 3 | Architecture NFR: "Responsive layout so the web app works on phones" |
| Q-04 | **Accessibility (a11y) not addressed** – No mention of WCAG, ARIA, keyboard navigation in requirements or design. | Quality | 3 (Medium) | 2 (Low) | **6** | **Medium** | Person 1 / Person 2 | Not in Project Plan NFRs or Architecture |
| Q-05 | **Performance at scale unvalidated** – Database indexes designed but no load testing. N+1 queries in Prisma, missing indexes, or certificate PDF generation under load may degrade UX. | Quality | 2 (Low) | 3 (Medium) | **6** | **Medium** | Person 3 | Architecture Section 11 lists indexes; prototype scope = small data |

---

### 3.6 Security Risks

| ID | Risk Description | Category | Probability | Impact | Score | Priority | Owner | Trigger / Early Warning |
|---|---|---|---|---|---|---|---|---|
| SEC-01 | **JWT secret management** – Secret must be in `.env`, not committed. Weak or leaked secret = full account takeover. | Security | 3 (Medium) | 5 (Very High) | **15** | **Critical** | Person 3 | Architecture Section 10: "secret kept in environment variables" |
| SEC-02 | **Password hashing not verified** – bcrypt specified but implementation must use sufficient rounds (10+). Fast hash = credential stuffing risk. | Security | 2 (Low) | 5 (Very High) | **10** | **High** | Person 3 | Architecture Section 10 Row 1; Data Dictionary `password_hash` |
| SEC-03 | **SQL injection via raw queries** – Prisma ORM protects, but any raw SQL (`$queryRaw`) bypasses protection. | Security | 2 (Low) | 4 (High) | **8** | **Medium** | Person 3 | Architecture: "parameterized queries through the ORM prevent SQL injection" |
| SEC-04 | **CORS misconfiguration** – Frontend expects `origin: http://localhost:5173` with credentials. Overly permissive CORS = CSRF/data leak. | Security | 3 (Medium) | 4 (High) | **12** | **High** | Person 3 | Backend Integration Guide Section 2 shows exact CORS config |
| SEC-05 | **Certificate file path traversal** – `file_path` stored in DB, served via download endpoint. Insufficient validation = arbitrary file read. | Security | 2 (Low) | 4 (High) | **8** | **Medium** | Person 3 | Architecture: "files not served from a public folder"; download endpoint checks ownership |
| SEC-06 | **Rate limiting missing** – Architecture Section 10 Row 14 lists "Rate limiting on login and registration endpoints" but not implemented. | Security | 3 (Medium) | 3 (Medium) | **9** | **Medium** | Person 3 | Explicitly called out in architecture as needed |
| SEC-07 | **No email verification** – Architecture Section 10: "Email verification not included, to keep prototype simple." Accounts can be created with fake emails. | Security | 3 (Medium) | 2 (Low) | **6** | **Medium** | Person 1 / Person 3 | Explicitly accepted risk in architecture |

---

### 3.7 Integration & Deployment Risks

| ID | Risk Description | Category | Probability | Impact | Score | Priority | Owner | Trigger / Early Warning |
|---|---|---|---|---|---|---|---|---|
| I-01 | **Frontend-backend version skew** – Frontend deployed to Vercel (live demo). Backend runs locally. No shared versioning or contract testing. | Integration | 4 (High) | 3 (Medium) | **12** | **High** | Person 3 | Live demo URL in README; backend not deployed |
| I-02 | **Database migration failures** – Prisma Migrate vs raw SQL script divergence (Schema Design Section N.C1). Production DB may not match dev. | Integration | 3 (Medium) | 4 (High) | **12** | **High** | Person 2 / Person 3 | Two schema sources; CHECK vs ENUM conflict documented |
| I-03 | **Vercel SPA routing** – `vercel.json` handles client-side routes. API calls to `/api/*` must proxy to backend or fail in production. | Integration | 3 (Medium) | 3 (Medium) | **9** | **Medium** | Person 3 | `client/vercel.json` exists; no rewrite rules for API proxy visible |
| I-04 | **Environment variable mismatch** – Local `.env`, Vercel project settings, and backend `.env` must align (`VITE_API_BASE_URL`, JWT secret, DB URL). | Integration | 3 (Medium) | 3 (Medium) | **9** | **Medium** | Person 3 | Dual-mode architecture; multiple deployment targets |
| I-05 | **Certificate file storage in serverless** – If backend moves to serverless (Vercel Functions, Railway, Render), local disk storage fails. | Integration | 2 (Low) | 4 (High) | **8** | **Medium** | Person 3 | Architecture explicitly chooses local disk; not cloud-native |

---

### 3.8 Data Risks

| ID | Risk Description | Category | Probability | Impact | Score | Priority | Owner | Trigger / Early Warning |
|---|---|---|---|---|---|---|---|---|
| D-01 | **No backup strategy** – PostgreSQL data + certificate files on local disk. No automated backup, point-in-time recovery, or disaster recovery plan. | Data | 3 (Medium) | 4 (High) | **12** | **High** | Person 3 | Architecture: local disk for both DB (assumed) and certificates |
| D-02 | **Data migration from mock to real** – Frontend `mockData.js` has seed data. Real DB needs equivalent seed (especially first Admin user). Mismatch breaks demo. | Data | 3 (Medium) | 3 (Medium) | **9** | **Medium** | Person 3 | Architecture Section 13: "seed (first Admin)"; mock data in `client/src/services/mockData.js` |
| D-03 | **Referential integrity on delete** – All FKs use `ON DELETE RESTRICT`. Accidental delete attempts will error, but no soft-delete/archive pattern for users/events. | Data | 2 (Low) | 3 (Medium) | **6** | **Medium** | Person 2 / Person 3 | Schema Design Section K.2–K.3; no `deleted_at` or `is_active` columns |
| D-04 | **PII exposure** – Email, student ID number, name stored. No encryption at rest, no audit logging, no data retention policy. | Data | 2 (Low) | 3 (Medium) | **6** | **Medium** | Person 3 | Not addressed in architecture or requirements |

---

### 3.9 External Dependency Risks

| ID | Risk Description | Category | Probability | Impact | Score | Priority | Owner | Trigger / Early Warning |
|---|---|---|---|---|---|---|---|---|
| EXT-01 | **npm supply chain / vulnerability** – 17 direct dependencies + transitive. `npm audit` may reveal critical vulnerabilities close to deadline. | External | 3 (Medium) | 3 (Medium) | **9** | **Medium** | Person 3 | `package.json` shows React 19, Vite 8, many libs; no `package-lock.json` in root |
| EXT-02 | **Vercel deployment limits** – Free tier has bandwidth/function execution limits. Live demo may hit limits during evaluation. | External | 2 (Low) | 2 (Low) | **4** | **Low** | Person 3 | README shows live demo on Vercel |
| EXT-03 | **PostgreSQL hosting availability** – Local PostgreSQL for dev; production needs managed DB (Neon, Supabase, Railway). Setup time not in schedule. | External | 3 (Medium) | 3 (Medium) | **9** | **Medium** | Person 3 | Architecture: local PostgreSQL for dev; cloud for demo |
| EXT-04 | **College IT policy restrictions** – College email domain validation, ID format, network access to deployed backend may require IT approval. | External | 2 (Low) | 3 (Medium) | **6** | **Medium** | Person 1 | Architecture: "Email domain checked against allowed-domain setting" |

---

## 4. Risk Response Strategies

### 4.1 Critical Risks (Score ≥ 15) – Immediate Action Required

| Risk ID | Strategy | Specific Actions | Target Date | Status |
|---|---|---|---|---|
| T-01 | **Mitigate** – Start backend implementation immediately | 1. Initialize `server/` with Express + Prisma + TypeScript<br>2. Implement Auth module first (register, login, JWT)<br>3. Implement Events, Registrations, Certificates modules per API contract<br>4. Run Prisma migrate against local PostgreSQL | 17 Nov 2026 | 🔴 Not Started |
| T-02 | **Mitigate** – Contract-first development | 1. Generate OpenAPI/Swagger spec from `API_CONTRACT.md`<br>2. Use `zod` schemas shared between frontend/backend<br>3. Add integration test suite against contract | 17 Nov 2026 | 🔴 Not Started |
| T-05 | **Mitigate** – Defense in depth | 1. Implement backend RBAC middleware *before* any route handlers<br>2. Add integration tests for every role × endpoint combination<br>3. Frontend guards as UX only; backend is source of truth | 17 Nov 2026 | 🔴 Not Started |
| S-01 | **Mitigate** – Rebaseline schedule | 1. Re-estimate all WBS tasks with team<br>2. Add 50% buffer to development phase<br>3. Negotiate extended deadline with course instructor<br>4. Prioritize MVP: Auth + Events + Registrations (defer Certificates if needed) | 16 Nov 2026 | 🟡 In Progress |
| S-02 | **Mitigate** – Parallelize where possible | 1. Person 2: Start database setup + Prisma schema while Person 1 finalizes requirements<br>2. Person 3: Build backend Auth module in parallel with frontend integration prep<br>3. Person 4: Set up CI/CD, test infrastructure early | 16 Nov 2026 | 🟡 In Progress |
| S-03 | **Mitigate** – Allocate dedicated backend time | 1. Person 3 focuses 80% on backend for next 3 days<br>2. Pair with Person 2 on Prisma/schema questions<br>3. Use `BACKEND_INTEGRATION_GUIDE.md` as implementation checklist | 17 Nov 2026 | 🔴 Not Started |
| S-04 | **Mitigate** – Shift-left integration testing | 1. Connect frontend to local backend *daily* starting Day 1 of backend dev<br>2. Fix contract mismatches immediately, not in batch<br>3. Automate API contract validation in CI | 17 Nov 2026 | 🔴 Not Started |
| R-01 | **Mitigate** – Knowledge sharing | 1. Person 3 documents backend API, DB schema, runbooks daily<br>2. Person 2 reviews backend code for schema alignment<br>3. Person 4 shadows backend setup for bus factor | 18 Nov 2026 | 🔴 Not Started |
| Q-01 | **Mitigate** – Implement critical path tests first | 1. Add Jest + Supertest for Auth, Registration, Certificate flows<br>2. Target 70% coverage on service layer<br>3. Run tests on every commit via GitHub Actions | 18 Nov 2026 | 🔴 Not Started |
| Q-02 | **Mitigate** – Reduce mock dependency | 1. Switch `VITE_USE_MOCK=false` as soon as Auth endpoint works<br>2. Run frontend against real backend for all subsequent development<br>3. Keep mock only for offline/demo scenarios | 17 Nov 2026 | 🔴 Not Started |
| SEC-01 | **Mitigate** – Secrets hygiene | 1. Add `.env.example` with placeholder JWT secret<br>2. Use strong random secret (256-bit) in production<br>3. Rotate secret if ever committed | 17 Nov 2026 | 🔴 Not Started |

---

### 4.2 High Risks (Score 10–14) – Active Mitigation Required

| Risk ID | Strategy | Specific Actions | Target Date | Status |
|---|---|---|---|---|
| T-03 | **Mitigate** | Single source of truth: Use Prisma as primary; generate SQL from `prisma migrate diff` for review. No manual SQL edits. | 17 Nov | 🔴 |
| T-04 | **Mitigate** | Test PDF generation early with real fonts, long names, special characters. Fallback: simple text-based certificate if PDFKit fails. | 18 Nov | 🔴 |
| T-09 | **Mitigate** | See Q-01 response. Add test script to `package.json` immediately. | 17 Nov | 🔴 |
| S-05 | **Accept + Monitor** | Track daily capacity in standups. Escalate to instructor if >2 days lost. | Ongoing | 🟡 |
| R-02 | **Mitigate** | Pair programming sessions on Express/Prisma. Use `BACKEND_INTEGRATION_GUIDE.md` as tutorial. | 17 Nov | 🔴 |
| R-04 | **Mitigate** | Person 1 writes acceptance criteria as executable tests (Gherkin/Cucumber or Jest). Person 3 implements. | 18 Nov | 🔴 |
| SEC-02 | **Mitigate** | Enforce bcrypt cost factor ≥ 12 in code review checklist. | 17 Nov | 🔴 |
| SEC-04 | **Mitigate** | Hardcode CORS origin in backend; reject wildcard. Test with `curl` from different origin. | 17 Nov | 🔴 |
| SEC-06 | **Mitigate** | Add `express-rate-limit` middleware on `/auth/*` and `/registrations` routes. | 17 Nov | 🔴 |
| I-01 | **Mitigate** | Deploy backend to same platform (Railway/Render) or use Vercel Functions. Share env vars via platform. | 18 Nov | 🔴 |
| I-02 | **Mitigate** | Commit to one migration path: Prisma Migrate only. Run `prisma migrate deploy` in CI. | 17 Nov | 🔴 |
| D-01 | **Mitigate** | Enable PostgreSQL point-in-time recovery (PITR) on managed DB. Backup certificates folder to object storage daily. | 18 Nov | 🔴 |

---

### 4.3 Medium Risks (Score 5–9) – Plan Mitigation, Assign Owner

| Risk ID | Strategy | Specific Actions | Owner | Review Date |
|---|---|---|---|---|
| T-06 | Mitigate | Wrap registration insert in transaction; catch `P2002` (unique constraint) → return 409 | Person 3 | 18 Nov |
| T-07 | Accept | Prototype scope; document limitation. Future: migrate to S3. | Person 3 | 18 Nov |
| T-08 | Monitor | Pin versions in `package-lock.json`; run `npm audit` weekly | Person 3 | Ongoing |
| T-10 | Mitigate | Add `.env.example`; validate required vars at startup; fail fast | Person 3 | 17 Nov |
| SC-01 | Mitigate | Person 1 & 3 review requirements together before dev starts | Person 1/3 | 16 Nov |
| SC-02 | Clarify | Team decision: Admin in or out? Update Project Plan & Architecture. | Person 4 | 16 Nov |
| Q-03 | Accept | Test on Chrome + Firefox + Safari (mobile) manually before demo | Person 3 | 18 Nov |
| Q-04 | Accept | Out of scope for prototype; document as known gap | Person 1 | 18 Nov |
| I-03 | Mitigate | Add Vercel rewrite: `/api/:path*` → `https://backend-host/api/:path*` | Person 3 | 18 Nov |
| I-04 | Mitigate | Use Vercel Environment Variables for frontend; Railway/Render for backend | Person 3 | 18 Nov |
| D-02 | Mitigate | Write Prisma seed script matching `mockData.js` exactly | Person 3 | 17 Nov |
| EXT-01 | Monitor | Run `npm audit --audit-level=high` in CI; fail build on critical | Person 3 | Ongoing |
| EXT-03 | Mitigate | Provision managed PostgreSQL (Neon free tier) Day 1 | Person 3 | 16 Nov |

---

### 4.4 Low Risks (Score 1–4) – Monitor Only

| Risk ID | Strategy | Trigger for Escalation |
|---|---|---|
| S-07 | Monitor | Jira admin overhead > 2 hrs/day |
| SC-03 | Monitor | Stakeholder disputes certificate eligibility |
| SC-04 | Monitor | Venue clash check produces false positives |
| Q-05 | Monitor | Page load > 3s or API > 1s in manual testing |
| SEC-03 | Monitor | Any raw SQL introduced |
| SEC-05 | Monitor | File path contains `../` or absolute paths |
| SEC-07 | Monitor | Fake accounts used for spam registrations |
| EXT-02 | Monitor | Vercel bandwidth > 80% of free tier |
| EXT-04 | Monitor | IT approval not received 48h before demo |

---

## 5. Risk Monitoring & Control Plan

### 5.1 Review Cadence

| Review | Frequency | Participants | Artifacts Updated |
|---|---|---|---|
| **Daily Standup** | Daily (15 min) | All 4 members | Risk register (new risks, status changes) |
| **Risk Review Meeting** | Every 2 days (30 min) | Person 3 + Person 4 | Risk scores, mitigation progress, new risks |
| **Milestone Gate** | At each project milestone | All + instructor (if available) | Go/No-Go decision; risk acceptance sign-off |
| **Pre-Demo Freeze** | 24h before final demo | Person 3 + Person 4 | Only Critical/High risk fixes allowed |

### 5.2 Escalation Thresholds

| Condition | Escalation To | Action |
|---|---|---|
| Any **Critical** risk score increases | Person 4 → Instructor | Immediate meeting; scope/schedule renegotiation |
| >2 **High** risks become **Critical** | Person 4 → Instructor | Emergency replanning session |
| Person 3 unavailable > 1 day | Person 4 → Instructor | Activate knowledge transfer; reduce scope |
| Backend not runnable by 17 Nov EOD | Person 4 → Instructor | Scope reduction: deliver frontend + mock only |
| Security vulnerability (CVSS ≥ 7) in dependencies | Person 3 → Person 4 | Immediate patch; deploy hotfix |

### 5.3 Key Risk Indicators (KRIs)

| KRI | Target | Warning Threshold | Critical Threshold |
|---|---|---|---|
| Backend API endpoints implemented | 100% by 17 Nov | < 50% by 16 Nov | < 30% by 17 Nov |
| Frontend-backend integration tests passing | 100% critical flows | < 80% | < 50% |
| Automated test coverage (service layer) | ≥ 70% | < 40% | < 20% |
| Open Critical/High risks | 0 by demo | > 2 | > 5 |
| Team capacity (person-days available) | 4/day | < 3/day | < 2/day |
| Schedule variance | ±10% | > 20% | > 50% |

---

## 6. Risk Register Summary (Heat Map)

```
PROBABILITY
    5 ██████████████████████████████████████████████████ S-01, S-03, T-01
    4 ████████████████████████████████████████████████   S-02, S-04, T-02, R-01, Q-01, Q-02
    3 ██████████████████████████████████████████████     T-03, T-04, T-05, T-06, T-07, T-09,
                                                         S-05, S-06, R-02, R-03, R-05,
                                                         SC-01, SC-02, SC-03, Q-03, Q-04,
                                                         SEC-01, SEC-04, SEC-06, SEC-07,
                                                         I-01, I-02, I-03, I-04, D-01, D-02,
                                                         EXT-01, EXT-03
    2 ██████████████████████████████████████████████     T-08, SC-04, Q-05, SEC-02, SEC-03,
                                                         SEC-05, I-05, D-03, D-04, EXT-02, EXT-04
    1 ██████████████████████████████████████████████
       └──────────────────────────────────────────────
         1    2    3    4    5
                     IMPACT
```

**Critical Cluster (Top-Right)**: T-01, T-02, T-05, S-01, S-02, S-03, S-04, R-01, Q-01, Q-02, SEC-01
**High Cluster**: T-03, T-09, S-05, R-04, SEC-02, SEC-04, I-01, I-02, D-01

---

## 7. Assumptions Underlying This Risk Assessment

1. **Team composition stable** – All 4 members remain available through 18 Nov 2026.
2. **Technology stack fixed** – React/Vite/Tailwind, Node/Express/Prisma/PostgreSQL, JWT/bcrypt, PDFKit.
3. **Scope frozen** – No new features beyond Project Plan Section 3.1.
4. **Infrastructure access** – Team can provision PostgreSQL (local or cloud) and deploy backend.
5. **Instructor flexibility** – Deadline extension possible if justified by risk realization.
6. **Mock backend fidelity** – `mockBackend.js` accurately represents intended API behavior.
7. **No external dependencies** – No third-party APIs (payment, SMS, email) required.

---

## 8. Approval & Sign-Off

| Role | Name | Signature | Date |
|---|---|---|---|
| Project Manager (Person 4) | | | |
| Requirements Lead (Person 1) | | | |
| Design & Database Lead (Person 2) | | | |
| Development & Testing Lead (Person 3) | | | |

---

## 9. Appendices

### Appendix A: Risk Identification Checklist Used

- [x] Technical complexity / new technology
- [x] Schedule compression / unrealistic dates
- [x] Resource constraints / single points of failure
- [x] Requirements volatility / scope creep
- [x] Integration complexity (frontend ↔ backend ↔ DB)
- [x] Data migration / seed data consistency
- [x] Security / authentication / authorization
- [x] Deployment / environment configuration
- [x] Testing adequacy / automation
- [x] External dependencies / third-party services
- [x] Knowledge transfer / bus factor
- [x] Quality / performance / accessibility
- [x] Compliance / data privacy

### Appendix B: Risk Response Strategy Definitions

| Strategy | When to Use |
|---|---|
| **Avoid** | Eliminate threat by changing plan (e.g., drop feature, change tech) |
| **Mitigate** | Reduce probability and/or impact (most common for this project) |
| **Transfer** | Shift to third party (insurance, vendor SLA) – rarely applicable |
| **Accept** | Acknowledge risk; no proactive action; monitor only |
| **Escalate** | Beyond project authority; sponsor/stakeholder decision needed |

### Appendix C: Risk Log Template (for ongoing updates)

| Date | Risk ID | Change | Old Score | New Score | Reason | Action Taken |
|---|---|---|---|---|---|---|
| 16 Nov | - | Initial register created | - | - | Baseline assessment | Document published |
| | | | | | | |

---

*End of Risk Management Plan – Version 1.0*
*Next Review: 17 Nov 2026 (Daily Standup)*
*Document Owner: Person 4 – Project Management & Documentation*