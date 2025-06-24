/**
 * Valida que un texto contenga solo letras y tenga al menos la longitud mínima
 * @param {string} value - El valor a validar
 * @param {number} minLength - Longitud mínima requerida (default: 2)
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateNameField = (value, minLength = 2) => {
  if (!value || typeof value !== "string") {
    return {
      isValid: false,
      error: "Este campo es requerido",
    }
  }

  const trimmedValue = value.trim()

  if (trimmedValue.length === 0) {
    return {
      isValid: false,
      error: "Este campo es requerido",
    }
  }

  if (trimmedValue.length < minLength) {
    return {
      isValid: false,
      error: `Debe tener al menos ${minLength} caracteres`,
    }
  }

  // Regex para permitir solo letras (incluye acentos, ñ, espacios, guiones y apostrofes)
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']+$/

  if (!nameRegex.test(trimmedValue)) {
    return {
      isValid: false,
      error: "Solo se permiten letras, espacios, guiones y apostrofes",
    }
  }

  return {
    isValid: true,
    error: null,
  }
}

/**
 * Valida que la edad esté en el rango permitido
 * @param {number|string} value - El valor de edad a validar
 * @param {number} min - Edad mínima (default: 0)
 * @param {number} max - Edad máxima (default: 121)
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateAge = (value, min = 0, max = 121) => {
  if (value === "" || value === null || value === undefined) {
    return {
      isValid: false,
      error: "La edad es requerida",
    }
  }

  const numericValue = Number(value)

  if (isNaN(numericValue)) {
    return {
      isValid: false,
      error: "La edad debe ser un número válido",
    }
  }

  if (!Number.isInteger(numericValue)) {
    return {
      isValid: false,
      error: "La edad debe ser un número entero",
    }
  }

  if (numericValue < min || numericValue > max) {
    return {
      isValid: false,
      error: `La edad debe estar entre ${min} y ${max} años`,
    }
  }

  return {
    isValid: true,
    error: null,
  }
}

/**
 * Filtra caracteres no válidos para campos de nombre en tiempo real
 * @param {string} value - El valor actual del input
 * @returns {string} - El valor filtrado
 */
export const filterNameInput = (value) => {
  // Permitir solo letras, espacios, acentos, ñ, guiones y apostrofes
  return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']/g, "")
}

/**
 * Filtra caracteres no válidos para campos de edad en tiempo real
 * @param {string} value - El valor actual del input
 * @returns {string} - El valor filtrado
 */
export const filterAgeInput = (value) => {
  // Permitir solo números
  return value.replace(/[^0-9]/g, "")
}
