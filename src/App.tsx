import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { GuidesTab } from './components/GuidesTab';
import { InvoicesTab } from './components/InvoicesTab';
import { AdminTab } from './components/AdminTab'; // ✅ Importar el componente
import { ConnectionTest } from './components/ConnectionTest';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Building2Icon, ContactRound, LogOut, RefreshCw, Settings, Users } from 'lucide-react';

interface User {
  id: number;
  email: string;
  rol: string;
  cliente_id: number;
  empresa: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConnectionTest, setShowConnectionTest] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleNavigateToAdmin = () => {
    setActiveTab("admin");
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-green-600 text-[32px]">LOGISAMB</h1>
                <p className="text-xs text-gray-500">MANEJO INTEGRAL DE RESIDUOS INDUSTRIALES</p>
                <p className="text-xs text-gray-500">PELIGROSOS Y DOMICILIARIOS</p>
              </div>
            </div>
 
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    
                    INTRANET CLIENTE 
                  </div>
                  <div className="flex items-center space-x-4 font-bold bg-blue rounded-lg"> 
                    <Building2Icon className="w-6 h-6 text-blue-600" /> <p> {user.empresa} </p>                                
                  </div>
                </div>
              </CardContent>
            </Card>


          </div>
          
          <div className="flex items-center space-x-4">
            {/* Botón de Administración de Usuarios - Solo para admin */}
            {user.rol === 'admin' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleNavigateToAdmin}
                className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
              >
                <Users className="w-4 h-4 mr-2" />
                Administración de Usuarios
              </Button>
            )}
            
            {/* <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConnectionTest(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Test Conexión
            </Button> */}
            
            <span className="text-sm text-gray-600">Portal Cliente</span>
            
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {showConnectionTest ? (
          <ConnectionTest onClose={() => setShowConnectionTest(false)} />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="flex overflow-x-auto gap-2 w-full pb-2 scrollbar-hide">
                <TabsTrigger value="dashboard" className="whitespace-nowrap flex-shrink-0 px-4 py-2">
                    Dashboard
                </TabsTrigger>
                <TabsTrigger value="guides" className="whitespace-nowrap flex-shrink-0 px-4 py-2">
                    Guías de Retiro
                </TabsTrigger>
                <TabsTrigger value="invoices" className="whitespace-nowrap flex-shrink-0 px-4 py-2">
                    Facturas
                </TabsTrigger>
                
                {user.rol === 'admin' && (
                    <TabsTrigger value="admin" className="whitespace-nowrap flex-shrink-0 px-4 py-2">
                    <Users className="w-4 h-4 mr-1" />
                    Administración
                    </TabsTrigger>
                )}
            </TabsList>

            <TabsContent value="dashboard">
              <Dashboard 
                empresaId={user.cliente_id} 
                onNavigateToGuides={() => setActiveTab("guides")}
                onNavigateToInvoices={() => setActiveTab("invoices")}
              />
            </TabsContent>

            <TabsContent value="guides">
              <GuidesTab empresaId={user.cliente_id} />
            </TabsContent>

            <TabsContent value="invoices">
              <InvoicesTab empresaId={user.cliente_id} />
            </TabsContent>

            {/* Nueva pestaña de admin (solo visible para admins) */}
            {user.rol === 'admin' && (
              <TabsContent value="admin">
                <AdminTab empresaId={user.cliente_id} />
              </TabsContent>
            )}
          </Tabs>
        )}
      </main>
    </div>
  );
}