"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function RegistroOperatorioForm({ initialData, onSubmit, isLoading, onCancel }) {
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    fecha_operacion: "",
    es_reintervencion: false,
    escala_evaluacion_resultados_glasgow: 3, // Valor mínimo según validación
    estado_egreso: true,
    observaciones: "",
  })

  // Actualizar el formulario si cambian los datos iniciales
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Asegurar que la escala Glasgow tenga al menos valor 3
        escala_evaluacion_resultados_glasgow: Math.max(3, initialData.escala_evaluacion_resultados_glasgow || 3)
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

    setFormData({
      ...formData,
      [name]: newValue,
    })
  }

  // Enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fecha de la operación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de operación</label>
          <input
            type="date"
            name="fecha_operacion"
            value={formData.fecha_operacion || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Escala de Glasgow */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Escala de Glasgow (3-15)
          </label>
          <input
            type="number"
            name="escala_evaluacion_resultados_glasgow"
            value={formData.escala_evaluacion_resultados_glasgow}
            onChange={handleChange}
            min="3"
            max="15"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
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
          <label className="ml-2 block text-sm text-gray-700">
            Es reintervención
          </label>
        </div>

        {/* Estado de egreso */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="estado_egreso"
            checked={formData.estado_egreso}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Estado de egreso favorable
          </label>
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
          />
        </div>
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