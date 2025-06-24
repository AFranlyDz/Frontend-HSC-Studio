"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useTheme,
  alpha,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  Chip,
  Stack,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  FileDownload,
  Home,
  Assignment,
  Info,
  Logout,
  Email,
  Group,
} from "@mui/icons-material"
import caduceo from "@/assets/images/caduceo.png"
import { ExportButton } from "@/components/ui/ExportButton"
import { ExportKBButton } from "@/components/ui/ExportKBButton"
import { logout } from "@/features/auth/authSlice"

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null)
  const [userMenuAnchor, setUserMenuAnchor] = useState(null)
  const theme = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Redux state - Solo usuarios autenticados usan este header
  const { user } = useSelector((state) => state.auth)

  // Detectar si estamos en una página de historia clínica para mostrar el menú de exportación
  const isInHistoriaClinica = location.pathname.includes("/HistoriaClinica")

  // Detectar scroll para cambiar el estilo del header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleExportMenuOpen = (event) => {
    setExportMenuAnchor(event.currentTarget)
  }

  const handleExportMenuClose = () => {
    setExportMenuAnchor(null)
  }

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null)
  }

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleLogout = () => {
    dispatch(logout())
    handleUserMenuClose()
    navigate("/Visitor")
  }

  // Función para obtener las iniciales del usuario
  const getUserInitials = (username) => {
    if (!username) return "U"
    return username.charAt(0).toUpperCase()
  }

  return (
    <>
      <AppBar
        position="fixed"
        elevation={scrolled ? 4 : 0}
        sx={{
          backgroundColor: scrolled ? theme.palette.background.paper : "transparent",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          borderBottom: scrolled ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : "none",
          transition: "all 0.3s ease-in-out",
          py: scrolled ? 0.5 : 1,
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              textDecoration: "none",
              flexGrow: 0,
            }}
          >
            <Box
              component="img"
              src={caduceo || "/placeholder.svg"}
              alt="Logo"
              sx={{
                height: 40,
                width: "auto",
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.dark,
                fontSize: "1.25rem",
                transition: "color 0.3s ease-in-out",
              }}
            >
              HSC-Studio
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 3 }}>
            <Button
              component={Link}
              to="/"
              startIcon={<Home />}
              sx={{
                color: theme.palette.primary.dark,
                fontWeight: 500,
                textTransform: "none",
                "&:hover": {
                  color: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Inicio
            </Button>

            <Button
              component={Link}
              to="/Revision_casos"
              startIcon={<Assignment />}
              sx={{
                color: theme.palette.primary.dark,
                fontWeight: 500,
                textTransform: "none",
                "&:hover": {
                  color: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Revisión de Casos
            </Button>

            <Button
              component={Link}
              to="/acerca"
              startIcon={<Info />}
              sx={{
                color: theme.palette.primary.dark,
                fontWeight: 500,
                textTransform: "none",
                "&:hover": {
                  color: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Acerca de
            </Button>

            {/* Menú de Exportación - Solo visible en Historia Clínica */}
            {isInHistoriaClinica && (
              <>
                <Button
                  startIcon={<FileDownload />}
                  onClick={handleExportMenuOpen}
                  sx={{
                    color: theme.palette.primary.dark,
                    fontWeight: 500,
                    textTransform: "none",
                    "&:hover": {
                      color: theme.palette.primary.main,
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  Exportar Datos
                </Button>

                <Menu
                  anchorEl={exportMenuAnchor}
                  open={Boolean(exportMenuAnchor)}
                  onClose={handleExportMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 280,
                      borderRadius: 2,
                      boxShadow: theme.shadows[8],
                      "& .MuiMenuItem-root": {
                        px: 0,
                        py: 0.5,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <div className="px-1.5">
                    <MenuItem onClick={handleExportMenuClose}>
                      <ExportButton />
                    </MenuItem>
                    <MenuItem onClick={handleExportMenuClose}>
                      <ExportKBButton />
                    </MenuItem>
                  </div>
                </Menu>
              </>
            )}

            {/* User Menu - Siempre visible ya que este header es solo para usuarios autenticados */}
            <Button
              onClick={handleUserMenuOpen}
              startIcon={
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: theme.palette.primary.main,
                    fontSize: "0.875rem",
                  }}
                >
                  {getUserInitials(user?.username)}
                </Avatar>
              }
              sx={{
                color: theme.palette.primary.dark,
                fontWeight: 500,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              {user?.username || "Usuario"}
            </Button>

            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={handleUserMenuClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 320,
                  borderRadius: 2,
                  boxShadow: theme.shadows[8],
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              {/* Información del usuario */}
              <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: theme.palette.primary.main,
                      fontSize: "1.25rem",
                    }}
                  >
                    {getUserInitials(user?.username)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {user?.username || "Usuario"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID: {user?.user_id || "N/A"}
                    </Typography>
                  </Box>
                </Box>

                <Stack spacing={1}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Email sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary">
                      {user?.email || "Sin email"}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                    <Group sx={{ fontSize: 16, color: "text.secondary", mt: 0.25 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Grupos:
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {user?.groups && user.groups.length > 0 ? (
                          user.groups.map((group, index) => (
                            <Chip
                              key={index}
                              label={group}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: "0.75rem" }}
                            />
                          ))
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            Sin grupos asignados
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Stack>
              </Box>

              <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Cerrar Sesión" />
              </MenuItem>
            </Menu>
          </Box>

          {/* Mobile menu button */}
          <IconButton
            sx={{
              display: { xs: "flex", md: "none" },
              ml: 1,
              color: theme.palette.primary.dark,
            }}
            onClick={handleMobileMenuToggle}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        PaperProps={{
          sx: {
            width: 320,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ pt: 2 }}>
          {/* User Info in Mobile - Siempre visible */}
          <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: theme.palette.primary.main,
                }}
              >
                {getUserInitials(user?.username)}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={600}>
                  {user?.username || "Usuario"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email || "Sin email"}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {user?.groups && user.groups.length > 0 ? (
                user.groups.map((group, index) => (
                  <Chip key={index} label={group} size="small" variant="outlined" sx={{ fontSize: "0.7rem" }} />
                ))
              ) : (
                <Typography variant="caption" color="text.secondary">
                  Sin grupos asignados
                </Typography>
              )}
            </Box>
          </Box>

          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/" onClick={handleMobileMenuToggle}>
                <ListItemIcon sx={{ color: theme.palette.primary.dark }}>
                  <Home />
                </ListItemIcon>
                <ListItemText
                  primary="Inicio"
                  primaryTypographyProps={{
                    color: theme.palette.primary.dark,
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={Link} to="/Revision_casos" onClick={handleMobileMenuToggle}>
                <ListItemIcon sx={{ color: theme.palette.primary.dark }}>
                  <Assignment />
                </ListItemIcon>
                <ListItemText
                  primary="Revisión de Casos"
                  primaryTypographyProps={{
                    color: theme.palette.primary.dark,
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={Link} to="/acerca" onClick={handleMobileMenuToggle}>
                <ListItemIcon sx={{ color: theme.palette.primary.dark }}>
                  <Info />
                </ListItemIcon>
                <ListItemText
                  primary="Acerca de"
                  primaryTypographyProps={{
                    color: theme.palette.primary.dark,
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            </ListItem>

            {/* Opciones de exportación en móvil - Solo en Historia Clínica */}
            {isInHistoriaClinica && (
              <>
                <Divider sx={{ my: 1 }} />
                <ListItem>
                  <ListItemText
                    primary="Exportar Datos"
                    primaryTypographyProps={{
                      variant: "subtitle2",
                      color: "primary",
                      fontWeight: 600,
                    }}
                  />
                </ListItem>
                <ListItem sx={{ px: 2 }}>
                  <ExportButton />
                </ListItem>
                <ListItem sx={{ px: 2 }}>
                  <ExportKBButton />
                </ListItem>
              </>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Logout button for mobile */}
            <ListItem sx={{ px: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Logout />}
                onClick={() => {
                  handleLogout()
                  handleMobileMenuToggle()
                }}
                sx={{
                  color: theme.palette.error.main,
                  borderColor: theme.palette.error.main,
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.error.main, 0.08),
                    borderColor: theme.palette.error.main,
                  },
                }}
              >
                Cerrar Sesión
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  )
}

export default Header
