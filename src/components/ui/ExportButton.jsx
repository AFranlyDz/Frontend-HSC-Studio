"use client";

import React, { useState, useCallback } from "react";
import Button from "@mui/material/Button";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Modal } from "@/components/ui/modal";
import ColumnSelector from "@/features/exportaciones/ColumnSelector";
import { fetchAllClinicalHistories } from "@/controllers/api";
import { useSnackbar } from "notistack";

export const ExportButton = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchAllClinicalHistories();
      setData(response);
    } catch (error) {
      console.error("Error loading data:", error);
      enqueueSnackbar("Error cargando datos", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [enqueueSnackbar]);

  const handleExport = useCallback(async () => {
    setIsModalOpen(true);
    if (data.length === 0) {
      await loadData();
    }
  }, [data.length, loadData]);

  const filterItemBySelectedColumns = useCallback((item, columns) => {
    const result = {};

    Object.keys(columns).forEach((path) => {
      if (columns[path] === true || columns[path]?._selected === true) {
        const keys = path.split(".");
        let current = item;
        let valid = true;

        // Manejo seguro de propiedades anidadas
        for (let i = 0; i < keys.length && current !== undefined; i++) {
          if (current === null || !current.hasOwnProperty(keys[i])) {
            valid = false;
            break;
          }
          current = current[keys[i]];
        }

        if (valid && current !== undefined) {
          // Formatear valores especiales
          let formattedValue;
          if (current === null) {
            formattedValue = "NULL";
          } else if (typeof current === "boolean") {
            formattedValue = current ? "SI" : "NO";
          } else if (current instanceof Date) {
            formattedValue = current.toISOString();
          } else if (Array.isArray(current)) {
            formattedValue = JSON.stringify(current);
          } else {
            formattedValue = current;
          }

          result[path] = formattedValue;
        }
      }
    });

    return result;
  }, []);

  const convertToCSV = useCallback((data) => {
    if (!data || data.length === 0) return "";

    const headers = Object.keys(data[0]);
    let csv = headers.join(",") + "\n";

    data.forEach((row) => {
      const values = headers.map((header) => {
        const value = row[header];
        if (value === undefined || value === null) {
          return "";
        }

        // Escapar valores para CSV
        const stringValue = typeof value === "string" ? value : String(value);
        if (
          stringValue.includes('"') ||
          stringValue.includes(",") ||
          stringValue.includes("\n")
        ) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
      csv += values.join(",") + "\n";
    });

    return csv;
  }, []);

  const downloadCSVFile = useCallback(
    (content, filename) => {
      try {
        const blob = new Blob(["\uFEFF" + content], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `${filename}_${new Date().toISOString().split("T")[0]}.csv`
        );
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
      } catch (error) {
        console.error("Error downloading file:", error);
        enqueueSnackbar("Error generando archivo CSV", { variant: "error" });
      }
    },
    [enqueueSnackbar]
  );

  const handleConfirmExport = useCallback(() => {
    if (Object.keys(selectedColumns).length === 0) {
      enqueueSnackbar("Selecciona al menos una columna", {
        variant: "warning",
      });
      return;
    }

    try {
      const filteredData = data.map((item) =>
        filterItemBySelectedColumns(item, selectedColumns)
      );
      const csvContent = convertToCSV(filteredData);
      downloadCSVFile(csvContent, "base_conocimiento");
      setIsModalOpen(false);
      enqueueSnackbar("Exportación completada", { variant: "success" });
    } catch (error) {
      console.error("Export error:", error);
      enqueueSnackbar("Error en la exportación", { variant: "error" });
    }
  }, [
    data,
    selectedColumns,
    filterItemBySelectedColumns,
    convertToCSV,
    downloadCSVFile,
    enqueueSnackbar,
  ]);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<FileDownloadIcon />}
        onClick={handleExport}
        disabled={isLoading}
        sx={{
          textTransform: "none",
          fontWeight: 500,
          borderRadius: "8px",
          padding: "8px 16px",
        }}
      >
        {isLoading ? "Cargando..." : "Exportar base de conocimiento como CSV"}
      </Button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Seleccionar columnas para exportar"
        size="lg"
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p>Cargando estructura de datos...</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Selecciona las columnas que deseas incluir en el archivo CSV.
                Puedes expandir las secciones para seleccionar campos
                específicos.
              </p>
            </div>

            <ColumnSelector
              data={data}
              onSelectionChange={setSelectedColumns}
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmExport}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Exportar CSV
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};
