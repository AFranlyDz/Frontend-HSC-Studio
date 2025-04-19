"use client";

import axios from "axios";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/shared/EmptyState";
import { RegistroOperatorioForm } from "@/features/registroOperatorio/RegistroOperatorioForm";
import { setHistoriaClinica } from "@/features/gestionarHistoriaClinica/historiaClinicaSlice";
import DataTable from "@/components/layout/DatatableBase";

export const RegistroOperatorioPanel = ({ episodioId }) => {
  const { datos: paciente } = useSelector((state) => state.historiaClinica);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRegistro, setSelectedRegistro] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BACKEND;

  // Obtener el episodio específico y sus registros operatorios
  const episodio = paciente.episodios?.find((ep) => ep.id === episodioId);
  const registrosOperatorios = episodio?.registro_operatorio || [];

  // Crear un nuevo registro operatorio
  const handleCreate = async (formData) => {
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        episodio: episodioId,
      };

      const response = await axios.post(
        `${apiUrl}registro_operatorio/`,
        dataToSend
      );

      // Actualizar el estado local
      const episodiosActualizados = paciente.episodios.map((ep) =>
        ep.id === episodioId
          ? {
              ...ep,
              registro_operatorio: [
                ...(ep.registro_operatorio || []),
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
      alert("Registro operatorio creado correctamente");
    } catch (error) {
      console.error("Error al crear el registro operatorio:", error);
      alert("Error al crear el registro operatorio");
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal para editar registro
  const handleEdit = (registro) => {
    setSelectedRegistro(registro);
    setShowEditModal(true);
  };

  // Actualizar un registro existente
  const handleUpdate = async (formData) => {
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        episodio: episodioId,
      };

      const response = await axios.put(
        `${apiUrl}registro_operatorio/${formData.id}/`,
        dataToSend
      );

      // Actualizar el estado local
      const episodiosActualizados = paciente.episodios.map((ep) =>
        ep.id === episodioId
          ? {
              ...ep,
              registro_operatorio:
                ep.registro_operatorio?.map((ro) =>
                  ro.id === formData.id ? response.data : ro
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
      alert("Registro operatorio actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar el registro operatorio:", error);
      alert("Error al actualizar el registro operatorio");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un registro
  const handleBorrar = async (id) => {
    if (confirm("¿Estás seguro de eliminar este registro operatorio?")) {
      setLoading(true);
      try {
        await axios.delete(`${apiUrl}registro_operatorio/${id}/`);

        // Actualizar el estado local
        const episodiosActualizados = paciente.episodios.map((ep) =>
          ep.id === episodioId
            ? {
                ...ep,
                registro_operatorio:
                  ep.registro_operatorio?.filter((ro) => ro.id !== id) || [],
              }
            : ep
        );

        dispatch(
          setHistoriaClinica({
            ...paciente,
            episodios: episodiosActualizados,
          })
        );

        alert("Registro operatorio eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar el registro operatorio:", error);
        alert("Error al eliminar el registro operatorio");
      } finally {
        setLoading(false);
      }
    }
  };

  // Columnas para la tabla de registros operatorios
  const columns = [
    {
      name: "Fecha operación",
      selector: (row) =>
        row.fecha_operacion
          ? new Date(row.fecha_operacion).toLocaleDateString()
          : "No especificada",
      sortable: true,
      grow: 1,
      center: true,
    },
    {
      name: "Reintervención",
      selector: (row) => (row.es_reintervencion ? "Sí" : "No"),
      sortable: true,
      grow: 1,
      center: true,
    },
    {
      name: "Escala Glasgow",
      selector: (row) => row.escala_evaluacion_resultados_glasgow,
      sortable: true,
      grow: 1,
      center: true,
    },
    {
      name: "Estado egreso",
      selector: (row) => (row.estado_egreso ? "Favorable" : "Desfavorable"),
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
                "selectedRegistroOperatorio",
                JSON.stringify(row)
              );
              sessionStorage.setItem(
                "selectedEpisodio",
                JSON.stringify(episodio)
              );
              navigate(
                // `/Revision_casos/HistoriaClinica/RegistroOperatorio/${row.id}`
                "/Revision_casos/HistoriaClinica/Episodio/RegistroOperatorio"
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
          Registros Operatorios
        </h2>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={16} className="mr-2" /> Agregar Registro
        </Button>
      </div>

      {registrosOperatorios.length > 0 ? (
        <div className="bg-white rounded-lg shadow w-full overflow-hidden">
          <div className="px-2 py-2 w-full">
            <DataTable
              columns={columns}
              data={registrosOperatorios}
              pagination
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 10, 15]}
              highlightOnHover
              noDataComponent={
                <div className="p-4 text-center text-gray-500">
                  No hay registros operatorios
                </div>
              }
              responsive
            />
          </div>
        </div>
      ) : (
        <EmptyState message="No existen registros operatorios para este episodio" />
      )}

      {/* Modal para agregar registro */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Agregar Registro Operatorio"
        size="lg"
      >
        <RegistroOperatorioForm onSubmit={handleCreate} isLoading={loading} />
      </Modal>

      {/* Modal para editar registro */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Registro Operatorio"
        size="lg"
      >
        <RegistroOperatorioForm
          initialData={selectedRegistro}
          onSubmit={handleUpdate}
          isLoading={loading}
        />
      </Modal>
    </div>
  );
};
