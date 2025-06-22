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
import { RegistroOperatorioForm } from "@/features/registroOperatorio/RegistroOperatorioForm"
import { setHistoriaClinica, forceUpdate } from "@/features/gestionarHistoriaClinica/historiaClinicaSlice"

export const RegistroOperatorioPanel = ({ episodioId }) => {
  const { datos: paciente } = useSelector((state) => state.historiaClinica)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedRegistro, setSelectedRegistro] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_BACKEND

  // Obtener el episodio específico y sus registros operatorios
  const episodio = paciente.episodios?.find((ep) => ep.id === episodioId)
  const registrosOperatorios = episodio?.registro_operatorio || []

  // Crear un nuevo registro operatorio
  const handleCreate = async (formData) => {
    setLoading(true)
    try {
      const dataToSend = {
        ...formData,
        episodio: episodioId,
      }

      await axios.post(`${apiUrl}registro_operatorio/`, dataToSend)

      const response = await axios.get(`${apiUrl}gestionar_historia_clinica/${paciente.id}/`)
      dispatch(setHistoriaClinica(response.data))

      setShowAddModal(false)
      alert("Registro operatorio creado correctamente")
    } catch (error) {
      console.error("Error al crear el registro operatorio:", error)
      alert("Error al crear el registro operatorio")
    } finally {
      setLoading(false)
    }
  }

  // Abrir modal para editar registro
  const handleEdit = (registro) => {
    setSelectedRegistro(registro)
    setShowEditModal(true)
  }

  // Actualizar un registro existente
  const handleUpdate = async (formData) => {
    setLoading(true)
    try {
      const dataToSend = {
        ...formData,
        episodio: episodioId,
      }

      await axios.put(`${apiUrl}registro_operatorio/${formData.id}/`, dataToSend)

      const response = await axios.get(`${apiUrl}gestionar_historia_clinica/${paciente.id}/`)
      dispatch(setHistoriaClinica(response.data))

      setShowEditModal(false)
      alert("Registro operatorio actualizado correctamente")
    } catch (error) {
      console.error("Error al actualizar el registro operatorio:", error)
      alert("Error al actualizar el registro operatorio")
    } finally {
      setLoading(false)
    }
  }

  // Eliminar un registro
  const handleBorrar = async (id) => {
    if (confirm("¿Estás seguro de eliminar este registro operatorio?")) {
      setLoading(true)
      try {
        await axios.delete(`${apiUrl}registro_operatorio/${id}/`)

        const response = await axios.get(`${apiUrl}gestionar_historia_clinica/${paciente.id}/`)
        dispatch(setHistoriaClinica(response.data))

        alert("Registro operatorio eliminado correctamente")
      } catch (error) {
        console.error("Error al eliminar el registro operatorio:", error)
        alert("Error al eliminar el registro operatorio")
      } finally {
        setLoading(false)
      }
    }
  }

  // Columnas para la tabla de registros operatorios
  const columns = [
    {
      name: "Fecha operación",
      selector: (row) => {
        if (!row.fecha_operacion) return "N/A";
        const [year, month, day] = row.fecha_operacion.split('T')[0].split('-');
        return `${day}/${month}/${year}`;
      },
      sortable: true,
      center: true,
    },
    {
      name: "Reintervención",
      cell: (row) => (
        <Chip
          label={row.es_reintervencion ? "Sí" : "No"}
          size="small"
          color={row.es_reintervencion ? "warning" : "default"}
          variant="outlined"
        />
      ),
      sortable: true,
      center: true,
    },
    {
      name: "Escala Glasgow",
      selector: (row) => row.escala_evaluacion_resultados_glasgow || "N/A",
      sortable: true,
      center: true,
    },
    {
      name: "Estado egreso",
      cell: (row) => (
        <Chip
          label={row.estado_egreso ? "Favorable" : "Desfavorable"}
          size="small"
          color={row.estado_egreso ? "success" : "error"}
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
              sessionStorage.setItem("selectedRegistroOperatorio", JSON.stringify(row))
              sessionStorage.setItem("selectedEpisodio", JSON.stringify(episodio))
              navigate("/Revision_casos/HistoriaClinica/Episodio/RegistroOperatorio")
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

  if (registrosOperatorios.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            Registros Operatorios
          </h2>
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={() => setShowAddModal(true)}
            sx={{ textTransform: "none" }}
          >
            Agregar Registro
          </Button>
        </div>
        <EmptyState message="No existen registros operatorios para este episodio" />

        {/* Modal para agregar registro */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Agregar Registro Operatorio"
          size="lg"
        >
          <RegistroOperatorioForm onSubmit={handleCreate} isLoading={loading} />
        </Modal>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <MuiDataTable
        title="Registros Operatorios"
        columns={columns}
        data={registrosOperatorios}
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
            Agregar Registro
          </Button>
        }
        noDataComponent={
          <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>No hay registros operatorios</div>
        }
      />

      {/* Modal para agregar registro */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Agregar Registro Operatorio" size="lg">
        <RegistroOperatorioForm onSubmit={handleCreate} isLoading={loading} />
      </Modal>

      {/* Modal para editar registro */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Registro Operatorio"
        size="lg"
      >
        <RegistroOperatorioForm initialData={selectedRegistro} onSubmit={handleUpdate} isLoading={loading} />
      </Modal>
    </div>
  )
}
