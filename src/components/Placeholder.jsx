const tones = {
  neutral: 'border-neutral-400 bg-neutral-100',
  sky: 'border-primary-500 bg-primary-100',
}

// A clearly marked slot for a photo or content that the existing site did not have
export function Placeholder({ title, note, tone = 'neutral', className = '' }) {
  return (
    <div
      role="img"
      aria-label={`Placeholder: ${title}`}
      className={`flex flex-col items-center justify-center gap-1 rounded-card border-2 border-dashed p-3 text-center ${tones[tone]} ${className}`}
    >
      <p className="font-sans text-sm font-medium text-neutral-900">Placeholder: {title}</p>
      {note ? <p className="max-w-xs text-sm text-neutral-600">{note}</p> : null}
    </div>
  )
}
