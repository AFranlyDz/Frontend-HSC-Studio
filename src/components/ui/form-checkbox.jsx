import { forwardRef } from "react"

/**
 * FormCheckbox component for consistent checkbox inputs
 */
const FormCheckbox = forwardRef(({ label, name, error, className = "", required = false, ...props }, ref) => {
  const id = `field-${name}`
  const errorId = `${id}-error`

  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex items-center">
        <input
          ref={ref}
          id={id}
          name={name}
          type="checkbox"
          className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : undefined}
          required={required}
          {...props}
        />
        <label htmlFor={id} className="ml-2 block text-sm text-gray-900">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>

      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
})

FormCheckbox.displayName = "FormCheckbox"

export default FormCheckbox
