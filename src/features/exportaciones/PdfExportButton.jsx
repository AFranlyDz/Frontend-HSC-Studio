"use client"

import { useState } from "react"
import { Button, useTheme, CircularProgress, Box, Typography } from "@mui/material"
import { Description } from "@mui/icons-material"
import { PDFDownloadLink } from "@react-pdf/renderer"
import PlanillaRecoleccion from "@/features/exportaciones/PlanillaRecoleccion"

export const PdfExportButton = ({ paciente }) => {
  const [error, setError] = useState(null)
  const theme = useTheme()

  if (!paciente || !paciente.id) {
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
      <PDFDownloadLink
        document={<PlanillaRecoleccion paciente={paciente} />}
        fileName={`Planilla_Recoleccion_${paciente.seudonimo || paciente.numero}.pdf`}
        style={{ textDecoration: "none", width: "100%" }}
      >
        {({ loading, error: pdfError }) => {
          // Manejar errores
          if (pdfError && !error) {
            setError("Error al generar el PDF")
            console.error("PDF generation error:", pdfError)
          }

          return (
            <Button
              variant="contained"
              size="small"
              fullWidth
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Description />}
              disabled={loading}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                borderRadius: 1.5,
                py: 1,
                fontSize: "0.8rem",
                background: loading
                  ? theme.palette.action.disabledBackground
                  : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: loading ? theme.palette.action.disabled : theme.palette.common.white,
                "&:hover": !loading
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
              {loading ? "Generando PDF..." : "Descargar Planilla PDF"}
            </Button>
          )
        }}
      </PDFDownloadLink>

      {error && (
        <Typography color="error" variant="caption" sx={{ mt: 1, display: "block", fontSize: "0.7rem" }}>
          {error || "Error al generar el PDF"}
        </Typography>
      )}
    </Box>
  )
}
