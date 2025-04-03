import React from "react";
import { useSelector } from "react-redux";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { CustomTabs } from "@/components/shared/CustomTabs";
import { InformacionBasicaPanel } from "@/components/shared/InformacionBasicaPanel";
import { RasgosClinicosPanel } from "@/components/shared/RasgosClinicosPanel";

function HistoriaClinicaDetail() {
  const { datos } = useSelector((state) => state.historiaClinica);

  // Configuración de las pestañas
  const tabs = [
    {
      label: "Información Básica",
      content: <InformacionBasicaPanel />,
    },
    {
      label: "Rasgos Clínicos Globales",
      content: <RasgosClinicosPanel />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section className="pt-24 pb-6 md:pt-32 md:pb-8 bg-gradient-to-b from-gray-100 to-white w-full">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Historia Clínica del Paciente
            </h1>
            <div className="flex items-center text-lg text-blue-600 font-medium">
              <span>{datos.nombre} {datos.apellidos}</span>
              <span className="mx-2">•</span>
              <span className="text-gray-500 text-base">
                ID: {datos.numero || "N/A"}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-1">
            <CustomTabs tabs={tabs} />
          </div>
        </div>
      </section>
      <div className="flex-grow"></div>
      <Footer />
    </div>
  );
}

export default HistoriaClinicaDetail;
