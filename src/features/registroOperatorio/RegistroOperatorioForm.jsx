"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import {
  validateEscalaGlasgow,
  validateFechaOperacionCompleta,
  filterGlasgowInput,
} from "@/utils/registroOperatorioValidationUtils"
import { calcularEdadEnFecha } from "@/utils/episodioValidationUtils"

export function RegistroOperatorioForm({ initialData, onSubmit, isLoading, onCancel, episodioId }) {
  const { datos: paciente } = useSelector((state) => state.historiaClinica)

  // Obtener el episodio específico
  const episodio = paciente?.episodios?.find((ep) => ep.id === episodioId)

  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    fecha_operacion: "",
    es_reintervencion: false,
    escala_evaluacion_resultados_glasgow: "",
    estado_egreso: true,
    observaciones: "",
  })

  // Estado para errores de validación
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Actualizar el formulario si cambian los datos iniciales
  useEffect(() => {
    if (initialData) {
      setFormData({
        fecha_operacion: initialData.fecha_operacion || "",
        es_reintervencion: initialData.es_reintervencion || false,
        escala_evaluacion_resultados_glasgow: initialData.escala_evaluacion_resultados_glasgow || "",
        estado_egreso: initialData.estado_egreso !== undefined ? initialData.estado_egreso : true,
        observaciones: initialData.observaciones || "",
      })
    }
  }, [initialData])

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    let newValue = value

    // Filtrar entrada para campos específicos
    if (name === "escala_evaluacion_resultados_glasgow") {
      newValue = filterGlasgowInput(value)
      // Limitar a 2 dígitos máximo
      if (newValue.length > 2) {
        newValue = newValue.slice(0, 2)
      }
    }

    // Manejar diferentes tipos de inputs
    if (type === "checkbox") {
      newValue = checked
    }

    setFormData({
      ...formData,
      [name]: newValue,
    })

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
      case "escala_evaluacion_resultados_glasgow":
        validation = validateEscalaGlasgow(value)
        break
      case "fecha_operacion":
        validation = validateFechaOperacionCompleta(value, episodio, paciente?.edad || 0)
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

    // Validar escala de Glasgow
    const validacionGlasgow = validateEscalaGlasgow(formData.escala_evaluacion_resultados_glasgow)
    if (!validacionGlasgow.isValid) {
      newErrors.escala_evaluacion_resultados_glasgow = validacionGlasgow.error
    }

    // Validar fecha de operación
    if (formData.fecha_operacion) {
      const validacionFecha = validateFechaOperacionCompleta(formData.fecha_operacion, episodio, paciente?.edad || 0)
      if (!validacionFecha.isValid) {
        newErrors.fecha_operacion = validacionFecha.error
      }
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
      escala_evaluacion_resultados_glasgow: Number(formData.escala_evaluacion_resultados_glasgow),
    }

    onSubmit(datosEnviar)
  }

  const getFieldError = (fieldName) => {
    return errors[fieldName] && touched[fieldName] ? errors[fieldName] : null
  }

  // Calcular edad en la fecha de operación para mostrar información útil
  const edadEnOperacion = formData.fecha_operacion
    ? calcularEdadEnFecha(paciente?.edad || 0, formData.fecha_operacion)
    : null

  // Formatear fechas del episodio para mostrar
  const formatearFecha = (fecha) => {
    if (!fecha) return "No definida"
    return new Date(fecha).toLocaleDateString()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información del episodio */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">Información del Episodio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
          <p>
            <strong>Paciente:</strong> {paciente?.nombre} {paciente?.apellidos}
          </p>
          <p>
            <strong>Edad actual:</strong> {paciente?.edad} años
          </p>
          <p>
            <strong>Fecha inicio episodio:</strong> {formatearFecha(episodio?.inicio)}
          </p>
          <p>
            <strong>Fecha alta episodio:</strong> {formatearFecha(episodio?.fecha_alta)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fecha de la operación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de operación <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="fecha_operacion"
            value={formData.fecha_operacion}
            onChange={handleChange}
            onBlur={handleBlur}
            min={episodio?.inicio?.split("T")[0]} // Fecha mínima: inicio del episodio
            max={episodio?.fecha_alta?.split("T")[0]} // Fecha máxima: alta del episodio (si existe)
            className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getFieldError("fecha_operacion") ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {getFieldError("fecha_operacion") && (
            <p className="mt-1 text-sm text-red-600">{getFieldError("fecha_operacion")}</p>
          )}
          {edadEnOperacion !== null && !getFieldError("fecha_operacion") && (
            <p className="mt-1 text-xs text-gray-500">Edad del paciente en esta fecha: {edadEnOperacion} años</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Debe estar entre {formatearFecha(episodio?.inicio)} y{" "}
            {episodio?.fecha_alta ? formatearFecha(episodio?.fecha_alta) : "la fecha actual"}
          </p>
        </div>

        {/* Escala de Glasgow */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Escala de Glasgow <span className="text-red-500">*</span>
            <span className="text-xs text-gray-500 ml-1">(3-15)</span>
          </label>
          <input
            type="text"
            name="escala_evaluacion_resultados_glasgow"
            value={formData.escala_evaluacion_resultados_glasgow}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="3-15"
            className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getFieldError("escala_evaluacion_resultados_glasgow") ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {getFieldError("escala_evaluacion_resultados_glasgow") && (
            <p className="mt-1 text-sm text-red-600">{getFieldError("escala_evaluacion_resultados_glasgow")}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Escala de coma de Glasgow: 3 (coma profundo) a 15 (completamente despierto)
          </p>
        </div>

        {/* Es reintervención */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="es_reintervencion"
            checked={formData.es_reintervencion}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">Es reintervención</label>
        </div>

        {/* Estado de egreso */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado de egreso</label>
          <select
            name="estado_egreso"
            value={formData.estado_egreso.toString()}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="true">Favorable</option>
            <option value="false">Desfavorable</option>
          </select>
        </div>
      </div>

      {/* Observaciones */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
        <textarea
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          rows="3"
          placeholder="Observaciones sobre el registro operatorio..."
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
