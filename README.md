# מטלנט לסופר-טלנט — ד״ר אייל דורון

Hebrew/RTL landing page for Dr. Eyal Doron's organisational course, built from a
[Claude Design](https://claude.ai/design) prototype.

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · TypeScript
Images on Supabase Storage · Contact form via Resend

---

## Quick start

```bash
npm install
cp .env.example .env.local   # optional for local dev — see below
npm run dev
```

The site runs with no configuration at all: images fall back to `public/assets`,
and the contact form returns a "not configured" error until Resend is set up.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server on :3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run upload-assets` | Push `public/assets` to Supabase Storage |
| `npm run optimize-assets` | Regenerate `public/assets` from the design export (needs `project/`) |

---

## Images (Supabase Storage)

Every image resolves through [`src/lib/assets.ts`](src/lib/assets.ts):

```ts
asset('logos/nestle.webp')
// no env set  ->  /assets/logos/nestle.webp          (from public/)
// env set     ->  https://<ref>.supabase.co/storage/v1/object/public/site-assets/logos/nestle.webp
```

The same relative paths work against both sources, so switching over is one env
var — no code changes.

**To move images to Supabase:**

1. Create a Supabase project.
2. Fill in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_BUCKET=site-assets
   SUPABASE_SECRET_KEY=sb_secret_...
   ```
3. `npm run upload-assets`

The script creates the bucket (public) if it is missing and upserts all 44
files, so re-run it whenever artwork changes.

**On keys.** `SUPABASE_SECRET_KEY` is a secret key from Settings -> API Keys.
It is the current replacement for the pre-2025 `service_role` JWT, which the
dashboard now files under "Legacy API keys"; the old `SUPABASE_SERVICE_ROLE_KEY`
name still works as a fallback. Prefer a secret key — those rotate and revoke
individually, whereas rotating the legacy JWT invalidates everything at once.

The secret key is used **only** by `npm run upload-assets` and never reaches the
browser. Never prefix it with `NEXT_PUBLIC_`, which would inline it into the
client bundle as a full-access credential.

**No publishable/anon key is needed.** Most Supabase guides tell you to set one,
but nothing in `src/` uses a Supabase key at all — the bucket is public, so the
browser fetches ordinary image URLs.

`next.config.ts` whitelists the Supabase hostname for `next/image`, derived from
`NEXT_PUBLIC_SUPABASE_URL` at build time.

> **Note:** `public/assets` is kept in the repo as the source of truth and as the
> zero-config fallback. Delete it only if you are certain the bucket is
> populated in every environment.

---

## Contact form (Resend)

`POST /api/contact` → [`src/app/api/contact/route.ts`](src/app/api/contact/route.ts)

```
RESEND_API_KEY=re_...
CONTACT_FROM_EMAIL=noreply@yourdomain.com   # domain must be verified in Resend
CONTACT_TO_EMAIL=sales@yourdomain.com       # comma-separated list allowed
```

The route validates input, escapes it into an RTL HTML email, sets `reply-to` to
the submitter, and includes:

- a hidden honeypot field (`website`) — filled-in submissions are silently accepted and dropped
- a per-IP rate limit of 5 requests/minute
- email-format validation on `reply-to` to prevent header injection

Only `fullname` is required; every other field is optional, matching the design.

---

## Project layout

```
src/
  app/
    layout.tsx            lang="he" dir="rtl", metadata
    page.tsx              composes the 19 sections in order
    globals.css           Tailwind theme, fonts, keyframes, non-Tailwind utilities
    api/contact/route.ts  Resend handler
  components/
    MotionProvider.tsx    all scroll-driven motion (see below)
    ui.tsx                gradient icon system + CTA button
    reactbits/            Aurora, CurvedLoop, LogoLoop, DomeGallery
    sections/             one file per page section
  lib/
    assets.ts             Supabase-or-local image URL resolver
    content.ts            all page copy, FAQ, testimonials, logos
public/
  assets/                 the 44 images the site uses
  fonts/                  Futurism (Light + Bold)
project/                  original Claude Design export (reference only)
```

### Motion

[`MotionProvider`](src/components/MotionProvider.tsx) drives everything from a
single scroll handler rather than one-shot triggers, so elements fade back out
on the way past and stay correct after resize:

- `data-reveal` — fade/slide in. `data-reveal-early` triggers sooner,
  `data-reveal-x="left|right"` slides horizontally, `data-reveal-mode="scale"` scales up.
- `data-letters` — splits a headline into per-character spans and staggers them.
  Handles gradient-clipped text by re-applying the gradient to each character.
- `data-stack-card` — sticky cards that shrink/darken/blur as the next covers them (blur is cheap here — only 4 cards).
- `data-tl-wrap` / `data-tl-line` / `data-tl-dot` — the process timeline spine.
- `data-magnet` — buttons that lean toward the cursor.

Lenis provides smooth scrolling; anchor links are routed through it so native
smooth-scroll does not fight it. Everything is disabled under
`prefers-reduced-motion`.

**If scrolling feels sluggish**, the first thing to try is `SMOOTH_SCROLL` at the
top of `MotionProvider.tsx`. Lenis eases the scroll position toward the real one
over ~0.9s, which is a deliberate effect but is also, by definition, input
latency. Setting it to `false` hands scrolling back to the browser; every other
effect keeps working, since they are driven by scroll position rather than by
Lenis.

The reveal deliberately does **not** animate `filter: blur()`, though the
prototype did. A blur forces the element into an offscreen buffer and a separate
blur pass at its full rendered size every frame; on full-width sections with
several revealing at once it was the most expensive thing happening during a
scroll. Opacity, translate and scale are compositor-only and effectively free.

---

## Notes on the port

- **Copy is locked verbatim** from the client's brief (see `project/brand.md`),
  including typos and phrasing quirks. Do not "fix" wording in
  [`src/lib/content.ts`](src/lib/content.ts) without the client's approval.
- **Breakpoints** in `globals.css` are offset by 1px (`sm: 641px`, `md: 901px`, …)
  so Tailwind's min-width utilities line up exactly with the prototype's
  max-width media queries.
- **A few rules stayed as CSS** because Tailwind cannot express them: stacked
  `mask-image` gradients, the `@property --runAng` conic border, the mobile hero's
  `content: url()` image swap, and the animated `-webkit-line-clamp` on
  testimonials. They live as named utilities in `globals.css`.
- Original assets had Hebrew filenames and spaces; they were renamed to ASCII
  slugs when copied into `public/assets` (URLs need it).
- **Images are resized and converted to WebP by `scripts/optimize-assets.mjs`.**
  This matters more than it sounds. The originals were full-resolution
  (1920x1080 and up) and the browser cost of an image is its *decoded* bitmap —
  width x height x 4 bytes, held for as long as the image is live, regardless of
  file size. The 19 gallery photos alone decoded to ~125MB while being displayed
  in ~400px tiles; the whole page was ~161MB. Past a few hundred MB browsers
  evict decoded images and re-decode on demand, which is what made gallery tiles
  blink out mid-rotation and contributed heavily to scroll stutter. Everything is
  now sized to ~2x its real display size: **161MB -> 58MB decoded, 5.3MB -> 1.2MB
  on disk.** If you replace artwork, put the original in `project/` and re-run
  the script rather than dropping a full-size file into `public/assets`.
- The design export in `project/` is 396 MB of raw media; only the HTML and brand
  docs are committed — the media folders are gitignored.

---

## Deploy

Works on Vercel with no extra config. Set the env vars from `.env.example` in the
project settings; `NEXT_PUBLIC_SUPABASE_URL` must be present at **build** time for
the `next/image` host whitelist.
