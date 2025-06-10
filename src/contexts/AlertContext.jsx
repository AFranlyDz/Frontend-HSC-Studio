"use client"

import { createContext, useContext, useState } from "react"
import { CustomAlert } from "@/components/ui/CustomAlert"

const AlertContext = createContext()

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    showCancel: false,
    onConfirm: null,
    onCancel: null,
    confirmText: "Aceptar",
    cancelText: "Cancelar",
  })

  const showAlert = ({
    title,
    message,
    type = "info",
    showCancel = false,
    onConfirm,
    onCancel,
    confirmText = "Aceptar",
    cancelText = "Cancelar",
  }) => {
    setAlert({
      isOpen: true,
      title,
      message,
      type,
      showCancel,
      onConfirm,
      onCancel,
      confirmText,
      cancelText,
    })
  }

  const hideAlert = () => {
    setAlert((prev) => ({ ...prev, isOpen: false }))
  }

  // Métodos de conveniencia
  const showSuccess = (message, title = "Éxito") => {
    showAlert({ title, message, type: "success" })
  }

  const showError = (message, title = "Error") => {
    showAlert({ title, message, type: "error" })
  }

  const showWarning = (message, title = "Advertencia") => {
    showAlert({ title, message, type: "warning" })
  }

  const showInfo = (message, title = "Información") => {
    showAlert({ title, message, type: "info" })
  }

  const showConfirm = (message, onConfirm, title = "Confirmar") => {
    showAlert({
      title,
      message,
      type: "warning",
      showCancel: true,
      onConfirm,
      confirmText: "Confirmar",
      cancelText: "Cancelar",
    })
  }

  return (
    <AlertContext.Provider
      value={{
        showAlert,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showConfirm,
        hideAlert,
      }}
    >
      {children}
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={hideAlert}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        showCancel={alert.showCancel}
        onConfirm={alert.onConfirm}
        onCancel={alert.onCancel}
        confirmText={alert.confirmText}
        cancelText={alert.cancelText}
      />
    </AlertContext.Provider>
  )
}

export const useAlert = () => {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error("useAlert debe ser usado dentro de un AlertProvider")
  }
  return context
}
