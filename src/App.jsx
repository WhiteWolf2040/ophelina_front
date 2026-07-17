// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext"; // ✅ IMPORTAR PROVIDER
import Sidebar from "./components/Sidebar"; // ✅ IMPORTAR SIDEBAR
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
import ClienteDetalle from "./DuenoClientes/ClienteDetalle";
import ClienteEditar from "./DuenoClientes/ClienteEditar";

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

// ✅ COMPONENTE PARA RUTAS CON SIDEBAR
const AppLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <UserProvider> {/* ✅ ENVOLVER TODO CON EL PROVIDER */}
      <Router>
        <Routes>
          {/* 🔓 RUTAS PÚBLICAS (SIN SIDEBAR) */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<OpheliaLogin />} />
          <Route path="/register" element={<OpheliaRegister />} />

          {/* 👤 RUTAS DE CLIENTES (CON SIDEBAR) */}
          <Route path="/homecliente" element={
            <ProtectedRoute>
              <AppLayout>
                <OphelinaHome />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/misempenos" element={
            <ProtectedRoute>
              <AppLayout>
                <MisEmpenos />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/ophelina" element={
            <ProtectedRoute>
              <AppLayout>
                <OphelinaTienda />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/tarjetas" element={
            <ProtectedRoute>
              <AppLayout>
                <Tarjetero />
              </AppLayout>
            </ProtectedRoute>
          } />

          {/* 🏠 DASHBOARD (CON SIDEBAR) */}
          <Route path="/home" element={
            <ProtectedRoute>
              <AppLayout>
                <Dueno />
              </AppLayout>
            </ProtectedRoute>
          } />

          {/* 👥 CLIENTES ADMIN (CON SIDEBAR) */}
          <Route path="/clientes" element={
            <ProtectedRoute>
              <AppLayout>
                <ClientesLayout />
              </AppLayout>
            </ProtectedRoute>
          }>
            <Route index element={<ClientesLista />} />
            <Route path="nuevo" element={<ClienteNuevo />} />
            <Route path=":id" element={<ClienteDetalle />} />
            <Route path="editar/:id" element={<ClienteEditar />} />
          </Route>

          {/* 💰 PAGOS (CON SIDEBAR) */}
          <Route path="/pagos" element={
            <ProtectedRoute>
              <AppLayout>
                <PagosLayout />
              </AppLayout>
            </ProtectedRoute>
          }>
            <Route index element={<PagosLista />} />
            <Route path="nuevo" element={<RegistrarPago />} />
          </Route>

          {/* 💎 EMPEÑOS (CON SIDEBAR) */}
          <Route path="/empenos" element={
            <ProtectedRoute>
              <AppLayout>
                <EmpenosLayout />
              </AppLayout>
            </ProtectedRoute>
          }>
            <Route index element={<EmpenosLista />} />
            <Route path="nuevo" element={<NuevoEmpeno />} />
          </Route>

          {/* 📦 INVENTARIO (CON SIDEBAR) */}
          <Route path="/inventario" element={
            <ProtectedRoute>
              <AppLayout>
                <InventarioLayout />
              </AppLayout>
            </ProtectedRoute>
          }>
            <Route index element={<InventarioLista />} />
            <Route path="nuevo" element={<NuevoInventario />} />
          </Route>

          {/* 🏪 TIENDA (CON SIDEBAR) */}
          <Route path="/tienda" element={
            <ProtectedRoute>
              <AppLayout>
                <TiendaOnline />
              </AppLayout>
            </ProtectedRoute>
          } />

          {/* 📊 REPORTES (CON SIDEBAR) */}
          <Route path="/reportes" element={
            <ProtectedRoute>
              <AppLayout>
                <Reporte />
              </AppLayout>
            </ProtectedRoute>
          } />

          {/* 🔐 ROLES (CON SIDEBAR) */}
          <Route path="/roles" element={
            <ProtectedRoute>
              <AppLayout>
                <Roles />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/roles/nuevo" element={
            <ProtectedRoute>
              <AppLayout>
                <RolNuevo />
              </AppLayout>
            </ProtectedRoute>
          } />

          {/* 🔑 PERMISOS (CON SIDEBAR) */}
          <Route path="/permisos" element={
            <ProtectedRoute>
              <AppLayout>
                <Permisos />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/permisos/nuevo" element={
            <ProtectedRoute>
              <AppLayout>
                <PermisoNuevo />
              </AppLayout>
            </ProtectedRoute>
          } />

          {/* ⚙️ CONFIGURACIÓN (CON SIDEBAR) */}
          <Route path="/configuracion" element={
            <ProtectedRoute>
              <AppLayout>
                <ConfiguracionesLayout />
              </AppLayout>
            </ProtectedRoute>
          }>
            <Route index element={<Configuraciones />} />
          </Route>

        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;