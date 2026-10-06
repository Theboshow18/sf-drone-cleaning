import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useTransform } from 'framer-motion'
import { SectionHeading } from '../components/SectionHeading.jsx'
import { steps } from '../content.js'
import { clamp, lerp, useScene } from '../story/story.js'
import { asset, displayType, shell } from '../ui.js'

// The flight along the path runs between these points of the scene
const TAKEOFF = 0.1
const ARRIVE = 0.85
const DOT_GAP = 18

// The point a given share of the way along a path through `points`
function pointAlong(points, share) {
  const lengths = points.slice(1).map((point, index) =>
    Math.hypot(point.x - points[index].x, point.y - points[index].y),
  )
  let remaining = share * lengths.reduce((sum, length) => sum + length, 0)
  for (let index = 0; index < lengths.length; index += 1) {
    if (remaining <= lengths[index] || index === lengths.length - 1) {
      const along = lengths[index] ? clamp(remaining / lengths[index]) : 0
      return {
        x: lerp(points[index].x, points[index + 1].x, along),
        y: lerp(points[index].y, points[index + 1].y, along),
      }
    }
    remaining -= lengths[index]
  }
  return points[0]
}

function Dot({ dot, flown }) {
  const opacity = useTransform(flown, [dot.share - 0.03, dot.share], [0.25, 1])
  return <motion.circle cx={dot.x} cy={dot.y} r="3" className="fill-accent-500" style={{ opacity }} />
}

function Step({ step, index, lit, markerRef }) {
  return (
    <li className="relative flex gap-2">
      <span
        ref={markerRef}
        className={`relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-neutral-900 bg-neutral-0 text-xl ${displayType}`}
      >
        <motion.span
          className="absolute inset-0 bg-accent-500"
          initial={false}
          animate={{ opacity: lit ? 1 : 0 }}
        />
        <span className="relative">{index + 1}</span>
      </span>
      <motion.div initial={false} animate={{ opacity: lit ? 1 : 0.45 }}>
        <h3 className="text-xl font-semibold">{step.title}</h3>
        <p className="mt-1 text-neutral-600">{step.body}</p>
      </motion.div>
    </li>
  )
}

export function HowItWorks() {
  const list = useRef(null)
  const markers = useRef([])
  const [dots, setDots] = useState([])
  const [reached, setReached] = useState(0)

  const markerCentres = (origin) =>
    markers.current.map((marker) => {
      const rect = marker.getBoundingClientRect()
      return { x: rect.left + rect.width / 2 - origin.x, y: rect.top + rect.height / 2 - origin.y }
    })

  const scene = useScene({
    order: 4,
    pin: 150,
    pose: (progress, { size }) => {
      if (markers.current.length < 2) return null
      const point = pointAlong(markerCentres({ x: 0, y: 0 }), clamp((progress - TAKEOFF) / (ARRIVE - TAKEOFF)))
      return { x: point.x, y: point.y - size * 0.42 }
    },
  })
  const flown = useTransform(scene.progress, (value) =>
    clamp((value - TAKEOFF) / (ARRIVE - TAKEOFF)),
  )
  // A step lights up when the drone reaches its marker
  useMotionValueEvent(scene.progress, 'change', (value) => {
    const share = (value - TAKEOFF) / (ARRIVE - TAKEOFF)
    const count = share < 0 ? 0 : Math.min(steps.length, 1 + Math.floor(share * (steps.length - 1) + 0.03))
    setReached((current) => (current === count ? current : count))
  })
  const shown = scene.mode === 'off' ? steps.length : reached

  // Lay the dotted flight path through the step markers
  useEffect(() => {
    const layOut = () => {
      const origin = list.current.getBoundingClientRect()
      const points = markerCentres({ x: origin.left, y: origin.top })
      const total = points
        .slice(1)
        .reduce((sum, point, index) => sum + Math.hypot(point.x - points[index].x, point.y - points[index].y), 0)
      const count = Math.max(2, Math.round(total / DOT_GAP))
      setDots(
        Array.from({ length: count + 1 }, (_, index) => {
          const share = index / count
          return { share, ...pointAlong(points, share) }
        }),
      )
    }
    layOut()
    const observer = new ResizeObserver(layOut)
    observer.observe(list.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="how-it-works" ref={scene.ref} style={scene.sectionStyle} className="scroll-mt-10">
      <div className={scene.stageClass} style={scene.stageStyle}>
        <div className={`${shell} ${scene.pinned ? '' : 'py-8 md:py-12'}`}>
          <SectionHeading
            title="How it works"
            body="Four steps, from the first look at your building to the report."
          />
          <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-center">
            <figure className="lg:col-span-4">
              <img
                src={asset('images/drone-crew-at-facade.jpg')}
                alt="A pilot on the ground operating two cleaning drones at a glass façade"
                width="958"
                height="1086"
                loading="lazy"
                className="aspect-video w-full rounded-card object-cover lg:aspect-square"
              />
            </figure>
            <div className="relative lg:col-span-8">
              {scene.mode === 'off' ? null : (
                <svg className="pointer-events-none absolute inset-0 size-full overflow-visible" aria-hidden>
                  {dots.map((dot) => (
                    <Dot key={dot.share} dot={dot} flown={flown} />
                  ))}
                </svg>
              )}
              <ol ref={list} className="grid gap-x-6 gap-y-8 sm:grid-cols-2">
                {steps.map((step, index) => (
                  <Step
                    key={step.title}
                    step={step}
                    index={index}
                    lit={index < shown}
                    markerRef={(el) => {
                      markers.current[index] = el
                    }}
                  />
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
