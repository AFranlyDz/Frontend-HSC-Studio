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
import { displayValueOrDash, formatBooleanOrDash } from "@/libs/displayUtils"

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

  const handleEdit = () => {
    setEditing(true)
    setFormData({
      nombre: datos.nombre || "",
      apellidos: datos.apellidos || "",
      edad: datos.edad || 0,
      sexo: datos.sexo || true,
      historial_trauma_craneal: datos.historial_trauma_craneal || false,
      manualidad: datos.manualidad || true,
      antecedentes_familiares: datos.antecedentes_familiares || false,
    })
  }

  const handleCancel = () => {
    setEditing(false)
    setErrors({})
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.nombre) {
      errors.nombre = "El nombre es requerido"
    }
    if (!formData.apellidos) {
      errors.apellidos = "Los apellidos son requeridos"
    }
    if (!formData.edad) {
      errors.edad = "La edad es requerida"
    } else if (isNaN(formData.edad) || formData.edad <= 0) {
      errors.edad = "La edad debe ser un número positivo"
    }
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const response = await axios.put(`${apiUrl}/pacientes/${datos.id}`, formData)
      if (response.status === 200) {
        success("Información básica actualizada con éxito")
        dispatch(setHistoriaClinica({ ...datos, ...formData }))
        setEditing(false)
        setErrors({})
      } else {
        error("Error al actualizar la información básica")
      }
    } catch (err) {
      console.error("Error al actualizar:", err)
      error("Error al actualizar la información básica")
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
              <div key={campo.key}>
                <label htmlFor={campo.key} className="block text-sm font-medium text-gray-700">
                  {campo.label}
                </label>
                {campo.type === "text" || campo.type === "number" ? (
                  <input
                    type={campo.type}
                    name={campo.key}
                    id={campo.key}
                    value={formData[campo.key]}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-300"
                  />
                ) : campo.type === "select" ? (
                  <select
                    name={campo.key}
                    id={campo.key}
                    value={formData[campo.key]}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-300"
                  >
                    {campo.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name={campo.key}
                      checked={formData[campo.key]}
                      onChange={handleChange}
                      className="mr-2 h-5 w-5 text-blue-600 border rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-300"
                    />
                    {campo.label}
                  </label>
                )}
                {errors[campo.key] && <p className="text-red-500 text-xs mt-1">{errors[campo.key]}</p>}
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outlined"
              onClick={handleCancel}
              disabled={loading}
              sx={{ textTransform: "none" }}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ textTransform: "none" }}>
              {loading ? "Guardando..." : "Guardar"}
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
