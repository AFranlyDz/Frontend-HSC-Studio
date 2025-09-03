"use client"

import axios from "axios"
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { Button, Box } from "@mui/material"

import MuiDataTable from "@/components/layout/MuiDataTable"
import { Modal } from "@/components/ui/modal"
import { EmptyState } from "@/components/shared/EmptyState"
import { HematomaSubduralForm } from "@/features/hematoma/HematomaSubduralForm"
import { setHistoriaClinica } from "@/features/gestionarHistoriaClinica/historiaClinicaSlice"

export const HematomasSubduralesPanel = ({ episodioId }) => {
  const { datos: paciente } = useSelector((state) => state.historiaClinica)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedHematoma, setSelectedHematoma] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_BACKEND

  // Obtener el episodio específico y sus hematomas subdurales
  const episodio = paciente.episodios?.find((ep) => ep.id === episodioId)
  const hematomasSubdurales = episodio?.hematomas_subdurales || []

  // Crear un nuevo hematoma subdural
  const handleCreate = async (formData) => {
    setLoading(true)
    try {
      const dataToSend = {
        ...formData,
      }

      await axios.post(`${apiUrl}hematomas_subdurales/`, dataToSend)

      const response = await axios.get(`${apiUrl}gestionar_historia_clinica/${paciente.id}/`)
      dispatch(setHistoriaClinica(response.data))

      setShowAddModal(false)
      alert("Hematoma subdural creado correctamente")
    } catch (error) {
      console.error("Error al crear el hematoma subdural:", error)
      alert("Error al crear el hematoma subdural")
    } finally {
      setLoading(false)
    }
  }

  // Abrir modal para editar hematoma
  const handleEdit = (hematoma) => {
    setSelectedHematoma(hematoma)
    setShowEditModal(true)
  }

  // Actualizar un hematoma existente
  const handleUpdate = async (formData) => {
    setLoading(true)
    try {
      const dataToSend = {
        ...formData,
        episodio: episodioId,
      }

      await axios.put(`${apiUrl}hematomas_subdurales/${formData.id}/`, dataToSend)

      const response = await axios.get(`${apiUrl}gestionar_historia_clinica/${paciente.id}/`)
      dispatch(setHistoriaClinica(response.data))

      setShowEditModal(false)
      alert("Hematoma subdural actualizado correctamente")
    } catch (error) {
      console.error("Error al actualizar el hematoma subdural:", error)
      alert("Error al actualizar el hematoma subdural")
    } finally {
      setLoading(false)
    }
  }

  // Eliminar un hematoma
  const handleBorrar = async (id) => {
    if (confirm("¿Estás seguro de eliminar este hematoma subdural?")) {
      setLoading(true)
      try {
        await axios.delete(`${apiUrl}hematomas_subdurales/${id}/`)

        const response = await axios.get(`${apiUrl}gestionar_historia_clinica/${paciente.id}/`)
        dispatch(setHistoriaClinica(response.data))

        alert("Hematoma subdural eliminado correctamente")
      } catch (error) {
        console.error("Error al eliminar el hematoma subdural:", error)
        alert("Error al eliminar el hematoma subdural")
      } finally {
        setLoading(false)
      }
    }
  }

  // Columnas para la tabla de hematomas subdurales
  const columns = [
    {
      name: "Escala Glasgow",
      selector: (row) => row.escala_glasgow_ingreso || "N/A",
      sortable: true,
      center: true,
    },
    {
      name: "Escala McWalder",
      selector: (row) => row.escala_mcwalder || "N/A",
      sortable: true,
      center: true,
    },
    {
      name: "Volumen (ml)",
      selector: (row) => row.volumen || "N/A",
      sortable: true,
      center: true,
    },
    {
      name: "Localización",
      selector: (row) => row.localización || "N/A",
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
              sessionStorage.setItem("selectedHematomaSubdural", JSON.stringify(row))
              sessionStorage.setItem("selectedEpisodio", JSON.stringify(episodio))
              navigate("/Revision_casos/HistoriaClinica/Episodio/Hematoma")
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

  if (hematomasSubdurales.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            Hematomas Subdurales
          </h2>
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={() => setShowAddModal(true)}
            sx={{ textTransform: "none" }}
          >
            Agregar Hematoma
          </Button>
        </div>
        <EmptyState message="No existen hematomas subdurales para este episodio" />

        {/* Modal para agregar hematoma */}
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Agregar Hematoma Subdural" size="lg">
          <HematomaSubduralForm episodioId={episodioId} initialData='' onSubmit={handleCreate} isLoading={loading} />
        </Modal>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <MuiDataTable
        title="Hematomas Subdurales"
        columns={columns}
        data={hematomasSubdurales}
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
            Agregar Hematoma
          </Button>
        }
        noDataComponent={
          <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>
            No hay hematomas subdurales registrados
          </div>
        }
      />

      {/* Modal para agregar hematoma */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Agregar Hematoma Subdural" size="lg">
        <HematomaSubduralForm episodioId={episodioId} onSubmit={handleCreate} isLoading={loading} />
      </Modal>

      {/* Modal para editar hematoma */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Editar Hematoma Subdural" size="lg">
        <HematomaSubduralForm episodioId={episodioId} initialData={selectedHematoma} onSubmit={handleUpdate} isLoading={loading} />
      </Modal>
    </div>
  )
}
