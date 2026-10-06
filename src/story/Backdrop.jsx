import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { useStory } from './story.js'

const FLOORS = 40
const line = 'color-mix(in srgb, var(--color-neutral-0) 55%, transparent)'

const floorLabel = (progress) => {
  const floor = Math.round(FLOORS * (1 - progress))
  return floor > 0 ? `Floor ${floor}` : 'Ground'
}

// The building behind the page: a sky that clears as you descend, faint window
// frames, and a counter for the floor the drone is working on.
export function Backdrop() {
  const { mode } = useStory()
  const { scrollY, scrollYProgress } = useScroll()
  const [floorHeight, setFloorHeight] = useState(240)
  const counter = useRef(null)

  useEffect(() => {
    const measure = () => {
      const distance = document.documentElement.scrollHeight - window.innerHeight
      setFloorHeight(Math.max(96, Math.round(distance / FLOORS)))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(document.body)
    return () => observer.disconnect()
  }, [])

  // One horizontal frame passes for every floor
  const framesY = useTransform(scrollY, (scroll) => -(scroll % floorHeight))
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (counter.current) counter.current.textContent = floorLabel(progress)
  })

  const active = mode !== 'off'
  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        {/* Overcast sky, with the clear sky fading in over it */}
        <div className="absolute inset-0 bg-linear-to-b from-neutral-200 to-neutral-100" />
        <motion.div
          className="absolute inset-0 bg-linear-to-b from-primary-200 to-primary-50"
          style={{ opacity: active ? scrollYProgress : 1 }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(to right, transparent 0, transparent calc(25% - 2px), ${line} calc(25% - 2px), ${line} 25%)`,
          }}
        />
        <motion.div
          className="absolute inset-x-0 top-0 will-change-transform"
          style={{
            y: active ? framesY : 0,
            height: `calc(100% + ${floorHeight}px)`,
            backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${floorHeight - 2}px, ${line} ${floorHeight - 2}px, ${line} ${floorHeight}px)`,
          }}
        />
      </div>
      {active ? (
        <p
          ref={counter}
          aria-hidden
          className={`pointer-events-none fixed z-40 font-sans text-sm font-medium text-neutral-600 tabular-nums ${
            mode === 'compact'
              ? 'right-0 bottom-1 w-7 rounded-control bg-neutral-0/80 text-center'
              : 'bottom-2 left-2 rounded-control bg-neutral-0/80 px-1 py-0.5'
          }`}
        >
          {floorLabel(0)}
        </p>
      ) : null}
    </>
  )
}
