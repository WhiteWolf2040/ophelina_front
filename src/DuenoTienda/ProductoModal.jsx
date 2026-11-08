// components/ProductoModal.jsx
import React, { useState, useEffect, useRef } from "react";
import "./ProductoModal.css";

// Iconos
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import SellIcon from '@mui/icons-material/Sell';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import BoxIcon from '@mui/icons-material/Inventory';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ProductoModal = ({
  isOpen,
  onClose,
  onSave,
  producto = null,
  guardando = false,
  onError
}) => {
  const modoEdicion = !!producto;

  // ========== ESTADOS DEL FORM ==========
  const [form, setForm] = useState({
    nombre: "",
    categoria: "Joyería",
    precio: "",
    descuento: "0",
    stock: "1",
    descripcion: "",
    estado: "Buen estado",
    visible: true,
    destacado: false
  });

  const [archivoImagen, setArchivoImagen] = useState(null);
  const [previewImagen, setPreviewImagen] = useState(null);
  const inputImagenRef = useRef(null);

  const categorias = ["Joyería", "Electrónica", "Herramientas", "Relojes", "Instrumentos", "Otros"];
  const estados = ["Nuevo", "Como nuevo", "Buen estado", "Aceptable"];

  // ========== SINCRONIZAR CON PRODUCTO ==========
  useEffect(() => {
    if (!isOpen) return;

    if (producto) {
      setForm({
        nombre: producto.nombre || "",
        categoria: producto.categoria || "Joyería",
        precio: producto.precio || "",
        descuento: producto.descuento || 0,
        stock: producto.stock || 1,
        descripcion: producto.descripcion || "",
        estado: producto.estado_producto || producto.estado || "Buen estado",
        visible: producto.visible !== undefined ? producto.visible : true,
        destacado: producto.destacado || false
      });
      setPreviewImagen(producto.imagen_url || producto.imagen_principal || null);
    } else {
      setForm({
        nombre: "",
        categoria: "Joyería",
        precio: "",
        descuento: "0",
        stock: "1",
        descripcion: "",
        estado: "Buen estado",
        visible: true,
        destacado: false
      });
      setPreviewImagen(null);
    }
    setArchivoImagen(null);
    if (inputImagenRef.current) inputImagenRef.current.value = "";
  }, [isOpen, producto]);

  // ========== LIMPIAR PREVIEW AL DESMONTAR ==========
  useEffect(() => {
    return () => {
      if (previewImagen && previewImagen.startsWith('blob:')) {
        URL.revokeObjectURL(previewImagen);
      }
    };
  }, [previewImagen]);

  // ========== MANEJADORES ==========
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleImagenSeleccionada = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onError?.({
        title: "Archivo inválido",
        message: "El archivo debe ser una imagen (jpg, png, gif, etc.)"
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      onError?.({
        title: "Imagen muy grande",
        message: "La imagen no debe superar los 5MB. Intenta comprimirla."
      });
      return;
    }

    if (previewImagen && previewImagen.startsWith('blob:')) {
      URL.revokeObjectURL(previewImagen);
    }
    setArchivoImagen(file);
    setPreviewImagen(URL.createObjectURL(file));
  };

  const limpiarImagen = () => {
    setArchivoImagen(null);
    if (previewImagen && previewImagen.startsWith('blob:')) {
      URL.revokeObjectURL(previewImagen);
    }
    setPreviewImagen(null);
    if (inputImagenRef.current) inputImagenRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      form,
      archivoImagen,
      modoEdicion,
      producto
    });
  };

  if (!isOpen) return null;

  return (
    <div className="producto-modal-overlay" onClick={onClose}>
      <div
        className="producto-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Botón cerrar */}
        <button
          className="producto-modal-cerrar"
          onClick={onClose}
          aria-label="Cerrar"
          disabled={guardando}
          type="button"
        >
          <CloseIcon />
        </button>

        {/* Header */}
        <div className="producto-modal-header">
          <h2>
            {modoEdicion ? <EditIcon className="producto-modal-icon" /> : <AddIcon className="producto-modal-icon" />}
            {modoEdicion ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <span className="producto-modal-badge">
            {modoEdicion ? "Actualizar información" : "Agregar a la tienda"}
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="producto-modal-body">
            <div className="producto-form-grid">

              {/* Nombre */}
              <div className="producto-form-group">
                <label><SellIcon fontSize="small" /> Nombre del producto *</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Anillo de Oro 18k"
                  disabled={guardando}
                />
              </div>

              {/* Categoría */}
              <div className="producto-form-group">
                <label><CategoryIcon fontSize="small" /> Categoría *</label>
                <select
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  required
                  disabled={guardando}
                >
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Precio */}
              <div className="producto-form-group">
                <label><AttachMoneyIcon fontSize="small" /> Precio ($) *</label>
                <input
                  type="number"
                  name="precio"
                  value={form.precio}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0"
                  disabled={guardando}
                />
              </div>

              {/* Descuento */}
              <div className="producto-form-group">
                <label><LocalOfferIcon fontSize="small" /> Descuento (%)</label>
                <input
                  type="number"
                  name="descuento"
                  value={form.descuento}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  placeholder="0"
                  disabled={guardando}
                />
              </div>

              {/* Stock */}
              <div className="producto-form-group">
                <label><BoxIcon fontSize="small" /> Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="1"
                  disabled={guardando}
                />
              </div>

              {/* Estado */}
              <div className="producto-form-group">
                <label>Estado *</label>
                <select
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  required
                  disabled={guardando}
                >
                  {estados.map(est => (
                    <option key={est} value={est}>{est}</option>
                  ))}
                </select>
              </div>

              {/* Imagen */}
              <div className="producto-form-group producto-form-full">
                <label><ImageIcon fontSize="small" /> Imagen del producto</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={inputImagenRef}
                  onChange={handleImagenSeleccionada}
                  style={{ display: "none" }}
                  id="input-imagen-producto"
                  disabled={guardando}
                />
                <label
                  htmlFor="input-imagen-producto"
                  className="producto-btn-subir-imagen"
                >
                  <CloudUploadIcon fontSize="small" />
                  {archivoImagen ? archivoImagen.name : "Seleccionar imagen desde tu equipo"}
                </label>

                {previewImagen && (
                  <div className="producto-preview-imagen">
                    <img src={previewImagen} alt="Vista previa" />
                    <button
                      type="button"
                      onClick={limpiarImagen}
                      className="producto-btn-quitar-imagen"
                      disabled={guardando}
                    >
                      Quitar imagen
                    </button>
                  </div>
                )}
              </div>

              {/* Descripción */}
              <div className="producto-form-group producto-form-full">
                <label><DescriptionIcon fontSize="small" /> Descripción</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe el producto, características, condición..."
                  disabled={guardando}
                />
              </div>

              {/* Checkboxes */}
              <div className="producto-form-group producto-form-checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="visible"
                    checked={form.visible}
                    onChange={handleChange}
                    disabled={guardando}
                  />
                  {form.visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  Producto visible en tienda
                </label>
              </div>

              <div className="producto-form-group producto-form-checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="destacado"
                    checked={form.destacado}
                    onChange={handleChange}
                    disabled={guardando}
                  />
                  {form.destacado ? <StarIcon /> : <StarBorderIcon />}
                  Marcar como destacado
                </label>
              </div>

            </div>
          </div>

          {/* Acciones */}
          <div className="producto-modal-acciones">
            <button
              type="button"
              className="producto-btn-cancelar"
              onClick={onClose}
              disabled={guardando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="producto-btn-guardar"
              disabled={guardando}
            >
              {guardando ? (
                <>
                  <span className="producto-spinner"></span>
                  Guardando...
                </>
              ) : (
                <>
                  {modoEdicion ? <EditIcon /> : <AddIcon />}
                  {modoEdicion ? "Guardar Cambios" : "Crear Producto"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductoModal;