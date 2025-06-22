"use client"

import { Box, Typography } from "@mui/material"

export const InfoFieldCompact = ({ label, value, gridColumn = 1 }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 1.5,
        px: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
        gridColumn: `span ${gridColumn}`,
        "&:last-child": {
          borderBottom: "none",
        },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          color: "text.secondary",
          minWidth: "40%",
          textTransform: "uppercase",
          fontSize: "0.75rem",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 500,
          color: "text.primary",
          textAlign: "right",
          flex: 1,
          ml: 2,
        }}
      >
        {value || "N/A"}
      </Typography>
    </Box>
  )
}
