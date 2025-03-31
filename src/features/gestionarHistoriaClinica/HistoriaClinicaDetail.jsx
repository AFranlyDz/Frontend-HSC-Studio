export function HistoriaClinicaDetail({ data }) {
    // Función para formatear los valores según su tipo
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
  
    // Definir los campos y sus etiquetas para mostrar
    const fields = [
      { key: "nombre", label: "Nombre" },
      { key: "apellidos", label: "Apellidos" },
      { key: "edad", label: "Edad" },
      { key: "sexo", label: "Sexo" },
      { key: "numero", label: "Número" },
      { key: "seudonimo", label: "Seudónimo" },
      { key: "manualidad", label: "Manualidad" },
      { key: "antecedentes_familiares", label: "Antecedentes Familiares" },
      { key: "historial_trauma_craneal", label: "Historial de Trauma Craneal" },
    ]
  
    return (
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.key} className="p-3 border-b">
              <div className="text-sm font-medium text-gray-500">{field.label}</div>
              <div className="mt-1 text-sm text-gray-900">{formatValue(field.key, data[field.key])}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  