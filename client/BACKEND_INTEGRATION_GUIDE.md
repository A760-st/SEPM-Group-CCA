# Backend Integration Guide for Node.js / Express Developer

Welcome! This frontend was engineered specifically to connect seamlessly to your **Node.js + Express.js + Prisma + PostgreSQL** layered monolithic backend running on port `3000`.

---

## 1. Quick Integration Checklist

1. **Backend Server Port:** Ensure Express listens on port `3000` (`http://localhost:3000`).
2. **CORS Configuration:** Allow cross-origin requests from `http://localhost:5173`:
   ```javascript
   // In your Express app:
   import cors from 'cors';
   app.use(cors({
     origin: 'http://localhost:5173',
     credentials: true,
   }));
   ```
3. **Route Prefix:** Mount your REST API router under `/api`:
   ```javascript
   app.use('/api/auth', authRoutes);
   app.use('/api/users', userRoutes);
   app.use('/api/events', eventRoutes);
   app.use('/api/venues', venueRoutes);
   app.use('/api/registrations', registrationRoutes);
   app.use('/api/certificates', certificateRoutes);
   app.use('/api/reports', reportRoutes);
   ```

---

## 2. Switching the Frontend Between Mock Mode & Real Backend

In the frontend root directory, open `.env`:

### To connect to your REAL backend:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_USE_MOCK=false
```

### To use the standalone mock service (for independent frontend testing):
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_USE_MOCK=true
```

> **Note:** Even while in mock mode, the frontend top banner displays the target backend port `3000` and allows testing all flows before backend code is complete.

---

## 3. Layered Monolithic Architecture Compatibility

Your backend follows:
```
Routes -> Controllers -> Services -> Data Access (Prisma ORM) -> PostgreSQL
```

The frontend makes REST API calls only. It never accesses Prisma or the database directly.

### Role Authorization Enforcement:
The frontend respects the `role` returned inside the `user` object by your login/register endpoints:
- `role: "STUDENT"`
- `role: "ORGANIZER"`
- `role: "ADMIN"`

Always verify JWT tokens and roles in your Express route middleware (`authorizeRoles(['ORGANIZER', 'ADMIN'])`). The frontend protects routes via `ProtectedRoute.jsx`, but authoritative security is enforced by your backend.

---

## 4. Key Business Logic Expected by Frontend

1. **Student Public Registration:**
   - When a student registers via `POST /api/auth/register`, the backend must automatically assign `role = 'STUDENT'`. Do not trust role passed in payload for public registration.
2. **Capacity Validation:**
   - When creating an event (`POST /api/events`), ensure `max_participants <= venue.capacity`.
   - When registering (`POST /api/registrations`), ensure total confirmed registrations `< max_participants`.
3. **Deadline Validation:**
   - Reject registration requests where `current_timestamp > registration_deadline`.
4. **Attendance & Certificates:**
   - Marking attendance (`PATCH /api/registrations/:id/attendance`) sets `status = 'ATTENDED'` and `certificate_eligible = true`.
   - Only attended registrations can have certificates issued via `POST /api/certificates/issue`.
