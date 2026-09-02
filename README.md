# Sharma Furniture House — Full Stack Website + Admin Dashboard

Custom carpentry & furniture manufacturing business website for **Sharma Furniture House**
(Owner: Mr. Dhananjay Sharma, Indore, MP). Client-order based — no cart, no checkout, no
online payments. Visitors submit inquiries; everything else is managed from an admin dashboard.

```
sharma-furniture-house/
├── backend/    Express + TypeScript + Prisma + PostgreSQL REST API
└── frontend/   Next.js (App Router) + TypeScript + Tailwind CSS
```

---

## 1. Prerequisites

- Node.js 18+ and npm
- A PostgreSQL database — easiest options:
  - [Neon](https://neon.tech) (free serverless Postgres) — recommended
  - Local Postgres via Docker: `docker run --name sfh-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=sharma_furniture_house -p 5432:5432 -d postgres`
- A free [Cloudinary](https://cloudinary.com) account (for image uploads)

---

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `DATABASE_URL` — your Postgres connection string (from Neon or local Docker)
- `JWT_SECRET` — any long random string
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` — credentials for the first admin account (used only by the seed script)
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — from your Cloudinary dashboard
- `CORS_ORIGIN` — `http://localhost:3000` for local dev

Create the database tables and seed the first admin + sample content:

```bash
npx prisma migrate dev --name init
npm run seed
```

Start the API:

```bash
npm run dev
```

The API runs at `http://localhost:5000`. Health check: `GET http://localhost:5000/health`.

Other useful commands:
```bash
npx prisma studio     # visual DB browser
npm run build          # compile TypeScript
npm start               # run compiled build (production)
```

---

## 3. Frontend setup

In a new terminal:

```bash
cd frontend
npm install
cp .env.example .env.local
```

Edit `.env.local`:
- `NEXT_PUBLIC_API_URL` — `http://localhost:5000/api` for local dev
- `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_ADDRESS` — your real contact details
- `NEXT_PUBLIC_MAP_EMBED_URL` — go to Google Maps → your location → Share → Embed a map → copy the `src` URL

Start the site:

```bash
npm run dev
```

Visit `http://localhost:3000`.

---

## 4. Log into the admin dashboard

1. Go to `http://localhost:3000/admin/login`
2. Sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `backend/.env` (created by `npm run seed`)
3. From the dashboard you can manage Services, Projects, Gallery, Testimonials, and Inquiries

**Uploading images:** every admin form (Services, Projects, Gallery, Testimonials) has an "Upload
image" button that sends the file straight to Cloudinary via the backend's authenticated
`POST /api/admin/image` endpoint and fills in the URL automatically — no need to use the Cloudinary
dashboard directly. Project and Service forms support multiple gallery images with previews and a
remove button; Gallery/Testimonial forms support a single image.

---

## 5. Deploying to production

**Database — Neon PostgreSQL**
1. Create a project at neon.tech, copy the connection string into `DATABASE_URL`.

**Backend — Railway or Render**
1. Push the `backend/` folder to a Git repo (or the whole monorepo with a root directory setting).
2. Create a new Web Service, set the root directory to `backend`.
3. Build command: `npm install && npm run build && npx prisma migrate deploy`
4. Start command: `npm start`
5. Add all variables from `backend/.env.example` in the service's environment settings, pointing
   `DATABASE_URL` at Neon and `CORS_ORIGIN` at your deployed frontend URL.
6. After first deploy, run `npm run seed` once (via the platform's shell/console) to create the admin user.

**Frontend — Vercel**
1. Import the repo into Vercel, set the root directory to `frontend`.
2. Add the environment variables from `frontend/.env.example`, pointing `NEXT_PUBLIC_API_URL` at
   your deployed backend URL (e.g. `https://your-api.up.railway.app/api`).
3. Deploy.

**Post-deploy checklist**
- [ ] Update `CORS_ORIGIN` on the backend to your live frontend domain
- [ ] Change the seeded admin password immediately after first login (there's no self-service
      password-change screen yet — update it via `prisma studio` or a direct DB update, hashed with bcrypt)
- [ ] Replace placeholder image blocks (hero, about section) with real photos
- [ ] Update Google Maps embed URL, phone, WhatsApp, and email to real values
- [ ] Add real services, projects, gallery images, testimonials and FAQs from the admin dashboard

---

## 6. What's included vs. what to extend

**Included and working end-to-end:** Prisma schema & migrations, JWT auth, full CRUD REST API for
services/projects/gallery/testimonials/inquiries/FAQs, inquiry CSV export, rate limiting, Helmet,
CORS, Zod validation on every endpoint, all public pages (Home, About, Services, Service detail,
Projects, Project detail, Gallery with lightbox, Testimonials, FAQs, Contact form, Privacy Policy,
Terms, 404), and an admin dashboard (login, overview stats, direct-to-Cloudinary image uploads, and
CRUD screens for every content type — services, projects with multi-image galleries, gallery,
testimonials, FAQs, and inquiries with search/filter/export).

**Worth extending before a real launch:**
- Password change / forgot-password flow for admin accounts (currently changed via `prisma studio`
  or a direct DB update, hashed with bcrypt)
- Drag-to-reorder for gallery/project images (currently ordered by upload sequence)
- Real photography for the hero and about sections, and your real contact details throughout
