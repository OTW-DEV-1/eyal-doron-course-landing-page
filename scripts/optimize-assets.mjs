#!/usr/bin/env node
/**
 * Regenerates public/assets from the original Claude Design export.
 *
 *   npm run optimize-assets
 *
 * Requires the design bundle in project/ (gitignored — it is ~400MB). The
 * optimised output IS committed, so this only needs running when source
 * artwork changes.
 *
 * Why this exists: the originals are full-resolution (1920x1080 and up) and
 * several are progressive JPEG or PNG. What costs performance in the browser is
 * not the file size but the decoded bitmap — width x height x 4 bytes, held in
 * memory for as long as the image is live. The 19 gallery photos alone decoded
 * to ~125MB while being displayed in ~400px tiles. Past a few hundred MB the
 * browser starts evicting decoded images and re-decoding them on demand, which
 * is what made tiles blink out mid-rotation, and the constant decode work is
 * what made scrolling stutter.
 *
 * Each target below is sized to roughly 2x its real display size, which is
 * enough for retina and cuts decoded memory by an order of magnitude.
 */
import sharp from 'sharp'
import { mkdir, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const SRC = join(ROOT, 'project')
const OUT = join(ROOT, 'public', 'assets')

if (!existsSync(join(SRC, 'uploads'))) {
  console.error(
    'project/uploads not found.\n' +
      'This script regenerates images from the Claude Design export, which is\n' +
      'gitignored. The optimised assets in public/assets are already committed —\n' +
      'you only need this if you are changing source artwork.',
  )
  process.exit(1)
}

/** Displayed at ~400px in the sphere; 640 covers retina comfortably. */
const GALLERY = [
  'עותק של thumb (7).jpg', 'IMG_9507.jpg', 'עותק של 3.jpeg', 'עותק של thumb (10).jpg',
  'עותק של 6.jpeg', 'עותק של IMG_9519.jpg', 'עותק של 1.jpeg', 'עותק של thumb (4).jpg',
  'עותק של 8.jpeg', 'עותק של thumb (9).jpg', 'IMG_9511.jpg', 'עותק של thumb (5).jpg',
  'עותק של 2.jpeg', 'עותק של thumb (11).jpg', 'עותק של 5.jpeg', 'עותק של thumb (3).jpg',
  'עותק של 7.jpeg', 'עותק של 4.jpeg', 'עותק של thumb (6).jpg',
]

// [source, output, maxWidth, keepAlpha]
const SINGLES = [
  ['uploads/hero7.png', 'hero-eyal.webp', 1100, true],
  ['uploads/Eyal2.png', 'eyal.webp', 900, true],
  ['uploads/EyalMobile.png', 'eyal-mobile.webp', 840, true],
  // The three "textures" are NOT opaque photos: their alpha channels peak at
  // 69/255 (HeroEle) and 38/255 (bg6) — the whole image is soft translucent
  // shapes composited over an aurora. Alpha must be kept lossless: lossy alpha
  // quantises those subtle gradients into hard-edged bands.
  ['uploads/HeroEle.png', 'hero-texture.webp', 1600, 'lossless-alpha'],
  ['uploads/HeroEle-f8ff9310.png', 'hero-texture-2.webp', 1600, 'lossless-alpha'],
  ['uploads/bg6.png', 'price-texture.webp', 1600, 'lossless-alpha'],
  ['uploads/img6 (1).webp', 'practice.webp', 1400, true],
  ['uploads/Circle1.png', 'circle-badge.webp', 400, true],
  ['assets/scroll-arrow.png', 'scroll-arrow.webp', 200, true],
  // Logos sit in ~300x156 cards and need crisp transparency.
  ['uploads/Logo-White.png', 'logo-white.webp', 600, true],
  ['uploads/Logo-Black.png', 'logo-black.webp', 600, true],
]

const LOGOS = [
  ['logo-nestle.png', 'nestle.webp'],
  ['logo-matrix.png', 'matrix.webp'],
  ['logo-babcom.png', 'babcom.webp'],
  ['logo-movement.png', 'movement.webp'],
  ['logo-bezeq.png', 'bezeq.webp'],
  ['logo-bluebird-new.png', 'bluebird.webp'],
  ['logo-cibus-new.png', 'cibus.webp'],
  ['logo-lusha.png', 'lusha.webp'],
]

/** Testimonial avatars render at 52px. */
const PEOPLE = [
  ['רונן.jpeg', 'ronen.webp'],
  ['קלאודיו-.jpeg', 'claudio.webp'],
  ['נעמה.jpeg', 'naama.webp'],
  ['reuven.jpeg', 'reuven.webp'],
  ['אסף-אשכנזי-1.jpeg', 'asaf.webp'],
  ['ליאת-.jpeg', 'liat.webp'],
]

await mkdir(join(OUT, 'gallery'), { recursive: true })
await mkdir(join(OUT, 'logos'), { recursive: true })
await mkdir(join(OUT, 'people'), { recursive: true })

let count = 0
let bytes = 0

async function emit(srcPath, outPath, maxDim, { quality = 80, alpha = true } = {}) {
  const info = await sharp(srcPath)
    .rotate() // honour EXIF orientation
    .resize({ width: maxDim, height: maxDim, fit: 'inside', withoutEnlargement: true })
    .webp({ quality, alphaQuality: alpha === 'lossless-alpha' ? 100 : alpha ? 90 : 0, effort: 5 })
    .toFile(outPath)
  count++
  bytes += info.size
  console.log(`  ${String(Math.round(info.size / 1024)).padStart(5)} KB  ${info.width}x${info.height}  ${outPath.slice(OUT.length + 1)}`)
}

console.log('Gallery (640px):')
for (let i = 0; i < GALLERY.length; i++) {
  const n = String(i + 1).padStart(2, '0')
  await emit(join(SRC, 'uploads', GALLERY[i]), join(OUT, 'gallery', `${n}.webp`), 640, { quality: 78 })
}

console.log('Portraits, textures, marks:')
for (const [src, out, dim, alpha] of SINGLES) {
  await emit(join(SRC, src), join(OUT, out), dim, { alpha })
}

console.log('Client logos (600px):')
for (const [src, out] of LOGOS) {
  await emit(join(SRC, 'assets', 'logos', src), join(OUT, 'logos', out), 600, { quality: 85 })
}

console.log('Testimonial avatars (160px):')
for (const [src, out] of PEOPLE) {
  await emit(join(SRC, 'uploads', src), join(OUT, 'people', out), 160, { quality: 82 })
}

// Drop the superseded originals so public/assets has exactly one copy of each.
const stale = []
for (const dir of [OUT, join(OUT, 'gallery'), join(OUT, 'logos'), join(OUT, 'people')]) {
  for (const f of await readdir(dir, { withFileTypes: true })) {
    if (f.isFile() && !/\.webp$/i.test(f.name)) stale.push(join(dir, f.name))
  }
}
if (stale.length) {
  console.log(`\n${stale.length} superseded non-webp files remain; delete with:`)
  stale.forEach((f) => console.log(`  rm "${f}"`))
}

console.log(`\n${count} images, ${(bytes / 1024 / 1024).toFixed(2)} MB total.`)
