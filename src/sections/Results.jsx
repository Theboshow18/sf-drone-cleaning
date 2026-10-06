import { useRef } from 'react'
import { motion, useTransform } from 'framer-motion'
import { BeforeAfter } from '../components/BeforeAfter.jsx'
import { SectionHeading } from '../components/SectionHeading.jsx'
import { company } from '../content.js'
import { clamp, useScene } from '../story/story.js'
import { asset, shell, textLink } from '../ui.js'

// The drone sweeps across the comparison between these points of the scene
const START = 0.12
const END = 0.88

const sides = {
  before: {
    panel: 'border-neutral-400 bg-neutral-200',
    title: 'Placeholder: before photo',
    note: 'A photo of the glass before cleaning.',
  },
  after: {
    panel: 'border-primary-500 bg-primary-100',
    title: 'Placeholder: after photo',
    note: 'The same glass once the drone has cleaned it.',
  },
}

function Side({ side, place }) {
  const { panel, title, note } = sides[side]
  return (
    <div className={`absolute inset-0 rounded-card border-2 border-dashed ${panel}`}>
      {side === 'before' ? (
        <div className="absolute inset-0 bg-grime-500/30" style={{ backgroundImage: `url(${asset('grime.svg')})` }} />
      ) : null}
      <div className={`absolute flex flex-col items-center justify-center gap-1 p-2 text-center ${place}`}>
        <p className="font-sans text-sm font-medium text-neutral-900">{title}</p>
        <p className="text-sm text-neutral-600">{note}</p>
      </div>
    </div>
  )
}

// The comparison the drone draws: clean glass behind it, dirty glass ahead.
// `swept` is a motion value from 0 to 1. On small screens the sweep runs downwards.
function SweptCompare({ swept, vertical, boxRef }) {
  const axis = vertical ? 'y' : 'x'
  const windowShift = useTransform(swept, (amount) => `${-(1 - amount) * 100}%`)
  const contentShift = useTransform(swept, (amount) => `${(1 - amount) * 100}%`)
  const edge = useTransform(swept, (amount) => `${amount * 100}%`)
  return (
    <div
      ref={boxRef}
      role="group"
      aria-label="Before and after comparison, waiting for photos"
      className="relative aspect-square overflow-hidden rounded-card sm:aspect-video"
    >
      <Side
        side="before"
        place={vertical ? 'inset-x-0 bottom-0 h-1/2' : 'inset-y-0 right-0 w-1/2'}
      />
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-card will-change-transform"
        style={{ [axis]: windowShift }}
      >
        <motion.div className="absolute inset-0 will-change-transform" style={{ [axis]: contentShift }}>
          <Side side="after" place={vertical ? 'inset-x-0 top-0 h-1/2' : 'inset-y-0 left-0 w-1/2'} />
        </motion.div>
      </motion.div>
      <motion.div className="absolute inset-0 will-change-transform" style={{ [axis]: edge }}>
        <div
          className={`absolute bg-neutral-0 ${vertical ? 'inset-x-0 top-0 h-0.5' : 'inset-y-0 left-0 w-0.5'}`}
        />
      </motion.div>
    </div>
  )
}

export function Results() {
  const box = useRef(null)
  const scene = useScene({
    order: 5,
    pin: 130,
    pose: (progress, { size, compact }) => {
      const rect = box.current?.getBoundingClientRect()
      if (!rect) return null
      const amount = clamp((progress - START) / (END - START))
      const spray = amount > 0 && amount < 1
      // The drone is the divider: it rides the line between clean and dirty
      return compact
        ? { x: 0, y: rect.top + amount * rect.height - size * 0.45, spray }
        : { x: rect.left + amount * rect.width, y: rect.top + size * 0.1, spray }
    },
  })
  const swept = useTransform(scene.progress, (value) => clamp((value - START) / (END - START)))

  return (
    <section id="results" ref={scene.ref} style={scene.sectionStyle} className="scroll-mt-10">
      <div className={scene.stageClass} style={scene.stageStyle}>
        <div className={`${shell} grid gap-6 lg:grid-cols-12 ${scene.pinned ? '' : 'py-8 md:py-12'}`}>
          <div className="lg:col-span-4">
            <SectionHeading
              title="Before and after"
              body="Every job ends with a report: before-and-after photos and video documentation."
            />
            <p className="mt-3">
              <a href={company.videoUrl} target="_blank" rel="noreferrer" className={textLink}>
                Watch the video demonstration
              </a>
            </p>
          </div>
          <div className="lg:col-span-8">
            {scene.mode === 'off' ? (
              <BeforeAfter />
            ) : (
              <SweptCompare swept={swept} vertical={scene.mode === 'compact'} boxRef={box} />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
