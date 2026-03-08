# UniSchools

India's school & college directory. Auto-populated from UDISE+ and CBSE data. Schools can claim their profile and receive admission enquiries.

---

## Stack
- **Next.js 14** (App Router)
- **Supabase** (PostgreSQL, hosted in Mumbai — ap-south-1)
- **Prisma** ORM
- **NextAuth v5** for login
- **Resend** for emails
- **Vercel** for hosting
- **Tailwind CSS**

---

## Setup (do this in order)

### 1. Supabase
1. Go to [supabase.com](https://supabase.com) → New Project
2. **Region: Asia (South) ap-south-1 — Mumbai** ← mandatory
3. Save the DB password — you need it once
4. Go to **Settings → Database** → copy both connection strings:
   - Transaction mode (port 6543) → `DATABASE_URL`
   - Session mode (port 5432) → `DIRECT_URL`
5. Go to **Settings → API** → copy Project URL, anon key, service_role key
6. Go to **Storage** → create 3 buckets:
   - `school-photos` (public)
   - `school-docs` (private)
   - `user-avatars` (public)

### 2. Resend
1. Go to [resend.com](https://resend.com) → create free account
2. API Keys → Create API Key → copy it

### 3. Fill in .env.local
```bash
cp .env.example .env.local
# Open .env.local and fill in all values
```

### 4. Install and set up DB
```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
```

Seed creates:
- 30 real Indian schools to start with
- 1 admin account: `admin@unischools.in` / `Admin@123`

### 5. Run locally
```bash
npm run dev
# Open http://localhost:3000
```

### 6. Push to GitHub
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/unischools.git
git push -u origin main
```

### 7. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) → Add New Project → Import from GitHub
2. Add all environment variables from your `.env.local` (change `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your Vercel URL)
3. Deploy
4. After deploy: update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` with your real Vercel URL → Redeploy

---

## Key URLs after deploy

| URL | What it is |
|-----|-----------|
| `/` | Homepage with search |
| `/schools` | Directory with filters |
| `/schools/[slug]` | School profile + enquiry form |
| `/claim` | School claims their profile |
| `/login` | Login |
| `/register` | Register |
| `/school/enquiries` | School admin — view enquiries |
| `/school/profile` | School admin — edit profile |
| `/admin/schools` | Platform admin — approve claims |

---

## How monetisation works (Phase 1)
- Parent visits a school page → fills enquiry form → lead goes to school
- Schools that claimed their profile get enquiries in their dashboard
- Charge schools per lead OR flat monthly fee for claimed profile
- Schools with unclaimed profiles get a "claim this profile" banner

---

## Adding real school data (UDISE/CBSE)
See `/scripts` folder — import scripts will be added for bulk CSV upload from UDISE+ open data portal.
