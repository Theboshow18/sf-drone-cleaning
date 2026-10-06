import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import { Drone } from '../components/Drone.jsx'
import { HEADER, clamp, fitsFullStory, useStory } from './story.js'

// Slightly underdamped, so the drone overshoots a little and settles
const flight = { stiffness: 110, damping: 15, mass: 1 }

const readView = () => {
  const vw = document.documentElement.clientWidth
  const compact = !fitsFullStory()
  return { compact, size: compact ? 48 : vw >= 1280 ? 240 : 200 }
}

// Flies the one drone on the page. Every frame it asks the scene on screen where the
// drone should be, then lets springs carry it there. The layer ignores the pointer.
export function DroneDirector() {
  const { scenes } = useStory()
  const [view, setView] = useState(readView)
  const [landed, setLanded] = useState(false)
  const started = useRef(false)
  const landedRef = useRef(false)
  const rotorSpeed = useRef(1400)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const scale = useMotionValue(1)
  const mist = useMotionValue(0)
  const rotorAngle = useMotionValue(0)
  const flyX = useSpring(x, flight)
  const flyY = useSpring(y, flight)
  const flyScale = useSpring(scale, { stiffness: 90, damping: 20 })
  const mistOpacity = useSpring(mist, { stiffness: 140, damping: 24 })
  const speedX = useVelocity(flyX)
  const speedY = useVelocity(flyY)
  // Lean into the direction of travel, and level out when the drone stops
  const lean = useTransform(speedX, (speed) => clamp(speed / 45, -16, 16))
  const tilt = useSpring(lean, { stiffness: 160, damping: 18 })

  useEffect(() => {
    const update = () =>
      setView((current) => {
        const next = readView()
        return next.size === current.size && next.compact === current.compact ? current : next
      })
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useAnimationFrame((_, delta) => {
    const vw = document.documentElement.clientWidth
    const vh = window.innerHeight
    const { size, compact } = view
    const env = { vw, vh, size, compact }

    // The scene on screen is the last one that has entered and not yet left
    let pose = null
    for (const order of [...scenes.keys()].sort((a, b) => a - b)) {
      const scene = scenes.get(order)
      if (!scene.el) continue
      const rect = scene.el.getBoundingClientRect()
      if (rect.top <= vh * 0.6 && rect.bottom >= vh * 0.25) {
        pose = scene.pose(scene.progress.get(), env) ?? pose
      }
    }
    // Between scenes the drone holds off to the side
    pose ??= { x: vw - size * 0.6, y: vh * 0.34 }

    const reach = size * 0.375
    const targetX = compact ? vw - size / 2 - 4 : clamp(pose.x, size * 0.4, vw - size * 0.4)
    const targetY = clamp(pose.y, HEADER + reach * (pose.scale ?? 1) + 4, vh - reach)
    x.set(targetX)
    y.set(targetY)
    scale.set(compact ? 1 : (pose.scale ?? 1))
    mist.set(pose.spray ? 1 : 0)
    if (!started.current) {
      flyX.jump(targetX)
      flyY.jump(targetY)
      started.current = true
    }

    const isLanded = Boolean(pose.landed)
    if (isLanded !== landedRef.current) {
      landedRef.current = isLanded
      setLanded(isLanded)
    }

    // Rotors work harder when the drone climbs or moves fast, and wind down once it lands
    const vx = speedX.get()
    const vy = speedY.get()
    const wanted = isLanded
      ? 0
      : 1300 + Math.min(1500, Math.hypot(vx, vy) * 1.6) + Math.min(1200, Math.max(0, -vy) * 3)
    const seconds = Math.min(delta, 50) / 1000
    rotorSpeed.current += (wanted - rotorSpeed.current) * (1 - Math.exp(-seconds * 3.5))
    rotorAngle.set((rotorAngle.get() + rotorSpeed.current * seconds) % 360)
  })

  const { size, compact } = view
  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-40 will-change-transform"
      style={{ x: flyX, y: flyY, marginLeft: -size / 2, marginTop: -size * 0.375 }}
      aria-hidden
    >
      <motion.div style={{ rotate: tilt, scale: flyScale }}>
        <motion.div
          animate={landed ? { y: 0 } : { y: [0, -8, 0] }}
          transition={
            landed ? { duration: 0.4 } : { duration: 2.6, ease: 'easeInOut', repeat: Infinity }
          }
        >
          <Drone
            size={size}
            rotorAngle={rotorAngle}
            mistOpacity={mistOpacity}
            droplets={compact ? 5 : 10}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
