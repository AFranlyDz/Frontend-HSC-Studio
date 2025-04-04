"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { InfoField } from "./InfoField"
import { useFormatValue } from "@/hooks/useFormatValue"
import { Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { setHistoriaClinica } from "@/features/gestionarHistoriaClinica/historiaClinicaSlice"

export const InformacionBasicaPanel = () => {
  const { datos } = useSelector((state) => state.historiaClinica)
  const { formatValue } = useFormatValue()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const apiUrl = import.meta.env.VITE_API_BACKEND

  // Modificar la función handleEdit para no incluir los campos no editables
  const handleEdit = () => {
    // Excluir numero y seudonimo del formulario de edición
    const { numero, seudonimo, ...editableData } = datos
    setFormData(editableData)
    setEditing(true)
  }

  // Cancelar edición
  const handleCancel = () => {
    setEditing(false)
  }

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

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
  }

  // Modificar el handleSubmit para actualizar el seudónimo correctamente y mostrar un mensaje con el nuevo valor, similar a RevisionCasos.jsx
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Crear un objeto con solo los campos necesarios
      const dataToSend = {
        id: datos.id,
        numero: datos.numero, // Usar el valor original, no del formulario
        seudonimo: datos.seudonimo, // Usar el valor original, no del formulario
        nombre: formData.nombre,
        apellidos: formData.apellidos,
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

      // Mostrar mensaje con el seudónimo actualizado, similar a RevisionCasos.jsx
      alert(
        `Información actualizada correctamente.
        
Seudónimo: ${response.data.seudonimo}

Por favor, tome nota de este dato.`,
      )
    } catch (error) {
      console.error("Error al actualizar:", error)
      alert("Error al actualizar la información")
    } finally {
      setLoading(false)
    }
  }

  // Modificar la lista de campos para no mostrar numero y seudonimo en modo edición
  // Campos a mostrar (excluyendo el id)
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

  // Renderizar campo según su tipo
  const renderField = (campo) => {
    if (campo.type === "select") {
      return (
        <select
          name={campo.key}
          value={formData[campo.key].toString()}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          disabled={campo.readOnly}
        >
          {campo.options.map((option) => (
            <option key={option.value.toString()} value={option.value.toString()}>
              {option.label}
            </option>
          ))}
        </select>
      )
    } else if (campo.type === "checkbox") {
      return (
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
      )
    } else {
      return (
        <input
          type={campo.type}
          name={campo.key}
          value={formData[campo.key]}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          readOnly={campo.readOnly}
        />
      )
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          Información Básica
        </h2>
        {!editing ? (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center"
          >
            <Edit size={16} className="mr-1" />
            Editar
          </button>
        ) : null}
      </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campos.map((campo) => (
            <InfoField key={campo.key} label={campo.label} value={formatValue(campo.key, datos[campo.key])} />
          ))}
        </div>
      )}
    </div>
  )
}

