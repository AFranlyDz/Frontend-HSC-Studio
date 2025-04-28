"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function HematomaSubduralForm({ initialData, onSubmit, isLoading, onCancel }) {
  const [formData, setFormData] = useState({
    escala_glasgow_ingreso: 15,
    escala_mcwalder: 1,
    escala_gordon_firing: 1,
    escala_pronostica_oslo_preoperatoria: 1,
    escala_nomura: 1,
    escala_nakagushi: 1,
    valor_longitud: 0,
    valor_diametro: 0,
    valor_altura: 0,
    volumen_tada: 0,
    volumen: 0,
    grupo_volumen: 1,
    grupo_volumen_residual_posoperatorio: 1,
    diametro_capa: 0,
    diametro_mayor_transverso: 0,
    grupo_diametro: 1,
    presencia_membrana: false,
    tipo_membrana: 1,
    localización: "",
    topografia: "",
    desviacion_linea_media: 0,
    metodo_lectura: false,
    observaciones: "",
  });

  // Actualizar el formulario si cambian los datos iniciales
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
      });
    }
  }, [initialData]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Manejar diferentes tipos de inputs
    let newValue;
    if (type === "checkbox") {
      newValue = checked;
    } else if (type === "number") {
      newValue = value ? Number(value) : 0;
    } else {
      newValue = value;
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  // Enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Escalas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Escala Glasgow al ingreso (3-15)</label>
          <input
            type="number"
            name="escala_glasgow_ingreso"
            value={formData.escala_glasgow_ingreso}
            onChange={handleChange}
            min="3"
            max="15"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Escala McWalder (1-4)</label>
          <input
            type="number"
            name="escala_mcwalder"
            value={formData.escala_mcwalder}
            onChange={handleChange}
            min="1"
            max="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Escala Gordon-Firing (1-4)</label>
          <input
            type="number"
            name="escala_gordon_firing"
            value={formData.escala_gordon_firing}
            onChange={handleChange}
            min="1"
            max="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Escala Pronóstica Oslo Preoperatoria (1-5)</label>
          <input
            type="number"
            name="escala_pronostica_oslo_preoperatoria"
            value={formData.escala_pronostica_oslo_preoperatoria}
            onChange={handleChange}
            min="1"
            max="5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Escala Nomura (1-5)</label>
          <input
            type="number"
            name="escala_nomura"
            value={formData.escala_nomura}
            onChange={handleChange}
            min="1"
            max="5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Escala Nakagushi (1-4)</label>
          <input
            type="number"
            name="escala_nakagushi"
            value={formData.escala_nakagushi}
            onChange={handleChange}
            min="1"
            max="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Medidas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Longitud (mm)</label>
          <input
            type="number"
            name="valor_longitud"
            value={formData.valor_longitud}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Diámetro (mm)</label>
          <input
            type="number"
            name="valor_diametro"
            value={formData.valor_diametro}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Altura (mm)</label>
          <input
            type="number"
            name="valor_altura"
            value={formData.valor_altura}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Volumen Tada (ml)</label>
          <input
            type="number"
            name="volumen_tada"
            value={formData.volumen_tada}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Volumen (ml)</label>
          <input
            type="number"
            name="volumen"
            value={formData.volumen}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Grupo Volumen (1-4)</label>
          <input
            type="number"
            name="grupo_volumen"
            value={formData.grupo_volumen}
            onChange={handleChange}
            min="1"
            max="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Grupo Volumen Residual Postoperatorio (1-4)</label>
          <input
            type="number"
            name="grupo_volumen_residual_posoperatorio"
            value={formData.grupo_volumen_residual_posoperatorio}
            onChange={handleChange}
            min="1"
            max="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Diámetro de la capa (mm)</label>
          <input
            type="number"
            name="diametro_capa"
            value={formData.diametro_capa}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Diámetro mayor transverso (mm)</label>
          <input
            type="number"
            name="diametro_mayor_transverso"
            value={formData.diametro_mayor_transverso}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Grupo Diámetro (1-4)</label>
          <input
            type="number"
            name="grupo_diametro"
            value={formData.grupo_diametro}
            onChange={handleChange}
            min="1"
            max="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Membrana */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="presencia_membrana"
            checked={formData.presencia_membrana}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Presencia de membrana
          </label>
        </div>

        {formData.presencia_membrana && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de membrana</label>
            <input
              type="number"
              name="tipo_membrana"
              value={formData.tipo_membrana}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Localización */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Localización</label>
          <input
            type="text"
            name="localización"
            value={formData.localización}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Topografía</label>
          <input
            type="text"
            name="topografia"
            value={formData.topografia}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Desviación línea media (mm)</label>
          <input
            type="number"
            name="desviacion_linea_media"
            value={formData.desviacion_linea_media}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="metodo_lectura"
            checked={formData.metodo_lectura}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Método de lectura
          </label>
        </div>
      </div>

      {/* Observaciones */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
        <textarea
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : initialData?.id ? "Actualizar" : "Guardar"}
        </Button>
      </div>
    </form>
  );
}