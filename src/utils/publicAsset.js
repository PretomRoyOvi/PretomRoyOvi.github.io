/**
 * Public file paths (from /public) with Vite BASE_URL — "/" in dev, "/prism-lab/" on GitHub Pages build.
 */
export function publicAsset(path) {
  const rest = String(path).replace(/^\//, '');
  return `${import.meta.env.BASE_URL}${rest}`;
}
