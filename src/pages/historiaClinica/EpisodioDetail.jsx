"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { HistoriaClinicaLayout } from "@/components/layout/HistoriaClinicaLayout"
import { InfoFieldCompact } from "@/components/shared/InfoFieldCompact"
import { Button, Paper, Box, Card, CardContent, CardHeader, Typography } from "@mui/material"
import { ArrowLeft, Edit } from "lucide-react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { setHistoriaClinica } from "@/features/gestionarHistoriaClinica/historiaClinicaSlice"
import { EpisodioForm } from "@/components/shared/EpisodioForm"
import { MuiTabs } from "@/components/shared/MuiTabs"
import { RasgosClinicosEpisodioPanel } from "@/features/gestionarEpisodio/RasgosClinicosEpisodioPanel"
import { RegistroOperatorioPanel } from "@/features/registroOperatorio/RegistroOperatorioPanel"
import { HematomasSubduralesPanel } from "@/features/hematoma/HematomasSubduralesPanel"
import InfoOutlineIcon from "@mui/icons-material/InfoOutline"
import { formatDateOrDash, formatBooleanOrDash, displayValueOrDash } from "@/libs/displayUtils"

function EpisodioDetail() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [episodio, setEpisodio] = useState(null)
  const [paciente, setPaciente] = useState(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const apiUrl = import.meta.env.VITE_API_BACKEND

  // Recuperar datos del episodio y paciente desde sessionStorage
  useEffect(() => {
    const storedEpisodio = sessionStorage.getItem("selectedEpisodio")
    const storedPaciente = sessionStorage.getItem("selectedPaciente")

    if (storedEpisodio && storedPaciente) {
      setEpisodio(JSON.parse(storedEpisodio))
      setPaciente(JSON.parse(storedPaciente))
      dispatch(setHistoriaClinica(JSON.parse(storedPaciente)))
    }
  }, [dispatch, location.search])

  // Si no hay datos, mostrar mensaje
  if (!episodio || !paciente) {
    return (
      <HistoriaClinicaLayout title="Detalle del Episodio Clínico">
        <Paper elevation={1} sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">No se encontraron datos del episodio</h2>
          <Button
            onClick={() => navigate("/Revision_casos/HistoriaClinica?tab=episodios")}
            variant="contained"
            startIcon={<ArrowLeft size={16} />}
            sx={{ mt: 2 }}
          >
            Volver a Episodios
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
        historia_clinica: paciente.id,
      }

      const response = await axios.put(`${apiUrl}episodios/${episodio.id}/`, dataToSend)

      setEpisodio(response.data)
      sessionStorage.setItem("selectedEpisodio", JSON.stringify(response.data))

      const historiaResponse = await axios.get(`${apiUrl}gestionar_historia_clinica/${paciente.id}/`)
      dispatch(setHistoriaClinica(historiaResponse.data))
      sessionStorage.setItem("selectedPaciente", JSON.stringify(historiaResponse.data))

      setEditing(false)
      alert("Episodio actualizado correctamente")
    } catch (error) {
      console.error("Error al actualizar:", error)
      alert("Error al actualizar el episodio")
    } finally {
      setLoading(false)
    }
  }

  // Campos a mostrar - ahora usando las funciones utilitarias
  const campos = [
    {
      label: "Fecha de inicio",
      key: "inicio",
      value: formatDateOrDash(episodio.inicio),
    },
    {
      label: "Fecha de alta",
      key: "fecha_alta",
      value: formatDateOrDash(episodio.fecha_alta),
    },
    {
      label: "Tiempo de estadía (días)",
      key: "tiempo_estadia",
      value: displayValueOrDash(episodio.tiempo_estadia),
    },
    {
      label: "Estado al egreso",
      key: "estado_al_egreso",
      value: formatBooleanOrDash(episodio.estado_al_egreso, "Favorable", "Desfavorable"),
    },
    {
      label: "Tiempo de antecedente (días)",
      key: "tiempo_antecedente",
      value: displayValueOrDash(episodio.tiempo_antecedente),
    },
    {
      label: "Edad del paciente",
      key: "edad_paciente",
      value: displayValueOrDash(episodio.edad_paciente),
    },
  ]

  // Configuración de las pestañas
  const tabs = [
    {
      label: "Episodio",
      icon: <InfoOutlineIcon />,
      iconPosition: "start",
      content: (
        <Box sx={{ p: 3 }}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardHeader
              title="Información del Episodio"
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

          <Card variant="outlined">
            <CardHeader
              title="Descripción y Observaciones"
              sx={{
                bgcolor: "grey.50",
                borderBottom: "1px solid",
                borderColor: "divider",
                py: 2,
              }}
            />
            <CardContent sx={{ p: 0 }}>
              <InfoFieldCompact
                label="Descripción del antecedente"
                value={displayValueOrDash(episodio.descripcion_antecedente)}
                gridColumn={2}
              />
              <InfoFieldCompact
                label="Observaciones"
                value={displayValueOrDash(episodio.observaciones)}
                gridColumn={2}
              />
            </CardContent>
          </Card>
        </Box>
      ),
    },
    {
      label: "Rasgos Clínicos",
      content: <RasgosClinicosEpisodioPanel Episodio={episodio} />,
    },
    {
      label: "Registro Operatorio",
      content: <RegistroOperatorioPanel episodioId={episodio.id} />,
    },
    {
      label: "Hematomas Subdurales",
      content: <HematomasSubduralesPanel episodioId={episodio.id} />,
    },
  ]

  return (
    <HistoriaClinicaLayout title="Detalle del Episodio Clínico">
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button
          onClick={() => navigate("/Revision_casos/HistoriaClinica?tab=episodios")}
          variant="outlined"
          startIcon={<ArrowLeft size={16} />}
        >
          Volver a Episodios
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
              Editar Episodio
            </Typography>
            <EpisodioForm initialData={episodio} onSubmit={handleSubmit} isLoading={loading} onCancel={handleCancel} />
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

export default EpisodioDetail
