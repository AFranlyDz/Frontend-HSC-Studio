"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  validateScaleRange,
  validateMeasurement,
  filterNumericInput,
  LOCALIZACION_OPTIONS,
  METODO_LECTURA_OPTIONS,
  TOPOGRAFIA_OPTIONS,
} from "@/utils/hematomaValidationUtils"

export function HematomaSubduralForm({ initialData, onSubmit, isLoading, onCancel }) {
  const [formData, setFormData] = useState({
    id: null,
    escala_glasgow_ingreso: 15,
    escala_mcwalder: 1,
    escala_gordon_firing: 1,
    escala_pronostica_oslo_preoperatoria: 1,
    escala_nomura: 1,
    escala_nakagushi: 1,
    valor_longitud: 0,
    valor_diametro: 0,
    valor_altura: 0,
    volumen_tada: 0,
    volumen: 0,
    grupo_volumen: 1,
    grupo_volumen_residual_posoperatorio: 1,
    diametro_capa: 0,
    diametro_mayor_transverso: 0,
    grupo_diametro: 1,
    presencia_membrana: false,
    tipo_membrana: 1,
    localización: 0,
    topografia: "",
    desviacion_linea_media: 0,
    metodo_lectura: false,
    observaciones: "",
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Actualizar el formulario si cambian los datos iniciales
  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        escala_glasgow_ingreso: initialData.escala_glasgow_ingreso || 15,
        escala_mcwalder: initialData.escala_mcwalder || 1,
        escala_gordon_firing: initialData.escala_gordon_firing || 1,
        escala_pronostica_oslo_preoperatoria: initialData.escala_pronostica_oslo_preoperatoria || 1,
        escala_nomura: initialData.escala_nomura || 1,
        escala_nakagushi: initialData.escala_nakagushi || 1,
        valor_longitud: initialData.valor_longitud ?? 0,
        valor_diametro: initialData.valor_diametro ?? 0,
        valor_altura: initialData.valor_altura ?? 0,
        volumen_tada: initialData.volumen_tada ?? 0,
        volumen: initialData.volumen ?? 0,
        grupo_volumen: initialData.grupo_volumen || 1,
        grupo_volumen_residual_posoperatorio: initialData.grupo_volumen_residual_posoperatorio || 1,
        diametro_capa: initialData.diametro_capa ?? 0,
        diametro_mayor_transverso: initialData.diametro_mayor_transverso ?? 0,
        grupo_diametro: initialData.grupo_diametro || 1,
        presencia_membrana: initialData.presencia_membrana || false,
        tipo_membrana: initialData.tipo_membrana || 1,
        localización: initialData.localización ?? 0,
        topografia: initialData.topografia || "",
        desviacion_linea_media: initialData.desviacion_linea_media ?? 0,
        metodo_lectura: initialData.metodo_lectura || false,
        observaciones: initialData.observaciones || "",
      })
    }
  }, [initialData])

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    let newValue = value

    // Filtrar entrada para campos numéricos
    if (
      [
        "escala_glasgow_ingreso",
        "escala_mcwalder",
        "escala_gordon_firing",
        "escala_pronostica_oslo_preoperatoria",
        "escala_nomura",
        "escala_nakagushi",
        "grupo_volumen",
        "grupo_volumen_residual_posoperatorio",
        "grupo_diametro",
        "tipo_membrana",
      ].includes(name)
    ) {
      newValue = filterNumericInput(value, false) // Solo enteros
    } else if (
      [
        "valor_longitud",
        "valor_diametro",
        "valor_altura",
        "volumen_tada",
        "volumen",
        "diametro_capa",
        "diametro_mayor_transverso",
        "desviacion_linea_media",
      ].includes(name)
    ) {
      newValue = filterNumericInput(value, true) // Permite decimales
    }

    // Manejar diferentes tipos de inputs
    if (type === "checkbox") {
      newValue = checked
    } else if (name === "localización" || name === "metodo_lectura") {
      newValue = value === "true" ? true : value === "false" ? false : Number(value)
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
    validateField(name, value)
  }

  const validateField = (fieldName, value) => {
    let validation = { isValid: true, error: null }

    switch (fieldName) {
      case "escala_glasgow_ingreso":
        validation = validateScaleRange(value, 3, 15, "Escala Glasgow")
        break
      case "escala_mcwalder":
        validation = validateScaleRange(value, 1, 4, "Escala McWalder")
        break
      case "escala_gordon_firing":
        validation = validateScaleRange(value, 1, 4, "Escala Gordon-Firing")
        break
      case "escala_pronostica_oslo_preoperatoria":
        validation = validateScaleRange(value, 1, 5, "Escala Oslo Preoperatoria")
        break
      case "escala_nomura":
        validation = validateScaleRange(value, 1, 5, "Escala Nomura")
        break
      case "escala_nakagushi":
        validation = validateScaleRange(value, 1, 4, "Escala Nakagushi")
        break
      case "grupo_volumen":
        validation = validateScaleRange(value, 1, 4, "Grupo Volumen")
        break
      case "grupo_volumen_residual_posoperatorio":
        validation = validateScaleRange(value, 1, 4, "Grupo Volumen Residual")
        break
      case "grupo_diametro":
        validation = validateScaleRange(value, 1, 4, "Grupo Diámetro")
        break
      case "valor_longitud":
      case "valor_diametro":
      case "valor_altura":
      case "volumen_tada":
      case "volumen":
      case "diametro_capa":
      case "diametro_mayor_transverso":
      case "desviacion_linea_media":
        validation = validateMeasurement(value, fieldName.replace("_", " "))
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

    // Validar todas las escalas
    const scaleValidations = [
      { field: "escala_glasgow_ingreso", min: 3, max: 15, name: "Escala Glasgow" },
      { field: "escala_mcwalder", min: 1, max: 4, name: "Escala McWalder" },
      { field: "escala_gordon_firing", min: 1, max: 4, name: "Escala Gordon-Firing" },
      { field: "escala_pronostica_oslo_preoperatoria", min: 1, max: 5, name: "Escala Oslo Preoperatoria" },
      { field: "escala_nomura", min: 1, max: 5, name: "Escala Nomura" },
      { field: "escala_nakagushi", min: 1, max: 4, name: "Escala Nakagushi" },
      { field: "grupo_volumen", min: 1, max: 4, name: "Grupo Volumen" },
      { field: "grupo_volumen_residual_posoperatorio", min: 1, max: 4, name: "Grupo Volumen Residual" },
      { field: "grupo_diametro", min: 1, max: 4, name: "Grupo Diámetro" },
    ]

    scaleValidations.forEach(({ field, min, max, name }) => {
      const validation = validateScaleRange(formData[field], min, max, name)
      if (!validation.isValid) {
        newErrors[field] = validation.error
      }
    })

    // Validar mediciones
    const measurementFields = [
      "valor_longitud",
      "valor_diametro",
      "valor_altura",
      "volumen_tada",
      "volumen",
      "diametro_capa",
      "diametro_mayor_transverso",
      "desviacion_linea_media",
    ]

    measurementFields.forEach((field) => {
      const validation = validateMeasurement(formData[field], field.replace("_", " "))
      if (!validation.isValid) {
        newErrors[field] = validation.error
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault()

    // Marcar todos los campos como tocados
    const allFields = Object.keys(formData)
    const touchedFields = {}
    allFields.forEach((field) => {
      touchedFields[field] = true
    })
    setTouched(touchedFields)

    if (!validateForm()) {
      return
    }

    // Procesar datos antes del envío
    const processedData = { ...formData }

    // Asegurar que los campos numéricos requeridos tengan valores válidos
    const requiredNumericFields = [
      "valor_longitud",
      "valor_diametro",
      "valor_altura",
      "volumen_tada",
      "volumen",
      "diametro_capa",
      "diametro_mayor_transverso",
      "desviacion_linea_media",
    ]

    requiredNumericFields.forEach((field) => {
      const value = processedData[field]
      if (value === "" || value === null || value === undefined || isNaN(Number(value))) {
        processedData[field] = 0
      } else {
        processedData[field] = Number(value)
      }
    })

    // Asegurar que las escalas tengan valores válidos
    const scaleFields = [
      "escala_glasgow_ingreso",
      "escala_mcwalder",
      "escala_gordon_firing",
      "escala_pronostica_oslo_preoperatoria",
      "escala_nomura",
      "escala_nakagushi",
      "grupo_volumen",
      "grupo_volumen_residual_posoperatorio",
      "grupo_diametro",
      "tipo_membrana",
    ]

    scaleFields.forEach((field) => {
      processedData[field] = Number(processedData[field]) || (field === "escala_glasgow_ingreso" ? 15 : 1)
    })

    onSubmit(processedData)
  }

  const getFieldError = (fieldName) => {
    return errors[fieldName] && touched[fieldName] ? errors[fieldName] : null
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Escalas Clínicas */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Escalas Clínicas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Escala Glasgow al ingreso <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-1">(3-15)</span>
            </label>
            <input
              type="text"
              name="escala_glasgow_ingreso"
              value={formData.escala_glasgow_ingreso}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getFieldError("escala_glasgow_ingreso") ? "border-red-500" : "border-gray-300"
              }`}
            />
            {getFieldError("escala_glasgow_ingreso") && (
              <p className="mt-1 text-sm text-red-600">{getFieldError("escala_glasgow_ingreso")}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Escala McWalder <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-1">(1-4)</span>
            </label>
            <input
              type="text"
              name="escala_mcwalder"
              value={formData.escala_mcwalder}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getFieldError("escala_mcwalder") ? "border-red-500" : "border-gray-300"
              }`}
            />
            {getFieldError("escala_mcwalder") && (
              <p className="mt-1 text-sm text-red-600">{getFieldError("escala_mcwalder")}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Escala Gordon-Firing <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-1">(1-4)</span>
            </label>
            <input
              type="text"
              name="escala_gordon_firing"
              value={formData.escala_gordon_firing}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getFieldError("escala_gordon_firing") ? "border-red-500" : "border-gray-300"
              }`}
            />
            {getFieldError("escala_gordon_firing") && (
              <p className="mt-1 text-sm text-red-600">{getFieldError("escala_gordon_firing")}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Escala Oslo Preoperatoria <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-1">(1-5)</span>
            </label>
            <input
              type="text"
              name="escala_pronostica_oslo_preoperatoria"
              value={formData.escala_pronostica_oslo_preoperatoria}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getFieldError("escala_pronostica_oslo_preoperatoria") ? "border-red-500" : "border-gray-300"
              }`}
            />
            {getFieldError("escala_pronostica_oslo_preoperatoria") && (
              <p className="mt-1 text-sm text-red-600">{getFieldError("escala_pronostica_oslo_preoperatoria")}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Escala Nomura <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-1">(1-5)</span>
            </label>
            <input
              type="text"
              name="escala_nomura"
              value={formData.escala_nomura}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getFieldError("escala_nomura") ? "border-red-500" : "border-gray-300"
              }`}
            />
            {getFieldError("escala_nomura") && (
              <p className="mt-1 text-sm text-red-600">{getFieldError("escala_nomura")}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Escala Nakagushi <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-1">(1-4)</span>
            </label>
            <input
              type="text"
              name="escala_nakagushi"
              value={formData.escala_nakagushi}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getFieldError("escala_nakagushi") ? "border-red-500" : "border-gray-300"
              }`}
            />
            {getFieldError("escala_nakagushi") && (
              <p className="mt-1 text-sm text-red-600">{getFieldError("escala_nakagushi")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Mediciones */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Mediciones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitud (mm)
              <span className="text-xs text-gray-500 ml-1">(≥ 0)</span>
            </label>
            <input
              type="text"
              name="valor_longitud"
              value={formData.valor_longitud}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0.0"
              className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getFieldError("valor_longitud") ? "border-red-500" : "border-gray-300"
              }`}
            />
            {getFieldError("valor_longitud") && (
              <p className="mt-1 text-sm text-red-600">{getFieldError("valor_longitud")}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diámetro (mm)
              <span className="text-xs text-gray-500 ml-1">(≥ 0)</span>
            </label>
            <input
              type="text"
              name="valor_diametro"
              value={formData.valor_diametro}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0.0"
              className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getFieldError("valor_diametro") ? "border-red-500" : "border-gray-300"
              }`}
            />
            {getFieldError("valor_diametro") && (
              <p className="mt-1 text-sm text-red-600">{getFieldError("valor_diametro")}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Altura (mm)
              <span className="text-xs text-gray-500 ml-1">(≥ 0)</span>
            </label>
            <input
              type="text"
              name="valor_altura"
              value={formData.valor_altura}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0.0"
              className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getFieldError("valor_altura") ? "border-red-500" : "border-gray-300"
              }`}
            />
            {getFieldError("valor_altura") && (
              <p className="mt-1 text-sm text-red-600">{getFieldError("valor_altura")}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Volumen Tada (ml)
              <span className="text-xs text-gray-500 ml-1">(≥ 0)</span>
            </label>
            <input
              type="text"
              name="volumen_tada"
              value={formData.volumen_tada}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0.0"
              className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getFieldError("volumen_tada") ? "border-red-500" : "border-gray-300"
              }`}
            />
            {getFieldError("volumen_tada") && (
              <p className="mt-1 text-sm text-red-600">{getFieldError("volumen_tada")}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Volumen (ml)
              <span className="text-xs text-gray-500 ml-1">(≥ 0)</span>
            </label>
            <input
              type="text"
              name="volumen"
              value={formData.volumen}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0.0"
              className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getFieldError("volumen") ? "border-red-500" : "border-gray-300"
              }`}
            />
            {getFieldError("volumen") && <p className="mt-1 text-sm text-red-600">{getFieldError("volumen")}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diámetro de la capa (mm)
              <span className="text-xs text-gray-500 ml-1">(≥ 0)</span>
            </label>
            <input
              type="text"
              name="diametro_capa"
              value={formData.diametro_capa}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0.0"
              className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getFieldError("diametro_capa") ? "border-red-500" : "border-gray-300"
              }`}
            />
            {getFieldError("diametro_capa") && (
              <p className="mt-1 text-sm text-red-600">{getFieldError("diametro_capa")}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diámetro mayor transverso (mm)
              <span className="text-xs text-gray-500 ml-1">(≥ 0)</span>
            </label>
            <input
              type="text"
              name="diametro_mayor_transverso"
              value={formData.diametro_mayor_transverso}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0.0"
              className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getFieldError("diametro_mayor_transverso") ? "border-red-500" : "border-gray-300"
              }`}
            />
            {getFieldError("diametro_mayor_transverso") && (
              <p className="mt-1 text-sm text-red-600">{getFieldError("diametro_mayor_transverso")}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Desviación línea media (mm)
              <span className="text-xs text-gray-500 ml-1">(≥ 0)</span>
            </label>
            <input
              type="text"
              name="desviacion_linea_media"
              value={formData.desviacion_linea_media}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0.0"
              className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getFieldError("desviacion_linea_media") ? "border-red-500" : "border-gray-300"
              }`}
            />
            {getFieldError("desviacion_linea_media") && (
              <p className="mt-1 text-sm text-red-600">{getFieldError("desviacion_linea_media")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Grupos y Clasificaciones */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Grupos y Clasificaciones</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grupo Volumen <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-1">(1-4)</span>
            </label>
            <input
              type="text"
              name="grupo_volumen"
              value={formData.grupo_volumen}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getFieldError("grupo_volumen") ? "border-red-500" : "border-gray-300"
              }`}
            />
            {getFieldError("grupo_volumen") && (
              <p className="mt-1 text-sm text-red-600">{getFieldError("grupo_volumen")}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grupo Volumen Residual <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-1">(1-4)</span>
            </label>
            <input
              type="text"
              name="grupo_volumen_residual_posoperatorio"
              value={formData.grupo_volumen_residual_posoperatorio}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getFieldError("grupo_volumen_residual_posoperatorio") ? "border-red-500" : "border-gray-300"
              }`}
            />
            {getFieldError("grupo_volumen_residual_posoperatorio") && (
              <p className="mt-1 text-sm text-red-600">{getFieldError("grupo_volumen_residual_posoperatorio")}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grupo Diámetro <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-1">(1-4)</span>
            </label>
            <input
              type="text"
              name="grupo_diametro"
              value={formData.grupo_diametro}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getFieldError("grupo_diametro") ? "border-red-500" : "border-gray-300"
              }`}
            />
            {getFieldError("grupo_diametro") && (
              <p className="mt-1 text-sm text-red-600">{getFieldError("grupo_diametro")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Características Específicas */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Características Específicas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Presencia de membrana */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="presencia_membrana"
              checked={formData.presencia_membrana}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Presencia de membrana</label>
          </div>

          {/* Tipo de membrana - solo si hay membrana */}
          {formData.presencia_membrana && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de membrana</label>
              <input
                type="text"
                name="tipo_membrana"
                value={formData.tipo_membrana}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Localización */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Localización</label>
            <select
              name="localización"
              value={formData.localización}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LOCALIZACION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Topografía */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Topografía</label>
            <input
              list="topografia-options"
              name="topografia"
              value={formData.topografia}
              onChange={handleChange}
              placeholder="Seleccione o escriba una opción"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <datalist id="topografia-options">
              {TOPOGRAFIA_OPTIONS.map((option, index) => (
                <option key={index} value={option} />
              ))}
            </datalist>
          </div>

          {/* Método de lectura */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Método de lectura</label>
            <select
              name="metodo_lectura"
              value={formData.metodo_lectura}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {METODO_LECTURA_OPTIONS.map((option) => (
                <option key={String(option.value)} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Observaciones */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
        <textarea
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          rows={3}
          placeholder="Ingrese observaciones adicionales..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
