import { useState } from 'react'

const sides = {
  before: {
    panel: 'border-neutral-400 bg-neutral-200',
    text: 'left-0',
    title: 'Placeholder: before photo',
    note: 'A photo of the glass before cleaning.',
  },
  after: {
    panel: 'border-primary-500 bg-primary-100',
    text: 'right-0',
    title: 'Placeholder: after photo',
    note: 'The same glass once the drone has cleaned it.',
  },
}

function Side({ side }) {
  const { panel, text, title, note } = sides[side]
  return (
    <div className={`absolute inset-0 rounded-card border-2 border-dashed ${panel}`}>
      <div
        className={`absolute inset-y-0 flex w-1/2 flex-col items-center justify-center gap-1 p-2 text-center ${text}`}
      >
        <p className="font-sans text-sm font-medium text-neutral-900">{title}</p>
        <p className="text-sm text-neutral-600">{note}</p>
      </div>
    </div>
  )
}

// A before/after comparison. Drag the handle, or use the arrow keys, to move the divide.
export function BeforeAfter() {
  const [split, setSplit] = useState(50)
  return (
    <div
      role="group"
      aria-label="Before and after comparison, waiting for photos"
      className="relative aspect-square overflow-hidden rounded-card focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary-700 sm:aspect-video"
    >
      <Side side="after" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
        <Side side="before" />
      </div>
      <div
        className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-neutral-900"
        style={{ left: `${split}%` }}
      >
        <span className="absolute top-1/2 left-1/2 size-5 -translate-1/2 rounded-full border-2 border-neutral-900 bg-neutral-0" />
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={split}
        onChange={(event) => setSplit(Number(event.target.value))}
        aria-label="Move the divide between the before and after photos"
        className="absolute inset-0 size-full cursor-ew-resize opacity-0"
      />
    </div>
  )
}
