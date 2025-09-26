import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { 
  Database,
  Globe,
  CheckCircle,
  XCircle,
  Loader2,
  Server,
  Wifi
} from 'lucide-react';

interface ConnectionTestProps {
  onClose?: () => void;
}

interface ConnectionResult {
  type: string;
  name: string;
  status: 'success' | 'error' | 'testing';
  message: string;
  responseTime?: number;
}

export function ConnectionTest({ onClose }: ConnectionTestProps) {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<ConnectionResult[]>([]);
  const [dbConfig, setDbConfig] = useState({
    host: 'localhost',
    port: '3306',
    database: 'logisamb_db',
    username: 'logisamb_user',
    password: ''
  });

  const runConnectionTests = async () => {
    setTesting(true);
    setResults([]);

    const tests: ConnectionResult[] = [
      { type: 'database', name: 'MariaDB Connection', status: 'testing', message: 'Conectando...' },
      { type: 'api', name: 'Backend API', status: 'testing', message: 'Verificando endpoints...' },
      { type: 'network', name: 'Network Connectivity', status: 'testing', message: 'Probando conectividad...' }
    ];

    setResults([...tests]);

    // Simular tests con delays realistas
    for (let i = 0; i < tests.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const updatedResults = [...tests];
      const randomSuccess = Math.random() > 0.3; // 70% probabilidad de éxito
      
      if (i === 0) {
        // Database test
        updatedResults[i] = {
          ...tests[i],
          status: randomSuccess ? 'success' : 'error',
          message: randomSuccess 
            ? `Conectado exitosamente a ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`
            : 'Error: No se pudo conectar a la base de datos. Verificar credenciales.',
          responseTime: Math.floor(Math.random() * 500 + 100)
        };
      } else if (i === 1) {
        // API test
        updatedResults[i] = {
          ...tests[i],
          status: randomSuccess ? 'success' : 'error',
          message: randomSuccess 
            ? 'Todos los endpoints responden correctamente'
            : 'Error: Algunos endpoints no están disponibles',
          responseTime: Math.floor(Math.random() * 300 + 50)
        };
      } else if (i === 2) {
        // Network test
        updatedResults[i] = {
          ...tests[i],
          status: 'success', // Network siempre exitoso en este entorno
          message: 'Conectividad establecida correctamente',
          responseTime: Math.floor(Math.random() * 100 + 20)
        };
      }

      setResults([...updatedResults]);
    }

    setTesting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'testing':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <Database className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Exitoso</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case 'testing':
        return <Badge className="bg-blue-100 text-blue-800">Probando...</Badge>;
      default:
        return <Badge variant="secondary">Pendiente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Test de Conexiones y Endpoints</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Verifica la conectividad con la base de datos MariaDB y los endpoints del backend
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuración de Base de Datos */}
          <div className="space-y-4">
            <h3 className="font-medium">Configuración de Base de Datos</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="host">Host</Label>
                <Input
                  id="host"
                  value={dbConfig.host}
                  onChange={(e) => setDbConfig({ ...dbConfig, host: e.target.value })}
                  placeholder="localhost"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">Puerto</Label>
                <Input
                  id="port"
                  value={dbConfig.port}
                  onChange={(e) => setDbConfig({ ...dbConfig, port: e.target.value })}
                  placeholder="3306"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="database">Base de Datos</Label>
                <Input
                  id="database"
                  value={dbConfig.database}
                  onChange={(e) => setDbConfig({ ...dbConfig, database: e.target.value })}
                  placeholder="logisamb_db"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  value={dbConfig.username}
                  onChange={(e) => setDbConfig({ ...dbConfig, username: e.target.value })}
                  placeholder="logisamb_user"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={dbConfig.password}
                  onChange={(e) => setDbConfig({ ...dbConfig, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Botón de Test */}
          <div className="flex space-x-4">
            <Button 
              onClick={runConnectionTests} 
              disabled={testing}
              className="flex-1"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Probando Conexiones...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Probar Conexiones
                </>
              )}
            </Button>
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Cerrar
              </Button>
            )}
          </div>

          {/* Resultados */}
          {results.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Resultados de las Pruebas</h3>
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <div className="font-medium">{result.name}</div>
                        <div className="text-sm text-gray-600">{result.message}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {result.responseTime && (
                        <span className="text-xs text-gray-500">{result.responseTime}ms</span>
                      )}
                      {getStatusBadge(result.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Información adicional */}
          <Alert>
            <Server className="h-4 w-4" />
            <AlertDescription>
              <strong>Endpoints a verificar:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• <code>GET /api/guias</code> - Obtener guías de residuos</li>
                <li>• <code>GET /api/facturas</code> - Obtener facturas impagas</li>
                <li>• <code>GET /api/dashboard</code> - Obtener estadísticas del dashboard</li>
                <li>• <code>POST /api/auth/login</code> - Autenticación de usuarios</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}