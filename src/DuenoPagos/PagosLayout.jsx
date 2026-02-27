import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import PagosLista from "./PagosLista";
import RegistrarPago from "./RegistrarPago";
import DetallePago from "./DetallePago";

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
  
  ]);

  const agregarPago = (nuevoPago) => {
    const pagoConId = {
      ...nuevoPago,
      id: Date.now(),
    };

    setPagos([...pagos, pagoConId]);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<PagosLista pagos={pagos} />}
      />

      <Route
        path="nuevo"
        element={<RegistrarPago agregarPago={agregarPago} />}
      />


      <Route
        path=":id"
        element={<DetallePago pagos={pagos} />}
      />

    </Routes>

    
  );
};

export default PagosLayout;