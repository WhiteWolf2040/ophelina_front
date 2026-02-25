import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/Ophelina_White.png";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
         <img src={logo} alt="Ophelia Logo" className="logo-image" />
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/home" className="sidebar-link">
          Dashboard
        </NavLink>

        <NavLink to="/clientes" className="sidebar-link">
          Clientes
        </NavLink>

          <NavLink to="/pagos" className="sidebar-link">
          Pagos
        </NavLink>

          <NavLink to="/empenos" className="sidebar-link">
          Empeños
        </NavLink>
        
        <NavLink to="/inventario" className="sidebar-link">
          Inventario
        </NavLink>

           <NavLink to="/tienda" className="sidebar-link">
          Tienda en linea
        </NavLink>


        <NavLink to="/reportes" className="sidebar-link">
          Reportes
        </NavLink>

        <NavLink to="/configuraciones" className="sidebar-link">
          Configuraciones
        </NavLink>



        <NavLink to="/" className="sidebar-link logout">
          Cerrar sesión
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;