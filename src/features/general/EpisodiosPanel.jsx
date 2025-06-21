"use client"

import axios from "axios"
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { Button, Chip, Box } from "@mui/material"

import MuiDataTable from "@/components/layout/MuiDataTable"
import { Modal } from "@/components/ui/modal"
import { EmptyState } from "@/components/shared/EmptyState"
import { EpisodioForm } from "@/components/shared/EpisodioForm"
import { setHistoriaClinica } from "@/features/gestionarHistoriaClinica/historiaClinicaSlice"

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
      const dataToSend = {
        ...formData,
        historia_clinica: paciente.id,
      }

      const response = await axios.post(`${apiUrl}episodios/`, dataToSend)

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
      const dataToSend = {
        ...formData,
        historia_clinica: paciente.id,
      }

      const response = await axios.put(`${apiUrl}episodios/${formData.id}/`, dataToSend)

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
    sessionStorage.setItem("selectedEpisodio", JSON.stringify(episodio))
    sessionStorage.setItem("selectedPaciente", JSON.stringify(paciente))
    navigate("/Revision_casos/HistoriaClinica/Episodio")
  }

  // Eliminar un episodio
  const handleBorrar = async (id) => {
    if (confirm("¿Estás seguro de eliminar este episodio?")) {
      setLoading(true)
      try {
        await axios.delete(`${apiUrl}episodios/${id}/`)

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
      center: true,
    },
    {
      name: "Fecha de alta",
      selector: (row) => (row.fecha_alta ? new Date(row.fecha_alta).toLocaleDateString() : "N/A"),
      sortable: true,
      center: true,
    },
    {
      name: "Tiempo de estadía",
      selector: (row) => `${row.tiempo_estadia || 0} días`,
      sortable: true,
      center: true,
    },
    {
      name: "Estado al egreso",
      cell: (row) => (
        <Chip
          label={row.estado_al_egreso ? "Favorable" : "Desfavorable"}
          size="small"
          color={row.estado_al_egreso ? "success" : "error"}
          variant="outlined"
        />
      ),
      sortable: true,
      center: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <Button
            size="small"
            variant="contained"
            onClick={(e) => {
              e.stopPropagation()
              handleVerDetalle(row)
            }}
            sx={{
              minWidth: 36,
              width: 36,
              height: 32,
              backgroundColor: "#3b82f6",
              "&:hover": { backgroundColor: "#2563eb" },
              p: 0,
            }}
            title="Ver detalles"
          >
            <Eye size={16} />
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={(e) => {
              e.stopPropagation()
              handleEdit(row)
            }}
            sx={{
              minWidth: 36,
              width: 36,
              height: 32,
              backgroundColor: "#eab308",
              "&:hover": { backgroundColor: "#ca8a04" },
              p: 0,
            }}
            title="Editar"
          >
            <Edit size={16} />
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={(e) => {
              e.stopPropagation()
              handleBorrar(row.id)
            }}
            sx={{
              minWidth: 36,
              width: 36,
              height: 32,
              backgroundColor: "#ef4444",
              "&:hover": { backgroundColor: "#dc2626" },
              p: 0,
            }}
            title="Eliminar"
          >
            <Trash2 size={16} />
          </Button>
        </Box>
      ),
      center: true,
      minWidth: "180px",
    },
  ]

  if (!paciente.episodios || paciente.episodios.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            Episodios Clínicos
          </h2>
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={() => setShowAddModal(true)}
            sx={{ textTransform: "none" }}
          >
            Agregar Episodio
          </Button>
        </div>
        <EmptyState message="No existen episodios registrados para este paciente" />

        {/* Modal para agregar episodio */}
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Agregar Episodio" size="lg">
          <EpisodioForm onSubmit={handleCreate} isLoading={loading} />
        </Modal>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <MuiDataTable
        title="Episodios Clínicos"
        columns={columns}
        data={paciente.episodios}
        loading={loading}
        pagination
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 15]}
        actions={
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={() => setShowAddModal(true)}
            sx={{ textTransform: "none" }}
          >
            Agregar Episodio
          </Button>
        }
        noDataComponent={
          <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>No hay episodios registrados</div>
        }
      />

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
