"use client"

import { useState } from "react"
import { Button, CircularProgress, useTheme, alpha } from "@mui/material"
import { Storage } from "@mui/icons-material"
import axios from "axios"
import { useSnackbar } from "notistack"

export const ExportKBButton = () => {
  const [isLoading, setIsLoading] = useState(false)
  const apiUrl = import.meta.env.VITE_API_BACKEND
  const theme = useTheme()
  const { enqueueSnackbar } = useSnackbar()

  const handleExportClick = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post(
        `${apiUrl}export-kb-csv/`,
        {
          fields: [
            "historia_clinica.id",
            "historia_clinica.numero",
            "historia_clinica.nombre",
            "historia_clinica.apellidos",
            "historia_clinica.edad",
            "historia_clinica.sexo",
            "historia_clinica.historial_trauma_craneal",
            "codificador.nombre",
            "hematoma.escala_glasgow_ingreso",
            "hematoma.escala_mcwalder",
            "hematoma.escala_gordon_firing",
            "hematoma.escala_nomura",
            "hematoma.escala_nakagushi",
            "hematoma.volumen_tada",
            "hematoma.diametro_capa",
            "hematoma.desviacion_linea_media",
            "hematoma.diametro_mayor_transverso",
            "hematoma.presencia_membrana",
            "registro_operatorio.escala_evaluacion_resultados_glasgow",
            "registro_operatorio.es_reintervencion",
            "registro_operatorio.estado_egreso",
            "hematoma.localización",
          ],
        },
        { responseType: "blob" },
      )

      // Crear el enlace de descarga
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "base_conocimiento.csv")
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      enqueueSnackbar("Base de conocimiento exportada exitosamente", { variant: "success" })
    } catch (error) {
      console.error("Error al exportar CSV:", error)
      enqueueSnackbar("Error al exportar el archivo CSV", { variant: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <Storage />}
      onClick={handleExportClick}
      disabled={isLoading}
      fullWidth
      sx={{
        textTransform: "none",
        fontWeight: 600,
        borderRadius: 2,
        px: 3,
        py: 1.5,
        minHeight: 44,
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
      {isLoading ? "Exportando..." : "Base de Conocimiento"}
    </Button>
  )
}
