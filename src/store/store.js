import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import historiaClinicaReducer from "@/features/gestionarHistoriaClinica/historiaClinicaSlice";
import codificadorReducer from "@/features/codificadores/codificadoresSlice"
import authReducer from "@/features/auth/authSlice"

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["historiaClinica", "codificador", 'auth'], // Solo persiste este slice
};

const rootReducer = combineReducers({
  historiaClinica: historiaClinicaReducer,
  codificador: codificadorReducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Necesario para Redux Persist
    }),
  devTools: true, // Habilita Redux DevTools
});

export const persistor = persistStore(store);
