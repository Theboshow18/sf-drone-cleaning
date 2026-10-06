import { useId } from 'react'

// A labelled text input or textarea, with an optional hint and error message
export function Field({ label, hint, error, multiline = false, className = '', ...props }) {
  const id = useId()
  const Control = multiline ? 'textarea' : 'input'
  const messageId = error || hint ? `${id}-message` : undefined
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="font-sans text-base font-medium">
        {label}
      </label>
      <Control
        id={id}
        aria-describedby={messageId}
        aria-invalid={error ? true : undefined}
        className={`w-full rounded-control border border-neutral-400 bg-neutral-50 px-2 font-sans text-base text-neutral-900 transition-colors hover:border-neutral-800 focus:bg-neutral-0 aria-invalid:border-2 aria-invalid:border-neutral-900 ${multiline ? 'min-h-16 py-1' : 'min-h-6'}`}
        {...props}
      />
      {error ? (
        <p id={messageId} className="font-sans text-sm font-medium text-neutral-900">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="text-sm text-neutral-600">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
