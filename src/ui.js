// Shared layout and type classes

// Page gutter. On small screens the right side is wider, leaving a lane for the drone.
export const shell = 'mx-auto w-full max-w-7xl pr-7 pl-2 md:px-4'
export const sectionSpace = 'py-8 md:py-12'
export const displayType = 'font-semibold font-stretch-expanded tracking-tight'
export const textLink =
  'font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-900'

// Path to a file in /public that works wherever the site is hosted, including a sub-folder
export const asset = (path) => `${import.meta.env.BASE_URL}${path}`
