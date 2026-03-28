# EcoPack Connect

**Tutorial Video:** [https://eco-pack-connect.vercel.app/]
**Live Demo:** [https://eco-pack-connect.vercel.app/](https://eco-pack-connect.vercel.app/)

EcoPack Connect is a comprehensive B2B marketplace engineered to streamline the sustainable packaging supply chain across East Africa (specifically bridging the Kenyan and Rwandan markets). Designed under the Kira Capital venture, this platform connects local businesses with verified eco-friendly packaging suppliers.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database & Auth:** Supabase (PostgreSQL)
- **Deployment:** Vercel
- **Icons:** Lucide React

## Key Features

- **B2B Trade Logic:** Enforces Minimum Order Quantities (MOQ) and dynamically calculates real-time bulk discount tiers based on order volume.
- **Smart Image Fallbacks:** A custom algorithm that reads product names (e.g., "Kraft Pouch", "Glass Bottle") and automatically assigns high-quality, relevant placeholder images if supplier uploads are missing.
- **Dual-Portal System:** Features distinct user flows for Buyers (Marketplace & Checkout) and Suppliers (Inventory Management Dashboard).
- **Responsive UI/UX:** A minimalist, heavily optimized design system utilizing a cohesive forest green and warm beige color palette to reflect the sustainable nature of the platform.

## Local Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/eco-pack-connect.git](https://github.com/your-username/eco-pack-connect.git)