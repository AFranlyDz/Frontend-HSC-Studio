"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { Button, Chip, Box } from "@mui/material"

import MuiDataTable from "@/components/layout/MuiDataTable"
import { Modal } from "@/components/ui/modal"
import { EmptyState } from "@/components/shared/EmptyState"
import { RegistroPosoperatorioForm } from "@/features/registroOperatorio/RegistroPosoperatorioForm"
import { useSelector, useDispatch } from "react-redux"
import { setHistoriaClinica } from "@/features/gestionarHistoriaClinica/historiaClinicaSlice"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export const RegistrosPosoperatoriosPanel = ({ registroOperatorioId, RegistrosPosoperatorios }) => {
  const { datos: reduxPaciente } = useSelector((state) => state.historiaClinica)
  const [paciente, setPaciente] = useState(reduxPaciente)
  const [registrosPosoperatorios, setRegistrosPosoperatorios] = useState(RegistrosPosoperatorios || [])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedRegistro, setSelectedRegistro] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_BACKEND

  useEffect(() => {
    console.log(RegistrosPosoperatorios)
  }, [])

  function getRegistrosPosoperatorios(paciente, registroOperatorioId) {
    return paciente.episodios.flatMap(
      (episodio) =>
        episodio.registro_operatorio
          ?.filter((ro) => ro.id === registroOperatorioId)
          ?.flatMap((ro) => ro.registros_posoperatorios || []) || [],
    )
  }

  // Crear un nuevo registro posoperatorio
  const handleCreate = async (formData) => {
    setLoading(true)
    try {
      const dataToSend = {
        ...formData,
        registro_operatorio: registroOperatorioId,
      }

      const response = await axios.post(`${apiUrl}registro_posoperatorio/`, dataToSend)

      // Actualizar el estado local
      const pacienteActualizado = {
        ...paciente,
        episodios: paciente.episodios.map((ep) => ({
          ...ep,
          registro_operatorio:
            ep.registro_operatorio?.map((ro) =>
              ro.id === registroOperatorioId
                ? {
                    ...ro,
                    registros_posoperatorios: [...(ro.registros_posoperatorios || []), response.data],
                  }
                : ro,
            ) || [],
        })),
      }
      dispatch(setHistoriaClinica(pacienteActualizado))
      setShowAddModal(false)
      alert("Registro posoperatorio creado correctamente")
      setPaciente(pacienteActualizado)
      const registrosPosop = getRegistrosPosoperatorios(pacienteActualizado, registroOperatorioId)
      setRegistrosPosoperatorios(registrosPosop)
    } catch (error) {
      console.error("Error al crear el registro posoperatorio:", error)
      alert("Error al crear el registro posoperatorio")
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
        registro_operatorio: registroOperatorioId,
      }

      const response = await axios.put(`${apiUrl}registro_posoperatorio/${formData.id}/`, dataToSend)

      // Actualizar el estado local
      const pacienteActualizado = {
        ...paciente,
        episodios: paciente.episodios.map((ep) => ({
          ...ep,
          registro_operatorio:
            ep.registro_operatorio?.map((ro) =>
              ro.id === registroOperatorioId
                ? {
                    ...ro,
                    registros_posoperatorios:
                      ro.registros_posoperatorios?.map((rp) => (rp.id === formData.id ? response.data : rp)) || [],
                  }
                : ro,
            ) || [],
        })),
      }

      dispatch(setHistoriaClinica(pacienteActualizado))
      setShowEditModal(false)
      setPaciente(pacienteActualizado)
      const registrosPosop = getRegistrosPosoperatorios(pacienteActualizado, registroOperatorioId)
      setRegistrosPosoperatorios(registrosPosop)
      alert("Registro posoperatorio actualizado correctamente")
    } catch (error) {
      console.error("Error al actualizar el registro posoperatorio:", error)
      alert("Error al actualizar el registro posoperatorio")
    } finally {
      setLoading(false)
    }
  }

  // Eliminar un registro
  const handleBorrar = async (id) => {
    if (confirm("¿Estás seguro de eliminar este registro posoperatorio?")) {
      setLoading(true)
      try {
        await axios.delete(`${apiUrl}registro_posoperatorio/${id}/`)

        // Actualizar el estado local
        const pacienteActualizado = {
          ...paciente,
          episodios: paciente.episodios.map((ep) => ({
            ...ep,
            registro_operatorio:
              ep.registro_operatorio?.map((ro) =>
                ro.id === registroOperatorioId
                  ? {
                      ...ro,
                      registros_posoperatorios: ro.registros_posoperatorios?.filter((rp) => rp.id !== id) || [],
                    }
                  : ro,
              ) || [],
          })),
        }

        dispatch(setHistoriaClinica(pacienteActualizado))
        const registrosPosop = getRegistrosPosoperatorios(pacienteActualizado, registroOperatorioId)
        setRegistrosPosoperatorios(registrosPosop)
        alert("Registro posoperatorio eliminado correctamente")
        setPaciente(pacienteActualizado)
      } catch (error) {
        console.error("Error al eliminar el registro posoperatorio:", error)
        alert("Error al eliminar el registro posoperatorio")
      } finally {
        setLoading(false)
      }
    }
  }

  // Columnas para la tabla de registros posoperatorios
  const columns = [
    {
      name: "Fecha",
      selector: (row) => (row.fecha ? new Date(row.fecha).toLocaleDateString() : "No especificada"),
      sortable: true,
      center: true,
    },
    {
      name: "Tiempo transcurrido (días)",
      selector: (row) => row.tiempo_transcurrido || "N/A",
      sortable: true,
      center: true,
    },
    {
      name: "Escala Oslo",
      selector: (row) => row.escala_pronostica_oslo_posoperatoria || "N/A",
      sortable: true,
      center: true,
    },
    {
      name: "Recurrencia hematoma",
      cell: (row) => (
        <Chip
          label={row.recurrencia_hematoma ? "Sí" : "No"}
          size="small"
          color={row.recurrencia_hematoma ? "error" : "success"}
          variant="outlined"
        />
      ),
      sortable: true,
      center: true,
    },
    {
      name: "Gradación recurrencia",
      selector: (row) => row.gradacion_pronostica_para_recurrencia_hsc_unilateral || "N/A",
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
              sessionStorage.setItem("selectedRegistroPosoperatorio", JSON.stringify(row))
              sessionStorage.setItem("selectedRegistroOperatorio", JSON.stringify({ id: registroOperatorioId }))
              navigate(`/Revision_casos/HistoriaClinica/Episodio/RegistroOperatorio/RegistroPosoperatorio`)
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

  if (registrosPosoperatorios.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            Registros Posoperatorios
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
        <EmptyState message="No existen registros posoperatorios para este registro operatorio" />

        {/* Modal para agregar registro */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Agregar Registro Posoperatorio"
          size="lg"
        >
          <RegistroPosoperatorioForm onSubmit={handleCreate} isLoading={loading} />
        </Modal>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <MuiDataTable
        title="Registros Posoperatorios"
        columns={columns}
        data={registrosPosoperatorios}
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
          <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>No hay registros posoperatorios</div>
        }
      />

      {/* Modal para agregar registro */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Agregar Registro Posoperatorio"
        size="lg"
      >
        <RegistroPosoperatorioForm onSubmit={handleCreate} isLoading={loading} />
      </Modal>

      {/* Modal para editar registro */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Registro Posoperatorio"
        size="lg"
      >
        <RegistroPosoperatorioForm initialData={selectedRegistro} onSubmit={handleUpdate} isLoading={loading} />
      </Modal>
    </div>
  )
}
