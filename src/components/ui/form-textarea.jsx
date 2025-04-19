import { forwardRef } from "react"
import FormField from "./form-field"

/**
 * FormTextarea component for consistent textarea inputs
 */
const FormTextarea = forwardRef(({ label, name, error, className = "", required = false, rows = 3, ...props }, ref) => {
  return (
    <FormField label={label} name={name} error={error} className={className} required={required}>
      <textarea
        ref={ref}
        id={`field-${name}`}
        name={name}
        rows={rows}
        className={`w-full px-3 py-2 border ${error ? "border-red-500" : "border-gray-300"} 
          rounded-md shadow-sm focus:outline-none text-gray-900
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `field-${name}-error` : undefined}
        required={required}
        {...props}
      />
    </FormField>
  )
})

FormTextarea.displayName = "FormTextarea"

export default FormTextarea
