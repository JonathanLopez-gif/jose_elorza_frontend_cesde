import api from "../api/axios";
import { AuthResponse, LoginCredentials } from "../types/auth";
import { User } from "../types/user"; // Importación necesaria

// Login
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", credentials);
  return response.data;
};

// Logout
export const logout = async (): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>("/auth/logout");
  return response.data;
};

// Registro
export const register = async (data: { name: string; email: string; password: string }): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", data);
  return response.data;
};

// Obtener perfil del usuario autenticado
export const getProfile = async (): Promise<User> => {
  const response = await api.get<User>("/user/profile");
  return response.data;
};


