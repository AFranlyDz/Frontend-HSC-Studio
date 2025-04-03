import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  datos: [], // Objeto inicial vacío o con estructura predefinida
};

export const codificadoresSlice = createSlice({
  name: "codificador",
  initialState,
  reducers: {
    setCodificadores: (state, action) => {
      state.datos = action.payload;
    },
    resetCodificadores: (state) => {
      state.datos = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCodificadores, resetCodificadores } =
  codificadoresSlice.actions;

export default codificadoresSlice.reducer;
