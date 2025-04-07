"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useFormatValue } from "@/hooks/useFormatValue"
import Footer from "@/components/layout/Footer"
import Header from "@/components/layout/Header"
import { InfoField } from "@/components/shared/InfoField"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit } from "lucide-react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { setHistoriaClinica } from "@/features/gestionarHistoriaClinica/historiaClinicaSlice"
import { EpisodioForm } from "@/components/shared/EpisodioForm"

function EpisodioDetail() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { episodio: initialEpisodio, paciente } = location.state || {}
  const { formatValue } = useFormatValue()
  const [episodio, setEpisodio] = useState(initialEpisodio)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const apiUrl = import.meta.env.VITE_API_BACKEND

  useEffect(() => {
    if (initialEpisodio) {
      setEpisodio(initialEpisodio)
    }
  }, [initialEpisodio])

  // Si no hay datos, mostrar mensaje
  if (!episodio) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-gray-50">
        <Header />
        <section className="pt-24 pb-6 md:pt-32 md:pb-8 bg-gradient-to-b from-gray-100 to-white w-full flex-grow">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">No se encontraron datos del episodio</h2>
                <Button onClick={() => navigate(-1)} className="mt-4">
                  <ArrowLeft size={16} className="mr-2" /> Volver
                </Button>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
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
      // Asegurarse de que el ID de la historia clínica esté incluido
      const dataToSend = {
        ...formData,
        historia_clinica: paciente.id,
      }

      const response = await axios.put(`${apiUrl}episodios/${episodio.id}/`, dataToSend)

      // Actualizar el estado local
      setEpisodio(response.data)

      // Actualizar el estado en Redux
      const historiaResponse = await axios.get(`${apiUrl}gestionar_historia_clinica/${paciente.id}/`)
      dispatch(setHistoriaClinica(historiaResponse.data))

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

  // Campos de texto largo
  const camposTexto = [
    { label: "Descripción del antecedente", key: "descripcion_antecedente" },
    { label: "Observaciones", key: "observaciones" },
  ]

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <Header />
      <section className="pt-24 pb-6 md:pt-32 md:pb-8 bg-gradient-to-b from-gray-100 to-white w-full">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Cambiar la estructura del encabezado para mover los botones al mismo nivel que la información del paciente */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Detalle del Episodio Clínico</h1>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-lg text-blue-600 font-medium">
                  <span>
                    {paciente.nombre} {paciente.apellidos}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="text-gray-500 text-base">ID: {paciente.numero || "N/A"}</span>
                </div>
                {!editing ? (
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => navigate(-1)}>
                      <ArrowLeft size={16} className="mr-2" /> Volver
                    </Button>
                    <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Edit size={16} className="mr-2" /> Editar
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>

            {editing ? (
              <Card>
                <CardHeader>
                  <CardTitle>Editar Episodio</CardTitle>
                </CardHeader>
                <CardContent>
                  <EpisodioForm initialData={episodio} onSubmit={handleSubmit} isLoading={loading} />
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Información básica del episodio */}
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

                {/* Descripción y observaciones */}
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
            )}
          </div>
        </div>
      </section>
      <div className="flex-grow"></div>
      <Footer />
    </div>
  )
}

export default EpisodioDetail

