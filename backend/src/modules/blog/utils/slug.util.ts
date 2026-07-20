/**
 * Turns arbitrary text into a URL-safe slug: lowercase, ASCII, hyphenated,
 * diacritics stripped. Falls back to "post" if nothing usable survives
 * (e.g. an emoji-only or all-punctuation title).
 */
export function slugify(input: string): string {
  const combiningMarks = new RegExp(String.fromCharCode(0x5b, 0x5c, 0x75, 0x30, 0x33, 0x30, 0x30, 0x2d, 0x5c, 0x75, 0x30, 0x33, 0x36, 0x66, 0x5d), 'g');
  const base = input
    .normalize('NFKD')
    .replace(combiningMarks, '') // strip accents (combining diacritical marks block)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 160)
    .replace(/-+$/g, '');
  return base || 'post';
}

/**
 * Appends -2, -3, ... to `base` until `exists` reports no collision.
 * `exists` should exclude the record being updated (pass its id through
 * a closure) so an unchanged slug does not collide with itself.
 */
export async function ensureUniqueSlug(
  base: string,
  exists: (candidate: string) => Promise<boolean>,
): Promise<string> {
  let candidate = base;
  let attempt = 2;
  // eslint-disable-next-line no-await-in-loop -- must check sequentially
  while (await exists(candidate)) {
    candidate = `${base}-${attempt}`;
    attempt += 1;
  }
  return candidate;
}
