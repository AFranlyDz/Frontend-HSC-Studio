"use client"

import { useState, useEffect } from "react"
import { validateNameField, validateAge, filterNameInput, filterAgeInput } from "@/utils/validationUtils"

export function HistoriaClinicaForm({ initialData, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    edad: "",
    sexo: "Masculino",
    numero: "",
    seudonimo: "",
    manualidad: "Derecha",
    antecedentes_familiares: false,
    historial_trauma_craneal: false,
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Función para convertir los datos del backend a formato de formulario
  const convertBackendToForm = (data) => {
    if (!data) return {}

    return {
      ...data,
      edad: data.edad ? String(data.edad) : "",
      sexo: data.sexo === true ? "Masculino" : "Femenino",
      manualidad: data.manualidad === true ? "Derecha" : "Izquierda",
    }
  }

  // Función para convertir los datos del formulario al formato del backend
  const convertFormToBackend = (formData) => {
    return {
      ...formData,
      edad: Number.parseInt(formData.edad),
      sexo: formData.sexo === "Masculino",
      manualidad: formData.manualidad === "Derecha",
      historial_trauma_craneal: formData.historial_trauma_craneal,
      antecedentes_familiares: formData.antecedentes_familiares,
    }
  }

  // Actualizar el formulario si cambian los datos iniciales
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...convertBackendToForm(initialData),
      }))
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    let newValue = value

    // Filtrar entrada en tiempo real para campos específicos
    if (name === "nombre" || name === "apellidos") {
      newValue = filterNameInput(value)
    } else if (name === "edad") {
      newValue = filterAgeInput(value)
      // Limitar a 3 dígitos máximo
      if (newValue.length > 3) {
        newValue = newValue.slice(0, 3)
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
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))

    // Validar campo específico al perder el foco
    validateField(name, value)
  }

  const validateField = (fieldName, value) => {
    let validation = { isValid: true, error: null }

    switch (fieldName) {
      case "nombre":
        validation = validateNameField(value, 2)
        break
      case "apellidos":
        validation = validateNameField(value, 2)
        break
      case "edad":
        validation = validateAge(value, 0, 121)
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

    // Validar nombre
    const nombreValidation = validateNameField(formData.nombre, 2)
    if (!nombreValidation.isValid) {
      newErrors.nombre = nombreValidation.error
    }

    // Validar apellidos
    const apellidosValidation = validateNameField(formData.apellidos, 2)
    if (!apellidosValidation.isValid) {
      newErrors.apellidos = apellidosValidation.error
    }

    // Validar edad
    const edadValidation = validateAge(formData.edad, 0, 121)
    if (!edadValidation.isValid) {
      newErrors.edad = edadValidation.error
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Marcar todos los campos como tocados
    setTouched({
      nombre: true,
      apellidos: true,
      edad: true,
    })

    if (!validateForm()) {
      return
    }

    // Crear una copia de los datos del formulario
    const dataToSubmit = { ...convertFormToBackend(formData) }

    // Si es un nuevo registro, generar número aleatorio
    if (!initialData?.id) {
      dataToSubmit.numero = Math.floor(Math.random() * (99999999 - 10000000 + 1) + 10000000).toString()
    }

    // Generar seudónimo basado en nombre, apellido y número
    const nombrePrefix = dataToSubmit.nombre.trim().substring(0, 2).toUpperCase()
    const apellidoPrefix = dataToSubmit.apellidos.trim().substring(0, 2).toUpperCase()
    const numeroSuffix = dataToSubmit.numero.slice(-4)

    dataToSubmit.seudonimo = `${nombrePrefix}${apellidoPrefix}${numeroSuffix}`
    dataToSubmit.nombre = dataToSubmit.nombre.trim()
    dataToSubmit.apellidos = dataToSubmit.apellidos.trim()

    // Enviar los datos al servidor
    onSubmit(dataToSubmit)
  }

  const getFieldError = (fieldName) => {
    return errors[fieldName] && touched[fieldName] ? errors[fieldName] : null
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            placeholder="Mínimo 2 letras, solo caracteres alfabéticos"
            className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getFieldError("nombre") ? "border-red-500" : "border-gray-300"
            }`}
          />
          {getFieldError("nombre") && <p className="mt-1 text-sm text-red-600">{getFieldError("nombre")}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apellidos <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            placeholder="Mínimo 2 letras, solo caracteres alfabéticos"
            className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getFieldError("apellidos") ? "border-red-500" : "border-gray-300"
            }`}
          />
          {getFieldError("apellidos") && <p className="mt-1 text-sm text-red-600">{getFieldError("apellidos")}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Edad <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="edad"
            value={formData.edad}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            placeholder="Entre 0 y 121 años"
            className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getFieldError("edad") ? "border-red-500" : "border-gray-300"
            }`}
          />
          {getFieldError("edad") && <p className="mt-1 text-sm text-red-600">{getFieldError("edad")}</p>}
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
