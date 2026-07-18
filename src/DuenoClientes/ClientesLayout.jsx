// DuenoClientes/ClientesLayout.jsx - VERSIÓN CORREGIDA (SIN SIDEBAR)
import { Outlet } from "react-router-dom";

import "./Clientes.css";

const ClientesLayout = () => {
  //  RENDER - SIN SIDEBAR
  return (
    <div className="clientes-layout-content">
      <Outlet />
    </div>
  );
};

export default ClientesLayout;