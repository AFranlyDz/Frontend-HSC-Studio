"use client"

import { useState, useCallback } from "react"
import { Button, useTheme, alpha, Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material"
import { TableChart, Close } from "@mui/icons-material"
import ExportFieldsSelector from "@/features/exportaciones/ExportFieldsSelector"
import { useSnackbar } from "notistack"
import { useSelector } from "react-redux"

export const ExportButton = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { datos } = useSelector((state) => state.historiaClinica)
  const theme = useTheme()

  const handleExportClick = useCallback(
    (event) => {
      event.stopPropagation()
      event.preventDefault()

      if (!datos) {
        enqueueSnackbar("No hay datos disponibles para exportar", { variant: "warning" })
        return
      }

      console.log("Abriendo modal de exportación") // Para debug
      setIsModalOpen(true)
    },
    [datos, enqueueSnackbar],
  )

  const handleCloseModal = useCallback(() => {
    console.log("Cerrando modal de exportación") // Para debug
    setIsModalOpen(false)
  }, [])

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

      <Dialog
        open={isModalOpen}
        onClose={(event, reason) => {
          // Prevenir cierre accidental
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            console.log("Intento de cierre prevenido:", reason)
            return
          }
          handleCloseModal()
        }}
        maxWidth="md"
        fullWidth
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            borderRadius: 3,
            minHeight: 600,
          },
          onClick: (e) => e.stopPropagation(),
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          Seleccionar columnas para exportar
          <IconButton
            onClick={handleCloseModal}
            size="small"
            sx={{
              color: theme.palette.grey[500],
              "&:hover": {
                bgcolor: alpha(theme.palette.grey[500], 0.1),
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <ExportFieldsSelector onClose={handleCloseModal} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ExportButton
