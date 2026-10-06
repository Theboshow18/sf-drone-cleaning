import { motion } from 'framer-motion'

// A subtle one-time fade as a block scrolls into view
export function Reveal({ as = 'div', delay = 0, className, children, ...props }) {
  const Component = motion[as]
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      {...props}
    >
      {children}
    </Component>
  )
}
