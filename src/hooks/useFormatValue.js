// Hook personalizado para formatear valores
export const useFormatValue = () => {
  const formatValue = (key, value) => {
    if (key === "sexo") {
      return value === true ? "Masculino" : "Femenino"
    } else if (key === "manualidad") {
      return value === true ? "Derecha" : "Izquierda"
    } else if (typeof value === "boolean") {
      return value ? "Sí" : "No"
    } else {
      return value !== undefined ? String(value) : "N/A"
    }
  }

  return { formatValue }
}
