import { forwardRef } from "react"

/**
 * FormField component for consistent form inputs with labels and error messages
 */
const FormField = forwardRef(
  ({ label, name, type = "text", error, className = "", required = false, children, ...props }, ref) => {
    const id = `field-${name}`
    const errorId = `${id}-error`

    return (
      <div className={`mb-4 ${className}`}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {children ? (
          children
        ) : (
          <input
            ref={ref}
            id={id}
            name={name}
            type={type}
            className={`w-full px-3 py-2 border ${error ? "border-red-500" : "border-gray-300"} 
            rounded-md shadow-sm focus:outline-none text-gray-900
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? errorId : undefined}
            required={required}
            {...props}
          />
        )}

        {error && (
          <p id={errorId} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    )
  },
)

FormField.displayName = "FormField"

export default FormField
