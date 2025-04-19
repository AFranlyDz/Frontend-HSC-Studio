"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function RegistroPosoperatorioForm({ initialData, onSubmit, isLoading, onCancel }) {
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    fecha: "",
    tiempo_transcurrido: 0,
    escala_pronostica_oslo_posoperatoria: 0,
    recurrencia_hematoma: false,
    gradacion_pronostica_para_recurrencia_hsc_unilateral: 0,
  })

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
        {/* Fecha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tiempo transcurrido */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo transcurrido (días)</label>
          <input
            type="number"
            name="tiempo_transcurrido"
            value={formData.tiempo_transcurrido}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Escala pronóstica Oslo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Escala pronóstica Oslo</label>
          <input
            type="number"
            name="escala_pronostica_oslo_posoperatoria"
            value={formData.escala_pronostica_oslo_posoperatoria}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Recurrencia hematoma */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="recurrencia_hematoma"
            checked={formData.recurrencia_hematoma}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Recurrencia de hematoma
          </label>
        </div>

        {/* Gradación pronóstica para recurrencia HSC unilateral */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gradación pronóstica para recurrencia HSC unilateral
          </label>
          <input
            type="number"
            name="gradacion_pronostica_para_recurrencia_hsc_unilateral"
            value={formData.gradacion_pronostica_para_recurrencia_hsc_unilateral}
            onChange={handleChange}
            min="0"
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