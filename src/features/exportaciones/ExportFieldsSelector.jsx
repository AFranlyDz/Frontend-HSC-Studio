"use client"
import { useState, useCallback } from "react"
import axios from "axios"
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Collapse,
  IconButton,
  CircularProgress,
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  useTheme,
  alpha,
} from "@mui/material"
import { ExpandMore, ExpandLess, SelectAll, ClearAll } from "@mui/icons-material"

const ExportFieldsSelector = ({ onClose }) => {
  const [selectedFields, setSelectedFields] = useState(new Set())
  const [expandedGroups, setExpandedGroups] = useState({
    "Historia Clínica": true, // Expandir por defecto el grupo principal
  })
  const [isLoading, setIsLoading] = useState(false)
  const theme = useTheme()
  const apiUrl = import.meta.env.VITE_API_BACKEND

  // Definición de grupos de campos basados en los modelos
  const fieldDisplayNames = {
    // Historia Clínica
    "historia_clinica.numero": "Número de Historia Clínica",
    "historia_clinica.seudonimo": "Seudónimo del Paciente",
    "historia_clinica.nombre": "Nombre del Paciente",
    "historia_clinica.apellidos": "Apellidos del Paciente",
    "historia_clinica.edad": "Edad del Paciente",
    "historia_clinica.sexo": "Sexo del Paciente",
    "historia_clinica.historial_trauma_craneal": "Historial de Trauma Craneal",
    "historia_clinica.manualidad": "Manualidad (Diestro/Zurdo)",
    "historia_clinica.antecedentes_familiares": "Antecedentes Familiares",

    // Rasgos Clínicos Globales
    "rasgo_clinico_global.notas": "Notas de Rasgos Clínicos",

    // Episodio
    "episodio.inicio": "Fecha de Inicio del Episodio",
    "episodio.fecha_alta": "Fecha de Alta del Episodio",
    "episodio.tiempo_estadia": "Tiempo de Estadia (días)",
    "episodio.estado_al_egreso": "Estado al Egreso",
    "episodio.tiempo_antecedente": "Tiempo del Antecedente",
    "episodio.descripcion_antecedente": "Descripción del Antecedente",
    "episodio.edad_paciente": "Edad del Paciente en el Episodio",
    "episodio.observaciones": "Observaciones del Episodio",

    // Rasgos Clínicos del Episodio
    "rasgo_clinico_episodio.tiempo": "Tiempo de Rasgos Clínicos",
    "rasgo_clinico_episodio.notas": "Notas de Rasgos Clínicos",

    // Registro Operatorio
    "registro_operatorio.fecha_operacion": "Fecha de Operación",
    "registro_operatorio.es_reintervencion": "¿Es Reintervención?",
    "registro_operatorio.escala_evaluacion_resultados_glasgow": "Escala de Glasgow",
    "registro_operatorio.estado_egreso": "Estado al Egreso",
    "registro_operatorio.observaciones": "Observaciones Operatorias",

    // Registro Posoperatorio
    "registro_posoperatorio.fecha": "Fecha Posoperatoria",
    "registro_posoperatorio.tiempo_transcurrido": "Tiempo Transcurrido",
    "registro_posoperatorio.escala_pronostica_oslo_posoperatoria": "Escala Pronóstica Oslo",
    "registro_posoperatorio.recurrencia_hematoma": "Recurrencia de Hematoma",
    "registro_posoperatorio.gradacion_pronostica_para_recurrencia_hsc_unilateral": "Gradación de Recurrencia",

    // Hematoma Subdural
    "hematoma.escala_glasgow_ingreso": "Escala Glasgow al Ingreso",
    "hematoma.escala_mcwalder": "Escala McWalder",
    "hematoma.escala_gordon_firing": "Escala Gordon-Firing",
    "hematoma.escala_pronostica_oslo_preoperatoria": "Escala Oslo Preoperatoria",
    "hematoma.escala_nomura": "Escala Nomura",
    "hematoma.escala_nakagushi": "Escala Nakagushi",
    "hematoma.valor_longitud": "Longitud del Hematoma",
    "hematoma.valor_diametro": "Diámetro del Hematoma",
    "hematoma.valor_altura": "Altura del Hematoma",
    "hematoma.volumen_tada": "Volumen TADA",
    "hematoma.volumen": "Volumen del Hematoma",
    "hematoma.grupo_volumen": "Grupo de Volumen",
    "hematoma.grupo_volumen_residual_posoperatorio": "Volumen Residual Posoperatorio",
    "hematoma.diametro_capa": "Diámetro de Capa",
    "hematoma.diametro_mayor_transverso": "Diámetro Mayor Transverso",
    "hematoma.grupo_diametro": "Grupo de Diámetro",
    "hematoma.presencia_membrana": "Presencia de Membrana",
    "hematoma.tipo_membrana": "Tipo de Membrana",
    "hematoma.localización": "Localización del Hematoma",
    "hematoma.topografia": "Topografía del Hematoma",
    "hematoma.desviacion_linea_media": "Desviación de Línea Media",
    "hematoma.metodo_lectura": "Método de Lectura",
    "hematoma.observaciones": "Observaciones del Hematoma",

    // Codificadores
    "codificador.nombre": "Nombre del Codificador",
    "codificador.nombre_corto": "Nombre Corto",
    "codificador.descripcion": "Descripción",
    "codificador.clasificacion": "Clasificación",
  }

  const fieldGroups = {
    "Historia Clínica": [
      "historia_clinica.numero",
      "historia_clinica.seudonimo",
      "historia_clinica.nombre",
      "historia_clinica.apellidos",
      "historia_clinica.edad",
      "historia_clinica.sexo",
      "historia_clinica.historial_trauma_craneal",
      "historia_clinica.manualidad",
      "historia_clinica.antecedentes_familiares",
    ],
    "Rasgos Clínicos Globales": ["rasgo_clinico_global.notas"],
    Episodio: [
      "episodio.inicio",
      "episodio.fecha_alta",
      "episodio.tiempo_estadia",
      "episodio.estado_al_egreso",
      "episodio.tiempo_antecedente",
      "episodio.descripcion_antecedente",
      "episodio.edad_paciente",
      "episodio.observaciones",
    ],
    "Rasgos Clínicos del Episodio": ["rasgo_clinico_episodio.tiempo", "rasgo_clinico_episodio.notas"],
    "Registro Operatorio": [
      "registro_operatorio.fecha_operacion",
      "registro_operatorio.es_reintervencion",
      "registro_operatorio.escala_evaluacion_resultados_glasgow",
      "registro_operatorio.estado_egreso",
      "registro_operatorio.observaciones",
    ],
    "Registro Posoperatorio": [
      "registro_posoperatorio.fecha",
      "registro_posoperatorio.tiempo_transcurrido",
      "registro_posoperatorio.escala_pronostica_oslo_posoperatoria",
      "registro_posoperatorio.recurrencia_hematoma",
      "registro_posoperatorio.gradacion_pronostica_para_recurrencia_hsc_unilateral",
    ],
    "Hematoma Subdural": [
      "hematoma.escala_glasgow_ingreso",
      "hematoma.escala_mcwalder",
      "hematoma.escala_gordon_firing",
      "hematoma.escala_pronostica_oslo_preoperatoria",
      "hematoma.escala_nomura",
      "hematoma.escala_nakagushi",
      "hematoma.valor_longitud",
      "hematoma.valor_diametro",
      "hematoma.valor_altura",
      "hematoma.volumen_tada",
      "hematoma.volumen",
      "hematoma.grupo_volumen",
      "hematoma.grupo_volumen_residual_posoperatorio",
      "hematoma.diametro_capa",
      "hematoma.diametro_mayor_transverso",
      "hematoma.grupo_diametro",
      "hematoma.presencia_membrana",
      "hematoma.tipo_membrana",
      "hematoma.localización",
      "hematoma.topografia",
      "hematoma.desviacion_linea_media",
      "hematoma.metodo_lectura",
      "hematoma.observaciones",
    ],
    Codificadores: [
      "codificador.nombre",
      "codificador.nombre_corto",
      "codificador.descripcion",
      "codificador.clasificacion",
    ],
  }

  // Manejar cambio de selección
  const handleToggle = useCallback((field) => {
    setSelectedFields((prev) => {
      const newSelection = new Set(prev)
      if (newSelection.has(field)) {
        newSelection.delete(field)
      } else {
        newSelection.add(field)
      }
      return newSelection
    })
  }, [])

  // Seleccionar/deseleccionar todo un grupo
  const toggleGroup = useCallback(
    (groupName, select) => {
      setSelectedFields((prev) => {
        const newSelection = new Set(prev)
        fieldGroups[groupName].forEach((field) => {
          if (select) {
            newSelection.add(field)
          } else {
            newSelection.delete(field)
          }
        })
        return newSelection
      })
    },
    [fieldGroups],
  )

  // Seleccionar/deseleccionar todos los campos
  const toggleAllFields = useCallback(
    (select) => {
      setSelectedFields((prev) => {
        const newSelection = new Set()
        if (select) {
          Object.values(fieldGroups).forEach((group) => {
            group.forEach((field) => newSelection.add(field))
          })
        }
        return newSelection
      })
    },
    [fieldGroups],
  )

  const handleSubmit = async (event) => {
    event?.stopPropagation()

    if (selectedFields.size === 0) return

    setIsLoading(true)
    try {
      console.log("Iniciando exportación con campos:", [...selectedFields]) // Debug

      const response = await axios.post(
        `${apiUrl}export-csv/`,
        { fields: [...selectedFields] },
        { responseType: "blob" },
      )

      // Crear el enlace de descarga
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "exportacion.csv")
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      console.log("Exportación completada, cerrando modal") // Debug
      onClose()
    } catch (error) {
      console.error("Error al exportar CSV:", error)
      alert("Error al exportar el archivo CSV")
    } finally {
      setIsLoading(false)
    }
  }

  // Renderizar grupo de campos
  const renderGroup = (groupName) => {
    const isExpanded = expandedGroups[groupName] !== false
    const allSelected = fieldGroups[groupName].every((f) => selectedFields.has(f))
    const someSelected = fieldGroups[groupName].some((f) => selectedFields.has(f))

    return (
      <Paper
        key={groupName}
        elevation={1}
        sx={{
          mb: 1,
          borderRadius: 2,
          overflow: "hidden",
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: alpha(theme.palette.primary.main, 0.04),
            p: 1,
            cursor: "pointer",
          }}
          onClick={() => setExpandedGroups((p) => ({ ...p, [groupName]: !isExpanded }))}
        >
          <IconButton size="small" sx={{ mr: 1 }}>
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
          <FormControlLabel
            control={
              <Checkbox
                checked={allSelected}
                indeterminate={!allSelected && someSelected}
                onChange={(e) => {
                  e.stopPropagation()
                  toggleGroup(groupName, e.target.checked)
                }}
                onClick={(e) => e.stopPropagation()}
              />
            }
            label={
              <Typography variant="subtitle2" fontWeight={600} color="primary">
                {groupName}
              </Typography>
            }
            sx={{ flexGrow: 1, ml: 1, mr: 0 }}
            onClick={(e) => e.stopPropagation()}
          />
          {someSelected && (
            <Chip
              label={fieldGroups[groupName].filter((f) => selectedFields.has(f)).length}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mr: 1 }}
            />
          )}
        </Box>

        <Collapse in={isExpanded}>
          <Box sx={{ p: 2, pt: 1 }}>
            <FormGroup>
              {fieldGroups[groupName].map((field) => (
                <FormControlLabel
                  key={field}
                  control={
                    <Checkbox
                      checked={selectedFields.has(field)}
                      onChange={() => handleToggle(field)}
                      size="small"
                      sx={{ py: 0.5 }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                      {fieldDisplayNames[field] || field}
                    </Typography>
                  }
                  sx={{ ml: 2, my: 0.25 }}
                />
              ))}
            </FormGroup>
          </Box>
        </Collapse>
      </Paper>
    )
  }

  return (
    <Box sx={{ p: 0 }}>
      {/* Header con controles */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<SelectAll />}
            onClick={() => toggleAllFields(true)}
            sx={{ textTransform: "none" }}
          >
            Seleccionar todo
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ClearAll />}
            onClick={() => toggleAllFields(false)}
            sx={{ textTransform: "none" }}
          >
            Limpiar selección
          </Button>
        </Box>
        <Chip
          label={`${selectedFields.size} campos seleccionados`}
          color={selectedFields.size > 0 ? "primary" : "default"}
          variant="outlined"
        />
      </Box>

      {/* Lista de grupos */}
      <Box
        sx={{
          maxHeight: 400,
          overflowY: "auto",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          p: 2,
          bgcolor: alpha(theme.palette.background.paper, 0.5),
        }}
      >
        {Object.keys(fieldGroups).map(renderGroup)}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Botones de acción */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          variant="outlined"
          onClick={(e) => {
            e.stopPropagation()
            console.log("Cancelando exportación") // Debug
            onClose()
          }}
          disabled={isLoading}
          sx={{ textTransform: "none" }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={selectedFields.size === 0 || isLoading}
          onClick={handleSubmit}
          sx={{
            textTransform: "none",
            minWidth: 140,
            position: "relative",
          }}
        >
          {isLoading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Exportando...
            </>
          ) : (
            "Exportar selección"
          )}
        </Button>
      </Box>
    </Box>
  )
}

export default ExportFieldsSelector
