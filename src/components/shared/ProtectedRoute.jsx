"use client"

import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { Box, CircularProgress, Typography } from "@mui/material"
import { loadUserFromStorage } from "@/features/auth/authSlice"

export function ProtectedRoute({ children }) {
  const dispatch = useDispatch()
  const location = useLocation()
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

  // Redirigir al login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/Iniciar_Sesión" state={{ from: location }} replace />
  }

  return children
}
