import React, { useState, useEffect } from 'react';
import { getSucursalesFacturas, getFacturas, type Factura } from "../api/facturas";
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { exportData, type ExportData } from '../utils/exportUtils';
import { MapPin, AlertTriangle, Download, Filter, Search, FileSpreadsheet, FileText, Clock, DollarSign, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface InvoicesTabProps {
  empresaId: number;
}

export function InvoicesTab({ empresaId }: InvoicesTabProps) {
  // Cambiar a tipo Factura de la API
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredFacturas, setFilteredFacturas] = useState<Factura[]>([]);
  
  const [filters, setFilters] = useState({
    sucursal: 'todas',
    estadoMora: 'todos',
    numeroFactura: ''
  });

  // Estados para sucursales
  const [sucursales, setSucursales] = useState<string[]>([]);
  const [loadingSucursales, setLoadingSucursales] = useState(true);
  const [errorSucursales, setErrorSucursales] = useState<string | null>(null);

  // Estado para error de facturas
  const [errorFacturas, setErrorFacturas] = useState<string | null>(null);

  // Mapear estado de mora del frontend al formato de la API
  // CORRECCIÓN: Función mejorada para mapeo de estados
  const mapEstadoMoraToApi = (estadoFrontend: string): string | undefined => {
    if (estadoFrontend === 'todos') return undefined;
    
    const estadoMap: { [key: string]: string } = {
      'critica': 'Crítica',
      'alta': 'Alta', 
      'media': 'Media',
      'baja': 'Baja'
    };
    
    return estadoMap[estadoFrontend];
  };

  // Cargar sucursales
  useEffect(() => {
    const cargarSucursales = async () => {
      try {
        setErrorSucursales(null);
        setLoadingSucursales(true);
        
        const sucursalesData = await getSucursalesFacturas();
        console.log('Sucursales cargadas:', sucursalesData);
        
        const sucursalesFiltradas = sucursalesData
          .filter(sucursal => sucursal && sucursal.trim() !== '')
          .sort();
        
        setSucursales(sucursalesFiltradas);
        
      } catch (error) {
        console.error("Error cargando sucursales:", error);
        setErrorSucursales("Error al cargar las sucursales");
      } finally {
        setLoadingSucursales(false);
      }
    };

    cargarSucursales();
  }, []);

  // Cargar facturas desde la API
  const cargarFacturas = async () => {
    try {
      setLoading(true);
      setErrorFacturas(null);
      
      // Mapear los filtros del frontend a los que espera la API - CORREGIDO
      const filtrosApi = {
        sucursal: filters.sucursal === 'todas' ? undefined : filters.sucursal,
        estadoMora: filters.estadoMora === 'todos' ? undefined : mapEstadoMoraToApi(filters.estadoMora),
        numeroFactura: filters.numeroFactura || undefined
      };

      console.log('Enviando filtros a la API:', filtrosApi);

      const response = await getFacturas(filtrosApi);
      
      setFacturas(response.facturas);
      
    } catch (error) {
      console.error('Error cargando facturas:', error);
      setErrorFacturas('Error al cargar las facturas');
    } finally {
      setLoading(false);
    }
  };

  // Cargar facturas cuando cambien los filtros o el empresaId
  useEffect(() => {
    cargarFacturas();
  }, [filters, empresaId]);

  // Filtrar facturas localmente (para búsqueda en tiempo real)
  useEffect(() => {
    let filtered = [...facturas];

    // Filtrar por número de factura (búsqueda en tiempo real)
    if (filters.numeroFactura) {
      filtered = filtered.filter(factura => 
        factura.nro_factura.toLowerCase().includes(filters.numeroFactura.toLowerCase())
      );
    }

    setFilteredFacturas(filtered);
  }, [facturas, filters.numeroFactura]);

  const handleExport = (exportFormat: 'excel' | 'csv' | 'pdf') => {
    const headers = [
      'Nro Factura',
      'Fecha',
      'Sucursal',
      'Monto',
      'Días Mora',
      'Estado Mora'
    ];

    const rows = filteredFacturas.map(factura => [
      factura.nro_factura,
      format(new Date(factura.fecha), "dd/MM/yyyy", { locale: es }),
      factura.sucursal,
      factura.monto_factura.toLocaleString(),
      factura.dias_mora,
      factura.estado_mora
    ]);

    const data: ExportData = {
      headers,
      rows,
      filename: `Facturas_Impagas_${new Date().toISOString().split('T')[0]}_${filteredFacturas.length}_registros`
    };

    exportData(exportFormat, data);
  };

  const resetFilters = () => {
    setFilters({
      sucursal: 'todas',
      estadoMora: 'todos',
      numeroFactura: ''
    });
  };

  // CORRECCIÓN: Función mejorada para colores
  const getEstadoMoraColor = (estado: string) => {
    // Normalizar el estado (minúsculas, sin acentos)
    const estadoNormalizado = estado.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    switch (estadoNormalizado) {
      case 'critica': 
        return 'bg-red-100 text-red-800 border-red-200';
      case 'alta': 
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'media': 
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja': 
        return 'bg-green-100 text-green-800 border-green-200';
      default: 
        console.warn('Estado de mora no reconocido:', estado);
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  // Calcular estadísticas
  const totalFacturas = filteredFacturas.length;
  const montoTotal = filteredFacturas.reduce((sum, f) => sum + f.monto_factura, 0);
  const facturasCriticas = filteredFacturas.filter(f => f.estado_mora === 'Crítica').length;
  const facturasAltas = filteredFacturas.filter(f => f.estado_mora === 'Alta').length;
  const moraPromedio = filteredFacturas.length > 0 
    ? Math.round(filteredFacturas.reduce((sum, f) => sum + f.dias_mora, 0) / filteredFacturas.length)
    : 0;

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-32 bg-gray-200 rounded-lg"></div>
      <div className="h-64 bg-gray-200 rounded-lg"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Mostrar error de facturas si existe */}
      {errorFacturas && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{errorFacturas}</AlertDescription>
        </Alert>
      )}

      {/* Alerta de Facturas Críticas */}
      {facturasCriticas > 0 && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Atención: {facturasCriticas} facturas en estado crítico</strong>
            <br />
            Hay {facturasCriticas} facturas con más de 90 días de mora que requieren atención inmediata.
            {facturasAltas > 0 && ` Además, ${facturasAltas} facturas en estado de mora alta.`}
          </AlertDescription>
        </Alert>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-red-600" />
                <span>Filtros de Facturas Impagas</span>
              </CardTitle>
              <p className="text-sm text-gray-600">
                {totalFacturas} facturas encontradas
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={cargarFacturas}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Restablecer Filtros
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Sucursal</Label>
              <Select 
                value={filters.sucursal} 
                onValueChange={(value: string) => setFilters({ ...filters, sucursal: value })}
                disabled={loadingSucursales}
              >
                <SelectTrigger>
                  <SelectValue 
                    placeholder={loadingSucursales ? "Cargando sucursales..." : "Selecciona sucursal"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las sucursales</SelectItem>
                  {sucursales.map(sucursal => (
                    <SelectItem key={sucursal} value={sucursal}>
                      {sucursal}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {loadingSucursales && (
                <p className="text-sm text-blue-500">Cargando sucursales...</p>
              )}
              
              {errorSucursales && (
                <p className="text-sm text-red-500">{errorSucursales}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Estado de Mora</Label>
              <Select value={filters.estadoMora} onValueChange={(value: string) => setFilters({ ...filters, estadoMora: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="critica">Crítica (+90 días)</SelectItem>
                  <SelectItem value="alta">Alta (61-90 días)</SelectItem>
                  <SelectItem value="media">Media (31-60 días)</SelectItem>
                  <SelectItem value="baja">Baja (1-30 días)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroFactura">N° Factura</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="numeroFactura"
                  placeholder="Buscar factura..."
                  className="pl-10"
                  value={filters.numeroFactura}
                  onChange={(e) => setFilters({ ...filters, numeroFactura: e.target.value })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{totalFacturas}</div>
            <div className="text-sm text-gray-600">Total Facturas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">${montoTotal.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Monto Total Neto</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{facturasCriticas}</div>
            <div className="text-sm text-gray-600">Estado Crítico</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{moraPromedio}</div>
            <div className="text-sm text-gray-600">Mora Promedio (días)</div>
          </CardContent>
        </Card>
      </div>

      {/* Botones de Exportación */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">{totalFacturas} facturas impagas</span>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
            <FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" />
            Exportar
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
            <FileText className="w-4 h-4 mr-2 text-red-600" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
        </div>
      </div>

      {/* Tabla de Facturas */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Sucursal</TableHead>
                  <TableHead>Días Mora</TableHead>
                  <TableHead>N° Factura</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado Mora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFacturas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <Search className="w-8 h-8 text-gray-400" />
                        <p className="text-gray-500">
                          {errorFacturas ? 'Error al cargar las facturas' : 'No se encontraron facturas con los filtros aplicados'}
                        </p>
                        <Button variant="outline" size="sm" onClick={resetFilters}>
                          Mostrar todas las facturas
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFacturas.map((factura) => (
                    <TableRow key={factura.id} className={factura.estado_mora === 'Crítica' ? 'bg-red-50' : ''}>
                      <TableCell>
                        {format(new Date(factura.fecha), 'dd-MM-yyyy', { locale: es })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                        
                          <MapPin className="w-4 h-4 text-green-400" />
                          <span className="text-sm">{factura.sucursal}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className={`font-medium ${factura.dias_mora > 90 ? 'text-red-600' : factura.dias_mora > 60 ? 'text-orange-600' : factura.dias_mora > 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {factura.dias_mora}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{factura.nro_factura}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">${factura.monto_factura.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {/* DEBUG: Mostrar el estado real */}
                        <div className="flex flex-col">
                        
                          <Badge className={getEstadoMoraColor(factura.estado_mora)}>
                            {factura.estado_mora === 'Crítica' && <AlertTriangle className="w-3 h-3 mr-1" />}
                            {factura.estado_mora}
                          </Badge>

                          {/* <span className="text-xs text-gray-500 mt-1">Estado: "{factura.estado_mora}"</span> */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}