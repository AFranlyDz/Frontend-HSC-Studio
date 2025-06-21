"use client"
import { useSelector } from "react-redux"
import { PDFDownloadLink } from "@react-pdf/renderer"
import PlanillaRecoleccion from "@/features/exportaciones/PlanillaRecoleccion"
import { Button, CircularProgress, useTheme, alpha } from "@mui/material"
import { Description } from "@mui/icons-material"

const PDFDownloadButton = () => {
  const paciente = useSelector((state) => state.historiaClinica.datos)
  const theme = useTheme()

  if (!paciente) return null

  return (
    <PDFDownloadLink
      document={<PlanillaRecoleccion paciente={paciente} />}
      fileName={`Planilla_Recoleccion_${paciente.seudonimo || paciente.numero}.pdf`}
    >
      {({ loading }) => (
        <Button
          variant="contained"
          color="primary"
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Description />}
          disabled={loading}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 0, // Sin bordes redondeados
            px: 3,
            py: 1.5,
            minHeight: 40,
            boxShadow: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            "&:hover": {
              boxShadow: 4,
              transform: "translateY(-1px)",
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${alpha(theme.palette.primary.dark, 0.9)} 100%)`,
            },
            "&:disabled": {
              background: theme.palette.action.disabledBackground,
              color: theme.palette.action.disabled,
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {loading ? "Generando..." : "Planilla PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  )
}

export default PDFDownloadButton
