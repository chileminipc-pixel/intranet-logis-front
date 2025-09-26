import React, { useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Loader2, Database, HardDrive } from 'lucide-react';
import { login } from '../api/auth';


interface User {
  id: number;
  email: string;
  rol: string;
  cliente_id: number;
  empresa: string;
}

interface TokenPayload {
  id: number;
  email: string;
  rol: string;
  cliente_id: number;
  empresa: string;  
}
interface LoginFormProps {
  onLogin: (user: User) => void;
}



export function LoginForm({ onLogin }: LoginFormProps) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estado de conexión (false = datos mock, true = BD real)
  const [isConnectedToDB, setIsConnectedToDB] = useState(true);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    if (isConnectedToDB) {
      const { email, password } = formData;
      const { token } = await login(email, password);
      console.log("Respuesta completa del login:", token); // Verifica que user no sea undefined

      // Decodificar el token
      const payload = jwtDecode<TokenPayload>(token);

      // Adaptar al tipo User que espera App
      const userData: User = {
        id: payload.id,
        email: payload.email.split("@")[0], // o si tienes un campo nombre real
        empresa: payload.empresa,
        cliente_id: payload.cliente_id,
        rol: payload.rol        
      };


      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      onLogin(userData);
    } 
  } catch (err) {
    console.error("Error al conectar:", err);
    setError("Error al conectar con el servidor. Verifica tus credenciales.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-600">LOGISAMB</h1>
            </div>
          </div>
          
          {/* Indicador de conexión *  Ya no es necesrio */}
         
          
          <CardTitle>Portal Cliente</CardTitle>
          <CardDescription>
            Gestión Integral de Residuos y Facturación
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                placeholder="Ingresa tu usuario (email)"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            {/* Toggle de conexión */}
          
            
            
            {/* Información de BD real   Ya no es neceario*/}

          </div>
        </CardContent>
      </Card>
    </div>
  );
};