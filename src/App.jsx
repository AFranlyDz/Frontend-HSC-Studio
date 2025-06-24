import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import "@/styles/layout-custom.css" // Importar estilos personalizados
import VisitorHome from "./pages/VisitorHome"
import RevisionCasos from "@/pages/RevisionCasos"
import HistoriaClinicaDetail from "@/pages/historiaClinica/HistoriaClinicaDetail"
import EpisodioDetail from "@/pages/historiaClinica/EpisodioDetail"
import RegistroOperatorioDetail from "@/pages/historiaClinica/RegistroOperatorioDetail"
import RegistroPosoperatorioDetail from "@/pages/historiaClinica/RegistroPosoperatorioDetail"
import HematomaSubduralDetail from "@/pages/historiaClinica/HematomaSubduralDetail"
import IniciarSesion from "./pages/IniciarSesion"
import { ProtectedRoute } from "@/components/shared/ProtectedRoute"
import { HomeRoute } from "@/pages/HomeRoute"

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta especial para el home - redirige a Visitor si no está autenticado */}
        <Route path="/" element={<HomeRoute />} />

        {/* Rutas públicas */}
        <Route path="/Visitor" element={<VisitorHome />} />
        <Route path="/Iniciar_Sesión" element={<IniciarSesion />} />

        {/* Rutas protegidas - requieren autenticación */}
        <Route
          path="/Revision_casos"
          element={
            <ProtectedRoute>
              <RevisionCasos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Revision_casos/HistoriaClinica"
          element={
            <ProtectedRoute>
              <HistoriaClinicaDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Revision_casos/HistoriaClinica/Episodio"
          element={
            <ProtectedRoute>
              <EpisodioDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Revision_casos/HistoriaClinica/Episodio/RegistroOperatorio"
          element={
            <ProtectedRoute>
              <RegistroOperatorioDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Revision_casos/HistoriaClinica/Episodio/RegistroOperatorio/RegistroPosoperatorio"
          element={
            <ProtectedRoute>
              <RegistroPosoperatorioDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Revision_casos/HistoriaClinica/Episodio/Hematoma"
          element={
            <ProtectedRoute>
              <HematomaSubduralDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
