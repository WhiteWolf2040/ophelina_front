
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Clientes.css";
import React, { useState } from "react";

const ClienteDetalle = ({ clientes, eliminarCliente }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const cliente = clientes.find((c) => c.id === parseInt(id));
  const [mostrarModal, setMostrarModal] = useState(false);

  if (!cliente) {
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="content">
          <h2>Cliente no encontrado</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
        <div className="top-header">
          <h2>{cliente.nombre}</h2>

        <button
        className="btn-gold"
        onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
        >
        Editar
        </button>
        </div>

        <div className="table-card">
          <h3>Datos Personales</h3>
          <p><strong>Teléfono:</strong> {cliente.telefono}</p>
          <p><strong>Email:</strong> {cliente.email}</p>
          <p><strong>Dirección:</strong> {cliente.direccion}</p>
          <p><strong>Fecha Registro:</strong> {cliente.fecha}</p>
        </div>

        <div className="table-card">
          <h3>Historial de Empeño</h3>
          <p>Sin registros</p>
        </div>

        <div className="table-card">
          <h3>Pagos Realizados</h3>
          <p>Sin registros</p>
        </div>

            <button
            className="btn-danger"
            onClick={() => setMostrarModal(true)}
            >
            Eliminar Cliente
            </button>
      </div>

           {mostrarModal && (
  <div className="modal-overlay">
    <div className="modal">
      <h3>Confirmar Eliminación</h3>
      <p>¿Estás seguro de que deseas eliminar este cliente?</p>

      <div className="modal-buttons">
        <button
          className="btn-cancel"
          onClick={() => setMostrarModal(false)}
        >
          Cancelar
        </button>

        <button
          className="btn-danger"
          onClick={() => {
            eliminarCliente(cliente.id);
            navigate("/clientes");
          }}
        >
          Sí, eliminar
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ClienteDetalle;