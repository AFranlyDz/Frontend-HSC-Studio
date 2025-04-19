"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import caduceo from "@/assets/images/caduceo.png"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Detectar scroll para cambiar el estilo del header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header>
      <nav
        className={`w-full fixed top-0 z-50 transition-all duration-300 ${
          scrolled ? "py-3 bg-white shadow-md" : "py-5 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img src={caduceo || "/placeholder.svg"} alt="Logo" className="h-10 w-auto" />
              <span className={`font-bold text-xl ${scrolled ? "text-blue-700" : "text-gray-800"}`}>HSC-Studio</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`font-medium ${
                  scrolled ? "text-gray-700 hover:text-blue-700" : "text-gray-800 hover:text-gray-900"
                }`}
              >
                Inicio
              </Link>
              <Link
                to="/Revision_casos"
                className={`font-medium ${
                  scrolled ? "text-gray-700 hover:text-blue-700" : "text-gray-800 hover:text-gray-900"
                }`}
              >
                Revisión de Casos
              </Link>
              <Link
                to="/acerca"
                className={`font-medium ${
                  scrolled ? "text-gray-700 hover:text-blue-700" : "text-gray-800 hover:text-gray-900"
                }`}
              >
                Acerca de
              </Link>
              <Button
                size="sm"
                className={scrolled ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700"}
              >
                Iniciar Sesión
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t mt-2 py-4 px-4 shadow-lg">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-blue-700 py-2" onClick={() => setMobileMenuOpen(false)}>
                Inicio
              </Link>
              <Link
                to="/Revision_casos"
                className="text-gray-700 hover:text-blue-700 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Revisión de Casos
              </Link>
              <Link
                to="/acerca"
                className="text-gray-700 hover:text-blue-700 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Acerca de
              </Link>
              <Button className="w-full bg-blue-700 hover:bg-blue-800">Iniciar Sesión</Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
