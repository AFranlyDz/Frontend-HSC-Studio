"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
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
import { Menu as MenuIcon, Close as CloseIcon, Home, Info, Login } from "@mui/icons-material"
import caduceo from "@/assets/images/caduceo.png"

function VisitorHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const theme = useTheme()

  // Detectar scroll para cambiar el estilo del header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
            to="/Visitor"
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
              to="/Visitor"
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

            <Button
              component={Link}
              to="/Iniciar_Sesión"
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
            width: 280,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ pt: 2 }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/Visitor" onClick={handleMobileMenuToggle}>
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

            <Divider sx={{ my: 2 }} />

            <ListItem sx={{ px: 2 }}>
              <Button
                component={Link}
                to="/Iniciar_Sesión"
                variant="contained"
                fullWidth
                startIcon={<Login />}
                onClick={handleMobileMenuToggle}
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

export default VisitorHeader
