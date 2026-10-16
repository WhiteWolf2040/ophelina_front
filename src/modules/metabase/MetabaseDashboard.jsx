import { useEffect, useState } from "react";
import api from "../../config/api"; // tu instancia de axios/fetch con auth

const METABASE_URL = import.meta.env.VITE_METABASE_URL || "http://localhost:3000";

function cargarMetabase() {
  // La config debe existir ANTES de cargar embed.js
  window.metabaseConfig = {
  theme: {
    preset: "light",
    fontFamily: "Inter",
    colors: {
      brand: "#1e3a8a",
      background: "#f3efe8",
    },
  },
  isGuest: true,
  instanceUrl: METABASE_URL,
};

  if (document.getElementById("metabase-embed-js")) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = "metabase-embed-js";
    script.src = `${METABASE_URL}/app/embed.js`;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export default function MetabaseDashboard() {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        await cargarMetabase();
        const { data } = await api.get("/metabase/token");
        setToken(data.token);
      } catch (e) {
        setError("No se pudo cargar el dashboard de Metabase");
      }
    })();
  }, []);

  if (error) return <p>{error}</p>;
  if (!token) return <p>Cargando dashboard...</p>;

return (
  <div style={{ padding: "24px", maxWidth: 1400, margin: "0 auto" }}>
    <h2 style={{ marginBottom: 16 }}>Dashboard analítico</h2>
    <metabase-dashboard
      token={token}
      with-title="false"
      with-downloads="true"
      style={{ display: "block", width: "100%" }}
    />
  </div>
);
}