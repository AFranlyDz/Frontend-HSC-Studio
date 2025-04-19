"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { ChevronDown, ChevronRight, User, FileText, Activity, Calendar } from "lucide-react"

export const Sidebar = () => {
  const { datos: paciente } = useSelector((state) => state.historiaClinica)
  const location = useLocation()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState("")
  const [expandedSections, setExpandedSections] = useState({
    episodios: true,
  })

  useEffect(() => {
    // Determinar la sección activa basada en la URL actual
    const path = location.pathname
    if (path.includes("/Episodio")) {
      setActiveSection("episodio")
    } else if (path.includes("/HistoriaClinica")) {
      // Determinar la pestaña activa si estamos en la página principal de historia clínica
      const searchParams = new URLSearchParams(location.search)
      const tab = searchParams.get("tab")
      setActiveSection(tab || "informacion-basica")
    }
  }, [location])

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Función para navegar a un episodio específico
  const handleEpisodioClick = (episodio) => {
    // Almacenar el episodio en sessionStorage para recuperarlo en la página de destino
    sessionStorage.setItem("selectedEpisodio", JSON.stringify(episodio))
    sessionStorage.setItem("selectedPaciente", JSON.stringify(paciente))

    // Si ya estamos en la página de episodio, primero navegar a otra ruta y luego volver
    // para forzar la recarga del componente
    if (location.pathname.includes("/Episodio")) {
      // Usar un timestamp para forzar una URL única cada vez
      const timestamp = new Date().getTime()
      navigate(`/Revision_casos/HistoriaClinica/Episodio?t=${timestamp}`)
    } else {
      navigate("/Revision_casos/HistoriaClinica/Episodio")
    }
  }

  // Si no hay paciente, no mostrar el sidebar
  if (!paciente || !paciente.id) {
    return null
  }

  return (
    <aside className="bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Historia Clínica</h2>
        <div className="mt-2">
          <p className="text-sm font-medium text-blue-600">
            {paciente.nombre} {paciente.apellidos}
          </p>
          <p className="text-xs text-gray-500">ID: {paciente.numero}</p>
          <p className="text-xs text-gray-500">Seudónimo: {paciente.seudonimo}</p>
        </div>
      </div>

      <nav className="p-2">
        <ul className="space-y-1">
          {/* Enlace a la página principal de revisión de casos */}
          <li>
            <Link
              to="/Revision_casos"
              className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
            >
              <FileText size={16} className="mr-2" />
              Volver a Listado
            </Link>
          </li>

          {/* Sección de Información Básica */}
          <li>
            <Link
              to="/Revision_casos/HistoriaClinica?tab=informacion-basica"
              className={`flex items-center px-3 py-2 text-sm rounded-md ${
                activeSection === "informacion-basica"
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <User size={16} className="mr-2" />
              Información Básica
            </Link>
          </li>

          {/* Sección de Rasgos Clínicos */}
          <li>
            <Link
              to="/Revision_casos/HistoriaClinica?tab=rasgos-clinicos"
              className={`flex items-center px-3 py-2 text-sm rounded-md ${
                activeSection === "rasgos-clinicos"
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Activity size={16} className="mr-2" />
              Rasgos Clínicos
            </Link>
          </li>

          {/* Sección de Episodios */}
          <li>
            <div className="flex flex-col">
              <button
                onClick={() => toggleSection("episodios")}
                className={`flex items-center justify-between px-3 py-2 text-sm rounded-md ${
                  activeSection === "episodios"
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  Episodios
                </div>
                {expandedSections.episodios ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>

              {/* Lista de episodios */}
              {expandedSections.episodios && paciente.episodios && paciente.episodios.length > 0 && (
                <ul className="ml-6 mt-1 space-y-1">
                  {paciente.episodios.map((episodio) => (
                    <li key={episodio.id}>
                      <button
                        onClick={() => handleEpisodioClick(episodio)}
                        className={`flex items-center px-3 py-2 text-sm rounded-md w-full text-left ${
                          activeSection === "episodio" &&
                          JSON.parse(sessionStorage.getItem("selectedEpisodio"))?.id === episodio.id
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                        {episodio.inicio ? new Date(episodio.inicio).toLocaleDateString() : "Sin fecha"}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Mensaje si no hay episodios */}
              {expandedSections.episodios && (!paciente.episodios || paciente.episodios.length === 0) && (
                <div className="ml-6 mt-1 px-3 py-2 text-sm text-gray-500">No hay episodios registrados</div>
              )}
            </div>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
