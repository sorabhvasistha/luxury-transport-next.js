# LuxeRide Transport

LuxeRide is a Next.js luxury transportation application. Visitors can browse the public LuxeRide experience and available vehicles, while administrators can sign in to a protected dashboard for fleet and booking-lead management.

## Features

- Next.js App Router application with TypeScript
- SQLite database managed through Prisma ORM
- Seeded luxury vehicle inventory
- Seeded administrator account with bcrypt password hashing
- NextAuth credentials authentication
- JWT-based authenticated sessions stored in secure cookies
- Protected `/admin/*` routes through NextAuth middleware
- Public LuxeRide landing page, fleet, services, about, and booking routes
- Responsive Tailwind CSS interface
- Remote vehicle images from Unsplash through Next.js image configuration
- Admin dashboard with vehicle and pending-inquiry counts

The booking, fleet-management, and lead-management screens currently provide the application surfaces for those workflows; persistence for new bookings and admin mutations can be added on top of the existing Prisma models.

## Project Structure

```text
luxury-transport-next.js/
├── app/
│   ├── (public)/
│   │   ├── page.tsx              # Public landing page
│   │   ├── about/page.tsx        # Company information
│   │   ├── book/page.tsx         # Booking entry point
│   │   ├── fleet/page.tsx        # Database-backed fleet listing
│   │   ├── services/page.tsx     # Service overview
│   │   └── layout.tsx            # Public navigation and footer
│   ├── (admin)/
│   │   ├── admin/dashboard/      # Fleet and inquiry statistics
│   │   ├── admin/fleet/           # Fleet administration surface
│   │   ├── admin/leads/           # Booking lead administration surface
│   │   └── layout.tsx             # Protected admin shell
│   ├── admin/login/page.tsx       # Administrator sign-in form
│   ├── api/auth/[...nextauth]/    # NextAuth credentials endpoints
│   ├── globals.css                # Global Tailwind styles
│   └── layout.tsx                 # Root layout and fonts
├── prisma/
│   ├── schema.prisma              # Admin, Vehicle, and Inquiry models
│   └── seed.ts                    # Development database seed
├── middleware.ts                  # Protects `/admin/*` routes
├── next.config.ts                 # Remote image configuration
├── prisma.config.ts               # Prisma skills metadata
├── package.json
└── README.md
```

## Prerequisites

- Node.js 20.9 or newer
- npm

PostgreSQL is not required. The application uses SQLite and stores the local database at `prisma/dev.db` based on the datasource in `prisma/schema.prisma`.

## Environment Variables

Create `.env.local` in the project root with a secret used by NextAuth:

```env
NEXTAUTH_SECRET=replace-with-a-long-random-secret
```

For local development, NextAuth can use `http://localhost:3000` as its default URL. Set `NEXTAUTH_URL` explicitly when deploying behind a custom domain or proxy:

```env
NEXTAUTH_URL=http://localhost:3000
```

Never commit `.env.local` or production secrets.

## Run Locally

Install dependencies, generate the Prisma client, create the SQLite schema, and seed development data:

```bash
npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Development Admin Login

The seed script creates this administrator account:

```text
Email:    admin@luxeride.com
Password: password123
```

Use these credentials at [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for local development only. Change the seed credentials before using the application in any shared or production environment.

## Routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/` | LuxeRide landing page |
| `GET` | `/fleet` | Browse available vehicles from SQLite |
| `GET` | `/services` | View transportation services |
| `GET` | `/about` | View company information |
| `GET` | `/book` | Open the booking flow entry point |
| `GET` | `/admin/login` | Administrator sign-in |
| `GET` | `/admin/dashboard` | Protected dashboard statistics |
| `GET` | `/admin/fleet` | Protected fleet management surface |
| `GET` | `/admin/leads` | Protected booking-lead surface |
| `GET/POST` | `/api/auth/*` | NextAuth authentication endpoints |

## Authentication Flow

1. Open `/admin/login` and submit the seeded administrator credentials.
2. NextAuth validates the credentials against the Prisma `Admin` record.
3. The password is compared with bcrypt; plaintext passwords are not stored.
4. NextAuth creates an authenticated JWT session cookie.
5. Requests to `/admin/*`, except `/admin/login`, pass through `middleware.ts`.
6. An unauthenticated request is redirected to `/admin/login`.

## Database Models

- `Admin`: administrator email and bcrypt password hash.
- `Vehicle`: vehicle name, class, passenger capacity, luggage capacity, image, rate, description, and availability.
- `Inquiry`: booking request fields and status values such as `PENDING`, `CONFIRMED`, and `REJECTED`.

To reset and reseed the local vehicle data, run:

```bash
npx prisma db push
npx tsx prisma/seed.ts
```

The seed script intentionally removes existing vehicles before inserting the sample fleet. Do not run it against a production database.

## Validation Commands

Lint the project:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Run the built application:

```bash
npm run start
```

Useful Prisma commands:

```bash
npx prisma studio
npx prisma validate
```

## Local Files Not Committed

The root `.gitignore` excludes generated and machine-specific files, including:

- `.env*` environment files
- `node_modules/`
- `.next/` and production build output
- SQLite database files created under `prisma/`
- TypeScript build information and debug logs

## Deployment

The application can be deployed to a Node-compatible Next.js host such as Vercel. Configure `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and a production-ready database strategy before deployment. The local SQLite setup is intended for development and single-instance use; use a managed database when the application requires concurrent production writes or multiple application instances.