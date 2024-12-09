// src/api/axiosClient.ts
import axios from "axios";
import { getToken, removeToken } from "../utils/auth";
import { useAuthStore } from "../store/authStore";

const API_URL = import.meta.env.VITE_API_URL_BASE;

const axiosClient = axios.create({
  baseURL: API_URL,
});

// Interceptor para requests: agrega el token si existe
axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respuestas: maneja estados
axiosClient.interceptors.response.use(
  (response) => {
    // Caso exitoso: simplemente retorna la data (o response si prefieres)
    return response.data;
  },
  (error) => {
    if (!error.response) {
      // Error de red, servidor caído, etc.
      console.error("Network/Server error", error);
      return Promise.reject(error);
    }

    const status = error.response.status;
    switch (status) {
      case 401:
        // Token inválido o expirado
        // Limpia el token, actualiza estado global y redirige a login
        removeToken();
        const authStore = useAuthStore.getState();
        authStore.logout();
        window.location.href = "/login";
        break;

      case 403:
        // Acceso prohibido, opcional: redirige a otra página
        window.location.href = "/unauthorized";
        break;

      case 404:
        // Página no encontrada
        window.location.href = "/notFound";
        break;

      case 500:
      case 502:
      case 503:
        // Error de servidor
        console.error("Server error", error.response.data);
        break;

      default:
        console.error("Error de API no manejado", error.response.data);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
