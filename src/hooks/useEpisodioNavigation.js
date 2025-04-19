import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

/**
 * Hook personalizado para manejar la navegación entre episodios
 * Proporciona métodos consistentes para almacenar y recuperar datos de episodios
 */
export function useEpisodioNavigation() {
  const navigate = useNavigate()
  const { datos: paciente } = useSelector((state) => state.historiaClinica)

  /**
   * Navegar a un episodio específico
   * @param {Object} episodio - El episodio al que navegar
   */
  const navigateToEpisodio = (episodio) => {
    // Almacenar episodio y datos del paciente en sessionStorage
    sessionStorage.setItem("selectedEpisodio", JSON.stringify(episodio))
    sessionStorage.setItem("selectedPaciente", JSON.stringify(paciente))

    // Añadir timestamp para forzar recarga al navegar entre episodios
    const timestamp = new Date().getTime()
    navigate(`/Revision_casos/HistoriaClinica/Episodio?t=${timestamp}`)
  }

  /**
   * Obtener el episodio seleccionado actualmente desde sessionStorage
   * @returns {Object|null} El episodio seleccionado o null si no hay ninguno seleccionado
   */
  const getSelectedEpisodio = () => {
    const storedEpisodio = sessionStorage.getItem("selectedEpisodio")
    return storedEpisodio ? JSON.parse(storedEpisodio) : null
  }

  /**
   * Obtener los datos del paciente desde sessionStorage
   * @returns {Object|null} Los datos del paciente o null si no hay ninguno disponible
   */
  const getStoredPaciente = () => {
    const storedPaciente = sessionStorage.getItem("selectedPaciente")
    return storedPaciente ? JSON.parse(storedPaciente) : null
  }

  /**
   * Actualizar los datos del episodio almacenados
   * @param {Object} updatedEpisodio - Los datos actualizados del episodio
   */
  const updateStoredEpisodio = (updatedEpisodio) => {
    sessionStorage.setItem("selectedEpisodio", JSON.stringify(updatedEpisodio))
  }

  /**
   * Actualizar los datos del paciente almacenados
   * @param {Object} updatedPaciente - Los datos actualizados del paciente
   */
  const updateStoredPaciente = (updatedPaciente) => {
    sessionStorage.setItem("selectedPaciente", JSON.stringify(updatedPaciente))
  }

  return {
    navigateToEpisodio,
    getSelectedEpisodio,
    getStoredPaciente,
    updateStoredEpisodio,
    updateStoredPaciente,
  }
}
