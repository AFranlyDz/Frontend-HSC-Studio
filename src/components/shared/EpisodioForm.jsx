"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function EpisodioForm({ initialData, onSubmit, isLoading, onCancel }) {
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    inicio: "",
    fecha_alta: "",
    tiempo_estadia: 0,
    estado_al_egreso: true,
    tiempo_antecedente: 0,
    descripcion_antecedente: "",
    edad_paciente: 0,
    observaciones: "",
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
        {/* Fecha de inicio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio</label>
          <input
            type="date"
            name="inicio"
            value={formData.inicio || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tiempo de estadía */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo de estadía (días)</label>
          <input
            type="number"
            name="tiempo_estadia"
            value={formData.tiempo_estadia || 0}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
