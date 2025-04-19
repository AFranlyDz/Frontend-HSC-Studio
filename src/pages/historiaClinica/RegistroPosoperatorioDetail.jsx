"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HistoriaClinicaLayout } from "@/components/layout/HistoriaClinicaLayout";
import { InfoField } from "@/components/shared/InfoField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setHistoriaClinica } from "@/features/gestionarHistoriaClinica/historiaClinicaSlice";
import { RegistroPosoperatorioForm } from "@/features/registroOperatorio/RegistroPosoperatorioForm";
import { CustomTabs } from "@/components/shared/CustomTabs";

function RegistroPosoperatorioDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { datos: paciente } = useSelector((state) => state.historiaClinica);
  const [registroPosoperatorio, setRegistroPosoperatorio] = useState(null);
  const [registroOperatorio, setRegistroOperatorio] = useState(null);
  const [episodio, setEpisodio] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const apiUrl = import.meta.env.VITE_API_BACKEND;

  // Recuperar datos del registro posoperatorio, operatorio y episodio desde sessionStorage
  useEffect(() => {
    const storedRegistroPosop = sessionStorage.getItem("selectedRegistroPosoperatorio");
    const storedRegistroOp = sessionStorage.getItem("selectedRegistroOperatorio");
    const storedEpisodio = sessionStorage.getItem("selectedEpisodio");

    if (storedRegistroPosop && storedRegistroOp && storedEpisodio) {
      setRegistroPosoperatorio(JSON.parse(storedRegistroPosop));
      setRegistroOperatorio(JSON.parse(storedRegistroOp));
      setEpisodio(JSON.parse(storedEpisodio));
    }
  }, [location.search]);

  // Si no hay datos, mostrar mensaje
  if (!registroPosoperatorio || !registroOperatorio || !episodio || !paciente) {
    return (
      <HistoriaClinicaLayout title="Detalle del Registro Posoperatorio">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            No se encontraron datos del registro posoperatorio
          </h2>
          <Button
            onClick={() => navigate(-1)}
            className="mt-4"
          >
            <ArrowLeft size={16} className="mr-2" /> Volver
          </Button>
        </div>
      </HistoriaClinicaLayout>
    );
  }

  // Iniciar edición
  const handleEdit = () => {
    setEditing(true);
  };

  // Cancelar edición
  const handleCancel = () => {
    setEditing(false);
  };

  // Guardar cambios
  const handleSubmit = async (formData) => {
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        registro_operatorio: registroOperatorio.id,
      };

      const response = await axios.put(
        `${apiUrl}registro_posoperatorio/${registroPosoperatorio.id}/`,
        dataToSend
      );

      // Actualizar el estado local
      setRegistroPosoperatorio(response.data);

      // Actualizar sessionStorage
      sessionStorage.setItem("selectedRegistroPosoperatorio", JSON.stringify(response.data));

      // Actualizar el estado en Redux
      const pacienteActualizado = {
        ...paciente,
        episodios: paciente.episodios.map(ep => ({
          ...ep,
          registro_operatorio: ep.registro_operatorio?.map(ro => 
            ro.id === registroOperatorio.id
              ? {
                  ...ro,
                  registros_posoperatorios: ro.registros_posoperatorios?.map(rp => 
                    rp.id === registroPosoperatorio.id ? response.data : rp
                  ) || []
                }
              : ro
          ) || []
        }))
      };

      dispatch(setHistoriaClinica(pacienteActualizado));

      setEditing(false);
      alert("Registro posoperatorio actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar el registro posoperatorio");
    } finally {
      setLoading(false);
    }
  };

  // Campos a mostrar en la vista de detalle
  const campos = [
    {
      label: "Fecha",
      key: "fecha",
      format: (value) => (value ? new Date(value).toLocaleDateString() : "No especificada"),
    },
    {
      label: "Tiempo transcurrido (días)",
      key: "tiempo_transcurrido",
    },
    {
      label: "Escala Oslo posoperatoria",
      key: "escala_pronostica_oslo_posoperatoria",
    },
    {
      label: "Recurrencia de hematoma",
      key: "recurrencia_hematoma",
      format: (value) => (value ? "Sí" : "No"),
    },
    {
      label: "Gradación pronóstica para recurrencia HSC unilateral",
      key: "gradacion_pronostica_para_recurrencia_hsc_unilateral",
    },
  ];

  // Configuración de las pestañas
  const tabs = [
    {
      label: "Información General",
      content: (
        <div className="space-y-6">
          {/* Información básica del registro posoperatorio */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Registro Posoperatorio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campos.map((campo) => (
                  <InfoField
                    key={campo.key}
                    label={campo.label}
                    value={
                      campo.format
                        ? campo.format(registroPosoperatorio[campo.key])
                        : registroPosoperatorio[campo.key]
                    }
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    // Puedes agregar más pestañas aquí si es necesario
  ];

  return (
    <HistoriaClinicaLayout title="Detalle del Registro Posoperatorio">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft size={16} className="mr-2" /> Volver
        </Button>
        {!editing && activeTab === 0 && (
          <Button
            onClick={handleEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Edit size={16} className="mr-2" /> Editar
          </Button>
        )}
      </div>

      {editing ? (
        <Card>
          <CardHeader>
            <CardTitle>Editar Registro Posoperatorio</CardTitle>
          </CardHeader>
          <CardContent>
            <RegistroPosoperatorioForm
              initialData={registroPosoperatorio}
              onSubmit={handleSubmit}
              isLoading={loading}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-1">
          <CustomTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(index) => setActiveTab(index)}
          />
        </div>
      )}
    </HistoriaClinicaLayout>
  );
}

export default RegistroPosoperatorioDetail;