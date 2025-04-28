"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormatValue } from "@/hooks/useFormatValue";
import { HistoriaClinicaLayout } from "@/components/layout/HistoriaClinicaLayout";
import { InfoField } from "@/components/shared/InfoField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setHistoriaClinica } from "@/features/gestionarHistoriaClinica/historiaClinicaSlice";
import { EpisodioForm } from "@/components/shared/EpisodioForm";
import { CustomTabs } from "@/components/shared/CustomTabs";
import { RasgosClinicosEpisodioPanel } from "@/features/gestionarEpisodio/RasgosClinicosEpisodioPanel";
import {RegistroOperatorioPanel} from "@/features/registroOperatorio/RegistroOperatorioPanel"
import { HematomasSubduralesPanel } from "@/features/hematoma/HematomasSubduralesPanel";

function EpisodioDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { formatValue } = useFormatValue();
  const [episodio, setEpisodio] = useState(null);
  const [paciente, setPaciente] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const apiUrl = import.meta.env.VITE_API_BACKEND;

  // Recuperar datos del episodio y paciente desde sessionStorage
  // Usar location.search como dependencia para forzar la actualización cuando cambia la URL
  useEffect(() => {
    const storedEpisodio = sessionStorage.getItem("selectedEpisodio");
    const storedPaciente = sessionStorage.getItem("selectedPaciente");

    if (storedEpisodio && storedPaciente) {
      setEpisodio(JSON.parse(storedEpisodio));
      setPaciente(JSON.parse(storedPaciente));

      // Actualizar el estado en Redux si es necesario
      dispatch(setHistoriaClinica(JSON.parse(storedPaciente)));
    }
  }, [dispatch, location.search]); // Añadir location.search como dependencia

  // Si no hay datos, mostrar mensaje
  if (!episodio || !paciente) {
    return (
      <HistoriaClinicaLayout title="Detalle del Episodio Clínico">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            No se encontraron datos del episodio
          </h2>
          <Button
            onClick={() =>
              navigate("/Revision_casos/HistoriaClinica?tab=episodios")
            }
            className="mt-4"
          >
            <ArrowLeft size={16} className="mr-2" /> Volver a Episodios
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
      // Asegurarse de que el ID de la historia clínica esté incluido
      const dataToSend = {
        ...formData,
        historia_clinica: paciente.id,
      };

      const response = await axios.put(
        `${apiUrl}episodios/${episodio.id}/`,
        dataToSend
      );

      // Actualizar el estado local
      setEpisodio(response.data);

      // Actualizar sessionStorage
      sessionStorage.setItem("selectedEpisodio", JSON.stringify(response.data));

      // Actualizar el estado en Redux
      const historiaResponse = await axios.get(
        `${apiUrl}gestionar_historia_clinica/${paciente.id}/`
      );
      dispatch(setHistoriaClinica(historiaResponse.data));

      // Actualizar sessionStorage con el paciente actualizado
      sessionStorage.setItem(
        "selectedPaciente",
        JSON.stringify(historiaResponse.data)
      );

      setEditing(false);
      alert("Episodio actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar el episodio");
    } finally {
      setLoading(false);
    }
  };

  // Campos a mostrar
  const campos = [
    {
      label: "Fecha de inicio",
      key: "inicio",
      format: (value) => (value ? new Date(value).toLocaleDateString() : "N/A"),
    },
    {
      label: "Fecha de alta",
      key: "fecha_alta",
      format: (value) => (value ? new Date(value).toLocaleDateString() : "N/A"),
    },
    { label: "Tiempo de estadía (días)", key: "tiempo_estadia" },
    {
      label: "Estado al egreso",
      key: "estado_al_egreso",
      format: (value) => (value ? "Favorable" : "Desfavorable"),
    },
    { label: "Tiempo de antecedente (días)", key: "tiempo_antecedente" },
    { label: "Edad del paciente", key: "edad_paciente" },
  ];

  // Configuración de las pestañas
  const tabs = [
    {
      label: "Información General",
      content: (
        <div className="space-y-6">
          {/* Información básica del episodio */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Episodio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campos.map((campo) => (
                  <InfoField
                    key={campo.key}
                    label={campo.label}
                    value={
                      campo.format
                        ? campo.format(episodio[campo.key])
                        : episodio[campo.key]
                    }
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Descripción y observaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Descripción y Observaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Descripción del antecedente
                  </h3>
                  <p className="mt-1 text-lg text-gray-800">
                    {episodio.descripcion_antecedente || "N/A"}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Observaciones
                  </h3>
                  <p className="mt-1 text-lg text-gray-800">
                    {episodio.observaciones || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      label: "Rasgos Clínicos",
      content: <RasgosClinicosEpisodioPanel episodio={episodio} />,
    },
    {
      label: "Registro Operatorio",
      content: <RegistroOperatorioPanel episodioId={episodio.id}/>,
    },
    {
      label: "Hematomas Subdurales",
      content: <HematomasSubduralesPanel episodioId={episodio.id} />,
    },
  ];

  // Manejar cambio de pestaña
  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  return (
    <HistoriaClinicaLayout title="Detalle del Episodio Clínico">
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={() =>
            navigate("/Revision_casos/HistoriaClinica?tab=episodios")
          }
          variant="outline"
        >
          <ArrowLeft size={16} className="mr-2" /> Volver a Episodios
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
            <CardTitle>Editar Episodio</CardTitle>
          </CardHeader>
          <CardContent>
            <EpisodioForm
              initialData={episodio}
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

export default EpisodioDetail;
