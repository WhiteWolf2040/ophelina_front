import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Clientes.css";
import clientesService from "../services/clientesService";

const ClienteNuevo = ({ agregarCliente }) => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  const [fotoCliente, setFotoCliente] = useState(null);
  const [previewCliente, setPreviewCliente] = useState("");

  const [fotoIne, setFotoIne] = useState(null);
  const [previewIne, setPreviewIne] = useState("");

  const [form, setForm] = useState({
    nombre: "",
     apellido: "", 
    telefono: "",
    email: "",
    direccion: "",
  
  codigo_postal: "",
  ciudad: "",
  estado: "",

  tipo_identificacion: "",
  numero_identificacion: "",
  fecha: new Date().toLocaleDateString(),
  });



  const handleFileChange = (e, tipo) => {
    const file = e.target.files[0];
    if (!file) return;

    const tiposPermitidos = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!tiposPermitidos.includes(file.type)) {
      alert("Solo se permiten imágenes");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Máximo 5MB");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      if (tipo === "cliente") {
        setFotoCliente(file);
        setPreviewCliente(reader.result);
      }

      if (tipo === "ine") {
        setFotoIne(file);
        setPreviewIne(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (tipo) => {
    if (tipo === "cliente") {
      setFotoCliente(null);
      setPreviewCliente("");
    }

    if (tipo === "ine") {
      setFotoIne(null);
      setPreviewIne("");
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setUploading(true);

  try {
    const formData = new FormData();

    formData.append("nombre", form.nombre);
    formData.append("telefono", form.telefono);
    formData.append("correo", form.email);
    formData.append("direccion", form.direccion);
    
    formData.append("codigo_postal", form.codigo_postal);
    formData.append("ciudad", form.ciudad);
    formData.append("estado", form.estado);
      formData.append("tipo_identificacion", form.tipo_identificacion);
    formData.append("numero_identificacion", form.numero_identificacion);

    if (fotoCliente) {
      formData.append("foto_perfil", fotoCliente);
    }

    if (fotoIne) {
      formData.append("foto_ine", fotoIne);
    }

    await clientesService.crearCliente(formData);

    navigate("/clientes");

  } catch (error) {
    console.error("Error guardando cliente", error);
    alert("Error al guardar cliente");
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

              {/* NOMBRE */}
              <div className="form-group">
                <label>Nombre completo *</label>
                <input
                  type="text"
                  value={form.nombre}
                  required
                  onChange={(e) =>
                    setForm({ ...form, nombre: e.target.value })
                  }
                />
              </div>
              {/* Apellido */}
              <div className="form-group">
                <label>Apellido</label>
                <input
                  type="text"
                  value={form.apellido}
                  onChange={(e) => setForm({...form, apellido: e.target.value})}
                  placeholder="Apellido"
                />
              </div>

              {/* TELEFONO */}
              <div className="form-group">
                <label>Teléfono *</label>
                <input
                  type="tel"
                  value={form.telefono}
                  required
                  onChange={(e) =>
                    setForm({ ...form, telefono: e.target.value })
                  }
                />
              </div>

              {/* EMAIL */}
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={form.email}
                  required
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>

              {/* FECHA */}
              <div className="form-group">
                <label>Fecha</label>
                <input value={form.fecha} readOnly />
              </div>

              {/* IDENTIFICACION */}
              <div className="form-group">
                <label>Tipo de identificación</label>
                <select
                  value={form.tipo_identificacion}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tipo_identificacion: e.target.value,
                    })
                  }
                >
                  <option value="">Seleccione</option>
                  <option value="INE">INE</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="Licencia">Licencia</option>
                </select>
              </div>

              {/* NUMERO */}
              <div className="form-group">
                <label>Número de identificación</label>
                <input
                  value={form.numero_identificacion}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      numero_identificacion: e.target.value,
                    })
                  }
                />
              </div>

              {/* DIRECCION */}
                <div className="form-group full-width">
                  <label>Dirección *</label>
                  <input
                    type="text"
                    value={form.direccion}
                    required
                    onChange={(e) => setForm({...form, direccion: e.target.value})}
                    placeholder="Calle, número, colonia"
                  />
                </div>
           {/* colonia */}
    
                {/* codigo postal */}
          <div className="form-group">
            <label>Código Postal</label>
            <input
              type="text"
              value={form.codigo_postal}
              onChange={(e) => {
                const cp = e.target.value;
                setForm({...form, codigo_postal: cp});
                buscarCodigoPostal(cp); // autocompletar
              }}
              placeholder="Código Postal"
            />
          </div>

                  {/* Ciudad */}

              <div className="form-group">
                <label>Ciudad</label>
                <input
                  type="text"
                  value={form.ciudad}
                  onChange={(e) => setForm({...form, ciudad: e.target.value})}
                  placeholder="Ciudad"
                />
              </div>


                    {/* estado */}

                 <div className="form-group">
                  <label>Estado</label>
                  <input
                    type="text"
                    value={form.estado}
                    onChange={(e) => setForm({...form, estado: e.target.value})}
                    placeholder="Estado"
                  />
                </div>

              {/* FOTO CLIENTE */}
              <div className="form-group full-width">
                <label>Foto del cliente</label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "cliente")}
                />

                {previewCliente && (
                  <div className="image-preview-container">
                    <img
                      src={previewCliente}
                      className="image-preview"
                      alt=""
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage("cliente")}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              {/* FOTO INE */}
              <div className="form-group full-width">
                <label>Foto de la INE</label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "ine")}
                />

                {previewIne && (
                  <div className="image-preview-container">
                    <img
                      src={previewIne}
                      className="image-preview"
                      alt=""
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage("ine")}
                    >
                      ×
                    </button>
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
                {uploading ? "Guardando..." : "Guardar Cliente"}
              </button>

              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/clientes")}
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