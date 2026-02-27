import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OpheliaLogin from "./components/OpheliaLogin";
import OpheliaRegister from "./components/OpheliaRegister";
import LandingPage from "./components/LandingPage";

import Dueno from "./Home/Dueno";
import ClientesLayout from "./DuenoClientes/ClientesLayout";
import PagosLayout from "./DuenoPagos/PagosLayout";
import EmpenosLayout from "./DuenoEmpeno/EmpenosLayout";

import Dueno from "./Home/Dueno";
import ClientesLayout from "./DuenoClientes/ClientesLayout";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/loging" element={<OpheliaLogin />} />
        <Route path="/register" element={<OpheliaRegister />} />
        <Route path="/home" element={<Dueno />} />
        <Route path="/clientes/*" element={<ClientesLayout />} />

        <Route path="/pagos/*" element={<PagosLayout />} />
        <Route path="/empenos/*" element={<EmpenosLayout />} />


      </Routes>
    </Router>
  );
}

export default App;