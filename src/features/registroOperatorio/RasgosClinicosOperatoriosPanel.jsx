"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { EmptyState } from "@/components/shared/EmptyState"
import axios from "axios"
import { useSelector, useDispatch } from "react-redux"
import { setHistoriaClinica } from "@/features/gestionarHistoriaClinica/historiaClinicaSlice"
import DataTable from "@/components/layout/DatatableBase"

export const RasgosClinicosOperatoriosPanel = ({ registroOperatorioId, rasgosClinicos }) => {
  const { datos: paciente } = useSelector((state) => state.historiaClinica)
  const dispatch = useDispatch()
  const apiUrl = import.meta.env.VITE_API_BACKEND

  // Eliminar un rasgo clínico operatorio
  const handleBorrar = async (id) => {
    if (confirm("¿Estás seguro de eliminar este rasgo clínico operatorio?")) {
      try {
        await axios.delete(`${apiUrl}rasgos_clinicos_operatorios/${id}/`)

        // Actualizar el estado local
        const pacienteActualizado = {
          ...paciente,
          episodios: paciente.episodios.map(ep => ({
            ...ep,
            registro_operatorio: ep.registro_operatorio?.map(ro => 
              ro.id === registroOperatorioId
                ? {
                    ...ro,
                    rasgos_clinicos_operatorios: ro.rasgos_clinicos_operatorios?.filter(rco => rco.id !== id) || []
                  }
                : ro
            ) || []
          }))
        }

        dispatch(setHistoriaClinica(pacienteActualizado))
        alert("Rasgo clínico operatorio eliminado correctamente")
      } catch (error) {
        console.error("Error al eliminar:", error)
        alert("Error al eliminar el rasgo clínico operatorio")
      }
    }
  }

  // Columnas para la tabla
  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.codificador.nombre,
      sortable: true,
      grow: 2,
    },
    {
      name: "Clasificación",
      selector: (row) => row.codificador.clasificacion,
      sortable: true,
      grow: 2,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <button
          onClick={() => handleBorrar(row.id)}
          className="p-1.5 rounded hover:bg-red-600 transition-colors"
          title="Eliminar"
          style={{ backgroundColor: "#ef4444", color: "white" }}
        >
          <Trash2 size={16} />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      center: true,
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
        Rasgos Clínicos Operatorios
      </h2>

      {rasgosClinicos.length > 0 ? (
        <div className="bg-white rounded-lg shadow w-full overflow-hidden">
          <DataTable
            columns={columns}
            data={rasgosClinicos}
            pagination
            paginationPerPage={5}
            highlightOnHover
            noDataComponent={<div className="p-4 text-center text-gray-500">No hay rasgos clínicos operatorios</div>}
          />
        </div>
      ) : (
        <EmptyState message="No existen rasgos clínicos operatorios para este registro" />
      )}
    </div>
  )
}