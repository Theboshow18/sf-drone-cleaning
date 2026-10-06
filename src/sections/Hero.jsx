import { useRef } from 'react'
import { motion, useTransform } from 'framer-motion'
import { Button } from '../components/Button.jsx'
import { Drone } from '../components/Drone.jsx'
import { company } from '../content.js'
import { clamp, lerp, useScene } from '../story/story.js'
import { asset, displayType, shell } from '../ui.js'

// The glass is washed in this many side-to-side passes, between these points of the scene
const STROKES = 5
const START = 0.06
const END = 0.84
const strokeAt = (progress) => clamp((progress - START) / (END - START)) * STROKES
// Fades each band of dirt out at its top and bottom, so bands blend with no hard line
const feather = 'linear-gradient(to bottom, transparent, black 32%, black 68%, transparent)'

// One band of dirt, wiped off sideways. The window onto the dirt slides away while the
// dirt itself stays put, so the glass looks wiped rather than the dirt looking moved.
function DirtBand({ index, progress }) {
  const wiped = useTransform(progress, (value) => clamp(strokeAt(value) - index))
  // Even passes run right to left, odd passes left to right
  const direction = index % 2 === 0 ? -1 : 1
  const windowX = useTransform(wiped, (amount) => `${direction * amount * 100}%`)
  const dirtX = useTransform(wiped, (amount) => `${-direction * amount * 100}%`)
  const foam = useTransform(wiped, [0, 0.04, 0.96, 1], [0, 1, 1, 0])
  const pitch = 100 / STROKES
  return (
    <motion.div
      className="absolute inset-x-0 overflow-hidden will-change-transform"
      style={{ top: `${(index - 0.3) * pitch}%`, height: `${pitch * 1.6}%`, x: windowX }}
    >
      <motion.div
        className="absolute inset-0 bg-grime-500/60 will-change-transform"
        style={{
          x: dirtX,
          backgroundImage: `url(${asset('grime-heavy.svg')})`,
          maskImage: feather,
          WebkitMaskImage: feather,
        }}
      />
      {/* Water at the leading edge of the wipe */}
      <motion.div
        className={`absolute inset-y-0 w-8 from-neutral-0/0 to-neutral-0/70 ${
          direction < 0 ? 'right-0 bg-linear-to-r' : 'left-0 bg-linear-to-l'
        }`}
        style={{ opacity: foam, maskImage: feather, WebkitMaskImage: feather }}
      />
    </motion.div>
  )
}

function DirtyPane({ progress }) {
  const shineX = useTransform(progress, [END, 1], ['-120%', '420%'])
  const shine = useTransform(progress, [END, END + 0.04, 0.96, 1], [0, 1, 1, 0])
  const hint = useTransform(progress, [0, START], [1, 0])
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: STROKES }, (_, index) => (
        <DirtBand key={index} index={index} progress={progress} />
      ))}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-linear-to-r from-neutral-0/0 via-neutral-0/80 to-neutral-0/0 will-change-transform"
        style={{ x: shineX, opacity: shine }}
      />
      <motion.p
        className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-control bg-neutral-0 px-2 py-1 font-sans text-sm font-medium whitespace-nowrap text-neutral-900"
        style={{ opacity: hint }}
      >
        Scroll to wash the glass
      </motion.p>
    </div>
  )
}

function HeroPhoto({ parked, className = '' }) {
  return (
    <figure className={`relative ${className}`}>
      <img
        src={asset('images/drone-washing-glass.jpg')}
        alt="A drone spraying water down the glass wall of a building"
        width="1024"
        height="1024"
        className="aspect-square w-full rounded-card object-cover"
      />
      {/* With reduced motion there is no scroll story, so the drone waits here */}
      {parked ? (
        <div className="absolute -top-4 right-3" aria-hidden>
          <Drone size={120} />
        </div>
      ) : null}
    </figure>
  )
}

export function Hero() {
  const stage = useRef(null)
  const scene = useScene({
    order: 1,
    pin: 180,
    pinCompact: true,
    pose: (progress, { size }) => {
      const rect = stage.current?.getBoundingClientRect()
      if (!rect) return null
      // Before and after the wash the drone hovers at the top right
      if (progress <= START || progress >= END) {
        return { x: rect.right - size * 0.75, y: rect.top + size * 0.5 }
      }
      const stroke = strokeAt(progress)
      const index = Math.min(STROKES - 1, Math.floor(stroke))
      const along = stroke - index
      const x = index % 2 === 0 ? lerp(rect.right, rect.left, along) : lerp(rect.left, rect.right, along)
      const y = rect.top + ((index + 0.5) * rect.height) / STROKES - size * 0.2
      return { x, y, spray: true }
    },
  })
  const compact = scene.mode === 'compact'

  return (
    <div id="top">
      <section ref={scene.ref} style={scene.sectionStyle}>
        <div ref={stage} className={`relative ${scene.stageClass}`} style={scene.stageStyle}>
          <div className={`${shell} grid gap-6 py-3 lg:grid-cols-12 lg:items-center`}>
            <div className="lg:col-span-7">
              <h1 className={`text-2xl text-balance md:text-3xl xl:text-4xl ${displayType}`}>
                Streak-free windows, without ladders or scaffolding
              </h1>
              <p className="mt-3 max-w-xl text-lg text-pretty text-neutral-600">
                {company.name} is a Toronto-based company that washes the windows and façades
                of high-rise and commercial buildings by drone, with no scaffolding, swing stages
                or lifts.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button href="#contact">Get a Free Quote</Button>
                <Button
                  variant="secondary"
                  href={company.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Watch the video demonstration
                </Button>
              </div>
            </div>
            {compact ? null : (
              <HeroPhoto parked={scene.mode === 'off'} className="lg:col-span-5" />
            )}
          </div>
          {scene.mode === 'off' ? null : <DirtyPane progress={scene.progress} />}
        </div>
      </section>
      {/* On small screens only the text is pinned, and the photo follows it */}
      {compact ? (
        <div className={`${shell} pb-8`}>
          <HeroPhoto />
        </div>
      ) : null}
    </div>
  )
}
