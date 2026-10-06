import { Placeholder } from '../components/Placeholder.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { SectionHeading } from '../components/SectionHeading.jsx'
import { company } from '../content.js'
import { sectionSpace, shell } from '../ui.js'

export function ServiceArea() {
  return (
    <section id="service-area" className={`${shell} ${sectionSpace} grid scroll-mt-10 gap-6 lg:grid-cols-12`}>
      <Reveal className="lg:col-span-5">
        <SectionHeading
          title="Based in Toronto"
          body={`${company.name} is a Toronto-based company serving high-rise and commercial buildings.`}
        />
        <address className="mt-3 text-neutral-600 not-italic">
          {company.address.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
      </Reveal>
      <Reveal className="lg:col-span-7">
        <Placeholder
          title="service area"
          note="The existing site doesn't list the areas served. Add a map or the neighbourhoods and cities you cover."
          className="h-full min-h-30"
        />
      </Reveal>
    </section>
  )
}
