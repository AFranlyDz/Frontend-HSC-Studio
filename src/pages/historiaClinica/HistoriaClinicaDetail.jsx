import React from "react";
import { useSelector } from "react-redux";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

function HistoriaClinicaDetail() {
    const { datos } = useSelector((state) => state.historiaClinica);

    const formatValue = (key, value) => {
        if (key === "sexo") {
          return value === true ? "Masculino" : "Femenino"
        } else if (key === "manualidad") {
          return value === true ? "Derecha" : "Izquierda"
        } else if (typeof value === "boolean") {
          return value ? "Sí" : "No"
        } else {
          return value !== undefined ? String(value) : "N/A"
        }
      }

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
        { label: "Antecedentes familiares", key: "antecedentes_familiares" }
    ];

    return (
        <div className="flex flex-col min-h-screen w-full">
            <Header />
            <section className="pt-24 pb-6 md:pt-32 md:pb-8 bg-gradient-to-b from-gray-100 to-white w-full">
                <div className="container mx-auto px-4">
                    {/* Encabezado con nombre y apellidos */}
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                        Historia Clínica del Paciente {datos.nombre} {datos.apellidos}
                    </h1>
                    
                    {/* Contenedor de la información */}
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
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default HistoriaClinicaDetail;