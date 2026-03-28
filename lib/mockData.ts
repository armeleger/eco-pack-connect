// lib/mockData.ts
// ============================================================
// Complete mock dataset for EcoPack Demo Mode.
// Currency: RWF (Rwandan Franc)
// No emoji characters — Lucide icons used in UI instead.
// ============================================================
import type { Category, Product, Profile, BulkDiscountTier } from "@/types";

export const DEMO_MODE = true;

// ── Exchange rate helper ──────────────────────────────────────
/** Approximate RWF conversion rate (1 USD ≈ 1,300 RWF) */
export const USD_TO_RWF = 1300;

/** Format a number as RWF currency string */
export function formatRWF(amount: number): string {
  return `RWF ${amount.toLocaleString("en-RW", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

// ── Categories ───────────────────────────────────────────────
export const MOCK_CATEGORIES: Category[] = [
  { id:"cat-1", name:"Bags & Pouches",        slug:"bags-pouches",        description:"Biodegradable bags, compostable pouches, paper bags", created_at:"" },
  { id:"cat-2", name:"Boxes & Cartons",       slug:"boxes-cartons",       description:"Recycled cardboard, kraft cartons, mailer boxes",     created_at:"" },
  { id:"cat-3", name:"Bottles & Containers",  slug:"bottles-containers",  description:"Glass, bamboo, and bioplastic containers",           created_at:"" },
  { id:"cat-4", name:"Wrapping & Labels",     slug:"wrapping-labels",     description:"Recycled tissue, eco stickers, kraft wrapping",      created_at:"" },
  { id:"cat-5", name:"Industrial Sacks",      slug:"industrial-sacks",    description:"Jute sacks, sisal bags, natural-fiber sacks",        created_at:"" },
  { id:"cat-6", name:"Food Packaging",        slug:"food-packaging",      description:"Compostable trays, bagasse, PLA containers",         created_at:"" },
  { id:"cat-7", name:"Protective Packaging",  slug:"protective-packaging",description:"Recycled bubble wrap, mushroom foam, honeycomb",     created_at:"" },
  { id:"cat-8", name:"Custom & Branded",      slug:"custom-branded",      description:"Custom-printed eco packaging with brand identity",   created_at:"" },
];

// ── Suppliers ─────────────────────────────────────────────────
export const MOCK_SUPPLIERS: Profile[] = [
  { id:"sup-1", full_name:"Amara Osei",     company_name:"GreenWrap Kenya Ltd.",     role:"supplier", country:"Kenya",        phone:"+254700001111", avatar_url:null, verified:true,  created_at:"", updated_at:"" },
  { id:"sup-2", full_name:"Zanele Dlamini", company_name:"EcoBox SA Manufacturers",  role:"supplier", country:"South Africa", phone:"+27110002222",  avatar_url:null, verified:true,  created_at:"", updated_at:"" },
  { id:"sup-3", full_name:"Kofi Asante",    company_name:"PurePackGhana Industries", role:"supplier", country:"Ghana",        phone:"+233240003333", avatar_url:null, verified:false, created_at:"", updated_at:"" },
  { id:"sup-4", full_name:"Fatima Ndiaye",  company_name:"Sahel Jute & Sisal Works", role:"supplier", country:"Senegal",      phone:"+221770004444", avatar_url:null, verified:true,  created_at:"", updated_at:"" },
  { id:"sup-5", full_name:"Leilani Abebe",  company_name:"AddisGreen Packaging Co.", role:"supplier", country:"Ethiopia",     phone:"+251910005555", avatar_url:null, verified:true,  created_at:"", updated_at:"" },
];

// ── Products (prices in RWF) ──────────────────────────────────
export const MOCK_PRODUCTS: Product[] = [
  {
    id:"prod-1", supplier_id:"sup-1", category_id:"cat-1",
    title:"Compostable Kraft Paper Bags — Flat Bottom",
    description:"100% compostable kraft paper bags with a gusseted flat bottom, ideal for coffee, tea, grains, and artisan food products. Food-safe inner lining, resealable zip-lock available. Certified home-compostable within 180 days. Custom printing up to 6 colours.",
    material:"FSC Kraft Paper + PLA inner lining",
    price_per_unit:234, currency:"RWF", moq:1000, stock_quantity:80000,
    lead_time_days:10, target_market:"East Africa, EU",
    image_url:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    tags:["kraft","compostable","food","coffee","bags"],
    eco_certifications:["OK Compost HOME","FSC Certified","Food Safe"],
    is_active:true, is_featured:true, view_count:1240, created_at:"", updated_at:"",
    supplier:MOCK_SUPPLIERS[0], category:MOCK_CATEGORIES[0],
  },
  {
    id:"prod-2", supplier_id:"sup-2", category_id:"cat-2",
    title:"Recycled Corrugated Mailer Boxes — E-Commerce Grade",
    description:"Strong double-wall corrugated boxes made from 80% post-consumer recycled fibre. Self-locking tab design requires no tape. Perfect for e-commerce, subscription boxes, and retail shipping. Available in 12 standard sizes. Printed with water-based inks.",
    material:"80% Recycled Corrugated Fibreboard",
    price_per_unit:715, currency:"RWF", moq:500, stock_quantity:35000,
    lead_time_days:14, target_market:"Pan-African, EU",
    image_url:"https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
    tags:["boxes","recycled","ecommerce","mailer","corrugated"],
    eco_certifications:["PEFC Certified","80% Recycled Content","Recyclable"],
    is_active:true, is_featured:true, view_count:980, created_at:"", updated_at:"",
    supplier:MOCK_SUPPLIERS[1], category:MOCK_CATEGORIES[1],
  },
  {
    id:"prod-3", supplier_id:"sup-3", category_id:"cat-3",
    title:"Bamboo Fibre Containers with Lids — 500ml",
    description:"Premium 500ml containers made from natural bamboo fibre composite. Lightweight, heat-resistant up to 120°C, and biodegradable. Ideal for meal prep, takeaway food services, and retail. Smooth food-grade finish. Stackable design for efficient storage and shipping.",
    material:"Bamboo Fibre + Corn Starch Binding",
    price_per_unit:1560, currency:"RWF", moq:200, stock_quantity:12000,
    lead_time_days:21, target_market:"West Africa, UK",
    image_url:"https://images.unsplash.com/photo-1542601906897-ecd3aa04df9a?w=800&q=80",
    tags:["bamboo","container","food","biodegradable","takeaway"],
    eco_certifications:["ISO 14001","BPI Certified Compostable","Food Safe"],
    is_active:true, is_featured:false, view_count:640, created_at:"", updated_at:"",
    supplier:MOCK_SUPPLIERS[2], category:MOCK_CATEGORIES[2],
  },
  {
    id:"prod-4", supplier_id:"sup-4", category_id:"cat-5",
    title:"Natural Jute Sacks — 50kg Heavy Duty",
    description:"Woven 100% natural jute sacks with double-stitched seams for heavy-duty agricultural use. Fully biodegradable, breathable fabric ideal for grains, root vegetables, and coffee. Available in custom sizes. Naturally resistant to static and condensation.",
    material:"100% Natural Jute Fibre",
    price_per_unit:1105, currency:"RWF", moq:500, stock_quantity:60000,
    lead_time_days:14, target_market:"East Africa, Middle East",
    image_url:"https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80",
    tags:["jute","sacks","agricultural","biodegradable","grain"],
    eco_certifications:["100% Natural","Biodegradable","Chemical-Free"],
    is_active:true, is_featured:true, view_count:1560, created_at:"", updated_at:"",
    supplier:MOCK_SUPPLIERS[3], category:MOCK_CATEGORIES[4],
  },
  {
    id:"prod-5", supplier_id:"sup-5", category_id:"cat-6",
    title:"Sugarcane Bagasse Food Trays — 6-Compartment",
    description:"Made from 100% sugarcane bagasse — a byproduct of sugar manufacturing. Naturally oil and water resistant without chemical coatings. Microwave and oven safe up to 200°C. Certified commercially compostable within 90 days. Ideal for school canteens, airlines, catering.",
    material:"Sugarcane Bagasse (100% Agricultural Waste)",
    price_per_unit:286, currency:"RWF", moq:1000, stock_quantity:150000,
    lead_time_days:7, target_market:"East Africa, Middle East",
    image_url:"https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?w=800&q=80",
    tags:["bagasse","food tray","compostable","sugarcane","catering"],
    eco_certifications:["OK Compost Industrial","BPI Certified","Oil & Water Resistant"],
    is_active:true, is_featured:true, view_count:2100, created_at:"", updated_at:"",
    supplier:MOCK_SUPPLIERS[4], category:MOCK_CATEGORIES[5],
  },
  {
    id:"prod-6", supplier_id:"sup-1", category_id:"cat-4",
    title:"Recycled Kraft Wrapping Paper Roll — 70gsm",
    description:"70gsm recycled kraft paper on large rolls, ideal for retail gift wrapping, product protection, and eco-conscious brand packaging. Smooth, printable surface. Sourced from sustainably managed forests. Available in natural brown and white bleached variants.",
    material:"70% Recycled + 30% Virgin Kraft Fibre",
    price_per_unit:104, currency:"RWF", moq:2000, stock_quantity:400000,
    lead_time_days:10, target_market:"Global",
    image_url:"https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80",
    tags:["kraft paper","wrapping","recycled","retail","rolls"],
    eco_certifications:["FSC Certified","70% Recycled","Recyclable"],
    is_active:true, is_featured:false, view_count:830, created_at:"", updated_at:"",
    supplier:MOCK_SUPPLIERS[0], category:MOCK_CATEGORIES[3],
  },
  {
    id:"prod-7", supplier_id:"sup-2", category_id:"cat-7",
    title:"Honeycomb Paper Cushioning — 50m Roll",
    description:"Innovative honeycomb structure paper cushioning — a plastic bubble-wrap replacement. Provides superior shock absorption while being 100% recyclable and biodegradable. Tear-off sheets for easy use. Ideal for electronics, ceramics, and fragile goods shipping.",
    material:"Recycled Kraft Paper — Honeycomb Structure",
    price_per_unit:16250, currency:"RWF", moq:50, stock_quantity:3000,
    lead_time_days:14, target_market:"Pan-African, EU",
    image_url:"https://images.unsplash.com/photo-1603732551658-5fabbafa84eb?w=800&q=80",
    tags:["honeycomb","protective","cushioning","fragile","recyclable"],
    eco_certifications:["100% Recyclable","Plastic-Free","FSC Certified"],
    is_active:true, is_featured:false, view_count:420, created_at:"", updated_at:"",
    supplier:MOCK_SUPPLIERS[1], category:MOCK_CATEGORIES[6],
  },
  {
    id:"prod-8", supplier_id:"sup-3", category_id:"cat-8",
    title:"Custom-Printed Eco Mailer Bags — Compostable",
    description:"Fully customisable compostable mailer bags with up to 4-colour brand printing. Made from plant-based PBAT + PLA film. Tear-resistant, waterproof, and certified home-compostable. Minimum 500-unit runs. Turnaround: 3 weeks with custom artwork.",
    material:"PBAT + PLA Plant-Based Film",
    price_per_unit:546, currency:"RWF", moq:500, stock_quantity:25000,
    lead_time_days:21, target_market:"Pan-African",
    image_url:"https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
    tags:["custom","mailer","compostable","branded","DTC"],
    eco_certifications:["OK Compost HOME","PBAT Certified","Plastic-Free"],
    is_active:true, is_featured:true, view_count:1890, created_at:"", updated_at:"",
    supplier:MOCK_SUPPLIERS[2], category:MOCK_CATEGORIES[7],
  },
];

/** Standard 3-tier bulk discount structure */
export function getMockDiscountTiers(productId: string): BulkDiscountTier[] {
  return [
    { id:"t1", product_id:productId, min_qty:1,    max_qty:499,  discount_pct:0,  created_at:"" },
    { id:"t2", product_id:productId, min_qty:500,  max_qty:1999, discount_pct:7,  created_at:"" },
    { id:"t3", product_id:productId, min_qty:2000, max_qty:null, discount_pct:15, created_at:"" },
  ];
}

export const MOCK_ADMIN_STATS = {
  totalRevenue:   369980000,  // RWF
  totalOrders:    1247,
  totalProducts:  318,
  totalUsers:     2841,
  suppliersCount: 143,
  buyersCount:    2698,
  recentOrders: [
    { id:"ORD-7841", buyer:"Nairobi Roasters Ltd.",  product:"Compostable Kraft Paper Bags", qty:5000,  total:1170000,  status:"confirmed",     date:"2026-03-27" },
    { id:"ORD-7840", buyer:"Kigali Fresh Market",    product:"Sugarcane Bagasse Trays",      qty:10000, total:2860000,  status:"in_production", date:"2026-03-26" },
    { id:"ORD-7839", buyer:"Lagos Pack & Ship",       product:"Recycled Mailer Boxes",        qty:2000,  total:1430000,  status:"shipped",       date:"2026-03-25" },
    { id:"ORD-7838", buyer:"Accra Botanicals",        product:"Bamboo Containers",            qty:500,   total:780000,   status:"delivered",     date:"2026-03-24" },
    { id:"ORD-7837", buyer:"Dar es Salaam DTC Co.",   product:"Custom Compostable Mailers",   qty:3000,  total:1638000,  status:"pending",       date:"2026-03-23" },
  ],
};