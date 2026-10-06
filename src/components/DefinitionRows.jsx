export function DefinitionRows({ items }) {
  return (
    <dl>
      {items.map((item) => (
        <div key={item.term} className="grid gap-x-3 border-t border-neutral-400 py-2 sm:grid-cols-2">
          <dt className="font-semibold">{item.term}</dt>
          <dd className="text-neutral-600">{item.detail}</dd>
        </div>
      ))}
    </dl>
  )
}
