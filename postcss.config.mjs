/**
 * Custom PostCSS chain. Adding this file replaces Next's default PostCSS
 * setup, so autoprefixer is re-added explicitly — without it the existing
 * marketing CSS would silently lose vendor prefixes.
 *
 * @tailwindcss/postcss only transforms files that use Tailwind directives
 * (the admin theme); the marketing stylesheets pass through untouched.
 */
export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
