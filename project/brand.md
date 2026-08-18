# Brand: dr. eyal doron — style guide (from מצגת מיתוג, April 2026)
Reference images: styleguide/01..16-page.png

## Logo
- Wordmark, 2 stacked lines: "dr." (serif, italic, light) + "eyal doron" (heavy geometric sans, black, tight leading, lowercase).
- Black on white, or white on black square. Never orange.
- Asset files (transparent PNG, 600×321): `uploads/Logo-Black.png` (for light bg), `uploads/Logo-White.png` (for dark bg).

## Typography
- Font: Google Sans (Hebrew + Latin — Hebrew glyphs confirmed in files). Weights: Regular, Medium, Semibold, Bold (+Italic).
- Local files: fonts/GoogleSans-{Regular,Medium,SemiBold,Bold,Italic}.ttf (+ Variable). @font-face family 'Google Sans'.
- Big bold black Hebrew headlines, tight leading; one key word colored (gradient or accent).
- Small uppercase-ish captions, thin hairline rules under quotes.

## Colors (UPDATED palette — sampled from client swatch, uploads/palette.png)
- Base: white (#FFFFFF) / light gray page bg (#F4F4F2 approx) — SITE IS LIGHT MODE.
- Occasional dark sections: dark grey, NOT pure black (e.g. #1C1B20 / #232227 — client says black feels heavy).
- 5 brand hues, each with tints/shades (tint2 / tint1 / MAIN / dark1 / dark2):
  - Yellow:  #FFF7E4 / #FFE8B6 / #FFC548 / #F2A531 / #F17D10
  - Red:     #FDE4DF / #FAB7A9 / #F34B29 / #C32824 / #9D1233
  - Violet:  #EBE6FF / #C8BDFF / #7659FF / #5534F5 / #1F106D
  - Sky:     #E9F8FD / #C5ECF9 / #6DD0F0 / #439FE0 / #1F48B1
  - Green:   #D9F4ED / #99E1CF / #00B487 / #008979 / #0C493A
- Signature spectrum gradient (horizontal, green→orange):
  #06B58D → #42C5C6 → #6EB9F2 → #7374FB → #8F56D2 → #D34E5E → #F77533 → #FFC548
- Accent word in headlines: gradient text or one MAIN hue.

## Visual language
- Soft, heavily-blurred organic aurora blobs (semi-sheer) floating on white AND on near-black sections.
- Dark sections (sparingly): dark grey (#1C1B20-ish, never #000) with a glowing aurora blob + white text + spectrum line-art icon (thin stroke, e.g. chess rook, ship wheel).
- Big oversized numerals (01, 21) with short underline.
- Circular masks on photography; stage/audience photos.
- Quote style: ”…“ with colored word + short dash below.
- Minimal, editorial, lots of whitespace. No hard cards; content sits directly on bg.

## Copy rules (client prompt — binding)
- All page copy is locked VERBATIM from the client's section breakdown (in `Super Talent Landing.dc.html`). Do not fix typos/phrasing (e.g. "לפיתו", "גם אנחנו רוצים את להפוך"), do not invent headings, testimonials, FAQ items, or button texts. Submit button has NO text (icon only) — none was provided.
- Materials not yet supplied get image-slot placeholders: 8 org logos, 6 course photos, Dr. Doron photo, testimonial skeletons ("מספרים מהשטח").

## Components
- Use React Bits (reactbits.dev, GitHub: DavidHDev/react-bits) components, copied into the project and mounted via x-import.
- Good brand fits: Aurora (bg, custom color stops), GradientText (accent words), BlurText/SplitText (headline reveals), CountUp (stats), LogoLoop (logos marquee), Carousel (testimonials), Magnet/StarBorder (buttons), ScrollReveal.

## Do
- Gradient text on 1 word max per headline; rest black (or white on dark).
- Thin-stroke gradient line icons.
## Don't
- No orange-only accent, no neomorphism (old direction), no heavy borders.
