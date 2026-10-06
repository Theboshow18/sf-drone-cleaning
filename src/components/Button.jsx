import { motion } from 'framer-motion'

const variants = {
  primary: 'bg-neutral-900 text-neutral-0 hover:bg-neutral-800 hover:shadow-mark',
  secondary:
    'border border-neutral-800 text-neutral-900 hover:bg-neutral-800 hover:text-neutral-0',
}

const sizes = {
  md: 'min-h-6 px-3',
  sm: 'min-h-5 px-2',
}

// Renders a link when given `href`, otherwise a button
export function Button({
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  children,
  ...props
}) {
  const Component = href ? motion.a : motion.button
  const elementProps = href ? { href } : { type: 'button' }
  return (
    <Component
      {...elementProps}
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center rounded-control text-center font-sans text-base font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      {...props}
    >
      {children}
    </Component>
  )
}
