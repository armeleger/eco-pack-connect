// lib/imageHelper.ts
// ============================================================
// Smart image fallback engine.
// When a product has no stored image_url, this function reads
// the product title and tags and returns a contextually
// relevant Unsplash photo — never a blank or broken image.
// ============================================================

/** Keyword → curated Unsplash URL map for eco-packaging categories */
const KEYWORD_IMAGE_MAP: [string, string][] = [
  ["kraft",        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"],
  ["bag",          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"],
  ["pouch",        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"],
  ["box",          "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80"],
  ["carton",       "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80"],
  ["mailer",       "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80"],
  ["bamboo",       "https://images.unsplash.com/photo-1542601906897-ecd3aa04df9a?w=800&q=80"],
  ["container",    "https://images.unsplash.com/photo-1542601906897-ecd3aa04df9a?w=800&q=80"],
  ["bottle",       "https://images.unsplash.com/photo-1542601906897-ecd3aa04df9a?w=800&q=80"],
  ["jute",         "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80"],
  ["sack",         "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80"],
  ["sisal",        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80"],
  ["bagasse",      "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?w=800&q=80"],
  ["tray",         "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?w=800&q=80"],
  ["food",         "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?w=800&q=80"],
  ["honeycomb",    "https://images.unsplash.com/photo-1603732551658-5fabbafa84eb?w=800&q=80"],
  ["cushion",      "https://images.unsplash.com/photo-1603732551658-5fabbafa84eb?w=800&q=80"],
  ["wrap",         "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80"],
  ["paper",        "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80"],
  ["label",        "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80"],
  ["custom",       "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80"],
  ["branded",      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80"],
];

/** Absolute fallback — generic eco/green packaging */
const DEFAULT_FALLBACK =
  "https://images.unsplash.com/photo-1530968831187-a937baadb39b?w=800&q=80";

/**
 * getProductImage
 *
 * Returns the best available image for a product.
 * Priority: stored URL → keyword match → default fallback.
 *
 * @param imageUrl - Stored image URL (may be null/empty)
 * @param title    - Product title for keyword extraction
 * @param tags     - Product tags for additional keyword matching
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