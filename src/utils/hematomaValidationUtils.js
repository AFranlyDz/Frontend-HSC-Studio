/**
 * Validaciones específicas para campos de hematoma subdural
 */

export const validateScaleRange = (value, min, max, scaleName) => {
  if (value === "" || value === null || value === undefined) {
    return {
      isValid: false,
      error: `${scaleName} es requerida`,
    }
  }

  const numericValue = Number(value)

  if (isNaN(numericValue)) {
    return {
      isValid: false,
      error: `${scaleName} debe ser un número válido`,
    }
  }

  if (!Number.isInteger(numericValue)) {
    return {
      isValid: false,
      error: `${scaleName} debe ser un número entero`,
    }
  }

  if (numericValue < min || numericValue > max) {
    return {
      isValid: false,
      error: `${scaleName} debe estar entre ${min} y ${max}`,
    }
  }

  return {
    isValid: true,
    error: null,
  }
}

export const validateMeasurement = (value, fieldName) => {
  if (value === "" || value === null || value === undefined) {
    return {
      isValid: true, // Las mediciones pueden ser opcionales
      error: null,
    }
  }

  const numericValue = Number(value)

  if (isNaN(numericValue)) {
    return {
      isValid: false,
      error: `${fieldName} debe ser un número válido`,
    }
  }

  if (numericValue < 0) {
    return {
      isValid: false,
      error: `${fieldName} debe ser 0 o superior`,
    }
  }

  return {
    isValid: true,
    error: null,
  }
}

// Filtrar entrada para campos numéricos
export const filterNumericInput = (value, allowDecimals = true) => {
  if (allowDecimals) {
    return value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1")
  } else {
    return value.replace(/[^0-9]/g, "")
  }
}

// Opciones para los campos de selección
export const LOCALIZACION_OPTIONS = [
  { value: 0, label: "Derecho" },
  { value: 1, label: "Izquierdo" },
]

export const METODO_LECTURA_OPTIONS = [
  { value: false, label: "Manual" },
  { value: true, label: "Automático" },
]

// Opciones iniciales para topografía (se puede expandir)
export const TOPOGRAFIA_OPTIONS = [
  "Frontal",
  "Parietal",
  "Temporal",
  "Occipital",
  "Frontoparietal",
  "Temporoparietal",
  "Fronto-temporo-parietal",
]
