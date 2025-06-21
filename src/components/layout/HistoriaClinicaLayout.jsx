"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import HierarchicalMedicalSidebar from "./HierarchicalMedicalSidebar"

export const HistoriaClinicaLayout = ({ children, title }) => {
  const { datos: paciente } = useSelector((state) => state.historiaClinica)
  const navigate = useNavigate()
  const [showFooter, setShowFooter] = useState(false)

  // Redirigir si no hay datos de paciente
  useEffect(() => {
    if (!paciente || !paciente.id) {
      navigate("/Revision_casos")
    }
  }, [paciente, navigate])

  // Controlar la visibilidad del footer basado en el scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowFooter(true)
      } else {
        setShowFooter(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      {/* Header fijo */}
      <Header />

      {/* Contenedor principal que comienza debajo del header */}
      <div className="flex pt-16">
        {/* Sidebar jerárquico que comienza debajo del header */}
        <HierarchicalMedicalSidebar />

        {/* Contenido principal con margen izquierdo para dejar espacio al sidebar */}
        <main className="flex-grow">
        <section className="px-6 py-8 bg-gradient-to-b from-gray-100 to-white w-full min-h-full">            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{title}</h1>
                  {paciente && paciente.id && (
                    <div className="flex items-center text-lg text-blue-600 font-medium">
                      <span>
                        {paciente.nombre} {paciente.apellidos}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="text-gray-500 text-base">ID: {paciente.numero || "N/A"}</span>
                    </div>
                  )}
                </div>

                {/* Contenido principal */}
                <div className="pb-32">{children}</div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Footer que aparece después de un pequeño scroll */}
      {showFooter && (
        <div className="w-full z-1300">
          <Footer />
        </div>
      )}
    </div>
  )
}

export default HistoriaClinicaLayout