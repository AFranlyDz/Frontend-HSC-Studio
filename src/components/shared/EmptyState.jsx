// Componente para estados vacíos
export const EmptyState = ({ message }) => {
  return (
    <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  )
}

