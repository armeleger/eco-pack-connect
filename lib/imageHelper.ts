// lib/imageHelper.ts
// ============================================================
// Smart image fallback engine.
// Now uses local files from /public/images/products/
// Falls back through keyword matching if image_url is missing.
// ============================================================

/**
 * Keyword → local image path map.
 * All paths are relative to /public/ so Next.js serves them
 * automatically at the root URL.
 */
const KEYWORD_IMAGE_MAP: [string, string][] = [
  // Bags & Pouches
  ["bag",          "/images/products/Bags & Pouches.webp"],
  ["pouch",        "/images/products/Bags & Pouches.webp"],
  ["kraft",        "/images/products/Bags & Pouches.webp"],
  ["coffee",       "/images/products/Bags & Pouches.webp"],
  ["compostable",  "/images/products/Bags & Pouches.webp"],

  // Boxes & Cartons
  ["box",          "/images/products/Boxes & Cartons.jpg"],
  ["carton",       "/images/products/Boxes & Cartons.jpg"],
  ["corrugated",   "/images/products/Boxes & Cartons.jpg"],
  ["mailer",       "/images/products/Boxes & Cartons.jpg"],
  ["ecommerce",    "/images/products/Boxes & Cartons.jpg"],
  ["shipping",     "/images/products/Boxes & Cartons.jpg"],

  // Bottles & Containers
  ["bottle",       "/images/products/Bottles & Containers.jpg"],
  ["container",    "/images/products/Bottles & Containers.jpg"],
  ["bamboo",       "/images/products/Bottles & Containers.jpg"],
  ["jar",          "/images/products/Bottles & Containers.jpg"],
  ["lid",          "/images/products/Bottles & Containers.jpg"],

  // Wrapping & Labels
  ["wrap",         "/images/products/Wrapping & Labels.jpg"],
  ["paper",        "/images/products/Wrapping & Labels.jpg"],
  ["roll",         "/images/products/Wrapping & Labels.jpg"],
  ["label",        "/images/products/Wrapping & Labels.jpg"],
  ["tissue",       "/images/products/Wrapping & Labels.jpg"],
  ["sticker",      "/images/products/Wrapping & Labels.jpg"],

  // Industrial Sacks
  ["sack",         "/images/products/Industrial Sacks.avif"],
  ["jute",         "/images/products/Industrial Sacks.avif"],
  ["sisal",        "/images/products/Industrial Sacks.avif"],
  ["burlap",       "/images/products/Industrial Sacks.avif"],
  ["grain",        "/images/products/Industrial Sacks.avif"],
  ["agricultural", "/images/products/Industrial Sacks.avif"],
  ["industrial",   "/images/products/Industrial Sacks.avif"],

  // Food Packaging
  ["food",         "/images/products/Food Packaging.webp"],
  ["tray",         "/images/products/Food Packaging.webp"],
  ["bagasse",      "/images/products/Food Packaging.webp"],
  ["sugarcane",    "/images/products/Food Packaging.webp"],
  ["catering",     "/images/products/Food Packaging.webp"],
  ["takeaway",     "/images/products/Food Packaging.webp"],
  ["meal",         "/images/products/Food Packaging.webp"],

  // Protective Packaging
  ["honeycomb",    "/images/products/Protective Packaging.png"],
  ["protective",   "/images/products/Protective Packaging.png"],
  ["cushion",      "/images/products/Protective Packaging.png"],
  ["fragile",      "/images/products/Protective Packaging.png"],
  ["bubble",       "/images/products/Protective Packaging.png"],
  ["foam",         "/images/products/Protective Packaging.png"],

  // Custom & Branded
  ["custom",       "/images/products/Custom & Branded.webp"],
  ["branded",      "/images/products/Custom & Branded.webp"],
  ["print",        "/images/products/Custom & Branded.webp"],
  ["dtc",          "/images/products/Custom & Branded.webp"],
  ["brand",        "/images/products/Custom & Branded.webp"],
  ["logo",         "/images/products/Custom & Branded.webp"],
];

/** Absolute fallback — uses Bags & Pouches as default */
const DEFAULT_FALLBACK = "/images/products/Bags & Pouches.webp";

/**
 * getProductImage
 *
 * Returns the best available image for a product.
 * Priority:
 *   1. Stored image_url (your local path)
 *   2. Keyword match from title + tags
 *   3. Default fallback
 *
 * @param imageUrl - Stored image URL (may be null/empty)
 * @param title    - Product title for keyword extraction
 * @param tags     - Product tags for additional matching
 */
export function getProductImage(
  imageUrl: string | null | undefined,
  title: string,
  tags: string[] = []
): string {
  // Use stored URL if available
  if (imageUrl && imageUrl.trim().length > 0) return imageUrl;

  // Search title + tags for keyword match
  const search = [title, ...tags].join(" ").toLowerCase();

  for (const [keyword, path] of KEYWORD_IMAGE_MAP) {
    if (search.includes(keyword)) return path;
  }

  return DEFAULT_FALLBACK;
}