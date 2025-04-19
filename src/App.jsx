import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import "@/styles/layout-custom.css" // Importar estilos personalizados

import Home from "@/pages/Home"
import RevisionCasos from "@/pages/RevisionCasos"
import HistoriaClinicaDetail from "@/pages/historiaClinica/HistoriaClinicaDetail"
import EpisodioDetail from "@/pages/historiaClinica/EpisodioDetail"
import RegistroOperatorioDetail from "@/pages/historiaClinica/RegistroOperatorioDetail"
import RegistroPosoperatorioDetail from "@/pages/historiaClinica/RegistroPosoperatorioDetail"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Revision_casos" element={<RevisionCasos />} />
        <Route path="/Revision_casos/HistoriaClinica" element={<HistoriaClinicaDetail />} />
        <Route path="/Revision_casos/HistoriaClinica/Episodio" element={<EpisodioDetail />} />
        <Route path="/Revision_casos/HistoriaClinica/Episodio/RegistroOperatorio" element={<RegistroOperatorioDetail/>}/>
        <Route path="/Revision_casos/HistoriaClinica/Episodio/RegistroOperatorio/RegistroPosoperatorio" element={<RegistroPosoperatorioDetail/>}/>
      </Routes>
    </Router>
  )
}

export default App
