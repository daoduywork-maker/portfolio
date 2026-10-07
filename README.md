# Duy M. Dao — portfolio

A static site built with [Astro](https://astro.build) and hosted on GitHub Pages.

## Run it on your computer

You need Node.js 22 or newer.

```bash
npm install
npm run dev
```

Then open the address it prints (usually http://localhost:4321). The page reloads when you save a file.

## Put it online

1. Create a repository on GitHub and push this folder to its `main` branch.
2. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Every push to `main` now rebuilds and publishes the site. The address is shown under Settings → Pages.

If the repository is named `<your-username>.github.io`, the site lives at `https://<your-username>.github.io/`. With any other name it lives at `https://<your-username>.github.io/<repo-name>/`. Both work without changing anything.

## Where things are

| To change | Edit |
|---|---|
| Name, email, profile links, footer line | `src/data/site.js` |
| CV (both pages) | `src/data/cv.js` |
| The downloadable CV | replace `public/cv.pdf` with your own PDF |
| A project | the matching file in `src/content/projects/` |
| A published paper | a file in `src/content/research/` |
| Colours and fonts | the top of `src/styles/global.css` |
| Home page text | `src/pages/index.astro` |
| The rotating lattice | `src/scripts/lattice.js` |

Everything in `[SQUARE BRACKETS]` is a placeholder waiting for your content.

## Add a project

Copy a file in `src/content/projects/`, rename it (the file name becomes the web address), and edit it. The top block sets the title, tags, facts and links; the text below is the page body, written in Markdown. Set `featured: true` to show it on the home page (the first three by `order` are shown).

## Add a paper

Copy `src/content/research/example-paper.md` and fill it in. The paper with `featured: true` is the lead card on the home page. If no paper is featured, the lead card disappears.

## Add a figure

Put the image in `public/figures/`, then set `figure: figures/your-file.png` in the top block of the project or paper. Inside a project's text, use `![description](/figures/your-file.png)`.

## Maths

Write LaTeX between dollar signs: `$E = mc^2$` inline, or `$$ ... $$` on its own lines for a displayed equation.
