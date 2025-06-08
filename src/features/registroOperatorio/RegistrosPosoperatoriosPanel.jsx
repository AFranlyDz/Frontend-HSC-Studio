"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/shared/EmptyState";
import { RegistroPosoperatorioForm } from "@/features/registroOperatorio/RegistroPosoperatorioForm";
import { useSelector, useDispatch } from "react-redux";
import { setHistoriaClinica } from "@/features/gestionarHistoriaClinica/historiaClinicaSlice";
import { useNavigate } from "react-router-dom";
import DataTable from "@/components/layout/DatatableBase";
import axios from "axios";

export const RegistrosPosoperatoriosPanel = ({
  registroOperatorioId,
  RegistrosPosoperatorios,
}) => {
  const { datos: reduxPaciente } = useSelector(
    (state) => state.historiaClinica
  );
  const [paciente, setPaciente] = useState(reduxPaciente);
  const [registrosPosoperatorios, setRegistrosPosoperatorios] = useState(
    RegistrosPosoperatorios || []
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRegistro, setSelectedRegistro] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BACKEND;

  useEffect(() => {console.log(RegistrosPosoperatorios)}, [])

  function getRegistrosPosoperatorios(paciente, registroOperatorioId) {
    return paciente.episodios.flatMap(
      (episodio) =>
        episodio.registro_operatorio
          ?.filter((ro) => ro.id === registroOperatorioId)
          ?.flatMap((ro) => ro.registros_posoperatorios || []) || []
    );
  }

  // Crear un nuevo registro posoperatorio
  const handleCreate = async (formData) => {
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        registro_operatorio: registroOperatorioId,
      };

      const response = await axios.post(
        `${apiUrl}registro_posoperatorio/`,
        dataToSend
      );

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
                    registros_posoperatorios: [
                      ...(ro.registros_posoperatorios || []),
                      response.data,
                    ],
                  }
                : ro
            ) || [],
        })),
      };
      dispatch(setHistoriaClinica(pacienteActualizado));
      setShowAddModal(false);
      alert("Registro posoperatorio creado correctamente");
      setPaciente(pacienteActualizado);
      const registrosPosop = getRegistrosPosoperatorios(
        pacienteActualizado,
        registroOperatorioId
      );
      setRegistrosPosoperatorios(registrosPosop);
    } catch (error) {
      console.error("Error al crear el registro posoperatorio:", error);
      alert("Error al crear el registro posoperatorio");
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
        registro_operatorio: registroOperatorioId,
      };

      const response = await axios.put(
        `${apiUrl}registro_posoperatorio/${formData.id}/`,
        dataToSend
      );

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
                      ro.registros_posoperatorios?.map((rp) =>
                        rp.id === formData.id ? response.data : rp
                      ) || [],
                  }
                : ro
            ) || [],
        })),
      };

      dispatch(setHistoriaClinica(pacienteActualizado));
      setShowEditModal(false);
      setPaciente(pacienteActualizado);
      const registrosPosop = getRegistrosPosoperatorios(
        pacienteActualizado,
        registroOperatorioId
      );
      setRegistrosPosoperatorios(registrosPosop);
      alert("Registro posoperatorio actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar el registro posoperatorio:", error);
      alert("Error al actualizar el registro posoperatorio");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un registro
  const handleBorrar = async (id) => {
    if (confirm("¿Estás seguro de eliminar este registro posoperatorio?")) {
      setLoading(true);
      try {
        await axios.delete(`${apiUrl}registro_posoperatorio/${id}/`);

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
                        ro.registros_posoperatorios?.filter(
                          (rp) => rp.id !== id
                        ) || [],
                    }
                  : ro
              ) || [],
          })),
        };

        dispatch(setHistoriaClinica(pacienteActualizado));
        const registrosPosop = getRegistrosPosoperatorios(
          pacienteActualizado,
          registroOperatorioId
        );
        setRegistrosPosoperatorios(registrosPosop);
        alert("Registro posoperatorio eliminado correctamente");
        setPaciente(pacienteActualizado);
      } catch (error) {
        console.error("Error al eliminar el registro posoperatorio:", error);
        alert("Error al eliminar el registro posoperatorio");
      } finally {
        setLoading(false);
      }
    }
  };

  // Columnas para la tabla de registros posoperatorios
  const columns = [
    {
      name: "Fecha",
      selector: (row) =>
        row.fecha
          ? new Date(row.fecha).toLocaleDateString()
          : "No especificada",
      sortable: true,
      grow: 1,
      center: true,
    },
    {
      name: "Tiempo transcurrido (días)",
      selector: (row) => row.tiempo_transcurrido,
      sortable: true,
      grow: 1,
      center: true,
    },
    {
      name: "Escala Oslo",
      selector: (row) => row.escala_pronostica_oslo_posoperatoria,
      sortable: true,
      grow: 1,
      center: true,
    },
    {
      name: "Recurrencia hematoma",
      selector: (row) => (row.recurrencia_hematoma ? "Sí" : "No"),
      sortable: true,
      grow: 1,
      center: true,
    },
    {
      name: "Gradación recurrencia",
      selector: (row) =>
        row.gradacion_pronostica_para_recurrencia_hsc_unilateral,
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
                "selectedRegistroPosoperatorio",
                JSON.stringify(row)
              );
              sessionStorage.setItem(
                "selectedRegistroOperatorio",
                JSON.stringify({ id: registroOperatorioId })
              );
              navigate(
                `/Revision_casos/HistoriaClinica/Episodio/RegistroOperatorio/RegistroPosoperatorio`
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
      minWidth: "150px",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          Registros Posoperatorios
        </h2>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={16} className="mr-2" /> Agregar Registro
        </Button>
      </div>

      {registrosPosoperatorios.length > 0 ? (
        <div className="bg-white rounded-lg shadow w-full overflow-hidden">
          <div className="px-2 py-2 w-full">
            <DataTable
              columns={columns}
              data={registrosPosoperatorios}
              pagination
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 10, 15]}
              highlightOnHover
              noDataComponent={
                <div className="p-4 text-center text-gray-500">
                  No hay registros posoperatorios
                </div>
              }
              responsive
            />
          </div>
        </div>
      ) : (
        <EmptyState message="No existen registros posoperatorios para este registro operatorio" />
      )}

      {/* Modal para agregar registro */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Agregar Registro Posoperatorio"
        size="lg"
      >
        <RegistroPosoperatorioForm
          onSubmit={handleCreate}
          isLoading={loading}
        />
      </Modal>

      {/* Modal para editar registro */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Registro Posoperatorio"
        size="lg"
      >
        <RegistroPosoperatorioForm
          initialData={selectedRegistro}
          onSubmit={handleUpdate}
          isLoading={loading}
        />
      </Modal>
    </div>
  );
};
