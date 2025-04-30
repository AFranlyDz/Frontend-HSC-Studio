// components/Export/ColumnSelector.jsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Checkbox, FormControlLabel, Collapse, Box } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

const ColumnSelector = ({ data, onSelectionChange }) => {
  const [selectedColumns, setSelectedColumns] = useState({});

  const buildSelectionTree = useCallback((obj, selectionTree, path = "") => {
    if (!obj) return;
    
    Object.keys(obj).forEach(key => {
      const currentPath = path ? `${path}.${key}` : key;
      const value = obj[key];
      
      if (value === null || value === undefined) {
        selectionTree[currentPath] = true;
      } 
      else if (typeof value === "object") {
        if (Array.isArray(value)) {
          // Manejar arrays (vacíos o con elementos)
          selectionTree[currentPath] = { _selected: true };
          if (value.length > 0 && typeof value[0] === "object") {
            buildSelectionTree(value[0], selectionTree, currentPath);
          }
        } else {
          // Objeto anidado
          selectionTree[currentPath] = { _selected: true };
          buildSelectionTree(value, selectionTree, currentPath);
        }
      } else {
        // Valor primitivo
        selectionTree[currentPath] = true;
      }
    });
  }, []);

  const handleToggle = (path, isSelected) => {
    const newSelection = { ...selectedColumns };
    
    // Actualizar el nodo principal
    if (path.includes('.')) {
      const parentPath = path.split('.').slice(0, -1).join('.');
      if (!newSelection[parentPath]) {
        newSelection[parentPath] = { _selected: isSelected };
      } else {
        newSelection[parentPath]._selected = isSelected;
      }
    } else {
      newSelection[path] = isSelected;
    }
    
    // Actualizar todos los hijos recursivamente
    const updateChildren = (currentPath) => {
      Object.keys(newSelection).forEach(key => {
        if (key.startsWith(`${currentPath}.`)) {
          if (key.includes('.', currentPath.length + 1)) {
            // Es un objeto anidado
            if (newSelection[key]._selected !== undefined) {
              newSelection[key]._selected = isSelected;
            }
          } else {
            // Es un campo primitivo
            newSelection[key] = isSelected;
          }
        }
      });
    };
    
    updateChildren(path);
    setSelectedColumns(newSelection);
    onSelectionChange(newSelection);
  };

  const renderTree = (obj, path = "") => {
    return Object.keys(obj).map(key => {
      const currentPath = path ? `${path}.${key}` : key;
      const value = obj[key];
      
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        // Objeto anidado
        return (
          <Box key={currentPath} pl={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedColumns[currentPath]?._selected ?? false}
                  onChange={(e) => handleToggle(currentPath, e.target.checked)}
                  sx={{
                    color: 'black', // Color negro para el checkbox
                    '&.Mui-checked': {
                      color: 'black', // Color negro cuando está seleccionado
                    },
                  }}
                  />}
              label={<span style={{ color: 'black' }}>{key}</span>} // Texto negro
              sx={{ color: 'black' }} // Estilo general negro
            />
            <Collapse in={selectedColumns[currentPath]?._selected ?? false}>
              {renderTree(value, currentPath)}
            </Collapse>
          </Box>
        );
      } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
        // Array de objetos
        return (
          <Box key={currentPath} pl={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedColumns[currentPath]?._selected ?? false}
                  onChange={(e) => handleToggle(currentPath, e.target.checked)}
                  sx={{
                    color: 'black',
                    '&.Mui-checked': {
                      color: 'black',
                    },
                  }}
              />}
              label={<span style={{ color: 'black' }}>{`${key} (array)`}</span>}
              sx={{ color: 'black' }}
            />
            <Collapse in={selectedColumns[currentPath]?._selected ?? false}>
              {renderTree(value[0], currentPath)}
            </Collapse>
          </Box>
        );
      } else {
        // Valor primitivo
        return (
          <Box key={currentPath} pl={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedColumns[currentPath] ?? false}
                  onChange={(e) => handleToggle(currentPath, e.target.checked)}
                  sx={{
                    color: 'black',
                    '&.Mui-checked': {
                      color: 'black',
                    },
                  }}
                  />}
              label={<span style={{ color: 'black' }}>{key}</span>}
              sx={{ color: 'black' }}
            />
          </Box>
        );
      }
    });
  };

  return (
    <Box sx={{ 
      maxHeight: "60vh", 
      overflowY: "auto",
      color: 'black', // Color negro para todo el contenedor
      '& .MuiFormControlLabel-label': {
        color: 'black !important', // Fuerza color negro en las etiquetas
      }
    }}>
      {data && data.length > 0 && renderTree(data[0])}
    </Box>
  );
};

export default ColumnSelector;