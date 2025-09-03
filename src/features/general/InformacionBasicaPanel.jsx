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
import { displayValueOrDash, formatBooleanOrDash } from "@/utils/displayUtils"
import { validateNameField, validateAge, filterNameInput, filterAgeInput } from "@/utils/validationUtils"

export const InformacionBasicaPanel = () => {
  const { datos } = useSelector((state) => state.historiaClinica)
  const { formatValue } = useFormatValue()
  const { warning, success, error } = useCustomAlert()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    edad: "",
    sexo: true,
    historial_trauma_craneal: false,
    manualidad: true,
    antecedentes_familiares: false,
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const dispatch = useDispatch()
  const apiUrl = import.meta.env.VITE_API_BACKEND

  const handleEdit = () => {
    setEditing(true)
    setFormData({
      nombre: datos.nombre || "",
      apellidos: datos.apellidos || "",
      edad: datos.edad || "",
      sexo: datos.sexo !== undefined ? datos.sexo : true,
      historial_trauma_craneal: datos.historial_trauma_craneal || false,
      manualidad: datos.manualidad !== undefined ? datos.manualidad : true,
      antecedentes_familiares: datos.antecedentes_familiares || false,
    })
    setErrors({})
    setTouched({})
  }

  const handleCancel = () => {
    setEditing(false)
    setErrors({})
    setTouched({})
  }

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

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : type === "select-one" ? value === "true" : newValue,
    }))

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Marcar todos los campos como tocados
    setTouched({
      nombre: true,
      apellidos: true,
      edad: true,
    })

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
        edad: Number.parseInt(formData.edad),
        sexo: formData.sexo,
        historial_trauma_craneal: formData.historial_trauma_craneal,
        manualidad: formData.manualidad,
        antecedentes_familiares: formData.antecedentes_familiares,
      }

      // Generar nuevo seudónimo
      const nombrePrefix = dataToSend.nombre.substring(0, 2).toUpperCase()
      const apellidoPrefix = dataToSend.apellidos.substring(0, 2).toUpperCase()
      const numeroSuffix = dataToSend.numero.slice(-4)
      dataToSend.seudonimo = `${nombrePrefix}${apellidoPrefix}${numeroSuffix}`

      const response = await axios.put(`${apiUrl}gestionar_historia_clinica/${datos.id}/`, dataToSend)
      dispatch(setHistoriaClinica(response.data))
      setEditing(false)
      setErrors({})
      setTouched({})

      success(
        `Información actualizada correctamente.
        
Seudónimo: ${response.data.seudonimo}

Por favor, tome nota de este dato.`,
        "Actualización Exitosa",
      )
    } catch (err) {
      console.error("Error al actualizar:", err)
      error("Error al actualizar la información básica")
    } finally {
      setLoading(false)
    }
  }

  const campos = editing
    ? [
        { label: "Nombre", key: "nombre", type: "text", required: true },
        { label: "Apellidos", key: "apellidos", type: "text", required: true },
        { label: "Edad", key: "edad", type: "number", required: true },
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
        {
          label: "Número",
          key: "numero",
          value: displayValueOrDash(datos.numero),
        },
        {
          label: "Seudónimo",
          key: "seudonimo",
          value: displayValueOrDash(datos.seudonimo),
        },
        {
          label: "Nombre",
          key: "nombre",
          value: displayValueOrDash(datos.nombre),
        },
        {
          label: "Apellidos",
          key: "apellidos",
          value: displayValueOrDash(datos.apellidos),
        },
        {
          label: "Edad",
          key: "edad",
          value: displayValueOrDash(datos.edad),
        },
        {
          label: "Sexo",
          key: "sexo",
          value: formatBooleanOrDash(datos.sexo, "Masculino", "Femenino"),
        },
        {
          label: "Historial de trauma craneal",
          key: "historial_trauma_craneal",
          value: formatBooleanOrDash(datos.historial_trauma_craneal),
        },
        {
          label: "Manualidad",
          key: "manualidad",
          value: formatBooleanOrDash(datos.manualidad, "Derecha", "Izquierda"),
        },
        {
          label: "Antecedentes familiares",
          key: "antecedentes_familiares",
          value: formatBooleanOrDash(datos.antecedentes_familiares),
        },
      ]

  const renderField = (campo) => {
    const value = formData[campo.key] ?? ""
    const hasError = errors[campo.key] && touched[campo.key]

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
          >
            {campo.options.map((option) => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
          {hasError && <p className="mt-1 text-sm text-red-600">{errors[campo.key]}</p>}
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
            />
            <span className="ml-2 text-gray-900">{formData[campo.key] ? "Sí" : "No"}</span>
          </div>
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
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
              hasError ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={
              campo.key === "nombre" || campo.key === "apellidos"
                ? "Mínimo 2 letras, solo caracteres alfabéticos"
                : campo.key === "edad"
                  ? "Entre 0 y 121 años"
                  : ""
            }
            min={campo.key === "edad" ? "0" : undefined}
            max={campo.key === "edad" ? "121" : undefined}
          />
          {hasError && <p className="mt-1 text-sm text-red-600">{errors[campo.key]}</p>}
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
                  {campo.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(campo)}
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              type="button"
              variant="outlined"
              onClick={handleCancel}
              disabled={loading}
              sx={{ textTransform: "none" }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} sx={{ textTransform: "none" }}>
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
                <InfoFieldCompact key={campo.key} label={campo.label} value={campo.value} />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
