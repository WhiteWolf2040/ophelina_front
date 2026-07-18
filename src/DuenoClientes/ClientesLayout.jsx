// ClientesLayout.jsx - VERSIÓN CORREGIDA (SOLO LAYOUT)
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Clientes.css";

const ClientesLayout = () => {
  return (
    <div className="dashboard">
   
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default ClientesLayout;