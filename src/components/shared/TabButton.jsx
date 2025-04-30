"use client"

// Componente para botones de pestañas personalizados
export const TabButton = ({ isActive, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-gray-300 font-medium transition-all rounded-t-lg ${
        isActive
          ? "bg-white border-t-2 border-blue-600 text-blue-600 shadow-sm"
          : "hover:text-white border-b-2 border-transparent hover:border-gray-300"
      }`}
    >
      {children}
    </button>
  )
}

