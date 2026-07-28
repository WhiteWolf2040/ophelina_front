import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Inventario.css";
import inventarioService from "../services/inventarioService";

// ✅ NUEVO: mismos datos de Cloudinary que ya usa TiendaOnline.jsx, para
// que la subida de imágenes de inventario sea consistente con la de tienda.
const CLOUDINARY_CLOUD_NAME = "mbeup6wz";
const CLOUDINARY_UPLOAD_PRESET = "ophelina_productos";

const subirImagenACloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  // Carpeta separada de "productos" (tienda) para no mezclar ambos usos
  // dentro de tu cuenta de Cloudinary.
  formData.append("folder", "inventario");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    throw new Error("Error al subir la imagen a Cloudinary");
  }

  const data = await response.json();
  return data.secure_url;
};

const NuevoInventario = () => {
  const navigate = useNavigate();
  const inputImagenRef = useRef(null);

  // ✅ CORREGIDO: los nombres de estos campos ahora son EXACTAMENTE los que
  // espera PrendaController@store (descripcion, tipo, material, peso_gramos,
  // valor_estimado, estado), para no tener que "traducir" nada antes de
  // mandarlo al backend.
  const [form, setForm] = useState({
    descripcion: "",
    tipo: "",
    material: "",
    peso_gramos: "",
    valor_estimado: "",
    estado: "Disponible",
  });

  // ✅ CORREGIDO: ahora sí se sube a Cloudinary. Se guarda el File real
  // (imagen) para subirlo en el submit, y previewImagen es solo para
  // mostrarlo antes de guardar (URL temporal del navegador).
  const [imagen, setImagen] = useState(null);
  const [previewImagen, setPreviewImagen] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  // ✅ CORREGIDO: estos valores deben coincidir letra por letra (con acentos)
  // con el CHECK constraint "prendas_tipo_check" de tu tabla `prendas`:
  //   ARRAY['Joyería','Electrónica','Relojes','Herramientas','Instrumentos','Otros']
  // Antes decía "Electrónico" (sin acento en la "o" final) y le faltaba
  // "Instrumentos" — cualquiera de las dos cosas hubiera hecho que Postgres
  // rechazara el insert con un error de constraint.
  const categorias = ["Joyería", "Electrónica", "Relojes", "Herramientas", "Instrumentos", "Otros"];

  // ✅ Igual, deben coincidir con "prendas_estado_check". "Apartado" se deja
  // fuera a propósito: no tiene sentido crear una prenda nueva ya apartada.
  const estados = ["Disponible", "En Empeño", "Vendido", "Vencido"];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!tiposPermitidos.includes(file.type)) {
        alert('Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)');
        e.target.value = '';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        e.target.value = '';
        return;
      }

      setImagen(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImagen(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagen(null);
    setPreviewImagen("");
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError("");

    try {
      // ✅ NUEVO: si el usuario seleccionó una imagen, se sube primero a
      // Cloudinary (igual que en TiendaOnline.jsx) y se manda la URL
      // resultante al backend. La tabla `prendas` ya tiene su propia
      // columna `imagen_url`, así que no se necesita nada como la tabla
      // imagen_prenda que usa la tienda.
      let imagenUrl = null;
      if (imagen) {
        imagenUrl = await subirImagenACloudinary(imagen);
      }

      const datos = {
        descripcion: form.descripcion,
        tipo: form.tipo,
        material: form.material || null,
        peso_gramos: form.peso_gramos || null,
        valor_estimado: form.valor_estimado,
        estado: form.estado,
      };

      if (imagenUrl) {
        datos.imagen_url = imagenUrl;
      }

      await inventarioService.crearPrenda(datos);

      navigate("/inventario");
    } catch (err) {
      console.error('Error al guardar:', err);
      const mensaje = err.response?.data?.message || err.message || 'Error al guardar la prenda';
      setError(mensaje);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <>
      <div className="header-container">
        <h2>Nueva Prenda</h2>
      </div>

      <div className="form-card">
        {error && (
          <div className="error-message" style={{ marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Nombre de la prenda *</label>
            <input
              name="descripcion"
              placeholder="Ej: Anillo de oro 14k"
              value={form.descripcion}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Categoría *</label>
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Valor estimado *</label>
            <input
              name="valor_estimado"
              type="number"
              placeholder="Ej: 7000"
              value={form.valor_estimado}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Estado *</label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              required
            >
              {estados.map((est) => (
                <option key={est} value={est}>{est}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Peso en gramos (opcional)</label>
            <input
              name="peso_gramos"
              type="number"
              step="0.01"
              placeholder="Ej: 15.5"
              value={form.peso_gramos}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Material (opcional)</label>
            <input
              name="material"
              placeholder="Ej: ORO, PLATA, ACERO, etc."
              value={form.material}
              onChange={handleChange}
            />
          </div>

          {/* CAMPO DE IMAGEN — ahora sí se sube a Cloudinary en el submit */}
          <div className="form-group full-width">
            <label>Imagen del producto</label>
            <input
              type="file"
              name="imagen"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              className="file-input"
              ref={inputImagenRef}
            />
            <small className="file-hint">
              Formatos: JPG, PNG, GIF, WEBP | Máx: 5MB
            </small>

            {previewImagen && (
              <div className="image-preview-container">
                <img
                  src={previewImagen}
                  alt="Vista previa"
                  className="image-preview"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="btn-remove-image"
                >
                  Eliminar imagen
                </button>
              </div>
            )}
          </div>

          <div className="form-buttons">
            <button
              type="submit"
              className="btn-gold"
              disabled={guardando}
            >
              {guardando ? 'Guardando...' : 'Guardar Prenda'}
            </button>

            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/inventario")}
              disabled={guardando}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NuevoInventario;