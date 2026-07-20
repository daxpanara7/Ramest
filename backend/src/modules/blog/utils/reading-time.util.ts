/**
 * Estimates reading time (whole minutes, minimum 1) from the post body.
 * Prefers the rendered HTML (strips tags before counting words); falls back
 * to a rough word count over the portable JSON content blocks.
 */
export function computeReadingMinutes(
  contentHtml?: string | null,
  contentJson?: unknown,
): number {
  const wordsPerMinute = 200;
  const text = contentHtml
    ? contentHtml.replace(/<[^>]*>/g, ' ')
    : extractTextFromJson(contentJson);

  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  if (wordCount === 0) return 1;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/** Best-effort text extraction from an arbitrary editor-blocks JSON shape. */
function extractTextFromJson(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(extractTextFromJson).join(' ');
  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>)
      .map(extractTextFromJson)
      .join(' ');
  }
  return '';
}
