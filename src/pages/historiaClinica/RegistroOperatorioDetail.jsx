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
import { RegistroOperatorioForm } from "@/features/registroOperatorio/RegistroOperatorioForm"
import { MuiTabs } from "@/components/shared/MuiTabs"
import { RasgosClinicosOperatoriosPanel } from "@/features/registroOperatorio/RasgosClinicosOperatoriosPanel"
import { RegistrosPosoperatoriosPanel } from "@/features/registroOperatorio/RegistrosPosoperatoriosPanel"
import InfoOutlineIcon from "@mui/icons-material/InfoOutline"
import { displayValueOrDash, formatDateOrDash, formatBooleanOrDash } from "@/libs/displayUtils"

function RegistroOperatorioDetail() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { datos: paciente } = useSelector((state) => state.historiaClinica)
  const [registroOperatorio, setRegistroOperatorio] = useState(null)
  const [episodio, setEpisodio] = useState(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const apiUrl = import.meta.env.VITE_API_BACKEND

  // Recuperar datos del registro operatorio y episodio desde sessionStorage
  useEffect(() => {
    const storedRegistro = sessionStorage.getItem("selectedRegistroOperatorio")
    const storedEpisodio = sessionStorage.getItem("selectedEpisodio")

    if (storedRegistro && storedEpisodio) {
      setRegistroOperatorio(JSON.parse(storedRegistro))
      setEpisodio(JSON.parse(storedEpisodio))
    }
  }, [location.search])

  // Si no hay datos, mostrar mensaje
  if (!registroOperatorio || !episodio || !paciente) {
    return (
      <HistoriaClinicaLayout title="Detalle del Registro Operatorio">
        <Paper elevation={1} sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">No se encontraron datos del registro operatorio</h2>
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

      const response = await axios.put(`${apiUrl}registro_operatorio/${registroOperatorio.id}/`, dataToSend)

      setRegistroOperatorio(response.data)
      sessionStorage.setItem("selectedRegistroOperatorio", JSON.stringify(response.data))

      const historiaResponse = await axios.get(`${apiUrl}gestionar_historia_clinica/${paciente.id}/`)
      dispatch(setHistoriaClinica(historiaResponse.data))

      setEditing(false)
      alert("Registro operatorio actualizado correctamente")
    } catch (error) {
      console.error("Error al actualizar:", error)
      alert("Error al actualizar el registro operatorio")
    } finally {
      setLoading(false)
    }
  }

  // Campos a mostrar en la pestaña de información - ahora usando las funciones utilitarias
  const campos = [
    {
      label: "Fecha de operación",
      key: "fecha_operacion",
      value: formatDateOrDash(registroOperatorio.fecha_operacion),
    },
    {
      label: "Es reintervención",
      key: "es_reintervencion",
      value: formatBooleanOrDash(registroOperatorio.es_reintervencion),
    },
    {
      label: "Escala de Glasgow",
      key: "escala_evaluacion_resultados_glasgow",
      value: displayValueOrDash(registroOperatorio.escala_evaluacion_resultados_glasgow),
    },
    {
      label: "Estado de egreso",
      key: "estado_egreso",
      value: formatBooleanOrDash(registroOperatorio.estado_egreso, "Favorable", "Desfavorable"),
    },
  ]

  // Configuración de las pestañas
  const tabs = [
    {
      label: "Registro Operatorio",
      icon: <InfoOutlineIcon />,
      iconPosition: "start",
      content: (
        <Box sx={{ p: 3 }}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardHeader
              title="Información del Registro Operatorio"
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
                value={displayValueOrDash(registroOperatorio.observaciones)}
                gridColumn={2}
              />
            </CardContent>
          </Card>
        </Box>
      ),
    },
    {
      label: "Rasgos Clínicos Operatorios",
      content: (
        <RasgosClinicosOperatoriosPanel
          registroOperatorioId={registroOperatorio.id}
          RasgosClinicos={registroOperatorio.rasgos_clinicos_operatorios || []}
        />
      ),
    },
    {
      label: "Registros Posoperatorios",
      content: (
        <RegistrosPosoperatoriosPanel
          registroOperatorioId={registroOperatorio.id}
          RegistrosPosoperatorios={registroOperatorio.registros_posoperatorios}
        />
      ),
    },
  ]

  return (
    <HistoriaClinicaLayout title="Detalle del Registro Operatorio">
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
              Editar Registro Operatorio
            </Typography>
            <RegistroOperatorioForm
              initialData={registroOperatorio}
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

export default RegistroOperatorioDetail
