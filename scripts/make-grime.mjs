// Generates the seamless dirt tiles used by the scroll story:
//   public/grime.svg        light film for cards and the "before" side
//   public/grime-heavy.svg  thick dirt for the pane over the hero
// Run with: node scripts/make-grime.mjs
import { writeFileSync } from 'node:fs'

const SIZE = 512
const DUST = '#5f5846'
const FILM = '#8c8266'

const n = (value) => value.toFixed(1)

function tile({ seed, smudges, streaks, specks, strength }) {
  let state = seed
  const random = () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
  const between = (min, max) => min + random() * (max - min)

  // Repeat a shape across the tile edges so the pattern wraps without seams
  const wrap = (draw, x, y, reach) => {
    const out = []
    for (const dx of [-SIZE, 0, SIZE]) {
      for (const dy of [-SIZE, 0, SIZE]) {
        const cx = x + dx
        const cy = y + dy
        if (cx > -reach && cx < SIZE + reach && cy > -reach && cy < SIZE + reach) {
          out.push(draw(cx, cy))
        }
      }
    }
    return out.join('')
  }

  const smudgeShapes = Array.from({ length: smudges }, () => {
    const rx = between(50, 130)
    const ry = between(24, 70)
    const opacity = between(0.5, 1) * strength
    const angle = between(-35, 35)
    return wrap(
      (x, y) =>
        `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(rx)}" ry="${n(ry)}" fill="${FILM}" opacity="${opacity.toFixed(2)}" transform="rotate(${n(angle)} ${n(x)} ${n(y)})"/>`,
      between(0, SIZE),
      between(0, SIZE),
      180,
    )
  }).join('')

  const streakShapes = Array.from({ length: streaks }, () => {
    const length = between(60, 190)
    const width = between(2, 6)
    const opacity = between(0.5, 1) * strength
    return wrap(
      (x, y) =>
        `<rect x="${n(x)}" y="${n(y)}" width="${n(width)}" height="${n(length)}" rx="${n(width / 2)}" fill="${FILM}" opacity="${opacity.toFixed(2)}"/>`,
      between(0, SIZE),
      between(0, SIZE),
      200,
    )
  }).join('')

  const speckShapes = Array.from({ length: specks }, () => {
    const r = between(0.5, 1.6)
    const opacity = between(0.4, 1) * strength
    return `<circle cx="${n(between(2, SIZE - 2))}" cy="${n(between(2, SIZE - 2))}" r="${n(r)}" fill="${DUST}" opacity="${opacity.toFixed(2)}"/>`
  }).join('')

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">` +
    `<defs><filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>` +
    `<filter id="run" x="-300%" y="-20%" width="700%" height="140%"><feGaussianBlur stdDeviation="2"/></filter></defs>` +
    `<g filter="url(#soft)">${smudgeShapes}</g><g filter="url(#run)">${streakShapes}</g>${speckShapes}</svg>`
  )
}

const files = {
  'grime.svg': tile({ seed: 20261006, smudges: 9, streaks: 10, specks: 110, strength: 0.3 }),
  'grime-heavy.svg': tile({ seed: 7741, smudges: 22, streaks: 26, specks: 260, strength: 0.62 }),
}

for (const [name, svg] of Object.entries(files)) {
  writeFileSync(new URL(`../public/${name}`, import.meta.url), svg)
  console.log(`Wrote public/${name} (${svg.length} bytes)`)
}
