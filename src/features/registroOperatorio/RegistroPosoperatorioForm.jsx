"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Button, TextField, Checkbox, FormControlLabel, Box, Typography } from "@mui/material"
import {
  validateFechaPosoperatorio,
  validateEscalaOsloPostoperatoria,
  validateGradacionPronostica,
  calcularTiempoTranscurrido,
  filterScaleInput,
} from "@/utils/registroPosoperatorioValidationUtils"

export function RegistroPosoperatorioForm({ initialData, onSubmit, isLoading, onCancel, registroOperatorioId }) {
  const { datos: paciente } = useSelector((state) => state.historiaClinica)

  // Obtener el registro operatorio y episodio específicos
  const registroOperatorio = paciente?.episodios
    ?.flatMap((ep) => ep.registro_operatorio || [])
    ?.find((ro) => ro.id === registroOperatorioId)

  const episodio = paciente?.episodios?.find((ep) =>
    ep.registro_operatorio?.some((ro) => ro.id === registroOperatorioId),
  )

  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    fecha: "",
    tiempo_transcurrido: 0,
    escala_pronostica_oslo_posoperatoria: "",
    recurrencia_hematoma: false,
    gradacion_pronostica_para_recurrencia_hsc_unilateral: "",
  })

  // Estado para errores de validación
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Actualizar el formulario si cambian los datos iniciales
  useEffect(() => {
    if (initialData) {
      const tiempoCalculado = calcularTiempoTranscurrido(registroOperatorio?.fecha_operacion, initialData.fecha)

      setFormData({
        fecha: initialData.fecha || "",
        tiempo_transcurrido: tiempoCalculado,
        escala_pronostica_oslo_posoperatoria: initialData.escala_pronostica_oslo_posoperatoria || "",
        recurrencia_hematoma: initialData.recurrencia_hematoma || false,
        gradacion_pronostica_para_recurrencia_hsc_unilateral:
          initialData.gradacion_pronostica_para_recurrencia_hsc_unilateral || "",
      })
    }
  }, [initialData, registroOperatorio?.fecha_operacion])

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    let newValue = value

    // Filtrar entrada para campos específicos
    if (name === "escala_pronostica_oslo_posoperatoria") {
      newValue = filterScaleInput(value, false) // Solo enteros
      if (newValue.length > 2) {
        newValue = newValue.slice(0, 2)
      }
    } else if (name === "gradacion_pronostica_para_recurrencia_hsc_unilateral") {
      newValue = filterScaleInput(value, true) // Permite decimales
      if (newValue.length > 6) {
        // Máximo 3 dígitos enteros + punto + 2 decimales
        newValue = newValue.slice(0, 6)
      }
    }

    // Manejar diferentes tipos de inputs
    if (type === "checkbox") {
      newValue = checked
    }

    const updatedFormData = {
      ...formData,
      [name]: newValue,
    }

    // Calcular tiempo transcurrido automáticamente cuando cambia la fecha
    if (name === "fecha") {
      updatedFormData.tiempo_transcurrido = calcularTiempoTranscurrido(registroOperatorio?.fecha_operacion, newValue)
    }

    setFormData(updatedFormData)

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    validateField(name, formData[name])
  }

  const validateField = (fieldName, value) => {
    let validation = { isValid: true, error: null }

    switch (fieldName) {
      case "fecha":
        validation = validateFechaPosoperatorio(value, registroOperatorio?.fecha_operacion, episodio?.fecha_alta)
        break
      case "escala_pronostica_oslo_posoperatoria":
        validation = validateEscalaOsloPostoperatoria(value)
        break
      case "gradacion_pronostica_para_recurrencia_hsc_unilateral":
        validation = validateGradacionPronostica(value)
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

    // Validar fecha
    if (formData.fecha) {
      const validacionFecha = validateFechaPosoperatorio(
        formData.fecha,
        registroOperatorio?.fecha_operacion,
        episodio?.fecha_alta,
      )
      if (!validacionFecha.isValid) {
        newErrors.fecha = validacionFecha.error
      }
    }

    // Validar escala Oslo
    const validacionOslo = validateEscalaOsloPostoperatoria(formData.escala_pronostica_oslo_posoperatoria)
    if (!validacionOslo.isValid) {
      newErrors.escala_pronostica_oslo_posoperatoria = validacionOslo.error
    }

    // Validar gradación pronóstica
    const validacionGradacion = validateGradacionPronostica(
      formData.gradacion_pronostica_para_recurrencia_hsc_unilateral,
    )
    if (!validacionGradacion.isValid) {
      newErrors.gradacion_pronostica_para_recurrencia_hsc_unilateral = validacionGradacion.error
    }

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

    // Preparar datos para envío
    const datosEnviar = {
      ...formData,
      tiempo_transcurrido: calcularTiempoTranscurrido(registroOperatorio?.fecha_operacion, formData.fecha),
      escala_pronostica_oslo_posoperatoria: formData.escala_pronostica_oslo_posoperatoria
        ? Number(formData.escala_pronostica_oslo_posoperatoria)
        : null,
      gradacion_pronostica_para_recurrencia_hsc_unilateral:
        formData.gradacion_pronostica_para_recurrencia_hsc_unilateral
          ? Number(formData.gradacion_pronostica_para_recurrencia_hsc_unilateral)
          : null,
    }

    onSubmit(datosEnviar)
  }

  const getFieldError = (fieldName) => {
    return errors[fieldName] && touched[fieldName] ? errors[fieldName] : null
  }

  // Formatear fechas para mostrar
  const formatearFecha = (fecha) => {
    if (!fecha) return "No definida"
    return new Date(fecha).toLocaleDateString()
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {/* Información del registro operatorio */}
      <Box sx={{ bgcolor: "blue.50", p: 2, borderRadius: 1, mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "blue.800", mb: 1 }}>
          Información del Registro Operatorio
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
          <Typography variant="body2" sx={{ color: "blue.700" }}>
            <strong>Paciente:</strong> {paciente?.nombre} {paciente?.apellidos}
          </Typography>
          <Typography variant="body2" sx={{ color: "blue.700" }}>
            <strong>Fecha operación:</strong> {formatearFecha(registroOperatorio?.fecha_operacion)}
          </Typography>
          <Typography variant="body2" sx={{ color: "blue.700" }}>
            <strong>Fecha alta episodio:</strong> {formatearFecha(episodio?.fecha_alta)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
        {/* Fecha del registro posoperatorio */}
        <TextField
          fullWidth
          type="date"
          name="fecha"
          label="Fecha del registro posoperatorio"
          value={formData.fecha}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!getFieldError("fecha")}
          helperText={
            getFieldError("fecha") ||
            `Debe ser igual o posterior a ${formatearFecha(registroOperatorio?.fecha_operacion)}`
          }
          InputLabelProps={{ shrink: true }}
          inputProps={{
            min: registroOperatorio?.fecha_operacion?.split("T")[0],
            max: episodio?.fecha_alta?.split("T")[0],
          }}
          required
        />

        {/* Tiempo transcurrido (calculado automáticamente) */}
        <TextField
          fullWidth
          name="tiempo_transcurrido"
          label="Tiempo transcurrido (días)"
          value={`${formData.tiempo_transcurrido} días`}
          InputProps={{ readOnly: true }}
          helperText="Calculado automáticamente"
          sx={{ "& .MuiInputBase-input": { bgcolor: "grey.100" } }}
        />

        {/* Escala pronóstica Oslo posoperatoria */}
        <TextField
          fullWidth
          name="escala_pronostica_oslo_posoperatoria"
          label="Escala Oslo posoperatoria (0-10)"
          value={formData.escala_pronostica_oslo_posoperatoria}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!getFieldError("escala_pronostica_oslo_posoperatoria")}
          helperText={getFieldError("escala_pronostica_oslo_posoperatoria") || "Escala de 0 a 10 puntos"}
          placeholder="0-10"
        />

        {/* Gradación pronóstica para recurrencia HSC unilateral */}
        <TextField
          fullWidth
          name="gradacion_pronostica_para_recurrencia_hsc_unilateral"
          label="Gradación pronóstica recurrencia HSC (%)"
          value={formData.gradacion_pronostica_para_recurrencia_hsc_unilateral}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!getFieldError("gradacion_pronostica_para_recurrencia_hsc_unilateral")}
          helperText={
            getFieldError("gradacion_pronostica_para_recurrencia_hsc_unilateral") ||
            "Porcentaje de 0 a 100 (permite decimales)"
          }
          placeholder="0-100"
        />
      </Box>

      {/* Recurrencia de hematoma */}
      <Box sx={{ mt: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              name="recurrencia_hematoma"
              checked={formData.recurrencia_hematoma}
              onChange={handleChange}
              color="primary"
            />
          }
          label="Recurrencia de hematoma"
        />
      </Box>

      {/* Botones de acción */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
        <Button variant="outlined" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" disabled={isLoading}>
          {isLoading ? "Guardando..." : initialData?.id ? "Actualizar" : "Guardar"}
        </Button>
      </Box>
    </Box>
  )
}
