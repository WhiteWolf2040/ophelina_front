import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OpheliaLogin from "./components/OpheliaLogin";
import OpheliaRegister from "./components/OpheliaRegister";
import LandingPage from "./components/LandingPage";
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
import Configuraciones from "./DuenoConfiguracion/Configuraciones";
import ConfiguracionesLayout from "./DuenoConfiguracion/ConfiguracionesLayout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<OpheliaLogin />} />
        <Route path="/register" element={<OpheliaRegister />} />
        
        {/* Ruta del dashboard del dueño */}
        <Route path="/home" element={<Dueno />} />
        
        {/* Rutas de Clientes - SIN EL /* */}
        <Route path="/clientes" element={<ClientesLayout />}>
          <Route index element={<ClientesLista />} />
          <Route path="nuevo" element={<ClienteNuevo />} />
        </Route>
        
        {/* Rutas de Pagos - SIN EL /* */}
        <Route path="/pagos" element={<PagosLayout />}>
          <Route index element={<PagosLista />} />
          <Route path="nuevo" element={<RegistrarPago />} />
        </Route>
        
        {/* Rutas de Empeños - SIN EL /* */}
        <Route path="/empenos" element={<EmpenosLayout />}>
          <Route index element={<EmpenosLista />} />
          <Route path="nuevo" element={<NuevoEmpeno />} />
        </Route>
        
        {/* Rutas de Inventario - SIN EL /* */}
        <Route path="/inventario" element={<InventarioLayout />}>
          <Route index element={<InventarioLista />} />
          <Route path="nuevo" element={<NuevoInventario />} />
        </Route>

        {/* Rutas de Configuración - SIN EL /* */}
        <Route path="/configuracion" element={<ConfiguracionesLayout />}>
          <Route index element={<Configuraciones />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;