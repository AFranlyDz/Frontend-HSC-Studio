"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { HistoriaClinicaLayout } from "@/components/layout/HistoriaClinicaLayout"
import { InfoField } from "@/components/shared/InfoField"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, Paper, Box } from "@mui/material"
import { ArrowLeft, Edit } from "lucide-react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setHistoriaClinica } from "@/features/gestionarHistoriaClinica/historiaClinicaSlice"
import { HematomaSubduralForm } from "@/features/hematoma/HematomaSubduralForm"
import { MuiTabs } from "@/components/shared/MuiTabs"

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
      alert("Hematoma subdural actualizado correctamente")
    } catch (error) {
      console.error("Error al actualizar:", error)
      alert("Error al actualizar el hematoma subdural")
    } finally {
      setLoading(false)
    }
  }

  // Campos a mostrar en la vista de detalle
  const campos = [
    {
      label: "Escala Glasgow al ingreso",
      key: "escala_glasgow_ingreso",
    },
    {
      label: "Escala McWalder",
      key: "escala_mcwalder",
    },
    {
      label: "Escala Gordon-Firing",
      key: "escala_gordon_firing",
    },
    {
      label: "Escala Pronóstica Oslo Preoperatoria",
      key: "escala_pronostica_oslo_preoperatoria",
    },
    {
      label: "Escala Nomura",
      key: "escala_nomura",
    },
    {
      label: "Escala Nakagushi",
      key: "escala_nakagushi",
    },
    {
      label: "Longitud (mm)",
      key: "valor_longitud",
    },
    {
      label: "Diámetro (mm)",
      key: "valor_diametro",
    },
    {
      label: "Altura (mm)",
      key: "valor_altura",
    },
    {
      label: "Volumen Tada (ml)",
      key: "volumen_tada",
    },
    {
      label: "Volumen (ml)",
      key: "volumen",
    },
    {
      label: "Grupo Volumen",
      key: "grupo_volumen",
    },
    {
      label: "Grupo Volumen Residual Postoperatorio",
      key: "grupo_volumen_residual_posoperatorio",
    },
    {
      label: "Diámetro de la capa (mm)",
      key: "diametro_capa",
    },
    {
      label: "Diámetro mayor transverso (mm)",
      key: "diametro_mayor_transverso",
    },
    {
      label: "Grupo Diámetro",
      key: "grupo_diametro",
    },
    {
      label: "Presencia de membrana",
      key: "presencia_membrana",
      format: (value) => (value ? "Sí" : "No"),
    },
    {
      label: "Tipo de membrana",
      key: "tipo_membrana",
      show: (hematoma) => hematoma.presencia_membrana,
    },
    {
      label: "Localización",
      key: "localización",
    },
    {
      label: "Topografía",
      key: "topografia",
    },
    {
      label: "Desviación línea media (mm)",
      key: "desviacion_linea_media",
    },
    {
      label: "Método de lectura",
      key: "metodo_lectura",
      format: (value) => (value ? "Sí" : "No"),
    },
  ]

  // Configuración de las pestañas
  const tabs = [
    {
      label: "Información General",
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Hematoma Subdural</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campos
                  .filter((campo) => (campo.show ? campo.show(hematoma) : true))
                  .map((campo) => (
                    <InfoField
                      key={campo.key}
                      label={campo.label}
                      value={campo.format ? campo.format(hematoma[campo.key]) : hematoma[campo.key]}
                    />
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Observaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <p className="text-gray-800">{hematoma.observaciones || "No hay observaciones registradas"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
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
          <CardHeader>
            <CardTitle>Editar Hematoma Subdural</CardTitle>
          </CardHeader>
          <CardContent>
            <HematomaSubduralForm
              initialData={hematoma}
              onSubmit={handleSubmit}
              isLoading={loading}
              onCancel={handleCancel}
            />
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

export default HematomaSubduralDetail
