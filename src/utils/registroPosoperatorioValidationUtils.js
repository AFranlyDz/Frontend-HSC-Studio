/**
 * Validaciones específicas para registros posoperatorios
 */

import { calcularDiasDiferencia } from "./episodioValidationUtils"

/**
 * Valida que la fecha del registro posoperatorio esté dentro del rango permitido
 * @param {string} fechaPosoperatorio - Fecha del registro posoperatorio
 * @param {string} fechaOperacion - Fecha de la operación
 * @param {string} fechaAltaEpisodio - Fecha de alta del episodio
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateFechaPosoperatorio = (fechaPosoperatorio, fechaOperacion, fechaAltaEpisodio) => {
  if (!fechaPosoperatorio) {
    return { isValid: true, error: null }
  }

  if (!fechaOperacion) {
    return {
      isValid: false,
      error: "No se puede validar: no hay fecha de operación de referencia",
    }
  }

  const fechaPosop = new Date(fechaPosoperatorio)
  const fechaOp = new Date(fechaOperacion)

  // La fecha posoperatoria debe ser igual o posterior a la fecha de operación
  if (fechaPosop < fechaOp) {
    return {
      isValid: false,
      error: "La fecha del registro posoperatorio debe ser igual o posterior a la fecha de operación",
    }
  }

  // Si hay fecha de alta del episodio, no debe excederla
  if (fechaAltaEpisodio) {
    const fechaAlta = new Date(fechaAltaEpisodio)
    if (fechaPosop > fechaAlta) {
      return {
        isValid: false,
        error: "La fecha del registro posoperatorio no puede ser posterior a la fecha de alta del episodio",
      }
    }
  }

  return { isValid: true, error: null }
}

/**
 * Valida la escala pronóstica Oslo posoperatoria
 * @param {number} valor - Valor de la escala Oslo
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateEscalaOsloPostoperatoria = (valor) => {
  if (valor === null || valor === undefined || valor === "") {
    return { isValid: true, error: null } // Campo opcional
  }

  const valorNum = Number(valor)

  if (isNaN(valorNum)) {
    return {
      isValid: false,
      error: "La escala Oslo posoperatoria debe ser un número válido",
    }
  }

  if (!Number.isInteger(valorNum)) {
    return {
      isValid: false,
      error: "La escala Oslo posoperatoria debe ser un número entero",
    }
  }

  if (valorNum < 0 || valorNum > 10) {
    return {
      isValid: false,
      error: "La escala Oslo posoperatoria debe estar entre 0 y 10",
    }
  }

  return { isValid: true, error: null }
}

/**
 * Valida la gradación pronóstica para recurrencia HSC unilateral (porcentaje)
 * @param {number} valor - Valor de la gradación pronóstica
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateGradacionPronostica = (valor) => {
  if (valor === null || valor === undefined || valor === "") {
    return { isValid: true, error: null } // Campo opcional
  }

  const valorNum = Number(valor)

  if (isNaN(valorNum)) {
    return {
      isValid: false,
      error: "La gradación pronóstica debe ser un número válido",
    }
  }

  if (valorNum < 0 || valorNum > 100) {
    return {
      isValid: false,
      error: "La gradación pronóstica debe estar entre 0 y 100 (porcentaje)",
    }
  }

  return { isValid: true, error: null }
}

/**
 * Calcula el tiempo transcurrido entre la fecha de operación y la fecha posoperatoria
 * @param {string} fechaOperacion - Fecha de la operación
 * @param {string} fechaPosoperatorio - Fecha del registro posoperatorio
 * @returns {number} - Días transcurridos
 */
export const calcularTiempoTranscurrido = (fechaOperacion, fechaPosoperatorio) => {
  return calcularDiasDiferencia(fechaOperacion, fechaPosoperatorio)
}

/**
 * Filtra entrada numérica para escalas
 * @param {string} value - Valor a filtrar
 * @param {boolean} allowDecimals - Si permite decimales
 * @returns {string} - Valor filtrado
 */
export const filterScaleInput = (value, allowDecimals = false) => {
  if (allowDecimals) {
    return value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1")
  } else {
    return value.replace(/[^0-9]/g, "")
  }
}
