import axios from "axios"
import store from "@/store/store"
import { logout } from "@/features/auth/authSlice"

// Configurar interceptor para agregar token automáticamente
axios.interceptors.request.use(
  (config) => {
    const state = store.getState()
    const token = state.auth.token

    if (token) {
      config.headers.Authorization = `Token ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor para manejar respuestas de error (ej: token expirado)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      store.dispatch(logout())
      window.location.href = "/Iniciar_Sesión"
    }
    return Promise.reject(error)
  },
)

export default axios
