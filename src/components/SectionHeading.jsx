import { displayType } from '../ui.js'

// `bodyClass` can reserve the lede's height, so the layout below it never moves
export function SectionHeading({ title, body, bodyClass = '', className = '' }) {
  return (
    <div className={className}>
      <h2 className={`text-2xl text-balance md:text-3xl ${displayType}`}>{title}</h2>
      {body ? (
        <p className={`mt-2 max-w-xl text-lg text-pretty text-neutral-600 ${bodyClass}`}>{body}</p>
      ) : null}
    </div>
  )
}
