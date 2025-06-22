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
  Chip,
  Paper,
} from "@mui/material"
import {
  ExpandLess,
  ExpandMore,
  Person,
  LocalHospital,
  CalendarToday,
  Circle,
  Assignment,
  MedicalServices,
  PostAdd,
  Bloodtype,
} from "@mui/icons-material"
import { PdfExportButton } from "@/features/exportaciones/PdfExportButton"

const DRAWER_WIDTH = 350
const SIDEBAR_STATE_KEY = "hierarchicalSidebarState"

export const HierarchicalMedicalSidebar = () => {
  const { datos: paciente } = useSelector((state) => state.historiaClinica)
  const location = useLocation()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState("")

  // Función para cargar el estado desde localStorage
  const loadSidebarState = () => {
    try {
      const savedState = localStorage.getItem(SIDEBAR_STATE_KEY)
      if (savedState) {
        return JSON.parse(savedState)
      }
    } catch (error) {
      console.error("Error loading sidebar state:", error)
    }

    // Estado por defecto si no hay nada guardado
    return {
      expandedSections: { episodios: true },
      expandedEpisodios: {},
      expandedRegistrosOp: {},
    }
  }

  // Función para guardar el estado en localStorage
  const saveSidebarState = (state) => {
    try {
      localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(state))
    } catch (error) {
      console.error("Error saving sidebar state:", error)
    }
  }

  // Cargar estado inicial desde localStorage
  const [sidebarState, setSidebarState] = useState(loadSidebarState)

  // Estados individuales extraídos del estado principal
  const [expandedSections, setExpandedSections] = useState(sidebarState.expandedSections)
  const [expandedEpisodios, setExpandedEpisodios] = useState(sidebarState.expandedEpisodios)
  const [expandedRegistrosOp, setExpandedRegistrosOp] = useState(sidebarState.expandedRegistrosOp)

  // Efecto para guardar el estado cada vez que cambie
  useEffect(() => {
    const currentState = {
      expandedSections,
      expandedEpisodios,
      expandedRegistrosOp,
    }
    setSidebarState(currentState)
    saveSidebarState(currentState)
  }, [expandedSections, expandedEpisodios, expandedRegistrosOp])

  // Efecto para determinar la sección activa basada en la URL
  useEffect(() => {
    const path = location.pathname
    const searchParams = new URLSearchParams(location.search)
    const tab = searchParams.get("tab")

    if (path.includes("/RegistroPosoperatorio")) {
      setActiveSection("registro-posoperatorio")
    } else if (path.includes("/RegistroOperatorio")) {
      setActiveSection("registro-operatorio")
    } else if (path.includes("/Hematoma")) {
      setActiveSection("hematoma-subdural")
    } else if (path.includes("/Episodio")) {
      setActiveSection("episodio")
    } else if (path.includes("/HistoriaClinica")) {
      setActiveSection(tab || "informacion-basica")
    }
  }, [location])

  // Funciones para manejar la expansión/colapso con persistencia
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const toggleEpisodio = (episodioId) => {
    setExpandedEpisodios((prev) => ({
      ...prev,
      [episodioId]: !prev[episodioId],
    }))
  }

  const toggleRegistroOperatorio = (registroId) => {
    setExpandedRegistrosOp((prev) => ({
      ...prev,
      [registroId]: !prev[registroId],
    }))
  }

  // Funciones de navegación (sin cambios)
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

  const handleRegistroOperatorioClick = (registro, episodio) => {
    sessionStorage.setItem("selectedRegistroOperatorio", JSON.stringify(registro))
    sessionStorage.setItem("selectedEpisodio", JSON.stringify(episodio))
    sessionStorage.setItem("selectedPaciente", JSON.stringify(paciente))
    navigate("/Revision_casos/HistoriaClinica/Episodio/RegistroOperatorio")
  }

  const handleRegistroPosoperatorioClick = (registroPos, registroOp, episodio) => {
    sessionStorage.setItem("selectedRegistroPosoperatorio", JSON.stringify(registroPos))
    sessionStorage.setItem("selectedRegistroOperatorio", JSON.stringify(registroOp))
    sessionStorage.setItem("selectedEpisodio", JSON.stringify(episodio))
    sessionStorage.setItem("selectedPaciente", JSON.stringify(paciente))
    navigate("/Revision_casos/HistoriaClinica/Episodio/RegistroOperatorio/RegistroPosoperatorio")
  }

  const handleHematomaClick = (hematoma, episodio) => {
    sessionStorage.setItem("selectedHematomaSubdural", JSON.stringify(hematoma))
    sessionStorage.setItem("selectedEpisodio", JSON.stringify(episodio))
    sessionStorage.setItem("selectedPaciente", JSON.stringify(paciente))
    navigate("/Revision_casos/HistoriaClinica/Episodio/Hematoma")
  }

  const getEpisodioLabel = (episodio) => {
    if (episodio.inicio) {
      return new Date(episodio.inicio).toLocaleDateString("es-ES")
    }
    return `Episodio ${episodio.id}`
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
          top: "64px", // Comenzar debajo del header
          height: "calc(100vh - 64px)", // Altura total menos el header
        },
      }}
    >
      {/* Header con información del paciente */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: 0, borderBottom: "1px solid #e0e0e0" }}>
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
          {/* Botón PDF en el paper del paciente */}
          <Box sx={{ mt: 2 }}>
            <PdfExportButton paciente={paciente} />
          </Box>
        </Box>
      </Paper>

      {/* Navegación */}
      <List sx={{ pt: 1, overflow: "auto", flex: 1 }}>
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

        {/* Lista jerárquica de episodios */}
        <Collapse in={expandedSections.episodios} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {paciente.episodios && paciente.episodios.length > 0 ? (
              paciente.episodios.map((episodio) => (
                <Box key={episodio.id}>
                  {/* Episodio principal */}
                  <ListItem disablePadding>
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
                        secondary={`${episodio.rce?.length || 0} síntomas`}
                        primaryTypographyProps={{ variant: "body2" }}
                        secondaryTypographyProps={{ variant: "caption" }}
                      />
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {episodio.estado_al_egreso && (
                          <Chip label="Alta" size="small" color="success" variant="outlined" sx={{ mr: 1 }} />
                        )}
                        <Box
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleEpisodio(episodio.id)
                          }}
                        >
                          {expandedEpisodios[episodio.id] ? <ExpandLess /> : <ExpandMore />}
                        </Box>
                      </Box>
                    </ListItemButton>
                  </ListItem>

                  {/* Subniveles del episodio */}
                  <Collapse in={expandedEpisodios[episodio.id]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {/* Registros Operatorios */}
                      {episodio.registro_operatorio && episodio.registro_operatorio.length > 0 && (
                        <>
                          <ListItem disablePadding>
                            <ListItemButton sx={{ pl: 6, py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 28 }}>
                                <MedicalServices fontSize="small" />
                              </ListItemIcon>
                              <ListItemText
                                primary="Registros Operatorios"
                                secondary={`${episodio.registro_operatorio.length} registros`}
                                primaryTypographyProps={{ variant: "caption", fontWeight: "medium" }}
                                secondaryTypographyProps={{ variant: "caption" }}
                              />
                            </ListItemButton>
                          </ListItem>

                          {episodio.registro_operatorio.map((registro) => (
                            <Box key={registro.id}>
                              <ListItem disablePadding>
                                <ListItemButton
                                  onClick={() => handleRegistroOperatorioClick(registro, episodio)}
                                  selected={
                                    activeSection === "registro-operatorio" &&
                                    JSON.parse(sessionStorage.getItem("selectedRegistroOperatorio") || "{}")?.id ===
                                      registro.id
                                  }
                                  sx={{ pl: 8, py: 0.5 }}
                                >
                                  <ListItemIcon sx={{ minWidth: 24 }}>
                                    <Assignment fontSize="small" />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={
                                      registro.fecha_operacion
                                        ? new Date(registro.fecha_operacion).toLocaleDateString("es-ES")
                                        : `Registro ${registro.id}`
                                    }
                                    secondary={`Glasgow: ${registro.escala_evaluacion_resultados_glasgow || "N/A"}`}
                                    primaryTypographyProps={{ variant: "caption" }}
                                    secondaryTypographyProps={{ variant: "caption" }}
                                  />
                                  <Box
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleRegistroOperatorio(registro.id)
                                    }}
                                  >
                                    {expandedRegistrosOp[registro.id] ? (
                                      <ExpandLess fontSize="small" />
                                    ) : (
                                      <ExpandMore fontSize="small" />
                                    )}
                                  </Box>
                                </ListItemButton>
                              </ListItem>

                              {/* Registros Posoperatorios */}
                              <Collapse in={expandedRegistrosOp[registro.id]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                  {registro.registros_posoperatorios &&
                                    registro.registros_posoperatorios.length > 0 && (
                                      <>
                                        <ListItem disablePadding>
                                          <ListItemButton sx={{ pl: 10, py: 0.5 }}>
                                            <ListItemIcon sx={{ minWidth: 20 }}>
                                              <PostAdd fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText
                                              primary="Registros Posoperatorios"
                                              secondary={`${registro.registros_posoperatorios.length} registros`}
                                              primaryTypographyProps={{ variant: "caption", fontWeight: "medium" }}
                                              secondaryTypographyProps={{ variant: "caption" }}
                                            />
                                          </ListItemButton>
                                        </ListItem>

                                        {registro.registros_posoperatorios.map((registroPos) => (
                                          <ListItem key={registroPos.id} disablePadding>
                                            <ListItemButton
                                              onClick={() =>
                                                handleRegistroPosoperatorioClick(registroPos, registro, episodio)
                                              }
                                              selected={
                                                activeSection === "registro-posoperatorio" &&
                                                JSON.parse(
                                                  sessionStorage.getItem("selectedRegistroPosoperatorio") || "{}",
                                                )?.id === registroPos.id
                                              }
                                              sx={{ pl: 12, py: 0.5 }}
                                            >
                                              <ListItemIcon sx={{ minWidth: 20 }}>
                                                <Circle sx={{ fontSize: 6, color: "secondary.main" }} />
                                              </ListItemIcon>
                                              <ListItemText
                                                primary={
                                                  registroPos.fecha
                                                    ? new Date(registroPos.fecha).toLocaleDateString("es-ES")
                                                    : `Posop ${registroPos.id}`
                                                }
                                                secondary={`Días: ${registroPos.tiempo_transcurrido || "N/A"}`}
                                                primaryTypographyProps={{ variant: "caption" }}
                                                secondaryTypographyProps={{ variant: "caption" }}
                                              />
                                            </ListItemButton>
                                          </ListItem>
                                        ))}
                                      </>
                                    )}
                                </List>
                              </Collapse>
                            </Box>
                          ))}
                        </>
                      )}

                      {/* Hematomas Subdurales */}
                      {episodio.hematomas_subdurales && episodio.hematomas_subdurales.length > 0 && (
                        <>
                          <ListItem disablePadding>
                            <ListItemButton sx={{ pl: 6, py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 28 }}>
                                <Bloodtype fontSize="small" />
                              </ListItemIcon>
                              <ListItemText
                                primary="Hematomas Subdurales"
                                secondary={`${episodio.hematomas_subdurales.length} hematomas`}
                                primaryTypographyProps={{ variant: "caption", fontWeight: "medium" }}
                                secondaryTypographyProps={{ variant: "caption" }}
                              />
                            </ListItemButton>
                          </ListItem>

                          {episodio.hematomas_subdurales.map((hematoma) => (
                            <ListItem key={hematoma.id} disablePadding>
                              <ListItemButton
                                onClick={() => handleHematomaClick(hematoma, episodio)}
                                selected={
                                  activeSection === "hematoma-subdural" &&
                                  JSON.parse(sessionStorage.getItem("selectedHematomaSubdural") || "{}")?.id ===
                                    hematoma.id
                                }
                                sx={{ pl: 8, py: 0.5 }}
                              >
                                <ListItemIcon sx={{ minWidth: 24 }}>
                                  <Circle sx={{ fontSize: 6, color: "error.main" }} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={`Hematoma ${hematoma.id}`}
                                  secondary={`Vol: ${hematoma.volumen || "N/A"}ml, Glasgow: ${hematoma.escala_glasgow_ingreso || "N/A"}`}
                                  primaryTypographyProps={{ variant: "caption" }}
                                  secondaryTypographyProps={{ variant: "caption" }}
                                />
                              </ListItemButton>
                            </ListItem>
                          ))}
                        </>
                      )}
                    </List>
                  </Collapse>
                </Box>
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
      </List>
    </Drawer>
  )
}

export default HierarchicalMedicalSidebar
