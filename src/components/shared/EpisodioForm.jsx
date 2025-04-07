"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export const EpisodioForm = ({ initialData = null, onSubmit, isLoading }) => {
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

  // Cargar datos iniciales si existen
  useEffect(() => {
    if (initialData) {
      // Formatear fechas para el input date
      const formatDate = (dateString) => {
        if (!dateString) return ""
        const date = new Date(dateString)
        return date.toISOString().split("T")[0]
      }

      setFormData({
        id: initialData.id,
        inicio: formatDate(initialData.inicio),
        fecha_alta: formatDate(initialData.fecha_alta),
        tiempo_estadia: initialData.tiempo_estadia || 0,
        estado_al_egreso: initialData.estado_al_egreso,
        tiempo_antecedente: initialData.tiempo_antecedente || 0,
        descripcion_antecedente: initialData.descripcion_antecedente || "",
        edad_paciente: initialData.edad_paciente || 0,
        observaciones: initialData.observaciones || "",
      })
    }
  }, [initialData])

  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="inicio" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de inicio
          </label>
          <input
            type="date"
            id="inicio"
            name="inicio"
            value={formData.inicio}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-gray-700 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="fecha_alta" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de alta
          </label>
          <input
            type="date"
            id="fecha_alta"
            name="fecha_alta"
            value={formData.fecha_alta}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-gray-700 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="tiempo_estadia" className="block text-sm font-medium text-gray-700 mb-1">
            Tiempo de estadía (días)
          </label>
          <input
            type="number"
            id="tiempo_estadia"
            name="tiempo_estadia"
            value={formData.tiempo_estadia}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="edad_paciente" className="block text-sm font-medium text-gray-700 mb-1">
            Edad del paciente
          </label>
          <input
            type="number"
            id="edad_paciente"
            name="edad_paciente"
            value={formData.edad_paciente}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="tiempo_antecedente" className="block text-sm font-medium text-gray-700 mb-1">
            Tiempo de antecedente (días)
          </label>
          <input
            type="number"
            id="tiempo_antecedente"
            name="tiempo_antecedente"
            value={formData.tiempo_antecedente}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="estado_al_egreso"
            name="estado_al_egreso"
            checked={formData.estado_al_egreso}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500  border-gray-300 rounded"
          />
          <label htmlFor="estado_al_egreso" className="ml-2 block text-sm font-medium text-gray-700">
            Estado favorable al egreso
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="descripcion_antecedente" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción del antecedente
        </label>
        <textarea
          id="descripcion_antecedente"
          name="descripcion_antecedente"
          value={formData.descripcion_antecedente}
          onChange={handleChange}
          rows="2"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>

      <div>
        <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">
          Observaciones
        </label>
        <textarea
          id="observaciones"
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : initialData ? "Actualizar" : "Guardar"}
        </Button>
      </div>
    </form>
  )
}

