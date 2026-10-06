import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../components/Card.jsx'
import { DefinitionRows } from '../components/DefinitionRows.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { SectionHeading } from '../components/SectionHeading.jsx'
import { packages, schedules, serviceModel } from '../content.js'
import { clamp, useScene } from '../story/story.js'
import { asset, displayType, sectionSpace, shell } from '../ui.js'

// The drone gives each card an equal share of the scene, starting here
const FIRST = 0.1
const SHARE = 0.26
const snap = { type: 'spring', stiffness: 320, damping: 18 }

function PackageCard({ item, clean }) {
  return (
    <motion.div className="relative h-full" initial={false} animate={{ y: clean ? -12 : 0 }} transition={snap}>
      <motion.div
        className="absolute inset-0 rounded-card shadow-lift"
        initial={false}
        animate={{ opacity: clean ? 1 : 0 }}
      />
      <Card className="relative h-full">
        <h3 className={`text-xl ${displayType}`}>{item.name}</h3>
        <ul className="mt-2 text-neutral-600">
          {item.points.map((point) => (
            <li key={point} className="border-t border-neutral-200 py-1">
              {point}
            </li>
          ))}
        </ul>
      </Card>
      {/* The film of dirt that the drone washes off */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-card bg-grime-500/45"
        style={{ backgroundImage: `url(${asset('grime.svg')})` }}
        initial={false}
        animate={{ opacity: clean ? 0 : 1 }}
        transition={{ duration: 0.25 }}
      />
    </motion.div>
  )
}

export function Services() {
  const cards = useRef([])
  const stage = useRef(null)
  const cleanedRef = useRef(0)
  const [cleaned, setCleaned] = useState(0)
  const report = (count) => {
    if (count !== cleanedRef.current) {
      cleanedRef.current = count
      setCleaned(count)
    }
  }

  const scene = useScene({
    order: 2,
    pin: 150,
    pose: (progress, { size, vh, compact }) => {
      const rects = cards.current.map((card) => card.getBoundingClientRect())
      if (compact) {
        // Small screens: a card is washed as it rises past the middle of the screen
        const line = vh * 0.55
        const count = rects.filter((rect) => rect.top < line).length
        report(count)
        const next = rects[count]
        if (!next) return null
        return { x: 0, y: clamp(next.top - 24, 0, line), spray: next.top < vh * 0.8 }
      }
      const turn = (progress - FIRST) / SHARE
      if (turn >= rects.length) {
        report(rects.length)
        const rect = stage.current.getBoundingClientRect()
        return { x: rect.right - size * 0.7, y: rect.top + size * 0.45 }
      }
      const index = clamp(Math.floor(turn), 0, rects.length - 1)
      const within = clamp(turn - index)
      report(turn < 0 ? 0 : index + (within > 0.6 ? 1 : 0))
      const rect = rects[index]
      return {
        x: rect.left + rect.width / 2,
        y: rect.top - size * 0.3,
        spray: within > 0.3 && within < 0.72,
      }
    },
  })
  const shown = scene.mode === 'off' ? packages.length : cleaned

  return (
    <div id="services" className="scroll-mt-10">
      <section ref={scene.ref} style={scene.sectionStyle}>
        <div ref={stage} className={scene.stageClass} style={scene.stageStyle}>
          <div className={`${shell} ${scene.pinned ? '' : 'pt-8 md:pt-12'}`}>
            <SectionHeading
              title="Window and façade cleaning, by drone"
              body="For residential and commercial buildings, as a one-time clean or on a maintenance schedule."
            />
            <ul className="mt-8 grid gap-3 md:grid-cols-3">
              {packages.map((item, index) => (
                <li key={item.name} ref={(el) => {
                    cards.current[index] = el
                  }}>
                  <PackageCard item={item} clean={index < shown} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <div className={`${shell} ${sectionSpace} grid gap-6 lg:grid-cols-2`}>
        <Reveal>
          <h3 className="text-xl font-semibold">How often</h3>
          <p className="mt-1 mb-2 text-neutral-600">
            We offer {serviceModel.join(' and ').toLowerCase()}. Typical schedules:
          </p>
          <DefinitionRows items={schedules} />
        </Reveal>
        <Reveal>
          <h3 className="text-xl font-semibold">What we clean</h3>
          <p className="mt-1 text-neutral-600">
            All types of windows, including single and double-hung, casement, picture, bay and
            bow, sliding, and specialty shape windows. Our systems switch between window and
            façade cleaning.
          </p>
          <p className="mt-2 text-neutral-600">
            Pricing is based on the number and size of the windows, the level of difficulty
            involved, and the frequency of service.
          </p>
        </Reveal>
      </div>
    </div>
  )
}
