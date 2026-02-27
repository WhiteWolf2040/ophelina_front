import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import ClientesLista from "./ClientesLista";
import ClienteNuevo from "./ClienteNuevo";
import ClienteDetalle from "./ClienteDetalle";
import ClienteEditar from "./ClienteEditar";

const ClientesLayout = () => {

  const [clientes, setClientes] = useState([
    {
      id: 1,
      nombre: "Adalay Arrizmendi",
      telefono: "9992345674",
      email: "apyArriz@gmail.com",
      direccion: "Calle 1",
      fecha: "10/02/2023",
    }
  ]);

  const agregarCliente = (nuevoCliente) => {
    const clienteConId = {
      ...nuevoCliente,
      id: Date.now()
    };

    setClientes([...clientes, clienteConId]);
  };

  const eliminarCliente = (id) => {
    const nuevosClientes = clientes.filter(c => c.id !== id);
    setClientes(nuevosClientes);
  };

  const actualizarCliente = (clienteActualizado) => {
  const nuevosClientes = clientes.map((c) =>
    c.id === clienteActualizado.id ? clienteActualizado : c
  );

  setClientes(nuevosClientes);
};

  return (
    <Routes>
      <Route
        path="/"
        element={<ClientesLista clientes={clientes} />}
      />

      <Route
        path="nuevo"
        element={<ClienteNuevo agregarCliente={agregarCliente} />}
      />

      <Route
        path=":id"
        element={
          <ClienteDetalle
            clientes={clientes}
            eliminarCliente={eliminarCliente}
          />
        }
      />

      <Route
        path="editar/:id"
        element={
          <ClienteEditar
            clientes={clientes}
            actualizarCliente={actualizarCliente}
          />
        }
      />
    </Routes>
  );
};

export default ClientesLayout;