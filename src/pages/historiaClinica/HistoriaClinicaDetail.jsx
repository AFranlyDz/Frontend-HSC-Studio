"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { HistoriaClinicaLayout } from "@/components/layout/HistoriaClinicaLayout"
import { MuiTabs } from "@/components/shared/MuiTabs"
import { InformacionBasicaPanel } from "@/features/general/InformacionBasicaPanel"
import { RasgosClinicosPanel } from "@/features/general/RasgosClinicosPanel"
import { EpisodiosPanel } from "@/features/gestionarEpisodio/EpisodiosPanel"
import { Paper } from "@mui/material"
import InfoOutlineIcon from "@mui/icons-material/InfoOutline"

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
      icon: <InfoOutlineIcon />,
      iconPosition: "start",
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
      <Paper elevation={1} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <MuiTabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
      </Paper>
    </HistoriaClinicaLayout>
  )
}

export default HistoriaClinicaDetail
