# College Event Management System

## Project documentation

- [Final system architecture](docs/system_architecture_final.md)
- [Project plan](docs/project_plan.md)
- [Work breakdown structure](docs/WBS.md)
- [Requirements and analysis](docs/SEPM_Person1_Requirements_Analysis.pdf)

## Development setup

Requirements: Node.js 20.19+ (or 22.12+) and npm. PostgreSQL is required for
database-backed features; the health endpoint does not require a database.

### Frontend

```powershell
cd client
npm install
npm run dev
```

### Backend

```powershell
cd server
npm install
Copy-Item .env.example .env
# Set DATABASE_URL in .env to the PostgreSQL connection string for your local database.
npm run dev
```

The API listens on `http://localhost:3000` by default. Check
`http://localhost:3000/api/v1/health` for the server health response. CORS allows
the configured `CLIENT_ORIGIN` (default `http://localhost:5173`).

The database schema is in `server/prisma/schema.prisma`. After configuring and
verifying a real PostgreSQL database, use `npm run db:validate` to validate the
schema or `npm run db:generate` to generate the Prisma client. This setup does
not run migrations automatically.
