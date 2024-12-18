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

// Interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
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

interface CustomAxiosInstance extends AxiosInstance {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

export default axiosClient as CustomAxiosInstance;
