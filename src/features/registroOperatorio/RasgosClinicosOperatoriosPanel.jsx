"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { EmptyState } from "@/components/shared/EmptyState"
import { EditarRasgosClinicosOperatoriosForm } from "./EditarRasgosClinicosOperatoriosForm"
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

export const RasgosClinicosOperatoriosPanel = ({ registroOperatorioId, RasgosClinicos }) => {
  const [editing, setEditing] = useState(false)
  const [rasgosClinicos, setRasgosClinicos] = useState(RasgosClinicos)
  const apiUrl = import.meta.env.VITE_API_BACKEND

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}rasgos_operatorios_lectura/?registro_operatorio__id=${registroOperatorioId}`,
        )
        setRasgosClinicos(response.data)
      } catch (error) {
        console.error("Error al cargar datos:", error)
      }
    }
    fetchData()
  }, [registroOperatorioId, apiUrl])

  // Clasificaciones de rasgos clínicos operatorios
  const clasificaciones = ["Tratamiento Quírurgico", "Complicaciones Médicas", "Complicaciones Cirugía"]

  const hasRasgos = rasgosClinicos && rasgosClinicos.length > 0

  const handleCancel = (actualizado) => {
    setEditing(false)
    setRasgosClinicos(actualizado)
  }

  // Función para obtener color del chip según clasificación
  const getChipColor = (clasificacion) => {
    const colors = {
      "Tratamiento Quírurgico": "primary",
      "Complicaciones Médicas": "warning",
      "Complicaciones Cirugía": "error",
    }
    return colors[clasificacion] || "default"
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
          Rasgos Clínicos Operatorios
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
        <EditarRasgosClinicosOperatoriosForm
          registroOperatorioId={registroOperatorioId}
          rasgosClinicos={rasgosClinicos}
          onCancel={handleCancel}
        />
      ) : !hasRasgos ? (
        <EmptyState message="No existen rasgos clínicos operatorios registrados" />
      ) : (
        <Box>
          {clasificaciones.map((clasificacion) => {
            const items = rasgosClinicos.filter((item) => item.codificador.clasificacion === clasificacion)

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
                            <Typography variant="body2" sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
                              {item.codificador.descripcion}
                            </Typography>
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
