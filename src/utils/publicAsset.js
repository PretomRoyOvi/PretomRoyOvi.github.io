/** Paths under /public, prefixed with Vite base (root `/` for this site). */
export function publicAsset(path) {
  const rest = String(path).replace(/^\//, '');
  return `${import.meta.env.BASE_URL}${rest}`;
}
