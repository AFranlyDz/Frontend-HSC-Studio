"use client";

import axios from "axios";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/shared/EmptyState";
import { HematomaSubduralForm } from "@/features/hematoma/HematomaSubduralForm";
import { setHistoriaClinica } from "@/features/gestionarHistoriaClinica/historiaClinicaSlice";
import DataTable from "@/components/layout/DatatableBase";

export const HematomasSubduralesPanel = ({ episodioId }) => {
  const { datos: paciente } = useSelector((state) => state.historiaClinica);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedHematoma, setSelectedHematoma] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BACKEND;

  // Obtener el episodio específico y sus hematomas subdurales
  const episodio = paciente.episodios?.find((ep) => ep.id === episodioId);
  const hematomasSubdurales = episodio?.hematomas_subdurales || [];

  // Crear un nuevo hematoma subdural
  const handleCreate = async (formData) => {
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        episodio: episodioId,
      };

      const response = await axios.post(
        `${apiUrl}hematomas_subdurales/`,
        dataToSend
      );

      // Actualizar el estado local
      const episodiosActualizados = paciente.episodios.map((ep) =>
        ep.id === episodioId
          ? {
              ...ep,
              hematomas_subdurales: [
                ...(ep.hematomas_subdurales || []),
                response.data,
              ],
            }
          : ep
      );

      dispatch(
        setHistoriaClinica({
          ...paciente,
          episodios: episodiosActualizados,
        })
      );

      setShowAddModal(false);
      alert("Hematoma subdural creado correctamente");
    } catch (error) {
      console.error("Error al crear el hematoma subdural:", error);
      alert("Error al crear el hematoma subdural");
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal para editar hematoma
  const handleEdit = (hematoma) => {
    setSelectedHematoma(hematoma);
    setShowEditModal(true);
  };

  // Actualizar un hematoma existente
  const handleUpdate = async (formData) => {
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        episodio: episodioId,
      };

      const response = await axios.put(
        `${apiUrl}hematomas_subdurales/${formData.id}/`,
        dataToSend
      );

      // Actualizar el estado local
      const episodiosActualizados = paciente.episodios.map((ep) =>
        ep.id === episodioId
          ? {
              ...ep,
              hematomas_subdurales:
                ep.hematomas_subdurales?.map((hs) =>
                  hs.id === formData.id ? response.data : hs
                ) || [],
            }
          : ep
      );

      dispatch(
        setHistoriaClinica({
          ...paciente,
          episodios: episodiosActualizados,
        })
      );

      setShowEditModal(false);
      alert("Hematoma subdural actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar el hematoma subdural:", error);
      alert("Error al actualizar el hematoma subdural");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un hematoma
  const handleBorrar = async (id) => {
    if (confirm("¿Estás seguro de eliminar este hematoma subdural?")) {
      setLoading(true);
      try {
        await axios.delete(`${apiUrl}hematomas_subdurales/${id}/`);

        // Actualizar el estado local
        const episodiosActualizados = paciente.episodios.map((ep) =>
          ep.id === episodioId
            ? {
                ...ep,
                hematomas_subdurales:
                  ep.hematomas_subdurales?.filter((hs) => hs.id !== id) || [],
              }
            : ep
        );

        dispatch(
          setHistoriaClinica({
            ...paciente,
            episodios: episodiosActualizados,
          })
        );

        alert("Hematoma subdural eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar el hematoma subdural:", error);
        alert("Error al eliminar el hematoma subdural");
      } finally {
        setLoading(false);
      }
    }
  };

  // Columnas para la tabla de hematomas subdurales
  const columns = [
    {
      name: "Escala Glasgow",
      selector: (row) => row.escala_glasgow_ingreso,
      sortable: true,
      grow: 1,
      center: true,
    },
    {
      name: "Escala McWalder",
      selector: (row) => row.escala_mcwalder,
      sortable: true,
      grow: 1,
      center: true,
    },
    {
      name: "Volumen (ml)",
      selector: (row) => row.volumen,
      sortable: true,
      grow: 1,
      center: true,
    },
    {
      name: "Localización",
      selector: (row) => row.localización,
      sortable: true,
      grow: 1,
      center: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => {
              sessionStorage.setItem(
                "selectedHematomaSubdural",
                JSON.stringify(row)
              );
              sessionStorage.setItem(
                "selectedEpisodio",
                JSON.stringify(episodio)
              );
              navigate(
                "/Revision_casos/HistoriaClinica/Episodio/Hematoma"
              );
            }}
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
      minWidth: "180px",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          Hematomas Subdurales
        </h2>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={16} className="mr-2" /> Agregar Hematoma
        </Button>
      </div>

      {hematomasSubdurales.length > 0 ? (
        <div className="bg-white rounded-lg shadow w-full overflow-hidden">
          <div className="px-2 py-2 w-full">
            <DataTable
              columns={columns}
              data={hematomasSubdurales}
              pagination
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 10, 15]}
              highlightOnHover
              noDataComponent={
                <div className="p-4 text-center text-gray-500">
                  No hay hematomas subdurales registrados
                </div>
              }
              responsive
            />
          </div>
        </div>
      ) : (
        <EmptyState message="No existen hematomas subdurales para este episodio" />
      )}

      {/* Modal para agregar hematoma */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Agregar Hematoma Subdural"
        size="lg"
      >
        <HematomaSubduralForm onSubmit={handleCreate} isLoading={loading} />
      </Modal>

      {/* Modal para editar hematoma */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Hematoma Subdural"
        size="lg"
      >
        <HematomaSubduralForm
          initialData={selectedHematoma}
          onSubmit={handleUpdate}
          isLoading={loading}
        />
      </Modal>
    </div>
  );
};