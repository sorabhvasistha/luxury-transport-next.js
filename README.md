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
- Responsive Tailwind CSS interface with a mobile hamburger navigation menu
- Remote vehicle images from Unsplash through Next.js image configuration
- Admin dashboard with vehicle and pending-inquiry counts
- Booking inquiry persistence through a Prisma server action
- Email notification for new booking inquiries through Nodemailer and Gmail SMTP
- Inquiry pricing and payment status tracking
- PayU checkout initialization with SHA-512 payment hashes
- PayU success and failure callbacks with transaction status updates
- Payment success and failure result pages

The booking flow saves inquiries to SQLite, sends an email notification when configured, and can hand a priced inquiry off to the PayU checkout route. Fleet and lead-management screens provide the current admin surfaces for those workflows.

## Project Structure

```text
luxury-transport-next.js/
├── app/
│   ├── (public)/
│   │   ├── page.tsx              # Public landing page
│   │   ├── about/page.tsx        # Company information
│   │   ├── book/page.tsx         # Booking form and server action
│   │   ├── checkout/[id]/        # PayU checkout page and client form
│   │   ├── fleet/page.tsx        # Database-backed fleet listing
│   │   ├── payment-failed/       # Failed payment result page
│   │   ├── payment-success/      # Successful payment result page
│   │   ├── services/page.tsx     # Service overview
│   │   ├── MobileMenu.tsx        # Mobile public navigation
│   │   └── layout.tsx            # Public navigation and footer
│   ├── (admin)/
│   │   ├── admin/dashboard/      # Fleet and inquiry statistics
│   │   ├── admin/fleet/            # Fleet administration surface
│   │   ├── admin/leads/            # Booking lead administration surface
│   │   └── layout.tsx              # Protected admin shell
│   ├── admin/login/page.tsx       # Administrator sign-in form
│   ├── api/auth/[...nextauth]/    # NextAuth credentials endpoints
│   ├── api/payu/checkout/         # Create PayU checkout payload
│   ├── api/payu/success/          # PayU success callback
│   ├── api/payu/failure/          # PayU failure callback
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

The repository may include `bkp.env.local` as a local environment template. Rename it to `.env.local` before starting the application:

```bash
mv bkp.env.local .env.local
```

On Windows PowerShell:

```powershell
Rename-Item bkp.env.local .env.local
```

Review every value in `.env.local` and replace template or development credentials with your own values. Do not commit the renamed file or share its secrets.

The required variables are:

```env
NEXTAUTH_SECRET=replace-with-a-long-random-secret
NEXTAUTH_URL=http://localhost:3000
EMAIL_USER=your-gmail-address
EMAIL_PASS=your-gmail-app-password
PAYU_MERCHANT_KEY=your-payu-merchant-key
PAYU_MERCHANT_SALT=your-payu-merchant-salt
PAYU_URL=https://test.payu.in/_payment
```

`EMAIL_USER` and `EMAIL_PASS` are used for booking notification emails. `PAYU_URL` should point to the PayU environment you intend to use, such as the sandbox endpoint during development. `NEXTAUTH_URL` must match the public application URL because PayU uses it to construct success and failure callback URLs.

Never commit `bkp.env.local`, `.env.local`, or production secrets.

## Run Locally

Install dependencies and rename the environment template:

```bash
npm install
mv bkp.env.local .env.local
```

On the first run, generate the Prisma client, create the SQLite schema, and seed development data:

```bash
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
| `GET` | `/checkout/[id]` | Start payment for a priced inquiry |
| `GET` | `/payment-success` | Payment success result |
| `GET` | `/payment-failed` | Payment failure result |
| `GET` | `/admin/login` | Administrator sign-in |
| `GET` | `/admin/dashboard` | Protected dashboard statistics |
| `GET` | `/admin/fleet` | Protected fleet management surface |
| `GET` | `/admin/leads` | Protected booking-lead surface |
| `GET/POST` | `/api/auth/*` | NextAuth authentication endpoints |
| `POST` | `/api/payu/checkout` | Build a signed PayU checkout payload |
| `POST` | `/api/payu/success` | Verify PayU success and mark inquiry paid |
| `POST` | `/api/payu/failure` | Mark a failed PayU inquiry payment |

## Authentication Flow

1. Open `/admin/login` and submit the seeded administrator credentials.
2. NextAuth validates the credentials against the Prisma `Admin` record.
3. The password is compared with bcrypt; plaintext passwords are not stored.
4. NextAuth creates an authenticated JWT session cookie.
5. Requests to `/admin/*`, except `/admin/login`, pass through `middleware.ts`.
6. An unauthenticated request is redirected to `/admin/login`.

## Booking and Payment Flow

1. A visitor submits the booking form at `/book`.
2. The server action validates the form data and creates an `Inquiry` record with `PENDING` status.
3. If Gmail SMTP variables are configured, Nodemailer sends a notification to the configured email account. Email failure is logged without discarding a saved inquiry.
4. An administrator can assign a price to an inquiry and provide the customer with `/checkout/[id]`.
5. The checkout client requests a signed payload from `POST /api/payu/checkout`.
6. The browser submits the signed form to `PAYU_URL`.
7. PayU posts to `/api/payu/success` or `/api/payu/failure`.
8. The callback updates `paymentStatus` and redirects to the matching result page.

The checkout route rejects missing inquiry IDs, missing or non-positive prices, already-paid inquiries, and incomplete PayU configuration.

## Database Models

- `Admin`: administrator email and bcrypt password hash.
- `Vehicle`: vehicle name, class, passenger capacity, luggage capacity, image, rate, description, and availability.
- `Inquiry`: booking request fields and status values such as `PENDING`, `CONFIRMED`, and `REJECTED`.
- `Inquiry` payment fields: optional `price`, `paymentStatus` (`UNPAID`, `PAID`, or `FAILED`), and `transactionId`.

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
- `bkp.env.local` and `.env.local` environment files containing credentials
- `node_modules/`
- `.next/` and production build output
- SQLite database files created under `prisma/`
- TypeScript build information and debug logs

## Deployment

The application can be deployed to a Node-compatible Next.js host such as Vercel. Configure `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and a production-ready database strategy before deployment. The local SQLite setup is intended for development and single-instance use; use a managed database when the application requires concurrent production writes or multiple application instances.