"use client";

import React, { useState, useCallback } from "react";
import Button from "@mui/material/Button";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Modal } from "@/components/ui/modal";
import ExportFieldsSelector from "@/features/exportaciones/ExportFieldsSelector";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";

export const ExportButton = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { datos } = useSelector((state) => state.historiaClinica);

  const handleExportClick = useCallback(() => {
    if (!datos) {
      enqueueSnackbar("No hay datos disponibles para exportar", { variant: "warning" });
      return;
    }
    setIsModalOpen(true);
  }, [datos, enqueueSnackbar]);

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
        Exportar base de conocimiento como CSV
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Seleccionar columnas para exportar"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Selecciona los campos que deseas incluir en el archivo CSV.
          </p>
          
          <ExportFieldsSelector 
            data={datos} 
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </Modal>
    </>
  );
};