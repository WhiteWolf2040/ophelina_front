// App.jsx - VERSIÓN CON LAZY LOADING (mismas rutas y permisos, código dividido por página)

import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

// ✅ Se mantienen eager (sin lazy) solo las páginas de entrada / uso constante
import LandingPage from "./components/LandingPage";

// ✅ NUEVO: todo lo demás se carga bajo demanda con React.lazy.
// El navegador solo descarga el código de la pantalla que el usuario
// realmente visita, en vez de meter TODAS las pantallas (Roles, Permisos,
// Reportes, Tienda, Inventario, etc.) en el bundle inicial.
const OpheliaLogin = lazy(() => import("./components/OpheliaLogin"));
const OpheliaRegister = lazy(() => import("./components/OpheliaRegister"));

const OphelinaHome = lazy(() => import("./Clientes/OphelinaHome"));
const MisEmpenos = lazy(() => import("./Clientes/MisEmpenos"));
const OphelinaTienda = lazy(() => import("./Clientes/OphelinaTienda"));
const Tarjetero = lazy(() => import("./Clientes/Tarjetero"));
const MisTickets = lazy(() => import("./Clientes/MisTickets"));
const MisTicketDetalle = lazy(() => import("./Clientes/MisTicketDetalle"));

const ApartadosAdmin = lazy(() => import("./DuenoTienda/ApartadosAdmin"));

const Roles = lazy(() => import("./Roles/Roles"));
const RolNuevo = lazy(() => import("./Roles/RolNuevo"));

const Permisos = lazy(() => import("./Permisos/Permisos"));
const PermisoNuevo = lazy(() => import("./Permisos/PermisoNuevo"));

const Dueno = lazy(() => import("./Home/Dueno"));

const ClientesLayout = lazy(() => import("./DuenoClientes/ClientesLayout"));
const ClientesLista = lazy(() => import("./DuenoClientes/ClientesLista"));
const ClienteNuevo = lazy(() => import("./DuenoClientes/ClienteNuevo"));
const ClienteDetalle = lazy(() => import("./DuenoClientes/ClienteDetalle"));
const ClienteEditar = lazy(() => import("./DuenoClientes/ClienteEditar"));

const PagosLayout = lazy(() => import("./DuenoPagos/PagosLayout"));
const PagosLista = lazy(() => import("./DuenoPagos/PagosLista"));
const RegistrarPago = lazy(() => import("./DuenoPagos/RegistrarPago"));

const EmpenosLayout = lazy(() => import("./DuenoEmpenos/EmpenosLayout"));
const EmpenosLista = lazy(() => import("./DuenoEmpenos/EmpenosLista"));
const NuevoEmpeno = lazy(() => import("./DuenoEmpenos/NuevoEmpeno"));

const InventarioLayout = lazy(() => import("./DuenoInventario/InventarioLayout"));
const InventarioLista = lazy(() => import("./DuenoInventario/InventarioLista"));
const NuevoInventario = lazy(() => import("./DuenoInventario/NuevoInventario"));

const TiendaOnline = lazy(() => import("./DuenoTienda/TiendaOnline"));
const Reporte = lazy(() => import("./DuenoReporte/Reporte"));

const ConfiguracionesLayout = lazy(() => import("./DuenoConfiguracion/ConfiguracionesLayout"));
const Configuraciones = lazy(() => import("./DuenoConfiguracion/Configuraciones"));

//  AppLayout: SOLO para rutas de administrador/empleados (incluye Sidebar)
const AppLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content-wrapper">
        {children}
      </div>
    </div>
  );
};

//  NUEVO: pantalla simple mientras se descarga el código de la ruta.
// No usa clases CSS nuevas para no depender de estilos que no existan;
// solo texto centrado con estilos inline mínimos.
const CargandoRuta = () => (
  <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    fontSize: "1rem",
    color: "#666"
  }}>
    Cargando...
  </div>
);

function App() {
  return (
    <UserProvider>
      <Router>
        {/* ✅ NUEVO: Suspense envuelve TODAS las rutas. Mientras el chunk
            de la pantalla pedida se descarga, se muestra CargandoRuta.
            Esto es obligatorio en React cuando se usa lazy(); sin este
            Suspense, la app truena al navegar a cualquier ruta lazy. */}
        <Suspense fallback={<CargandoRuta />}>
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

            {/* ✅ NUEVO: historial de tickets (pagos) del cliente.
                Mismo patrón que /misempenos: protegida por rol 'Cliente',
                sin AppLayout porque MisTickets/MisTicketDetalle ya traen
                su propio <Navbar />. */}
            <Route path="/mistickets" element={
              <ProtectedRoute allowedRoles={['Cliente']}>
                <MisTickets />
              </ProtectedRoute>
            } />

            <Route path="/mistickets/:id" element={
              <ProtectedRoute allowedRoles={['Cliente']}>
                <MisTicketDetalle />
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

            <Route path="/tienda/apartados" element={
              <ProtectedRoute allowedRoles={['Administrador']}>
                <AppLayout>
                  <ApartadosAdmin />
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
        </Suspense>
      </Router>
    </UserProvider>
  );
}

export default App;