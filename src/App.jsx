import { MotionConfig } from 'framer-motion'
import { Button } from './components/Button.jsx'
import { company, navLinks } from './content.js'
import { Contact } from './sections/Contact.jsx'
import { Faq } from './sections/Faq.jsx'
import { Hero } from './sections/Hero.jsx'
import { HowItWorks } from './sections/HowItWorks.jsx'
import { Results } from './sections/Results.jsx'
import { ServiceArea } from './sections/ServiceArea.jsx'
import { Services } from './sections/Services.jsx'
import { WhyDrones } from './sections/WhyDrones.jsx'
import { Backdrop } from './story/Backdrop.jsx'
import { DroneDirector } from './story/DroneDirector.jsx'
import { StoryProvider } from './story/StoryProvider.jsx'
import { useStory } from './story/story.js'
import { asset, shell } from './ui.js'

const year = new Date().getFullYear()

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-neutral-0">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-2 py-1 md:px-4">
        <a href="#top" className="shrink-0">
          <img
            src={asset('images/logo.png')}
            alt={company.name}
            width="928"
            height="449"
            className="h-7 w-auto"
          />
        </a>
        <nav className="hidden items-center gap-4 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-sans text-neutral-600 decoration-accent-500 decoration-2 underline-offset-8 transition-colors hover:text-neutral-900 hover:underline"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={company.phoneHref}
            className="hidden font-sans font-medium tabular-nums decoration-accent-500 decoration-2 underline-offset-8 hover:underline sm:block"
          >
            {company.phoneDisplay}
          </a>
          <Button href="#contact" size="sm">
            Get a Free Quote
          </Button>
        </div>
      </div>
    </header>
  )
}

// Kept to its original single row and height: the page ends on the drone landing
// beside the quote button, and a taller footer would push that scene up the screen.
function Footer() {
  const footerLink = 'decoration-accent-500 decoration-2 underline-offset-4 hover:underline'
  return (
    <footer className="border-t border-neutral-900 bg-neutral-900 font-sans text-neutral-0">
      <div className={`${shell} flex flex-wrap items-center justify-between gap-2 py-4 text-sm`}>
        <p className="text-neutral-200">
          Copyright © {year} {company.name}. All rights reserved.
        </p>
        <nav className="flex flex-wrap gap-3">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className={footerLink}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}

// The page is the glass face of a high-rise, and scrolling takes the drone down it.
// Each section is a scene that tells the drone what to do while it is on screen.
function Page() {
  const { mode } = useStory()
  return (
    <>
      <Backdrop />
      <Header />
      {/* Remounts when the story mode changes, so each scene measures itself afresh */}
      <main key={mode} className="overflow-x-clip">
        <Hero />
        <Services />
        <WhyDrones />
        <HowItWorks />
        <Results />
        <ServiceArea />
        <Faq />
        <Contact />
      </main>
      <Footer />
      {mode === 'off' ? null : <DroneDirector />}
    </>
  )
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <StoryProvider>
        <Page />
      </StoryProvider>
    </MotionConfig>
  )
}

export default App
