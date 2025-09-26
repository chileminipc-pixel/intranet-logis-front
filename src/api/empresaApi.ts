// api/empresaApi.ts
import api from "./axiosClient";

export interface Empresa {
  id: number;
  nombre: string;
}

// Obtener todas las empresas
export const getEmpresas = async (): Promise<Empresa[]> => {
  const response = await api.get("/clientes"); // Ajusta la ruta según tu backend
  console.log("Respuesta de getEmpresas:", response); // Verifica la respuesta completa
  return response.data;
};