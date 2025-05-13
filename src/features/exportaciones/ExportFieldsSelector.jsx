"use client";
import React, { useState, useCallback } from "react";
import axios from "axios";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Collapse,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

const ExportFieldsSelector = ({ onClose }) => {
  const [selectedFields, setSelectedFields] = useState(new Set());
  const [expandedGroups, setExpandedGroups] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_BACKEND;

  // Definición de grupos de campos basados en los modelos
  const fieldDisplayNames = {
    // Historia Clínica
    "historia_clinica.numero": "Número de Historia Clínica",
    "historia_clinica.seudonimo": "Seudónimo del Paciente",
    "historia_clinica.nombre": "Nombre del Paciente",
    "historia_clinica.apellidos": "Apellidos del Paciente",
    "historia_clinica.edad": "Edad del Paciente",
    "historia_clinica.sexo": "Sexo del Paciente",
    "historia_clinica.historial_trauma_craneal": "Historial de Trauma Craneal",
    "historia_clinica.manualidad": "Manualidad (Diestro/Zurdo)",
    "historia_clinica.antecedentes_familiares": "Antecedentes Familiares",
    
    // Rasgos Clínicos Globales
    "rasgo_clinico_global.notas": "Notas de Rasgos Clínicos",
    
    // Episodio
    "episodio.inicio": "Fecha de Inicio del Episodio",
    "episodio.fecha_alta": "Fecha de Alta del Episodio",
    "episodio.tiempo_estadia": "Tiempo de Estadia (días)",
    "episodio.estado_al_egreso": "Estado al Egreso",
    "episodio.tiempo_antecedente": "Tiempo del Antecedente",
    "episodio.descripcion_antecedente": "Descripción del Antecedente",
    "episodio.edad_paciente": "Edad del Paciente en el Episodio",
    "episodio.observaciones": "Observaciones del Episodio",
    
    // Rasgos Clínicos del Episodio
    "rasgo_clinico_episodio.tiempo": "Tiempo de Rasgos Clínicos",
    "rasgo_clinico_episodio.notas": "Notas de Rasgos Clínicos",
    
    // Registro Operatorio
    "registro_operatorio.fecha_operacion": "Fecha de Operación",
    "registro_operatorio.es_reintervencion": "¿Es Reintervención?",
    "registro_operatorio.escala_evaluacion_resultados_glasgow": "Escala de Glasgow",
    "registro_operatorio.estado_egreso": "Estado al Egreso",
    "registro_operatorio.observaciones": "Observaciones Operatorias",
    
    // Registro Posoperatorio
    "registro_posoperatorio.fecha": "Fecha Posoperatoria",
    "registro_posoperatorio.tiempo_transcurrido": "Tiempo Transcurrido",
    "registro_posoperatorio.escala_pronostica_oslo_posoperatoria": "Escala Pronóstica Oslo",
    "registro_posoperatorio.recurrencia_hematoma": "Recurrencia de Hematoma",
    "registro_posoperatorio.gradacion_pronostica_para_recurrencia_hsc_unilateral": "Gradación de Recurrencia",
    
    // Hematoma Subdural
    "hematoma.escala_glasgow_ingreso": "Escala Glasgow al Ingreso",
    "hematoma.escala_mcwalder": "Escala McWalder",
    "hematoma.escala_gordon_firing": "Escala Gordon-Firing",
    "hematoma.escala_pronostica_oslo_preoperatoria": "Escala Oslo Preoperatoria",
    "hematoma.escala_nomura": "Escala Nomura",
    "hematoma.escala_nakagushi": "Escala Nakagushi",
    "hematoma.valor_longitud": "Longitud del Hematoma",
    "hematoma.valor_diametro": "Diámetro del Hematoma",
    "hematoma.valor_altura": "Altura del Hematoma",
    "hematoma.volumen_tada": "Volumen TADA",
    "hematoma.volumen": "Volumen del Hematoma",
    "hematoma.grupo_volumen": "Grupo de Volumen",
    "hematoma.grupo_volumen_residual_posoperatorio": "Volumen Residual Posoperatorio",
    "hematoma.diametro_capa": "Diámetro de Capa",
    "hematoma.diametro_mayor_transverso": "Diámetro Mayor Transverso",
    "hematoma.grupo_diametro": "Grupo de Diámetro",
    "hematoma.presencia_membrana": "Presencia de Membrana",
    "hematoma.tipo_membrana": "Tipo de Membrana",
    "hematoma.localización": "Localización del Hematoma",
    "hematoma.topografia": "Topografía del Hematoma",
    "hematoma.desviacion_linea_media": "Desviación de Línea Media",
    "hematoma.metodo_lectura": "Método de Lectura",
    "hematoma.observaciones": "Observaciones del Hematoma",
    
    // Codificadores
    "codificador.nombre": "Nombre del Codificador",
    "codificador.nombre_corto": "Nombre Corto",
    "codificador.descripcion": "Descripción",
    "codificador.clasificacion": "Clasificación"
  };

  const fieldGroups = {
    "Historia Clínica": [
      "historia_clinica.numero",
      "historia_clinica.seudonimo",
      "historia_clinica.nombre",
      "historia_clinica.apellidos",
      "historia_clinica.edad",
      "historia_clinica.sexo",
      "historia_clinica.historial_trauma_craneal",
      "historia_clinica.manualidad",
      "historia_clinica.antecedentes_familiares",
    ],
    "Rasgos Clínicos Globales": [
      "rasgo_clinico_global.notas",
    ],
    "Episodio": [
      "episodio.inicio",
      "episodio.fecha_alta",
      "episodio.tiempo_estadia",
      "episodio.estado_al_egreso",
      "episodio.tiempo_antecedente",
      "episodio.descripcion_antecedente",
      "episodio.edad_paciente",
      "episodio.observaciones",
    ],
    "Rasgos Clínicos del Episodio": [
      "rasgo_clinico_episodio.tiempo",
      "rasgo_clinico_episodio.notas",
    ],
    "Registro Operatorio": [
      "registro_operatorio.fecha_operacion",
      "registro_operatorio.es_reintervencion",
      "registro_operatorio.escala_evaluacion_resultados_glasgow",
      "registro_operatorio.estado_egreso",
      "registro_operatorio.observaciones",
    ],
    "Registro Posoperatorio": [
      "registro_posoperatorio.fecha",
      "registro_posoperatorio.tiempo_transcurrido",
      "registro_posoperatorio.escala_pronostica_oslo_posoperatoria",
      "registro_posoperatorio.recurrencia_hematoma",
      "registro_posoperatorio.gradacion_pronostica_para_recurrencia_hsc_unilateral",
    ],
    "Hematoma Subdural": [
      "hematoma.escala_glasgow_ingreso",
      "hematoma.escala_mcwalder",
      "hematoma.escala_gordon_firing",
      "hematoma.escala_pronostica_oslo_preoperatoria",
      "hematoma.escala_nomura",
      "hematoma.escala_nakagushi",
      "hematoma.valor_longitud",
      "hematoma.valor_diametro",
      "hematoma.valor_altura",
      "hematoma.volumen_tada",
      "hematoma.volumen",
      "hematoma.grupo_volumen",
      "hematoma.grupo_volumen_residual_posoperatorio",
      "hematoma.diametro_capa",
      "hematoma.diametro_mayor_transverso",
      "hematoma.grupo_diametro",
      "hematoma.presencia_membrana",
      "hematoma.tipo_membrana",
      "hematoma.localización",
      "hematoma.topografia",
      "hematoma.desviacion_linea_media",
      "hematoma.metodo_lectura",
      "hematoma.observaciones",
    ],
    "Rasgos Clínicos Operatorios": [
    ],
    "Codificadores": [
      "codificador.nombre",
      "codificador.nombre_corto",
      "codificador.descripcion",
      "codificador.clasificacion"
    ]
  };

  // Manejar cambio de selección
  const handleToggle = useCallback((field) => {
    setSelectedFields((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(field)) {
        newSelection.delete(field);
      } else {
        newSelection.add(field);
      }
      return newSelection;
    });
  }, []);

  // Seleccionar/deseleccionar todo un grupo
  const toggleGroup = useCallback(
    (groupName, select) => {
      setSelectedFields((prev) => {
        const newSelection = new Set(prev);
        fieldGroups[groupName].forEach((field) => {
          if (select) {
            newSelection.add(field);
          } else {
            newSelection.delete(field);
          }
        });
        return newSelection;
      });
    },
    [fieldGroups]
  );

  // Seleccionar/deseleccionar todos los campos
  const toggleAllFields = useCallback(
    (select) => {
      setSelectedFields((prev) => {
        const newSelection = new Set();
        if (select) {
          Object.values(fieldGroups).forEach((group) => {
            group.forEach((field) => newSelection.add(field));
          });
        }
        return newSelection;
      });
    },
    [fieldGroups]
  );

  const handleSubmit = async () => {
    if (selectedFields.size === 0) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}export-csv/`,
        { fields: [...selectedFields] },
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

      onClose();
    } catch (error) {
      console.error("Error al exportar CSV:", error);
      alert("Error al exportar el archivo CSV");
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar grupo de campos
  const renderGroup = (groupName) => {
    const isExpanded = expandedGroups[groupName] !== false;
    const allSelected = fieldGroups[groupName].every((f) =>
      selectedFields.has(f)
    );
    const someSelected = fieldGroups[groupName].some((f) =>
      selectedFields.has(f)
    );

    return (
      <div key={groupName} className="mb-2 text-gray-800">
        <div className="flex items-center bg-gray-50 p-2 rounded text-gray-800">
          <IconButton
            size="small"
            onClick={() =>
              setExpandedGroups((p) => ({ ...p, [groupName]: !isExpanded }))
            }
          >
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
          <FormControlLabel
            control={
              <Checkbox
                checked={allSelected}
                indeterminate={!allSelected && someSelected}
                onChange={(e) => toggleGroup(groupName, e.target.checked)}
              />
            }
            label={<span className="font-medium">{groupName}</span>}
            className="flex-grow ml-2"
          />
        </div>

        <Collapse in={isExpanded}>
          <div className="pl-10 pt-2">
            <FormGroup>
              {fieldGroups[groupName].map((field) => (
                <FormControlLabel
                  key={field}
                  control={
                    <Checkbox
                      checked={selectedFields.has(field)}
                      onChange={() => handleToggle(field)}
                      size="small"
                    />
                  }
                  label={fieldDisplayNames[field] || field}
                  className="ml-2"
                />
              ))}
            </FormGroup>
          </div>
        </Collapse>
      </div>
    );
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button
            variant="outlined"
            size="small"
            onClick={() => toggleAllFields(true)}
            sx={{ textTransform: "none" }}
          >
            Seleccionar todo
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => toggleAllFields(false)}
            sx={{ textTransform: "none" }}
          >
            Limpiar selección
          </Button>
        </div>
        <span className="text-sm text-gray-600">
          {selectedFields.size} campos seleccionados
        </span>
      </div>

      <div className="border rounded-lg p-4 max-h-[500px] overflow-y-auto">
        {Object.keys(fieldGroups).map(renderGroup)}
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <Button
          variant="outlined"
          onClick={onClose}
          size="small"
          sx={{ textTransform: "none" }}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={selectedFields.size === 0 || isLoading}
          onClick={handleSubmit}
          size="small"
          sx={{ textTransform: "none", minWidth: 120 }}
        >
          {isLoading ? <CircularProgress size={24} /> : "Exportar selección"}
        </Button>
      </div>
    </div>
  );
};

export default ExportFieldsSelector;
