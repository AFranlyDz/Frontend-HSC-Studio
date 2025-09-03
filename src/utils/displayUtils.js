/**
 * Función utilitaria para mostrar una pleca (-) cuando la información está faltante
 * @param {any} value - El valor a evaluar
 * @param {function} formatter - Función opcional para formatear el valor si existe
 * @returns {string} El valor formateado o una pleca (-)
 */
export const displayValueOrDash = (value, formatter = null) => {
  // Verificar si el valor está vacío, es null, undefined, o es una cadena vacía
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    (typeof value === "string" && value.trim() === "") ||
    (typeof value === "number" && isNaN(value))
  ) {
    return "-"
  }

  // Si hay un formateador, usarlo
  if (formatter && typeof formatter === "function") {
    try {
      const formatted = formatter(value)
      // Verificar si el resultado del formateador también está vacío
      return formatted === null || formatted === undefined || formatted === "" ? "-" : formatted
    } catch (error) {
      console.warn("Error al formatear valor:", error)
      return "-"
    }
  }

  return value
}

/**
 * Formateador específico para fechas
 * @param {string|Date} dateValue - Valor de fecha
 * @returns {string} Fecha formateada o pleca
 */
export const formatDateOrDash = (dateValue) => {
  return displayValueOrDash(dateValue, (value) => {
    if (!value) return null
    try {
      return new Date(value).toLocaleDateString()
    } catch {
      return null
    }
  })
}

/**
 * Formateador específico para valores booleanos
 * @param {boolean} boolValue - Valor booleano
 * @param {string} trueText - Texto para true (default: "Sí")
 * @param {string} falseText - Texto para false (default: "No")
 * @returns {string} Texto formateado o pleca
 */
export const formatBooleanOrDash = (boolValue, trueText = "Sí", falseText = "No") => {
  return displayValueOrDash(boolValue, (value) => {
    return typeof value === "boolean" ? (value ? trueText : falseText) : null
  })
}

/**
 * Formateador específico para números
 * @param {number} numValue - Valor numérico
 * @param {number} decimals - Número de decimales (opcional)
 * @returns {string} Número formateado o pleca
 */
export const formatNumberOrDash = (numValue, decimals = null) => {
  return displayValueOrDash(numValue, (value) => {
    if (typeof value !== "number" || isNaN(value)) return null
    return decimals !== null ? value.toFixed(decimals) : value.toString()
  })
}
