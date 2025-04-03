"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setHistoriaClinica } from "@/features/gestionarHistoriaClinica/historiaClinicaSlice"
import axios from "axios"

export const EditarRasgosClinicosForm = ({ onCancel }) => {
  const dispatch = useDispatch()
  const { datos: paciente } = useSelector((state) => state.historiaClinica)
  const { datos: codificadores } = useSelector((state) => state.codificador)
  const [loading, setLoading] = useState(false)
  const [rasgosSeleccionados, setRasgosSeleccionados] = useState({})
  const [notas, setNotas] = useState({})
  const [estadoInicial, setEstadoInicial] = useState({
    rasgos: {},
    notas: {},
    asociaciones: {},
  })
  const apiUrl = import.meta.env.VITE_API_BACKEND

  // Clasificaciones que nos interesan
  const clasificaciones = [
    "Factor Predisponente",
    "Antecedente Neurológico",
    "Antecedente Patológico",
    "Factor de Riesgo",
    "Lesión Isquémica",
  ]

  // Inicializar el estado con los rasgos que ya tiene el paciente
  useEffect(() => {
    const rasgosIniciales = {}
    const notasIniciales = {}
    const asociacionesIniciales = {}

    if (paciente && paciente.rcg) {
      paciente.rcg.forEach((rasgo) => {
        const codificadorId = rasgo.codificador.id
        rasgosIniciales[codificadorId] = true
        notasIniciales[codificadorId] = rasgo.notas || ""
        asociacionesIniciales[codificadorId] = rasgo.id // Guardar el ID de la asociación
      })
    }

    setRasgosSeleccionados(rasgosIniciales)
    setNotas(notasIniciales)
    setEstadoInicial({
      rasgos: { ...rasgosIniciales },
      notas: { ...notasIniciales },
      asociaciones: { ...asociacionesIniciales },
    })
  }, [paciente])

  // Manejar cambio en checkbox
  const handleCheckboxChange = (codificadorId) => {
    setRasgosSeleccionados((prev) => {
      const nuevoEstado = { ...prev }
      nuevoEstado[codificadorId] = !prev[codificadorId]
      return nuevoEstado
    })

    // Si se desmarca, limpiar las notas
    if (rasgosSeleccionados[codificadorId]) {
      setNotas((prev) => {
        const nuevasNotas = { ...prev }
        nuevasNotas[codificadorId] = ""
        return nuevasNotas
      })
    }
  }

  // Manejar cambio en notas
  const handleNotasChange = (codificadorId, valor) => {
    setNotas((prev) => ({
      ...prev,
      [codificadorId]: valor,
    }))
  }

  // Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const promesas = []

      // 1. Procesar eliminaciones (DELETE)
      Object.keys(estadoInicial.rasgos).forEach((codificadorId) => {
        if (estadoInicial.rasgos[codificadorId] && !rasgosSeleccionados[codificadorId]) {
          // Estaba marcado y ahora está desmarcado -> DELETE
          const asociacionId = estadoInicial.asociaciones[codificadorId]
          if (asociacionId) {
            promesas.push(
              axios
                .delete(`${apiUrl}rasgos_clinicos_globales/${asociacionId}/`)
                .then(() => console.log(`Eliminado rasgo clínico con ID ${asociacionId}`))
                .catch((error) => {
                  console.error(`Error al eliminar rasgo clínico con ID ${asociacionId}:`, error)
                  throw error
                }),
            )
          }
        }
      })

      // 2. Procesar adiciones (POST)
      Object.keys(rasgosSeleccionados).forEach((codificadorId) => {
        if (rasgosSeleccionados[codificadorId] && !estadoInicial.rasgos[codificadorId]) {
          // No estaba marcado y ahora está marcado -> POST
          promesas.push(
            axios
              .post(`${apiUrl}rasgos_clinicos_globales/`, {
                historia_clinica: paciente.id,
                codificador: Number.parseInt(codificadorId),
                notas: notas[codificadorId] || "",
              })
              .then((response) => console.log(`Añadido nuevo rasgo clínico:`, response.data))
              .catch((error) => {
                console.error(`Error al añadir nuevo rasgo clínico:`, error)
                throw error
              }),
          )
        }
      })

      // 3. Procesar actualizaciones (PUT)
      Object.keys(rasgosSeleccionados).forEach((codificadorId) => {
        if (rasgosSeleccionados[codificadorId] && estadoInicial.rasgos[codificadorId]) {
          // Estaba marcado y sigue marcado, verificar si cambió la nota
          if (notas[codificadorId] !== estadoInicial.notas[codificadorId]) {
            const asociacionId = estadoInicial.asociaciones[codificadorId]
            if (asociacionId) {
              promesas.push(
                axios
                  .put(`${apiUrl}rasgos_clinicos_globales/${asociacionId}/`, {
                    historia_clinica: paciente.id,
                    codificador: Number.parseInt(codificadorId),
                    notas: notas[codificadorId] || "",
                  })
                  .then((response) =>
                    console.log(`Actualizada nota del rasgo clínico con ID ${asociacionId}:`, response.data),
                  )
                  .catch((error) => {
                    console.error(`Error al actualizar nota del rasgo clínico con ID ${asociacionId}:`, error)
                    throw error
                  }),
              )
            }
          }
        }
      })

      // Esperar a que todas las operaciones terminen
      await Promise.all(promesas)

      // Obtener los datos actualizados de la historia clínica
      const response = await axios.get(`${apiUrl}gestionar_historia_clinica/${paciente.id}/`)

      // Actualizar en Redux
      dispatch(setHistoriaClinica(response.data))

      // Mostrar mensaje de éxito
      alert("Rasgos clínicos actualizados correctamente")

      // Cancelar modo edición
      onCancel()
    } catch (error) {
      console.error("Error al actualizar los rasgos clínicos:", error)
      alert("Error al actualizar los rasgos clínicos. Por favor, intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  // Agrupar codificadores por clasificación
  const codificadoresPorClasificacion = {}
  clasificaciones.forEach((clasificacion) => {
    codificadoresPorClasificacion[clasificacion] = codificadores.filter((c) => c.clasificacion === clasificacion)
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Editar Rasgos Clínicos Globales</h3>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Guardando...
              </>
            ) : (
              "Guardar Cambios"
            )}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {clasificaciones.map((clasificacion) => (
          <div key={clasificacion} className="border-b pb-6 last:border-b-0">
            <h4 className="text-md font-semibold text-gray-700 mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              {clasificacion}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {codificadoresPorClasificacion[clasificacion].length > 0 ? (
                codificadoresPorClasificacion[clasificacion].map((codificador) => (
                  <div
                    key={codificador.id}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start mb-3">
                      <input
                        type="checkbox"
                        id={`codificador-${codificador.id}`}
                        checked={!!rasgosSeleccionados[codificador.id]}
                        onChange={() => handleCheckboxChange(codificador.id)}
                        className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor={`codificador-${codificador.id}`} className="ml-2 block">
                        <div className="font-medium text-gray-800">{codificador.nombre}</div>
                        <div className="text-sm text-gray-500">{codificador.descripcion}</div>
                      </label>
                    </div>

                    {rasgosSeleccionados[codificador.id] && (
                      <div className="mt-2">
                        <label
                          htmlFor={`notas-${codificador.id}`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Notas:
                        </label>
                        <textarea
                          id={`notas-${codificador.id}`}
                          value={notas[codificador.id] || ""}
                          onChange={(e) => handleNotasChange(codificador.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 bg-white"
                          rows="2"
                          placeholder="Agregar notas sobre este rasgo clínico..."
                        />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-4 text-gray-500">
                  No hay codificadores registrados para esta clasificación
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </form>
  )
}

