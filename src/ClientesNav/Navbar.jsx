import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/O_blue.png";

export default function Navbar() {
  return (
    <nav className="Ophe-navbar">
      <div className="Ophe-navbar-container">

        {/* Logo */}
        <div className="Ophe-navbar-logo">
          <img src={logo} alt="Ophelina Logo" />
        </div>

        {/* Links */}
        <ul className="Ophe-navbar-links">
          <li>
            <NavLink
              to="/homecliente"
              className={({ isActive }) =>
                isActive
                  ? "Ophe-nav-item Ophe-active"
                  : "Ophe-nav-item"
              }
            >
              Historial
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/misempenos"
              className={({ isActive }) =>
                isActive
                  ? "Ophe-nav-item Ophe-active"
                  : "Ophe-nav-item"
              }
            >
              Mis Empeños
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/pagos"
              className={({ isActive }) =>
                isActive
                  ? "Ophe-nav-item Ophe-active"
                  : "Ophe-nav-item"
              }
            >
              Pagos
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/ophelina"
              className={({ isActive }) =>
                isActive
                  ? "Ophe-nav-item Ophe-active"
                  : "Ophe-nav-item"
              }
            >
              Tienda
            </NavLink>
          </li>
        </ul>

        {/* Usuario */}
        <div className="Ophe-navbar-user">
          <div className="Ophe-user-icon"></div>
        </div>

      </div>
    </nav>
  );
}