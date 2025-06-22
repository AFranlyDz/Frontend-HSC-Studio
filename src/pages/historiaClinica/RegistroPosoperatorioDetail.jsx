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
import { RegistroPosoperatorioForm } from "@/features/registroOperatorio/RegistroPosoperatorioForm"
import { MuiTabs } from "@/components/shared/MuiTabs"
import InfoOutlineIcon from "@mui/icons-material/InfoOutline"

function RegistroPosoperatorioDetail() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { datos: paciente } = useSelector((state) => state.historiaClinica)
  const [registroPosoperatorio, setRegistroPosoperatorio] = useState(null)
  const [registroOperatorio, setRegistroOperatorio] = useState(null)
  const [episodio, setEpisodio] = useState(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const apiUrl = import.meta.env.VITE_API_BACKEND

  // Recuperar datos del registro posoperatorio, operatorio y episodio desde sessionStorage
  useEffect(() => {
    const storedRegistroPosop = sessionStorage.getItem("selectedRegistroPosoperatorio")
    const storedRegistroOp = sessionStorage.getItem("selectedRegistroOperatorio")
    const storedEpisodio = sessionStorage.getItem("selectedEpisodio")

    if (storedRegistroPosop && storedRegistroOp && storedEpisodio) {
      setRegistroPosoperatorio(JSON.parse(storedRegistroPosop))
      setRegistroOperatorio(JSON.parse(storedRegistroOp))
      setEpisodio(JSON.parse(storedEpisodio))
    }
  }, [location.search])

  // Si no hay datos, mostrar mensaje
  if (!registroPosoperatorio || !registroOperatorio || !episodio || !paciente) {
    return (
      <HistoriaClinicaLayout title="Detalle del Registro Posoperatorio">
        <Paper elevation={1} sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            No se encontraron datos del registro posoperatorio
          </h2>
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
        registro_operatorio: registroOperatorio.id,
      }

      const response = await axios.put(`${apiUrl}registro_posoperatorio/${registroPosoperatorio.id}/`, dataToSend)

      setRegistroPosoperatorio(response.data)
      sessionStorage.setItem("selectedRegistroPosoperatorio", JSON.stringify(response.data))

      const pacienteActualizado = {
        ...paciente,
        episodios: paciente.episodios.map((ep) => ({
          ...ep,
          registro_operatorio:
            ep.registro_operatorio?.map((ro) =>
              ro.id === registroOperatorio.id
                ? {
                    ...ro,
                    registros_posoperatorios:
                      ro.registros_posoperatorios?.map((rp) =>
                        rp.id === registroPosoperatorio.id ? response.data : rp,
                      ) || [],
                  }
                : ro,
            ) || [],
        })),
      }

      dispatch(setHistoriaClinica(pacienteActualizado))

      setEditing(false)
      alert("Registro posoperatorio actualizado correctamente")
    } catch (error) {
      console.error("Error al actualizar:", error)
      alert("Error al actualizar el registro posoperatorio")
    } finally {
      setLoading(false)
    }
  }

  // Campos a mostrar en la vista de detalle
  const campos = [
    {
      label: "Fecha",
      key: "fecha",
      format: (value) => (value ? new Date(value).toLocaleDateString() : "No especificada"),
    },
    {
      label: "Tiempo transcurrido (días)",
      key: "tiempo_transcurrido",
    },
    {
      label: "Escala Oslo posoperatoria",
      key: "escala_pronostica_oslo_posoperatoria",
    },
    {
      label: "Recurrencia de hematoma",
      key: "recurrencia_hematoma",
      format: (value) => (value ? "Sí" : "No"),
    },
    {
      label: "Gradación pronóstica para recurrencia HSC unilateral",
      key: "gradacion_pronostica_para_recurrencia_hsc_unilateral",
    },
  ]

  // Configuración de las pestañas
  const tabs = [
    {
      label: "Registro Posoperatorio",
      icon: <InfoOutlineIcon />,
      iconPosition: "start",
      content: (
        <Box sx={{ p: 3 }}>
          <Card variant="outlined">
            <CardHeader
              title="Información del Registro Posoperatorio"
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
                    value={
                      campo.format ? campo.format(registroPosoperatorio[campo.key]) : registroPosoperatorio[campo.key]
                    }
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      ),
    },
  ]

  return (
    <HistoriaClinicaLayout title="Detalle del Registro Posoperatorio">
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
              Editar Registro Posoperatorio
            </Typography>
            <RegistroPosoperatorioForm
              initialData={registroPosoperatorio}
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

export default RegistroPosoperatorioDetail
