import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import EmpenosLista from "./EmpenosLista.jsx";
import NuevoEmpeno from "./NuevoEmpeno.jsx";
import DetalleEmpeno from "./DetalleEmpeno.jsx";

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
    const empeñoConId = {
      ...nuevoEmpeno,
      id: Date.now(),
    };

    setEmpenos([...empenos, empeñoConId]);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<EmpenosLista empenos={empenos} />}
      />

      <Route
        path="nuevo"
        element={<NuevoEmpeno agregarEmpeno={agregarEmpeno} />}
      />

      <Route
        path=":id"
        element={<DetalleEmpeno empenos={empenos} />}
      />
    </Routes>
  );
};

export default EmpenosLayout;