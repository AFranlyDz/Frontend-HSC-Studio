"use client"

import { useState, useEffect } from "react"
import Footer from "./Footer"

export const FooterWithScroll = () => {
  const [showFooter, setShowFooter] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Calcular la altura del documento y la posición actual del scroll
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop

      // Mostrar el footer cuando el usuario haya desplazado más del 80% de la página
      // o esté cerca del final del documento
      const scrollThreshold = documentHeight - windowHeight - 200

      if (scrollTop > scrollThreshold) {
        setShowFooter(true)
      } else {
        setShowFooter(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ${
        showFooter ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <Footer />
    </div>
  )
}
