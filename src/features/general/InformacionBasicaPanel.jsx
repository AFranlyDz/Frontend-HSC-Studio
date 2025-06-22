"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { InfoFieldCompact } from "@/components/shared/InfoFieldCompact"
import { useFormatValue } from "@/hooks/useFormatValue"
import { useCustomAlert } from "@/hooks/useCustomAlert"
import { Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material"
import axios from "axios"
import { setHistoriaClinica } from "@/features/gestionarHistoriaClinica/historiaClinicaSlice"

export const InformacionBasicaPanel = () => {
  const { datos } = useSelector((state) => state.historiaClinica)
  const { formatValue } = useFormatValue()
  const { warning, success, error } = useCustomAlert()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    edad: 0,
    sexo: true,
    historial_trauma_craneal: false,
    manualidad: true,
    antecedentes_familiares: false,
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const dispatch = useDispatch()
  const apiUrl = import.meta.env.VITE_API_BACKEND

  // Función para validar que no contenga números
  const validateTextWithoutNumbers = (value, fieldName) => {
    const hasNumbers = /\d/.test(value)
    if (hasNumbers) {
      return `El campo ${fieldName} no puede contener números`
    }
    return null
  }

  // Función para validar solo letras, espacios y algunos caracteres especiales
  const isValidNameInput = (value) => {
    // Permite letras, espacios, acentos, ñ, guiones y apostrofes
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-']*$/
    return nameRegex.test(value)
  }

  const handleEdit = () => {
    const defaultValues = {
      nombre: "",
      apellidos: "",
      edad: 0,
      sexo: true,
      historial_trauma_craneal: false,
      manualidad: true,
      antecedentes_familiares: false,
    }
    const { numero, seudonimo, rcg, episodios, ...editableData } = datos
    setFormData({ ...defaultValues, ...editableData })
    setErrors({})
    setEditing(true)
  }

  const handleCancel = () => {
    setEditing(false)
    setErrors({})
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    // Validación especial para campos de nombre y apellidos
    if (name === "nombre" || name === "apellidos") {
      if (!isValidNameInput(value)) {
        return
      }
    }

    let newValue = value
    if (type === "checkbox") {
      newValue = checked
    } else if (type === "number") {
      newValue = Number.parseInt(value)
    } else if (type === "select" && (value === "true" || value === "false")) {
      newValue = value === "true"
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  // Validar formulario antes del envío
  const validateForm = () => {
    const newErrors = {}

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    } else {
      const nombreError = validateTextWithoutNumbers(formData.nombre, "nombre")
      if (nombreError) {
        newErrors.nombre = nombreError
      }
    }

    // Validar apellidos
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = "Los apellidos son requeridos"
    } else {
      const apellidosError = validateTextWithoutNumbers(formData.apellidos, "apellidos")
      if (apellidosError) {
        newErrors.apellidos = apellidosError
      }
    }

    // Validar edad (cambiado a 0-120)
    if (formData.edad < 0 || formData.edad > 120) {
      newErrors.edad = "La edad debe estar entre 0 y 120 años"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar formulario antes del envío
    if (!validateForm()) {
      error("Por favor, corrija los errores en el formulario antes de continuar")
      return
    }

    setLoading(true)

    try {
      const dataToSend = {
        id: datos.id,
        numero: datos.numero,
        seudonimo: datos.seudonimo,
        nombre: formData.nombre.trim(),
        apellidos: formData.apellidos.trim(),
        edad: formData.edad,
        sexo: formData.sexo,
        historial_trauma_craneal: formData.historial_trauma_craneal,
        manualidad: formData.manualidad,
        antecedentes_familiares: formData.antecedentes_familiares,
      }

      const nombrePrefix = dataToSend.nombre.substring(0, 2).toUpperCase()
      const apellidoPrefix = dataToSend.apellidos.substring(0, 2).toUpperCase()
      const numeroSuffix = dataToSend.numero.slice(-4)
      dataToSend.seudonimo = `${nombrePrefix}${apellidoPrefix}${numeroSuffix}`

      const response = await axios.put(`${apiUrl}gestionar_historia_clinica/${datos.id}/`, dataToSend)
      dispatch(setHistoriaClinica(response.data))
      setEditing(false)
      setErrors({})

      // Usar el alert personalizado en lugar del alert nativo
      success(
        `Información actualizada correctamente.
        
Seudónimo: ${response.data.seudonimo}

Por favor, tome nota de este dato.`,
        "Actualización Exitosa",
      )
    } catch (error) {
      console.error("Error al actualizar:", error)
      error("Error al actualizar la información")
    } finally {
      setLoading(false)
    }
  }

  const campos = editing
    ? [
        { label: "Nombre", key: "nombre", type: "text" },
        { label: "Apellidos", key: "apellidos", type: "text" },
        { label: "Edad", key: "edad", type: "number" },
        {
          label: "Sexo",
          key: "sexo",
          type: "select",
          options: [
            { value: true, label: "Masculino" },
            { value: false, label: "Femenino" },
          ],
        },
        {
          label: "Historial de trauma craneal",
          key: "historial_trauma_craneal",
          type: "checkbox",
        },
        {
          label: "Manualidad",
          key: "manualidad",
          type: "select",
          options: [
            { value: true, label: "Derecha" },
            { value: false, label: "Izquierda" },
          ],
        },
        {
          label: "Antecedentes familiares",
          key: "antecedentes_familiares",
          type: "checkbox",
        },
      ]
    : [
        { label: "Número", key: "numero", type: "text", readOnly: true },
        { label: "Seudónimo", key: "seudonimo", type: "text", readOnly: true },
        { label: "Nombre", key: "nombre", type: "text" },
        { label: "Apellidos", key: "apellidos", type: "text" },
        { label: "Edad", key: "edad", type: "number" },
        {
          label: "Sexo",
          key: "sexo",
          type: "select",
          options: [
            { value: true, label: "Masculino" },
            { value: false, label: "Femenino" },
          ],
        },
        {
          label: "Historial de trauma craneal",
          key: "historial_trauma_craneal",
          type: "checkbox",
        },
        {
          label: "Manualidad",
          key: "manualidad",
          type: "select",
          options: [
            { value: true, label: "Derecha" },
            { value: false, label: "Izquierda" },
          ],
        },
        {
          label: "Antecedentes familiares",
          key: "antecedentes_familiares",
          type: "checkbox",
        },
      ]

  const renderField = (campo) => {
    const value = formData[campo.key] ?? ""
    const hasError = errors[campo.key]

    if (campo.type === "select") {
      return (
        <div>
          <select
            name={campo.key}
            value={String(value)}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
              hasError ? "border-red-500" : "border-gray-300"
            }`}
            disabled={campo.readOnly}
          >
            {campo.options.map((option) => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
          {hasError && <p className="mt-1 text-sm text-red-600">{hasError}</p>}
        </div>
      )
    } else if (campo.type === "checkbox") {
      return (
        <div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name={campo.key}
              checked={formData[campo.key]}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={campo.readOnly}
            />
            <span className="ml-2 text-gray-900">{formData[campo.key] ? "Sí" : "No"}</span>
          </div>
          {hasError && <p className="mt-1 text-sm text-red-600">{hasError}</p>}
        </div>
      )
    } else {
      return (
        <div>
          <input
            type={campo.type}
            name={campo.key}
            value={formData[campo.key]}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
              hasError ? "border-red-500" : "border-gray-300"
            }`}
            readOnly={campo.readOnly}
            placeholder={
              campo.key === "nombre"
                ? "Solo letras y espacios"
                : campo.key === "apellidos"
                  ? "Solo letras y espacios"
                  : campo.key === "edad"
                    ? "Entre 0 y 120 años"
                    : ""
            }
          />
          {hasError && <p className="mt-1 text-sm text-red-600">{hasError}</p>}
        </div>
      )
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
          Información Básica
        </Typography>
        {!editing ? (
          <Button
            onClick={handleEdit}
            variant="contained"
            sx={{ textTransform: "none" }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center"
          >
            <Edit size={16} className="mr-1" />
            Editar
          </Button>
        ) : null}
      </Box>

      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campos.map((campo) => (
              <div key={campo.key} className="mb-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  {campo.label}
                </label>
                {renderField(campo)}
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      ) : (
        <Card variant="outlined">
          <CardHeader
            title="Información del Paciente"
            sx={{
              bgcolor: "grey.50",
              borderBottom: "1px solid",
              borderColor: "divider",
              py: 2,
            }}
          />
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              {campos.map((campo) => (
                <InfoFieldCompact
                  key={campo.key}
                  label={campo.label}
                  value={formatValue(campo.key, datos[campo.key])}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
