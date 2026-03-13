# Ejaz Ahmed — Personal Website

Static website built with plain HTML, CSS, and JavaScript. No frameworks, no build step. Open any `.html` file in a browser to preview it locally.

---

## File structure

```
personal-website/
├── index.html          Homepage
├── work.html           Portfolio / case studies
├── community.html      Data with Ejaz + mentoring
├── about.html          Bio + contact
├── 404.html            Custom error page
├── blog/
│   └── index.html      Blog placeholder
├── assets/
│   ├── css/main.css    All styles (one file)
│   ├── js/main.js      Scroll reveal + nav state
│   └── images/
│       ├── favicon.svg
│       ├── ejaz-profile.webp   ← your profile photo goes here
│       └── og/                 ← social share images go here
├── sitemap.xml
├── robots.txt
└── CNAME
```

---

## How to edit content

### Change your bio text
Open [about.html](about.html) and edit the paragraphs inside the `<div class="bio-text">` section.

### Add or update a case study card
Open [work.html](work.html). Find the `<!-- ===== CASE STUDIES ===== -->` section. Copy an existing `<article class="card card--default case-study-card">` block and update the text and tags inside it.

### Add a personal project card
Open [work.html](work.html). Find `<!-- ===== PERSONAL PROJECTS ===== -->`. Copy an existing `<article class="card ...">` block and update it.

### Update the stats strip (home page)
Open [index.html](index.html). Find `<!-- ===== STATS STRIP ===== -->`. Edit the `stat-value` and `stat-label` text inside each `.stat-item`.

### Update the contact email
The email address appears in multiple places. Search the project for `ejazahmed.workemail@gmail.com` and replace all instances if needed.

### Update social links
Search the project for `linkedin.com/in/ejazamir`, `tiktok.com/@datawithejaz`, and `instagram.com/datawithejaz` and replace with updated URLs if they change. They appear in the nav footer of every page.

---

## How to replace your profile photo

1. Export your photo as **WebP format**, ideally square (e.g. 400×400px or 600×600px)
2. Keep the file size under 100KB — use [Squoosh](https://squoosh.app) if needed
3. Name the file `ejaz-profile.webp`
4. Drop it into `assets/images/`
5. That's it — the About page will pick it up automatically

If no image is present, the About page shows a fallback "E" placeholder so the layout never breaks.

---

## How to set your GA4 Measurement ID

1. Go to your GA4 property → Admin → Data Streams → your web stream
2. Copy the Measurement ID (format: `G-XXXXXXXXXX`)
3. In every `.html` file, find this line:
   ```
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX">
   ```
4. Replace `G-XXXXXXXXXX` with your actual ID in all 6 HTML files

Files to update: `index.html`, `work.html`, `community.html`, `about.html`, `404.html`, `blog/index.html`

---

## How to add OG (social share) images

Each page references a 1200×630px PNG image for social sharing. Create these in Canva or Figma and save to `assets/images/og/`:

| File | Used by |
|---|---|
| `og-default.png` | Blog page + fallback |
| `og-home.png` | Home page |
| `og-work.png` | Work page |
| `og-community.png` | Community page |
| `og-about.png` | About page |

Until you add real images, social shares will just show no preview image — the site still works fine.

---

## How to update the domain

1. Open `CNAME` and replace `datawithejaz.com` with your actual domain
2. Search all HTML files for `https://datawithejaz.com` and replace with your domain
3. Update `sitemap.xml` with the correct URLs

---

## How to deploy to GitHub Pages

1. Create a GitHub repository (public)
2. Push this entire folder to the `main` branch root
3. Go to repository Settings → Pages → Source: Deploy from branch → Branch: `main` / `/ (root)`
4. GitHub Pages will serve the site at `https://yourusername.github.io/repo-name/`
5. To use a custom domain: add your domain to the CNAME file and configure DNS per GitHub's instructions

---

## Editing tips

- The CSS lives entirely in `assets/css/main.css` — it's sectioned with clear comments
- The JS in `assets/js/main.js` is intentionally minimal (~50 lines) — scroll reveal and active nav state only
- Nav toggle on mobile is handled by CSS only (no JS)
- To add a new section style, add a new CSS block in `main.css` and apply the class in the HTML
