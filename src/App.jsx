import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OpheliaLogin from "./components/OpheliaLogin";
import OpheliaRegister from "./components/OpheliaRegister";
import LandingPage from "./components/LandingPage";
import OphelinaHome from "./Clientes/OphelinaHome";
import MisEmpenos from "./Clientes/MisEmpenos";

import Dueno from "./Home/Dueno";

import ClientesLayout from "./DuenoClientes/ClientesLayout";
import ClientesLista from "./DuenoClientes/ClientesLista";
import ClienteNuevo from "./DuenoClientes/ClienteNuevo";

import PagosLayout from "./DuenoPagos/PagosLayout";
import PagosLista from "./DuenoPagos/PagosLista";
import RegistrarPago from "./DuenoPagos/RegistrarPago";

import EmpenosLayout from "./DuenoEmpenos/EmpenosLayout";
import EmpenosLista from "./DuenoEmpenos/EmpenosLista";
import NuevoEmpeno from "./DuenoEmpenos/NuevoEmpeno";

import InventarioLayout from "./DuenoInventario/InventarioLayout";
import InventarioLista from "./DuenoInventario/InventarioLista";
import NuevoInventario from "./DuenoInventario/NuevoInventario";

import ConfiguracionesLayout from "./DuenoConfiguracion/ConfiguracionesLayout";
import Configuraciones from "./DuenoConfiguracion/Configuraciones";

function App() {
  return (
    <Router>
      <Routes>

        {/* Rutas públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/loging" element={<OpheliaLogin />} />

        <Route path="/homecliente" element={<OphelinaHome />} />
        <Route path="/misempenos" element={<MisEmpenos />} />

        <Route path="/" element={<OpheliaLogin />} />

        <Route path="/login" element={<OpheliaLogin />} />
        <Route path="/register" element={<OpheliaRegister />} />

        {/* Dashboard */}
        <Route path="/home" element={<Dueno />} />

        {/* Clientes */}
        <Route path="/clientes" element={<ClientesLayout />}>
          <Route index element={<ClientesLista />} />
          <Route path="nuevo" element={<ClienteNuevo />} />
        </Route>

        {/* Pagos */}
        <Route path="/pagos" element={<PagosLayout />}>
          <Route index element={<PagosLista />} />
          <Route path="nuevo" element={<RegistrarPago />} />
        </Route>

        {/* Empeños */}
        <Route path="/empenos" element={<EmpenosLayout />}>
          <Route index element={<EmpenosLista />} />
          <Route path="nuevo" element={<NuevoEmpeno />} />
        </Route>

        {/* Inventario */}
        <Route path="/inventario" element={<InventarioLayout />}>
          <Route index element={<InventarioLista />} />
          <Route path="nuevo" element={<NuevoInventario />} />
        </Route>

        {/* Configuración */}
        <Route path="/configuracion" element={<ConfiguracionesLayout />}>
          <Route index element={<Configuraciones />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;