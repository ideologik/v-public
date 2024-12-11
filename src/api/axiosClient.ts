// axiosClient.ts
import axios, { AxiosRequestConfig, AxiosInstance } from "axios";
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
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para respuestas: maneja estados
axiosClient.interceptors.response.use(
  (response) => {
    return response.data; // Aquí ya devolvemos data directamente
  },
  (error) => {
    if (!error.response) {
      console.error("Network/Server error", error);
      return Promise.reject(error);
    }

    const status = error.response.status;
    switch (status) {
      case 401: {
        removeToken();
        const authStore = useAuthStore.getState();
        authStore.logout();
        window.location.href = "/login";
        break;
      }

      case 403:
        window.location.href = "/unauthorized";
        break;

      case 404:
        window.location.href = "/notFound";
        break;

      case 500:
      case 502:
      case 503:
        console.error("Server error", error.response.data);
        break;

      default:
        console.error("Unhandled API error", error.response.data);
    }

    return Promise.reject(error);
  }
);

// Ahora redefinimos la interfaz del axiosClient para que sus métodos usen genéricos y retornen T directamente.
interface CustomAxiosInstance extends AxiosInstance {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

// Hacemos un cast del axiosClient a nuestro tipo CustomAxiosInstance
export default axiosClient as CustomAxiosInstance;
