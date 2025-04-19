"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { HistoriaClinicaLayout } from "@/components/layout/HistoriaClinicaLayout"
import { CustomTabs } from "@/components/shared/CustomTabs"
import { InformacionBasicaPanel } from "@/features/general/InformacionBasicaPanel"
import { RasgosClinicosPanel } from "@/features/general/RasgosClinicosPanel"
import { EpisodiosPanel } from "@/features/general/EpisodiosPanel"

function HistoriaClinicaDetail() {
  const { datos } = useSelector((state) => state.historiaClinica)
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)

  // Determinar la pestaña activa basada en los parámetros de URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const tab = searchParams.get("tab")

    if (tab === "rasgos-clinicos") {
      setActiveTab(1)
    } else if (tab === "episodios") {
      setActiveTab(2)
    } else {
      setActiveTab(0) // Información básica por defecto
    }
  }, [location])

  // Actualizar la URL cuando cambia la pestaña
  const handleTabChange = (index) => {
    setActiveTab(index)

    let tabParam = "informacion-basica"
    if (index === 1) tabParam = "rasgos-clinicos"
    if (index === 2) tabParam = "episodios"

    navigate(`/Revision_casos/HistoriaClinica?tab=${tabParam}`, { replace: true })
  }

  // Configuración de las pestañas
  const tabs = [
    {
      label: "Información Básica",
      content: <InformacionBasicaPanel />,
    },
    {
      label: "Rasgos Clínicos Globales",
      content: <RasgosClinicosPanel />,
    },
    {
      label: "Episodios",
      content: <EpisodiosPanel />,
    },
  ]

  return (
    <HistoriaClinicaLayout title="Historia Clínica del Paciente">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-1">
        <CustomTabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </HistoriaClinicaLayout>
  )
}

export default HistoriaClinicaDetail
