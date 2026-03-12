import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Clientes.css";

const ClienteNuevo = ({ agregarCliente }) => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [imagen, setImagen] = useState(null);
  const [previewImagen, setPreviewImagen] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    direccion: "",
    fecha: new Date().toLocaleDateString(),
  });

  // ✅ FUNCIÓN PARA MANEJAR LA SELECCIÓN DE IMAGEN
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!tiposPermitidos.includes(file.type)) {
        alert('Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)');
        e.target.value = ''; // Limpiar el input
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        e.target.value = '';
        return;
      }

      setImagen(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImagen(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ FUNCIÓN PARA ELIMINAR LA IMAGEN SELECCIONADA
  const handleRemoveImage = () => {
    setImagen(null);
    setPreviewImagen("");
    // Limpiar el input file
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  // ✅ HANDLE SUBMIT ACTUALIZADO PARA INCLUIR LA IMAGEN
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Crear FormData para enviar archivos
      const formData = new FormData();
      formData.append('nombre', form.nombre);
      formData.append('telefono', form.telefono);
      formData.append('email', form.email);
      formData.append('direccion', form.direccion);
      formData.append('fecha', form.fecha);
      
      if (imagen) {
        formData.append('imagen', imagen);
      }

      // Simular envío (reemplaza con tu llamada real a la API)
      console.log('Datos del cliente a guardar:', Object.fromEntries(formData));
      
      // Llamar a la función del contexto con la imagen incluida
      agregarCliente({ 
        ...form, 
        imagen: previewImagen // Guardar la preview o la URL de la imagen
      });
      
      navigate("/clientes");
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar el cliente');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="content">
        <div className="header-container">
          <h2>Nuevo Cliente</h2>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="nombre">Nombre completo *</label>
                <input
                  id="nombre"
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  value={form.nombre}
                  required
                  onChange={(e) =>
                    setForm({ ...form, nombre: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefono">Teléfono *</label>
                <input
                  id="telefono"
                  type="tel"
                  placeholder="Ej: 9992345674"
                  value={form.telefono}
                  required
                  onChange={(e) =>
                    setForm({ ...form, telefono: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Ej: cliente@email.com"
                  value={form.email}
                  required
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="fecha">Fecha de registro</label>
                <input
                  id="fecha"
                  type="text"
                  value={form.fecha}
                  readOnly
                  className="fecha-input"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="direccion">Dirección *</label>
                <input
                  id="direccion"
                  type="text"
                  placeholder="Ej: Calle 23 #456, Centro, Centro, Mérida, 97000 #123"
                  value={form.direccion}
                  required
                  onChange={(e) =>
                    setForm({ ...form, direccion: e.target.value })
                  }
                />
              </div>

              {/* ✅ SECCIÓN PARA SUBIR IMAGEN CON BOTÓN DENTRO */}
              <div className="form-group full-width">
                <label htmlFor="imagen">Foto del cliente</label>
                
                <div className="file-input-wrapper">
                  <input
                    id="imagen"
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  
                  {previewImagen && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="btn-remove-image-inside"
                      title="Eliminar imagen"
                    >
                      ×
                    </button>
                  )}
                </div>
                
                <small className="file-hint">
                  Formatos: JPG, PNG, GIF, WEBP (Máx. 5MB)
                </small>
                
                {previewImagen && (
                  <div className="image-preview-container">
                    <img 
                      src={previewImagen} 
                      alt="Vista previa" 
                      className="image-preview"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="form-buttons">
              <button 
                type="submit" 
                className="btn-gold"
                disabled={uploading}
              >
                {uploading ? 'Guardando...' : 'Guardar Cliente'}
              </button>

              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/clientes")}
                disabled={uploading}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClienteNuevo;