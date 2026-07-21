import { useState } from "react";
import { Outlet } from "react-router-dom";

import "./Inventario.css";

const InventarioLayout = () => {

  const [inventario, setInventario] = useState([]);

  const agregarPrenda = (nuevaPrenda) => {
    setInventario([...inventario, {
      ...nuevaPrenda,
      id: Date.now(),
      fechaIngreso: new Date().toLocaleDateString(),
    }]);
  };

  const editarPrenda = (id, prendaEditada) => {
    setInventario(inventario.map(item =>
      item.id === id ? { ...item, ...prendaEditada } : item
    ));
  };

  const eliminarPrenda = (id) => {
    setInventario(inventario.filter(item => item.id !== id));
  };

  return (
    <div className="dashboard">
  
      <div className="content">
        <Outlet context={{ 
          inventario, 
          agregarPrenda, 
          editarPrenda, 
          eliminarPrenda 
        }} />
      </div>
    </div>
  );
};

export default InventarioLayout;