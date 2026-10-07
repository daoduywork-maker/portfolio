// Builds a link that works both at the domain root and under a repo path
// such as https://name.github.io/portfolio/.
export function url(path = '') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + '/' + String(path).replace(/^\//, '');
}
