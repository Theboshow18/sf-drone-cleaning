import { motion, useTransform } from 'framer-motion'
import { clamp } from '../story/story.js'

const tube = 'fill-none stroke-neutral-800'
const board = 'fill-neutral-600 stroke-neutral-900'

// The pieces of the scaffold, ordered from the side the drone arrives on (the right)
const pieces = [
  // Ladder
  <g key="ladder" className={tube} strokeWidth="6" strokeLinecap="round">
    <path d="M322 388 362 64" />
    <path d="M352 388 392 64" />
    <path d="M327 348H357M332 308H362M337 268H367M342 228H372M347 188H377M352 148H382M357 108H387" strokeWidth="4" />
  </g>,
  // Right standard
  <g key="right" className={tube} strokeWidth="8" strokeLinecap="round">
    <path d="M300 40V384" />
    <path d="M280 388H320" />
  </g>,
  // Top deck and guard rail
  <g key="top">
    <path d="M100 84H300" className={tube} strokeWidth="6" strokeLinecap="round" />
    <rect x="84" y="124" width="232" height="14" rx="3" className={board} strokeWidth="2" />
  </g>,
  // Upper braces
  <g key="upper" className={tube} strokeWidth="5" strokeLinecap="round">
    <path d="M100 142 300 246" />
    <path d="M300 142 100 246" />
  </g>,
  // Middle deck
  <rect key="middle" x="84" y="250" width="232" height="14" rx="3" className={board} strokeWidth="2" />,
  // Lower braces
  <g key="lower" className={tube} strokeWidth="5" strokeLinecap="round">
    <path d="M100 268 300 380" />
    <path d="M300 268 100 380" />
  </g>,
  // Left standard
  <g key="left" className={tube} strokeWidth="8" strokeLinecap="round">
    <path d="M100 40V384" />
    <path d="M80 388H120" />
  </g>,
]

function Piece({ index, collapse, children }) {
  // Each piece starts to go a little after the one before it
  const local = useTransform(collapse, (amount) => clamp(amount * 1.7 - index * 0.1))
  const spin = index % 2 === 0 ? -1 : 1
  const x = useTransform(local, (amount) => -amount * (260 + index * 30))
  const y = useTransform(local, (amount) => amount * amount * 340)
  const rotate = useTransform(local, (amount) => spin * amount * (24 + index * 8))
  const opacity = useTransform(local, (amount) => 1 - amount ** 3)
  return <motion.g style={{ x, y, rotate, opacity }}>{children}</motion.g>
}

// A scaffold tower with a ladder. `collapse` is a motion value from 0 (standing) to 1 (gone).
export function Scaffold({ collapse, className = '' }) {
  return (
    <svg viewBox="0 0 400 400" className={`overflow-visible ${className}`} aria-hidden>
      {pieces.map((piece, index) => (
        <Piece key={piece.key} index={index} collapse={collapse}>
          {piece}
        </Piece>
      ))}
    </svg>
  )
}
