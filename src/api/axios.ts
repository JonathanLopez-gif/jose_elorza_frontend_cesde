import axios from "axios";

// Crear instancia base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // lee la variable de entorno
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de request → agrega el token JWT si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // o sessionStorage según tu estrategia
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response → maneja errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // Ejemplo de manejo de errores comunes
      if (status === 401) {
        console.error("No autorizado. Redirigiendo a login...");
        // Aquí puedes limpiar el token y redirigir
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      if (status === 403) {
        console.error("Acceso prohibido.");
      }

      if (status >= 500) {
        console.error("Error del servidor. Intenta más tarde.");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
