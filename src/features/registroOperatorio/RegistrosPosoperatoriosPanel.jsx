"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { EmptyState } from "@/components/shared/EmptyState"
import axios from "axios"
import { useSelector, useDispatch } from "react-redux"
import { setHistoriaClinica } from "@/features/gestionarHistoriaClinica/historiaClinicaSlice"
import DataTable from "@/components/layout/DatatableBase"

export const RegistrosPosoperatoriosPanel = ({ registroOperatorioId, registrosPosoperatorios }) => {
  const { datos: paciente } = useSelector((state) => state.historiaClinica)
  const dispatch = useDispatch()
  const apiUrl = import.meta.env.VITE_API_BACKEND

  // Columnas para la tabla
  const columns = [
    {
      name: "Fecha",
      selector: (row) => row.fecha ? new Date(row.fecha).toLocaleDateString() : "No especificada",
      sortable: true,
      grow: 1,
    },
    {
      name: "Tiempo transcurrido",
      selector: (row) => `${row.tiempo_transcurrido} días`,
      sortable: true,
      grow: 1,
    },
    {
      name: "Escala Oslo",
      selector: (row) => row.escala_pronostica_oslo_posoperatoria,
      sortable: true,
      grow: 1,
    },
    {
      name: "Recurrencia hematoma",
      selector: (row) => row.recurrencia_hematoma ? "Sí" : "No",
      sortable: true,
      grow: 1,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex justify-center space-x-2">
          <button
            className="p-1.5 rounded hover:bg-blue-600 transition-colors"
            title="Ver detalles"
            style={{ backgroundColor: "#3b82f6", color: "white" }}
          >
            <Eye size={16} />
          </button>
          <button
            className="p-1.5 rounded hover:bg-yellow-600 transition-colors"
            title="Editar"
            style={{ backgroundColor: "#eab308", color: "white" }}
          >
            <Edit size={16} />
          </button>
          <button
            className="p-1.5 rounded hover:bg-red-600 transition-colors"
            title="Eliminar"
            style={{ backgroundColor: "#ef4444", color: "white" }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      grow: 2,
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          Registros Posoperatorios
        </h2>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus size={16} className="mr-2" /> Agregar Registro
        </Button>
      </div>

      {registrosPosoperatorios.length > 0 ? (
        <div className="bg-white rounded-lg shadow w-full overflow-hidden">
          <DataTable
            columns={columns}
            data={registrosPosoperatorios}
            pagination
            paginationPerPage={5}
            highlightOnHover
            noDataComponent={<div className="p-4 text-center text-gray-500">No hay registros posoperatorios</div>}
          />
        </div>
      ) : (
        <EmptyState message="No existen registros posoperatorios para este registro operatorio" />
      )}
    </div>
  )
}