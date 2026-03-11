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
      colonia: "Centro",
      ciudad: "Mérida",
      codigoPostal: "97000",
      tipoIdentificacion: "INE",
      numeroIdentificacion: "INE12345678",
      fecha: "10/02/2023" 
    },
    { 
      id: 2, 
      nombre: "Juan Pérez", 
      telefono: "9991234567", 
      email: "juan.perez@gmail.com", 
      direccion: "Av. Principal #123",
      colonia: "García Ginerés",
      ciudad: "Mérida",
      codigoPostal: "97070",
      tipoIdentificacion: "INE",
      numeroIdentificacion: "INE87654321",
      fecha: "15/02/2023" 
    },
    { 
      id: 3, 
      nombre: "María García", 
      telefono: "9997654321", 
      email: "maria.garcia@hotmail.com", 
      direccion: "Calle 34 #567",
      colonia: "Paseo de Montejo",
      ciudad: "Mérida",
      codigoPostal: "97100",
      tipoIdentificacion: "Pasaporte",
      numeroIdentificacion: "PS123456",
      fecha: "20/02/2023" 
    },
    { 
      id: 4, 
      nombre: "Carlos López", 
      telefono: "9995551234", 
      email: "carlos.lopez@yahoo.com", 
      direccion: "Calle 60 #345",
      colonia: "Santiago",
      ciudad: "Mérida",
      codigoPostal: "97050",
      tipoIdentificacion: "INE",
      numeroIdentificacion: "INE45678912",
      fecha: "05/03/2023" 
    },
    { 
      id: 5, 
      nombre: "Ana Martínez", 
      telefono: "9998887654", 
      email: "ana.martinez@gmail.com", 
      direccion: "Calle 41 #234",
      colonia: "Pensiones",
      ciudad: "Mérida",
      codigoPostal: "97217",
      tipoIdentificacion: "INE",
      numeroIdentificacion: "INE78912345",
      fecha: "12/03/2023" 
    },
    { 
      id: 6, 
      nombre: "Roberto Sánchez", 
      telefono: "9992223344", 
      email: "roberto.sanchez@hotmail.com", 
      direccion: "Calle 47 #678",
      colonia: "Altabrisa",
      ciudad: "Mérida",
      codigoPostal: "97238",
      tipoIdentificacion: "Pasaporte",
      numeroIdentificacion: "PS789012",
      fecha: "22/03/2023" 
    },
    { 
      id: 7, 
      nombre: "Laura Torres", 
      telefono: "9994445566", 
      email: "laura.torres@gmail.com", 
      direccion: "Calle 27 #123",
      colonia: "Itzimná",
      ciudad: "Mérida",
      codigoPostal: "97110",
      tipoIdentificacion: "INE",
      numeroIdentificacion: "INE32165498",
      fecha: "01/04/2023" 
    },
    { 
      id: 8, 
      nombre: "Miguel Ángel", 
      telefono: "9997778899", 
      email: "miguel.angel@yahoo.com", 
      direccion: "Calle 33 #456",
      colonia: "Benito Juárez",
      ciudad: "Mérida",
      codigoPostal: "97119",
      tipoIdentificacion: "Cédula Profesional",
      numeroIdentificacion: "CP12345678",
      fecha: "15/04/2023" 
    },
    { 
      id: 9, 
      nombre: "Sofía Ramírez", 
      telefono: "9991112233", 
      email: "sofia.ramirez@gmail.com", 
      direccion: "Calle 19 #789",
      colonia: "Mérida Norte",
      ciudad: "Mérida",
      codigoPostal: "97130",
      tipoIdentificacion: "INE",
      numeroIdentificacion: "INE65498732",
      fecha: "28/04/2023" 
    },
    { 
      id: 10, 
      nombre: "Javier Mendoza", 
      telefono: "9993334455", 
      email: "javier.mendoza@hotmail.com", 
      direccion: "Calle 55 #890",
      colonia: "Chuburná",
      ciudad: "Mérida",
      codigoPostal: "97205",
      tipoIdentificacion: "Licencia de Conducir",
      numeroIdentificacion: "LC87654321",
      fecha: "10/05/2023" 
    }
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