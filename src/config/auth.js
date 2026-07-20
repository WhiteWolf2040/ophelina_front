// frontend/src/config/auth.js

import api from "./api";

/*
==============================
GUARDAR SESIÓN
==============================
*/

const setAuthData = (token, usuario) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(usuario));
  localStorage.setItem("rol", usuario.rol);
  
  // ============================================
  // 🔥 AGREGAR ESTAS DOS LÍNEAS 🔥
  // ============================================
  if (usuario.id_empresa) {
    localStorage.setItem("empresa_id", usuario.id_empresa);
  }
  if (usuario.correo) {
    localStorage.setItem("user_email", usuario.correo);
  }
};

/*
==============================
ELIMINAR SESIÓN
==============================
*/

const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("rol");
  localStorage.removeItem("empresa_id");   // ← AGREGAR
  localStorage.removeItem("user_email");   // ← AGREGAR
};

/*
==============================
OBTENER USUARIO ACTUAL
==============================
*/

const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

/*
==============================
VERIFICAR SI ESTÁ LOGUEADO
==============================
*/

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

/*
==============================
LOGIN
==============================
*/

const login = async (correo, contrasena) => {
  try {

    const response = await api.post("/login", {
      correo: correo,
      contrasena: contrasena
    });

    if (response.data.success) {

      const { token, usuario } = response.data.data;

      setAuthData(token, usuario);

      return {
        success: true,
        data: usuario
      };

    }

    return {
      success: false,
      message: response.data.message
    };

  } catch (error) {

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Error de conexión con el servidor"
    };

  }
};

/*
==============================
LOGOUT
==============================
*/

const logout = async () => {
  try {

    await api.post("/logout");

  } catch (error) {

    console.error("Error cerrando sesión:", error);

  } finally {

    clearAuthData();

  }
};

/*
==============================
OBTENER USUARIO DESDE API
==============================
*/

const fetchCurrentUser = async () => {
  try {

    const response = await api.get("/user");

    if (response.data.success) {

      const usuario = response.data.data.usuario;

      localStorage.setItem("user", JSON.stringify(usuario));
      
      // 🔥 También actualizar empresa_id si viene
      if (usuario.id_empresa) {
        localStorage.setItem("empresa_id", usuario.id_empresa);
      }
      if (usuario.correo) {
        localStorage.setItem("user_email", usuario.correo);
      }

      return usuario;

    }

    return null;

  } catch (error) {

    return null;

  }
};

/*
==============================
ACTUALIZAR PERFIL (correo y teléfono)
==============================
*/

const updateProfile = async (correo, telefono) => {
  try {

    const response = await api.put("/user", { correo, telefono });

    if (response.data.success) {

      const usuarioActualizado = response.data.data.usuario;

      // Actualizamos el usuario guardado en localStorage con los nuevos datos
      const usuarioActual = getCurrentUser();
      const usuarioFinal = { ...usuarioActual, ...usuarioActualizado };
      localStorage.setItem("user", JSON.stringify(usuarioFinal));

      return { success: true, data: usuarioFinal };

    }

    return { success: false, message: response.data.message };

  } catch (error) {

    return {
      success: false,
      message: error.response?.data?.message || "Error al actualizar el perfil"
    };

  }
};

/*
==============================
OBTENER NOTIFICACIONES
==============================
*/

const getNotificaciones = async () => {
  try {

    const response = await api.get("/notificaciones");

    if (response.data.success) {

      return { success: true, data: response.data.data };

    }

    return { success: false, data: [] };

  } catch (error) {

    return { success: false, data: [] };

  }
};

/*
==============================
OBTENER MIS EMPEÑOS
==============================
*/

const getMisEmpenos = async () => {
  try {

    const response = await api.get("/cliente/empenos");

    if (response.data.success) {

      return { success: true, data: response.data.data };

    }

    return { success: false, data: [], message: response.data.message };

  } catch (error) {

    return {
      success: false,
      data: [],
      message: error.response?.data?.message || "Error al obtener tus empeños",
    };

  }
};

/*
==============================
VERIFICAR ROL
==============================
*/

const hasRole = (rol) => {
  const user = getCurrentUser();

  if (!user) return false;

  return user.rol === rol;
};

/*
==============================
VERIFICAR PERMISOS
==============================
*/

const hasPermission = (permiso) => {

  const user = getCurrentUser();

  if (!user || !user.permisos) return false;

  return user.permisos.some(p => p.nombre === permiso);

};


/*
==============================
EXPORTACIONES
==============================
*/

export {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  fetchCurrentUser,
  hasPermission,
  hasRole,
  setAuthData,
  clearAuthData,
  updateProfile,
  getNotificaciones,
  getMisEmpenos
};
