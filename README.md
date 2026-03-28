# EcoPack — B2B Sustainable Packaging Marketplace

Africa's premier B2B marketplace connecting businesses that need eco-friendly, compostable, and recycled packaging with verified African manufacturers and suppliers.

## Problem Statement
Businesses across Africa struggle to source sustainable, locally manufactured packaging at competitive wholesale prices. The supply chain is fragmented, unverified, and opaque — making cross-border eco-packaging trade difficult and costly.

## Solution
EcoPack is a full-stack B2B marketplace platform that:
- Lists verified eco-packaging suppliers across Africa
- Enables bulk ordering with real-time volume discounts
- Provides a dedicated seller dashboard for manufacturers
- Includes an admin portal for platform management

## Actors
| Role | Access |
|------|--------|
| **Buyer** | Browse marketplace, view products, place trade orders |
| **Supplier** | Seller dashboard, list products, manage inventory |
| **Admin** | Platform overview, order management, user management |

---

## Tech Stack
- **Frontend**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Google Fonts (DM Serif Display + DM Sans)
- **Backend**: Supabase (PostgreSQL, Auth, Row Level Security)
- **Icons**: Lucide React
- **Deployment**: Vercel

---

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ installed
- A Supabase account (free at supabase.com)
- A Vercel account (free at vercel.com)

### 2. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/ecopack.git
cd ecopack
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Set Up Supabase
1. Go to [supabase.com](https://supabase.com) → Create a new project
2. Go to **SQL Editor** → paste the entire contents of `supabase/schema.sql` → click **Run**
3. Go to **Project Settings → API** → copy:
   - `Project URL`
   - `anon / public` key

### 5. Configure Environment Variables
```bash
cp .env.example .env.local
```
Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

### 6. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## Demo Mode Navigation
The platform includes full **Demo Mode** — you can navigate all pages without signing in:

| Page | URL |
|------|-----|
| Marketplace | `/` |
| Product Detail | `/product/prod-1` |
| Checkout | `/checkout?productId=prod-1&qty=1000` |
| Seller Dashboard | `/seller-dashboard` |
| Admin Panel | `/admin` |
| Login | `/login` |
| Signup | `/signup` |

---

## Deployment to Vercel

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel
# Follow prompts → add environment variables when asked
```

### Option B — Vercel Dashboard
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your GitHub repo
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**

---

## Project Structure
```
ecopack/
├── supabase/schema.sql      ← Run this in Supabase SQL Editor
├── lib/
│   ├── supabase.ts          ← Browser Supabase client
│   ├── supabaseServer.ts    ← Server Supabase client
│   ├── mockData.ts          ← Demo Mode data
│   └── imageHelper.ts       ← Smart image fallback
├── types/index.ts           ← TypeScript types
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   └── StatCard.tsx
└── app/
    ├── page.tsx             ← Marketplace Hub
    ├── product/[id]/        ← Product Detail
    ├── checkout/            ← Trade Checkout
    ├── seller-dashboard/    ← Supplier Portal
    ├── admin/               ← Admin Dashboard
    ├── login/               ← Authentication
    └── signup/              ← Registration
```

## License
MIT