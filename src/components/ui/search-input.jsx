"use client"

import { Search, X } from "lucide-react"
import { useState } from "react"

/**
 * SearchInput component for filtering data
 */
export default function SearchInput({ value, onChange, placeholder = "Buscar...", className = "", onClear, ...props }) {
  const [isFocused, setIsFocused] = useState(false)

  const handleClear = () => {
    onChange("")
    if (onClear) onClear()
  }

  return (
    <div className={`relative flex items-center ${className} ${isFocused ? "ring-2 ring-blue-500" : ""}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={18} className="text-gray-400" aria-hidden="true" />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md 
          focus:outline-none focus:ring-0 focus:border-gray-300 text-gray-900"
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />

      {value && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={handleClear}
          aria-label="Limpiar búsqueda"
        >
          <X size={18} className="text-gray-400 hover:text-gray-600" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
