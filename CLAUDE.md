# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio website for Mohamed Amine AROUS (AI engineering student at ENSTA Paris). Pure static site — vanilla HTML5, CSS3, and ES6+ JavaScript with **no build step, no dependencies, and no package manager**. Deployed via GitHub Pages.

## Running locally

There is nothing to build or install. Either open `index.html` directly in a browser, or serve the folder:

```bash
python -m http.server 8000   # then visit http://localhost:8000
# or
npx http-server
```

There is no lint or test setup.

## Architecture

The three live files are `index.html`, `styles.css`, and `script.js`. The page is a single scrolling document with anchor-linked sections (`#home`, `#about`, `#skills`, `#projects`, `#volunteering`, `#certifications`, `#contact`).

- **`styles.css`** drives all theming through CSS custom properties in `:root` (`--primary-color`, `--secondary-color`, etc.). Change colors there, not inline. The purple/violet gradient `linear-gradient(135deg, #667eea, #764ba2)` recurs throughout buttons and accents.
- **`script.js`** is plain DOM scripting with no modules. Active behaviors: mobile hamburger toggle, hero typewriter effect (phrases in the `phrases` array), scroll-spy nav highlighting, `IntersectionObserver` fade-in animations, smooth anchor scrolling, a dynamically injected scroll-to-top button, and `toggleDetails()` (exposed on `window`) which powers the inline "Show More/Less" buttons on each `.timeline-item`.

### Two timeline implementations exist — know which one is live

The **current `index.html`** renders Projects and Volunteering as vertical `.timeline-item` blocks with per-item `onclick="toggleDetails(this)"` Show More buttons. This is the only layout that ships.

`script.js` *also* contains a large `DOMContentLoaded` block for a different **horizontal carousel** layout (`.milestone`, `.timeline-track`, `.nav-btn`, `#detail-*` panel). That code is **dead** for the current `index.html` (which has no `.milestone` elements) — it belongs to the stale variants below. When editing timeline behavior, confirm which system you're touching; the horizontal-carousel code has no effect on the live page.

### Stale / backup files (not the live site)

`index-old.html`, `index-old-backup.html`, and `projects-timeline.html` are previous iterations kept in the repo. They use the horizontal-carousel timeline. Do not edit these expecting changes on the live site — `index.html` is what's served. `INTEGRATION_COMPLETE.md` and `SIMPLE_TIMELINE_COMPLETE.md` are notes from prior refactors, not current docs.

## Content conventions

- Portfolio content (projects, skills, certs, links) is hardcoded directly in `index.html` markup — there is no data file or CMS.
- The profile image is `cropped_circle_image.png`.
- External links (GitHub, LinkedIn posts, arXiv, certificates) use `target="_blank"`; project/cert links use the `.cert-link` class.
