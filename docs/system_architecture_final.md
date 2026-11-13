# College Event Management System — System Architecture (Final)

| Item | Details |
|---|---|
| Project | College Event Management System |
| Document | System Architecture (Design Phase) |
| Version | 1.0 – Final |
| Based on | Project Plan (last updated 12 Nov 2026) |
| Status | **Finalized – approved after team review (13 Nov 2026)** |

> The technology stack and architecture below were reviewed and confirmed by the team. If a more feasible or suitable alternative is found during development, it will be discussed with the team and this document updated accordingly.

---

## 1. Architecture Goals

| Goal | How the architecture addresses it |
|---|---|
| Centralized event platform | Single web application backed by one shared database |
| Prevent duplicate registrations | Enforced in the database (unique constraint) and checked in the service layer |
| Three roles: Student, Organizer, Administrator | Role-based access control (RBAC) on every protected endpoint |
| Secure role management | Public sign-up always creates a Student; Organizer and Admin roles are assigned only by an Administrator |
| Controlled student sign-up | Students self-register with their college Gmail address and college ID card number |
| Certificates for eligible participants | Organizer-controlled issuance; PDF generated and stored; students download only their own |
| Prototype scope, small team | Simple layered monolith, easy to build, test and demo; no unnecessary complexity |
| Out-of-scope items kept out | No payment, QR attendance, AI recommendations, mobile apps, or SMS modules |

## 2. Architectural Style

A **three-tier layered monolith**:

1. **Presentation tier**: responsive web single-page application (SPA).
2. **Application tier**: one REST API server organized into modules.
3. **Data tier**: relational database plus local file storage for certificate PDFs.

A monolith is chosen over microservices because the scope is small, the team has four members, and the timeline is short. Modules are separated internally so they can be split later if needed.

## 3. Technology Stack (Confirmed)

| Layer | Choice | Reason |
|---|---|---|
| Frontend | React + React Router, Tailwind CSS | Component-based UI, fast to prototype |
| Backend | Node.js + Express | Simple REST API, large ecosystem |
| ORM / migrations | Prisma | Schema as code, type-safe queries |
| Database | PostgreSQL | Relational integrity, unique constraints, transactions |
| Authentication | JWT (access token) + bcrypt password hashing | Stateless, simple RBAC |
| Validation | Zod | Consistent request validation; strips or rejects unexpected fields |
| Certificate generation | PDFKit | Generates PDFs server-side |
| File storage | Local disk (server folder, not publicly served) | Simplest option for a small-scale project |
| Testing | Jest + Supertest (API), React Testing Library (UI) | Covers workflows listed in Phase 4 |
| Version control / tracking | Git repository + Jira | Matches Section 8 of the project plan |

Possible alternatives (for example MySQL, Sequelize, Joi, or an S3-compatible bucket for a later deployment) may be considered during development only if they prove more suitable. They are not part of the current plan.

## 4. High-Level System Architecture

```mermaid
flowchart TB
    subgraph Users
        S[Student]
        O[Event Organizer]
        A[Administrator]
    end

    subgraph Client["Presentation Tier - React SPA"]
        UI[Pages and Components]
        AUTHC[Auth Context / Route Guards]
        APIC[API Client]
    end

    subgraph Server["Application Tier - Express REST API"]
        MW[Middleware: CORS, JWT Auth, RBAC, Validation, Error Handler]
        R[Routes / Controllers]
        SVC[Service Layer - Business Rules]
        REPO[Data Access Layer - ORM]
        CERT[Certificate Generator]
    end

    subgraph Data["Data Tier"]
        DB[(PostgreSQL)]
        FS[(Certificate File Storage - local disk)]
    end

    S --> UI
    O --> UI
    A --> UI
    UI --> AUTHC --> APIC
    APIC -- HTTPS / JSON --> MW --> R --> SVC
    SVC --> REPO --> DB
    SVC --> CERT --> FS
    CERT --> REPO
```

## 5. Component Design

### 5.1 Frontend (React SPA)

| Area | Pages / Components | Role access |
|---|---|---|
| Public | Login, Register (college email, college ID number, name, department, password), Event list, Event details | Everyone (registering for an event requires login) |
| Student | My Registrations (status, withdraw), My Certificates (view/download) | Student |
| Organizer | Create/Edit Event, Manage My Events, Participant List, Schedule and Venue selection, Issue Certificates | Organizer |
| Admin | User Management (view users, assign or change roles), Venue Management, oversight of all events | Admin |
| Shared | Navbar, route guards, form components, toast/error components | All |

Key behaviors:
- Route guards redirect users who lack the required role.
- The registration form never sends or offers a role field; the server decides the role.
- The API client attaches the JWT and handles `401` by returning the user to login.
- The "Register" button is disabled when the student is already registered, the event is cancelled, the event is full, or registration is closed. The server still enforces these rules.

### 5.2 Backend Modules

| Module | Responsibility |
|---|---|
| **Auth** | Self-registration (always as Student), login, password hashing, JWT issue/verify |
| **Users** | Profile retrieval; **role assignment and user listing (Admin only)** |
| **Events** | Create, update, cancel, list, detail; status handling; optional participant limit |
| **Venues and Schedules** | Venue records, event date/time/venue assignment, clash checks |
| **Registrations** | Register, withdraw, prevent duplicates, view own status, organizer participant list |
| **Certificates** | Mark participants eligible, generate PDF, issue, student download |
| **Common** | Validation, error handling, logging, config |

### 5.3 Layering Inside the Backend

```mermaid
flowchart LR
    REQ[HTTP Request] --> MID[Middleware]
    MID --> CTRL[Controller]
    CTRL --> SVC[Service]
    SVC --> REPO[Repository / ORM]
    REPO --> DB[(Database)]
    SVC --> EXT[Certificate Generator / File Storage]
```

- **Controller**: parses the request and returns the response.
- **Service**: holds business rules (duplicate check, capacity check, ownership check, eligibility, status transitions, role rules).
- **Repository**: all database access; no business logic.

## 6. Data Architecture

### 6.1 Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ EVENTS : organizes
    USERS ||--o{ REGISTRATIONS : makes
    EVENTS ||--o{ REGISTRATIONS : receives
    VENUES ||--o{ EVENTS : hosts
    REGISTRATIONS ||--o| CERTIFICATES : earns

    USERS {
        int id PK
        string name
        string email UK "college Gmail address"
        string college_id UK "college ID card number"
        string password_hash
        string role "STUDENT (default) | ORGANIZER | ADMIN"
        string department
        datetime created_at
    }
    VENUES {
        int id PK
        string name UK
        string location
        int capacity
    }
    EVENTS {
        int id PK
        string title
        text description
        int organizer_id FK
        int venue_id FK
        datetime start_time "single date and time"
        datetime end_time
        datetime registration_deadline
        int max_participants "nullable - optional limit"
        string status "DRAFT | PUBLISHED | CANCELLED | COMPLETED"
        string cancel_reason "nullable"
        datetime created_at
        datetime updated_at
    }
    REGISTRATIONS {
        int id PK
        int event_id FK
        int student_id FK
        string status "REGISTERED | CANCELLED"
        boolean certificate_eligible
        datetime registered_at
    }
    CERTIFICATES {
        int id PK
        int registration_id FK "unique"
        string certificate_no UK
        string file_path
        datetime issued_at
        int issued_by FK
    }
```

### 6.2 Key Constraints

| Rule | Enforcement |
|---|---|
| Prevent duplicate registrations | `UNIQUE (event_id, student_id)` on `registrations`; service returns `409 Conflict` |
| One certificate per participant per event | `UNIQUE (registration_id)` on `certificates` |
| Unique login identity | `UNIQUE (email)` and `UNIQUE (college_id)` on `users` |
| College-only sign-up | Email domain checked against an allowed-domain setting; college ID checked against the college's ID format (both configurable) |
| Default role is Student | `users.role` defaults to `STUDENT`; the register endpoint ignores or rejects any `role` value in the request |
| Only an Admin changes roles | Role-change endpoint requires ADMIN; self-demotion and removal of the last Admin are blocked |
| Organizers manage only their own events | Service checks `events.organizer_id = current user` (Admin may override) |
| Venue and schedule management | `events.venue_id`, `start_time`, `end_time` with an overlap check per venue |
| Optional participant limit | If `max_participants` is set, count of `REGISTERED` rows must be below it (checked inside a transaction) |
| Certificates only for eligible participants | Issue requires `certificate_eligible = true` and a non-cancelled registration |

Schedules are stored directly on the event as a single start and end date/time, which the team confirmed is sufficient. If multi-session events are ever needed, an `event_sessions` table can be added.

**Withdrawal handling:** withdrawing sets the registration status to `CANCELLED` (the row is kept). If the student registers again, the same row is set back to `REGISTERED`, so the unique constraint is never violated. Only `REGISTERED` rows count toward the participant limit.

## 7. REST API Design

Base path: `/api/v1`. All bodies are JSON. Protected routes require `Authorization: Bearer <JWT>`.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Create a **Student** account (name, college email, college ID number, department, password). Role cannot be supplied |
| POST | `/auth/login` | Public | Log in, receive JWT |
| GET | `/auth/me` | Authenticated | Current user profile |
| GET | `/users` | Admin | List users (search/filter by role) |
| PATCH | `/users/:id/role` | Admin | Assign or change a user's role (STUDENT, ORGANIZER, ADMIN) |
| GET | `/events` | Public | List published events (filter by date, status, search) |
| GET | `/events/:id` | Public | Event details with venue and schedule |
| POST | `/events` | Organizer, Admin | Create event |
| PUT | `/events/:id` | Owner Organizer, Admin | Update event, schedule or venue |
| POST | `/events/:id/cancel` | Owner Organizer, Admin | Cancel event with reason |
| GET | `/venues` | Organizer, Admin | List venues |
| POST | `/venues` | Admin | Add venue |
| POST | `/events/:id/registrations` | Student | Register for an event |
| DELETE | `/events/:id/registrations/me` | Student | Withdraw own registration |
| GET | `/registrations/me` | Student | View own registrations and status |
| GET | `/events/:id/participants` | Owner Organizer, Admin | Participant list |
| PATCH | `/events/:id/participants/:regId` | Owner Organizer, Admin | Mark certificate eligibility |
| POST | `/events/:id/certificates/issue` | Owner Organizer, Admin | Issue certificates to eligible participants |
| GET | `/certificates/me` | Student | List own issued certificates |
| GET | `/certificates/:id/download` | Certificate owner, Owner Organizer, Admin | Download PDF |

Standard error format:

```json
{ "error": { "code": "DUPLICATE_REGISTRATION", "message": "You are already registered for this event." } }
```

| HTTP code | Typical use |
|---|---|
| 400 | Validation failure (including invalid college email or ID number) |
| 401 | Missing or invalid token |
| 403 | Role or ownership violation |
| 404 | Resource not found |
| 409 | Duplicate registration, duplicate email/ID, venue clash, event full |
| 500 | Unexpected server error |

## 8. Key Workflows

### 8.1 Student Account Creation and Role Assignment

```mermaid
sequenceDiagram
    actor S as New User
    actor AD as Administrator
    participant UI as React SPA
    participant API as Express API
    participant DB as PostgreSQL

    S->>UI: Fill sign-up form (college email, ID number, name, password)
    UI->>API: POST /auth/register
    API->>API: Validate email domain and ID format, drop any role field
    API->>DB: INSERT user with role = STUDENT
    API-->>UI: 201 Created
    Note over S,DB: Account is always a Student at this point

    AD->>API: PATCH /users/:id/role (ORGANIZER)
    API->>API: Verify JWT and ADMIN role
    API->>DB: UPDATE user role
    API-->>AD: 200 OK
    Note over S,DB: Role change applies on the user's next request
```

### 8.2 Student Registers for an Event

```mermaid
sequenceDiagram
    actor S as Student
    participant UI as React SPA
    participant API as Express API
    participant SVC as Registration Service
    participant DB as PostgreSQL

    S->>UI: Click Register on event
    UI->>API: POST /events/:id/registrations (JWT)
    API->>API: Verify JWT and STUDENT role
    API->>SVC: register(eventId, studentId)
    SVC->>DB: Load event
    SVC->>SVC: Check PUBLISHED, deadline, capacity (if limit set)
    SVC->>DB: INSERT registration
    alt Already registered
        DB-->>SVC: Unique constraint violation
        SVC-->>API: DuplicateRegistration
        API-->>UI: 409 Conflict
        UI-->>S: "Already registered"
    else Success
        DB-->>SVC: Row created
        API-->>UI: 201 Created
        UI-->>S: Registration confirmed
    end
```

The database constraint is the final safeguard, so two simultaneous clicks cannot create duplicates. Withdrawal uses `DELETE /events/:id/registrations/me`, allowed while the event is `PUBLISHED` and before the registration deadline.

### 8.3 Organizer Creates and Cancels an Event

```mermaid
flowchart TD
    A[Organizer opens Create Event] --> B["Enter title, description, date/time, venue, optional limit"]
    B --> C{Validation and venue clash check}
    C -- fails --> B
    C -- passes --> D[Save event as PUBLISHED or DRAFT]
    D --> E[Event appears in student event list]
    E --> F{Cancel needed?}
    F -- yes --> G[POST cancel with reason]
    G --> H[Status = CANCELLED, registrations marked cancelled]
    H --> I[Students see cancelled status in My Registrations]
```

### 8.4 Certificate Issuance and Download

```mermaid
sequenceDiagram
    actor O as Organizer
    actor S as Student
    participant API as Express API
    participant GEN as Certificate Generator
    participant FS as File Storage
    participant DB as PostgreSQL

    O->>API: PATCH participants (mark certificate_eligible)
    API->>DB: Update registrations
    O->>API: POST /events/:id/certificates/issue
    API->>DB: Fetch eligible registrations without certificate
    loop Each eligible participant
        API->>GEN: Generate PDF (name, event, date, cert no.)
        GEN->>FS: Save PDF
        API->>DB: INSERT certificate (file_path, issued_at)
    end
    API-->>O: Count issued
    S->>API: GET /certificates/me
    API-->>S: List of own certificates
    S->>API: GET /certificates/:id/download
    API->>API: Verify ownership
    API-->>S: PDF file
```

**Certificate template (kept simple):** one A4 landscape page, modelled on a typical previous college certificate. It contains the college name, the title "Certificate of Participation", the student's name, event title, event date, certificate number, issue date, and the organizer/signatory name. Layout, college name and signatory text live in one template file, so they can be adjusted without touching the rest of the code.

### 8.5 Login and Role-Based Access

```mermaid
flowchart LR
    L[Login request] --> V{Credentials valid?}
    V -- no --> E[401 Unauthorized]
    V -- yes --> T[Issue JWT with user id]
    T --> C[Client stores token]
    C --> R[Request protected endpoint]
    R --> M{Token valid?}
    M -- no --> E
    M -- yes --> U[Load current role from database]
    U --> P{Role and ownership allowed?}
    P -- no --> F[403 Forbidden]
    P -- yes --> OK[Process request]
```

The role is read from the database on each protected request, so a role change or demotion by an Administrator takes effect immediately instead of waiting for the token to expire.

## 9. Event Lifecycle

```mermaid
stateDiagram-v2
    [*] --> DRAFT
    DRAFT --> PUBLISHED: Organizer publishes
    PUBLISHED --> PUBLISHED: Organizer updates details
    PUBLISHED --> CANCELLED: Organizer cancels
    DRAFT --> CANCELLED: Organizer cancels
    PUBLISHED --> COMPLETED: Event end time passes
    COMPLETED --> [*]
    CANCELLED --> [*]
```

Registrations are accepted only while the event is `PUBLISHED`, before the registration deadline, and (if a limit is set) while seats remain. Certificates can be issued only for `COMPLETED` (or past-end-time) events.

## 10. Security Design

| Concern | Measure |
|---|---|
| Passwords | Hashed with bcrypt, never stored or logged in plain text |
| Authentication | Short-lived JWT; secret kept in environment variables |
| Authorization | RBAC middleware plus ownership checks in services |
| **Privilege escalation** | Registration always creates a Student. The `role` field is not accepted from clients on sign-up or profile updates (validation schema rejects it). Only `PATCH /users/:id/role`, restricted to Admins, can change roles |
| **Role changes** | Admin-only; an Admin cannot demote themselves, and the last Admin cannot be removed. The first Admin account is created by a database seed script |
| Sign-up control | Email must belong to the allowed college domain; college ID number must match the college format and be unique |
| Input safety | Schema validation on all inputs; parameterized queries through the ORM prevent SQL injection |
| XSS | React escapes output by default; sanitize any rich-text description |
| Transport | HTTPS in any deployed environment |
| CORS | Allow only the frontend origin |
| Certificate privacy | Download endpoint checks ownership; files not served from a public folder |
| Abuse | Rate limiting on login and registration endpoints |
| Secrets | `.env` files excluded from Git |

Email verification (confirmation link) is not included, to keep the prototype simple. It can be added later through a notification module if needed.

## 11. Non-Functional Considerations

| Quality | Approach |
|---|---|
| Usability | Responsive layout so the web app works on phones without a dedicated mobile app |
| Performance | Indexes on `events(start_time, status)`, `registrations(student_id)`, `registrations(event_id)`; paginated list endpoints |
| Reliability | Database transactions for registration and certificate issuance; consistent error responses |
| Maintainability | Layered modules, shared validation, linting, API documentation (OpenAPI/Swagger) |
| Testability | Service layer isolated from HTTP so business rules can be unit tested |
| Data integrity | Foreign keys and unique constraints in the schema |

## 12. Deployment Architecture

```mermaid
flowchart LR
    B[Browser] -- HTTPS --> W[Static Hosting / Web Server - React build]
    B -- HTTPS /api --> N[Node.js + Express App]
    N --> P[(PostgreSQL)]
    N --> F[(Certificate Storage - local disk)]
```

| Environment | Setup |
|---|---|
| Local development | Frontend dev server, API on localhost, local PostgreSQL (optionally via Docker Compose) |
| Demo / prototype | Single host or free-tier cloud: static frontend, one API instance, PostgreSQL, certificates on the server's disk |

## 13. Suggested Project Structure

```text
college-event-system/
├── client/                     # React SPA
│   └── src/
│       ├── pages/              # Events, EventDetail, MyRegistrations, Certificates, Organizer/*, Admin/*
│       ├── components/
│       ├── context/            # AuthContext
│       ├── services/           # API client
│       └── routes/             # Route guards
├── server/
│   ├── prisma/                 # schema.prisma, migrations, seed (first Admin)
│   └── src/
│       ├── modules/
│       │   ├── auth/
│       │   ├── users/
│       │   ├── events/
│       │   ├── venues/
│       │   ├── registrations/
│       │   └── certificates/
│       ├── middleware/         # auth, rbac, validate, errorHandler
│       ├── utils/              # certificate PDF generator and template
│       └── app.js
├── tests/
├── docs/                       # Requirements, design, WBS, Gantt, risk register
└── README.md
```

## 14. Traceability to the Project Plan

| Project plan requirement | Architectural element |
|---|---|
| Display list of available events | `GET /events`, Event list page |
| Display event details | `GET /events/:id`, Event detail page |
| Students register for events | Registrations module, `POST /events/:id/registrations` |
| Prevent duplicate registrations | DB unique constraint and service check |
| Organizers create, update, cancel events | Events module and organizer pages |
| Manage participant lists | `GET /events/:id/participants` |
| Manage schedules and venue information | Venues module; `start_time`, `end_time`, `venue_id` on events |
| Issue certificates to eligible participants | Certificates module, eligibility flag, PDF generator |
| Students view and download certificates | `GET /certificates/me`, `GET /certificates/:id/download` |
| Login where required | Auth module, JWT, RBAC |
| Student account creation | `POST /auth/register` with college email and college ID number |
| Organizer/Admin role control | Users module, `PATCH /users/:id/role` (Admin only) |
| Test student and organizer workflows | Jest/Supertest API tests, UI tests |

## 15. Out of Scope (Not Designed)

Consistent with Section 3.2 of the project plan, the architecture intentionally excludes:

- Payment gateway integration
- QR-code attendance verification
- AI-based event recommendations
- Dedicated mobile applications
- External SMS notifications
- Multi-session event schedules
- Email verification of new accounts

Extension points exist for later work (for example, a notification module behind the service layer), but none are part of this design.

## 16. Final Decisions Log

All items raised during review are now closed.

| # | Item | Decision |
|---|---|---|
| 1 | Technology stack | **Confirmed**: React, Node/Express, PostgreSQL, Prisma. Alternatives may be discussed during development if clearly more suitable |
| 2 | Administrator role | **Implemented** as one of the three roles |
| 3 | Participant limit and withdrawal | **Both included** (limit is optional per event; students can withdraw before the deadline) |
| 4 | Student accounts | **Self-registration** using college Gmail address and college ID card number; always created as Student |
| 5 | Event schedule | **Single date/time** per event is sufficient |
| 6 | Certificate template | Simple template based on a typical previous college certificate; no specific design required |
| 7 | Certificate storage | **Local disk** (simplest option for a small-scale project) |
| 8 | Role management (reviewer suggestion) | New accounts default to Student; clients cannot assign roles through the API; Organizer and Admin roles are assigned only by an Administrator |

This document is the approved baseline for development. Any later change to scope, design, or technology should be agreed by the team and recorded here.
