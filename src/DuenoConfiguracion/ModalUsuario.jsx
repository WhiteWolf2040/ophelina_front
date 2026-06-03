import { useState } from "react";

const ModalUsuario = ({ onClose, usuario, onSave }) => {
  const [form, setForm] = useState({
    nombre: usuario?.nombre || "",
    apellido: usuario?.apellido || "",
    telefono: usuario?.telefono || "",
    email: usuario?.email || "",
    rol: usuario?.rol || "Usuario",
  });

  const roles = ["Administrador", "Usuario", "Gerente", "Cajero"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (usuario) {
      onSave(usuario.id, form);
    } else {
      onSave(form);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-usuario" onClick={(e) => e.stopPropagation()}>
        <button className="modal-cerrar" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>{usuario ? "Editar Usuario" : "Nuevo Usuario"}</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-usuario-grid">
              <div className="form-group">
                <label>Nombre</label>
                <input
                  value={form.nombre}
                  onChange={(e) => setForm({...form, nombre: e.target.value})}
                  placeholder="Ej: Diego Joel"
                  required
                />
              </div>

              <div className="form-group">
                <label>Apellido</label>
                <input
                  value={form.apellido}
                  onChange={(e) => setForm({...form, apellido: e.target.value})}
                  placeholder="Ej: Tamay Gonzalez"
                  required
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  value={form.telefono}
                  onChange={(e) => setForm({...form, telefono: e.target.value})}
                  placeholder="Ej: 9991234567"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  placeholder="Ej: usuario@email.com"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Rol</label>
                <select
                  value={form.rol}
                  onChange={(e) => setForm({...form, rol: e.target.value})}
                  required
                >
                  {roles.map(rol => (
                    <option key={rol} value={rol}>{rol}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="modal-acciones">
            <button type="submit" className="btn-guardar">
              Guardar
            </button>
            <button type="button" className="btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalUsuario;