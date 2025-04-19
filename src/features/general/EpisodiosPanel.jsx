"use client"

import axios from "axios"
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { EmptyState } from "@/components/shared/EmptyState"
import { EpisodioForm } from "@/components/shared/EpisodioForm"
import { setHistoriaClinica } from "@/features/gestionarHistoriaClinica/historiaClinicaSlice"
import DataTable from "@/components/layout/DatatableBase"

export const EpisodiosPanel = () => {
  const { datos: paciente } = useSelector((state) => state.historiaClinica)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedEpisodio, setSelectedEpisodio] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_BACKEND

  // Crear un nuevo episodio
  const handleCreate = async (formData) => {
    setLoading(true)
    try {
      // Agregar el ID de la historia clínica
      const dataToSend = {
        ...formData,
        historia_clinica: paciente.id,
      }

      const response = await axios.post(`${apiUrl}episodios/`, dataToSend)

      // Actualizar el estado local
      const episodiosActualizados = [...paciente.episodios, response.data]
      const pacienteActualizado = { ...paciente, episodios: episodiosActualizados }
      dispatch(setHistoriaClinica(pacienteActualizado))

      setShowAddModal(false)
      alert("Episodio creado correctamente")
    } catch (error) {
      console.error("Error al crear el episodio:", error)
      alert("Error al crear el episodio")
    } finally {
      setLoading(false)
    }
  }

  // Abrir modal para editar episodio
  const handleEdit = (episodio) => {
    setSelectedEpisodio(episodio)
    setShowEditModal(true)
  }

  // Actualizar un episodio existente
  const handleUpdate = async (formData) => {
    setLoading(true)
    try {
      // Asegurarse de que el ID de la historia clínica esté incluido
      const dataToSend = {
        ...formData,
        historia_clinica: paciente.id,
      }

      const response = await axios.put(`${apiUrl}episodios/${formData.id}/`, dataToSend)

      // Actualizar el estado local
      const episodiosActualizados = paciente.episodios.map((ep) => (ep.id === formData.id ? response.data : ep))
      const pacienteActualizado = { ...paciente, episodios: episodiosActualizados }
      dispatch(setHistoriaClinica(pacienteActualizado))

      setShowEditModal(false)
      alert("Episodio actualizado correctamente")
    } catch (error) {
      console.error("Error al actualizar el episodio:", error)
      alert("Error al actualizar el episodio")
    } finally {
      setLoading(false)
    }
  }

  // Ver detalles de un episodio
  const handleVerDetalle = (episodio) => {
    // Guardar el episodio y el paciente en sessionStorage
    sessionStorage.setItem("selectedEpisodio", JSON.stringify(episodio))
    sessionStorage.setItem("selectedPaciente", JSON.stringify(paciente))

    // Navegar a la página de detalle
    navigate("/Revision_casos/HistoriaClinica/Episodio")
  }

  // Eliminar un episodio
  const handleBorrar = async (id) => {
    if (confirm("¿Estás seguro de eliminar este episodio?")) {
      setLoading(true)
      try {
        await axios.delete(`${apiUrl}episodios/${id}/`)

        // Actualizar el estado local
        const episodiosActualizados = paciente.episodios.filter((ep) => ep.id !== id)
        const pacienteActualizado = { ...paciente, episodios: episodiosActualizados }
        dispatch(setHistoriaClinica(pacienteActualizado))

        alert("Episodio eliminado correctamente")
      } catch (error) {
        console.error("Error al eliminar el episodio:", error)
        alert("Error al eliminar el episodio")
      } finally {
        setLoading(false)
      }
    }
  }

  // Columnas para la tabla de episodios
  const columns = [
    {
      name: "Fecha de inicio",
      selector: (row) => (row.inicio ? new Date(row.inicio).toLocaleDateString() : "N/A"),
      sortable: true,
      grow: 1,
      center: true,
    },
    {
      name: "Fecha de alta",
      selector: (row) => (row.fecha_alta ? new Date(row.fecha_alta).toLocaleDateString() : "N/A"),
      sortable: true,
      grow: 1,
      center: true,
    },
    {
      name: "Tiempo de estadía",
      selector: (row) => `${row.tiempo_estadia || 0} días`,
      sortable: true,
      grow: 1,
      center: true,
    },
    {
      name: "Estado al egreso",
      selector: (row) => (row.estado_al_egreso ? "Favorable" : "Desfavorable"),
      sortable: true,
      grow: 1,
      center: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => handleVerDetalle(row)}
            className="p-1.5 rounded hover:bg-blue-600 transition-colors"
            title="Ver detalles"
            style={{ backgroundColor: "#3b82f6", color: "white" }}
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="p-1.5 rounded hover:bg-yellow-600 transition-colors"
            title="Editar"
            style={{ backgroundColor: "#eab308", color: "white" }}
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleBorrar(row.id)}
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
      center: true,
      minWidth: "230px", // Aumentado para dar más espacio
      maxWidth: "300px",
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          Episodios Clínicos
        </h2>
        <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus size={16} className="mr-2" /> Agregar Episodio
        </Button>
      </div>

      {paciente.episodios && paciente.episodios.length > 0 ? (
        <div className="bg-white rounded-lg shadow w-full overflow-hidden">
          <div className="px-2 py-2 w-full">
            <DataTable
              columns={columns}
              data={paciente.episodios}
              pagination
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 10, 15]}
              highlightOnHover
              noDataComponent={<div className="p-4 text-center text-gray-500">No hay episodios registrados</div>}
              responsive
            />
          </div>
        </div>
      ) : (
        <EmptyState message="No existen episodios registrados para este paciente" />
      )}

      {/* Modal para agregar episodio */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Agregar Episodio" size="lg">
        <EpisodioForm onSubmit={handleCreate} isLoading={loading} />
      </Modal>

      {/* Modal para editar episodio */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Editar Episodio" size="lg">
        <EpisodioForm initialData={selectedEpisodio} onSubmit={handleUpdate} isLoading={loading} />
      </Modal>
    </div>
  )
}
