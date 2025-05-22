"use client";

import React, { useState, useCallback } from "react";
import {CircularProgress} from "@mui/material";
import Button from "@mui/material/Button";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import axios from "axios";
import { Modal } from "@/components/ui/modal";
import ExportFieldsSelector from "@/features/exportaciones/ExportFieldsSelector";

export const ExportKBButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_BACKEND;

  const handleExportClick = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}export-kb-csv/`,
        {
          fields: [
            'historia_clinica.id',
            "historia_clinica.numero",
            "historia_clinica.nombre",
            "historia_clinica.apellidos",
            "historia_clinica.edad",
            "historia_clinica.sexo",
            "historia_clinica.historial_trauma_craneal",
            "codificador.nombre",
            "hematoma.escala_glasgow_ingreso",
            "hematoma.escala_mcwalder",
            "hematoma.escala_gordon_firing",
            "hematoma.escala_nomura",
            "hematoma.escala_nakagushi",
            "hematoma.volumen_tada",
            "hematoma.diametro_capa",
            "hematoma.desviacion_linea_media",
            "hematoma.diametro_mayor_transverso",
            "hematoma.presencia_membrana",
            "registro_operatorio.escala_evaluacion_resultados_glasgow",
            "registro_operatorio.es_reintervencion",
            "registro_operatorio.estado_egreso",
            "hematoma.localización",
          ],
        },
        { responseType: "blob" } // Importante para manejar la descarga del archivo
      );

      // Crear el enlace de descarga
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "exportacion.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      console.error("Error al exportar CSV:", error);
      alert("Error al exportar el archivo CSV");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<FileDownloadIcon />}
        onClick={handleExportClick}
        sx={{
          textTransform: "none",
          fontWeight: 500,
          borderRadius: "8px",
          padding: "8px 16px",
        }}
      >
        {isLoading ? (
          <CircularProgress size={24} />
        ) : (
          "Exportar Base de Conocimiento como CSV"
        )}
      </Button>
    </>
  );
};