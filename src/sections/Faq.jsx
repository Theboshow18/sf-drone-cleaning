import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { SectionHeading } from '../components/SectionHeading.jsx'
import { company, faqs } from '../content.js'
import { useScene } from '../story/story.js'
import { sectionSpace, shell, textLink } from '../ui.js'

export function Faq() {
  const list = useRef(null)
  const items = useRef([])
  const cleanedRef = useRef(0)
  const [cleaned, setCleaned] = useState(0)

  const scene = useScene({
    order: 6,
    pose: (_, { size, vh }) => {
      const rect = list.current?.getBoundingClientRect()
      if (!rect) return null
      // A question sharpens as it rises past the line the drone is working along
      const line = vh * 0.62
      const count = items.current.filter((item) => item.getBoundingClientRect().top < line).length
      if (count !== cleanedRef.current) {
        cleanedRef.current = count
        setCleaned(count)
      }
      // Quick side-to-side passes, timed by the scroll itself
      const sweep = 0.5 + 0.4 * Math.sin(window.scrollY / 70)
      return {
        x: rect.left + rect.width * sweep,
        y: line - size * 0.5,
        spray: rect.top < line && rect.bottom > line,
      }
    },
  })
  const shown = scene.mode === 'off' ? faqs.length : cleaned

  return (
    <section id="faq" ref={scene.ref} className={`${shell} ${sectionSpace} grid scroll-mt-10 gap-6 lg:grid-cols-12`}>
      <div className="lg:col-span-4">
        <SectionHeading title="Frequently asked questions" />
        <p className="mt-2 text-neutral-600">
          Please reach us at{' '}
          <a href={`mailto:${company.email}`} className={`break-all ${textLink}`}>
            {company.email}
          </a>{' '}
          if you cannot find an answer to your question.
        </p>
      </div>
      <div ref={list} className="lg:col-span-8">
        {faqs.map((faq, index) => (
          <motion.details
            key={faq.question}
            ref={(el) => {
              items.current[index] = el
            }}
            className="group border-t border-neutral-400"
            initial={false}
            animate={
              index < shown
                ? { filter: 'blur(0px)', opacity: 1 }
                : { filter: 'blur(4px)', opacity: 0.55 }
            }
            transition={{ duration: 0.35 }}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-2 font-sans text-lg font-medium decoration-accent-500 decoration-2 underline-offset-4 hover:underline">
              {faq.question}
              <svg
                viewBox="0 0 16 16"
                aria-hidden
                className="size-2 shrink-0 fill-none stroke-neutral-900 group-open:rotate-180"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6l5 5 5-5" />
              </svg>
            </summary>
            <p className="max-w-xl pb-3 text-neutral-600">{faq.answer}</p>
          </motion.details>
        ))}
      </div>
    </section>
  )
}
