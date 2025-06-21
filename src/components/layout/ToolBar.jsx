"use client"
import { Toolbar, Box} from "@mui/material"

export const ProfessionalToolbar = ({
  children,
}) => {

  return (
      <Toolbar
        sx={{
          minHeight: { xs: 64, sm: 72 },
          px: { xs: 2, sm: 3 },
        }}
      >

        {/* Sección derecha - Botones de acción */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          {children}
        </Box>
      </Toolbar>
  )
}

export default ProfessionalToolbar
