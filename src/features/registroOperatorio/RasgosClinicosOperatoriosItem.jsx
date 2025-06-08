"use client"

export const RasgosClinicosOperatoriosItem = ({ item }) => {
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
      <div className="mb-2">
        <p className="text-gray-800 font-medium">{item.codificador.nombre}</p>
        <p className="text-sm text-gray-500">{item.codificador.descripcion}</p>
      </div>
    </div>
  )
}