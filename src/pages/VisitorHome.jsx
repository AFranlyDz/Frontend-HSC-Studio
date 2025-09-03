"use client"

import { useEffect, useState } from "react"
import { Brain, Activity, ClipboardList, Users, FileText, ArrowRight, BadgeAlert } from "lucide-react"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import axios from "axios"

import VisitorHeader from "@/components/layout/VisitorHeader.jsx"
import Footer from "@/components/layout/Footer.jsx"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { setCodificadores } from "@/features/codificadores/codificadoresSlice"

function VisitorHome() {
  const apiUrl = import.meta.env.VITE_API_BACKEND
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  // Al cargar la página, hacemos scroll al principio
  useEffect(() => {
    window.scrollTo(0, 0)
    const loadData = async () => {
      setLoading(true)
      try {
        const respuesta = await axios.get(`${apiUrl}codificadores/`)
        dispatch(setCodificadores(respuesta.data))
      } catch (error) {
        console.error("Hubo un error al obtener los datos:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [apiUrl, dispatch])

  return (
    <div className="flex flex-col min-h-screen w-full">
      <VisitorHeader />

      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-20 bg-gradient-to-b from-gray-100 to-white w-full">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            <div className="w-full md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Sistema Profesional para
                <span className="text-blue-700"> Hematomas Subdurales</span>
              </h1>
              <p className="text-lg text-gray-700 max-w-xl">
                Plataforma especializada para profesionales médicos en el diagnóstico, tratamiento y seguimiento de
                pacientes con hematomas subdurales.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Button size="lg" className="bg-blue-700 hover:bg-blue-800" asChild>
                  <Link to="/Iniciar_Sesión">Acceder al Sistema</Link>
                </Button>
                <Button size="lg" variant="outline">
                  Conocer más
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/2 mt-8 md:mt-0">
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Sistema Médico HSC-Studio"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-blue-900/20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white w-full">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Herramientas Profesionales</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Sistema integral diseñado específicamente para profesionales de la salud especializados en neurociencias y
              manejo de hematomas subdurales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Brain className="h-10 w-10 text-blue-700 mb-2" />
                <CardTitle>Análisis Clínico Avanzado</CardTitle>
                <CardDescription>Herramientas de evaluación y análisis para diagnóstico preciso.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Algoritmos especializados para el análisis de imágenes médicas y evaluación de casos complejos.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Activity className="h-10 w-10 text-blue-700 mb-2" />
                <CardTitle>Monitoreo de Pacientes</CardTitle>
                <CardDescription>Seguimiento continuo del estado y evolución de pacientes.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sistema de monitoreo en tiempo real para el seguimiento de parámetros clínicos críticos.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <ClipboardList className="h-10 w-10 text-blue-700 mb-2" />
                <CardTitle>Gestión de Historias Clínicas</CardTitle>
                <CardDescription>Expedientes digitales completos y organizados.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Centralización de información médica con acceso rápido y seguro a historiales completos.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-10 w-10 text-blue-700 mb-2" />
                <CardTitle>Colaboración Médica</CardTitle>
                <CardDescription>Trabajo conjunto entre especialistas.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Plataforma colaborativa para intercambio de información entre profesionales médicos.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-10 w-10 text-blue-700 mb-2" />
                <CardTitle>Protocolos Médicos</CardTitle>
                <CardDescription>Guías clínicas actualizadas y estandarizadas.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Implementación de protocolos médicos basados en evidencia científica actualizada.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BadgeAlert className="h-10 w-10 text-blue-700 mb-2" />
                <CardTitle>Sistema de Alertas</CardTitle>
                <CardDescription>Notificaciones automáticas para casos críticos.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Alertas inteligentes que notifican cambios significativos en el estado de pacientes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 w-full">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Resultados Comprobados</h2>
            <p className="text-gray-600">Estadísticas del sistema en uso clínico</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg bg-white shadow-md">
              <div className="text-4xl font-bold text-blue-700 mb-2">97%</div>
              <p className="text-gray-600">Precisión diagnóstica</p>
            </div>

            <div className="text-center p-6 rounded-lg bg-white shadow-md">
              <div className="text-4xl font-bold text-blue-700 mb-2">+500</div>
              <p className="text-gray-600">Casos procesados</p>
            </div>

            <div className="text-center p-6 rounded-lg bg-white shadow-md">
              <div className="text-4xl font-bold text-blue-700 mb-2">-45%</div>
              <p className="text-gray-600">Reducción tiempo diagnóstico</p>
            </div>

            <div className="text-center p-6 rounded-lg bg-white shadow-md">
              <div className="text-4xl font-bold text-blue-700 mb-2">+25</div>
              <p className="text-gray-600">Especialistas activos</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white w-full">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2">
              <div className="rounded-lg overflow-hidden">
                <img
                  src="../assets/images/caduceo.png"
                  alt="Equipo médico especializado"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            <div className="w-full lg:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Equipo Especializado</h2>
              <p className="text-gray-600">
                Desarrollado por un equipo multidisciplinario de especialistas en Neurociencias de la Universidad de
                Ciencias Médicas "Carlos J. Finlay", profesionales del Hospital Provincial Manuel Ascunce Domenech e
                ingenieros de la Universidad de Camagüey "Ignacio Agramonte y Loynaz".
              </p>
              <p className="text-gray-600">
                Nuestro objetivo es optimizar la atención médica especializada mediante tecnología avanzada y
                conocimiento clínico especializado.
              </p>
              <Button variant="outline" className="mt-4">
                Conocer al equipo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-700 text-white w-full">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Acceso Profesional</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Únete a la plataforma especializada para profesionales médicos en el manejo de hematomas subdurales.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100" asChild>
              <Link to="/Iniciar_Sesión">Iniciar Sesión</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default VisitorHome
