"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

export const CustomAlert = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  showCancel = false,
  onConfirm,
  onCancel,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 200)
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    handleClose()
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    handleClose()
  }

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-600" />
      case "error":
        return <AlertCircle className="w-6 h-6 text-red-600" />
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />
      default:
        return <Info className="w-6 h-6 text-blue-600" />
    }
  }

  const getColors = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          button: "!bg-green-600 !hover:bg-green-700",
        }
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          button: "!bg-red-600 !hover:bg-red-700",
        }
      case "warning":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          button: "!bg-yellow-600 !hover:bg-yellow-700",
        }
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          button: "!bg-blue-600 !hover:bg-blue-700",
        }
    }
  }

  if (!isOpen) return null

  const colors = getColors()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-200 ${isVisible ? "opacity-50" : "opacity-0"}`}
        onClick={handleClose}
      />

      {/* Alert Modal */}
      <div
        className={`relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all duration-200 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className={`${colors.bg} ${colors.border} border-b px-6 py-4 rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getIcon()}
              {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            </div>
            <button onClick={handleClose} className={`${colors.button} !text-gray-300 hover:!text-white transition-colors`}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <div className="text-gray-700 whitespace-pre-line">{message}</div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
          {showCancel && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-white rounded-md transition-colors ${colors.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
