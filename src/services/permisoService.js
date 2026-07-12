// src/services/permissionService.js - VERSIÓN FUSIONADA (Docker Base + Mejoras Local)
import api from "../config/api";

const permissionService = {
    // ============================================
    // MÉTODOS PARA CONSULTAR LA API (CRUD de permisos)
    // ============================================
    
    /**
     * Obtener todos los permisos desde la API
     */
    obtenerPermisos: async () => {
        try {
            const response = await api.get('/permisos');
            return response;
        } catch (error) {
            console.error("Error en obtenerPermisos:", error);
            throw error;
        }
    },
    
    /**
     * Obtener permisos agrupados por módulo/categoría
     */
    obtenerPermisosAgrupados: async () => {
        try {
            const response = await api.get('/permisos/agrupados');
            return response;
        } catch (error) {
            console.error("Error en obtenerPermisosAgrupados:", error);
            throw error;
        }
    },
    
    /**
     * Obtener un permiso por ID
     */
    obtenerPermiso: async (id) => {
        try {
            const response = await api.get(`/permisos/${id}`);
            return response;
        } catch (error) {
            console.error(`Error en obtenerPermiso ${id}:`, error);
            throw error;
        }
    },
    
    /**
     * Crear nuevo permiso
     */
    crearPermiso: async (data) => {
        try {
            const response = await api.post('/permisos', data);
            return response;
        } catch (error) {
            console.error("Error en crearPermiso:", error);
            throw error;
        }
    },
    
    /**
     * Actualizar permiso
     */
    actualizarPermiso: async (id, data) => {
        try {
            const response = await api.put(`/permisos/${id}`, data);
            return response;
        } catch (error) {
            console.error(`Error en actualizarPermiso ${id}:`, error);
            throw error;
        }
    },
    
    /**
     * Eliminar permiso
     */
    eliminarPermiso: async (id) => {
        try {
            const response = await api.delete(`/permisos/${id}`);
            return response;
        } catch (error) {
            console.error(`Error en eliminarPermiso ${id}:`, error);
            throw error;
        }
    },
    
    /**
     * Cambiar estado de un permiso (activo/inactivo)
     */
    cambiarEstadoPermiso: async (id, estado) => {
        try {
            const response = await api.put(`/permisos/${id}`, { estado });
            return response;
        } catch (error) {
            console.error(`Error en cambiarEstadoPermiso ${id}:`, error);
            throw error;
        }
    },
    
    /**
     * Crear múltiples permisos (masivo)
     */
    crearPermisosMasivo: async (permisos) => {
        try {
            const response = await api.post('/permisos/masivo', { permisos });
            return response;
        } catch (error) {
            console.error("Error en crearPermisosMasivo:", error);
            throw error;
        }
    },
    
    /**
     * Eliminar múltiples permisos
     */
    eliminarPermisosMasivo: async (ids) => {
        try {
            const response = await api.delete('/permisos/masivo', { data: { ids } });
            return response;
        } catch (error) {
            console.error("Error en eliminarPermisosMasivo:", error);
            throw error;
        }
    },
    
    /**
     * Obtener permisos por módulo
     */
    obtenerPermisosPorModulo: async (modulo) => {
        try {
            const response = await api.get(`/permisos/modulo/${modulo}`);
            return response;
        } catch (error) {
            console.error(`Error en obtenerPermisosPorModulo ${modulo}:`, error);
            throw error;
        }
    },
    
    /**
     * Obtener estadísticas de permisos
     */
    obtenerEstadisticas: async () => {
        try {
            const response = await api.get('/permisos/estadisticas');
            return response;
        } catch (error) {
            console.error("Error en obtenerEstadisticas:", error);
            throw error;
        }
    },
    
    // ============================================
    // ✅ MÉTODOS PARA PERMISOS DEL USUARIO (LOCALSTORAGE)
    // MEJORADOS CON LA VERSIÓN LOCAL
    // ============================================
    
    /**
     * ✅ AGREGADO DE LOCAL: Convierte módulos a array sin importar el formato original
     * @param {any} modulos - Módulos en cualquier formato (array u objeto)
     * @returns {Array} - Array de módulos
     */
    _normalizeModules: (modulos) => {
        if (!modulos) return [];
        
        // Si ya es un array, devolverlo
        if (Array.isArray(modulos)) return modulos;
        
        // Si es un objeto, extraer valores
        if (typeof modulos === 'object') {
            return Object.values(modulos);
        }
        
        return [];
    },
    
    /**
     * ✅ MEJORADO CON LOCAL: Obtener los módulos a los que tiene acceso el usuario
     * @returns {Array} Lista de módulos (dashboard, clientes, pagos, etc.)
     */
    getModules: () => {
        const modulos = localStorage.getItem('modulos');
        if (!modulos) return [];
        
        try {
            const parsed = JSON.parse(modulos);
            // ✅ Usar normalizeModules para manejar diferentes formatos
            return permissionService._normalizeModules(parsed);
        } catch (e) {
            console.error('Error parsing modulos:', e);
            return [];
        }
    },
    
    /**
     * ✅ MEJORADO CON LOCAL: Verificar si el usuario tiene acceso a un módulo completo
     * @param {string} modulo - Nombre del módulo (dashboard, clientes, pagos, etc.)
     * @returns {boolean}
     */
    canAccessModule: (modulo) => {
        const modulos = permissionService.getModules();
        
        // ✅ Si no hay módulos
        if (!modulos || modulos.length === 0) {
            return false;
        }
        
        return modulos.includes(modulo);
    },
    
    /**
     * ✅ MEJORADO CON LOCAL: Verificar si el usuario tiene un permiso específico
     * @param {string} permission - Nombre del permiso (ej: 'ver_clientes', 'crear_pagos')
     * @returns {boolean}
     */
    hasPermission: (permission) => {
        const permisos = localStorage.getItem('permisos');
        if (!permisos) return false;
        
        try {
            const permisosArray = JSON.parse(permisos);
            
            // ✅ Asegurar que es un array
            if (!Array.isArray(permisosArray)) {
                return false;
            }
            
            return permisosArray.includes(permission);
        } catch (e) {
            console.error('Error parsing permisos:', e);
            return false;
        }
    },
    
    /**
     * ✅ MEJORADO CON LOCAL: Verificar si el usuario tiene alguno de los permisos especificados
     * @param {Array} permissions - Lista de permisos a verificar
     * @returns {boolean}
     */
    hasAnyPermission: (permissions) => {
        const permisos = localStorage.getItem('permisos');
        if (!permisos) return false;
        
        try {
            const permisosArray = JSON.parse(permisos);
            
            // ✅ Asegurar que es un array
            if (!Array.isArray(permisosArray)) {
                return false;
            }
            
            return permissions.some(p => permisosArray.includes(p));
        } catch (e) {
            console.error('Error parsing permisos:', e);
            return false;
        }
    },
    
    /**
     * ✅ MEJORADO CON LOCAL: Verificar si el usuario tiene todos los permisos especificados
     * @param {Array} permissions - Lista de permisos a verificar
     * @returns {boolean}
     */
    hasAllPermissions: (permissions) => {
        const permisos = localStorage.getItem('permisos');
        if (!permisos) return false;
        
        try {
            const permisosArray = JSON.parse(permisos);
            
            // ✅ Asegurar que es un array
            if (!Array.isArray(permisosArray)) {
                return false;
            }
            
            return permissions.every(p => permisosArray.includes(p));
        } catch (e) {
            console.error('Error parsing permisos:', e);
            return false;
        }
    },
    
    /**
     * ✅ MEJORADO CON LOCAL: Obtener todos los permisos del usuario
     * @returns {Array}
     */
    getPermissions: () => {
        const permisos = localStorage.getItem('permisos');
        if (!permisos) return [];
        
        try {
            const parsed = JSON.parse(permisos);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error('Error parsing permisos:', e);
            return [];
        }
    },
    
    /**
     * Obtener el rol del usuario
     * @returns {string|null}
     */
    getUserRole: () => {
        const user = localStorage.getItem('user');
        if (!user) return null;
        
        try {
            const userData = JSON.parse(user);
            return userData.rol || null;
        } catch (e) {
            return null;
        }
    },
    
    /**
     * Verificar si el usuario es administrador
     * @returns {boolean}
     */
    isAdmin: () => {
        const role = permissionService.getUserRole();
        return role === 'Administrador' || role === 'Dueño';
    },
    
    /**
     * ✅ AGREGADO DE LOCAL: Guardar permisos y módulos en localStorage (para usar después del login)
     * @param {Object} data - Datos del usuario con permisos y módulos
     */
    savePermissions: (data) => {
        const { permisos, modulos } = data;
        
        // ✅ Asegurar que permisos sea array
        const permisosArray = Array.isArray(permisos) ? permisos : [];
        localStorage.setItem('permisos', JSON.stringify(permisosArray));
        
        // ✅ Asegurar que modulos sea array (normalizar)
        const modulosArray = permissionService._normalizeModules(modulos);
        localStorage.setItem('modulos', JSON.stringify(modulosArray));
    },
    
    /**
     * ✅ MEJORADO CON LOCAL: Actualizar permisos desde el servidor (útil después de cambios)
     */
    refreshPermissions: async () => {
        try {
            const response = await api.get('/user');
            if (response.data.success) {
                const { permisos, modulos } = response.data.data.usuario;
                
                // ✅ Normalizar antes de guardar
                const permisosArray = Array.isArray(permisos) ? permisos : [];
                const modulosArray = permissionService._normalizeModules(modulos);
                
                localStorage.setItem('permisos', JSON.stringify(permisosArray));
                localStorage.setItem('modulos', JSON.stringify(modulosArray));
                
                return { permisos: permisosArray, modulos: modulosArray };
            }
        } catch (error) {
            console.error('Error refreshing permissions:', error);
        }
        return null;
    },
    
    /**
     * ✅ AGREGADO DE LOCAL: Limpiar permisos (para logout)
     */
    clearPermissions: () => {
        localStorage.removeItem('permisos');
        localStorage.removeItem('modulos');
        localStorage.removeItem('user');
    }
};

export default permissionService;