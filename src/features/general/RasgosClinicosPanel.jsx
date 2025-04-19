"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { EmptyState } from "@/components/shared/EmptyState"
import { RasgosClinicosSection } from "@/components/shared/RasgosClinicosSection"
import { EditarRasgosClinicosForm } from "@/components/shared/EditarRasgosClinicosForm"

export const RasgosClinicosPanel = () => {
  const { datos } = useSelector((state) => state.historiaClinica)
  const [editing, setEditing] = useState(false)

  // Clasificaciones de rasgos clínicos
  const clasificaciones = [
    "Factor Predisponente",
    "Antecedente Neurológico",
    "Antecedente Patológico",
    "Lesión Isquémica",
    "Factor de Riesgo",
  ]

  const hasRasgos = datos.rcg && datos.rcg.length > 0

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          Rasgos Clínicos Globales
        </h2>
        <button
          onClick={() => setEditing(!editing)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center"
        >
          <span className="mr-1">{editing ? "Cancelar" : "Editar"}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {editing ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            )}
          </svg>
        </button>
      </div>

      {editing ? (
        <EditarRasgosClinicosForm onCancel={() => setEditing(false)} />
      ) : !hasRasgos ? (
        <EmptyState message="No existen rasgos clínicos globales registrados" />
      ) : (
        <div className="space-y-8 w-full">
          {clasificaciones.map((clasificacion) => {
            const items = datos.rcg.filter((item) => item.codificador.clasificacion === clasificacion)
            return <RasgosClinicosSection key={clasificacion} title={clasificacion} items={items} />
          })}
        </div>
      )}
    </div>
  )
}
