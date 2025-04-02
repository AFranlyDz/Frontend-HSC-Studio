import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "@/pages/Home";
import RevisionCasos from "@/pages/RevisionCasos";
import HistoriaClinicaDetail from "@/pages/historiaClinica/HistoriaClinicaDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Revision_casos" element={<RevisionCasos />} />
        <Route path="/Revision_casos/HistoriaClinica" element={<HistoriaClinicaDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
