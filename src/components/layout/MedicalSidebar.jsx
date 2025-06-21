"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Box,
  Divider,
  Chip,
  Paper,
} from "@mui/material"
import {
  ExpandLess,
  ExpandMore,
  Person,
  LocalHospital,
  CalendarToday,
  ArrowBack,
  Circle,
  MedicalServices,
  Assignment,
} from "@mui/icons-material"

const DRAWER_WIDTH = 320

export const MedicalSidebar = () => {
  const { datos: paciente } = useSelector((state) => state.historiaClinica)
  const location = useLocation()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState("")
  const [expandedSections, setExpandedSections] = useState({
    episodios: true,
  })

  useEffect(() => {
    const path = location.pathname
    if (path.includes("/Episodio")) {
      setActiveSection("episodio")
    } else if (path.includes("/HistoriaClinica")) {
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

  const handleEpisodioClick = (episodio) => {
    sessionStorage.setItem("selectedEpisodio", JSON.stringify(episodio))
    sessionStorage.setItem("selectedPaciente", JSON.stringify(paciente))

    if (location.pathname.includes("/Episodio")) {
      const timestamp = new Date().getTime()
      navigate(`/Revision_casos/HistoriaClinica/Episodio?t=${timestamp}`)
    } else {
      navigate("/Revision_casos/HistoriaClinica/Episodio")
    }
  }

  const getEpisodioLabel = (episodio) => {
    if (episodio.inicio) {
      return new Date(episodio.inicio).toLocaleDateString("es-ES")
    }
    return `Episodio ${episodio.id}`
  }

  const getEpisodioSubtitle = (episodio) => {
    const rceCount = episodio.rce?.length || 0
    const operacionesCount = episodio.registro_operatorio?.length || 0
    const hematomasCount = episodio.hematomas_subdurales?.length || 0

    return `${rceCount} síntomas, ${operacionesCount} cirugías, ${hematomasCount} hematomas`
  }

  if (!paciente || !paciente.id) {
    return null
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          borderRight: "1px solid #e0e0e0",
        },
      }}
    >
      {/* Header con información del paciente */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: 0, borderBottom: "1px solid #e0e0e0" }}>
        <Typography variant="h6" color="primary" gutterBottom>
          Historia Clínica
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="subtitle1" fontWeight="medium" color="primary">
            {paciente.nombre} {paciente.apellidos}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            ID: {paciente.numero}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Seudónimo: {paciente.seudonimo}
          </Typography>
          <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip label={`${paciente.edad} años`} size="small" variant="outlined" />
            <Chip label={paciente.sexo ? "Masculino" : "Femenino"} size="small" variant="outlined" />
            {paciente.historial_trauma_craneal && (
              <Chip label="Trauma craneal" size="small" color="warning" variant="outlined" />
            )}
          </Box>
        </Box>
      </Paper>

      {/* Navegación */}
      <List sx={{ pt: 1 }}>
        {/* Volver al listado */}
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/Revision_casos" sx={{ py: 1 }}>
            <ListItemIcon>
              <ArrowBack />
            </ListItemIcon>
            <ListItemText primary="Volver a Listado" />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ my: 1 }} />

        {/* Información Básica */}
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/Revision_casos/HistoriaClinica?tab=informacion-basica"
            selected={activeSection === "informacion-basica"}
            sx={{ py: 1 }}
          >
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Información Básica" />
          </ListItemButton>
        </ListItem>

        {/* Rasgos Clínicos Generales */}
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/Revision_casos/HistoriaClinica?tab=rasgos-clinicos"
            selected={activeSection === "rasgos-clinicos"}
            sx={{ py: 1 }}
          >
            <ListItemIcon>
              <LocalHospital />
            </ListItemIcon>
            <ListItemText
              primary="Rasgos Clínicos Generales"
              secondary={paciente.rcg?.length ? `${paciente.rcg.length} registros` : "Sin registros"}
            />
          </ListItemButton>
        </ListItem>

        {/* Episodios */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => toggleSection("episodios")} sx={{ py: 1 }}>
            <ListItemIcon>
              <CalendarToday />
            </ListItemIcon>
            <ListItemText primary="Episodios" secondary={`${paciente.episodios?.length || 0} episodios`} />
            {expandedSections.episodios ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>

        {/* Lista de episodios */}
        <Collapse in={expandedSections.episodios} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {paciente.episodios && paciente.episodios.length > 0 ? (
              paciente.episodios.map((episodio) => (
                <ListItem key={episodio.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleEpisodioClick(episodio)}
                    selected={
                      activeSection === "episodio" &&
                      JSON.parse(sessionStorage.getItem("selectedEpisodio") || "{}")?.id === episodio.id
                    }
                    sx={{ pl: 4, py: 1 }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Circle sx={{ fontSize: 8, color: "primary.main" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={getEpisodioLabel(episodio)}
                      secondary={getEpisodioSubtitle(episodio)}
                      primaryTypographyProps={{ variant: "body2" }}
                      secondaryTypographyProps={{ variant: "caption" }}
                    />
                    {episodio.estado_al_egreso && (
                      <Chip label="Alta" size="small" color="success" variant="outlined" sx={{ ml: 1 }} />
                    )}
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <ListItem sx={{ pl: 4 }}>
                <ListItemText
                  primary="No hay episodios registrados"
                  primaryTypographyProps={{
                    variant: "body2",
                    color: "text.secondary",
                    fontStyle: "italic",
                  }}
                />
              </ListItem>
            )}
          </List>
        </Collapse>

        {/* Secciones adicionales si hay episodios */}
        {paciente.episodios && paciente.episodios.length > 0 && (
          <>
            <Divider sx={{ my: 1 }} />

            {/* Resumen de síntomas */}
            <ListItem disablePadding>
              <ListItemButton sx={{ py: 1 }}>
                <ListItemIcon>
                  <MedicalServices />
                </ListItemIcon>
                <ListItemText
                  primary="Resumen de Síntomas"
                  secondary={`${paciente.episodios.reduce((acc, ep) => acc + (ep.rce?.length || 0), 0)} total`}
                />
              </ListItemButton>
            </ListItem>

            {/* Resumen de cirugías */}
            <ListItem disablePadding>
              <ListItemButton sx={{ py: 1 }}>
                <ListItemIcon>
                  <Assignment />
                </ListItemIcon>
                <ListItemText
                  primary="Resumen de Cirugías"
                  secondary={`${paciente.episodios.reduce((acc, ep) => acc + (ep.registro_operatorio?.length || 0), 0)} total`}
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  )
}

export default MedicalSidebar
