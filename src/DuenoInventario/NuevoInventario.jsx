import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "./Inventario.css";

const NuevoInventario = () => {
  const navigate = useNavigate();
  const { agregarPrenda } = useOutletContext();

  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    valor: "",
    estado: "Disponible",
    descripcion: "",
    material: "", // Cambié "cliente" por "material" para que tenga más sentido
  });

  // Estados para la imagen
  const [imagen, setImagen] = useState(null);
  const [previewImagen, setPreviewImagen] = useState("");
  const [uploading, setUploading] = useState(false);

  const categorias = ["Joyería", "Electrónico", "Relojes", "Herramientas", "Otros"];
  const estados = ["Disponible", "En Empeño", "Vendido", "Vencido"];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

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
      // Aquí puedes enviar los datos a tu backend
      // Si tu backend espera FormData (para archivos):
      const formData = new FormData();
      formData.append('nombre', form.nombre);
      formData.append('categoria', form.categoria);
      formData.append('valor', form.valor);
      formData.append('estado', form.estado);
      formData.append('descripcion', form.descripcion);
      formData.append('material', form.material);
      
      if (imagen) {
        formData.append('imagen', imagen);
      }

      // Simular envío (reemplaza con tu llamada real a la API)
      console.log('Datos a guardar:', Object.fromEntries(formData));
      
      // Llamar a la función del contexto (si existe)
      agregarPrenda({ 
        ...form, 
        material: form.material,
        imagen: previewImagen // Guardar la preview o la URL de la imagen
      });
      
      navigate("/inventario");
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar la prenda');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="header-container">
        <h2>Nueva Prenda</h2>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Nombre de la prenda *</label>
            <input
              name="nombre"
              placeholder="Ej: Anillo de oro 14k"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Categoría *</label>
            <select
              name="categoria"
              value={form.categoria}
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
              name="valor"
              type="number"
              placeholder="Ej: 7000"
              value={form.valor}
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
            <label>Material (opcional)</label>
            <input
              name="material" // Cambié de "cliente" a "material"
              placeholder="Ej: ORO, PLATA, ACERO, etc."
              value={form.material}
              onChange={handleChange}
            />
          </div>

          {/* CAMPO DE IMAGEN MEJORADO */}
          <div className="form-group full-width">
            <label>Imagen del producto</label>
            <input
              type="file"
              name="imagen"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              className="file-input"
            />
            <small className="file-hint">
              Formatos: JPG, PNG, GIF, WEBP | Máx: 5MB
            </small>
            
            {/* Vista previa */}
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

          <div className="form-group full-width">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              placeholder="Describe la prenda, características, estado físico, etc."
              value={form.descripcion}
              onChange={handleChange}
              rows="4"
              className="textarea-input"
            />
          </div>

          <div className="form-buttons">
            <button 
              type="submit" 
              className="btn-gold"
              disabled={uploading}
            >
              {uploading ? 'Guardando...' : 'Guardar Prenda'}
            </button>

            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/inventario")}
              disabled={uploading}
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