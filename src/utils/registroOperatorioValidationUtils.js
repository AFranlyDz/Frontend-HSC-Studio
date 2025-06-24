/**
 * Validaciones específicas para registros operatorios
 */

import { validateFechaConEdad } from "./episodioValidationUtils"

/**
 * Valida la escala de Glasgow
 * @param {number} valor - Valor de la escala de Glasgow
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateEscalaGlasgow = (valor) => {
  if (valor === null || valor === undefined || valor === "") {
    return {
      isValid: false,
      error: "La escala de Glasgow es requerida",
    }
  }

  const valorNum = Number(valor)

  if (isNaN(valorNum)) {
    return {
      isValid: false,
      error: "La escala de Glasgow debe ser un número válido",
    }
  }

  if (!Number.isInteger(valorNum)) {
    return {
      isValid: false,
      error: "La escala de Glasgow debe ser un número entero",
    }
  }

  if (valorNum < 3 || valorNum > 15) {
    return {
      isValid: false,
      error: "La escala de Glasgow debe estar entre 3 y 15",
    }
  }

  return { isValid: true, error: null }
}

/**
 * Valida que la fecha de operación esté dentro del rango del episodio
 * @param {string} fechaOperacion - Fecha de la operación
 * @param {string} fechaInicioEpisodio - Fecha de inicio del episodio
 * @param {string} fechaAltaEpisodio - Fecha de alta del episodio
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateFechaOperacionEnEpisodio = (fechaOperacion, fechaInicioEpisodio, fechaAltaEpisodio) => {
  if (!fechaOperacion) {
    return { isValid: true, error: null }
  }

  if (!fechaInicioEpisodio) {
    return {
      isValid: false,
      error: "No se puede validar: el episodio no tiene fecha de inicio",
    }
  }

  const fechaOp = new Date(fechaOperacion)
  const fechaInicio = new Date(fechaInicioEpisodio)

  // La fecha de operación debe ser igual o posterior a la fecha de inicio del episodio
  if (fechaOp < fechaInicio) {
    return {
      isValid: false,
      error: "La fecha de operación debe ser igual o posterior a la fecha de inicio del episodio",
    }
  }

  // Si hay fecha de alta, la operación debe ser anterior o igual a la fecha de alta
  if (fechaAltaEpisodio) {
    const fechaAlta = new Date(fechaAltaEpisodio)
    if (fechaOp > fechaAlta) {
      return {
        isValid: false,
        error: "La fecha de operación debe ser anterior o igual a la fecha de alta del episodio",
      }
    }
  }

  return { isValid: true, error: null }
}

/**
 * Valida que la fecha de operación no exceda los límites de edad del paciente
 * @param {string} fechaOperacion - Fecha de la operación
 * @param {number} edadActualPaciente - Edad actual del paciente
 * @returns {object} - { isValid: boolean, error: string, edadEnFecha: number }
 */
export const validateFechaOperacionConEdad = (fechaOperacion, edadActualPaciente) => {
  return validateFechaConEdad(fechaOperacion, edadActualPaciente)
}

/**
 * Validación completa de la fecha de operación
 * @param {string} fechaOperacion - Fecha de la operación
 * @param {object} episodio - Objeto del episodio con fechas de inicio y alta
 * @param {number} edadActualPaciente - Edad actual del paciente
 * @returns {object} - { isValid: boolean, error: string, edadEnFecha: number }
 */
export const validateFechaOperacionCompleta = (fechaOperacion, episodio, edadActualPaciente) => {
  // Primero validar la edad
  const validacionEdad = validateFechaOperacionConEdad(fechaOperacion, edadActualPaciente)
  if (!validacionEdad.isValid) {
    return validacionEdad
  }

  // Luego validar que esté dentro del rango del episodio
  const validacionEpisodio = validateFechaOperacionEnEpisodio(fechaOperacion, episodio?.inicio, episodio?.fecha_alta)
  if (!validacionEpisodio.isValid) {
    return {
      isValid: false,
      error: validacionEpisodio.error,
      edadEnFecha: validacionEdad.edadEnFecha,
    }
  }

  return {
    isValid: true,
    error: null,
    edadEnFecha: validacionEdad.edadEnFecha,
  }
}

/**
 * Filtra entrada numérica para la escala de Glasgow
 * @param {string} value - Valor a filtrar
 * @returns {string} - Valor filtrado
 */
export const filterGlasgowInput = (value) => {
  return value.replace(/[^0-9]/g, "")
}
