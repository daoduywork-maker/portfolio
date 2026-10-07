import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// The site address and base path are passed in by the GitHub Pages workflow
// (astro build --site ... --base ...), so nothing here depends on the repo name.
const baseArg = process.argv.indexOf('--base');
const base = (baseArg > -1 ? process.argv[baseArg + 1] : '/').replace(/\/+$/, '');

// Lets Markdown use paths like /figures/plot.png even when the site
// is served from a sub-path such as /portfolio/.
function rehypeBasePaths() {
  const visit = (node) => {
    const p = node.properties;
    if (p) {
      for (const key of ['src', 'href']) {
        if (typeof p[key] === 'string' && p[key].startsWith('/') && !p[key].startsWith('//')) {
          p[key] = base + p[key];
        }
      }
    }
    (node.children || []).forEach(visit);
  };
  return visit;
}

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, rehypeBasePaths],
  },
});
