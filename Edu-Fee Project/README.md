<div align="center">

<br/>

# 🎓 EduFee — Student Fee Management System

**A production-ready, full-stack web application for managing student fees, installment schedules, payment tracking, and digital receipts — powered by a real Supabase backend with PostgreSQL and Row Level Security.**

<br/>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Screenshots](#-live-screenshots)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Security](#-security)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)

---

## 🌟 Overview

EduFee is a complete student fee management solution designed for educational institutions. It provides a role-based dual-portal system — a powerful **Admin Panel** for administrators and a clean **Student Portal** for enrolled students — both operating on the same real-time Supabase backend.

Administrators can define flexible fee plans with custom installment schedules, assign plans to students, process payments, and generate printable receipts. Students get instant visibility into their fee status, upcoming dues, and payment history — all secured by Supabase Row Level Security so every user only ever sees their own data.

---

## 📸 Live Screenshots

### Authentication

> Secure sign-in and student self-registration with demo credentials displayed for easy access.

| Register | Sign In |
|:---:|:---:|
| ![Register](ss/Screenshot%202026-04-02%20140249.png) | ![Sign In](ss/Screenshot%202026-04-02%20140307.png) |

---

### Admin Panel

> A comprehensive control panel for administrators to manage every aspect of student fee collection.

**Dashboard Overview**

> Live summary cards displaying total students, revenue collected, pending dues, and active fee plans — with a recent payments feed and pending dues tracker.

![Admin Dashboard](ss/Screenshot%202026-04-02%20150355.png)

---

**Student Management**

> Add new students directly from the admin panel with a clean modal form, or manage existing students from the searchable student list.

![Add Student Modal](ss/Screenshot%202026-04-02%20150233.png)

---

**Fee Plans**

> Create installment-based fee structures with custom amounts and due dates per installment. View all active plans with a full breakdown.

| Fee Plans List | Create Fee Plan |
|:---:|:---:|
| ![Fee Plans](ss/Screenshot%202026-04-02%20150246.png) | ![Create Fee Plan](ss/Screenshot%202026-04-02%20150259.png) |

---

**Assign Fees**

> Assign any fee plan to any student in one click. The assignments table shows real-time progress bars for each student's payment completion.

![Assign Fees](ss/Screenshot%202026-04-02%20150316.png)

---

**Record Payment**

> Process installment payments with a smart dropdown that shows paid and unpaid installments at a glance — overpayment is prevented automatically.

![Record Payment](ss/Screenshot%202026-04-02%20150126.png)

---

**Fee Tracking**

> Monitor payment status across all students with filterable views — All, Unpaid, Partial, and Fully Paid — with live aggregate stats at the top.

| Empty State | With Live Data |
|:---:|:---:|
| ![Fee Tracking Empty](ss/Screenshot%202026-04-02%20141639.png) | ![Fee Tracking With Data](ss/Screenshot%202026-04-02%20150158.png) |

---

**Receipt Generation**

> View and print a fully formatted fee receipt for any payment — includes student details, receipt number, course, installment number, and payment method.

![Fee Receipt](ss/Screenshot%202026-04-02%20150340.png)

---

### Student Portal

> A personal finance dashboard for students to track fees, dues, and payment receipts independently.

**Student Dashboard**

> Personal fee overview with total fee, amount paid, remaining balance, and progress percentage — plus a live installment schedule and recent payment feed.

| No Plan Assigned | With Active Fee Plan |
|:---:|:---:|
| ![Student Dashboard Empty](ss/Screenshot%202026-04-02%20142824.png) | ![Student Dashboard Active](ss/Screenshot%202026-04-02%20150450.png) |

---

**My Fees**

> Complete installment schedule showing amount, due date, amount paid, remaining balance, and real-time status badges (Paid / Pending / Overdue) with a visual progress bar.

![My Fees](ss/Screenshot%202026-04-02%20150607.png)

---

**Pending Dues**

> A dedicated overdue alert screen listing all outstanding installments with their due dates so students never miss a payment.

![Pending Dues](ss/Screenshot%202026-04-02%20150616.png)

---

**My Profile**

> Students can view their registered academic information, update personal details, and change their account password.

| View Profile | Edit Profile |
|:---:|:---:|
| ![My Profile](ss/Screenshot%202026-04-02%20142840.png) | ![Edit Profile](ss/Screenshot%202026-04-02%20150553.png) |

---

**My Receipts**

> A personal receipts log with printable receipt support — each entry shows receipt number, installment, amount, and date with one-click view and print actions.

![My Receipts](ss/Screenshot%202026-04-02%20150629.png)

---

## ✨ Features

### Admin Panel

| Feature | Description |
|---|---|
| **Dashboard** | Live stats — total students, total collected, pending dues, active fee plans |
| **Student Management** | Add, edit, delete students; search by name, registration number, or course |
| **Fee Plans** | Create plans with custom per-installment amounts and due dates |
| **Assign Fees** | Assign any fee plan to any student; view all assignments with live progress bars |
| **Record Payment** | Process payments per installment with automatic overpayment protection |
| **Fee Tracking** | Filter students by All / Unpaid / Partial / Fully Paid payment status |
| **All Receipts** | Browse, view, and print every payment receipt system-wide |
| **Payment History** | Full searchable transaction log across all students |
| **Notifications** | System-wide notification feed for all payment and assignment events |

### Student Portal

| Feature | Description |
|---|---|
| **Dashboard** | Personal fee summary with progress bar and recent payment feed |
| **My Fees** | Full installment schedule with paid / pending / overdue status badges |
| **Pending Dues** | Dedicated overdue alert view with outstanding installment details |
| **Payment History** | Personal transaction log with receipt numbers |
| **My Receipts** | View and print individual payment receipts |
| **Profile** | Edit personal info, phone, and address; change account password |
| **Notifications** | Real-time alerts when admin records a payment or assigns a fee plan |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) | UI and interactivity — zero build step |
| **Backend** | Supabase (PostgreSQL + Auth + Realtime) | Database, authentication, live updates |
| **Authentication** | Supabase Auth — email/password | Secure, role-based session management |
| **Database** | PostgreSQL via Supabase | Relational data storage with RLS |
| **Realtime** | Supabase Realtime (WebSockets) | Live notifications pushed to clients |
| **Hosting** | Netlify / Vercel / GitHub Pages | Free static hosting with global CDN |
| **Dependencies** | Supabase JS SDK v2 (CDN), Google Fonts | Loaded via CDN — no npm required |

---

## 🗄️ Database Schema

```
auth.users  (Supabase managed)
    └── profiles          (id, role, fname, lname, phone, course, batch, reg_no, address)
            ├── fee_assignments    (student_id → plan_id)
            │       └── payments  (assignment_id, installment_no, amount_paid, receipt_no, paid_at, notes)
            └── notifications     (student_id, type, message, is_read, created_at)

fee_plans  (id, name, total_amount, installment_count, created_at)
    └── installments  (plan_id, no, amount, due_date)
```

### Row Level Security Policies

Every table is protected by RLS policies enforced at the database level — not just in application code:

- Students can only read and modify their own profile, fees, and payment records
- Admins can read and manage all records across all students
- Payments can only be recorded by users with the `admin` role
- Notifications are scoped per student — no cross-user data leakage is possible

---

## 🚀 Quick Start

### Prerequisites

- A free [Supabase](https://supabase.com) account
- A modern web browser
- A local HTTP server (Python, Node.js, or VS Code Live Server)

---

### Step 1 — Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project** → enter a name, database password, and region
3. Wait approximately 2 minutes for the project to provision

---

### Step 2 — Run the Database Migration

1. In your Supabase dashboard, open **SQL Editor → New Query**
2. Open the file `supabase/migrations/001_initial_schema.sql` from this project
3. Paste the entire contents into the editor and click **Run**
4. You should see: `Success. No rows returned`

---

### Step 3 — Create the Admin User

Navigate to **Authentication → Users → Add User** in your Supabase dashboard and create:

```
Email:    admin@edufee.com
Password: Admin@123
```

Then run the following in the **SQL Editor** to elevate the account to admin role:

```sql
UPDATE public.profiles
SET role = 'admin', fname = 'Admin', lname = 'User', reg_no = 'ADMIN-001'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@edufee.com');
```

---

### Step 4 — Configure Credentials

1. In Supabase, navigate to **Settings → API**
2. Copy your **Project URL** and **anon / public key**
3. Open `js/config.js` and replace the placeholder values:

```javascript
const SUPABASE_CONFIG = {
  url: 'https://YOUR_PROJECT_ID.supabase.co',   // ← paste your Project URL
  anonKey: 'YOUR_ANON_PUBLIC_KEY',               // ← paste your anon key
};
```

---

### Step 5 — Run the Application

Serve the project using any of the following methods:

```bash
# Python (no install required)
python -m http.server 8000

# Node.js
npx serve .

# VS Code — install the Live Server extension and click "Go Live"
```

Then open **[http://localhost:8000](http://localhost:8000)** in your browser.

---

## 🔑 Default Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@edufee.com` | `Admin@123` |
| Student | Register via the Sign Up tab | — |

---

## 📁 Project Structure

```
edufee/
├── index.html                           ← Single-page application (HTML + CSS + JS)
├── js/
│   ├── config.js                        ← Supabase credentials (edit this file)
│   └── api.js                           ← All Supabase API functions
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql       ← Full database schema + RLS policies
├── ss/                                  ← Application screenshots
└── README.md
```

---

## 🔒 Security

- **Row Level Security** is enforced at the PostgreSQL level — bypass is not possible from the client
- The Supabase `anon` key is intentionally designed to be safe in client-side code; all sensitive access is controlled by RLS
- User passwords are hashed with bcrypt by Supabase Auth and are never stored in plain text
- For production use, enable **Email Confirmations** in Supabase Auth settings to prevent unauthorized registrations
- Never commit `js/config.js` with real credentials to a public repository — add it to `.gitignore`

---

## 🌍 Deployment

### Netlify — Recommended (Free)

1. Create an account at [netlify.com](https://netlify.com)
2. Drag and drop the `edufee/` folder onto the Netlify dashboard
3. Your application is immediately live at a generated URL

### Vercel

```bash
npm install -g vercel
cd edufee
vercel
```

### GitHub Pages

1. Push the project to a GitHub repository
2. Go to **Settings → Pages → Source → main branch / root**
3. Your site will be available at `https://yourusername.github.io/edufee`

---

## 🗺️ Roadmap

- [x] Full Supabase backend with Row Level Security
- [x] Real-time notifications via Supabase Realtime
- [x] Printable receipt generation
- [x] Role-based access control (Admin / Student)
- [x] Installment-based fee plans with custom due dates
- [x] Automatic overpayment protection on payment recording
- [ ] PDF export for payment receipts
- [ ] Automated email reminders via Supabase Edge Functions
- [ ] Bulk fee assignment by batch or course
- [ ] CSV / Excel export for admin financial reports
- [ ] Dashboard analytics charts
- [ ] Mobile-responsive layout improvements

---

## 📄 License

MIT License — free for personal and commercial use.

---

<div align="center">

Built with ❤️ using HTML, CSS, JavaScript & Supabase

</div>
