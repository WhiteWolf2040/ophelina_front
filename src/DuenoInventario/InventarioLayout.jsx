import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Inventario.css";

const InventarioLayout = () => {
  // Estado global del inventario
  const [inventario, setInventario] = useState([
    { 
      id: 1, 
      nombre: "Anillo de oro 14k", 
      categoria: "Joyería", 
      valor: 7000, 
      estado: "En Empeño", 
      descripcion: "Anillo de oro amarillo 14k con grabado", 
      fechaIngreso: "10/01/2024", 
      cliente: "María García" 
    },
    { 
      id: 2, 
      nombre: "Laptop Dell XPS 15", 
      categoria: "Electrónico", 
      valor: 15000, 
      estado: "En Empeño", 
      descripcion: "Laptop Dell XPS 15, i7, 16GB RAM, 512GB SSD", 
      fechaIngreso: "15/01/2024", 
      cliente: "Juan Pérez" 
    },
    { 
      id: 3, 
      nombre: "Cadena de plata 925", 
      categoria: "Joyería", 
      valor: 3500, 
      estado: "Disponible", 
      descripcion: "Cadena de plata 925, 50cm, eslabón delgado", 
      fechaIngreso: "20/01/2024", 
      cliente: "Ana Martínez" 
    },
    { 
      id: 4, 
      nombre: "iPhone 14 Pro", 
      categoria: "Electrónico", 
      valor: 18000, 
      estado: "Vendido", 
      descripcion: "iPhone 14 Pro, 256GB, color morado, como nuevo", 
      fechaIngreso: "25/01/2024", 
      cliente: "Carlos López" 
    },
  ]);

  // Función para agregar nueva prenda
  const agregarPrenda = (nuevaPrenda) => {
    const nuevaPrendaConId = {
      ...nuevaPrenda,
      id: Date.now(), // Genera ID único basado en timestamp
      fechaIngreso: new Date().toLocaleDateString(),
    };
    setInventario([...inventario, nuevaPrendaConId]);
  };

// Función para editar una prenda
const editarPrenda = (id, prendaEditada) => {
  setInventario(inventario.map(item => 
    item.id === id ? { ...item, ...prendaEditada } : item
  ));
};
  // Función para eliminar una prenda
  const eliminarPrenda = (id) => {
    setInventario(inventario.filter(item => item.id !== id));
  };

  return (
    <div className="dashboard">
      <Sidebar />
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