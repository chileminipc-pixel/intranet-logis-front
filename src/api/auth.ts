import axios from "axios";

export interface User {
  id: number;
  email: string;
  rol: string;
  cliente_id: number;
  empresa: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
const response = await axios.post<LoginResponse>(
  "http://localhost:3000/login",
  { email, password }
);
console.log("Respuesta del servidor:", response); // Verifica la respuesta completa
return response.data;

};

