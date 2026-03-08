# UniSchools

India's school & college directory. Auto-populated from UDISE+ and CBSE data.

## Stack
- Next.js 14.2.18 + App Router
- next-auth v4 (stable)
- Prisma 5 + Supabase PostgreSQL (Mumbai)
- Resend email
- Tailwind CSS
- Vercel hosting

## Local Setup

```bash
# 1. Copy env file and fill in values
cp .env.example .env.local

# 2. Install
npm install

# 3. Create DB tables
npx prisma generate
npx prisma db push

# 4. Seed 20 schools + admin account
npm run db:seed
# Admin login: admin@unischools.in / Admin@123

# 5. Run
npm run dev
# http://localhost:3000
```

## Deploy to Vercel

1. Push to GitHub
2. Import on vercel.com
3. Add all env vars from .env.local (change URLs to your Vercel domain)
4. Deploy — build script runs `prisma generate && next build` automatically

## Pages
| URL | Description |
|-----|-------------|
| `/` | Homepage + search |
| `/schools` | Directory + filters |
| `/schools/[slug]` | School profile + enquiry form |
| `/claim` | Claim a school profile |
| `/login` | Sign in |
| `/register` | Register |
| `/school/enquiries` | School admin — view leads |
| `/school/profile` | School admin — edit profile |
| `/admin/schools` | Platform admin — approve claims |
