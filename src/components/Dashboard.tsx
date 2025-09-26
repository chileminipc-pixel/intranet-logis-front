import React, { useState, useEffect } from 'react';
import { getDashboardResumen, DashboardResumen } from "../api/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FileText, DollarSign, AlertTriangle, Calculator, MapPin, Clock, Eye, CheckCheckIcon, CircleDollarSign } from 'lucide-react';

interface DashboardProps {
  empresaId: number;
  onNavigateToGuides?: () => void;
  onNavigateToInvoices?: () => void;
}

// Función para obtener el primer y último día del mes actual
const getCurrentMonthRange = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  return {
    desde: firstDay.toISOString().split('T')[0], // Formato YYYY-MM-DD
    hasta: lastDay.toISOString().split('T')[0]   // Formato YYYY-MM-DD
  };
};

// Función para formatear fecha en español
const formatMonthName = () => {
  const today = new Date();
  return today.toLocaleDateString('es-ES', { 
    month: 'long', 
    year: 'numeric' 
  });
};

export function Dashboard({ empresaId, onNavigateToGuides, onNavigateToInvoices }: DashboardProps) {
  const [data, setData] = useState<DashboardResumen | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth] = useState(formatMonthName());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Obtener rango del mes actual
        const { desde, hasta } = getCurrentMonthRange();
        
        // Pasar los parámetros de fecha al endpoint
        const resumen = await getDashboardResumen({ desde, hasta });
        setData(resumen);
      } catch (err) {
        console.error("Error cargando métricas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [empresaId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header Banner - Actualizado para mostrar el mes actual */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Portal clientes LOGISAMB - Gestión Integral de Residuos</h2>
            <p className="text-green-100">intranet logisamb.cl</p>
            <div className="mt-2 text-sm bg-black bg-opacity-20 px-3 py-1 rounded inline-block">
              📅 Mostrando datos del mes: {currentMonth}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{data.cantidad_guias}</div>
            <div className="text-green-100">Guías Registradas Mes Actual</div>
            <div className="text-sm text-green-100">{data.cantidad_facturas} facturas por pagar</div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Resto del código igual */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right flex-1">
                <p className="text-sm text-gray-600">Total Neto en Guías</p>
                <p className="text-2xl font-bold text-green-600">
                  ${Number(data.monto_guias || 0).toLocaleString("es-CL", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </p>
                <p className="text-xs text-gray-500">Retiros del mes actual</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-right flex-1">
                <p className="text-sm text-gray-600">Total Neto Facturado</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${Number(data.monto_facturas || 0).toLocaleString("es-CL", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </p>
                <p className="text-xs text-gray-500">Por pagar</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <CheckCheckIcon className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-right flex-1">
                <p className="text-sm text-gray-600">Cantidad Facturas</p>
                <p className="text-2xl font-bold text-red-600">{data.cantidad_facturas}</p>
                <p className="text-xs text-gray-500">Pendientes de pago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calculator className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-right flex-1">
                <p className="text-sm text-gray-600">Promedio Neto guias</p>
                <p className="text-2xl font-bold text-orange-600">${data.promedio_monto_guias.toLocaleString("es-CL", { maximumFractionDigits: 0 })}</p>
                <p className="text-xs text-gray-500">Del mes actual</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-right flex-1">
                <p className="text-sm text-gray-600">Sucursales Activas</p>
                <p className="text-2xl font-bold text-purple-600">{data.cantidad_sucursales}</p>
                <p className="text-xs text-gray-500">Con actividad este mes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <CircleDollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-right flex-1">
                <p className="text-sm text-gray-600">Promedio Neto $ Facturas</p>
                <p className="text-2xl font-bold text-yellow-600">${data.promedio_monto_facturas.toLocaleString("es-CL", { maximumFractionDigits: 0 })}</p>                
                <p className="text-xs text-gray-500">Días de mora</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Resto del código igual */}
      {data.cantidad_facturas > 0 && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between w-full">
            <div>
              <strong>Atención: *</strong>
              <br />
              Hay {data.cantidad_facturas} facturas que requieren su atención. 
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-4 border-red-300 text-red-700 hover:bg-red-100"
              onClick={onNavigateToInvoices}
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver facturas
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Guías emitidas (Neto)</span>
              <Badge variant="secondary">
                ${Number(data.monto_guias || 0).toLocaleString("es-CL", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Ver guías de retiro emitidas del mes actual
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onNavigateToGuides}
            >
              Ver guías del mes actual
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CircleDollarSign className="w-5 h-5" />
              <span>Facturas (Neto)</span>
              <Badge variant="destructive">
                ${Number(data.monto_facturas || 0).toLocaleString("es-CL", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Gestiona las facturas pendientes de pago
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onNavigateToInvoices}
            >
              Ver facturas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}