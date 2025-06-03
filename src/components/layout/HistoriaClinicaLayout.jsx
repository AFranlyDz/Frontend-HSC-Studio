
"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { Sidebar } from "./Sidebar";
import { Toolbar } from "./ToolBar";
import { ExportButton } from "@/components/ui/ExportButton";
import PDFDownloadButton from "@/features/exportaciones/PDFDownloadButton"
import {ExportKBButton} from "@/components/ui/ExportKBButton.jsx";

export const HistoriaClinicaLayout = ({ children, title }) => {
  const { datos: paciente } = useSelector((state) => state.historiaClinica);
  const navigate = useNavigate();
  const [showFooter, setShowFooter] = useState(false);

  // Redirigir si no hay datos de paciente
  useEffect(() => {
    if (!paciente || !paciente.id) {
      navigate("/Revision_casos");
    }
  }, [paciente, navigate]);


  // Controlar la visibilidad del footer basado en el scroll
  useEffect(() => {
    const handleScroll = () => {
      // Mostrar el footer después de un pequeño scroll (50px)
      if (window.scrollY > 50) {
        setShowFooter(true);
      } else {
        setShowFooter(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calcular la altura del header para el padding-top
  const headerHeight = "64px";


  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      {/* Header ya está fijo en su propio componente */}
      <Header />

      {/* Contenedor principal que comienza debajo del header */}
      <div className="flex" style={{ paddingTop: headerHeight }}>
        {/* Sidebar fijo */}

        <div
          className="fixed left-0 h-[calc(100vh-64px)] w-64 overflow-y-auto z-30"
          style={{ top: headerHeight }}
        >

          <Sidebar />
        </div>

        {/* Contenido principal con margen izquierdo para dejar espacio al sidebar */}
        <main className="flex-grow ml-64 flex flex-col min-h-screen">
          <section className="py-8 bg-gradient-to-b from-gray-100 to-white w-full flex-grow">

            <Toolbar className="">
              <ExportButton />
              <ExportKBButton/>
              <PDFDownloadButton/>
            </Toolbar>
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    {title}
                  </h1>

                  {paciente && paciente.id && (
                    <div className="flex items-center text-lg text-blue-600 font-medium">
                      <span>
                        {paciente.nombre} {paciente.apellidos}
                      </span>
                      <span className="mx-2">•</span>

                      <span className="text-gray-500 text-base">
                        ID: {paciente.numero || "N/A"}
                      </span>

                    </div>
                  )}
                </div>

                {/* Contenido principal con espacio adicional en la parte inferior */}
                <div className="pb-32">{children}</div>
              </div>
            </div>
          </section>

          {/* Footer que aparece después de un pequeño scroll */}

        </main>
      </div>
      {showFooter && (
        <div className="w-full z-50">
          <Footer />
        </div>
      )}
    </div>
  );
};

