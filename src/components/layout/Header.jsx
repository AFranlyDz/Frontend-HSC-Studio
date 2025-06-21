"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
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
} from "@mui/material"
import { Menu as MenuIcon, Close as CloseIcon, FileDownload, Home, Assignment, Info, Login } from "@mui/icons-material"
import caduceo from "@/assets/images/caduceo.png"
import { ExportButton } from "@/components/ui/ExportButton"
import { ExportKBButton } from "@/components/ui/ExportKBButton"

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null)
  const theme = useTheme()
  const location = useLocation()

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

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen)
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
                color: theme.palette.primary.dark, // Cambiado a azul oscuro
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
                color: theme.palette.primary.dark, // Cambiado a azul oscuro
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
                color: theme.palette.primary.dark, // Cambiado a azul oscuro
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
                color: theme.palette.primary.dark, // Cambiado a azul oscuro
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
                    color: theme.palette.primary.dark, // Cambiado a azul oscuro
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

            <Button
              variant="contained"
              startIcon={<Login />}
              sx={{
                backgroundColor: scrolled ? theme.palette.primary.main : theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                px: 3,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                  transform: "translateY(-1px)",
                  boxShadow: theme.shadows[4],
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Iniciar Sesión
            </Button>
          </Box>

          {/* Mobile menu button */}
          <IconButton
            sx={{
              display: { xs: "flex", md: "none" },
              ml: 1,
              color: theme.palette.primary.dark, // Cambiado a azul oscuro
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
            width: 280,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ pt: 2 }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/" onClick={handleMobileMenuToggle}>
                <ListItemIcon sx={{ color: theme.palette.primary.dark }}>
                  <Home />
                </ListItemIcon>
                <ListItemText
                  primary="Inicio"
                  primaryTypographyProps={{
                    color: theme.palette.primary.dark, // Cambiado a azul oscuro
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
                    color: theme.palette.primary.dark, // Cambiado a azul oscuro
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
                    color: theme.palette.primary.dark, // Cambiado a azul oscuro
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

            <ListItem sx={{ px: 2 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Login />}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                Iniciar Sesión
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  )
}

export default Header
