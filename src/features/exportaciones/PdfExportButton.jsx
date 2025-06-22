"use client"

import { useState, useCallback, useMemo } from "react"
import { Button, useTheme, CircularProgress, Box, Typography } from "@mui/material"
import { Description } from "@mui/icons-material"
import { pdf } from "@react-pdf/renderer"
import PlanillaRecoleccion from "@/features/exportaciones/PlanillaRecoleccion"

export const PdfExportButton = ({ paciente }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const theme = useTheme()

  // Crear una versión estable de los datos del paciente para evitar errores
  const stablePacienteData = useMemo(() => {
    if (!paciente || !paciente.id) return null

    try {
      // Crear una copia profunda y limpia de los datos
      return JSON.parse(JSON.stringify(paciente))
    } catch (err) {
      console.error("Error al procesar datos del paciente:", err)
      return null
    }
  }, [paciente])

  const handleDownloadPDF = useCallback(async () => {
    if (!stablePacienteData) {
      setError("No hay datos válidos del paciente")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      // Generar el PDF solo cuando se hace clic
      const doc = <PlanillaRecoleccion paciente={stablePacienteData} />
      const asPdf = pdf(doc)
      const blob = await asPdf.toBlob()

      // Crear URL para descarga
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `Planilla_Recoleccion_${stablePacienteData.seudonimo || stablePacienteData.numero}.pdf`

      // Simular clic para descargar
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Limpiar URL
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Error al generar PDF:", err)
      setError("Error al generar el PDF. Verifique los datos del paciente.")
    } finally {
      setIsGenerating(false)
    }
  }, [stablePacienteData])

  if (!stablePacienteData) {
    return (
      <Button
        variant="contained"
        size="small"
        fullWidth
        disabled
        sx={{
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 1.5,
          py: 1,
          fontSize: "0.8rem",
          background: theme.palette.action.disabledBackground,
          color: theme.palette.action.disabled,
        }}
      >
        Sin datos de paciente
      </Button>
    )
  }

  return (
    <Box>
      <Button
        variant="contained"
        size="small"
        fullWidth
        startIcon={isGenerating ? <CircularProgress size={16} color="inherit" /> : <Description />}
        disabled={isGenerating}
        onClick={handleDownloadPDF}
        sx={{
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 1.5,
          py: 1,
          fontSize: "0.8rem",
          background: isGenerating
            ? theme.palette.action.disabledBackground
            : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: isGenerating ? theme.palette.action.disabled : theme.palette.common.white,
          "&:hover": !isGenerating
            ? {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, #1565c0 100%)`,
                transform: "translateY(-1px)",
                boxShadow: 3,
              }
            : {},
          "&:disabled": {
            background: theme.palette.action.disabledBackground,
            color: theme.palette.action.disabled,
          },
          transition: "all 0.2s ease-in-out",
        }}
      >
        {isGenerating ? "Generando PDF..." : "Descargar Planilla PDF"}
      </Button>

      {error && (
        <Typography color="error" variant="caption" sx={{ mt: 1, display: "block", fontSize: "0.7rem" }}>
          {error}
        </Typography>
      )}
    </Box>
  )
}
