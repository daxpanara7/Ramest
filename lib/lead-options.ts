import { serviceCategories } from "@/lib/services";

/**
 * Choices offered by the contact form's dropdowns.
 *
 * Both are stored as the label the visitor actually saw rather than an id or
 * an enum. Two reasons: the admin never has to decode anything, and rewording
 * a band later cannot silently reinterpret leads that were captured under the
 * old wording — an old lead keeps saying exactly what the person was shown.
 */

/** Budget bands, as supplied. Order is meaningful — low to high. */
export const BUDGET_OPTIONS = [
  "Below $10K",
  "$10K - $25K",
  "$25K - $75K",
  "$75K - $200K",
  "$200K - $500K",
  "$500K and above",
] as const;

/**
 * Interested-service options, derived from the same `serviceCategories` that
 * builds the nav, the footer and the /services pages. Derived rather than
 * hand-listed so a new service cannot appear on the site while being missing
 * from the one form where a prospect would ask for it.
 *
 * Flattened across categories and de-duplicated, because a couple of items
 * appear under more than one category.
 */
export const SERVICE_OPTIONS: string[] = Array.from(
  new Set(serviceCategories.flatMap((c) => c.items.map((i) => i.title))),
);
