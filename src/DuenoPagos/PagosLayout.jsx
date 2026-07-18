// DuenoPagos/PagosLayout.jsx - VERSIÓN CORREGIDA (SIN SIDEBAR)
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import PagosLista from "./PagosLista";
import RegistrarPago from "./RegistrarPago";
import DetallePago from "./DetallePago";
// ❌ ELIMINAR import Sidebar from "../components/Sidebar";
import "./PagosLayout.css"; // Asegúrate de tener los estilos

const PagosLayout = () => {
  const [pagos, setPagos] = useState([
    {
      id: 1,
      cliente: "Adalay Arrizmendi",
      articulo: "Iphone 16 pro",
      monto: 400,
      tipo: "Interes",
      fecha: "10/05/2024",
    },
    {
      id: 2,
      cliente: "Juan Pérez",
      articulo: "Samsung Galaxy S24",
      monto: 350,
      tipo: "Interes",
      fecha: "10/05/2024",
    },
    {
      id: 3,
      cliente: "María García",
      articulo: "MacBook Pro",
      monto: 1200,
      tipo: "Interes",
      fecha: "10/05/2024",
    },
  ]);

  const agregarPago = (nuevoPago) => {
    const pagoConId = {
      ...nuevoPago,
      id: Date.now(),
    };
    setPagos([...pagos, pagoConId]);
  };

  // ✅ RENDER - SIN SIDEBAR, SOLO EL CONTENIDO
  return (
    <div className="pagos-layout-content">
      <Routes>
        <Route path="/" element={<PagosLista pagos={pagos} />} />
        <Route path="nuevo" element={<RegistrarPago agregarPago={agregarPago} />} />
        <Route path=":id" element={<DetallePago pagos={pagos} />} />
      </Routes>
    </div>
  );
};

export default PagosLayout;