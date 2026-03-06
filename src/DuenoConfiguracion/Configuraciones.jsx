import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import "./Configuraciones.css";
// Importar iconos de MUI
import BusinessIcon from '@mui/icons-material/Business';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BadgeIcon from '@mui/icons-material/Badge';
import PercentIcon from '@mui/icons-material/Percent';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StoreIcon from '@mui/icons-material/Store';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
const Configuraciones = () => {
  const { 
    empresa, 
    usuarios, 
    interes,
    actualizarEmpresa,
    actualizarInteres,
    setModalUsuarioAbierto,
    setUsuarioEditando,
    abrirModalEliminar
  } = useOutletContext();

  const [editandoEmpresa, setEditandoEmpresa] = useState(false);
  const [editandoInteres, setEditandoInteres] = useState(false);
  const [empresaForm, setEmpresaForm] = useState(empresa);
  const [interesForm, setInteresForm] = useState(interes);
  
  // Estados para paginación de usuarios
  const [paginaActual, setPaginaActual] = useState(1);
  const usuariosPorPagina = 3; // 6 usuarios por página

  // Calcular paginación de usuarios
  const indiceUltimo = paginaActual * usuariosPorPagina;
  const indicePrimero = indiceUltimo - usuariosPorPagina;
  const usuariosActuales = usuarios.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(usuarios.length / usuariosPorPagina);

  const handleEmpresaSubmit = (e) => {
    e.preventDefault();
    actualizarEmpresa(empresaForm);
    setEditandoEmpresa(false);
  };

  const handleInteresSubmit = (e) => {
    e.preventDefault();
    actualizarInteres(interesForm);
    setEditandoInteres(false);
  };

  // Funciones de paginación
  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  const irPaginaSiguiente = () => {
    setPaginaActual(prev => Math.min(prev + 1, totalPaginas));
  };

  const irPaginaAnterior = () => {
    setPaginaActual(prev => Math.max(prev - 1, 1));
  };

  // Generar números de página
  const obtenerNumerosPagina = () => {
    const numeros = [];
    const maxPaginasVisibles = 5;
    let inicio = Math.max(1, paginaActual - Math.floor(maxPaginasVisibles / 2));
    let fin = Math.min(totalPaginas, inicio + maxPaginasVisibles - 1);
    
    if (fin - inicio + 1 < maxPaginasVisibles) {
      inicio = Math.max(1, fin - maxPaginasVisibles + 1);
    }
    
    for (let i = inicio; i <= fin; i++) {
      numeros.push(i);
    }
    return numeros;
  };

  return (
    <div className="configuraciones-container">
      <h2 className="page-title">Configuraciones</h2>

      {/* SECCIÓN EMPRESA */}
      <div className="config-section">
        <div className="section-header">
          <h3>Información de la Empresa</h3>
          {!editandoEmpresa && (
            <button 
              className="btn-editar-small"
              onClick={() => setEditandoEmpresa(true)}
            >
              ✏️ Editar
            </button>
          )}
        </div>

        {editandoEmpresa ? (
          <form onSubmit={handleEmpresaSubmit} className="empresa-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Nombre de la Empresa</label>
                <input
                  value={empresaForm.nombre}
                  onChange={(e) => setEmpresaForm({...empresaForm, nombre: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>RFC</label>
                <input
                  value={empresaForm.rfc}
                  onChange={(e) => setEmpresaForm({...empresaForm, rfc: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  value={empresaForm.telefono}
                  onChange={(e) => setEmpresaForm({...empresaForm, telefono: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={empresaForm.email}
                  onChange={(e) => setEmpresaForm({...empresaForm, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group full-width">
                <label>Dirección</label>
                <input
                  value={empresaForm.direccion}
                  onChange={(e) => setEmpresaForm({...empresaForm, direccion: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn-gold">Guardar Cambios</button>
              <button type="button" className="btn-cancel" onClick={() => setEditandoEmpresa(false)}>
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="empresa-info">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Nombre:</span>
                <span className="info-value">{empresa.nombre}</span>
              </div>
              <div className="info-item">
                <span className="info-label">RFC:</span>
                <span className="info-value">{empresa.rfc}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Teléfono:</span>
                <span className="info-value">{empresa.telefono}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{empresa.email}</span>
              </div>
              <div className="info-item full-width">
                <span className="info-label">Dirección:</span>
                <span className="info-value">{empresa.direccion}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECCIÓN USUARIOS CON PAGINACIÓN */}
      <div className="config-section">
        <div className="section-header">
          <h3>Empleados ({usuarios.length})</h3>
          <button 
            className="btn-nuevo"
            onClick={() => setModalUsuarioAbierto(true)}
          >
            + Agregar Usuario
          </button>
        </div>

        <div className="usuarios-lista">
          {usuariosActuales.length > 0 ? (
            usuariosActuales.map(usuario => (
              <div key={usuario.id} className="usuario-card">
                <div className="usuario-info">
                  <div className="usuario-nombre">
                    <strong>{usuario.nombre} {usuario.apellido}</strong>
                    <span className="usuario-rol">{usuario.rol}</span>
                  </div>
                  <div className="usuario-email">{usuario.email}</div>
                </div>
                <div className="usuario-acciones">
                  <button 
                    className="btn-icono"
                    onClick={() => {
                      setUsuarioEditando(usuario);
                      setModalUsuarioAbierto(true);
                    }}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-icono"
                    onClick={() => abrirModalEliminar(usuario)}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="sin-resultados">No hay usuarios registrados</div>
          )}
        </div>

        {/* PAGINACIÓN - SOLO SE MUESTRA SI HAY MÁS DE UNA PÁGINA */}
        {totalPaginas > 1 && (
          <div className="paginacion-wrapper">
            <div className="paginacion-container">
              <button 
                className="btn-paginacion"
                onClick={irPaginaAnterior}
                disabled={paginaActual === 1}
              >
                ←
              </button>
              
              <div className="paginacion-numeros">
                {obtenerNumerosPagina().map(numero => (
                  <button
                    key={numero}
                    className={`btn-pagina ${paginaActual === numero ? 'activo' : ''}`}
                    onClick={() => cambiarPagina(numero)}
                  >
                    {numero}
                  </button>
                ))}
              </div>
              
              <button 
                className="btn-paginacion"
                onClick={irPaginaSiguiente}
                disabled={paginaActual === totalPaginas}
              >
                →
              </button>
            </div>
            <div className="paginacion-info">
              Mostrando {indicePrimero + 1} - {Math.min(indiceUltimo, usuarios.length)} de {usuarios.length} usuarios
            </div>
          </div>
        )}
      </div>

      {/* SECCIÓN INTERESES */}
      <div className="config-section">
        <div className="section-header">
          <h3>Configuración de Intereses</h3>
          {!editandoInteres && (
            <button 
              className="btn-editar-small"
              onClick={() => setEditandoInteres(true)}
            >
              ✏️ Editar
            </button>
          )}
        </div>

        {editandoInteres ? (
          <form onSubmit={handleInteresSubmit} className="interes-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Porcentaje de Interés (%)</label>
                <input
                  type="number"
                  value={interesForm.porcentaje}
                  onChange={(e) => setInteresForm({...interesForm, porcentaje: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Monto Mínimo ($)</label>
                <input
                  type="number"
                  value={interesForm.minimo}
                  onChange={(e) => setInteresForm({...interesForm, minimo: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Monto Máximo ($)</label>
                <input
                  type="number"
                  value={interesForm.maximo}
                  onChange={(e) => setInteresForm({...interesForm, maximo: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn-gold">Guardar Cambios</button>
              <button type="button" className="btn-cancel" onClick={() => setEditandoInteres(false)}>
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="interes-info">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Interés actual:</span>
                <span className="info-value">{interes.porcentaje}%</span>
              </div>
              <div className="info-item">
                <span className="info-label">Monto mínimo:</span>
                <span className="info-value">${interes.minimo.toLocaleString()}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Monto máximo:</span>
                <span className="info-value">${interes.maximo.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Configuraciones;