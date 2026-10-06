import { displayType } from '../ui.js'

export function SectionHeading({ title, body, className = '' }) {
  return (
    <div className={className}>
      <h2 className={`text-2xl text-balance md:text-3xl ${displayType}`}>{title}</h2>
      {body ? <p className="mt-2 max-w-xl text-lg text-pretty text-neutral-600">{body}</p> : null}
    </div>
  )
}
