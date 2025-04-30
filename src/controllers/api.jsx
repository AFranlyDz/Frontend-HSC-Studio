// // services/api.js
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BACKEND;

export const fetchAllClinicalHistories = async () => {
  try {
    const response = await axios.get(`${apiUrl}gestionar_historia_clinica/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching clinical histories:", error);
    throw error;
  }
};