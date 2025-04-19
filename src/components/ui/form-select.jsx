import { forwardRef } from "react"
import FormField from "./form-field"

/**
 * FormSelect component for consistent select inputs
 */
const FormSelect = forwardRef(
  ({ label, name, options = [], error, className = "", required = false, ...props }, ref) => {
    return (
      <FormField label={label} name={name} error={error} className={className} required={required}>
        <select
          ref={ref}
          id={`field-${name}`}
          name={name}
          className={`w-full px-3 py-2 border ${error ? "border-red-500" : "border-gray-300"} 
          rounded-md shadow-sm focus:outline-none text-gray-900
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `field-${name}-error` : undefined}
          required={required}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value.toString()} value={option.value.toString()}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>
    )
  },
)

FormSelect.displayName = "FormSelect"

export default FormSelect
