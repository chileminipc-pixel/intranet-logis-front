import api from "./axiosClient";

export interface Factura {
  id: number;
  fecha: Date;
  sucursal: string;
  dias_mora: number;
  nro_factura: string;
  monto_factura: number;
  estado_mora: string;
}

export interface FacturasResponse {
  page: number;
  total: number;
  facturas: Factura[];
}

export interface FacturaFilters {
  page?: number;
  limit?: number;
  sucursal?: string;
  desde?: string;
  hasta?: string;
  estadoMora?: string;
  numeroFactura?: string;
}

export const getFacturas = async (filters: FacturaFilters = {}): Promise<FacturasResponse> => {
  try {
    const response = await api.get<FacturasResponse>("/facturas", {
      params: filters
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching facturas:', error);
    throw error;
  }
};

export const getSucursalesFacturas = async (): Promise<string[]> => {
  try {
    const response = await api.get<string[]>("/facturas/sucursales");
    
    // Validación adicional por si la estructura cambia
    if (!Array.isArray(response.data)) {
      console.warn('La API no retornó un array de sucursales:', response.data);
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching sucursales:', error);
    throw error;
  }
};