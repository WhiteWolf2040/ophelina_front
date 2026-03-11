// App.jsx - Versión corregida
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OpheliaLogin from "./components/OpheliaLogin";
import OpheliaRegister from "./components/OpheliaRegister";
import LandingPage from "./components/LandingPage";

import OphelinaHome from "./Clientes/OphelinaHome";
import MisEmpenos from "./Clientes/MisEmpenos";
import OphelinaTienda from "./Clientes/OphelinaTienda"; 
import Tarjetero from "./Clientes/Tarjetero"; 
import Roles from "./Roles/Roles";
import RolNuevo from "./Roles/RolNuevo";

import Permisos from './Permisos/Permisos';
import PermisoNuevo from './Permisos/PermisoNuevo';


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
import Reporte from "./DuenoReporte/Reporte"; // Asegúrate que el import sea correcto
import ConfiguracionesLayout from "./DuenoConfiguracion/ConfiguracionesLayout";
import Configuraciones from "./DuenoConfiguracion/Configuraciones";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/loging" element={<OpheliaLogin />} />


        {/* Clientes - Rutas de clientes */}
        <Route path="/homecliente" element={<OphelinaHome />} />
        <Route path="/misempenos" element={<MisEmpenos />} />
        <Route path="/ophelina" element={<OphelinaTienda />} /> {/* 👈 NUEVA RUTA PARA LA TIENDA */}
        <Route path="/tarjetas" element={<Tarjetero />} /> 

        <Route path="/" element={<OpheliaLogin />} />

        <Route path="/homecliente" element={<OphelinaHome />} />
        <Route path="/misempenos" element={<MisEmpenos />} />
        <Route path="/login" element={<OpheliaLogin />} />
        <Route path="/register" element={<OpheliaRegister />} />

        {/* Dashboard del dueño */}
        <Route path="/home" element={<Dueno />} />

        {/* Clientes (dueño) */}
        <Route path="/clientes" element={<ClientesLayout />}>
          <Route index element={<ClientesLista />} />
          <Route path="nuevo" element={<ClienteNuevo />} />
        </Route>

        {/* Pagos (dueño) */}
        <Route path="/pagos" element={<PagosLayout />}>
          <Route index element={<PagosLista />} />
          <Route path="nuevo" element={<RegistrarPago />} />
        </Route>

        {/* Empeños (dueño) */}
        <Route path="/empenos" element={<EmpenosLayout />}>
          <Route index element={<EmpenosLista />} />
          <Route path="nuevo" element={<NuevoEmpeno />} />
        </Route>

        {/* Inventario (dueño) */}
        <Route path="/inventario" element={<InventarioLayout />}>
          <Route index element={<InventarioLista />} />
          <Route path="nuevo" element={<NuevoInventario />} />
        </Route>

        {/* Configuración (dueño) */}
        {/* Tienda Online */}
        <Route path="/tienda" element={<TiendaOnline />} />     
        
        {/* Reportes - CORREGIDO: eliminé el Route vacío y cambié a /reportes */}
        <Route path="/reportes" element={<Reporte />} />

           {/* roles */}
        <Route path="/roles" element={<Roles />} />
        <Route path="/roles/nuevo" element={<RolNuevo />} />

        <Route path="/permisos" element={<Permisos />} />
        <Route path="/permisos/nuevo" element={<PermisoNuevo />} />

        {/* Configuración */}
        <Route path="/configuracion" element={<ConfiguracionesLayout />}>
          <Route index element={<Configuraciones />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;