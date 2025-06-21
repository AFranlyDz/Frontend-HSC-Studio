"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { Button, Chip, Box, Typography } from "@mui/material"

import MuiDataTable from "@/components/layout/MuiDataTable"
import Footer from "@/components/layout/Footer"
import Header from "@/components/layout/Header"
import { Modal } from "@/components/ui/modal"
import { HistoriaClinicaForm } from "@/features/gestionarHistoriaClinica/HistoriaClinicaForm"
import { setHistoriaClinica, resetHistoriaClinica } from "@/features/gestionarHistoriaClinica/historiaClinicaSlice"

function RevisionCasos() {
  const apiUrl = import.meta.env.VITE_API_BACKEND
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)

  // Estados para los modales
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Cargar datos
  const loadData = async () => {
    setLoading(true)
    try {
      const respuesta = await axios.get(`${apiUrl}gestionar_historia_clinica/`)
      setData(respuesta.data)
    } catch (error) {
      console.error("Hubo un error al obtener los datos:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    loadData()
  }, [])

  // Manejar la visualización de detalles
  const handleVerMas = (rowData) => {
    dispatch(setHistoriaClinica(rowData))
    navigate("/Revision_casos/HistoriaClinica")
  }

  // Manejar la edición
  const handleEditar = (rowData) => {
    setSelectedRecord(rowData)
    setShowEditModal(true)
    dispatch(setHistoriaClinica(rowData))
  }

  // Manejar el borrado
  const handleBorrar = async (id) => {
    if (confirm("¿Estás seguro de eliminar este registro?")) {
      setLoading(true)
      try {
        await axios.delete(`${apiUrl}gestionar_historia_clinica/${id}/`)
        setData(data.filter((item) => item.id !== id))
        resetHistoriaClinica()
      } catch (error) {
        console.error("Error al borrar:", error)
        alert("Error al eliminar el registro")
      } finally {
        setLoading(false)
      }
    }
  }

  // Manejar la creación
  const handleCreate = async (formData) => {
    setLoading(true)
    try {
      const response = await axios.post(`${apiUrl}gestionar_historia_clinica/`, formData)
      setData([...data, response.data])
      setShowAddModal(false)

      alert(
        `Historia clínica creada exitosamente.\n\nNúmero: ${response.data.numero}\nSeudónimo: ${response.data.seudonimo}\n\nPor favor, tome nota de estos datos.`,
      )
    } catch (error) {
      console.error("Error al crear:", error)
      alert("Error al crear el registro")
    } finally {
      setLoading(false)
    }
  }

  // Manejar la actualización
  const handleUpdate = async (formData) => {
    setLoading(true)
    try {
      const response = await axios.put(`${apiUrl}gestionar_historia_clinica/${formData.id}/`, formData)
      setData(data.map((item) => (item.id === formData.id ? response.data : item)))
      setShowEditModal(false)
      dispatch(setHistoriaClinica(formData))

      alert(
        `Historia clínica actualizada exitosamente.\n\nNuevo seudónimo: ${response.data.seudonimo}\n\nPor favor, tome nota de este dato.`,
      )
    } catch (error) {
      console.error("Error al actualizar:", error)
      alert("Error al actualizar el registro")
    } finally {
      setLoading(false)
    }
  }

  // Columnas para la tabla MUI
  const columns = [
    {
      name: "Número",
      selector: (row) => row.numero,
      sortable: true,
      center: true,
      minWidth: "100px",
    },
    {
      name: "Seudónimo",
      selector: (row) => row.seudonimo,
      sortable: true,
      center: true,
      minWidth: "120px",
    },
    {
      name: "Edad",
      selector: (row) => row.edad,
      sortable: true,
      center: true,
      minWidth: "80px",
    },
    {
      name: "Sexo",
      cell: (row) => (
        <Chip
          label={row.sexo === true ? "Masculino" : "Femenino"}
          size="small"
          color={row.sexo === true ? "primary" : "secondary"}
          variant="outlined"
        />
      ),
      sortable: true,
      center: true,
      minWidth: "100px",
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
              handleVerMas(row)
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
              handleEditar(row)
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

  // Componente para mostrar detalles expandidos
  const ExpandedComponent = ({ data }) => {
    const formatValue = (key, value) => {
      if (key === "sexo") {
        return value === true ? "Masculino" : "Femenino"
      } else if (key === "manualidad") {
        return value === true ? "Derecha" : "Izquierda"
      } else if (typeof value === "boolean") {
        return value ? "Sí" : "No"
      } else {
        return value !== undefined ? String(value) : "N/A"
      }
    }

    const camposAMostrar = [
      { key: "numero", label: "Número" },
      { key: "seudonimo", label: "Seudónimo" },
      { key: "nombre", label: "Nombre" },
      { key: "apellidos", label: "Apellidos" },
      { key: "edad", label: "Edad" },
      { key: "sexo", label: "Sexo" },
      { key: "historial_trauma_craneal", label: "Historial Trauma Craneal" },
      { key: "manualidad", label: "Manualidad" },
      { key: "antecedentes_familiares", label: "Antecedentes Familiares" },
    ]

    return (
      <Box sx={{ p: 2, backgroundColor: "grey.50", borderRadius: 1, mx: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: "primary.main" }}>
          Detalles del paciente:
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 2 }}>
          {camposAMostrar.map(({ key, label }) => (
            <Box key={key} sx={{ p: 1.5, backgroundColor: "white", borderRadius: 1, boxShadow: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", display: "block" }}>
                {label}:
              </Typography>
              <Typography variant="body2" sx={{ color: "text.primary", mt: 0.5 }}>
                {formatValue(key, data[key])}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-6 md:pt-32 md:pb-8 bg-gradient-to-b from-gray-100 to-white w-full">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Historias Clínicas</h1>
            <p className="text-lg text-gray-700">Gestión de historias clínicas de pacientes con hematomas subdurales</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pt-2 pb-8 bg-white w-full flex-grow">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* DataTable con título y botón integrados */}
          <MuiDataTable
            title="Listado de Historias Clínicas"
            columns={columns}
            data={data}
            loading={loading}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 20, 30, 50]}
            expandableRows
            expandableRowsComponent={ExpandedComponent}
            sortByIdDesc={true}
            actions={
              <Button
                variant="contained"
                startIcon={<Plus size={18} />}
                onClick={() => setShowAddModal(true)}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Agregar
              </Button>
            }
            noDataComponent={
              <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>No hay registros disponibles</div>
            }
          />
        </div>
      </section>

      {/* Modal para agregar */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Agregar Historia Clínica" size="lg">
        <HistoriaClinicaForm onSubmit={handleCreate} isLoading={loading} />
      </Modal>

      {/* Modal para editar */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Editar Historia Clínica" size="lg">
        <HistoriaClinicaForm initialData={selectedRecord} onSubmit={handleUpdate} isLoading={loading} />
      </Modal>

      <Footer />
    </div>
  )
}

export default RevisionCasos
