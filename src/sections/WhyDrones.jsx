import { useRef } from 'react'
import { motion, useTransform } from 'framer-motion'
import { Card } from '../components/Card.jsx'
import { DefinitionRows } from '../components/DefinitionRows.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { Scaffold } from '../components/Scaffold.jsx'
import { SectionHeading } from '../components/SectionHeading.jsx'
import { comparison, reasons, specs } from '../content.js'
import { clamp, lerp, useScene } from '../story/story.js'
import { asset, sectionSpace, shell } from '../ui.js'

// The drone crosses the scaffold between these points of the scene
const ENTER = 0.12
const CLEAR = 0.55

function Benefit({ reason, index, progress }) {
  const arrive = useTransform(progress, (value) => clamp((value - 0.3 - index * 0.12) / 0.18))
  const x = useTransform(arrive, (amount) => (1 - amount) * 48)
  return (
    <motion.li className="border-t border-neutral-400 py-2" style={{ x, opacity: arrive }}>
      <h3 className="text-xl font-semibold">{reason.title}</h3>
      <p className="mt-1 text-neutral-600">{reason.body}</p>
    </motion.li>
  )
}

export function WhyDrones() {
  const figure = useRef(null)
  const scene = useScene({
    order: 3,
    pin: 140,
    pose: (progress, { size, vh }) => {
      const rect = figure.current?.getBoundingClientRect()
      if (!rect) return null
      const mid = rect.top + rect.height / 2
      // Flies in from the right, straight through the scaffold, then rises clear of it
      const across = clamp((progress - ENTER) / (CLEAR - ENTER))
      const rise = clamp((progress - CLEAR) / 0.2)
      return {
        x: lerp(rect.right + size * 0.6, rect.left + size * 0.45, across),
        y: lerp(progress < ENTER ? Math.min(mid, vh * 0.4) : mid, rect.top + size * 0.2, rise),
      }
    },
  })
  const collapse = useTransform(scene.progress, (value) =>
    clamp((value - ENTER - 0.06) / (CLEAR - ENTER)),
  )

  return (
    <div id="why-drones" className="scroll-mt-10">
      <section ref={scene.ref} style={scene.sectionStyle}>
        <div className={scene.stageClass} style={scene.stageStyle}>
          <div className={`${shell} ${scene.pinned ? '' : 'pt-8 md:pt-12'}`}>
            <SectionHeading
              title="Why drones"
              body="Exterior cleaning today is expensive, time-consuming and disruptive. We replace traditional access methods with drone-based cleaning."
            />
            <div className="mt-4 grid gap-6 lg:grid-cols-12 lg:items-center">
              <figure ref={figure} className="relative lg:col-span-4">
                <img
                  src={asset('images/glass-facade.jpg')}
                  alt="The glass façade of a commercial building reflecting sky and clouds"
                  width="1114"
                  height="622"
                  loading="lazy"
                  className="aspect-video w-full rounded-card object-cover lg:aspect-square"
                />
                {/* The traditional way, standing in front of the glass until the drone arrives */}
                {scene.mode === 'off' ? null : (
                  <Scaffold collapse={collapse} className="absolute inset-0 m-auto h-full" />
                )}
              </figure>
              <ul className="grid gap-x-4 sm:grid-cols-2 lg:col-span-8">
                {reasons.map((reason, index) => (
                  <Benefit key={reason.title} reason={reason} index={index} progress={scene.progress} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <div className={`${shell} ${sectionSpace}`}>
        <div className="grid gap-3 md:grid-cols-2">
          {[comparison.traditional, comparison.drone].map((column, index) => (
            <Reveal key={column.title} delay={index * 0.08}>
              <Card tone={index === 1 ? 'sky' : 'neutral'} className="h-full">
                <h3 className="text-xl font-semibold">{column.title}</h3>
                <ul className="mt-2 text-neutral-600">
                  {column.points.map((point) => (
                    <li key={point} className="border-t border-neutral-200 py-1">
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8">
          <h3 className="mb-2 text-xl font-semibold">The numbers</h3>
          <DefinitionRows items={specs} />
        </Reveal>
      </div>
    </div>
  )
}
