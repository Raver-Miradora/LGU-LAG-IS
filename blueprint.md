# LGUIS — Local Government Unit of Lagonoy Information System

## Blueprint & Technical Specification Document

**Version:** 1.0  
**Date:** February 23, 2026  
**Project Code:** LGUIS  
**Client:** Local Government Unit of Lagonoy, Camarines Sur

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Overview](#2-system-overview)
3. [Stakeholders & User Roles](#3-stakeholders--user-roles)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Module Breakdown](#6-module-breakdown)
7. [Tech Stack](#7-tech-stack)
8. [System Architecture](#8-system-architecture)
9. [Database Schema](#9-database-schema)
10. [API Design](#10-api-design)
11. [UI/UX Wireframe Plan](#11-uiux-wireframe-plan)
12. [PDF & ID Generation](#12-pdf--id-generation)
13. [Security Plan](#13-security-plan)
14. [Deployment Strategy](#14-deployment-strategy)
15. [Project Timeline](#15-project-timeline)
16. [Future Enhancements](#16-future-enhancements)

---

## 1. Executive Summary

The **LGUIS (Local Government Unit of Lagonoy Information System)** is a web-based information management platform designed to digitize and streamline two core functions of the LGU of Lagonoy:

1. **Human Resources (HR) Management** — Managing employee profiles, service records, PDF document generation, and LGU ID issuance.
2. **Public Employment Service Office (PESO) Employment Programs** — Managing beneficiaries and records for SPES, OJT, TUPAD, and Livelihood programs.

The system aims to replace manual, paper-based processes with a centralized, searchable, and auditable digital platform that improves efficiency, data accuracy, and public service delivery.

---

## 2. System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     LGUIS — LGU of Lagonoy                      │
│                     Information System                           │
├───────────────────────────┬─────────────────────────────────────┤
│       HR MODULE           │      PESO EMPLOYMENT MODULE         │
├───────────────────────────┼─────────────────────────────────────┤
│ • Employee Profile CRUD   │ • SPES Program Management           │
│ • Service Record Tracking │ • OJT Program Management            │
│ • PDF Document Generation │ • TUPAD Program Management          │
│ • LGU ID Card Generation  │ • Livelihood Program Management     │
│ • Employee Search/Filter  │ • Beneficiary Registration          │
│ • Dashboard & Analytics   │ • Program Reports & Analytics       │
└───────────────────────────┴─────────────────────────────────────┘
```

---

## 3. Stakeholders & User Roles

### 3.1 Stakeholders
| Stakeholder | Interest |
|---|---|
| LGU Mayor / Administrator | Overall system visibility, reports |
| HR Officer / Staff | Employee management, ID issuance |
| PESO Manager | Employment program oversight |
| PESO Staff / Encoder | Beneficiary data entry |
| IT Administrator | System maintenance, user management |
| Employees | View own profile/records |
| PESO Beneficiaries | Program enrollment |

### 3.2 User Roles & Permissions

| Role | Access |
|---|---|
| **Super Admin** | Full system access, user management, system settings, audit logs |
| **HR Admin** | Full HR module access: CRUD employees, generate IDs, export PDFs, manage service records |
| **HR Staff** | HR module: create/edit employees, view service records (no delete) |
| **PESO Admin** | Full PESO module access: all programs, reports, beneficiary management |
| **PESO Staff** | PESO module: register beneficiaries, update records (no delete, limited reports) |
| **Viewer** | Read-only access to assigned module(s) |

---

## 4. Functional Requirements

### 4.1 HR Module

| ID | Requirement | Priority |
|---|---|---|
| HR-01 | Register new employee with complete profile (personal info, position, department, employment type, photo) | Must Have |
| HR-02 | Edit/update employee information | Must Have |
| HR-03 | Deactivate/archive employee records (soft delete) | Must Have |
| HR-04 | Search and filter employees by name, department, position, status | Must Have |
| HR-05 | Track service records: appointments, promotions, transfers, separations with dates and references | Must Have |
| HR-06 | Add, edit, delete service record entries per employee | Must Have |
| HR-07 | Generate printable PDF of employee service record (CSC Form 212 format) | Must Have |
| HR-08 | Generate printable PDF of Personal Data Sheet (PDS) | Should Have |
| HR-09 | Upload and attach scanned documents (appointments, certifications) per employee | Must Have |
| HR-10 | Generate and print LGU Employee ID cards (front and back) with photo, QR code, and employee details | Must Have |
| HR-11 | Batch ID generation for multiple employees | Should Have |
| HR-12 | Employee dashboard showing headcount summaries, department breakdown, employment status | Should Have |
| HR-13 | Export employee masterlist to Excel/CSV | Should Have |
| HR-14 | Audit log for all HR data changes | Must Have |

### 4.2 PESO Employment Module

| ID | Requirement | Priority |
|---|---|---|
| PESO-01 | Register beneficiaries with personal information, contact details, education, skills | Must Have |
| PESO-02 | Enroll beneficiaries into specific programs (SPES, OJT, TUPAD, Livelihood) | Must Have |
| PESO-03 | **SPES:** Track student-beneficiaries — school, year level, assigned agency, work period, daily rate, total compensation | Must Have |
| PESO-04 | **OJT:** Track trainees — school/institution, course, host company, training period, supervisor, completion status | Must Have |
| PESO-05 | **TUPAD:** Track workers — project assignment, work period (min/max days), daily wage, barangay, skills matched | Must Have |
| PESO-06 | **Livelihood:** Track beneficiaries — program type (skills training, capital assistance, etc.), amount granted, business type, status | Must Have |
| PESO-07 | Update beneficiary status per program (active, completed, terminated, graduated) | Must Have |
| PESO-08 | Search and filter beneficiaries by program, barangay, status, date range | Must Have |
| PESO-09 | Generate program-specific reports (PDF) — masterlist, summary, completion reports | Must Have |
| PESO-10 | Dashboard per program showing enrollment count, completion rates, active beneficiaries | Should Have |
| PESO-11 | Export program data to Excel/CSV | Should Have |
| PESO-12 | Duplicate detection to prevent same beneficiary enrolled twice in overlapping periods | Should Have |
| PESO-13 | Audit log for all PESO data changes | Must Have |

### 4.3 General / Cross-Cutting

| ID | Requirement | Priority |
|---|---|---|
| GEN-01 | User authentication (login/logout) with username and password | Must Have |
| GEN-02 | Role-based access control (RBAC) | Must Have |
| GEN-03 | System dashboard (landing page) with quick stats from both modules | Should Have |
| GEN-04 | User management (create, edit, deactivate users; assign roles) | Must Have |
| GEN-05 | System audit trail (who did what, when) | Must Have |
| GEN-06 | Responsive design (works on desktop, tablet) | Must Have |
| GEN-07 | Data backup and restore functionality | Should Have |
| GEN-08 | System settings (LGU name, logo, address for forms/IDs) | Should Have |

---

## 5. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | Page load < 2 seconds; report generation < 10 seconds for up to 5,000 records |
| **Scalability** | Support up to 50 concurrent users; handle up to 10,000 employee/beneficiary records |
| **Availability** | 99% uptime during office hours (8 AM – 5 PM, Mon–Fri) |
| **Security** | Password hashing (bcrypt), session management, HTTPS in production, SQL injection prevention |
| **Data Integrity** | Soft deletes only; all changes audited; database transactions for multi-step operations |
| **Usability** | Intuitive interface; minimal training required; Filipino/Bikol-friendly labels where applicable |
| **Compatibility** | Chrome 90+, Edge 90+, Firefox 90+; minimum screen width 1024px |
| **Backup** | Daily automated database backup; manual export option |
| **Compliance** | Data Privacy Act of 2012 (RA 10173) — proper data handling and consent |

---

## 6. Module Breakdown

### 6.1 HR Module — Feature Map

```
HR MODULE
├── Employee Profile
│   ├── Personal Information (name, birthdate, gender, civil status, address, contact)
│   ├── Employment Details (employee no., position, department, salary grade, step, status)
│   ├── Photo Upload (2x2 ID photo, webcam capture option)
│   ├── Emergency Contact
│   ├── Education Background
│   ├── Eligibility / Civil Service
│   └── Document Attachments (scanned files)
│
├── Service Record
│   ├── Chronological list of appointments
│   │   ├── Date From – Date To
│   │   ├── Designation / Position
│   │   ├── Status (permanent, casual, coterminous, job order, COS)
│   │   ├── Salary / Monthly Rate
│   │   ├── Office / Department
│   │   ├── Branch / Division
│   │   ├── Leave Without Pay (LWOP) notation
│   │   └── Separation Date & Cause (if applicable)
│   ├── Auto-computation of total years of service
│   └── Reference number tracking
│
├── PDF Generation
│   ├── Service Record PDF (CSC-standard format)
│   ├── Personal Data Sheet (PDS) PDF
│   ├── Certificate of Employment PDF
│   └── Custom letterhead with LGU logo and signatory
│
└── LGU ID Card
    ├── Front: Photo, Name, Position, Department, Employee No., QR Code
    ├── Back: Emergency contact, Blood type, LGU address, Validity date
    ├── ID layout template (CR-80 standard card size: 3.375" × 2.125")
    └── Batch print support
```

### 6.2 PESO Employment Module — Feature Map

```
PESO EMPLOYMENT MODULE
├── Beneficiary Registry (shared across all programs)
│   ├── Personal Information
│   ├── Address / Barangay
│   ├── Education & Skills
│   ├── Contact Information
│   └── Photo (optional)
│
├── SPES (Special Program for Employment of Students)
│   ├── Application & Enrollment
│   ├── School & Year Level
│   ├── Assigned Government Agency / Office
│   ├── Employment Period (from – to)
│   ├── Daily Rate & Total Compensation (60% govt, 40% employer or vice versa)
│   ├── Attendance / Timesheet tracking (optional)
│   ├── Completion Certificate generation
│   └── Reports: Masterlist, Financial summary
│
├── OJT (On-the-Job Training)
│   ├── Application & Enrollment
│   ├── School / Institution & Course
│   ├── Host Company / Establishment
│   ├── Training Period & Required Hours
│   ├── Supervisor Details
│   ├── Completion / Evaluation Status
│   ├── Certificate of Completion generation
│   └── Reports: Trainee masterlist, Completion rates
│
├── TUPAD (Tulong Panghanapbuhay sa Ating Disadvantaged/Displaced Workers)
│   ├── Application & Enrollment
│   ├── Barangay & Household Info
│   ├── Project Assignment (type of work)
│   ├── Work Period (10–30 days max as per DOLE guidelines)
│   ├── Daily Wage Rate (prevailing minimum wage)
│   ├── Skills Category
│   ├── Payroll Summary per batch
│   ├── Certificate / Completion doc
│   └── Reports: Beneficiary list per batch, Financial summary, Barangay breakdown
│
└── LIVELIHOOD
    ├── Application & Enrollment
    ├── Program Sub-type
    │   ├── Skills Training
    │   ├── Starter Kit / Tools Distribution
    │   ├── Seed Capital / Cash Assistance
    │   └── Micro-enterprise Development
    ├── Amount / Value of Assistance
    ├── Business Type / Nature of Livelihood
    ├── Status Tracking (applied, approved, disbursed, monitoring, completed)
    ├── Monitoring Updates (follow-up notes, photos)
    └── Reports: Beneficiary list, Disbursement summary, Success rate
```

---

## 7. Tech Stack

### 7.1 Selected Technologies

| Layer | Technology | Justification |
|---|---|---|
| **Frontend** | **React 18 + Vite** | Fast builds, component-based, huge ecosystem, easy to hire/train for |
| **UI Framework** | **Tailwind CSS + shadcn/ui** | Utility-first CSS, pre-built accessible components, consistent design system |
| **State Management** | **Zustand** | Lightweight, simple API, no boilerplate vs Redux |
| **Routing** | **React Router v6** | Standard React SPA routing |
| **Forms** | **React Hook Form + Zod** | Performant forms with schema-based validation |
| **Tables** | **TanStack Table (React Table v8)** | Headless, sortable, filterable, paginated tables |
| **Backend** | **Node.js + Express.js** | JavaScript full-stack, lightweight, fast development |
| **ORM** | **Prisma** | Type-safe database access, auto-migration, excellent DX |
| **Database** | **PostgreSQL 16** | Robust, ACID-compliant, handles complex queries, free/open-source |
| **Authentication** | **JWT (jsonwebtoken) + bcrypt** | Stateless auth, secure password hashing |
| **PDF Generation** | **Puppeteer** (server-side HTML-to-PDF) | Pixel-perfect PDFs from HTML/CSS templates; supports letterheads, tables, photos |
| **ID Card Rendering** | **html2canvas + jsPDF** | Render ID card HTML to image/PDF for printing |
| **QR Code** | **qrcode** (npm) | Generate QR codes for employee IDs |
| **File Upload** | **Multer** | Handle multipart form data (photos, scanned docs) |
| **Image Processing** | **Sharp** | Resize/crop photos for IDs and profiles |
| **Excel Export** | **ExcelJS** | Generate .xlsx reports with formatting |
| **Date Handling** | **date-fns** | Lightweight date manipulation |
| **API Docs** | **Swagger (swagger-jsdoc + swagger-ui-express)** | Auto-generated API documentation |
| **Testing** | **Vitest + React Testing Library** (frontend), **Jest + Supertest** (backend) | Fast, modern test frameworks |
| **Linting** | **ESLint + Prettier** | Code quality and consistent formatting |
| **Version Control** | **Git** | Source control |

### 7.2 Why This Stack?

- **Full JavaScript/TypeScript** — Single language across frontend and backend reduces context switching and simplifies hiring/training of LGU IT staff.
- **PostgreSQL over MySQL** — Better support for complex queries, JSON columns, full-text search; excellent for government data with strict integrity needs.
- **Puppeteer for PDFs** — Government forms require exact formatting (CSC forms, service records). Puppeteer renders HTML/CSS to PDF with pixel-perfect accuracy, including headers, footers, and page numbers.
- **Prisma ORM** — Auto-generates TypeScript types from the schema, making the codebase safer and easier to maintain.
- **shadcn/ui** — Not a heavy component library; it's copy-paste components that you own, keeping bundle size small and customizable.

### 7.3 Development Tools

| Tool | Purpose |
|---|---|
| VS Code | Primary IDE |
| Docker & Docker Compose | Containerized local dev (PostgreSQL, app) |
| pgAdmin 4 | Database GUI management |
| Postman | API testing |
| GitHub | Repository hosting |
| Figma (optional) | UI/UX prototyping |

---

## 8. System Architecture

### 8.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                       │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              React SPA (Vite + Tailwind)                │ │
│  │  ┌────────────┐ ┌────────────┐ ┌──────────────────────┐│ │
│  │  │  HR Pages  │ │ PESO Pages │ │  Admin/Settings Pages ││ │
│  │  └────────────┘ └────────────┘ └──────────────────────┘│ │
│  └──────────────────────┬──────────────────────────────────┘ │
│                         │ HTTP/REST (JSON)                    │
└─────────────────────────┼────────────────────────────────────┘
                          │
┌─────────────────────────┼────────────────────────────────────┐
│                    API SERVER (Express.js)                     │
│  ┌──────────────────────┴──────────────────────────────────┐ │
│  │                   Middleware Layer                        │ │
│  │  ┌─────────┐ ┌──────┐ ┌──────────┐ ┌────────────────┐  │ │
│  │  │  Auth   │ │ CORS │ │ Validate │ │  Rate Limiter  │  │ │
│  │  │  (JWT)  │ │      │ │  (Zod)   │ │                │  │ │
│  │  └─────────┘ └──────┘ └──────────┘ └────────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                   Route Handlers                         │ │
│  │  /api/auth    /api/employees    /api/service-records     │ │
│  │  /api/peso/*  /api/reports      /api/settings            │ │
│  └──────────────────────┬──────────────────────────────────┘ │
│  ┌──────────────────────┴──────────────────────────────────┐ │
│  │               Service / Business Logic                   │ │
│  └──────────────────────┬──────────────────────────────────┘ │
│  ┌──────────────────────┴──────────────────────────────────┐ │
│  │                  Prisma ORM Layer                        │ │
│  └──────────────────────┬──────────────────────────────────┘ │
└─────────────────────────┼────────────────────────────────────┘
                          │
┌─────────────────────────┼────────────────────────────────────┐
│                    DATA LAYER                                  │
│  ┌──────────────────────┴───────┐  ┌───────────────────────┐ │
│  │       PostgreSQL 16          │  │   File Storage         │ │
│  │  (employees, service_records,│  │   /uploads/            │ │
│  │   beneficiaries, programs,   │  │   ├── photos/          │ │
│  │   users, audit_logs)         │  │   ├── documents/       │ │
│  └──────────────────────────────┘  │   └── generated/       │ │
│                                     └───────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### 8.2 Project Folder Structure

```
LGUIS/
├── client/                          # React Frontend
│   ├── public/
│   │   └── assets/                  # LGU logo, icons
│   ├── src/
│   │   ├── components/              # Shared UI components
│   │   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── layout/              # Sidebar, Header, Footer
│   │   │   └── common/              # DataTable, SearchBar, PageHeader
│   │   ├── features/                # Feature-based modules
│   │   │   ├── auth/                # Login, AuthContext
│   │   │   ├── dashboard/           # Main dashboard
│   │   │   ├── hr/
│   │   │   │   ├── employees/       # Employee CRUD pages
│   │   │   │   ├── service-record/  # Service record pages
│   │   │   │   ├── pdf/             # PDF preview/generation
│   │   │   │   └── id-card/         # LGU ID card generation
│   │   │   ├── peso/
│   │   │   │   ├── beneficiaries/   # Shared beneficiary registry
│   │   │   │   ├── spes/            # SPES program pages
│   │   │   │   ├── ojt/             # OJT program pages
│   │   │   │   ├── tupad/           # TUPAD program pages
│   │   │   │   └── livelihood/      # Livelihood program pages
│   │   │   └── admin/
│   │   │       ├── users/           # User management
│   │   │       ├── settings/        # System settings
│   │   │       └── audit-log/       # Audit trail viewer
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── lib/                     # Utilities, API client, helpers
│   │   ├── stores/                  # Zustand stores
│   │   ├── types/                   # TypeScript type definitions
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── router.tsx               # Route definitions
│   ├── index.html
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── server/                          # Express.js Backend
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema
│   │   ├── migrations/              # Auto-generated migrations
│   │   └── seed.ts                  # Seed data (default admin, settings)
│   ├── src/
│   │   ├── config/                  # DB connection, env config
│   │   ├── middleware/              # Auth, validation, error handler, audit
│   │   ├── modules/
│   │   │   ├── auth/                # Login, token refresh, password reset
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.routes.ts
│   │   │   ├── employees/
│   │   │   │   ├── employee.controller.ts
│   │   │   │   ├── employee.service.ts
│   │   │   │   └── employee.routes.ts
│   │   │   ├── service-records/
│   │   │   ├── peso/
│   │   │   │   ├── beneficiary.controller.ts
│   │   │   │   ├── spes.controller.ts
│   │   │   │   ├── ojt.controller.ts
│   │   │   │   ├── tupad.controller.ts
│   │   │   │   └── livelihood.controller.ts
│   │   │   ├── reports/
│   │   │   ├── users/
│   │   │   └── settings/
│   │   ├── templates/               # HTML templates for PDF/ID generation
│   │   │   ├── service-record.hbs
│   │   │   ├── pds.hbs
│   │   │   ├── certificate.hbs
│   │   │   └── id-card.hbs
│   │   ├── utils/                   # Helpers, PDF generator, QR generator
│   │   ├── app.ts                   # Express app setup
│   │   └── server.ts                # Entry point
│   ├── uploads/                     # File storage directory
│   │   ├── photos/
│   │   ├── documents/
│   │   └── generated/               # Generated PDFs, ID images
│   ├── tsconfig.json
│   └── package.json
│
├── docker-compose.yml               # PostgreSQL + App containers
├── .env.example                     # Environment variable template
├── .gitignore
├── README.md
└── blueprint.md                     # This document
```

---

## 9. Database Schema

### 9.1 Entity Relationship Diagram (Conceptual)

```
┌──────────────┐       ┌───────────────────┐       ┌──────────────────┐
│    users      │       │    employees       │       │  service_records  │
├──────────────┤       ├───────────────────┤       ├──────────────────┤
│ id (PK)      │       │ id (PK)           │──┐    │ id (PK)          │
│ username     │       │ employee_no       │  │    │ employee_id (FK) │
│ password_hash│       │ first_name        │  │    │ date_from        │
│ full_name    │       │ middle_name       │  ├───>│ date_to          │
│ role         │       │ last_name         │  │    │ designation      │
│ is_active    │       │ suffix            │  │    │ status           │
│ created_at   │       │ birthdate         │  │    │ salary           │
│ updated_at   │       │ gender            │  │    │ office           │
└──────────────┘       │ civil_status      │  │    │ branch           │
                       │ address           │  │    │ lwop             │
                       │ contact_no        │  │    │ separation_date  │
                       │ email             │  │    │ separation_cause │
                       │ position          │  │    │ remarks          │
                       │ department        │  │    └──────────────────┘
                       │ salary_grade      │  │
                       │ step_increment    │  │    ┌──────────────────┐
                       │ employment_status │  │    │ employee_docs    │
                       │ date_hired        │  │    ├──────────────────┤
                       │ photo_url         │  ├───>│ id (PK)          │
                       │ blood_type        │  │    │ employee_id (FK) │
                       │ emergency_contact │  │    │ file_name        │
                       │ emergency_phone   │  │    │ file_path        │
                       │ is_active         │  │    │ file_type        │
                       │ created_at        │  │    │ description      │
                       │ updated_at        │  │    │ uploaded_at      │
                       └───────────────────┘  │    └──────────────────┘
                                              │
                                              │    ┌──────────────────┐
                                              └───>│ id_cards         │
                                                   ├──────────────────┤
                                                   │ id (PK)          │
                                                   │ employee_id (FK) │
                                                   │ id_number        │
                                                   │ issued_date      │
                                                   │ expiry_date      │
                                                   │ qr_data          │
                                                   │ is_active        │
                                                   └──────────────────┘

┌───────────────────┐       ┌───────────────────────┐
│  beneficiaries     │       │  spes_enrollments      │
├───────────────────┤       ├───────────────────────┤
│ id (PK)           │──┐    │ id (PK)               │
│ first_name        │  │    │ beneficiary_id (FK)   │
│ middle_name       │  ├───>│ school                │
│ last_name         │  │    │ year_level            │
│ suffix            │  │    │ assigned_agency       │
│ birthdate         │  │    │ period_from           │
│ gender            │  │    │ period_to             │
│ civil_status      │  │    │ daily_rate            │
│ address           │  │    │ total_days            │
│ barangay          │  │    │ total_compensation    │
│ contact_no        │  │    │ govt_share            │
│ email             │  │    │ employer_share        │
│ education_level   │  │    │ status                │
│ school            │  │    │ batch_year            │
│ course            │  │    │ remarks               │
│ skills            │  │    │ created_at            │
│ photo_url         │  │    └───────────────────────┘
│ created_at        │  │
│ updated_at        │  │    ┌───────────────────────┐
└───────────────────┘  │    │  ojt_enrollments       │
                       │    ├───────────────────────┤
                       ├───>│ id (PK)               │
                       │    │ beneficiary_id (FK)   │
                       │    │ school                │
                       │    │ course                │
                       │    │ host_company          │
                       │    │ period_from           │
                       │    │ period_to             │
                       │    │ required_hours        │
                       │    │ rendered_hours        │
                       │    │ supervisor_name       │
                       │    │ supervisor_contact    │
                       │    │ status                │
                       │    │ evaluation_rating     │
                       │    │ remarks               │
                       │    │ created_at            │
                       │    └───────────────────────┘
                       │
                       │    ┌───────────────────────┐
                       │    │  tupad_enrollments     │
                       │    ├───────────────────────┤
                       ├───>│ id (PK)               │
                       │    │ beneficiary_id (FK)   │
                       │    │ project_name          │
                       │    │ work_type             │
                       │    │ barangay              │
                       │    │ period_from           │
                       │    │ period_to             │
                       │    │ total_days            │
                       │    │ daily_wage            │
                       │    │ total_wage            │
                       │    │ skills_category       │
                       │    │ batch_no              │
                       │    │ status                │
                       │    │ remarks               │
                       │    │ created_at            │
                       │    └───────────────────────┘
                       │
                       │    ┌───────────────────────┐
                       │    │ livelihood_enrollments │
                       │    ├───────────────────────┤
                       └───>│ id (PK)               │
                            │ beneficiary_id (FK)   │
                            │ program_type          │
                            │ assistance_type       │
                            │ amount                │
                            │ business_type         │
                            │ business_name         │
                            │ status                │
                            │ approved_date         │
                            │ disbursed_date        │
                            │ monitoring_notes      │
                            │ remarks               │
                            │ created_at            │
                            │ updated_at            │
                            └───────────────────────┘

┌──────────────────────┐    ┌───────────────────────┐
│    audit_logs        │    │   system_settings     │
├──────────────────────┤    ├───────────────────────┤
│ id (PK)              │    │ id (PK)               │
│ user_id (FK)         │    │ key                   │
│ action               │    │ value                 │
│ entity_type          │    │ description           │
│ entity_id            │    │ updated_at            │
│ old_values (JSON)    │    └───────────────────────┘
│ new_values (JSON)    │
│ ip_address           │
│ timestamp            │
└──────────────────────┘
```

### 9.2 Prisma Schema (Key Models)

```prisma
// schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  SUPER_ADMIN
  HR_ADMIN
  HR_STAFF
  PESO_ADMIN
  PESO_STAFF
  VIEWER
}

enum Gender {
  MALE
  FEMALE
}

enum EmploymentStatus {
  PERMANENT
  CASUAL
  COTERMINOUS
  JOB_ORDER
  CONTRACT_OF_SERVICE
  TEMPORARY
  ELECTED
}

enum ProgramStatus {
  ACTIVE
  COMPLETED
  TERMINATED
  GRADUATED
  ON_HOLD
}

enum LivelihoodProgramType {
  SKILLS_TRAINING
  STARTER_KIT
  SEED_CAPITAL
  CASH_ASSISTANCE
  MICRO_ENTERPRISE
}

enum LivelihoodStatus {
  APPLIED
  APPROVED
  DISBURSED
  MONITORING
  COMPLETED
  TERMINATED
}

model User {
  id           String     @id @default(uuid())
  username     String     @unique
  passwordHash String     @map("password_hash")
  fullName     String     @map("full_name")
  role         Role       @default(VIEWER)
  isActive     Boolean    @default(true) @map("is_active")
  createdAt    DateTime   @default(now()) @map("created_at")
  updatedAt    DateTime   @updatedAt @map("updated_at")
  auditLogs    AuditLog[]

  @@map("users")
}

model Employee {
  id               String           @id @default(uuid())
  employeeNo       String           @unique @map("employee_no")
  firstName        String           @map("first_name")
  middleName       String?          @map("middle_name")
  lastName         String           @map("last_name")
  suffix           String?
  birthdate        DateTime
  gender           Gender
  civilStatus      String           @map("civil_status")
  address          String
  contactNo        String?          @map("contact_no")
  email            String?
  position         String
  department       String
  salaryGrade      Int?             @map("salary_grade")
  stepIncrement    Int?             @map("step_increment")
  employmentStatus EmploymentStatus @map("employment_status")
  dateHired        DateTime         @map("date_hired")
  photoUrl         String?          @map("photo_url")
  bloodType        String?          @map("blood_type")
  emergencyContact String?          @map("emergency_contact")
  emergencyPhone   String?          @map("emergency_phone")
  educationBg      Json?            @map("education_bg")
  eligibility      Json?
  isActive         Boolean          @default(true) @map("is_active")
  createdAt        DateTime         @default(now()) @map("created_at")
  updatedAt        DateTime         @updatedAt @map("updated_at")

  serviceRecords ServiceRecord[]
  documents      EmployeeDocument[]
  idCards        IdCard[]

  @@map("employees")
}

model ServiceRecord {
  id              String    @id @default(uuid())
  employeeId      String    @map("employee_id")
  dateFrom        DateTime  @map("date_from")
  dateTo          DateTime? @map("date_to")
  designation     String
  status          String    // employment status at the time
  salary          Decimal   @db.Decimal(12, 2)
  office          String
  branch          String?
  lwop            String?   // leave without pay notation
  separationDate  DateTime? @map("separation_date")
  separationCause String?   @map("separation_cause")
  referenceNo     String?   @map("reference_no")
  remarks         String?
  createdAt       DateTime  @default(now()) @map("created_at")

  employee Employee @relation(fields: [employeeId], references: [id])

  @@map("service_records")
}

model EmployeeDocument {
  id          String   @id @default(uuid())
  employeeId  String   @map("employee_id")
  fileName    String   @map("file_name")
  filePath    String   @map("file_path")
  fileType    String   @map("file_type")
  fileSize    Int      @map("file_size")
  description String?
  uploadedAt  DateTime @default(now()) @map("uploaded_at")

  employee Employee @relation(fields: [employeeId], references: [id])

  @@map("employee_documents")
}

model IdCard {
  id         String   @id @default(uuid())
  employeeId String   @map("employee_id")
  idNumber   String   @unique @map("id_number")
  issuedDate DateTime @map("issued_date")
  expiryDate DateTime @map("expiry_date")
  qrData     String   @map("qr_data")
  isActive   Boolean  @default(true) @map("is_active")
  createdAt  DateTime @default(now()) @map("created_at")

  employee Employee @relation(fields: [employeeId], references: [id])

  @@map("id_cards")
}

model Beneficiary {
  id             String   @id @default(uuid())
  firstName      String   @map("first_name")
  middleName     String?  @map("middle_name")
  lastName       String   @map("last_name")
  suffix         String?
  birthdate      DateTime
  gender         Gender
  civilStatus    String   @map("civil_status")
  address        String
  barangay       String
  contactNo      String?  @map("contact_no")
  email          String?
  educationLevel String?  @map("education_level")
  school         String?
  course         String?
  skills         String[]
  photoUrl       String?  @map("photo_url")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  spesEnrollments       SpesEnrollment[]
  ojtEnrollments        OjtEnrollment[]
  tupadEnrollments      TupadEnrollment[]
  livelihoodEnrollments LivelihoodEnrollment[]

  @@map("beneficiaries")
}

model SpesEnrollment {
  id                String        @id @default(uuid())
  beneficiaryId     String        @map("beneficiary_id")
  school            String
  yearLevel         String        @map("year_level")
  assignedAgency    String        @map("assigned_agency")
  periodFrom        DateTime      @map("period_from")
  periodTo          DateTime      @map("period_to")
  dailyRate         Decimal       @map("daily_rate") @db.Decimal(10, 2)
  totalDays         Int           @map("total_days")
  totalCompensation Decimal       @map("total_compensation") @db.Decimal(12, 2)
  govtShare         Decimal?      @map("govt_share") @db.Decimal(12, 2)
  employerShare     Decimal?      @map("employer_share") @db.Decimal(12, 2)
  status            ProgramStatus @default(ACTIVE)
  batchYear         Int           @map("batch_year")
  remarks           String?
  createdAt         DateTime      @default(now()) @map("created_at")

  beneficiary Beneficiary @relation(fields: [beneficiaryId], references: [id])

  @@map("spes_enrollments")
}

model OjtEnrollment {
  id                String        @id @default(uuid())
  beneficiaryId     String        @map("beneficiary_id")
  school            String
  course            String
  hostCompany       String        @map("host_company")
  periodFrom        DateTime      @map("period_from")
  periodTo          DateTime      @map("period_to")
  requiredHours     Int           @map("required_hours")
  renderedHours     Int?          @map("rendered_hours")
  supervisorName    String?       @map("supervisor_name")
  supervisorContact String?       @map("supervisor_contact")
  status            ProgramStatus @default(ACTIVE)
  evaluationRating  String?       @map("evaluation_rating")
  remarks           String?
  createdAt         DateTime      @default(now()) @map("created_at")

  beneficiary Beneficiary @relation(fields: [beneficiaryId], references: [id])

  @@map("ojt_enrollments")
}

model TupadEnrollment {
  id             String        @id @default(uuid())
  beneficiaryId  String        @map("beneficiary_id")
  projectName    String        @map("project_name")
  workType       String        @map("work_type")
  barangay       String
  periodFrom     DateTime      @map("period_from")
  periodTo       DateTime      @map("period_to")
  totalDays      Int           @map("total_days")
  dailyWage      Decimal       @map("daily_wage") @db.Decimal(10, 2)
  totalWage      Decimal       @map("total_wage") @db.Decimal(12, 2)
  skillsCategory String?       @map("skills_category")
  batchNo        String?       @map("batch_no")
  status         ProgramStatus @default(ACTIVE)
  remarks        String?
  createdAt      DateTime      @default(now()) @map("created_at")

  beneficiary Beneficiary @relation(fields: [beneficiaryId], references: [id])

  @@map("tupad_enrollments")
}

model LivelihoodEnrollment {
  id              String                @id @default(uuid())
  beneficiaryId   String                @map("beneficiary_id")
  programType     LivelihoodProgramType @map("program_type")
  assistanceType  String?               @map("assistance_type")
  amount          Decimal?              @db.Decimal(12, 2)
  businessType    String?               @map("business_type")
  businessName    String?               @map("business_name")
  status          LivelihoodStatus      @default(APPLIED)
  approvedDate    DateTime?             @map("approved_date")
  disbursedDate   DateTime?             @map("disbursed_date")
  monitoringNotes String?               @map("monitoring_notes")
  remarks         String?
  createdAt       DateTime              @default(now()) @map("created_at")
  updatedAt       DateTime              @updatedAt @map("updated_at")

  beneficiary Beneficiary @relation(fields: [beneficiaryId], references: [id])

  @@map("livelihood_enrollments")
}

model AuditLog {
  id         String   @id @default(uuid())
  userId     String   @map("user_id")
  action     String   // CREATE, UPDATE, DELETE, LOGIN, LOGOUT, GENERATE_PDF, GENERATE_ID
  entityType String   @map("entity_type") // employee, service_record, beneficiary, etc.
  entityId   String?  @map("entity_id")
  oldValues  Json?    @map("old_values")
  newValues  Json?    @map("new_values")
  ipAddress  String?  @map("ip_address")
  timestamp  DateTime @default(now())

  user User @relation(fields: [userId], references: [id])

  @@index([entityType, entityId])
  @@index([userId])
  @@index([timestamp])
  @@map("audit_logs")
}

model SystemSetting {
  id          String   @id @default(uuid())
  key         String   @unique
  value       String
  description String?
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("system_settings")
}
```

---

## 10. API Design

### 10.1 API Endpoints

Base URL: `/api/v1`

#### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | User login, returns JWT |
| POST | `/auth/logout` | Invalidate session |
| POST | `/auth/change-password` | Change user password |
| GET | `/auth/me` | Get current user profile |

#### Users (Super Admin only)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/users` | List all users |
| POST | `/users` | Create new user |
| PUT | `/users/:id` | Update user |
| PATCH | `/users/:id/deactivate` | Deactivate user |

#### Employees (HR Module)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/employees` | List employees (paginated, filterable) |
| GET | `/employees/:id` | Get employee detail |
| POST | `/employees` | Create employee |
| PUT | `/employees/:id` | Update employee |
| PATCH | `/employees/:id/archive` | Soft-delete / archive |
| POST | `/employees/:id/photo` | Upload employee photo |
| GET | `/employees/export` | Export to Excel/CSV |

#### Service Records
| Method | Endpoint | Description |
|---|---|---|
| GET | `/employees/:id/service-records` | List service records for employee |
| POST | `/employees/:id/service-records` | Add service record entry |
| PUT | `/service-records/:id` | Update entry |
| DELETE | `/service-records/:id` | Delete entry |
| GET | `/employees/:id/service-records/pdf` | Generate service record PDF |

#### Employee Documents
| Method | Endpoint | Description |
|---|---|---|
| GET | `/employees/:id/documents` | List attached documents |
| POST | `/employees/:id/documents` | Upload document |
| DELETE | `/documents/:id` | Delete document |
| GET | `/documents/:id/download` | Download document file |

#### ID Cards
| Method | Endpoint | Description |
|---|---|---|
| POST | `/employees/:id/id-card` | Generate ID card |
| POST | `/id-cards/batch` | Batch generate IDs |
| GET | `/employees/:id/id-card/preview` | Preview ID card |
| GET | `/employees/:id/id-card/pdf` | Download ID card as PDF |

#### PESO — Beneficiaries
| Method | Endpoint | Description |
|---|---|---|
| GET | `/beneficiaries` | List beneficiaries (paginated, filterable) |
| GET | `/beneficiaries/:id` | Get beneficiary detail + all enrollments |
| POST | `/beneficiaries` | Register beneficiary |
| PUT | `/beneficiaries/:id` | Update beneficiary |
| GET | `/beneficiaries/export` | Export to Excel |
| GET | `/beneficiaries/duplicate-check` | Check for duplicates |

#### PESO — SPES
| Method | Endpoint | Description |
|---|---|---|
| GET | `/peso/spes` | List SPES enrollments |
| POST | `/peso/spes` | Enroll beneficiary in SPES |
| PUT | `/peso/spes/:id` | Update enrollment |
| PATCH | `/peso/spes/:id/status` | Update status |
| GET | `/peso/spes/report/pdf` | Generate SPES report PDF |

#### PESO — OJT
| Method | Endpoint | Description |
|---|---|---|
| GET | `/peso/ojt` | List OJT enrollments |
| POST | `/peso/ojt` | Enroll in OJT |
| PUT | `/peso/ojt/:id` | Update enrollment |
| PATCH | `/peso/ojt/:id/status` | Update status |
| GET | `/peso/ojt/report/pdf` | Generate OJT report PDF |

#### PESO — TUPAD
| Method | Endpoint | Description |
|---|---|---|
| GET | `/peso/tupad` | List TUPAD enrollments |
| POST | `/peso/tupad` | Enroll in TUPAD |
| PUT | `/peso/tupad/:id` | Update enrollment |
| PATCH | `/peso/tupad/:id/status` | Update status |
| GET | `/peso/tupad/report/pdf` | Generate TUPAD report PDF |

#### PESO — Livelihood
| Method | Endpoint | Description |
|---|---|---|
| GET | `/peso/livelihood` | List livelihood enrollments |
| POST | `/peso/livelihood` | Enroll in livelihood program |
| PUT | `/peso/livelihood/:id` | Update enrollment |
| PATCH | `/peso/livelihood/:id/status` | Update status |
| GET | `/peso/livelihood/report/pdf` | Generate livelihood report PDF |

#### Reports & Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard/hr` | HR summary stats |
| GET | `/dashboard/peso` | PESO summary stats |
| GET | `/reports/hr/employees` | Employee report PDF |
| GET | `/reports/peso/:program` | Program-specific report PDF |

#### System
| Method | Endpoint | Description |
|---|---|---|
| GET | `/settings` | Get system settings |
| PUT | `/settings` | Update settings |
| GET | `/audit-logs` | List audit logs (paginated, filterable) |
| POST | `/backup` | Trigger database backup |

---

## 11. UI/UX Wireframe Plan

### 11.1 Layout Structure

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER BAR                                      [User] [⚙] │
│  LGU Lagonoy Information System                              │
├────────────┬─────────────────────────────────────────────────┤
│            │                                                 │
│  SIDEBAR   │              MAIN CONTENT AREA                  │
│            │                                                 │
│ Dashboard  │  ┌───────────────────────────────────────────┐  │
│            │  │  Page Header + Breadcrumbs                │  │
│ ▼ HR       │  ├───────────────────────────────────────────┤  │
│  Employees │  │                                           │  │
│  Service   │  │  Content (forms, tables, cards, etc.)     │  │
│  Records   │  │                                           │  │
│  ID Cards  │  │                                           │  │
│            │  │                                           │  │
│ ▼ PESO     │  │                                           │  │
│  Registry  │  │                                           │  │
│  SPES      │  │                                           │  │
│  OJT       │  │                                           │  │
│  TUPAD     │  │                                           │  │
│  Livelihood│  │                                           │  │
│            │  └───────────────────────────────────────────┘  │
│ ▼ Admin    │                                                 │
│  Users     │                                                 │
│  Settings  │                                                 │
│  Audit Log │                                                 │
│            │                                                 │
└────────────┴─────────────────────────────────────────────────┘
```

### 11.2 Key Pages

| Page | Description |
|---|---|
| **Login** | Clean centered login form with LGU logo |
| **Dashboard** | Cards showing: total employees, active SPES/OJT/TUPAD/Livelihood, recent activity feed |
| **Employee List** | Searchable data table with filters (department, status), action buttons (view, edit, ID, PDF) |
| **Employee Form** | Multi-step or tabbed form: Personal Info → Employment → Education → Emergency Contact |
| **Employee Detail** | Profile view with tabs: Overview, Service Records, Documents, ID Card |
| **Service Record** | Timeline/table view of appointments; add/edit modal; "Generate PDF" button |
| **ID Card Preview** | Visual ID card preview (front/back) with "Print" and "Download PDF" actions |
| **Beneficiary List** | Data table with program filter badges (SPES, OJT, TUPAD, Livelihood) |
| **Beneficiary Form** | Registration form with personal data + optional program enrollment |
| **Program Enrollment** | Program-specific enrollment form (auto-loads beneficiary data) |
| **Program Dashboard** | Per-program stats: pie chart (status), bar chart (by barangay), KPI cards |
| **User Management** | User CRUD table with role assignment |
| **Audit Log** | Searchable/filterable log table with timestamp, user, action, entity |
| **System Settings** | Form for LGU name, address, logo upload, signatory names |

### 11.3 Design Principles
- **Government-professional aesthetic**: Clean, minimal, blue/navy primary color palette
- **Optimized for data entry**: Tab-navigable forms, smart defaults, inline validation
- **Print-friendly**: PDF previews match final print output exactly
- **Accessible**: Proper labels, contrast ratios, keyboard navigation

---

## 12. PDF & ID Generation

### 12.1 PDF Templates

| Template | Format | Details |
|---|---|---|
| **Service Record** | A4 Portrait | CSC-standard layout; employee header, chronological table, signatory footer, LGU seal |
| **Personal Data Sheet** | A4 Portrait (multi-page) | CSC Form 212 format; 4 pages covering personal info, education, work experience, references |
| **Certificate of Employment** | A4 Portrait | Letterhead, body text with employee details, signatory block, date |
| **Program Masterlist** | A4 Landscape | Table of beneficiaries per program with summary row |
| **ID Card** | CR-80 (3.375" × 2.125") | Custom layout with photo, QR code; 4-up or 8-up on A4 for batch printing |

### 12.2 PDF Generation Flow

```
Browser Request → API Endpoint → Load Data from DB
                                      ↓
                              Render HTML Template (Handlebars)
                              with data + LGU logo + signatories
                                      ↓
                              Puppeteer: HTML → PDF Buffer
                                      ↓
                              Return PDF as download / inline preview
```

### 12.3 LGU ID Card Layout

**Front:**
```
┌─────────────────────────────────────────┐
│  [LGU LOGO]  Republic of the Philippines │
│              Province of Camarines Sur   │
│            Municipality of Lagonoy       │
│         EMPLOYEE IDENTIFICATION CARD     │
├──────────┬──────────────────────────────┤
│          │  Name: DELA CRUZ, JUAN M.    │
│  [2x2    │  Position: Admin Aide IV     │
│  PHOTO]  │  Dept: Municipal Planning    │
│          │  Employee No: LGU-2026-0042  │
│          │  Date Issued: 02/23/2026     │
├──────────┴──────────────────────────────┤
│  [QR CODE]            Valid Until: 2027 │
└─────────────────────────────────────────┘
```

**Back:**
```
┌─────────────────────────────────────────┐
│  In case of emergency, please notify:   │
│  Name: Maria Dela Cruz                  │
│  Contact: 0917-123-4567                │
│                                         │
│  Blood Type: O+                         │
│                                         │
│  ───────────────────────                │
│  Signature of Employee                  │
│                                         │
│  Municipal Government of Lagonoy        │
│  Lagonoy, Camarines Sur                 │
│                                         │
│  ───────────────────────                │
│  HON. [MAYOR NAME]                      │
│  Municipal Mayor                        │
└─────────────────────────────────────────┘
```

---

## 13. Security Plan

| Area | Implementation |
|---|---|
| **Authentication** | JWT with 8-hour expiry (office hours); refresh tokens with 24-hour expiry |
| **Password Storage** | bcrypt with 12 salt rounds |
| **Password Policy** | Minimum 8 characters; enforced on creation and change |
| **Authorization** | Middleware checks user role against route permissions |
| **Input Validation** | Zod schemas validate all request bodies and query parameters server-side |
| **SQL Injection** | Prisma ORM uses parameterized queries by default |
| **XSS Prevention** | React auto-escapes output; CSP headers in production |
| **CORS** | Whitelist only the frontend origin |
| **Rate Limiting** | express-rate-limit: 100 requests/min per IP for API; 5 attempts/min for login |
| **File Upload** | Validate file types (images: jpg/png; docs: pdf/docx); max 10MB; sanitize filenames |
| **Audit Trail** | Every data mutation logged with user, timestamp, old/new values |
| **Data Privacy** | RA 10173 compliance: consent tracking, data minimization, access logging |
| **HTTPS** | Enforced in production via reverse proxy (nginx) |
| **Session Security** | HTTP-only cookies for refresh token; no sensitive data in localStorage |

---

## 14. Deployment Strategy

### 14.1 Development Environment

```bash
# Local development with Docker
docker-compose up -d   # Starts PostgreSQL
npm run dev:server     # Express.js on port 5000
npm run dev:client     # Vite dev server on port 5173
```

### 14.2 Production Deployment (LGU On-Premise)

Given that Philippine LGUs typically have local servers, the recommended deployment is:

```
┌───────────────────────────────────────────────────┐
│              LGU Server (Windows/Linux)            │
│  ┌─────────────────────────────────────────────┐  │
│  │ nginx (reverse proxy, HTTPS termination)    │  │
│  │  → :443 (HTTPS) → :5000 (API)              │  │
│  │  → :443/        → :5173 (Static frontend)  │  │
│  └─────────────────────────────────────────────┘  │
│  ┌─────────────────┐  ┌───────────────────────┐  │
│  │ Node.js (PM2)   │  │ PostgreSQL 16         │  │
│  │ Express API      │  │ Port 5432             │  │
│  │ Port 5000        │  │                       │  │
│  └─────────────────┘  └───────────────────────┘  │
│  ┌─────────────────────────────────────────────┐  │
│  │ /var/lguis/uploads/   (file storage)        │  │
│  │ /var/lguis/backups/   (daily DB dumps)      │  │
│  └─────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────┘
         │
    LGU Local Network (LAN)
         │
    ┌────┴────┐  ┌────────┐  ┌────────┐
    │ HR PC   │  │PESO PC │  │Admin PC│
    └─────────┘  └────────┘  └────────┘
```

### 14.3 Backup Strategy

| Type | Frequency | Retention | Method |
|---|---|---|---|
| Full DB dump | Daily (12:00 AM) | 30 days | `pg_dump` → compressed → `/backups/` |
| Upload files | Daily | 30 days | Sync to backup folder |
| Off-site | Weekly | 90 days | Copy to external HDD or cloud storage |

---

## 15. Project Timeline

### Phase 1: Foundation (Weeks 1–3)
- [x] Requirements analysis and blueprint (this document)
- [x] Project setup: repo, folder structure, tooling (ESLint, Prettier, TypeScript)
- [x] Database schema design and Prisma setup
- [x] Authentication module (login, JWT, RBAC middleware)
- [x] User management CRUD
- [x] Base UI layout: sidebar, header, routing

### Phase 2: HR Module (Weeks 4–7)
- [x] Employee CRUD (profile form, list, detail view)
- [x] Photo upload and management
- [x] Service record CRUD
- [x] Document upload/attachment (with download support)
- [x] Service record PDF generation
- [x] LGU ID card generation + QR code
- [x] HR dashboard with statistics

### Phase 3: PESO Module (Weeks 8–11)
- [ ] Beneficiary registration CRUD
- [ ] SPES enrollment and management
- [ ] OJT enrollment and management
- [ ] TUPAD enrollment and management
- [ ] Livelihood enrollment and management
- [ ] Program-specific dashboards
- [ ] Program report PDF generation

### Phase 4: Polish & Deployment (Weeks 12–14)
- [ ] Audit log viewer
- [ ] System settings management
- [ ] Excel/CSV export functionality
- [ ] Comprehensive testing
- [ ] Security hardening
- [ ] Deployment setup (nginx, PM2, backup scripts)
- [ ] User training documentation
- [ ] UAT with LGU staff

### Estimated Total: 14 weeks (3.5 months)

---

## 16. Future Enhancements

| Enhancement | Description |
|---|---|
| **Leave Management** | Track employee leave credits, applications, approvals |
| **DTR / Attendance** | Integrate with biometric devices or manual time-in/out |
| **Payroll Integration** | Compute salaries based on salary grade, deductions, net pay |
| **SMS Notifications** | Send SMS to beneficiaries for program updates (via Semaphore/Globe Labs API) |
| **Mobile App** | React Native companion app for field workers enrolling beneficiaries |
| **Barangay Portal** | Allow barangay offices to submit TUPAD/livelihood referrals |
| **Document OCR** | Scan and digitize old paper service records |
| **Reporting Analytics** | Advanced charts, exportable dashboards, year-over-year comparisons |
| **Multi-LGU Support** | SaaS version for provincial government managing multiple LGUs |

---

## Appendix A: Environment Variables

```env
# .env.example

# Application
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# Database
DATABASE_URL=postgresql://lguis_user:your_password@localhost:5432/lguis_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=8h
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this
JWT_REFRESH_EXPIRES_IN=24h

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760  # 10MB in bytes

# LGU Settings (also configurable in DB)
LGU_NAME=Municipality of Lagonoy
LGU_PROVINCE=Camarines Sur
LGU_ADDRESS=Lagonoy, Camarines Sur

# Backup
BACKUP_DIR=./backups
```

---

## Appendix B: Key Dependencies

### Frontend (`client/package.json`)
```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.26.0",
    "react-hook-form": "^7.53.0",
    "@hookform/resolvers": "^3.9.0",
    "zod": "^3.23.0",
    "zustand": "^4.5.0",
    "@tanstack/react-table": "^8.20.0",
    "@tanstack/react-query": "^5.56.0",
    "axios": "^1.7.0",
    "tailwindcss": "^3.4.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0",
    "lucide-react": "^0.441.0",
    "date-fns": "^3.6.0",
    "recharts": "^2.12.0",
    "react-to-print": "^2.15.0",
    "sonner": "^1.5.0"
  }
}
```

### Backend (`server/package.json`)
```json
{
  "dependencies": {
    "express": "^4.21.0",
    "@prisma/client": "^5.19.0",
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.1.0",
    "zod": "^3.23.0",
    "multer": "^1.4.0",
    "sharp": "^0.33.0",
    "puppeteer": "^23.3.0",
    "handlebars": "^4.7.0",
    "qrcode": "^1.5.0",
    "exceljs": "^4.4.0",
    "cors": "^2.8.0",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.4.0",
    "morgan": "^1.10.0",
    "winston": "^3.14.0",
    "dotenv": "^16.4.0"
  },
  "devDependencies": {
    "prisma": "^5.19.0",
    "typescript": "^5.6.0",
    "tsx": "^4.19.0",
    "nodemon": "^3.1.0",
    "@types/express": "^4.17.0",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/bcrypt": "^5.0.0",
    "@types/multer": "^1.4.0",
    "@types/cors": "^2.8.0",
    "@types/morgan": "^1.9.0"
  }
}
```

---

*This blueprint serves as the single source of truth for the LGUIS project. All development decisions should reference this document. Update this document as requirements evolve.*
