"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Card,
  CardContent,
  useTheme,
  alpha,
} from "@mui/material"
import { Visibility, VisibilityOff, Person, Lock, Login as LoginIcon, ArrowBack } from "@mui/icons-material"
import axios from "axios"
import { loginStart, loginSuccess, loginFailure, clearError } from "@/features/auth/authSlice"
import caduceo from "@/assets/images/caduceo.png"

export default function IniciarSesion() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useTheme()
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth)
  const apiUrl = import.meta.env.VITE_API_BACKEND

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/")
    }
  }, [isAuthenticated, navigate])

  // Limpiar errores al montar el componente
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es requerido"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 4) {
      newErrors.password = "La contraseña debe tener al menos 4 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    dispatch(loginStart())

    try {
      // Llamada al endpoint de login de Django REST Framework
      const response = await axios.post(`${apiUrl}token-auth/`, {
        username: formData.username,
        password: formData.password,
      })

      const { token, user } = response.data

      // Configurar el token para futuras peticiones
      axios.defaults.headers.common["Authorization"] = `Token ${token}`

      dispatch(loginSuccess({ token, user }))

      // Navegar a la página principal
      navigate("/")
    } catch (error) {
      let errorMessage = "Error al iniciar sesión"

      if (error.response?.data) {
        if (error.response.data.non_field_errors) {
          errorMessage = error.response.data.non_field_errors[0]
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message
        }
      } else if (error.message) {
        errorMessage = error.message
      }

      dispatch(loginFailure(errorMessage))
    }
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(
          theme.palette.primary.light,
          0.05,
        )} 100%)`,
        display: "flex",
        alignItems: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={8}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {/* Header */}
            <Box
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: "white",
                p: 4,
                textAlign: "center",
                position: "relative",
              }}
            >
              <Button
                component={Link}
                to="/Visitor"
                startIcon={<ArrowBack />}
                sx={{
                  position: "absolute",
                  left: 16,
                  top: 16,
                  color: "white",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  },
                }}
              >
                Volver
              </Button>

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                <Box
                  component="img"
                  src={caduceo}
                  alt="Logo"
                  sx={{
                    height: 48,
                    width: "auto",
                    mr: 2,
                  }}
                />
                <Typography variant="h4" fontWeight="bold">
                  HSC-Studio
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Sistema de Hematomas Subdurales
              </Typography>
            </Box>

            {/* Form */}
            <Box sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight="600" textAlign="center" mb={1}>
                Iniciar Sesión
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center" mb={4}>
                Ingresa tus credenciales para acceder al sistema
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  fullWidth
                  name="username"
                  label="Nombre de usuario"
                  value={formData.username}
                  onChange={handleChange}
                  error={!!errors.username}
                  helperText={errors.username}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color={errors.username ? "error" : "action"} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color={errors.password ? "error" : "action"} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePasswordVisibility} edge="end" disabled={loading}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 4 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={<LoginIcon />}
                  sx={{
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: "none",
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    "&:hover": {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                      transform: "translateY(-1px)",
                      boxShadow: theme.shadows[8],
                    },
                    "&:disabled": {
                      background: theme.palette.action.disabledBackground,
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  ¿Problemas para acceder?{" "}
                  <Link
                    to="/contacto"
                    style={{
                      color: theme.palette.primary.main,
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    Contacta al administrador
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Footer */}
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 3, opacity: 0.8 }}>
          © 2024 HSC-Studio. Sistema de Hematomas Subdurales.
        </Typography>
      </Container>
    </Box>
  )
}
