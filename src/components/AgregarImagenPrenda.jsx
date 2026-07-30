import { useState, useRef } from "react";
import api from '../config/api';
import { subirImagenACloudinary } from '../utils/cloudinary';

const AgregarImagenPrenda = ({ idPrenda, imagenActual, onImagenActualizada }) => {
  const [subiendo, setSubiendo] = useState(false);
  const inputRef = useRef(null);

  const handleArchivo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("El archivo debe ser una imagen (jpg, png, etc.)");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no debe superar los 5MB");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    try {
      setSubiendo(true);
      const imagenUrl = await subirImagenACloudinary(file, "empenos");
      await api.post(`/prendas/${idPrenda}/imagen`, { imagen_url: imagenUrl });
      onImagenActualizada(imagenUrl);
    } catch (err) {
      console.error("Error al subir imagen:", err);
      alert("Error al subir la imagen: " + (err.response?.data?.message || err.message));
    } finally {
      setSubiendo(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {imagenActual ? (
        <img
          src={imagenActual}
          alt="Prenda"
          style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", border: "1px solid #e9ecef" }}
        />
      ) : (
        <span style={{ fontSize: 11, color: "#999" }}>Sin imagen</span>
      )}

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleArchivo}
        style={{ display: "none" }}
        id={`img-prenda-${idPrenda}`}
        disabled={subiendo}
      />
      <label
        htmlFor={`img-prenda-${idPrenda}`}
        style={{
          cursor: subiendo ? "wait" : "pointer",
          color: "#f59e0b",
          fontSize: 12,
          fontWeight: 500,
          whiteSpace: "nowrap"
        }}
      >
        {subiendo ? "Subiendo..." : imagenActual ? "Cambiar" : "Agregar"}
      </label>
    </div>
  );
};

export default AgregarImagenPrenda;