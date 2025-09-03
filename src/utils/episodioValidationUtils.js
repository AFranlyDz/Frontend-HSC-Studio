/**
 * Validaciones específicas para episodios médicos
 */

/**
 * Calcula la edad que tendría una persona en una fecha específica
 * @param {number} edadActual - Edad actual del paciente
 * @param {string} fechaEpisodio - Fecha del episodio (YYYY-MM-DD)
 * @returns {number} - Edad calculada en la fecha del episodio
 */
export const calcularEdadEnFecha = (edadActual, fechaEpisodio) => {
  if (!fechaEpisodio || !edadActual) return edadActual

  const hoy = new Date()
  const fechaEp = new Date(fechaEpisodio)

  // Calcular diferencia en años entre hoy y la fecha del episodio
  const diferenciaAnios = (hoy.getTime() - fechaEp.getTime()) / (1000 * 60 * 60 * 24 * 365.25)

  // La edad en el episodio sería la edad actual menos la diferencia
  return Math.round(edadActual - diferenciaAnios)
}

/**
 * Valida que una fecha no haga que el paciente tenga edad inválida
 * @param {string} fecha - Fecha a validar (YYYY-MM-DD)
 * @param {number} edadActualPaciente - Edad actual del paciente
 * @returns {object} - { isValid: boolean, error: string, edadEnFecha: number }
 */
export const validateFechaConEdad = (fecha, edadActualPaciente) => {
  if (!fecha) {
    return { isValid: true, error: null, edadEnFecha: edadActualPaciente }
  }

  const edadEnFecha = calcularEdadEnFecha(edadActualPaciente, fecha)

  if (edadEnFecha < 0) {
    return {
      isValid: false,
      error: "La fecha seleccionada haría que el paciente tuviera edad negativa",
      edadEnFecha,
    }
  }

  if (edadEnFecha > 121) {
    return {
      isValid: false,
      error: "La fecha seleccionada haría que el paciente tuviera más de 121 años",
      edadEnFecha,
    }
  }

  return { isValid: true, error: null, edadEnFecha }
}

/**
 * Valida que la fecha de alta sea posterior o igual a la fecha de inicio
 * @param {string} fechaInicio - Fecha de inicio
 * @param {string} fechaAlta - Fecha de alta
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateFechaAlta = (fechaInicio, fechaAlta) => {
  if (!fechaInicio || !fechaAlta) {
    return { isValid: true, error: null }
  }

  const inicio = new Date(fechaInicio)
  const alta = new Date(fechaAlta)

  if (alta < inicio) {
    return {
      isValid: false,
      error: "La fecha de alta debe ser igual o posterior a la fecha de inicio",
    }
  }

  return { isValid: true, error: null }
}

/**
 * Valida el tiempo de antecedente
 * @param {number} tiempoAntecedente - Tiempo en días
 * @param {number} edadActualPaciente - Edad actual del paciente
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateTiempoAntecedente = (tiempoAntecedente, edadActualPaciente) => {
  if (tiempoAntecedente === null || tiempoAntecedente === undefined || tiempoAntecedente === "") {
    return { isValid: true, error: null }
  }

  const tiempo = Number(tiempoAntecedente)

  if (isNaN(tiempo)) {
    return {
      isValid: false,
      error: "El tiempo de antecedente debe ser un número válido",
    }
  }

  if (tiempo < 0) {
    return {
      isValid: false,
      error: "El tiempo de antecedente debe ser 0 o superior",
    }
  }

  // Calcular días máximos (edad actual * 365.25 días por año)
  const diasMaximos = Math.floor(edadActualPaciente * 365.25)

  if (tiempo > diasMaximos) {
    return {
      isValid: false,
      error: `El tiempo de antecedente no puede ser superior a ${diasMaximos} días (edad del paciente en días)`,
    }
  }

  return { isValid: true, error: null }
}

/**
 * Valida la edad del paciente en el episodio
 * @param {number} edad - Edad a validar
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateEdadPaciente = (edad) => {
  if (edad === null || edad === undefined || edad === "") {
    return {
      isValid: false,
      error: "La edad del paciente es requerida",
    }
  }

  const edadNum = Number(edad)

  if (isNaN(edadNum)) {
    return {
      isValid: false,
      error: "La edad debe ser un número válido",
    }
  }

  if (!Number.isInteger(edadNum)) {
    return {
      isValid: false,
      error: "La edad debe ser un número entero",
    }
  }

  if (edadNum < 0 || edadNum > 121) {
    return {
      isValid: false,
      error: "La edad debe estar entre 0 y 121 años",
    }
  }

  return { isValid: true, error: null }
}

/**
 * Calcula días de diferencia entre dos fechas
 * @param {string} fechaInicio - Fecha de inicio
 * @param {string} fechaFin - Fecha de fin
 * @returns {number} - Días de diferencia
 */
export const calcularDiasDiferencia = (fechaInicio, fechaFin) => {
  if (!fechaInicio || !fechaFin) return 0

  const inicio = new Date(fechaInicio)
  const fin = new Date(fechaFin)

  const diferencia = fin.getTime() - inicio.getTime()
  return Math.max(0, Math.round(diferencia / (1000 * 60 * 60 * 24)))
}

/**
 * Filtra entrada numérica para campos de tiempo
 * @param {string} value - Valor a filtrar
 * @returns {string} - Valor filtrado
 */
export const filterTimeInput = (value) => {
  return value.replace(/[^0-9]/g, "")
}
