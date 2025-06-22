"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function EpisodioForm({ initialData, onSubmit, isLoading, onCancel }) {
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    inicio: "",
    fecha_alta: "",
    estado_al_egreso: true,
    tiempo_antecedente: 0,
    descripcion_antecedente: "",
    edad_paciente: 0,
    observaciones: "",
  })
  
  // Estado para errores de validación
  const [errors, setErrors] = useState({
    fecha_alta: ""
  })

  // Calcular días de diferencia entre dos fechas
  const calcularDiasDiferencia = (fechaInicio, fechaFin) => {
    if (!fechaInicio || !fechaFin) return 0
    
    const inicio = new Date(fechaInicio)
    const fin = new Date(fechaFin)
    
    // Diferencia en milisegundos
    const diferencia = fin.getTime() - inicio.getTime()
    
    // Convertir a días (1000 ms * 60 s * 60 min * 24 h)
    return Math.round(diferencia / (1000 * 60 * 60 * 24))
  }

  // Validar que la fecha de alta sea posterior a la de inicio
  const validarFechas = (inicio, alta) => {
    if (!inicio || !alta) return true // Permitir si alguna está vacía
    
    const fechaInicio = new Date(inicio)
    const fechaAlta = new Date(alta)
    
    return fechaAlta > fechaInicio
  }

  // Actualizar el formulario si cambian los datos iniciales
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
      })
    }
  }, [initialData])

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    // Manejar diferentes tipos de inputs
    let newValue
    if (type === "checkbox") {
      newValue = checked
    } else if (type === "number") {
      newValue = value ? Number.parseInt(value) : 0
    } else {
      newValue = value
    }

    const updatedFormData = {
      ...formData,
      [name]: newValue,
    }

    // Si cambian las fechas, recalcular el tiempo de estadía y validar
    if (name === "inicio" || name === "fecha_alta") {
      // Validar fechas
      const fechaInicio = name === "inicio" ? newValue : formData.inicio
      const fechaAlta = name === "fecha_alta" ? newValue : formData.fecha_alta
      
      if (fechaInicio && fechaAlta) {
        const esValida = validarFechas(fechaInicio, fechaAlta)
        setErrors({
          ...errors,
          fecha_alta: esValida ? "" : "La fecha de alta debe ser posterior a la fecha de inicio"
        })
      } else {
        setErrors({
          ...errors,
          fecha_alta: ""
        })
      }

      // Calcular tiempo de estadía
      updatedFormData.tiempo_estadia = calcularDiasDiferencia(
        fechaInicio,
        fechaAlta
      )
    }

    setFormData(updatedFormData)
  }

  // Enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validar fechas antes de enviar
    if (formData.inicio && formData.fecha_alta && !validarFechas(formData.inicio, formData.fecha_alta)) {
      setErrors({
        ...errors,
        fecha_alta: "La fecha de alta debe ser posterior a la fecha de inicio"
      })
      return
    }

    // Asegurarnos de que el tiempo de estadía esté calculado antes de enviar
    const datosEnviar = {
      ...formData,
      tiempo_estadia: calcularDiasDiferencia(formData.inicio, formData.fecha_alta)
    }
    onSubmit(datosEnviar)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fecha de inicio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio</label>
          <input
            type="date"
            name="inicio"
            value={formData.inicio || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Fecha de alta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de alta</label>
          <input
            type="date"
            name="fecha_alta"
            value={formData.fecha_alta || ""}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 ${
              errors.fecha_alta 
                ? "border-red-500 focus:ring-red-500" 
                : "border-gray-300 focus:ring-blue-500"
            }`}
            required
          />
          {errors.fecha_alta && (
            <p className="mt-1 text-sm text-red-600">{errors.fecha_alta}</p>
          )}
        </div>

        {/* Mostrar tiempo de estadía calculado (solo lectura) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo de estadía calculado</label>
          <input
            type="text"
            value={`${formData.tiempo_estadia || 0} días`}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
          />
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo de antecedente (días)</label>
          <input
            type="number"
            name="tiempo_antecedente"
            value={formData.tiempo_antecedente || 0}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Edad del paciente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Edad del paciente</label>
          <input
            type="number"
            name="edad_paciente"
            value={formData.edad_paciente || 0}
            onChange={handleChange}
            min="0"
            max="120"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Descripción del antecedente */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción del antecedente</label>
          <textarea
            name="descripcion_antecedente"
            value={formData.descripcion_antecedente || ""}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Observaciones */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
          <textarea
            name="observaciones"
            value={formData.observaciones || ""}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={isLoading} 
          className="text-white"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || (formData.inicio && formData.fecha_alta && !validarFechas(formData.inicio, formData.fecha_alta))}
        >
          {isLoading ? "Guardando..." : initialData?.id ? "Actualizar" : "Guardar"}
        </Button>
      </div>
    </form>
  )
}