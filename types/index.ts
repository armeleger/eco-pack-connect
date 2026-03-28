// types/index.ts
// ============================================================
// Shared TypeScript types for the EcoPack platform.
// These mirror the Supabase database schema exactly.
// ============================================================

export type UserRole = "buyer" | "supplier" | "admin";

export type Profile = {
  id:           string;
  full_name:    string;
  company_name: string | null;
  role:         UserRole;
  country:      string | null;
  phone:        string | null;
  avatar_url:   string | null;
  verified:     boolean;
  created_at:   string;
  updated_at:   string;
};

export type Category = {
  id:          string;
  name:        string;
  slug:        string;
  description: string | null;
  created_at:  string;
};

export type Product = {
  id:                 string;
  supplier_id:        string;
  category_id:        string | null;
  title:              string;
  description:        string | null;
  material:           string | null;
  price_per_unit:     number;
  currency:           string;
  moq:                number;
  stock_quantity:     number;
  lead_time_days:     number;
  target_market:      string | null;
  image_url:          string | null;
  tags:               string[];
  eco_certifications: string[];
  is_active:          boolean;
  is_featured:        boolean;
  view_count:         number;
  created_at:         string;
  updated_at:         string;
  // Joined relations
  supplier?:          Profile;
  category?:          Category;
};

export type BulkDiscountTier = {
  id:           string;
  product_id:   string;
  min_qty:      number;
  max_qty:      number | null;
  discount_pct: number;
  created_at:   string;
};

export type Order = {
  id:               string;
  buyer_id:         string;
  supplier_id:      string;
  product_id:       string;
  quantity:         number;
  unit_price:       number;
  discount_pct:     number;
  total_amount:     number;
  currency:         string;
  status:           OrderStatus;
  shipping_address: ShippingAddress | null;
  notes:            string | null;
  created_at:       string;
  updated_at:       string;
  // Joined
  product?:         Product;
  buyer?:           Profile;
  supplier?:        Profile;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "in_production"
  | "shipped"
  | "delivered"
  | "cancelled";

export type ShippingAddress = {
  company:  string;
  contact:  string;
  email:    string;
  phone:    string;
  street:   string;
  city:     string;
  country:  string;
  postal:   string;
  incoterm: string;
  notes:    string;
};