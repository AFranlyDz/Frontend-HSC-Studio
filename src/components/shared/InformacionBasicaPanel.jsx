import { useSelector } from "react-redux";
import { InfoField } from "./InfoField";
import { useFormatValue } from "@/hooks/useFormatValue";

export const InformacionBasicaPanel = () => {
  const { datos } = useSelector((state) => state.historiaClinica);
  const { formatValue } = useFormatValue();

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
    { label: "Antecedentes familiares", key: "antecedentes_familiares" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {campos.map((campo) => (
          <InfoField
            key={campo.key}
            label={campo.label}
            value={formatValue(campo.key, datos[campo.key])}
          />
        ))}
      </div>
    </div>
  );
};
