"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { cn } from "@/libs/utils"

export function Modal({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  size = "md",
  closeOnBackdropClick = true,
  closeOnEscape = true
}) {
  const modalRef = useRef(null)
  const contentRef = useRef(null)

  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && closeOnEscape) onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
      // Enfocar el modal al abrir
      modalRef.current?.focus()
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose, closeOnEscape])

  // Cerrar al hacer clic fuera del modal
  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && modalRef.current && !modalRef.current.contains(e.target)) {
      onClose()
    }
  }

  // Manejar el scroll del contenido
  const handleContentScroll = (e) => {
    // Prevenir que el scroll se propague al fondo
    e.stopPropagation()
  }

  if (!isOpen) return null

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[95vw]",
  }

  const heightClasses = {
    sm: "max-h-[70vh]",
    md: "max-h-[80vh]",
    lg: "max-h-[90vh]",
    full: "max-h-[95vh]",
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className={cn(
          "bg-white rounded-lg shadow-xl w-full flex flex-col",
          sizeClasses[size],
          heightClasses[size === 'full' ? 'full' : 'lg'] // Ajustar altura según tamaño
        )}
        tabIndex={-1} // Para hacerlo focusable
      >
        {/* Header del modal */}
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl text-gray-800 font-semibold">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido con scroll */}
        <div 
          ref={contentRef}
          className="overflow-y-auto flex-1 p-4"
          onScroll={handleContentScroll}
        >
          {children}
        </div>

        {/* Footer opcional para acciones */}
        <div className="border-t p-4 bg-gray-50 sticky bottom-0">
          <div className="flex justify-end space-x-2">
          </div>
        </div>
      </div>
    </div>
  )
}