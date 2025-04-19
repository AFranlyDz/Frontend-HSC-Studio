// Componente para mostrar un ítem de rasgos clínicos de episodio
export const RasgosClinicosEpisodioItem = ({ item }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
      <div className="mb-2">
        <p className="text-gray-800 font-medium">{item.codificador.nombre}</p>
        <p className="text-sm text-gray-500">{item.codificador.descripcion}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Tiempo (días)</h4>
          <p className="mt-1 text-gray-700">{item.tiempo || "N/A"}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Notas</h4>
          <p className="mt-1 text-gray-700">{item.notas || "N/A"}</p>
        </div>
      </div>
    </div>
  )
}
