"use client"
import { Box, Paper, Typography, useTheme, alpha, Divider } from "@mui/material"
import { Assessment } from "@mui/icons-material"
import { Children } from "react"

export const ActionRibbon = ({ children, title = "Herramientas", className = "" }) => {
  const theme = useTheme()

  // Función para agregar separadores entre los botones
  const childrenWithSeparators = Children.toArray(children).reduce((acc, child, index) => {
    acc.push(child)

    // Agregar separador después de cada botón excepto el último
    if (index < Children.count(children) - 1) {
      acc.push(
        <Divider
          key={`separator-${index}`}
          orientation="vertical"
          sx={{
            height: 40,
            mx: 0.5,
            borderColor: alpha(theme.palette.primary.main, 0.15),
            borderWidth: 1,
          }}
        />,
      )
    }

    return acc
  }, [])

  return (
    <Paper
      elevation={1}
      sx={{
        mb: 2,
        borderRadius: 0, // Sin bordes redondeados
        overflow: "hidden",
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
        borderLeft: 0,
        borderRight: 0,
      }}
      className={className}
    >
      {/* Header compacto de la franja */}
      <Box
        sx={{
          px: 3,
          py: 0.75, // Más compacto
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Assessment
            sx={{
              color: theme.palette.primary.main,
              fontSize: 16, // Más pequeño
            }}
          />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: theme.palette.primary.main,
              fontSize: "0.75rem",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>

      {/* Contenedor de botones con separadores */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "flex-start",
        }}
      >
        {childrenWithSeparators}
      </Box>
    </Paper>
  )
}

export default ActionRibbon
