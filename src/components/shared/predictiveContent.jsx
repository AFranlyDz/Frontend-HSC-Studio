import React from "react";

export default function predictiveContent(nombre, descripcion, recurrencia, egreso) {

  return (
    <>
      <div className="font-medium text-gray-800">{nombre}</div>
      <div className="text-sm text-gray-500">{descripcion}</div>
      <div className="text-sm text-gray-500">{recurrencia}</div>
      <div className="text-sm text-gray-500">{egreso}</div>
    </>
  );
}
