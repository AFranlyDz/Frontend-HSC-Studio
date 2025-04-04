"use client"

import { useLocation } from "react-router-dom"
import { useFormatValue } from "@/hooks/useFormatValue"
import Footer from "@/components/layout/Footer"
import Header from "@/components/layout/Header"
import { InfoField } from "@/components/shared/InfoField"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

function EpisodioDetail() {
  const location = useLocation()
  const { episodio, paciente } = location.state || {}
  const { formatValue } = useFormatValue()

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
                <Button onClick={() => window.history.back()} className="mt-4">
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
    { label: "Estado al egreso", key: "estado_al_egreso", format: (value) => (value ? "Favorable" : "Desfavorable") },
    { label: "Tiempo de antecedente (días)", key: "tiempo_antecedente" },
    { label: "Edad del paciente", key: "edad_paciente" },
  ]

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <Header />
      <section className="pt-24 pb-6 md:pt-32 md:pb-8 bg-gradient-to-b from-gray-100 to-white w-full">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Button variant="outline" onClick={() => window.history.back()} className="mr-4">
                  <ArrowLeft size={16} className="mr-2" /> Volver
                </Button>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Detalle del Episodio Clínico</h1>
              </div>
              <div className="flex items-center text-lg text-blue-600 font-medium">
                <span>
                  {paciente.nombre} {paciente.apellidos}
                </span>
                <span className="mx-2">•</span>
                <span className="text-gray-500 text-base">ID: {paciente.numero || "N/A"}</span>
              </div>
            </div>

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
          </div>
        </div>
      </section>
      <div className="flex-grow"></div>
      <Footer />
    </div>
  )
}

export default EpisodioDetail

