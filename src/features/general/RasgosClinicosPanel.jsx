"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { EmptyState } from "@/components/shared/EmptyState"
import { EditarRasgosClinicosForm } from "@/components/shared/EditarRasgosClinicosForm"
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

export const RasgosClinicosPanel = () => {
  const datosRedux = useSelector((state) => state.historiaClinica)
  const [datos, setDatos] = useState(datosRedux.datos)
  const [editing, setEditing] = useState(false)

  // Clasificaciones de rasgos clínicos
  const clasificaciones = [
    "Factor Predisponente",
    "Antecedente Neurológico",
    "Antecedente Patológico",
    "Lesión Isquémica",
    "Factor de Riesgo",
  ]

  const handleCancel = (otrosDatos) => {
    setEditing(false)
    console.log("me ejecuto")
    setDatos(otrosDatos)
  }

  const hasRasgos = Array.isArray(datos?.rcg) && datos.rcg.length > 0

  // Función para obtener color del chip según clasificación
  const getChipColor = (clasificacion) => {
    const colors = {
      "Factor Predisponente": "primary",
      "Antecedente Neurológico": "secondary",
      "Antecedente Patológico": "error",
      "Lesión Isquémica": "warning",
      "Factor de Riesgo": "info",
    }
    return colors[clasificacion] || "default"
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
          Rasgos Clínicos Globales
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
        <EditarRasgosClinicosForm onCancel={handleCancel} />
      ) : !hasRasgos ? (
        <EmptyState message="No existen rasgos clínicos globales registrados" />
      ) : (
        <Box>
          {clasificaciones.map((clasificacion) => {
            const items = datos.rcg.filter((item) => item.codificador.clasificacion === clasificacion)

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
                              {item.codificador.nombre_corto}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2, fontSize: "0.875rem" }}>
                              {item.codificador.descripcion}
                            </Typography>
                            {item.notas && (
                              <Box sx={{ mt: 2, p: 1, bgcolor: "grey.50", borderRadius: 1 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                  Notas:
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                                  {item.notas}
                                </Typography>
                              </Box>
                            )}
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
