"use client"

import { useState, useCallback } from "react"
import { Button, useTheme, alpha } from "@mui/material"
import { TableChart } from "@mui/icons-material"
import { Modal } from "@/components/ui/modal"
import ExportFieldsSelector from "@/features/exportaciones/ExportFieldsSelector"
import { useSnackbar } from "notistack"
import { useSelector } from "react-redux"

export const ExportButton = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { datos } = useSelector((state) => state.historiaClinica)
  const theme = useTheme()

  const handleExportClick = useCallback(() => {
    if (!datos) {
      enqueueSnackbar("No hay datos disponibles para exportar", { variant: "warning" })
      return
    }
    setIsModalOpen(true)
  }, [datos, enqueueSnackbar])

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<TableChart />}
        onClick={handleExportClick}
        disabled={!datos}
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
        Exportar CSV
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Seleccionar columnas para exportar"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Selecciona los campos que deseas incluir en el archivo CSV.</p>

          <ExportFieldsSelector data={datos} onClose={() => setIsModalOpen(false)} />
        </div>
      </Modal>
    </>
  )
}
