# Zareen Skin Care

Zareen Skin Care is a completely free and unlimited appointment-booking platform specifically designed for dermatologists, skin specialists, aesthetic practitioners, cosmetic dermatologists, trichologists, and aesthetic physicians.

---

## 🌟 Features

### 🌐 Public
- **Specialist Discovery:** Search, filter by specialty, city, experience, and ratings.
- **Specialist Profiles:** Verified professional bios, qualifications, clinic locations, and service menus.
- **Interactive Booking:** Live slot generator derived from real specialist weekly working hours, break periods, and calendar blocked dates.
- **Service Catalog:** Detailed consultation and clinical treatment descriptions with transparent durations and pricing.

### 👤 Patient
- **Dashboard Overview:** Upcoming appointments, real-time status updates, and notification alerts.
- **Appointment Management:** Live reschedule and cancellation flows with reason tracking.
- **Booking History:** Chronological log of past, completed, and cancelled consultations.
- **Profile Management:** Contact details and location preferences.
- **In-App Notifications:** Real-time notifications for booking confirmations, schedule changes, and reminders.

### 🩺 Specialist
- **Clinical Dashboard:** Daily metrics, upcoming patients, and activity feeds.
- **Interactive Calendar:** Visual schedule view across week and month views.
- **Service Management:** Full CRUD operations for clinical treatments, consultation durations, and active statuses.
- **Working Hours & Breaks:** Configurable 7-day recurring schedules with custom lunch/break intervals.
- **Blocked Dates:** Blackout dates for leaves, holidays, or clinic maintenance.
- **Appointment Actions:** Reschedule, cancel, mark completed, or mark no-show.

### 🛡️ Administrator
- **Executive Dashboard:** Real-time platform metrics (total specialists, active patients, booking volume, completion ratios).
- **Specialist Directory:** Profile audits, visibility toggles, and account status management (active/suspended).
- **Patient Database:** Account status oversight and engagement records.
- **Global Appointment Oversight:** Cross-platform appointment monitoring with filter and search capabilities.
- **Analytics & Aggregation Reports:** 7-day, 30-day, and 90-day time-series reports and performance charts.
- **Platform Settings:** System-wide configuration management.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Styling & Design System:** Tailwind CSS v4 + Plus Jakarta Sans typography
- **State Management:** Redux Toolkit (Auth, Specialist, Appointment, Notifications, UI slices)
- **Routing:** React Router DOM v7 (Public, Role-Guarded, and Protected layouts)
- **Icons & Motion:** Lucide React & Framer Motion
- **Forms & Validation:** React Hook Form + Zod
- **HTTP Client:** Axios (configured with `withCredentials: true`)

### Backend
- **Runtime & Framework:** Node.js + Express.js
- **Database:** MongoDB + Mongoose ODM
- **Authentication:** JWT stored in secure HTTP-only cookies (`SameSite: Lax` / `Secure`)
- **Password Hashing:** bcryptjs with salt rounds
- **Input Validation:** express-validator middleware
- **Email Dispatch:** Nodemailer with graceful fallback when SMTP is unconfigured
- **Security:** CORS origin whitelisting, centralized error handling, sanitized query parsing, and IDOR boundary enforcement

---

## 📁 Project Structure

```text
zareen-skin-care/
│
├── backend/
│   ├── config/          # DB, email, and authentication configs
│   ├── controllers/     # Route controllers for all business domains
│   ├── database/        # Mongoose connection & initialization
│   ├── middleware/      # Auth, role authorization, and centralized error handler
│   ├── models/          # User, Specialist, Patient, Service, Availability, BlockedDate, Appointment, Notification
│   ├── routes/          # Express route definitions & health check
│   ├── scripts/         # Administrative provisioning CLI scripts
│   ├── services/        # Business logic services & conflict engine
│   ├── utils/           # Time helpers, API error models, serializers
│   ├── validators/      # express-validator schemas
│   ├── .env.example     # Backend environment template
│   ├── package.json
│   └── server.js        # Express application entry point & graceful shutdown
│
├── frontend/
│   ├── public/          # Static branding assets
│   └── src/
│       ├── api/         # Axios instance & API client modules
│       ├── app/         # Redux store configuration
│       ├── assets/      # Design assets & icons
│       ├── components/  # Reusable UI elements (Buttons, Modals, Badges, Loaders)
│       ├── features/    # Redux slices, thunks, and selectors
│       ├── guards/      # ProtectedRoute & RoleRoute guards
│       ├── hooks/       # Custom React hooks
│       ├── layouts/     # Public, Specialist, Patient, and Admin layouts
│       ├── pages/       # Application views across all user roles
│       ├── routes/      # Centralized React Router configuration
│       ├── App.jsx      # Root component with auth restoration
│       ├── index.css    # Global Tailwind CSS tokens & typography
│       └── main.jsx     # Vite React entry point
│
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Setup

### Backend (`backend/.env`)

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/zareen_skin_care

# JWT & Cookie Session
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_EXPIRES_IN=7d
COOKIE_NAME=zareen_auth_token
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax

# Email / SMTP Configuration (Optional)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
FROM_EMAIL=no-reply@zareenskincare.com
FROM_NAME="Zareen Skin Care"
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 💻 Installation & Running Locally

### 1. Backend Setup

```bash
cd backend
npm install

# Start development server with auto-reload
npm run dev

# Provision Platform Administrator Account (CLI)
node scripts/createAdmin.js
```

### 2. Frontend Setup

```bash
cd frontend
npm install

# Start Vite development server
npm run dev
```

---

## 🚀 Production Build & Deployment

### Frontend Production Build

```bash
cd frontend
npm run build
```
Build output is generated into `frontend/dist/` ready for static CDN or web server hosting.

### Backend Production Start

```bash
cd backend
npm start
```
Starts Express server on `PORT` with production configuration (`NODE_ENV=production`, `COOKIE_SECURE=true`).

---

## 🔒 Authentication & Authorization

- **Session Security:** JWTs are stored strictly in HTTP-only cookies to eliminate XSS token theft. No tokens exist in `localStorage` or `sessionStorage`.
- **Role-Based Access Control:** Three discrete roles (`patient`, `specialist`, `admin`) enforced by server-side middleware (`authMiddleware.js` + `roleMiddleware.js`).
- **Admin Privilege Escalation Prevention:** Public registration strictly permits only `patient` or `specialist` roles; `admin` registration attempts return `400 Bad Request`.
- **IDOR Protection:** Resource ownership is resolved directly from `req.user._id`, ensuring users cannot mutate or access records belonging to other accounts.

---

## ⚠️ Important Notes & Medical Disclaimer

- **100% Free SaaS:** Zareen Skin Care is completely free with unlimited bookings. No payment gateways, subscriptions, or premium tiers exist.
- **Appointment Booking Only:** Zareen Skin Care provides appointment scheduling and coordination. It does **not** provide medical diagnosis, clinical prescriptions, or automated treatment decisions.
