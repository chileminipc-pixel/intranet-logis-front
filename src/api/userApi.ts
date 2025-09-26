// api/userApi.ts
import api from "./axiosClient";

export interface Usuario {
  id: number;
  email: string;
  rol: string;
  cliente_id: number;
  empresa: string;
}

export interface CreateUsuarioData {
  email: string;
  password?: string;
  rol: string;
  cliente_id: number;
  empresa: string;
}

// Obtener todos los usuarios
export const getUsuarios = async (): Promise<Usuario[]> => {
  const response = await api.get("/usuarios");
  return response.data;
};

// Crear nuevo usuario
export const createUsuario = async (usuarioData: CreateUsuarioData): Promise<Usuario> => {
  const response = await api.post("/usuarios", usuarioData);
  return response.data;
};

// Actualizar usuario
export const updateUsuario = async (id: number, usuarioData: Partial<CreateUsuarioData>): Promise<Usuario> => {
  const response = await api.put(`/usuarios/${id}`, usuarioData);
  return response.data;
};

// Eliminar usuario
export const deleteUsuario = async (id: number): Promise<void> => {
  await api.delete(`/usuarios/${id}`);
};