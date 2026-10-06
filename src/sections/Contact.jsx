import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { Button } from '../components/Button.jsx'
import { Card } from '../components/Card.jsx'
import { Field } from '../components/Field.jsx'
import { SectionHeading } from '../components/SectionHeading.jsx'
import { company } from '../content.js'
import { clamp, lerp, smooth, useScene } from '../story/story.js'
import { sectionSpace, shell, textLink } from '../ui.js'

const quoteFields = [
  { name: 'name', label: 'Name', autoComplete: 'name', required: 'Enter your name so we know who to reply to.' },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    autoComplete: 'email',
    required: 'Enter your email address so we can send the quote.',
  },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel' },
  { name: 'address', label: 'Building address', autoComplete: 'street-address' },
]

function QuoteForm({ shine }) {
  const [errors, setErrors] = useState({})

  function handleSubmit(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const value = (name) => String(data.get(name) ?? '').trim()
    const nextErrors = {}
    for (const field of quoteFields) {
      if (field.required && !value(field.name)) nextErrors[field.name] = field.required
    }
    if (!nextErrors.email && !value('email').includes('@')) {
      nextErrors.email = 'Check the email address. It needs an @ sign.'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    const body = [
      `Name: ${value('name')}`,
      `Email: ${value('email')}`,
      `Phone: ${value('phone')}`,
      `Building address: ${value('address')}`,
      '',
      value('message'),
    ].join('\n')
    const subject = encodeURIComponent(`Quote request from ${value('name')}`)
    window.location.href = `mailto:${company.email}?subject=${subject}&body=${encodeURIComponent(body)}`
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
      {quoteFields.map(({ required: _required, ...field }) => (
        <Field key={field.name} error={errors[field.name]} {...field} />
      ))}
      <Field
        label="Message"
        name="message"
        multiline
        className="sm:col-span-2"
        hint={`Sending opens a ready-to-send email in your mail app, addressed to ${company.email}.`}
      />
      {/* The drone lands beside this button at the end of the page */}
      <div className="flex min-h-14 items-center sm:col-span-2">
        <span className="relative inline-flex overflow-hidden rounded-control">
          <Button type="submit" id="quote-submit">
            Get a Free Quote
          </Button>
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-linear-to-r from-neutral-0/0 via-neutral-0/90 to-neutral-0/0 opacity-0"
            animate={shine}
          />
        </span>
      </div>
    </form>
  )
}

export function Contact() {
  const landedRef = useRef(false)
  const [landed, setLanded] = useState(false)
  const shine = useAnimationControls()

  const scene = useScene({
    order: 7,
    offset: ['start 0.85', 'end end'],
    pose: (progress, { size, vh, compact }) => {
      const rect = document.getElementById('quote-submit')?.getBoundingClientRect()
      if (!rect) return null
      const isLanded = progress > 0.97
      if (isLanded !== landedRef.current) {
        landedRef.current = isLanded
        setLanded(isLanded)
      }
      // Comes down from above and touches down just to the right of the button
      const scale = compact ? 1 : lerp(1, 0.6, smooth(progress))
      const descent = 1 - smooth(clamp(progress / 0.95))
      return {
        x: rect.right + 32 + (size * scale) / 2 + descent * 80,
        y: rect.top + rect.height / 2 - 8 - descent * vh * 0.45,
        scale,
        landed: isLanded,
      }
    },
  })

  // The button gets its shine as the drone touches down
  useEffect(() => {
    if (landed) {
      shine.start({
        x: ['-120%', '420%'],
        opacity: [0, 1, 1, 0],
        transition: { duration: 0.9, ease: 'easeOut', delay: 0.3 },
      })
    }
  }, [landed, shine])

  return (
    <section
      id="contact"
      ref={scene.ref}
      className={`${shell} ${sectionSpace} grid scroll-mt-10 gap-6 lg:grid-cols-12`}
    >
      <div className="lg:col-span-5">
        <SectionHeading
          title="Get a free quote"
          body="Drop us a line and get your cleaning journey started."
        />
        <dl className="mt-4">
          <div className="border-t border-neutral-400 py-2">
            <dt className="text-sm text-neutral-600">Phone</dt>
            <dd>
              <a href={company.phoneHref} className={textLink}>
                {company.phoneDisplay}
              </a>
            </dd>
          </div>
          <div className="border-t border-neutral-400 py-2">
            <dt className="text-sm text-neutral-600">Email</dt>
            <dd>
              <a href={`mailto:${company.email}`} className={`break-all ${textLink}`}>
                {company.email}
              </a>
            </dd>
          </div>
          <div className="border-t border-neutral-400 py-2">
            <dt className="text-sm text-neutral-600">Address</dt>
            <dd>{company.address.join(', ')}</dd>
          </div>
        </dl>
        <p className="mt-2 text-neutral-600">
          Better yet, see us in person. Call to schedule an appointment at your convenience.
        </p>
      </div>
      <div className="lg:col-span-7">
        <Card>
          <QuoteForm shine={shine} />
        </Card>
      </div>
    </section>
  )
}
