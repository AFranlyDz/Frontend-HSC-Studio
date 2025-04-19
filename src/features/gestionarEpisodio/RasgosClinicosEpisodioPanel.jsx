"use client"

import { useState } from "react"
import { EmptyState } from "@/components/shared/EmptyState"
import { RasgosClinicosEpisodioSection } from "./RasgosClinicosEpisodioSection"
import { EditarRasgosClinicosEpisodioForm } from "./EditarRasgosClinicosEpisodioForm"

export const RasgosClinicosEpisodioPanel = ({ episodio }) => {
  const [editing, setEditing] = useState(false)

  // Clasificaciones de rasgos clínicos
  const clasificaciones = [
    "Síntoma",
    "Forma Clínica de Presentación"
  ]

  const hasRasgos = episodio.rce && episodio.rce.length > 0

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          Rasgos Clínicos del Episodio
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
        <EditarRasgosClinicosEpisodioForm episodio={episodio} onCancel={() => setEditing(false)} />
      ) : !hasRasgos ? (
        <EmptyState message="No existen rasgos clínicos registrados para este episodio" />
      ) : (
        <div className="space-y-8 w-full">
          {clasificaciones.map((clasificacion) => {
            const items = episodio.rce.filter((item) => item.codificador.clasificacion === clasificacion)
            return <RasgosClinicosEpisodioSection key={clasificacion} title={clasificacion} items={items} />
          })}
        </div>
      )}
    </div>
  )
}
