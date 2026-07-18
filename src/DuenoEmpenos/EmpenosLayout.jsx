// DuenoEmpenos/EmpenosLayout.jsx - VERSIÓN CORREGIDA (SIN SIDEBAR)
import { useState } from "react";
import { Outlet } from "react-router-dom";
// ❌ ELIMINAR import Sidebar from "../components/Sidebar";
import "./EmpenosLayout.css"; // Asegúrate de tener los estilos

const EmpenosLayout = () => {
  const [empenos, setEmpenos] = useState([
    {
      id: 1,
      cliente: "Adalay Arrizmendi",
      objeto: "Iphone 16 pro",
      monto: 7000,
      interes: 5,
      vencimiento: "2026-03-15",
    },
    {
      id: 2,
      cliente: "Melisa Castillo",
      objeto: "Iphone 15 pro",
      monto: 6000,
      interes: 5,
      vencimiento: "2022-06-14",
    },
  ]);

  const agregarEmpeno = (nuevoEmpeno) => {
    const empenoConId = {
      ...nuevoEmpeno,
      id: Date.now(),
    };
    setEmpenos([...empenos, empenoConId]);
  };

  // ✅ RENDER - SIN SIDEBAR
  return (
    <div className="empenos-layout-content">
      <Outlet context={{ empenos, agregarEmpeno }} />
    </div>
  );
};

export default EmpenosLayout;