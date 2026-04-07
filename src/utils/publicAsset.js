/** Paths under /public, prefixed with Vite base (root `/` for this site). */
export function publicAsset(path) {
  const rest = String(path).replace(/^\//, '');
  return `${import.meta.env.BASE_URL}${rest}`;
}

/**
 * Absolute same-origin URL for uploaded files (e.g. `/uploads/...` from JSON).
 * Helps HashRouter + GitHub Pages and avoids bad caching of broken relative requests.
 */
export function siteMediaUrl(path) {
  if (path == null || path === '') return '';
  const t = String(path).trim();
  if (!t) return '';
  if (/^https?:\/\//i.test(t)) return t;
  const relative = publicAsset(t.replace(/^\//, ''));
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}${relative}`;
  }
  return relative;
}
