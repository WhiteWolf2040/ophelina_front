import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Clientes.css";

const ClientesLayout = () => {
  const [clientes, setClientes] = useState([
    { 
      id: 1, 
      nombre: "Adalay Arrizmendi", 
      telefono: "9992345674", 
      email: "apyArriz@gmail.com", 
      direccion: "Calle 23 #456, Centro", 
      fecha: "10/02/2023" 
    },
    { 
      id: 2, 
      nombre: "Juan Pérez", 
      telefono: "9991234567", 
      email: "juan@gmail.com", 
      direccion: "Av. Principal #123", 
      fecha: "15/02/2023" 
    },
    { 
      id: 3, 
      nombre: "María García", 
      telefono: "9997654321", 
      email: "maria@gmail.com", 
      direccion: "Calle 34 #567", 
      fecha: "20/02/2023" 
    },
  ]);

  const agregarCliente = (nuevoCliente) => {
    setClientes([...clientes, { ...nuevoCliente, id: Date.now() }]);
  };

  const editarCliente = (id, clienteEditado) => {
    setClientes(clientes.map(c => 
      c.id === id ? { ...c, ...clienteEditado } : c
    ));
  };

  const eliminarCliente = (id) => {
    setClientes(clientes.filter(c => c.id !== id));
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content">
        <Outlet context={{ 
          clientes, 
          agregarCliente, 
          editarCliente, 
          eliminarCliente 
        }} />
      </div>
    </div>
  );
};

export default ClientesLayout;