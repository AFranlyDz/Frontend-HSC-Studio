"use client"

import { useEffect, useState } from "react"
import { Brain, Activity, ClipboardList, Users, FileText, ArrowRight, BadgeAlert } from "lucide-react"
import { useDispatch } from "react-redux"
import axios from "axios"

import Header from "@/components/layout/Header.jsx"
import Footer from "@/components/layout/Footer.jsx"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {setCodificadores} from "@/features/codificadores/codificadoresSlice"

function Home() {
  const apiUrl = import.meta.env.VITE_API_BACKEND
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  // Al cargar la página, hacemos scroll al principio
  useEffect(() => {
    window.scrollTo(0, 0);
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
    };
    loadData()
  }, [apiUrl, dispatch])

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-20 bg-gradient-to-b from-gray-100 to-white w-full">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            <div className="w-full md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Plataforma avanzada para el manejo de
                <span className="text-blue-700"> Hematomas Subdurales</span>
              </h1>
              <p className="text-lg text-gray-700 max-w-xl">
                Un sistema integral desarrollado por expertos en neurociencias para mejorar la atención y seguimiento de
                pacientes con hematomas subdurales.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Button size="lg" className="bg-blue-700 hover:bg-blue-800">
                  Iniciar Sesión
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
                  alt="Sistema de Neurociencias"
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Características del Sistema</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Nuestra plataforma integra tecnologías avanzadas para asistir en el diagnóstico y tratamiento de hematomas
              subdurales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Brain className="h-10 w-10 text-blue-700 mb-2" />
                <CardTitle>Análisis Neurológico</CardTitle>
                <CardDescription>
                  Evaluación asistida por IA de imágenes médicas para la detección temprana.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Incorpora algoritmos avanzados para identificar patrones y anomalías en estudios imagenológicos.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Activity className="h-10 w-10 text-blue-700 mb-2" />
                <CardTitle>Seguimiento en Tiempo Real</CardTitle>
                <CardDescription>
                  Monitoreo continuo del estado del paciente y evolución del tratamiento.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Actualización constante de parámetros clínicos relevantes para la toma de decisiones médicas.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <ClipboardList className="h-10 w-10 text-blue-700 mb-2" />
                <CardTitle>Historial Clínico Integral</CardTitle>
                <CardDescription>
                  Expedientes digitales completos con acceso a todo el historial médico.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Centraliza toda la información médica relevante para facilitar la consulta y toma de decisiones.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-blue-700 mb-2" />
                <CardTitle>Colaboración Multidisciplinaria</CardTitle>
                <CardDescription>
                  Plataforma para trabajo conjunto entre especialistas de diferentes áreas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Facilita la comunicación e intercambio de información entre profesionales de la salud.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-10 w-10 text-blue-700 mb-2" />
                <CardTitle>Protocolos Estandarizados</CardTitle>
                <CardDescription>Guías clínicas actualizadas basadas en evidencia científica.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Implementación de mejores prácticas médicas respaldadas por investigación reciente.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BadgeAlert className="h-10 w-10 text-blue-700 mb-2" />
                <CardTitle>Alertas Inteligentes</CardTitle>
                <CardDescription>
                  Notificaciones automáticas ante cambios significativos en el estado del paciente.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sistema proactivo que avisa a los profesionales médicos cuando se requiere atención inmediata.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 w-full">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg bg-white shadow-md">
              <div className="text-4xl font-bold text-blue-700 mb-2">97%</div>
              <p className="text-gray-600">Precisión diagnóstica</p>
            </div>

            <div className="text-center p-6 rounded-lg bg-white shadow-md">
              <div className="text-4xl font-bold text-blue-700 mb-2">+500</div>
              <p className="text-gray-600">Casos atendidos</p>
            </div>

            <div className="text-center p-6 rounded-lg bg-white shadow-md">
              <div className="text-4xl font-bold text-blue-700 mb-2">-45%</div>
              <p className="text-gray-600">Reducción tiempo de diagnóstico</p>
            </div>

            <div className="text-center p-6 rounded-lg bg-white shadow-md">
              <div className="text-4xl font-bold text-blue-700 mb-2">+25</div>
              <p className="text-gray-600">Especialistas colaboradores</p>
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
                  src="/placeholder.svg?height=400&width=600"
                  alt="Equipo médico"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            <div className="w-full lg:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Nuestro Equipo</h2>
              <p className="text-gray-600">
                Somos un equipo multidisciplinario formado por especialistas en Neurociencias de la Universidad de
                Ciencias Médicas "Carlos J. Finlay", personal médico del Hospital Provincial Manuel Ascunce Domenech e
                ingenieros de la Facultad de Informática y Ciencias Exactas de la Universidad de Camagüey "Ignacio
                Agramonte y Loynaz".
              </p>
              <p className="text-gray-600">
                Nuestra misión es mejorar la calidad de atención a pacientes con Hematomas Subdurales mediante la
                aplicación de tecnologías avanzadas y conocimiento médico especializado.
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
          <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para comenzar?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Únete a nuestra plataforma y forma parte de este avance en el manejo de hematomas subdurales.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
              Iniciar Sesión
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-800">
              Registrarse
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home

