"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { HistoriaClinicaLayout } from "@/components/layout/HistoriaClinicaLayout"
import { InfoField } from "@/components/shared/InfoField"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, Paper, Box } from "@mui/material"
import { ArrowLeft, Edit } from "lucide-react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { setHistoriaClinica } from "@/features/gestionarHistoriaClinica/historiaClinicaSlice"
import { EpisodioForm } from "@/components/shared/EpisodioForm"
import { MuiTabs } from "@/components/shared/MuiTabs"
import { RasgosClinicosEpisodioPanel } from "@/features/gestionarEpisodio/RasgosClinicosEpisodioPanel"
import { RegistroOperatorioPanel } from "@/features/registroOperatorio/RegistroOperatorioPanel"
import { HematomasSubduralesPanel } from "@/features/hematoma/HematomasSubduralesPanel"

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

  // Campos a mostrar
  const campos = [
    {
      label: "Fecha de inicio",
      key: "inicio",
      format: (value) => (value ? new Date(value).toLocaleDateString() : "N/A"),
    },
    {
      label: "Fecha de alta",
      key: "fecha_alta",
      format: (value) => (value ? new Date(value).toLocaleDateString() : "N/A"),
    },
    { label: "Tiempo de estadía (días)", key: "tiempo_estadia" },
    {
      label: "Estado al egreso",
      key: "estado_al_egreso",
      format: (value) => (value ? "Favorable" : "Desfavorable"),
    },
    { label: "Tiempo de antecedente (días)", key: "tiempo_antecedente" },
    { label: "Edad del paciente", key: "edad_paciente" },
  ]

  // Configuración de las pestañas
  const tabs = [
    {
      label: "Información General",
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Episodio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campos.map((campo) => (
                  <InfoField
                    key={campo.key}
                    label={campo.label}
                    value={campo.format ? campo.format(episodio[campo.key]) : episodio[campo.key]}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Descripción y Observaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Descripción del antecedente
                  </h3>
                  <p className="mt-1 text-lg text-gray-800">{episodio.descripcion_antecedente || "N/A"}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Observaciones</h3>
                  <p className="mt-1 text-lg text-gray-800">{episodio.observaciones || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
          <CardHeader>
            <CardTitle>Editar Episodio</CardTitle>
          </CardHeader>
          <CardContent>
            <EpisodioForm initialData={episodio} onSubmit={handleSubmit} isLoading={loading} onCancel={handleCancel} />
          </CardContent>
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
