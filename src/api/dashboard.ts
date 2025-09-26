import api from "./axiosClient";

export interface DashboardResumen {
  cantidad_guias: number;
  cantidad_facturas: number;
  monto_guias: number;
  monto_facturas: number;
  cantidad_sucursales: number;
  promedio_monto_facturas: number;
  promedio_monto_guias: number;
}

// Versión corregida usando tu axiosClient configurado
export const getDashboardResumen = async (filters?: { desde?: string; hasta?: string }): Promise<DashboardResumen> => {
  const params: Record<string, string> = {};
  
  if (filters?.desde) params.desde = filters.desde;
  if (filters?.hasta) params.hasta = filters.hasta;
  
  console.log('Parámetros enviados al backend:', params); // ← Para debuggear
  
  const response = await api.get("/dashboard/resumen", { params });
  console.log('Respuesta completa del backend:', response.data); // ← Para debuggear
  
  return response.data.resumen;
};