"use client"

import { useState, useEffect } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

/**
 * ConfirmDialog component for confirming destructive actions
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "¿Está seguro?",
  message = "¿Está seguro de que desea realizar esta acción?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmButtonColor = "red",
  isLoading = false,
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  const colorMap = {
    red: "bg-red-600 hover:bg-red-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    yellow: "bg-yellow-600 hover:bg-yellow-700",
  }

  const colorClass = colorMap[confirmButtonColor] || colorMap.red

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex items-start mb-4">
        <div className="flex-shrink-0 mr-3 text-yellow-400">
          <AlertTriangle size={24} aria-hidden="true" />
        </div>
        <div>
          <p className="text-gray-700">{message}</p>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button type="button" className={`${colorClass} text-white`} onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "Procesando..." : confirmText}
        </Button>
      </div>
    </Modal>
  )
}
