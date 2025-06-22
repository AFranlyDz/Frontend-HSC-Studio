"use client"

import { useState } from "react"
import { EmptyState } from "@/components/shared/EmptyState"
import { EditarRasgosClinicosEpisodioForm } from "./EditarRasgosClinicosEpisodioForm"
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material"
import { Edit, ExpandMore } from "@mui/icons-material"

export const RasgosClinicosEpisodioPanel = ({ Episodio }) => {
  const [episodio, setEpisodio] = useState(Episodio)
  const [editing, setEditing] = useState(false)

  // Clasificaciones de rasgos clínicos
  const clasificaciones = ["Síntoma", "Forma Clínica de Presentación"]

  const hasRasgos = Array.isArray(episodio?.rce) && episodio.rce.length > 0
  if (!episodio) return <div>Cargando episodio...</div>

  const handleCancel = (otrosDatos) => {
    setEpisodio(otrosDatos)
    setEditing(false)
  }

  // Función para obtener color del chip según clasificación
  const getChipColor = (clasificacion) => {
    const colors = {
      Síntoma: "primary",
      "Forma Clínica de Presentación": "secondary",
    }
    return colors[clasificacion] || "default"
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
          Rasgos Clínicos del Episodio
        </Typography>
        <Button
          onClick={() => setEditing(!editing)}
          variant="contained"
          startIcon={editing ? null : <Edit />}
          color={editing ? "error" : "primary"}
          sx={{ textTransform: "none" }}
        >
          {editing ? "Cancelar" : "Editar"}
        </Button>
      </Box>

      {editing ? (
        <EditarRasgosClinicosEpisodioForm episodio={episodio} onCancel={handleCancel} />
      ) : !hasRasgos ? (
        <EmptyState message="No existen rasgos clínicos registrados para este episodio" />
      ) : (
        <Box>
          {clasificaciones.map((clasificacion) => {
            const items = episodio.rce.filter((item) => item.codificador.clasificacion === clasificacion)

            if (items.length === 0) return null

            return (
              <Accordion key={clasificacion} defaultExpanded sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {clasificacion}
                    </Typography>
                    <Chip
                      label={`${items.length} item${items.length > 1 ? "s" : ""}`}
                      size="small"
                      color={getChipColor(clasificacion)}
                      variant="outlined"
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {items.map((item) => (
                      <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Card
                          variant="outlined"
                          sx={{ height: "100%", transition: "all 0.2s", "&:hover": { boxShadow: 2 } }}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "primary.main" }}>
                              {item.codificador.nombre}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                              {item.codificador.descripcion}
                            </Typography>
                            <Box sx={{ mt: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                              <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                  Tiempo (días):
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                                  {item.tiempo || "N/A"}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                  Notas:
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                                  {item.notas || "N/A"}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )
          })}
        </Box>
      )}
    </Box>
  )
}
