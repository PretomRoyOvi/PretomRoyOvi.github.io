/**
 * Public file paths (from /public) with Vite BASE_URL — "/" in dev, repo-based path on production build.
 */
export function publicAsset(path) {
  const rest = String(path).replace(/^\//, '');
  return `${import.meta.env.BASE_URL}${rest}`;
}
