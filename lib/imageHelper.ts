// lib/imageHelper.ts
// ============================================================
// Smart image fallback engine.
// Each keyword maps to a carefully curated Unsplash photo
// that visually matches the actual eco-packaging product.
// ============================================================

/**
 * Keyword → curated Unsplash URL.
 * Photos are selected to look premium and realistic —
 * matching the actual physical product as closely as possible.
 */
const KEYWORD_IMAGE_MAP: [string, string][] = [
  // Kraft paper bags / food pouches
  ["kraft",        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80"],
  ["bag",          "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80"],
  ["pouch",        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80"],
  ["coffee",       "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80"],

  // Corrugated boxes / shipping cartons
  ["box",          "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&q=80"],
  ["carton",       "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&q=80"],
  ["corrugated",   "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&q=80"],
  ["mailer",       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"],
  ["ecommerce",    "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&q=80"],

  // Bamboo / natural containers
  ["bamboo",       "https://images.unsplash.com/photo-1610611424854-5e07871481ca?w=800&q=80"],
  ["container",    "https://images.unsplash.com/photo-1610611424854-5e07871481ca?w=800&q=80"],
  ["bottle",       "https://images.unsplash.com/photo-1610611424854-5e07871481ca?w=800&q=80"],

  // Jute / burlap agricultural sacks
  ["jute",         "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"],
  ["sack",         "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"],
  ["sisal",        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"],
  ["burlap",       "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"],
  ["grain",        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"],
  ["agricultural", "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"],

  // Bagasse / compostable food trays
  ["bagasse",      "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=800&q=80"],
  ["tray",         "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=800&q=80"],
  ["catering",     "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=800&q=80"],
  ["sugarcane",    "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=800&q=80"],
  ["food",         "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=800&q=80"],

  // Kraft wrapping paper rolls
  ["wrap",         "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=80"],
  ["paper",        "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=80"],
  ["roll",         "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=80"],
  ["label",        "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=80"],

  // Honeycomb paper protective packaging
  ["honeycomb",    "https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=800&q=80"],
  ["cushion",      "https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=800&q=80"],
  ["protective",   "https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=800&q=80"],
  ["fragile",      "https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=800&q=80"],

  // Custom printed branded mailer bags
  ["custom",       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"],
  ["branded",      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"],
  ["dtc",          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"],
  ["print",        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"],
];

const DEFAULT_FALLBACK =
  "https://images.unsplash.com/photo-1530968831187-a937baadb39b?w=800&q=80";

/**
 * getProductImage
 *
 * Returns the best available image for a product.
 * Priority: stored URL → keyword match → default fallback.
 *
 * @param imageUrl 
 * @param title    
 * @param tags     
 */
export function getProductImage(
  imageUrl: string | null | undefined,
  title: string,
  tags: string[] = []
): string {
  if (imageUrl && imageUrl.trim().length > 0) return imageUrl;

  const search = [title, ...tags].join(" ").toLowerCase();

  for (const [keyword, url] of KEYWORD_IMAGE_MAP) {
    if (search.includes(keyword)) return url;
  }

  return DEFAULT_FALLBACK;
}