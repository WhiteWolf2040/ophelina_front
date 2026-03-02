import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OpheliaLogin from "./components/OpheliaLogin";
import OpheliaRegister from "./components/OpheliaRegister";
import LandingPage from "./components/LandingPage";
import OphelinaHome from "./Clientes/OphelinaHome";
import MisEmpenos from "./Clientes/MisEmpenos";

import Dueno from "./Home/Dueno";
import ClientesLayout from "./DuenoClientes/ClientesLayout";
import PagosLayout from "./DuenoPagos/PagosLayout";
import EmpenosLayout from "./DuenoEmpeno/EmpenosLayout";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<LandingPage />} />
        <Route path="/loging" element={<OpheliaLogin />} />

        <Route path="/homecliente" element={<OphelinaHome />} />
        <Route path="/misempenos" element={<MisEmpenos />} />

        <Route path="/" element={<OpheliaLogin />} />

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