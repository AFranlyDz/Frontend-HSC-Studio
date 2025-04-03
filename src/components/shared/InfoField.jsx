// Componente reutilizable para mostrar un campo de información
export const InfoField = ({ label, value }) => {
  return (
    <div className="mb-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{label}</h3>
      <p className="mt-1 text-lg text-gray-800">{value}</p>
    </div>
  )
}

