import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useSelector } from "react-redux";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import "react-tabs/style/react-tabs.css"; // Estilos básicos

function HistoriaClinicaDetail() {
  const { datos } = useSelector((state) => state.historiaClinica);

  const formatValue = (key, value) => {
    if (key === "sexo") {
      return value === true ? "Masculino" : "Femenino";
    } else if (key === "manualidad") {
      return value === true ? "Derecha" : "Izquierda";
    } else if (typeof value === "boolean") {
      return value ? "Sí" : "No";
    } else {
      return value !== undefined ? String(value) : "N/A";
    }
  };

  // Campos a mostrar (excluyendo el id)
  const campos = [
    { label: "Número", key: "numero" },
    { label: "Seudónimo", key: "seudonimo" },
    { label: "Nombre", key: "nombre" },
    { label: "Apellidos", key: "apellidos" },
    { label: "Edad", key: "edad" },
    { label: "Sexo", key: "sexo" },
    { label: "Historial de trauma craneal", key: "historial_trauma_craneal" },
    { label: "Manualidad", key: "manualidad" },
    { label: "Antecedentes familiares", key: "antecedentes_familiares" },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <section className="pt-24 pb-6 md:pt-32 md:pb-8 bg-gradient-to-b from-gray-100 to-white w-full">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Historia Clínica del Paciente {datos.nombre} {datos.apellidos}
          </h1>

          {/* Tabs mejorados con react-tabs */}
          <div className="react-tabs-custom">
            <Tabs>
              <TabList className="flex space-x-2 mb-6">
                <Tab
                  selectedClassName="bg-white border-t-2 border-blue-500 text-blue-600 font-medium"
                  className="px-4 py-2 text-gray-600 hover:text-blue-500 cursor-pointer border-b-2 border-transparent hover:border-gray-300 transition-all"
                >
                  Información Básica
                </Tab>
                <Tab
                  selectedClassName="bg-white border-t-2 border-blue-500 text-blue-600 font-medium"
                  className="px-4 py-2 text-gray-600 hover:text-blue-500 cursor-pointer border-b-2 border-transparent hover:border-gray-300 transition-all"
                >
                  Rasgos Clínicos Globales
                </Tab>
              </TabList>

              <TabPanel>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {campos.map((campo) => (
                      <div key={campo.key} className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                          {campo.label}
                        </h3>
                        <p className="mt-1 text-lg text-gray-800">
                          {formatValue(campo.key, datos[campo.key])}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabPanel>

              <TabPanel>
                <div className="bg-white rounded-lg shadow-md p-6">
                  {!datos.rcg || datos.rcg.length === 0 ? (
                    <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 text-lg">
                        No existen rasgos clínicos globales registrados
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {[
                        "Factor Predisponente",
                        "Antecedente Neurológico",
                        "Antecedente Patológico",
                        "Lesión Isquémica",
                        "Factor de Riesgo"
                      ].map((clasificacion) => {
                        const items = datos.rcg.filter(
                          (item) =>
                            item.codificador.clasificacion === clasificacion
                        );

                        return items.length > 0 ? (
                          <div
                            key={clasificacion}
                            className="border-b pb-6 last:border-b-0"
                          >
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                              {clasificacion}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {items.map((item, index) => (
                                <div
                                  key={index}
                                  className="bg-gray-50 p-4 rounded-lg"
                                >
                                  <div className="mb-2">
                                    {/* <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                      Nombre
                                    </h4> */}
                                    <p className="mt-1 text-gray-800">
                                      {item.codificador.nombre}
                                    </p>
                                  </div>

                                  {/* <div className="mb-2">
                                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                      Descripción
                                    </h4>
                                    <p className="mt-1 text-gray-800">
                                      {item.codificador.descripcion}
                                    </p>
                                  </div> */}
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                      Notas
                                    </h4>
                                    <p className="mt-1 text-gray-800">
                                      {item.notas || "N/A"}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default HistoriaClinicaDetail;
