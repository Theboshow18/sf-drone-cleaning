// Shared layout and type classes

// Page gutter. On small screens the right side is wider, leaving a lane for the drone.
export const shell = 'mx-auto w-full max-w-7xl pr-7 pl-2 md:px-4'
export const sectionSpace = 'py-8 md:py-12'
// The detail that follows a pinned scene sits closer to it than a new section would
export const followSpace = 'pt-4 pb-8 md:pt-6 md:pb-12'
// Headings: light and geometric, in the slate of the logo
export const displayType = 'font-sans font-normal tracking-tight text-neutral-800'
// Sub-headings, labels and other interface text
export const labelType = 'font-sans font-medium'
export const textLink =
  'font-sans font-medium text-neutral-900 underline decoration-neutral-400 decoration-2 underline-offset-4 transition-colors hover:decoration-accent-500'

// Path to a file in /public that works wherever the site is hosted, including a sub-folder
export const asset = (path) => `${import.meta.env.BASE_URL}${path}`
