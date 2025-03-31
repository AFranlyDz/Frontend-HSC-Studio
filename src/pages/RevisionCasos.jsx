import axios from "axios";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

function RevisionCasos() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const columns = [
    {
      name: "Número",
      selector: (row) => row.numero,
    },
    {
      name: "Seudónimo",
      selector: (row) => row.seudonimo,
    },
    {
      name: "Edad",
      selector: (row) => row.edad,
    },
    {
      name: "Sexo",
      selector: (row) => row.sexo,
    },
  ];

  const [data, setData] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const extraerDatos = async () => {
      try {
        const respuesta = await axios.get(
          `${apiUrl}gestionar_historia_clinica/`
        );
        setData(respuesta.data)
        //decodificar_historia_clinica(response.data)
      } catch (error) {
        console.error("Hubo un error al obtener los datos:", error);
        throw error; // Lanza el error para que pueda ser manejado en otros lugares
      }
    };
    extraerDatos();
    console.log(data);
  }, []);

  return (
    <>
      <Header />
      <div className="pt-28">
        Esta es la lista de historias clinicas
        <DataTable columns={columns} data={data} />
      </div>
      <Footer />
    </>
  );
}
export default RevisionCasos;
