import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import Home from "@/pages/Home"
import RevisionCasos from "@/pages/RevisionCasos"
import HistoriaClinicaDetail from "@/pages/historiaClinica/HistoriaClinicaDetail"
import EpisodioDetail from "@/pages/historiaClinica/EpisodioDetail"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Revision_casos" element={<RevisionCasos />} />
        <Route path="/Revision_casos/HistoriaClinica" element={<HistoriaClinicaDetail />} />
        <Route path="/Revision_casos/HistoriaClinica/Episodio" element={<EpisodioDetail />} />
      </Routes>
    </Router>
  )
}

export default App

