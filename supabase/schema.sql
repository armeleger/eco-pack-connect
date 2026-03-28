-- ============================================================
-- ECOPACK PLATFORM — Supabase PostgreSQL Schema
-- B2B Marketplace for Sustainable Packaging in Africa
-- Run this entire file in your Supabase SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES
-- Extends auth.users. Role determines UI experience:
--   buyer    → marketplace browsing + checkout
--   supplier → seller dashboard + listings
--   admin    → full platform management
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    TEXT NOT NULL DEFAULT '',
  company_name TEXT,
  role         TEXT NOT NULL DEFAULT 'buyer'
               CHECK (role IN ('buyer', 'supplier', 'admin')),
  country      TEXT DEFAULT 'Kenya',
  phone        TEXT,
  avatar_url   TEXT,
  verified     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CATEGORIES
-- Eco-packaging product categories
-- ============================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL UNIQUE,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.categories (name, slug, description) VALUES
  ('Bags & Pouches',      'bags-pouches',      'Biodegradable bags, compostable pouches, paper bags'),
  ('Boxes & Cartons',     'boxes-cartons',     'Recycled cardboard boxes, kraft cartons, mailer boxes'),
  ('Bottles & Containers','bottles-containers','Glass, bamboo, and bioplastic containers'),
  ('Wrapping & Labels',   'wrapping-labels',   'Recycled tissue paper, eco stickers, kraft wrapping'),
  ('Industrial Sacks',    'industrial-sacks',  'Jute sacks, sisal bags, woven natural-fiber sacks'),
  ('Food Packaging',      'food-packaging',    'Compostable trays, sugarcane bagasse, PLA containers'),
  ('Protective Packaging','protective-packaging','Recycled bubble wrap, mushroom foam, honeycomb paper'),
  ('Custom & Branded',    'custom-branded',    'Custom-printed eco packaging with brand identity')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- PRODUCTS
-- Eco-packaging product listings by suppliers
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id     UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  material        TEXT,
  price_per_unit  NUMERIC(12,2) NOT NULL,
  currency        TEXT NOT NULL DEFAULT 'USD',
  moq             INTEGER NOT NULL DEFAULT 100,
  stock_quantity  INTEGER NOT NULL DEFAULT 0,
  lead_time_days  INTEGER NOT NULL DEFAULT 14,
  target_market   TEXT DEFAULT 'East Africa',
  image_url       TEXT,
  tags            TEXT[] DEFAULT '{}',
  eco_certifications TEXT[] DEFAULT '{}',  -- e.g. ['FSC', 'ISO 14001', 'Compostable']
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
  view_count      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- BULK DISCOUNT TIERS
-- Volume-based pricing per product
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bulk_discount_tiers (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id   UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  min_qty      INTEGER NOT NULL,
  max_qty      INTEGER,
  discount_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ORDERS
-- B2B trade orders from buyers
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id         UUID NOT NULL REFERENCES public.profiles(id),
  supplier_id      UUID NOT NULL REFERENCES public.profiles(id),
  product_id       UUID NOT NULL REFERENCES public.products(id),
  quantity         INTEGER NOT NULL,
  unit_price       NUMERIC(12,2) NOT NULL,
  discount_pct     NUMERIC(5,2) NOT NULL DEFAULT 0,
  total_amount     NUMERIC(14,2) NOT NULL,
  currency         TEXT NOT NULL DEFAULT 'USD',
  status           TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','confirmed','in_production','shipped','delivered','cancelled')),
  shipping_address JSONB,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_discount_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders             ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profiles_read_all"   ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Products: anyone reads active; suppliers manage their own
CREATE POLICY "products_read_active" ON public.products FOR SELECT USING (is_active = TRUE OR supplier_id = auth.uid());
CREATE POLICY "products_insert_own"  ON public.products FOR INSERT WITH CHECK (auth.uid() = supplier_id);
CREATE POLICY "products_update_own"  ON public.products FOR UPDATE USING (auth.uid() = supplier_id);
CREATE POLICY "products_delete_own"  ON public.products FOR DELETE USING (auth.uid() = supplier_id);

-- Discount tiers
CREATE POLICY "tiers_read_all" ON public.bulk_discount_tiers FOR SELECT USING (TRUE);
CREATE POLICY "tiers_insert_own" ON public.bulk_discount_tiers FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND p.supplier_id = auth.uid()));

-- Orders
CREATE POLICY "orders_read_own"   ON public.orders FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = supplier_id);
CREATE POLICY "orders_insert_buyer" ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "orders_update_own" ON public.orders FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = supplier_id);

-- ============================================================
-- AUTO-UPDATE TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_orders_updated   BEFORE UPDATE ON public.orders   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();