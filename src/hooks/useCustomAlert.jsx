import { useAlert } from "@/contexts/AlertContext"

export const useCustomAlert = () => {
  const alert = useAlert()

  // Reemplaza el alert nativo de JavaScript
  const customAlert = (message, title = "Información") => {
    alert.showInfo(message, title)
  }

  // Reemplaza el confirm nativo de JavaScript
  const customConfirm = (message, title = "Confirmar") => {
    return new Promise((resolve) => {
      alert.showConfirm(message, () => resolve(true), title)
    })
  }

  return {
    alert: customAlert,
    confirm: customConfirm,
    success: alert.showSuccess,
    error: alert.showError,
    warning: alert.showWarning,
    info: alert.showInfo,
  }
}
