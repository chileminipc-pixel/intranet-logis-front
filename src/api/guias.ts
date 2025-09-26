import api from "./axiosClient";

export interface Guia {
  id: number;
  guia: number;
  fecha: Date;
  sucursal: string;
  servicio: string;
  frecuencia: string;
  lts_limite: number;
  lts_retirados: number;
  valor_servicio: number;
  valor_lt_adic: number;
  patente: string;
  total: number;
}

export interface GuiasResponse {
  page: number;
  total: number;
  guias: Guia[];
}

export interface GuiaFilters {
  page?: number;
  limit?: number;
  sucursal?: string;
  servicio?: string;
  frecuencia?: string;
  guia?: string;
  patente?: string;
  desde?: string; // formato ISO
  hasta?: string;
}

export interface GuiaOpciones {
  sucursales: string[];
  servicios: string[];
  frecuencias: string[];
}


export const getGuias = async (filters: GuiaFilters = {}): Promise<GuiasResponse> => {
  const response = await api.get<GuiasResponse>("/guias", {
    params: filters
  });
  return response.data;
};


export const getGuiaOpciones = async (): Promise<GuiaOpciones> => {
  const response = await api.get<GuiaOpciones>("/guias/opciones");
  return response.data;
};
