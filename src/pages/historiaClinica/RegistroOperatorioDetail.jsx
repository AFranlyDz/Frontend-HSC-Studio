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
import { RegistroOperatorioForm } from "@/features/registroOperatorio/RegistroOperatorioForm";
import { CustomTabs } from "@/components/shared/CustomTabs";
import { RasgosClinicosOperatoriosPanel } from "@/features/registroOperatorio/RasgosClinicosOperatoriosPanel";
import { RegistrosPosoperatoriosPanel } from "@/features/registroOperatorio/RegistrosPosoperatoriosPanel";

function RegistroOperatorioDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { datos: paciente } = useSelector((state) => state.historiaClinica);
  const [registroOperatorio, setRegistroOperatorio] = useState(null);
  const [episodio, setEpisodio] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const apiUrl = import.meta.env.VITE_API_BACKEND;

  // Recuperar datos del registro operatorio y episodio desde sessionStorage
  useEffect(() => {
    const storedRegistro = sessionStorage.getItem("selectedRegistroOperatorio");
    const storedEpisodio = sessionStorage.getItem("selectedEpisodio");

    if (storedRegistro && storedEpisodio) {
      setRegistroOperatorio(JSON.parse(storedRegistro));
      setEpisodio(JSON.parse(storedEpisodio));
    }
  }, [location.search]);

  // Si no hay datos, mostrar mensaje
  if (!registroOperatorio || !episodio || !paciente) {
    return (
      <HistoriaClinicaLayout title="Detalle del Registro Operatorio">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            No se encontraron datos del registro operatorio
          </h2>
          <Button
            onClick={() => navigate(-1)} // Volver a la página anterior
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
        episodio: episodio.id,
      };

      const response = await axios.put(
        `${apiUrl}registro_operatorio/${registroOperatorio.id}/`,
        dataToSend
      );

      // Actualizar el estado local
      setRegistroOperatorio(response.data);

      // Actualizar sessionStorage
      sessionStorage.setItem("selectedRegistroOperatorio", JSON.stringify(response.data));

      // Actualizar el estado en Redux
      const historiaResponse = await axios.get(
        `${apiUrl}gestionar_historia_clinica/${paciente.id}/`
      );
      dispatch(setHistoriaClinica(historiaResponse.data));

      setEditing(false);
      alert("Registro operatorio actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar el registro operatorio");
    } finally {
      setLoading(false);
    }
  };

  // Campos a mostrar en la pestaña de información
  const campos = [
    {
      label: "Fecha de operación",
      key: "fecha_operacion",
      format: (value) => (value ? new Date(value).toLocaleDateString() : "No especificada"),
    },
    {
      label: "Es reintervención",
      key: "es_reintervencion",
      format: (value) => (value ? "Sí" : "No"),
    },
    {
      label: "Escala de Glasgow",
      key: "escala_evaluacion_resultados_glasgow",
    },
    {
      label: "Estado de egreso",
      key: "estado_egreso",
      format: (value) => (value ? "Favorable" : "Desfavorable"),
    },
  ];

  // Configuración de las pestañas
  const tabs = [
    {
      label: "Información General",
      content: (
        <div className="space-y-6">
          {/* Información básica del registro operatorio */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Registro Operatorio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campos.map((campo) => (
                  <InfoField
                    key={campo.key}
                    label={campo.label}
                    value={
                      campo.format
                        ? campo.format(registroOperatorio[campo.key])
                        : registroOperatorio[campo.key]
                    }
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Observaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Observaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <p className="text-gray-800">
                  {registroOperatorio.observaciones || "No hay observaciones registradas"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      label: "Rasgos Clínicos Operatorios",
      content: (
        <RasgosClinicosOperatoriosPanel 
          registroOperatorioId={registroOperatorio.id}
          RasgosClinicos={registroOperatorio.rasgos_clinicos_operatorios || []}
        />
      ),
    },
    {
      label: "Registros Posoperatorios",
      content: (
        <RegistrosPosoperatoriosPanel 
          registroOperatorioId={registroOperatorio.id}
          RegistrosPosoperatorios={registroOperatorio.registros_posoperatorios}
        />
      ),
    },
  ];

  // Manejar cambio de pestaña
  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  return (
    <HistoriaClinicaLayout title="Detalle del Registro Operatorio">
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
            <CardTitle>Editar Registro Operatorio</CardTitle>
          </CardHeader>
          <CardContent>
            <RegistroOperatorioForm
              initialData={registroOperatorio}
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
            onTabChange={handleTabChange}
          />
        </div>
      )}
    </HistoriaClinicaLayout>
  );
}

export default RegistroOperatorioDetail;