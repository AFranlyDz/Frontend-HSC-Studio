"use client";
import React, { useState, useCallback } from "react";
import { Button, Checkbox, FormControlLabel, FormGroup, Collapse, IconButton } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

const ExportFieldsSelector = ({ onClose }) => {
  const [selectedFields, setSelectedFields] = useState(new Set());
  const [expandedGroups, setExpandedGroups] = useState({});

  // Definición de grupos de campos basados en los modelos
  const fieldGroups = {
    "Historia Clínica": [
      "numero",
      "seudonimo",
      "nombre",
      "apellidos",
      "edad",
      "sexo",
      "historial_trauma_craneal",
      "manualidad",
      "antecedentes_familiares"
    ],
    "Rasgos Clínicos Globales": [
      "codificador.nombre",
      "codificador.nombre_corto",
      "codificador.descripcion",
      "codificador.clasificacion",
      "notas"
    ],
    "Episodio": [
      "inicio",
      "fecha_alta",
      "tiempo_estadia",
      "estado_al_egreso",
      "tiempo_antecedente",
      "descripcion_antecedente",
      "edad_paciente",
      "observaciones"
    ],
    "Rasgos Clínicos del Episodio": [
      "codificador.nombre",
      "codificador.nombre_corto",
      "codificador.descripcion",
      "codificador.clasificacion",
      "tiempo",
      "notas"
    ],
    "Registro Operatorio": [
      "fecha_operacion",
      "es_reintervencion",
      "escala_evaluacion_resultados_glasgow",
      "estado_egreso",
      "observaciones"
    ],
    "Registro Posoperatorio": [
      "fecha",
      "tiempo_transcurrido",
      "escala_pronostica_oslo_posoperatoria",
      "recurrencia_hematoma",
      "gradacion_pronostica_para_recurrencia_hsc_unilateral"
    ],
    "Hematoma Subdural": [
      "escala_glasgow_ingreso",
      "escala_mcwalder",
      "escala_gordon_firing",
      "escala_pronostica_oslo_preoperatoria",
      "escala_nomura",
      "escala_nakagushi",
      "valor_longitud",
      "valor_diametro",
      "valor_altura",
      "volumen_tada",
      "volumen",
      "grupo_volumen",
      "grupo_volumen_residual_posoperatorio",
      "diametro_capa",
      "diametro_mayor_transverso",
      "grupo_diametro",
      "presencia_membrana",
      "tipo_membrana",
      "localización",
      "topografia",
      "desviacion_linea_media",
      "metodo_lectura",
      "observaciones"
    ],
    "Rasgos Clínicos Operatorios": [
      "codificador.nombre",
      "codificador.nombre_corto",
      "codificador.descripcion",
      "codificador.clasificacion"
    ]
  };

  // Manejar cambio de selección
  const handleToggle = useCallback((field) => {
    setSelectedFields(prev => {
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
  const toggleGroup = useCallback((groupName, select) => {
    setSelectedFields(prev => {
      const newSelection = new Set(prev);
      fieldGroups[groupName].forEach(field => {
        if (select) {
          newSelection.add(field);
        } else {
          newSelection.delete(field);
        }
      });
      return newSelection;
    });
  }, [fieldGroups]);

  // Seleccionar/deseleccionar todos los campos
  const toggleAllFields = useCallback((select) => {
    setSelectedFields(prev => {
      const newSelection = new Set();
      if (select) {
        Object.values(fieldGroups).forEach(group => {
          group.forEach(field => newSelection.add(field));
        });
      }
      return newSelection;
    });
  }, [fieldGroups]);

  // Renderizar grupo de campos
  const renderGroup = (groupName) => {
    const isExpanded = expandedGroups[groupName] !== false;
    const allSelected = fieldGroups[groupName].every(f => selectedFields.has(f));
    const someSelected = fieldGroups[groupName].some(f => selectedFields.has(f));

    return (
      <div key={groupName} className="mb-2 text-gray-800">
        <div className="flex items-center bg-gray-50 p-2 rounded text-gray-800">
          <IconButton
            size="small"
            onClick={() => setExpandedGroups(p => ({ ...p, [groupName]: !isExpanded }))}
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
              {fieldGroups[groupName].map(field => (
                <FormControlLabel
                  key={field}
                  control={
                    <Checkbox
                      checked={selectedFields.has(field)}
                      onChange={() => handleToggle(field)}
                      size="small"
                    />
                  }
                  label={field}
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
            sx={{ textTransform: 'none' }}
          >
            Seleccionar todo
          </Button>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => toggleAllFields(false)}
            sx={{ textTransform: 'none' }}
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
          sx={{ textTransform: 'none' }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={selectedFields.size === 0}
          onClick={() => {
            console.log([...selectedFields]);
            onClose();
          }}
          size="small"
          sx={{ textTransform: 'none' }}
        >
          Exportar selección
        </Button>
      </div>
    </div>
  );
};

export default ExportFieldsSelector;