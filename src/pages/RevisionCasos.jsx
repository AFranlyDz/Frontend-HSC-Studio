"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"

import DataTable from "@/components/layout/DatatableBase"
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
  const [showDetailModal, setShowDetailModal] = useState(false)

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
    navigate("/Revision_casos/HistoriaClinica")
    dispatch(setHistoriaClinica(rowData))
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

      // Mostrar mensaje con el número y seudónimo generados
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

      // Mostrar mensaje con el seudónimo actualizado
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

  // Columnas con mejor distribución y más espacio para acciones
  const columns = [
    {
      name: "Número",
      selector: (row) => row.numero,
      sortable: true,
      grow: 1,
      center: true,
      minWidth: "100px",
      maxWidth: "150px",
    },
    {
      name: "Seudónimo",
      selector: (row) => row.seudonimo,
      sortable: true,
      grow: 1.2,
      center: true,
      minWidth: "120px",
      maxWidth: "180px",
    },
    {
      name: "Edad",
      selector: (row) => row.edad,
      sortable: true,
      grow: 0.8,
      center: true,
      minWidth: "80px",
      maxWidth: "100px",
    },
    {
      name: "Sexo",
      cell: (row) => (row.sexo === true ? "Masculino" : "Femenino"),
      sortable: true,
      grow: 1,
      center: true,
      minWidth: "100px",
      maxWidth: "150px",
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => handleVerMas(row)}
            className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            title="Ver detalles"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleEditar(row)}
            className="p-1.5 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            title="Editar"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleBorrar(row.id)}
            className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      grow: 2, // Más espacio para los botones de acción
      center: true,
      minWidth: "180px",
      maxWidth: "220px",
    },
  ]

  // Componente para mostrar detalles expandidos
  const ExpandedComponent = ({ data }) => {
    // Función para formatear los valores según su tipo
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

    return (
      <div className="p-4 bg-gray-50 border-t border-b">
        <h3 className="font-bold mb-2">Detalles completos:</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(data)
            .filter(([key]) => key !== "id") // Excluir el ID
            .map(([key, value]) => (
              <div key={key} className="p-2 bg-white rounded shadow">
                <strong className="text-gray-700">{key}:</strong>{" "}
                <span className="text-gray-900">{formatValue(key, value)}</span>
              </div>
            ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero Section con fondo similar al de home.tsx */}
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Listado de Historias Clínicas</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} className="mr-1" /> Agregar
            </button>
          </div>

          {/* DataTable */}
          <div className="bg-white rounded-lg shadow w-full overflow-hidden">
            <div className="px-2 py-2 w-full">
              <DataTable
                columns={columns}
                data={data}
                progressPending={loading}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 20, 30, 50]}
                expandableRows
                expandableRowsComponent={ExpandedComponent}
                expandOnRowClicked
                expandableRowsHideExpander
                highlightOnHover
                noDataComponent={<div className="p-4 text-center text-gray-500">No hay registros disponibles</div>}
                responsive
                fixedHeader
                fixedHeaderScrollHeight="500px"
              />
            </div>
          </div>
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

