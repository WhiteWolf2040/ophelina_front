import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import OpheliaLogin from "./components/OpheliaLogin";
import OpheliaRegister from "./components/OpheliaRegister";
import LandingPage from "./components/LandingPage";

import OphelinaHome from "./Clientes/OphelinaHome";
import MisEmpenos from "./Clientes/MisEmpenos";
import OphelinaTienda from "./Clientes/OphelinaTienda"; 
import Tarjetero from "./Clientes/Tarjetero"; 

import Roles from "./Roles/Roles";
import RolNuevo from "./Roles/RolNuevo";

import Permisos from "./Permisos/Permisos";
import PermisoNuevo from "./Permisos/PermisoNuevo";

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

import TiendaOnline from "./DuenoTienda/TiendaOnline";
import Reporte from "./DuenoReporte/Reporte";

import ConfiguracionesLayout from "./DuenoConfiguracion/ConfiguracionesLayout";
import Configuraciones from "./DuenoConfiguracion/Configuraciones";

function App() {
  return (
    <Router>
      <Routes>

        {/* Públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<OpheliaLogin />} />
        <Route path="/register" element={<OpheliaRegister />} />

        {/* CLIENTES */}
        <Route path="/homecliente" element={
          <ProtectedRoute>
            <OphelinaHome />
          </ProtectedRoute>
        } />

        <Route path="/misempenos" element={
          <ProtectedRoute>
            <MisEmpenos />
          </ProtectedRoute>
        } />

        <Route path="/ophelina" element={
          <ProtectedRoute>
            <OphelinaTienda />
          </ProtectedRoute>
        } />

        <Route path="/tarjetas" element={
          <ProtectedRoute>
            <Tarjetero />
          </ProtectedRoute>
        } />

        {/* DASHBOARD */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Dueno />
          </ProtectedRoute>
        } />

        {/* CLIENTES ADMIN */}
        <Route path="/clientes" element={
          <ProtectedRoute>
            <ClientesLayout />
          </ProtectedRoute>
        }>
          <Route index element={<ClientesLista />} />
          <Route path="nuevo" element={<ClienteNuevo />} />
        </Route>

        {/* PAGOS */}
        <Route path="/pagos" element={
          <ProtectedRoute>
            <PagosLayout />
          </ProtectedRoute>
        }>
          <Route index element={<PagosLista />} />
          <Route path="nuevo" element={<RegistrarPago />} />
        </Route>

        {/* EMPEÑOS */}
        <Route path="/empenos" element={
          <ProtectedRoute>
            <EmpenosLayout />
          </ProtectedRoute>
        }>
          <Route index element={<EmpenosLista />} />
          <Route path="nuevo" element={<NuevoEmpeno />} />
        </Route>

        {/* INVENTARIO */}
        <Route path="/inventario" element={
          <ProtectedRoute>
            <InventarioLayout />
          </ProtectedRoute>
        }>
          <Route index element={<InventarioLista />} />
          <Route path="nuevo" element={<NuevoInventario />} />
        </Route>

        {/* TIENDA */}
        <Route path="/tienda" element={
          <ProtectedRoute>
            <TiendaOnline />
          </ProtectedRoute>
        } />

        {/* REPORTES */}
        <Route path="/reportes" element={
          <ProtectedRoute>
            <Reporte />
          </ProtectedRoute>
        } />

        {/* ROLES */}
        <Route path="/roles" element={
          <ProtectedRoute>
            <Roles />
          </ProtectedRoute>
        } />

        <Route path="/roles/nuevo" element={
          <ProtectedRoute>
            <RolNuevo />
          </ProtectedRoute>
        } />

        {/* PERMISOS */}
        <Route path="/permisos" element={
          <ProtectedRoute>
            <Permisos />
          </ProtectedRoute>
        } />

        <Route path="/permisos/nuevo" element={
          <ProtectedRoute>
            <PermisoNuevo />
          </ProtectedRoute>
        } />

        {/* CONFIGURACIÓN */}
        <Route path="/configuracion" element={
          <ProtectedRoute>
            <ConfiguracionesLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Configuraciones />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;