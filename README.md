# SEPM-Group-CCA — College Event Management System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-success?style=for-the-badge&logo=vercel)](https://client-orpin-ten-51.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20TailwindCSS-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![License](https://img.shields.io/badge/Course-SEPM%20Curriculum-orange?style=for-the-badge)](docs/project_plan.md)

> A comprehensive, modern web application designed for collegiate event planning, multi-role participant registrations, venue scheduling, attendance monitoring, and verifiable certificate issuance.

---

## 🌐 Live Deployment

* **Production URL:** [https://client-orpin-ten-51.vercel.app](https://client-orpin-ten-51.vercel.app)
* **Status:** 🟢 Live & Operational (Runs with stateful mock backend for complete interactive demonstration)

---

## 🔑 Quick Demo Access

The deployed application features an in-browser stateful mock backend adhering strictly to the 5-entity database schema. You can log in using the pre-configured accounts or click **Quick Demo Login** on the login page:

| Role | Email | Password | Features Accessible |
|---|---|---|---|
| **Student** | `alex.cs22@college.edu` | `Student@123` | Browse & search events, single-click registration, view/cancel registrations, PDF certificate download, profile & settings |
| **Organizer** | `rahul.cs@college.edu` | `Organizer@123` | Event creation & edit wizard, publish/cancel events, real-time participant roster, CSV exports, event metrics |
| **Admin** | `admin@college.edu` | `Admin@123` | User directory & role assignment, venue directory & capacities, system-wide registrations, issuance of certificates, analytics dashboards |

---

## 📁 Repository Structure

```text
SEPM-Group-CCA/
├── client/                          # React.js + Vite + Tailwind CSS Frontend (Port 5173)
│   ├── src/
│   │   ├── assets/                  # Static assets and icons
│   │   ├── components/
│   │   │   ├── common/              # Buttons, Badges, Modals, Tables, Inputs, DevBanner
│   │   │   └── navigation/          # PublicNavbar, Sidebar, TopNavbar, Footers
│   │   ├── context/                 # AuthContext (role-based) & NotificationContext
│   │   ├── layouts/                 # PublicLayout & DashboardLayout
│   │   ├── pages/
│   │   │   ├── public/              # Landing, Login, Registration, Restricted pages
│   │   │   ├── student/             # Overview, Browse Events, Registrations, Certificates
│   │   │   ├── organizer/           # Overview, Event CRUD, Participants, Reports
│   │   │   └── admin/               # Overview, Users, Events, Venues, Registrations, Analytics
│   │   ├── routes/                  # ProtectedRoute & AppRoutes
│   │   ├── services/                # API Client, Mock Backend & Service Layer
│   │   └── types/                   # Constants, Roles, Statuses, College branding
│   ├── vercel.json                  # Single Page Application (SPA) routing configuration
│   ├── API_CONTRACT.md              # Full REST API Contract specification for backend team
│   ├── BACKEND_INTEGRATION_GUIDE.md # Step-by-step Express/Prisma integration guide
│   └── README.md                    # Detailed frontend documentation & test checklist
├── docs/                            # System architecture, database designs, WBS, diagrams
│   ├── system_architecture_final.md # Approved 3-tier Layered Monolith specification
│   ├── project_plan.md              # Project plan, team milestones, and deliverables
│   ├── SEPM_Data_Dictionary.md      # 5-Entity schema reference & field descriptions
│   ├── SEPM_Database_Schema_Design.md # Relational schema design
│   ├── schema.prisma                # Prisma ORM schema definition
│   └── Sequence_Diagram_*.png       # Architectural workflow diagrams
└── README.md                        # Project root documentation
```

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | React.js (v18.3) | Component-driven UI architecture |
| **Build Tool** | Vite | Lightning-fast HMR and bundling |
| **Styling** | Tailwind CSS | Modern, responsive design system |
| **Routing** | React Router DOM v6 | Role-protected routing & nested layouts |
| **Icons & Charts** | Lucide React & Recharts | Clean visual iconography & data visualization |
| **Backend (Target)** | Node.js + Express.js | Layered Monolithic REST API (Port 3000) |
| **Database (Target)** | PostgreSQL + Prisma ORM | 5 Relational Entities: Users, Venues, Events, Registrations, Certificates |
| **Deployment** | Vercel | Automatic CI/CD hosting |

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
# From root directory:
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
* [Project Plan & Deliverables](docs/project_plan.md)

---

## 👥 Project Team & Contributors
Developed as part of the **Software Engineering and Project Management (SEPM)** university coursework.
