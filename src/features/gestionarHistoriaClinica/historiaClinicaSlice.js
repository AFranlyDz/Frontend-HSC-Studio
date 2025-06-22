import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  datos: null, // Objeto inicial vacío o con estructura predefinida
  loading: false,
  error: null,
};

export const historiaClinicaSlice = createSlice({
  name: "historiaClinica",
  initialState,
  reducers: {
    setHistoriaClinica: (state, action) => {
      state.datos = action.payload;
    },
    resetHistoriaClinica: (state) => {
      state.datos = null;
    },
    forceUpdate: (state) => {
      state.datos = {...state.datos}; // Crear nueva referencia
    }
  },
});

// Action creators are generated for each case reducer function
export const { setHistoriaClinica, resetHistoriaClinica, forceUpdate } =
  historiaClinicaSlice.actions;

export default historiaClinicaSlice.reducer;
