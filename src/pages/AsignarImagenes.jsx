// src/pages/AsignarImagenes.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import "./DuenoInventario/Inventario.css";

const CLOUDINARY_CLOUD_NAME = "mbeup6wz";
const CLOUDINARY_UPLOAD_PRESET = "ophelina_productos";

const subirImagenACloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", "prendas");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) throw new Error("Error al subir imagen a Cloudinary");

  const data = await response.json();
  return data.secure_url;
};

export default function AsignarImagenes() {
  const navigate = useNavigate();
  const [prendas, setPrendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [archivos, setArchivos] = useState({}); // { id_prenda: File }
  const [previews, setPrevious] = useState({}); // { id_prenda: objectURL }
  const [guardando, setGuardando] = useState(false);
  const [progreso, setProgreso] = useState({ total: 0, hechos: 0 });
  const [soloSinImagen, setSoloSinImagen] = useState(true);

  useEffect(() => {
    cargarPrendas();
  }, []);

  useEffect(() => {
    // limpieza de las URLs temporales al desmontar
    return () => {
      Object.values(previews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const cargarPrendas = async () => {
    try {
      setLoading(true);
      const response = await api.get("/prendas");
      setPrendas(response.data.data || []);
    } catch (err) {
      console.error("Error cargando prendas:", err);
    } finally {
      setLoading(false);
    }
  };

  const prendasVisibles = soloSinImagen
    ? prendas.filter((p) => !p.imagen_url)
    : prendas;

  const handleSeleccionarArchivo = (idPrenda, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("El archivo debe ser una imagen");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no debe superar los 5MB");
      return;
    }

    if (previews[idPrenda]) {
      URL.revokeObjectURL(previews[idPrenda]);
    }

    setArchivos((prev) => ({ ...prev, [idPrenda]: file }));
    setPrevious((prev) => ({ ...prev, [idPrenda]: URL.createObjectURL(file) }));
  };

  const quitarArchivo = (idPrenda) => {
    if (previews[idPrenda]) URL.revokeObjectURL(previews[idPrenda]);
    setArchivos((prev) => {
      const copia = { ...prev };
      delete copia[idPrenda];
      return copia;
    });
    setPrevious((prev) => {
      const copia = { ...prev };
      delete copia[idPrenda];
      return copia;
    });
  };

  const totalSeleccionados = Object.keys(archivos).length;

  const guardarTodo = async () => {
    if (totalSeleccionados === 0) {
      alert("Selecciona al menos una imagen para asignar");
      return;
    }

    setGuardando(true);
    setProgreso({ total: totalSeleccionados, hechos: 0 });

    try {
      const entradas = Object.entries(archivos);

      // Sube todas las imágenes a Cloudinary en paralelo, actualizando
      // el contador de progreso conforme cada una termina.
      const resultados = await Promise.allSettled(
        entradas.map(async ([idPrenda, file]) => {
          const url = await subirImagenACloudinary(file);
          setProgreso((prev) => ({ ...prev, hechos: prev.hechos + 1 }));
          return { id_prenda: Number(idPrenda), imagen_url: url };
        })
      );

      const exitosas = resultados
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);

      const fallidas = resultados.filter((r) => r.status === "rejected");

      if (exitosas.length === 0) {
        alert("No se pudo subir ninguna imagen. Intenta de nuevo.");
        return;
      }

      // Un solo request al backend con todas las asignaciones ya resueltas
      const response = await api.post("/prendas/bulk-imagenes", {
        asignaciones: exitosas,
      });

      if (fallidas.length > 0) {
        alert(
          `Se asignaron ${response.data.asignados} imágenes correctamente. ` +
          `${fallidas.length} fallaron al subirse a Cloudinary, intenta con esas de nuevo.`
        );
      } else {
        alert(`✅ ${response.data.asignados} imágenes asignadas correctamente`);
      }

      setArchivos({});
      setPrevious({});
      await cargarPrendas();

    } catch (err) {
      console.error("Error en carga masiva:", err);
      alert("Error al guardar las imágenes: " + (err.response?.data?.message || err.message));
    } finally {
      setGuardando(false);
      setProgreso({ total: 0, hechos: 0 });
    }
  };

  if (loading) {
    return <div className="loading">Cargando prendas...</div>;
  }

  return (
    <div className="content">
      <div className="header-container">
        <div className="tienda-header">
          <h1>Asignar imágenes masivamente</h1>
          <p className="header-sub">
            Selecciona una foto por cada prenda y guarda todo de un jalón
          </p>
        </div>
        <button className="btn-nuevo" onClick={() => navigate("/inventario")}>
          Volver a Inventario
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "16px 0" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={soloSinImagen}
            onChange={(e) => setSoloSinImagen(e.target.checked)}
          />
          Mostrar solo prendas sin imagen
        </label>

        <span style={{ color: "#666" }}>
          {prendasVisibles.length} prenda(s) · {totalSeleccionados} seleccionada(s) para subir
        </span>
      </div>

      {guardando && (
        <div style={{ background: "#fef3c7", padding: "10px 16px", borderRadius: "8px", marginBottom: "16px" }}>
          Subiendo imágenes... {progreso.hechos}/{progreso.total}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        {prendasVisibles.map((prenda) => {
          const idPrenda = prenda.id_prenda;
          const previewLocal = previews[idPrenda];
          const yaAsignada = !previewLocal && prenda.imagen_url;

          return (
            <div
              key={idPrenda}
              style={{
                border: archivos[idPrenda] ? "2px solid #27ae60" : "1px solid #e5e5e5",
                borderRadius: "10px",
                padding: "10px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "140px",
                  background: "#f5f5f5",
                  borderRadius: "8px",
                  overflow: "hidden",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {previewLocal ? (
                  <img src={previewLocal} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : yaAsignada ? (
                  <img src={prenda.imagen_url} alt={prenda.descripcion} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ color: "#aaa", fontSize: "13px" }}>Sin imagen</span>
                )}
              </div>

              <strong style={{ display: "block", fontSize: "13px", marginBottom: "4px" }}>
                {prenda.descripcion}
              </strong>
              <span style={{ fontSize: "11px", color: "#888" }}>{prenda.codigo_barras}</span>

              <div style={{ marginTop: "8px" }}>
                <input
                  type="file"
                  accept="image/*"
                  id={`file-${idPrenda}`}
                  style={{ display: "none" }}
                  onChange={(e) => handleSeleccionarArchivo(idPrenda, e)}
                />
                <label
                  htmlFor={`file-${idPrenda}`}
                  style={{
                    display: "inline-block",
                    padding: "6px 10px",
                    background: "#f0f0f0",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  {archivos[idPrenda] ? "Cambiar" : "Elegir foto"}
                </label>

                {archivos[idPrenda] && (
                  <button
                    onClick={() => quitarArchivo(idPrenda)}
                    style={{
                      marginLeft: "6px",
                      background: "none",
                      border: "none",
                      color: "#c0392b",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    Quitar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {prendasVisibles.length === 0 && (
        <p style={{ textAlign: "center", color: "#888", marginTop: "40px" }}>
          🎉 Todas las prendas ya tienen imagen asignada
        </p>
      )}

      {totalSeleccionados > 0 && (
        <div
          style={{
            position: "sticky",
            bottom: "16px",
            marginTop: "24px",
            textAlign: "center",
          }}
        >
          <button
            className="btn-nuevo"
            onClick={guardarTodo}
            disabled={guardando}
            style={{ padding: "12px 32px", fontSize: "15px" }}
          >
            {guardando
              ? `Guardando... (${progreso.hechos}/${progreso.total})`
              : `Guardar y asignar ${totalSeleccionados} imagen(es)`}
          </button>
        </div>
      )}
    </div>
  );
}