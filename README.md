# LGU Lagonoy Information System (LGUIS)

A web-based information system for the Municipality of Lagonoy, Camarines Sur.

## Modules

- **HR Module** — Employee profiles, service records, document management, PDF generation, LGU ID cards
- **PESO Employment Module** — Beneficiary registration, SPES / OJT / TUPAD / Livelihood program management

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, Tailwind CSS, TanStack Query/Table, Zustand, Recharts |
| **Backend** | Node.js, Express, Prisma ORM, PDFKit, QRCode |
| **Database** | PostgreSQL 15 |
| **Auth** | JWT (access + refresh tokens), RBAC middleware |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+ (or Docker)
- npm / pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/Raver-Miradora/LGU-LAG-IS.git
cd LGU-LAG-IS

# Copy environment file and edit values
cp .env.example server/.env

# Start database (Docker)
docker compose up -d

# Install dependencies
cd server && npm install && cd ..
cd client && npm install && cd ..

# Run database migrations and seed
cd server
npx prisma migrate deploy
npx prisma db seed

# Start development servers
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Open http://localhost:5173 in your browser.

### Default Login

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | SUPER_ADMIN |

## Project Structure

```
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Route pages
│       ├── lib/         # API client, utilities
│       ├── stores/      # Zustand state stores
│       └── types/       # TypeScript interfaces
├── server/          # Express backend
│   ├── prisma/      # Schema, migrations, seed
│   └── src/
│       ├── config/      # Database, app config
│       ├── middleware/  # Auth, validation, error handling
│       └── modules/    # Feature modules (employees, service-records, peso, etc.)
├── blueprint.md     # Full technical specification
└── docker-compose.yml
```

## License

This project is developed for the Municipality of Lagonoy, Camarines Sur.
