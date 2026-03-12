# Personal Website Build Plan — Ejaz Ahmed

## Context

Ejaz needs a shareable personal website (portfolio + about-me) for clients and anyone who doesn't know him. Content source: `ejaz-ahmed_knowledge-base_v4.0.md`. Deploys to GitHub Pages. Must be easily editable via Claude Code — no frameworks, no build tools. Follows visual design system from `DESIGN-STANDARDS.md`.

---

## Tech Stack

- **Plain HTML5 + CSS3 + Vanilla JavaScript** — no framework, no SSG, no bundler
- **Neue Montreal** font via Fontshare CDN (fallback: `system-ui, -apple-system, sans-serif`)
- **GitHub Pages** deployment from `main` branch root
- **GA4** tracking via `<script>` tag (placeholder `G-XXXXXXXXXX`)

---

## File Structure

```
personal-website/
├── index.html            # Home
├── work.html             # Portfolio / Case Studies
├── community.html        # Data with Ejaz + Pro Bono
├── about.html            # Bio + Contact
├── 404.html              # Custom branded 404 page (full nav + footer, links back to site)
├── sitemap.xml
├── robots.txt
├── CNAME                 # Custom domain placeholder
├── README.md             # Editing guide for Ejaz
├── assets/
│   ├── css/
│   │   └── main.css      # All styles, one file, clearly sectioned
│   ├── js/
│   │   └── main.js       # Scroll interactions + micro-animations (nav toggle is CSS-only)
│   └── images/
│       ├── favicon.svg           # SVG favicon (scales cleanly across all sizes)
│       ├── ejaz-profile.webp     # Profile photo for About page bio (WebP, target ≤100KB)
│       └── og/
│           ├── og-default.png    # 1200×630 fallback OG image — used if page-specific image missing
│           ├── og-home.png
│           ├── og-work.png
│           ├── og-community.png
│           └── og-about.png
└── blog/
    └── index.html        # Placeholder "Coming Soon" — URL served as /blog/
```

---

## Design System (from DESIGN-STANDARDS.md)

### CSS Custom Properties

```css
:root {
  --color-bg: #FFFFFF;
  --color-text-primary: #1D1D1F;
  --color-text-secondary: #6E6E73;
  --color-divider: #D2D2D7;
  --color-accent-primary: #1A1AFF;
  --color-accent-secondary: #F59E0B;
  --color-card-default: #F5F5F7;
  --color-card-dark: #1D1D1F;
  --color-card-featured: #1A1AFF;
  --font-primary: 'Neue Montreal', system-ui, -apple-system, sans-serif;
  --radius-card: 16px;
  --shadow-card: 0 2px 20px rgba(0,0,0,0.06);
  --transition-default: 200ms ease;
}
```

### Visual Techniques
- **Aurora blob hero:** CSS radial gradients with `filter: blur(80px)` + keyframe drift animation
- **Multi-fill cards:** Featured (#1A1AFF white text), Secondary (#1D1D1F white text), Default (#F5F5F7), White Elevated (#FFFFFF + shadow)
- **Fluid typography:** `clamp()` for headings (e.g. `clamp(2rem, 5vw, 3.5rem)`)
- **Mobile nav:** CSS checkbox hack — no JS dependency for toggle. `main.js` handles scroll effects only.

---

## Performance & Accessibility

These directly affect Core Web Vitals (LCP, CLS, FID) and therefore Google search ranking.

### Images
- **Format:** WebP for all photos and illustrations (significant size reduction vs JPG/PNG)
- **Profile photo:** `ejaz-profile.webp` — target ≤100KB, 400×400px minimum. Use `loading="lazy"` (below the fold in bio section)
- **OG images:** PNG is fine (social platforms don't support WebP reliably)
- **Fallback OG:** All pages reference `og-default.png` as fallback if page-specific OG image is missing. Set in `<meta property="og:image">` with absolute URL.
- **Alt text:** Every `<img>` must have a descriptive `alt` attribute. Decorative images get `alt=""`

### Fonts
- Fontshare CDN import must use `font-display: swap` to prevent invisible text flash (FOIT)
- Fallback chain already defined: `'Neue Montreal', system-ui, -apple-system, sans-serif`

### HTML & Semantics (accessibility + SEO signal)
- Use semantic elements throughout: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- One `<h1>` per page only — all other headings follow hierarchy (`h2` → `h3`)
- Navigation `<nav>` must include `aria-label="Main navigation"`
- Mobile nav checkbox hack: the `<label>` must have `aria-label="Toggle menu"`
- All icon-only links (social icons) need `aria-label` (e.g. `aria-label="LinkedIn profile"`)
- `<html lang="en">` on all pages
- Colour contrast: accent blue `#1A1AFF` on white passes WCAG AA for large text; verify for body-size text

### Performance
- No render-blocking JS — `main.js` loads with `defer` attribute
- GA4 script loads with `async` (already in plan — maintain this)
- Aurora blob animation: add `prefers-reduced-motion` media query to disable keyframe drift for users who request it
- `<link rel="preconnect" href="https://api.fontshare.com">` in `<head>` to speed up font load
- Images below the fold: `loading="lazy"` on all `<img>` tags except the hero (which should be eager)

### 404 Page
- Branded: same nav + footer as main site, full design system applied
- Clear message (warm tone, not robotic)
- Prominent link back to homepage and Work page
- No external dependencies — must work offline if needed
- GitHub Pages automatically serves `404.html` for any unmatched route

---

## Page-by-Page Breakdown

### 1. Home (`index.html`)

| Section | Content |
|---|---|
| **Hero** | Aurora blob background. Name, one-liner ("Data & Advertising Analyst"), 2–3 sentence intro. Skill tags inline (Python, SQL, Meta Ads, GA4, etc.). Primary CTA: "See My Work" → `work.html` |
| **What I Do** | 3–4 cards (White Elevated fill). Advertising Analytics, Data Science & ML, Content & Community, Consulting. Each: icon + short description |
| **Highlight Strip** | Key stats in a horizontal row: "50+ Brands", "6+ Years", "10,000+ Followers", "WPP Gold Winner". No exact spend/revenue figures |
| **Footer** | Social links (LinkedIn, TikTok, Instagram), contact email, copyright |

### 2. Work (`work.html`)

| Section | Content |
|---|---|
| **Page Header** | Title + brief intro paragraph |
| **Case Study Cards** | Grid of cards (Default fill). Each card: brand name, one-line description, tech stack as small icon badges. NO drill-down pages, NO exact metrics. Cards from KB: POND's AR, Speaksmart, Unilever YouTube, KSA Tourism, Harmonious Society Email, Bano Qabil, Automotive |
| **Personal Projects** | Separate section. HookScript (SaaS) + Data with Ejaz. Card format, link out where applicable |
| **CTA** | "Want to work together?" → links to About/Contact |

### 3. Community (`community.html`)

| Section | Content |
|---|---|
| **Page Header** | Title: "Content & Community" |
| **Data with Ejaz** | Featured card (blue fill). Brand description, positioning ("skeptical practitioner"), platforms (LinkedIn, TikTok, Instagram) with follow links, 10,000+ followers stat |
| **Pro Bono & Mentoring** | Section with details: 10+ sessions in last 2 years, types of people helped, Bano Qabil teaching. Default fill cards |
| **Content Pillars** | Brief list of what Ejaz creates content about: advertising analytics, AI skepticism, career in data |

### 4. About (`about.html`)

| Section | Content |
|---|---|
| **Page Header** | Short warm intro — who Ejaz is as a person |
| **Bio** | First-person, approachable. London-based. MSc Data Science & AI (Suffolk, 2025). BBA Marketing (IOBM, 2019). 6+ years in performance marketing. Warmer tone than typical corporate bio. Includes profile photo (`ejaz-profile.webp`) — circular or rounded-rectangle crop, floated or stacked depending on breakpoint |
| **Awards** | WPP Gold mention. Keep brief |
| **Contact** | Email: `ejazahmed.workemail@gmail.com`. Social links. Simple — no contact form (static site) |

---

## Shared Components

### Navigation (all pages)
- Fixed top bar, white background, subtle bottom border
- Logo/name left, page links right
- Mobile: hamburger → full-screen overlay (CSS checkbox hack)
- Active page highlighted with accent color underline

### Footer (all pages)
- Social icon links (LinkedIn, TikTok, Instagram)
- Contact email
- Copyright line: `© 2026 Ejaz Ahmed`
- No AI attribution anywhere

### Meta/SEO (all pages)
- Unique `<title>` and `<meta name="description">` per page
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`)
  - `og:image` uses the page-specific OG image; falls back to `og-default.png` (absolute URL) if page-specific is missing
- Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)
- JSON-LD `Person` schema on `index.html`
- Canonical URLs
- `sitemap.xml` listing all 4 main pages + blog placeholder (excludes 404)
- `robots.txt` allowing all crawlers
- `<link rel="icon" href="/assets/images/favicon.svg" type="image/svg+xml">` on all pages

---

## Responsive Strategy

- **Mobile-first** base styles (default)
- **Breakpoints:**
  - `768px` — tablet (2-column grids, larger type)
  - `1200px` — desktop (max-width container, full layouts)
- **Max content width:** `1200px`, centered with auto margins
- **Card grids:** 1 col → 2 col → 3 col across breakpoints
- **Navigation:** hamburger on mobile, inline links on desktop

---

## GA4 Integration

```html
<!-- GA4 — replace G-XXXXXXXXXX with actual Measurement ID -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Placed in `<head>` of every page. Placeholder ID until Ejaz provides real one.

---

## Content Rules

- **No exact metrics** publicly (no "£X spend", "X% ROAS")
- **No Crafted Agency name** — refer to "type/calibre of clients" instead
- **No employer name** in any output
- **No AI attribution** anywhere
- **Contact email:** `ejazahmed.workemail@gmail.com` only
- **Brand names OK** on case study cards (POND's, Unilever, etc.)
- **Tone:** Warm, approachable, first-person, direct. Not corporate.

---

## Build Order

1. `assets/css/main.css` — design system foundation (tokens, reset, typography, components, `prefers-reduced-motion`)
2. `index.html` — home page (establishes nav/footer pattern, favicon, preconnect, GA4)
3. `work.html` — portfolio
4. `community.html` — content & community
5. `about.html` — bio & contact (includes profile photo slot)
6. `404.html` — custom branded 404 page
7. `assets/js/main.js` — scroll interactions + micro-animations (CSS handles nav toggle)
8. `sitemap.xml`, `robots.txt`, `CNAME`
9. `blog/index.html` — placeholder
10. `README.md` — editing guide

---

## Verification

1. Open each `.html` file in browser — confirm all 5 pages render correctly (including 404)
2. Test navigation links between all pages
3. Resize browser window — confirm responsive breakpoints work (mobile/tablet/desktop)
4. Check mobile hamburger menu opens/closes (CSS checkbox hack)
5. Validate no broken links or missing assets (check favicon, profile photo, OG images)
6. Confirm no prohibited content (employer name, wrong email, AI attribution, exact metrics)
7. Confirm GA4 script present in `<head>` of all pages (async, not render-blocking)
8. Confirm `main.js` loads with `defer` on all pages
9. Test `prefers-reduced-motion`: disable aurora animation in OS accessibility settings
10. Check all images have `alt` text; check social icon links have `aria-label`
11. Run Lighthouse audit in Chrome DevTools — target 90+ on Performance, Accessibility, SEO
12. Validate OG tags with [opengraph.xyz](https://www.opengraph.xyz) or similar tool
13. Validate HTML with W3C validator (optional but recommended)
14. Push to GitHub → enable GitHub Pages → confirm live site loads
15. Visit a non-existent URL (e.g. `/xyz`) — confirm custom 404 page appears

---

## Key Source Files

- **Content:** `../ejaz-ahmed_knowledge-base_v4.0.md`
- **Design system:** `../DESIGN-STANDARDS.md`
- **Output directory:** `.` (this repository root)
