"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { HistoriaClinicaLayout } from "@/components/layout/HistoriaClinicaLayout"
import { InfoFieldCompact } from "@/components/shared/InfoFieldCompact"
import { Button, Paper, Box, Card, CardContent, CardHeader, Typography } from "@mui/material"
import { ArrowLeft, Edit } from "lucide-react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setHistoriaClinica } from "@/features/gestionarHistoriaClinica/historiaClinicaSlice"
import { HematomaSubduralForm } from "@/features/hematoma/HematomaSubduralForm"
import { MuiTabs } from "@/components/shared/MuiTabs"
import InfoOutlineIcon from "@mui/icons-material/InfoOutline"
import { displayValueOrDash, formatBooleanOrDash } from "@/utils/displayUtils"
import { useCustomAlert } from "@/hooks/useCustomAlert"

function HematomaSubduralDetail() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { datos: paciente } = useSelector((state) => state.historiaClinica)
  const [hematoma, setHematoma] = useState(null)
  const [episodio, setEpisodio] = useState(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const apiUrl = import.meta.env.VITE_API_BACKEND
  const { warning, success, error, info } = useCustomAlert()

  // Recuperar datos del hematoma y episodio desde sessionStorage
  useEffect(() => {
    const storedHematoma = sessionStorage.getItem("selectedHematomaSubdural")
    const storedEpisodio = sessionStorage.getItem("selectedEpisodio")

    if (storedHematoma && storedEpisodio) {
      setHematoma(JSON.parse(storedHematoma))
      setEpisodio(JSON.parse(storedEpisodio))
    }
  }, [location.search])

  // Si no hay datos, mostrar mensaje
  if (!hematoma || !episodio || !paciente) {
    return (
      <HistoriaClinicaLayout title="Detalle del Hematoma Subdural">
        <Paper elevation={1} sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">No se encontraron datos del hematoma subdural</h2>
          <Button onClick={() => navigate(-1)} variant="contained" startIcon={<ArrowLeft size={16} />} sx={{ mt: 2 }}>
            Volver
          </Button>
        </Paper>
      </HistoriaClinicaLayout>
    )
  }

  // Iniciar edición
  const handleEdit = () => {
    setEditing(true)
  }

  // Cancelar edición
  const handleCancel = () => {
    setEditing(false)
  }

  // Guardar cambios
  const handleSubmit = async (formData) => {
    setLoading(true)

    try {
      const dataToSend = {
        ...formData,
        episodio: episodio.id,
      }

      const response2 = await axios.put(`${apiUrl}hematomas_subdurales/${hematoma.id}/`, dataToSend)
      setHematoma(response2.data)

      const response = await axios.get(`${apiUrl}gestionar_historia_clinica/${paciente.id}/`)
      dispatch(setHistoriaClinica(response.data))

      setEditing(false)
      success("Hematoma Subdural actualizado correctamente")
    } catch (error) {
      console.error("Error al actualizar:", error)
      alert("Error al actualizar el hematoma subdural")
    } finally {
      setLoading(false)
    }
  }

  // Función para formatear localización
  const formatLocalizacion = (value) => {
    if (value === 0) return "Derecho"
    if (value === 1) return "Izquierdo"
    return displayValueOrDash(value)
  }

  // Función para formatear método de lectura
  const formatMetodoLectura = (value) => {
    if (value === true) return "Automático"
    if (value === false) return "Manual"
    return displayValueOrDash(value)
  }

  // Campos a mostrar en la vista de detalle
  const campos = [
    {
      label: "Escala Glasgow al ingreso",
      key: "escala_glasgow_ingreso",
      value: displayValueOrDash(hematoma.escala_glasgow_ingreso),
    },
    {
      label: "Escala McWalder",
      key: "escala_mcwalder",
      value: displayValueOrDash(hematoma.escala_mcwalder),
    },
    {
      label: "Escala Gordon-Firing",
      key: "escala_gordon_firing",
      value: displayValueOrDash(hematoma.escala_gordon_firing),
    },
    {
      label: "Escala Pronóstica Oslo Preoperatoria",
      key: "escala_pronostica_oslo_preoperatoria",
      value: displayValueOrDash(hematoma.escala_pronostica_oslo_preoperatoria),
    },
    {
      label: "Escala Nomura",
      key: "escala_nomura",
      value: displayValueOrDash(hematoma.escala_nomura),
    },
    {
      label: "Escala Nakagushi",
      key: "escala_nakagushi",
      value: displayValueOrDash(hematoma.escala_nakagushi),
    },
    {
      label: "Longitud (mm)",
      key: "valor_longitud",
      value: displayValueOrDash(hematoma.valor_longitud),
    },
    {
      label: "Diámetro (mm)",
      key: "valor_diametro",
      value: displayValueOrDash(hematoma.valor_diametro),
    },
    {
      label: "Altura (mm)",
      key: "valor_altura",
      value: displayValueOrDash(hematoma.valor_altura),
    },
    {
      label: "Volumen Tada (ml)",
      key: "volumen_tada",
      value: displayValueOrDash(hematoma.volumen_tada),
    },
    {
      label: "Volumen (ml)",
      key: "volumen",
      value: displayValueOrDash(hematoma.volumen),
    },
    {
      label: "Grupo Volumen",
      key: "grupo_volumen",
      value: displayValueOrDash(hematoma.grupo_volumen),
    },
    {
      label: "Grupo Volumen Residual Postoperatorio",
      key: "grupo_volumen_residual_posoperatorio",
      value: displayValueOrDash(hematoma.grupo_volumen_residual_posoperatorio),
    },
    {
      label: "Diámetro de la capa (mm)",
      key: "diametro_capa",
      value: displayValueOrDash(hematoma.diametro_capa),
    },
    {
      label: "Diámetro mayor transverso (mm)",
      key: "diametro_mayor_transverso",
      value: displayValueOrDash(hematoma.diametro_mayor_transverso),
    },
    {
      label: "Grupo Diámetro",
      key: "grupo_diametro",
      value: displayValueOrDash(hematoma.grupo_diametro),
    },
    {
      label: "Presencia de membrana",
      key: "presencia_membrana",
      value: formatBooleanOrDash(hematoma.presencia_membrana),
      show: true,
    },
    {
      label: "Tipo de membrana",
      key: "tipo_membrana",
      value: displayValueOrDash(hematoma.tipo_membrana),
      show: hematoma.presencia_membrana,
    },
    {
      label: "Localización",
      key: "localización",
      value: formatLocalizacion(hematoma.localización),
    },
    {
      label: "Topografía",
      key: "topografia",
      value: displayValueOrDash(hematoma.topografia),
    },
    {
      label: "Desviación línea media (mm)",
      key: "desviacion_linea_media",
      value: displayValueOrDash(hematoma.desviacion_linea_media),
    },
    {
      label: "Método de lectura",
      key: "metodo_lectura",
      value: formatMetodoLectura(hematoma.metodo_lectura),
    },
  ]

  // Configuración de las pestañas
  const tabs = [
    {
      label: "Hematoma",
      icon: <InfoOutlineIcon />,
      iconPosition: "start",
      content: (
        <Box sx={{ p: 3 }}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardHeader
              title="Información del Hematoma Subdural"
              sx={{
                bgcolor: "grey.50",
                borderBottom: "1px solid",
                borderColor: "divider",
                py: 2,
              }}
            />
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                {campos
                  .filter((campo) => (campo.show !== undefined ? campo.show : true))
                  .map((campo) => (
                    <InfoFieldCompact key={campo.key} label={campo.label} value={campo.value} />
                  ))}
              </Box>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardHeader
              title="Observaciones"
              sx={{
                bgcolor: "grey.50",
                borderBottom: "1px solid",
                borderColor: "divider",
                py: 2,
              }}
            />
            <CardContent sx={{ p: 0 }}>
              <InfoFieldCompact
                label="Observaciones"
                value={displayValueOrDash(hematoma.observaciones)}
                gridColumn={2}
              />
            </CardContent>
          </Card>
        </Box>
      ),
    },
  ]

  return (
    <HistoriaClinicaLayout title="Detalle del Hematoma Subdural">
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button onClick={() => navigate(-1)} variant="outlined" startIcon={<ArrowLeft size={16} />}>
          Volver
        </Button>
        {!editing && activeTab === 0 && (
          <Button
            onClick={handleEdit}
            variant="contained"
            startIcon={<Edit size={16} />}
            sx={{ bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark" } }}
          >
            Editar
          </Button>
        )}
      </Box>

      {editing ? (
        <Paper elevation={1} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Editar Hematoma Subdural
            </Typography>
            <HematomaSubduralForm
              initialData={hematoma}
              onSubmit={handleSubmit}
              isLoading={loading}
              onCancel={handleCancel}
            />
          </Box>
        </Paper>
      ) : (
        <Paper elevation={1} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <MuiTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </Paper>
      )}
    </HistoriaClinicaLayout>
  )
}

export default HematomaSubduralDetail
