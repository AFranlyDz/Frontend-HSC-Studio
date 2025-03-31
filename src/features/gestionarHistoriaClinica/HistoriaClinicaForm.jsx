"use client"

import { useState, useEffect } from "react"

export function HistoriaClinicaForm({ initialData, onSubmit, isLoading }) {
  // Función para convertir los datos del backend a formato de formulario
  const convertBackendToForm = (data) => {
    if (!data) return null

    return {
      ...data,
      // Convertir booleanos a strings para la UI
      sexo: data.sexo === true ? "Masculino" : "Femenino",
      manualidad: data.manualidad === true ? "Derecha" : "Izquierda",
    }
  }

  // Función para convertir los datos del formulario al formato del backend
  const convertFormToBackend = (formData) => {
    return {
      ...formData,
      // Convertir strings a booleanos para la API
      sexo: formData.sexo === "Masculino",
      manualidad: formData.manualidad === "Derecha",
      historial_trauma_craneal: formData.historial_trauma_craneal,
      antecedentes_familiares: formData.antecedentes_familiares,
    }
  }

  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    edad: "",
    sexo: "Masculino", // UI value
    numero: "",
    seudonimo: "",
    manualidad: "Derecha", // UI value
    antecedentes_familiares: false,
    historial_trauma_craneal: false,
    ...convertBackendToForm(initialData),
  })

  // Actualizar el formulario si cambian los datos iniciales
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...convertBackendToForm(initialData),
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    // Manejar diferentes tipos de inputs
    let newValue
    if (type === "checkbox") {
      newValue = checked
    } else if (type === "number") {
      newValue = value ? Number.parseInt(value) : ""
    } else {
      newValue = value
    }

    setFormData({
      ...formData,
      [name]: newValue,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Crear una copia de los datos del formulario
    const dataToSubmit = { ...convertFormToBackend(formData) }

    // Si es un nuevo registro, generar número aleatorio
    if (!initialData?.id) {
      dataToSubmit.numero = Math.floor(Math.random() * (99999999 - 10000000 + 1) + 10000000).toString()
    }

    // Generar seudónimo basado en nombre, apellido y número
    const nombrePrefix = dataToSubmit.nombre.substring(0, 2).toUpperCase()
    const apellidoPrefix = dataToSubmit.apellidos.substring(0, 2).toUpperCase()
    const numeroSuffix = dataToSubmit.numero.slice(-4)

    dataToSubmit.seudonimo = `${nombrePrefix}${apellidoPrefix}${numeroSuffix}`

    // Enviar los datos al servidor
    onSubmit(dataToSubmit)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
          <input
            type="number"
            name="edad"
            value={formData.edad}
            onChange={handleChange}
            required
            min="0"
            max="120"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
          <select
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Manualidad</label>
          <select
            name="manualidad"
            value={formData.manualidad}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Derecha">Derecha</option>
            <option value="Izquierda">Izquierda</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="antecedentes_familiares"
              name="antecedentes_familiares"
              checked={formData.antecedentes_familiares}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="antecedentes_familiares" className="ml-2 block text-sm text-gray-900">
              ¿Tiene antecedentes familiares de enfermedades neurológicas?
            </label>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="historial_trauma_craneal"
              name="historial_trauma_craneal"
              checked={formData.historial_trauma_craneal}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="historial_trauma_craneal" className="ml-2 block text-sm text-gray-900">
              ¿Ha sufrido algún trauma craneal anteriormente?
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? "Guardando..." : initialData?.id ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </form>
  )
}

