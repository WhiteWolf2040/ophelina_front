import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ModalUsuario from "./ModalUsuario";
import ModalConfirmar from "./ModalConfirmar";
import "./Configuraciones.css";

const ConfiguracionesLayout = () => {
  const [empresa, setEmpresa] = useState({
    nombre: "Ophelina",
    rfc: "OPH123456789",
    telefono: "9991234567",
    email: "contacto@ophelina.com",
    direccion: "Calle 60 #123, Centro, Mérida, Yucatán"
  });

  const [usuarios, setUsuarios] = useState([
    { 
      id: 1, 
      nombre: "Diego Joel", 
      apellido: "Tamay Gonzalez",
      email: "diegotamay@gmail.com",
      telefono: "9991234567",
      rol: "Administrador"
    },
    { 
      id: 2, 
      nombre: "Jennifer", 
      apellido: "González",
      email: "jenifergonza@gmail.com",
      telefono: "9992345678",
      rol: "Usuario"
    },
    { 
      id: 3, 
      nombre: "Suemy", 
      apellido: "Chan Gamboa",
      email: "susu@gmail.com",
      telefono: "9993456789",
      rol: "Usuario"
    },
  ]);

  const [interes, setInteres] = useState({
    porcentaje: 10,
    minimo: 500,
    maximo: 50000
  });

  const [modalUsuarioAbierto, setModalUsuarioAbierto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  const agregarUsuario = (nuevoUsuario) => {
    setUsuarios([...usuarios, { ...nuevoUsuario, id: Date.now() }]);
    setModalUsuarioAbierto(false);
    setUsuarioEditando(null);
  };

  const editarUsuario = (id, usuarioEditado) => {
    setUsuarios(usuarios.map(u => u.id === id ? { ...u, ...usuarioEditado } : u));
    setModalUsuarioAbierto(false);
    setUsuarioEditando(null);
  };

  const eliminarUsuario = (id) => {
    setUsuarios(usuarios.filter(u => u.id !== id));
    setModalEliminar(false);
    setUsuarioAEliminar(null);
  };

  const actualizarEmpresa = (nuevaInfo) => {
    setEmpresa(nuevaInfo);
  };

  const actualizarInteres = (nuevoInteres) => {
    setInteres(nuevoInteres);
  };

  const abrirModalEliminar = (usuario) => {
    setUsuarioAEliminar(usuario);
    setModalEliminar(true);
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content">
        <Outlet context={{ 
          empresa,
          usuarios,
          interes,
          agregarUsuario,
          editarUsuario,
          eliminarUsuario,
          actualizarEmpresa,
          actualizarInteres,
          setModalUsuarioAbierto,
          setUsuarioEditando,
          abrirModalEliminar  // Pasamos esta función también
        }} />
      </div>

      {/* Modal de Usuario (Agregar/Editar) */}
      {modalUsuarioAbierto && (
        <ModalUsuario 
          onClose={() => {
            setModalUsuarioAbierto(false);
            setUsuarioEditando(null);
          }}
          usuario={usuarioEditando}
          onSave={usuarioEditando ? editarUsuario : agregarUsuario}
        />
      )}

      {/* Modal de Confirmación Eliminar */}
      {modalEliminar && usuarioAEliminar && (
        <ModalConfirmar 
          onClose={() => {
            setModalEliminar(false);
            setUsuarioAEliminar(null);
          }}
          onConfirm={() => eliminarUsuario(usuarioAEliminar.id)}
          mensaje={`¿Estás seguro de eliminar a ${usuarioAEliminar.nombre} ${usuarioAEliminar.apellido}?`}
        />
      )}
    </div>
  );
};

export default ConfiguracionesLayout;