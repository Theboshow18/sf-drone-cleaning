import { useEffect, useMemo, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { StoryContext, fitsFullStory } from './story.js'

function readMode(reducedMotion) {
  if (reducedMotion) return 'off'
  return fitsFullStory() ? 'full' : 'compact'
}

export function StoryProvider({ children }) {
  const reducedMotion = useReducedMotion()
  const [mode, setMode] = useState(() => readMode(reducedMotion))
  const [scenes] = useState(() => new Map())

  useEffect(() => {
    const update = () => setMode(readMode(reducedMotion))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [reducedMotion])

  const value = useMemo(() => ({ mode, scenes }), [mode, scenes])
  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>
}
