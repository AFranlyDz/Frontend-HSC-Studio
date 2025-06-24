"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import {
  validateFechaConEdad,
  validateFechaAlta,
  validateTiempoAntecedente,
  validateEdadPaciente,
  calcularDiasDiferencia,
  calcularEdadEnFecha,
  filterTimeInput,
} from "@/utils/episodioValidationUtils"

export function EpisodioForm({ initialData, onSubmit, isLoading, onCancel }) {
  const { datos: paciente } = useSelector((state) => state.historiaClinica)

  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    id: null, // Agregar el ID al estado del formulario
    inicio: "",
    fecha_alta: "",
    estado_al_egreso: true,
    tiempo_antecedente: "",
    descripcion_antecedente: "",
    edad_paciente: paciente?.edad || 0,
    observaciones: "",
    tiempo_estadia: 0,
  })

  // Estado para errores de validación
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Determinar si estamos en modo edición
  const isEditing = Boolean(initialData?.id)

  // Actualizar el formulario si cambian los datos iniciales
  useEffect(() => {
    if (initialData) {
      // Calcular tiempo de estadía basado en las fechas existentes
      const tiempoEstadiaCalculado = calcularDiasDiferencia(initialData.inicio, initialData.fecha_alta)

      setFormData({
        id: initialData.id, // Incluir el ID en el estado del formulario
        inicio: initialData.inicio || "",
        fecha_alta: initialData.fecha_alta || "",
        estado_al_egreso: initialData.estado_al_egreso !== undefined ? initialData.estado_al_egreso : true,
        tiempo_antecedente: initialData.tiempo_antecedente || "",
        descripcion_antecedente: initialData.descripcion_antecedente || "",
        edad_paciente: initialData.edad_paciente || paciente?.edad || 0,
        observaciones: initialData.observaciones || "",
        tiempo_estadia: tiempoEstadiaCalculado,
      })
    } else {
      // En modo creación, usar la edad actual del paciente
      setFormData((prev) => ({
        ...prev,
        id: null,
        edad_paciente: paciente?.edad || 0,
      }))
    }
  }, [initialData, paciente?.edad])

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    let newValue = value

    // Filtrar entrada para campos específicos
    if (name === "tiempo_antecedente" || name === "edad_paciente") {
      newValue = filterTimeInput(value)
    }

    // Manejar diferentes tipos de inputs
    if (type === "checkbox") {
      newValue = checked
    } else if (name === "estado_al_egreso") {
      newValue = value === "true"
    }

    const updatedFormData = {
      ...formData,
      [name]: newValue,
    }

    // Calcular tiempo de estadía automáticamente
    if (name === "inicio" || name === "fecha_alta") {
      const fechaInicio = name === "inicio" ? newValue : formData.inicio
      const fechaAlta = name === "fecha_alta" ? newValue : formData.fecha_alta

      updatedFormData.tiempo_estadia = calcularDiasDiferencia(fechaInicio, fechaAlta)
    }

    setFormData(updatedFormData)

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    validateField(name, formData[name])
  }

  const validateField = (fieldName, value) => {
    let validation = { isValid: true, error: null }

    switch (fieldName) {
      case "inicio":
        validation = validateFechaConEdad(value, paciente?.edad || 0)
        break
      case "fecha_alta":
        // Validar tanto la edad como la relación con fecha de inicio
        const validacionEdad = validateFechaConEdad(value, paciente?.edad || 0)
        if (!validacionEdad.isValid) {
          validation = validacionEdad
        } else {
          validation = validateFechaAlta(formData.inicio, value)
        }
        break
      case "tiempo_antecedente":
        validation = validateTiempoAntecedente(value, paciente?.edad || 0)
        break
      case "edad_paciente":
        validation = validateEdadPaciente(value)
        break
      default:
        return
    }

    if (!validation.isValid) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: validation.error,
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validar fecha de inicio
    const validacionInicio = validateFechaConEdad(formData.inicio, paciente?.edad || 0)
    if (!validacionInicio.isValid) {
      newErrors.inicio = validacionInicio.error
    }

    // Validar fecha de alta
    if (formData.fecha_alta) {
      const validacionEdadAlta = validateFechaConEdad(formData.fecha_alta, paciente?.edad || 0)
      if (!validacionEdadAlta.isValid) {
        newErrors.fecha_alta = validacionEdadAlta.error
      } else {
        const validacionFechaAlta = validateFechaAlta(formData.inicio, formData.fecha_alta)
        if (!validacionFechaAlta.isValid) {
          newErrors.fecha_alta = validacionFechaAlta.error
        }
      }
    }

    // Validar tiempo de antecedente
    const validacionTiempo = validateTiempoAntecedente(formData.tiempo_antecedente, paciente?.edad || 0)
    if (!validacionTiempo.isValid) {
      newErrors.tiempo_antecedente = validacionTiempo.error
    }

    // Validar edad del paciente
    const validacionEdad = validateEdadPaciente(formData.edad_paciente)
    if (!validacionEdad.isValid) {
      newErrors.edad_paciente = validacionEdad.error
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault()

    // Marcar todos los campos como tocados
    const allFields = Object.keys(formData)
    const touchedFields = {}
    allFields.forEach((field) => {
      touchedFields[field] = true
    })
    setTouched(touchedFields)

    if (!validateForm()) {
      return
    }

    // Preparar datos para envío
    const datosEnviar = {
      ...formData,
      tiempo_estadia: calcularDiasDiferencia(formData.inicio, formData.fecha_alta),
      tiempo_antecedente: formData.tiempo_antecedente ? Number(formData.tiempo_antecedente) : null,
      edad_paciente: Number(formData.edad_paciente),
    }

    onSubmit(datosEnviar)
  }

  const getFieldError = (fieldName) => {
    return errors[fieldName] && touched[fieldName] ? errors[fieldName] : null
  }

  // Calcular edad estimada en las fechas para mostrar información útil
  const edadEnInicio = formData.inicio ? calcularEdadEnFecha(paciente?.edad || 0, formData.inicio) : null
  const edadEnAlta = formData.fecha_alta ? calcularEdadEnFecha(paciente?.edad || 0, formData.fecha_alta) : null

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información del paciente */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">Información del Paciente</h3>
        <p className="text-sm text-blue-700">
          <strong>Nombre:</strong> {paciente?.nombre} {paciente?.apellidos}
        </p>
        <p className="text-sm text-blue-700">
          <strong>Edad actual:</strong> {paciente?.edad} años
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fecha de inicio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de inicio <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="inicio"
            value={formData.inicio}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getFieldError("inicio") ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {getFieldError("inicio") && <p className="mt-1 text-sm text-red-600">{getFieldError("inicio")}</p>}
          {edadEnInicio !== null && !getFieldError("inicio") && (
            <p className="mt-1 text-xs text-gray-500">Edad del paciente en esta fecha: {edadEnInicio} años</p>
          )}
        </div>

        {/* Fecha de alta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de alta</label>
          <input
            type="date"
            name="fecha_alta"
            value={formData.fecha_alta}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getFieldError("fecha_alta") ? "border-red-500" : "border-gray-300"
            }`}
          />
          {getFieldError("fecha_alta") && <p className="mt-1 text-sm text-red-600">{getFieldError("fecha_alta")}</p>}
          {edadEnAlta !== null && !getFieldError("fecha_alta") && (
            <p className="mt-1 text-xs text-gray-500">Edad del paciente en esta fecha: {edadEnAlta} años</p>
          )}
        </div>

        {/* Tiempo de estadía calculado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo de estadía (días)</label>
          <input
            type="text"
            value={`${formData.tiempo_estadia || 0} días`}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">Calculado automáticamente</p>
        </div>

        {/* Estado al egreso */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado al egreso</label>
          <select
            name="estado_al_egreso"
            value={formData.estado_al_egreso.toString()}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="true">Favorable</option>
            <option value="false">Desfavorable</option>
          </select>
        </div>

        {/* Tiempo de antecedente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tiempo de antecedente (días)
            <span className="text-xs text-gray-500 ml-1">(≥ 0)</span>
          </label>
          <input
            type="text"
            name="tiempo_antecedente"
            value={formData.tiempo_antecedente}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="0"
            className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getFieldError("tiempo_antecedente") ? "border-red-500" : "border-gray-300"
            }`}
          />
          {getFieldError("tiempo_antecedente") && (
            <p className="mt-1 text-sm text-red-600">{getFieldError("tiempo_antecedente")}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Máximo: {Math.floor((paciente?.edad || 0) * 365.25)} días</p>
        </div>

        {/* Edad del paciente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Edad del paciente <span className="text-red-500">*</span>
            <span className="text-xs text-gray-500 ml-1">(0-121)</span>
          </label>
          <input
            type="text"
            name="edad_paciente"
            value={formData.edad_paciente}
            onChange={handleChange}
            onBlur={handleBlur}
            readOnly={!isEditing} // Solo editable en modo edición
            className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
            } ${getFieldError("edad_paciente") ? "border-red-500" : "border-gray-300"}`}
            required
          />
          {getFieldError("edad_paciente") && (
            <p className="mt-1 text-sm text-red-600">{getFieldError("edad_paciente")}</p>
          )}
          {!isEditing && (
            <p className="mt-1 text-xs text-gray-500">Se usa la edad actual del paciente para nuevos episodios</p>
          )}
        </div>
      </div>

      {/* Descripción del antecedente */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción del antecedente</label>
        <textarea
          name="descripcion_antecedente"
          value={formData.descripcion_antecedente}
          onChange={handleChange}
          rows="3"
          placeholder="Describa los antecedentes relevantes del episodio..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Observaciones */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
        <textarea
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          rows="3"
          placeholder="Observaciones adicionales sobre el episodio..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : initialData?.id ? "Actualizar" : "Guardar"}
        </Button>
      </div>
    </form>
  )
}
