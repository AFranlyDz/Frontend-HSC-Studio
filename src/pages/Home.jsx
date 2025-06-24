"use client"

import { useEffect, useState } from "react"
import {
  Brain,
  Activity,
  ClipboardList,
  Users,
  FileText,
  ArrowRight,
  BadgeAlert,
  Search,
  Calendar,
  TrendingUp,
  Clock,
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import axios from "axios"

import Header from "@/components/layout/Header.jsx"
import Footer from "@/components/layout/Footer.jsx"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { setCodificadores } from "@/features/codificadores/codificadoresSlice"

function Home() {
  const apiUrl = import.meta.env.VITE_API_BACKEND
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

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
      <Header />

      {/* Dashboard Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-20 bg-gradient-to-b from-blue-50 to-white w-full">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            <div className="w-full md:w-1/2 space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-gray-600">Bienvenido, {user?.username || "Doctor"}</h1>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Dashboard Médico
                  <span className="text-blue-700"> HSC-Studio</span>
                </h2>
              </div>
              <p className="text-lg text-gray-700 max-w-xl">
                Accede a todas las herramientas profesionales para el manejo integral de casos de hematomas subdurales.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Button size="lg" className="bg-blue-700 hover:bg-blue-800" asChild>
                  <Link to="/Revision_casos">Revisar Casos</Link>
                </Button>
                <Button size="lg" variant="outline">
                  <Search className="mr-2 h-4 w-4" />
                  Buscar Paciente
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/2 mt-8 md:mt-0">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <Activity className="h-8 w-8 text-blue-700 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-700">12</div>
                    <p className="text-sm text-gray-600">Casos Activos</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-green-700 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-700">8</div>
                    <p className="text-sm text-gray-600">Casos Resueltos</p>
                  </CardContent>
                </Card>
                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="p-4 text-center">
                    <Clock className="h-8 w-8 text-orange-700 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-700">3</div>
                    <p className="text-sm text-gray-600">Pendientes</p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-8 w-8 text-purple-700 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-700">5</div>
                    <p className="text-sm text-gray-600">Esta Semana</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-16 bg-white w-full">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Acciones Rápidas</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Herramientas principales para el trabajo diario con casos de hematomas subdurales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-200">
              <CardHeader>
                <ClipboardList className="h-10 w-10 text-blue-700 mb-2" />
                <CardTitle>Revisar Casos</CardTitle>
                <CardDescription>Accede a la lista completa de casos y historias clínicas.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link to="/Revision_casos">Ir a Casos</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-green-200">
              <CardHeader>
                <Brain className="h-10 w-10 text-green-700 mb-2" />
                <CardTitle>Nuevo Análisis</CardTitle>
                <CardDescription>Iniciar evaluación de un nuevo caso clínico.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-green-700 hover:bg-green-800">Crear Análisis</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-purple-200">
              <CardHeader>
                <Activity className="h-10 w-10 text-purple-700 mb-2" />
                <CardTitle>Monitoreo</CardTitle>
                <CardDescription>Seguimiento en tiempo real de pacientes activos.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-purple-700 hover:bg-purple-800">Ver Monitoreo</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-orange-200">
              <CardHeader>
                <Users className="h-10 w-10 text-orange-700 mb-2" />
                <CardTitle>Colaboración</CardTitle>
                <CardDescription>Consultar con otros especialistas del equipo.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-orange-700 hover:bg-orange-800">Colaborar</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-red-200">
              <CardHeader>
                <BadgeAlert className="h-10 w-10 text-red-700 mb-2" />
                <CardTitle>Alertas</CardTitle>
                <CardDescription>Revisar notificaciones y casos urgentes.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-red-700 hover:bg-red-800">Ver Alertas</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-indigo-200">
              <CardHeader>
                <FileText className="h-10 w-10 text-indigo-700 mb-2" />
                <CardTitle>Reportes</CardTitle>
                <CardDescription>Generar reportes y estadísticas médicas.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-indigo-700 hover:bg-indigo-800">Generar Reporte</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* System Stats Section */}
      <section className="py-16 bg-gray-50 w-full">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Estadísticas del Sistema</h2>
            <p className="text-gray-600">Métricas actualizadas del rendimiento clínico</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg bg-white shadow-md border-l-4 border-blue-500">
              <div className="text-4xl font-bold text-blue-700 mb-2">97%</div>
              <p className="text-gray-600">Precisión Diagnóstica</p>
              <p className="text-xs text-gray-500 mt-1">↑ 2% vs mes anterior</p>
            </div>

            <div className="text-center p-6 rounded-lg bg-white shadow-md border-l-4 border-green-500">
              <div className="text-4xl font-bold text-green-700 mb-2">523</div>
              <p className="text-gray-600">Casos Procesados</p>
              <p className="text-xs text-gray-500 mt-1">↑ 15% vs mes anterior</p>
            </div>

            <div className="text-center p-6 rounded-lg bg-white shadow-md border-l-4 border-orange-500">
              <div className="text-4xl font-bold text-orange-700 mb-2">2.3h</div>
              <p className="text-gray-600">Tiempo Promedio</p>
              <p className="text-xs text-gray-500 mt-1">↓ 45% vs método tradicional</p>
            </div>

            <div className="text-center p-6 rounded-lg bg-white shadow-md border-l-4 border-purple-500">
              <div className="text-4xl font-bold text-purple-700 mb-2">28</div>
              <p className="text-gray-600">Especialistas Activos</p>
              <p className="text-xs text-gray-500 mt-1">↑ 3 nuevos este mes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="py-16 bg-white w-full">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Actividad Reciente</h2>
              <div className="space-y-4">
                <Card className="border-l-4 border-blue-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">Caso #HC-2024-001</h4>
                        <p className="text-sm text-gray-600">Hematoma subdural agudo - Evaluación completada</p>
                      </div>
                      <span className="text-xs text-gray-500">Hace 2h</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-green-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">Caso #HC-2024-002</h4>
                        <p className="text-sm text-gray-600">Seguimiento postoperatorio - Evolución favorable</p>
                      </div>
                      <span className="text-xs text-gray-500">Hace 4h</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-orange-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">Caso #HC-2024-003</h4>
                        <p className="text-sm text-gray-600">Consulta multidisciplinaria solicitada</p>
                      </div>
                      <span className="text-xs text-gray-500">Hace 6h</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Button variant="outline" className="mt-6 w-full">
                Ver Toda la Actividad <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Herramientas Médicas</h2>
              <div className="grid grid-cols-1 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Brain className="h-8 w-8 text-blue-700" />
                      <div>
                        <h4 className="font-semibold">Calculadora de Escalas</h4>
                        <p className="text-sm text-gray-600">Glasgow, McWalder, Oslo</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Activity className="h-8 w-8 text-green-700" />
                      <div>
                        <h4 className="font-semibold">Análisis de Imágenes</h4>
                        <p className="text-sm text-gray-600">Procesamiento TAC/RMN</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-purple-700" />
                      <div>
                        <h4 className="font-semibold">Protocolos Clínicos</h4>
                        <p className="text-sm text-gray-600">Guías actualizadas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
