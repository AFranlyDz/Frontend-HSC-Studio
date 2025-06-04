"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setHistoriaClinica } from "@/features/gestionarHistoriaClinica/historiaClinicaSlice";
import axios from "axios";
import { CheckCircle, XCircle, Heart, AlertTriangle } from "lucide-react"

export const EditarRasgosClinicosOperatoriosForm = ({
  registroOperatorioId,
  rasgosClinicos,
  onCancel,
}) => {
  const dispatch = useDispatch();
  const { datos: paciente } = useSelector((state) => state.historiaClinica);
  const { datos: codificadores } = useSelector((state) => state.codificador);
  const [loading, setLoading] = useState(false);
  const [rasgosSeleccionados, setRasgosSeleccionados] = useState({});
  const [estadoInicial, setEstadoInicial] = useState({
    rasgos: {},
    asociaciones: {},
  });
  const [estadosEgreso, setEstadosEgreso] = useState([]);
  const [recurrencias, setRecurrencias] = useState([]);
  const apiUrl = import.meta.env.VITE_API_BACKEND;

  // Clasificaciones que nos interesan
  const clasificaciones = [
    "Tratamiento Quírurgico",
    "Complicaciones Médicas",
    "Complicaciones Cirugía",
  ];

  // Inicializar el estado con los rasgos que ya tiene el registro operatorio
  useEffect(() => {
    const rasgosIniciales = {};
    const asociacionesIniciales = {};

    if (rasgosClinicos && rasgosClinicos.length > 0) {
      rasgosClinicos.forEach((rasgo) => {
        const codificadorId = rasgo.codificador.id;
        rasgosIniciales[codificadorId] = true;
        asociacionesIniciales[codificadorId] = rasgo.id; // Guardar el ID de la asociación
      });
    }

    setRasgosSeleccionados(rasgosIniciales);
    setEstadoInicial({
      rasgos: { ...rasgosIniciales },
      asociaciones: { ...asociacionesIniciales },
    });
  }, [rasgosClinicos]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener estados de egreso
        const responseEgreso = await axios.post(
          `${apiUrl}probabilidad_egreso/`,
          { id: paciente.id },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setEstadosEgreso(responseEgreso.data["prediction"]);
        // Obtener recurrencias
        const responseRecurrencia = await axios.post(
          `${apiUrl}probabilidad_recurrencia/`,
          { id: paciente.id },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setRecurrencias(responseRecurrencia.data["prediction"]);
      } catch (error) {
        console.error("Error al cargar datos adicionales:", error);
      }
    };
    fetchData();
  }, [apiUrl]);

  // Manejar cambio en checkbox
  const handleCheckboxChange = (codificadorId) => {
    setRasgosSeleccionados((prev) => {
      const nuevoEstado = { ...prev };
      nuevoEstado[codificadorId] = !prev[codificadorId];
      return nuevoEstado;
    });
  };

  // Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const promesas = [];

      // 1. Procesar eliminaciones (DELETE)
      Object.keys(estadoInicial.rasgos).forEach((codificadorId) => {
        if (
          estadoInicial.rasgos[codificadorId] &&
          !rasgosSeleccionados[codificadorId]
        ) {
          // Estaba marcado y ahora está desmarcado -> DELETE
          const asociacionId = estadoInicial.asociaciones[codificadorId];
          if (asociacionId) {
            promesas.push(
              axios
                .delete(`${apiUrl}rasgos_clinicos_operatorios/${asociacionId}/`)
                .then(() =>
                  console.log(
                    `Eliminado rasgo clínico operatorio con ID ${asociacionId}`
                  )
                )
                .catch((error) => {
                  console.error(
                    `Error al eliminar rasgo clínico operatorio con ID ${asociacionId}:`,
                    error
                  );
                  throw error;
                })
            );
          }
        }
      });

      // 2. Procesar adiciones (POST)
      Object.keys(rasgosSeleccionados).forEach((codificadorId) => {
        if (
          rasgosSeleccionados[codificadorId] &&
          !estadoInicial.rasgos[codificadorId]
        ) {
          // No estaba marcado y ahora está marcado -> POST
          promesas.push(
            axios
              .post(`${apiUrl}rasgos_clinicos_operatorios/`, {
                registro_operatorio: registroOperatorioId,
                codificador: Number.parseInt(codificadorId),
              })
              .then((response) =>
                console.log(
                  `Añadido nuevo rasgo clínico operatorio:`,
                  response.data
                )
              )
              .catch((error) => {
                console.error(
                  `Error al añadir nuevo rasgo clínico operatorio:`,
                  error
                );
                throw error;
              })
          );
        }
      });

      // Esperar a que todas las operaciones terminen
      await Promise.all(promesas);

      // Obtener los datos actualizados de la historia clínica
      const response = await axios.get(
        `${apiUrl}gestionar_historia_clinica/${paciente.id}/`
      );

      // Actualizar en Redux
      dispatch(setHistoriaClinica(response.data));

      // Mostrar mensaje de éxito
      alert("Rasgos clínicos operatorios actualizados correctamente");

      // Cancelar modo edición
      onCancel();
    } catch (error) {
      console.error(
        "Error al actualizar los rasgos clínicos operatorios:",
        error
      );
      alert(
        "Error al actualizar los rasgos clínicos operatorios. Por favor, intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  // Agrupar codificadores por clasificación
  const codificadoresPorClasificacion = {};
  clasificaciones.forEach((clasificacion) => {
    codificadoresPorClasificacion[clasificacion] = codificadores.filter(
      (c) => c.clasificacion === clasificacion
    );
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Editar Rasgos Clínicos Operatorios
        </h3>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Guardando...
            </>
          ) : (
            "Guardar Cambios"
          )}
        </button>
      </div>

      <div className="space-y-8">
        {clasificaciones.map((clasificacion) => (
          <div key={clasificacion} className="border-b pb-6 last:border-b-0">
            <h4 className="text-md font-semibold text-gray-700 mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              {clasificacion}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {codificadoresPorClasificacion[clasificacion]?.length > 0 ? (
                codificadoresPorClasificacion[clasificacion].map(
                  (codificador, index) => (
                    <div
                      key={codificador.id}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id={`codificador-${codificador.id}`}
                          checked={!!rasgosSeleccionados[codificador.id]}
                          onChange={() => handleCheckboxChange(codificador.id)}
                          className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        {clasificacion === "Tratamiento Quírurgico" ? (
                          <label
                            htmlFor={`codificador-${codificador.id}`}
                            className="ml-2 block"
                          >
                            <div className="font-medium text-gray-800">
                              {codificador.nombre}
                            </div>
                            <div className="text-sm text-gray-500">
                              {codificador.descripcion}
                            </div>
                            {recurrencias[index] && (
                              <div className="text-sm text-gray-500">
                                ¿Tendrá de recurrencia?:{" "}
                                {recurrencias[index][0] === true ? "Sí" : "No"}
                              </div>
                            )}
                            {estadosEgreso[index] && (
                              <div className="text-sm text-gray-500">
                                Posible estado al egreso:{" "}
                                {estadosEgreso[index][0] === true ? "Vivo" : "Fallecido"}
                              </div>
                            )}
                          </label>
                        ) : (
                          <label
                            htmlFor={`codificador-${codificador.id}`}
                            className="ml-2 block"
                          >
                            <div className="font-medium text-gray-800">
                              {codificador.nombre}
                            </div>
                            <div className="text-sm text-gray-500">
                              {codificador.descripcion}
                            </div>
                          </label>
                        )}
                      </div>
                    </div>
                  )
                )
              ) : (
                <div className="col-span-2 text-center py-4 text-gray-500">
                  No hay codificadores registrados para esta clasificación
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </form>
  );
};
