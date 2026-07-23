// App.jsx - VERSIÓN CORREGIDA (rutas de clientes sin Sidebar de admin)

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import Sidebar from "./components/Sidebar";
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

// ✅ AppLayout: SOLO para rutas de administrador/empleados (incluye Sidebar)
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
    <UserProvider>
      <Router>
        <Routes>
          {/* RUTAS PÚBLICAS (SIN SIDEBAR) */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<OpheliaLogin />} />
          <Route path="/register" element={<OpheliaRegister />} />

          {/* ========================================== */}
          {/* 👤 RUTAS DE CLIENTES (SIN AppLayout/Sidebar)  */}
          {/* Cada página de cliente ya trae su propio      */}
          {/* <Navbar /> integrado, por eso NO se envuelven  */}
          {/* en AppLayout (evita duplicar menús)            */}
          {/* ========================================== */}
          <Route path="/homecliente" element={
            <ProtectedRoute allowedRoles={['Cliente']}>
              <OphelinaHome />
            </ProtectedRoute>
          } />

          <Route path="/misempenos" element={
            <ProtectedRoute allowedRoles={['Cliente']}>
              <MisEmpenos />
            </ProtectedRoute>
          } />

          <Route path="/ophelina" element={
            <ProtectedRoute allowedRoles={['Cliente']}>
              <OphelinaTienda />
            </ProtectedRoute>
          } />

          <Route path="/tarjetas" element={
            <ProtectedRoute allowedRoles={['Cliente']}>
              <Tarjetero />
            </ProtectedRoute>
          } />

          {/* ========================================== */}
          {/* 🏠 DASHBOARD ADMIN (CON SIDEBAR) */}
          {/* ========================================== */}
          <Route path="/home" element={
            <ProtectedRoute allowedRoles={['Administrador', 'Gerente', 'Cajero']}>
              <AppLayout>
                <Dueno />
              </AppLayout>
            </ProtectedRoute>
          } />

          {/* ========================================== */}
          {/* CLIENTES ADMIN */}
          {/* ========================================== */}
          <Route path="/clientes" element={
            <ProtectedRoute allowedRoles={['Administrador', 'Gerente']}>
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

          {/* ========================================== */}
          {/* PAGOS */}
          {/* ========================================== */}
          <Route path="/pagos" element={
            <ProtectedRoute allowedRoles={['Administrador', 'Gerente', 'Cajero']}>
              <AppLayout>
                <PagosLayout />
              </AppLayout>
            </ProtectedRoute>
          }>
            <Route index element={<PagosLista />} />
            <Route path="nuevo" element={<RegistrarPago />} />
          </Route>

          {/* ========================================== */}
          {/* EMPEÑOS */}
          {/* ========================================== */}
          <Route path="/empenos" element={
            <ProtectedRoute allowedRoles={['Administrador', 'Gerente']}>
              <AppLayout>
                <EmpenosLayout />
              </AppLayout>
            </ProtectedRoute>
          }>
            <Route index element={<EmpenosLista />} />
            <Route path="nuevo" element={<NuevoEmpeno />} />
          </Route>

          {/* ========================================== */}
          {/* INVENTARIO */}
          {/* ========================================== */}
          <Route path="/inventario" element={
            <ProtectedRoute allowedRoles={['Administrador', 'Gerente']}>
              <AppLayout>
                <InventarioLayout />
              </AppLayout>
            </ProtectedRoute>
          }>
            <Route index element={<InventarioLista />} />
            <Route path="nuevo" element={<NuevoInventario />} />
          </Route>

          {/* ========================================== */}
          {/* TIENDA */}
          {/* ========================================== */}
          <Route path="/tienda" element={
            <ProtectedRoute allowedRoles={['Administrador']}>
              <AppLayout>
                <TiendaOnline />
              </AppLayout>
            </ProtectedRoute>
          } />

          {/* ========================================== */}
          {/* REPORTES */}
          {/* ========================================== */}
          <Route path="/reportes" element={
            <ProtectedRoute allowedRoles={['Administrador', 'Gerente']}>
              <AppLayout>
                <Reporte />
              </AppLayout>
            </ProtectedRoute>
          } />

          {/* ========================================== */}
          {/* ROLES */}
          {/* ========================================== */}
          <Route path="/roles" element={
            <ProtectedRoute allowedRoles={['Administrador']}>
              <AppLayout>
                <Roles />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/roles/nuevo" element={
            <ProtectedRoute allowedRoles={['Administrador']}>
              <AppLayout>
                <RolNuevo />
              </AppLayout>
            </ProtectedRoute>
          } />

          {/* ========================================== */}
          {/* PERMISOS */}
          {/* ========================================== */}
          <Route path="/permisos" element={
            <ProtectedRoute allowedRoles={['Administrador']}>
              <AppLayout>
                <Permisos />
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/permisos/nuevo" element={
            <ProtectedRoute allowedRoles={['Administrador']}>
              <AppLayout>
                <PermisoNuevo />
              </AppLayout>
            </ProtectedRoute>
          } />

          {/* ========================================== */}
          {/* CONFIGURACIÓN */}
          {/* ========================================== */}
          <Route path="/configuracion" element={
            <ProtectedRoute allowedRoles={['Administrador']}>
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