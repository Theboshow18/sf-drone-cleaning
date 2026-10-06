import { createContext, useContext, useEffect, useRef } from 'react'
import { useMotionValue, useScroll } from 'framer-motion'

// Height of the sticky header, which pinned scenes sit below
export const HEADER = 72

// Pinned scenes need a wide screen that is tall enough to hold a whole scene
export const fitsFullStory = () => window.innerWidth >= 1024 && window.innerHeight >= 640

export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))
export const lerp = (from, to, amount) => from + (to - from) * amount
export const smooth = (amount) => amount * amount * (3 - 2 * amount)

// 'full' pins every scene, 'compact' is the simplified small-screen story,
// 'off' is the clean page for visitors who ask for reduced motion
export const StoryContext = createContext({ mode: 'off', scenes: new Map() })
export const useStory = () => useContext(StoryContext)

// A scene is one section of the page with its own scroll progress (0 to 1) and a
// `pose` function that tells the drone where to be at that progress.
// `pin` is how much extra scrolling, in viewport heights, the section is held for.
export function useScene({ order, pin = 0, pinCompact = false, offset = ['start 0.8', 'end 0.8'], pose }) {
  const { mode, scenes } = useStory()
  const ref = useRef(null)
  const pinned = pin > 0 && (mode === 'full' || (mode === 'compact' && pinCompact))
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: pinned ? [`start ${HEADER}px`, 'end end'] : offset,
  })
  const finished = useMotionValue(1)
  const progress = mode === 'off' ? finished : scrollYProgress

  const latestPose = useRef(pose)
  useEffect(() => {
    latestPose.current = pose
  })
  useEffect(() => {
    if (mode === 'off') return undefined
    scenes.set(order, {
      el: ref.current,
      progress,
      pose: (value, env) => latestPose.current(value, env),
    })
    return () => scenes.delete(order)
  }, [mode, scenes, order, progress])

  return {
    ref,
    progress,
    pinned,
    mode,
    sectionStyle: pinned ? { height: `calc(100svh - ${HEADER}px + ${pin}svh)` } : undefined,
    stageClass: pinned ? 'sticky flex flex-col justify-center' : '',
    stageStyle: pinned ? { top: HEADER, height: `calc(100svh - ${HEADER}px)` } : undefined,
  }
}
