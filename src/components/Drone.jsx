import { motion } from 'framer-motion'

// Rotor positions as percentages of the drone's box, rear pair first so the front pair overlaps
const rotors = [
  { left: '26%', top: '24%', width: '28%', phase: 40 },
  { left: '74%', top: '24%', width: '28%', phase: 110 },
  { left: '11%', top: '39%', width: '34%', phase: 0 },
  { left: '89%', top: '39%', width: '34%', phase: 75 },
]

// Mist droplets: sideways drift, fall distance, duration and delay, in units of the drone's width
const droplets = Array.from({ length: 10 }, (_, index) => ({
  drift: (((index * 37) % 11) - 5) * 0.022,
  fall: 0.3 + ((index * 53) % 7) * 0.03,
  duration: 0.6 + ((index * 29) % 5) * 0.07,
  delay: index * 0.07,
}))

function Rotor({ left, top, width, phase, angle }) {
  return (
    <div
      className="absolute aspect-square -translate-x-1/2 -translate-y-1/2"
      style={{ left, top, width }}
    >
      {/* Flattened so the spinning disc reads as seen from slightly above */}
      <div className="absolute inset-0" style={{ transform: 'scaleY(0.24)' }}>
        <div className="absolute inset-0 rounded-full bg-neutral-800/15" />
        <div className="absolute inset-0" style={{ transform: `rotate(${phase}deg)` }}>
          <motion.div className="absolute inset-0 will-change-transform" style={{ rotate: angle }}>
            <div className="absolute inset-x-0 top-1/2 h-1/6 -translate-y-1/2 rounded-full bg-neutral-900/70" />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// A fine cone of water under the nozzle. Kept faint so it never fights with text.
function Mist({ size, count }) {
  return (
    <div className="absolute top-full left-1/2" aria-hidden>
      <div
        className="absolute top-0 left-0 -translate-x-1/2 bg-linear-to-b from-primary-300/60 to-primary-200/0"
        style={{
          width: size * 0.5,
          height: size * 0.42,
          clipPath: 'polygon(46% 0, 54% 0, 100% 100%, 0 100%)',
        }}
      />
      {droplets.slice(0, count).map((droplet, index) => (
        <motion.span
          key={index}
          className="absolute top-0 left-0 size-0.5 rounded-full bg-primary-300"
          initial={{ opacity: 0 }}
          animate={{
            x: [0, droplet.drift * size * 4],
            y: [0, droplet.fall * size],
            opacity: [0, 0.6, 0],
            scale: [0.4, 1],
          }}
          transition={{
            duration: droplet.duration,
            delay: droplet.delay,
            ease: 'easeOut',
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  )
}

// The quadcopter. `size` is its width in pixels. `rotorAngle` (a motion value in
// degrees) spins the rotors; `mistOpacity` (a motion value) shows the spray.
export function Drone({ size, rotorAngle, mistOpacity, droplets: count = 10 }) {
  return (
    <div className="relative" style={{ width: size, height: size * 0.75 }}>
      {/* Soft shadow cast on the glass behind */}
      <div
        className="absolute"
        style={{
          left: '8%',
          top: '34%',
          width: '100%',
          height: '70%',
          background:
            'radial-gradient(closest-side, color-mix(in srgb, var(--color-neutral-900) 22%, transparent), transparent)',
        }}
      />
      <svg viewBox="0 0 200 150" className="absolute inset-0 size-full overflow-visible" aria-hidden>
        {/* Rear arms and motors */}
        <g className="stroke-neutral-600" strokeWidth="5" strokeLinecap="round">
          <path d="M92 62 52 42" />
          <path d="M108 62 148 42" />
        </g>
        <g className="fill-neutral-600">
          <rect x="46" y="34" width="12" height="12" rx="3" />
          <rect x="142" y="34" width="12" height="12" rx="3" />
        </g>
        {/* Landing gear */}
        <g className="fill-none stroke-neutral-800" strokeWidth="4" strokeLinecap="round">
          <path d="M84 90 68 118" />
          <path d="M116 90 132 118" />
          <path d="M56 120H82" />
          <path d="M118 120H144" />
        </g>
        {/* Front arms and motors */}
        <g className="stroke-neutral-800" strokeWidth="7" strokeLinecap="round">
          <path d="M84 74 24 64" />
          <path d="M116 74 176 64" />
        </g>
        <g className="fill-neutral-900">
          <rect x="14" y="54" width="16" height="18" rx="4" />
          <rect x="170" y="54" width="16" height="18" rx="4" />
        </g>
        <circle cx="22" cy="68" r="2" className="fill-accent-500" />
        <circle cx="178" cy="68" r="2" className="fill-primary-300" />
        {/* Body: a faceted shell, after the drone in the company logo */}
        <path d="M100 46 128 58V84L100 100 72 84V58Z" className="fill-neutral-800" />
        <path d="M100 46 128 58 100 70 72 58Z" className="fill-neutral-600" />
        <path d="M100 70V100L72 84V58Z" className="fill-neutral-900" />
        <path
          d="M100 46 128 58V84L100 100 72 84V58Z"
          className="fill-none stroke-neutral-900"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Sensor */}
        <circle cx="113" cy="80" r="5" className="fill-neutral-900" />
        <circle cx="113" cy="80" r="2.5" className="fill-primary-300" />
        {/* Spray lance and nozzle */}
        <path d="M100 98V136" className="stroke-neutral-900" strokeWidth="4" strokeLinecap="round" />
        <rect x="95" y="104" width="10" height="8" rx="2" className="fill-accent-500" />
        <path d="M95 136H105L108 148H92Z" className="fill-accent-500" />
      </svg>
      {rotors.map((rotor) => (
        <Rotor key={`${rotor.left}-${rotor.top}`} {...rotor} angle={rotorAngle} />
      ))}
      {mistOpacity ? (
        <motion.div className="absolute inset-0" style={{ opacity: mistOpacity }}>
          <Mist size={size} count={count} />
        </motion.div>
      ) : null}
    </div>
  )
}
