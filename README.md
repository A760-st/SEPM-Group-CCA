# SEPM-Group-CCA — College Event Management System
### BMS Institute of Technology and Management (BMSITM)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-success?style=for-the-badge&logo=vercel)](https://client-orpin-ten-51.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20TailwindCSS-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Course](https://img.shields.io/badge/Course-SEPM%20Curriculum-orange?style=for-the-badge)](docs/project_plan.md)

---

## 📌 About the Project

The **College Event Management System (CampusEvent)** is a centralized web platform engineered to modernize and streamline how collegiate events, technical symposiums, cultural fests, workshops, and academic conferences are planned, scheduled, approved, and attended. 

Developed as part of the **Software Engineering and Project Management (SEPM)** curriculum for **BMS Institute of Technology and Management (BMSITM)**, this system addresses typical real-world campus event challenges:

* **Fragmented Communication & Double Booking**: Replaces disparate Google Forms, WhatsApp notices, and spreadsheets with a single institutional portal and venue capacity conflict management.
* **Role-Based Workflows**: Tailored, secured dashboards and operational workflows for three distinct campus roles:
  * **Students**: Discover upcoming events, filter by categories and dates, enroll with single-click registrations, manage attendance history, and securely download official academic certificates.
  * **Faculty & Club Organizers**: Create and manage event schedules, monitor real-time participant capacity, take attendance, export attendee rosters to CSV, and access event performance analytics.
  * **College Administrators**: Govern users and role assignments, oversee venue utilization, audit institutional registrations, authorize and issue verified credentials, and view system-wide analytics.
* **Tamper-Proof Credentialing**: Generates official, high-resolution A4 landscape completion and participation certificates bearing the official BMSITM seal, calligraphic signatures, and real-time verifiable QR codes. Anyone scanning the QR code can validate credential authenticity on the public ledger.
* **Layered Monolithic Architecture**: Designed according to sound software engineering principles with strict separation of concerns, RESTful communication, and a normalized 5-entity database schema (Users, Venues, Events, Registrations, Certificates).

---

## 🌐 Live Deployment

* **Production URL:** [https://client-orpin-ten-51.vercel.app](https://client-orpin-ten-51.vercel.app)
* **Status:** 🟢 Live & Operational (Runs with stateful mock backend for complete interactive demonstration)
* **Public Credential Verification Sample:** [https://client-orpin-ten-51.vercel.app/verify/certificate/BMS-CERT-2026-0084](https://client-orpin-ten-51.vercel.app/verify/certificate/BMS-CERT-2026-0084)

---

## 🔑 Quick Demo Access

The deployed application features an in-browser stateful mock backend adhering strictly to the 5-entity database schema. You can log in using the pre-configured accounts or click **Quick Demo Login** on the login page:

| Role | Email | Password | Features Accessible |
|---|---|---|---|
| **Student** | `student@bmsit.in` | `student123` | Browse & search events, single-click registration, view/cancel registrations, PDF certificate download, profile & settings |
| **Organizer** | `organizer@bmsit.in` | `organizer123` | Event creation & edit wizard, publish/cancel events, real-time participant roster, CSV exports, event metrics |
| **Admin** | `admin@bmsit.in` | `admin123` | User directory & role assignment, venue directory & capacities, system-wide registrations, issuance of certificates, analytics dashboards |

---

## 📁 Repository Structure

```text
SEPM-Group-CCA/
├── client/                          # React.js + Vite + Tailwind CSS Frontend (Port 5173)
│   ├── public/assets/               # Official BMSITM emblems and static assets
│   ├── src/
│   │   ├── assets/                  # Logos and images
│   │   ├── components/
│   │   │   ├── certificate/         # A4 Landscape Certificate Template, Preview Modal
│   │   │   ├── common/              # Buttons, Badges, Modals, Tables, Inputs, DevBanner
│   │   │   └── navigation/          # PublicNavbar, Sidebar, TopNavbar, Footers
│   │   ├── context/                 # AuthContext (role-based) & NotificationContext
│   │   ├── layouts/                 # PublicLayout & DashboardLayout
│   │   ├── pages/
│   │   │   ├── public/              # Landing, Login, Registration, Certificate Verification
│   │   │   ├── student/             # Overview, Browse Events, Registrations, Certificates
│   │   │   ├── organizer/           # Overview, Event CRUD, Participants, Reports
│   │   │   └── admin/               # Overview, Users, Events, Venues, Registrations, Analytics
│   │   ├── routes/                  # ProtectedRoute & AppRoutes
│   │   ├── services/                # API Client, Mock Backend & Service Layer
│   │   ├── utils/                   # High-res PDF generator (html2canvas + jsPDF), formatters
│   │   └── types/                   # Constants, Roles, Statuses, BMSITM branding
│   ├── vercel.json                  # Single Page Application (SPA) routing configuration
│   ├── API_CONTRACT.md              # Full REST API Contract specification for backend team
│   ├── BACKEND_INTEGRATION_GUIDE.md # Step-by-step Express/Prisma integration guide
│   └── README.md                    # Detailed frontend documentation & test checklist
├── docs/                            # System architecture, database designs, WBS, diagrams
│   ├── system_architecture_final.md # Approved 3-tier Layered Monolith specification
│   ├── project_plan.md              # Project plan, team milestones, and deliverables
│   ├── GANTT_CHART.md               # Project scheduling and milestone timeline
│   ├── RISK_MANAGEMENT.md           # Project risk register and mitigation strategies
│   ├── WBS.md                       # Work Breakdown Structure
│   ├── SEPM_Data_Dictionary.md      # 5-Entity schema reference & field descriptions
│   ├── SEPM_Database_Schema_Design.md # Relational schema design
│   ├── schema.prisma                # Prisma ORM schema definition
│   └── *.png                        # Architectural workflow diagrams & ERD
└── README.md                        # Project root documentation
```

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | React.js (v19) | Component-driven UI architecture |
| **Build Tool** | Vite (v8) | Lightning-fast HMR and production bundling |
| **Styling** | Tailwind CSS (v4) | Modern, responsive institutional design system |
| **Routing** | React Router DOM v7 | Role-protected routing & nested layouts |
| **Icons & Charts** | Lucide React & Recharts | Clean visual iconography & data visualization |
| **PDF & QR Engine** | jsPDF, html2canvas & qrcode | Client-side 300 DPI A4 landscape PDF rendering & dynamic verification QR codes |
| **Backend (Target)** | Node.js + Express.js | Layered Monolithic REST API (Port 3000) |
| **Database (Target)** | PostgreSQL + Prisma ORM | 5 Relational Entities: Users, Venues, Events, Registrations, Certificates |
| **Deployment** | Vercel | Production hosting with automatic CI/CD |

---

## 🚀 Local Development Setup

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **npm** (v9 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/A760-st/SEPM-Group-CCA.git
cd SEPM-Group-CCA
```

### 2. Install Dependencies
```bash
cd client
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ⚙️ Configuration & Dual-Mode Architecture

The frontend is built to run seamlessly in two modes controlled by environment variables (`client/.env`):

* **Standalone / Demo Mode (`VITE_USE_MOCK=true`):**
  Uses a browser-based stateful mock engine (`localStorage`) pre-loaded with realistic college data. Requires zero external database or backend setup to demonstrate all features.
* **Live Backend Mode (`VITE_USE_MOCK=false`):**
  Routes all requests to the Express backend via `VITE_API_BASE_URL=http://localhost:3000/api`.

---

## 📖 Key Documentation Links

* [Final System Architecture Specification](docs/system_architecture_final.md)
* [REST API Contract for Backend Integration](client/API_CONTRACT.md)
* [Backend Developer Integration Guide](client/BACKEND_INTEGRATION_GUIDE.md)
* [5-Entity Data Dictionary](docs/SEPM_Data_Dictionary.md)
* [Gantt Chart & Project Schedule](docs/GANTT_CHART.md)
* [Risk Management Plan](docs/RISK_MANAGEMENT.md)
* [Project Plan & Deliverables](docs/project_plan.md)

---

## 👥 Project Team & Contributors
Developed as part of the **Software Engineering and Project Management (SEPM)** curriculum for **BMS Institute of Technology and Management**.
