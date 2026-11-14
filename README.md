# SEPM-Group-CCA — College Event Management System

*A centralized platform for college event organization, student registrations, participant attendance, and verified certificate credentials.*

Developed as part of the **Software Engineering and Project Management (SEPM)** curriculum.

---

## 📁 Repository Structure

```text
SEPM-Group-CCA/
├── client/                     # Complete React.js + Vite + Tailwind CSS Frontend (Port 5173)
│   ├── src/                    # Components, pages (Student, Organizer, Admin), routes, services
│   ├── API_CONTRACT.md         # Full REST API Contract specification for backend integration
│   ├── BACKEND_INTEGRATION_GUIDE.md # Express developer integration guide
│   └── README.md               # Detailed frontend documentation and feature checklist
├── docs/                       # System architecture, database designs, WBS, sequence diagrams, DFDs
│   ├── system_architecture_final.md # Approved 3-tier Layered Monolith specification
│   ├── project_plan.md         # Project plan, milestones, and deliverables
│   ├── SEPM_Data_Dictionary.md # 5-Entity schema reference
│   ├── SEPM_Database_Schema_Design.md
│   ├── schema.prisma           # Prisma schema definition
│   └── Sequence_Diagram_*.png  # Architectural workflow diagrams
└── README.md
```

---

## 🚀 Frontend Quick Start (`client/`)

### 1. Installation
```bash
cd client
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The frontend will start at **`http://localhost:5173`**.

> You can also run `npm run dev` directly from the repository root.

### 3. Dual-Mode Operation
- **Mock Mode (Default):** Runs immediately in the browser using persistent `localStorage` with seed data for Students, Organizers, and Admins. Test all interactive features without needing a local database running.
- **Live Backend Mode:** Set `VITE_USE_MOCK=false` in `client/.env` to connect directly to the Express REST API at `http://localhost:3000/api`.

---

## 📖 Key Project Documentation

- [System Architecture (Final)](docs/system_architecture_final.md)
- [Project Plan](docs/project_plan.md)
- [Frontend Documentation & Testing Checklist](client/README.md)
- [REST API Contract](client/API_CONTRACT.md)
- [Backend Integration Guide](client/BACKEND_INTEGRATION_GUIDE.md)
- [Data Dictionary](docs/SEPM_Data_Dictionary.md)
