import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OpheliaLogin from "./components/OpheliaLogin";
import OpheliaRegister from "./components/OpheliaRegister";
import LandingPage from "./components/LandingPage";
import Dueno from "./Home/dueno";
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
      </Routes>
    </Router>
  );
}

export default App;