const tones = {
  neutral: 'border border-neutral-200 bg-neutral-0',
  sky: 'bg-primary-50',
}

// Groups related content. Cards do not nest.
export function Card({ as: Component = 'div', tone = 'neutral', className = '', children, ...props }) {
  return (
    <Component className={`rounded-card p-3 md:p-4 ${tones[tone]} ${className}`} {...props}>
      {children}
    </Component>
  )
}
