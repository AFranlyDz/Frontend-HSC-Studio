"use client"

import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { Navigate } from "react-router-dom"
import { Box, CircularProgress, Typography } from "@mui/material"
import { loadUserFromStorage } from "@/features/auth/authSlice"
import Home from "@/pages/Home"

export function HomeRoute() {
  const dispatch = useDispatch()
  const { isAuthenticated, loading } = useSelector((state) => state.auth)

  useEffect(() => {
    // Intentar cargar usuario desde localStorage al montar
    dispatch(loadUserFromStorage())
  }, [dispatch])

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: 2,
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="body1" color="text.secondary">
          Verificando autenticación...
        </Typography>
      </Box>
    )
  }

  // Si no está autenticado, redirigir a Visitor (primera visita al dominio)
  if (!isAuthenticated) {
    return <Navigate to="/Visitor" replace />
  }

  // Si está autenticado, mostrar la página Home
  return <Home />
}
