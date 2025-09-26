import React, { useState, useEffect } from 'react';
import { getGuias, getGuiaOpciones, type Guia, type GuiaOpciones } from '../api/guias';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { DatePicker } from './DatePicker';
import { getCurrentMonthRange, isDateInRange, getMonthName } from '../utils/dateUtils';
import { exportData, type ExportData } from '../utils/exportUtils';
import { MapPin, Download, Filter, Search, FileSpreadsheet, FileText, RefreshCw, TruckIcon, Calendar1Icon, DropletIcon, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';


interface GuidesTabProps {
  empresaId: number;
}

// interface Guia { --- IGNORE ---
export function GuidesTab({ empresaId }: GuidesTabProps) {
  const [guias, setGuias] = useState<Guia[]>([]);
  const [loading, setLoading] = useState(true);

  const currentMonth = getCurrentMonthRange();
  const [filters, setFilters] = useState({
    fechaInicio: currentMonth.start,
    fechaFin: currentMonth.end,
    sucursal: 'todas',
    servicio: 'todos',
    frecuencia: 'todas',
    numeroGuia: ''
  });

const [opciones, setOpciones] = useState<GuiaOpciones>({
  sucursales: [],
  servicios: [],
  frecuencias: []
});

useEffect(() => {
  const fetchOpciones = async () => {
    try {
      const data = await getGuiaOpciones();
      setOpciones(data);
    } catch (error) {
      console.error("Error al obtener opciones:", error);
    }
  };

  fetchOpciones();
}, []);

useEffect(() => {
  const fetchGuias = async () => {
    setLoading(true);
    try {
      const response = await getGuias({
        page: 1,
        limit: 100,
        desde: filters.fechaInicio?.toISOString(),
        hasta: filters.fechaFin?.toISOString(),
        sucursal: filters.sucursal !== 'todas' ? filters.sucursal : undefined,
        servicio: filters.servicio !== 'todos' ? filters.servicio : undefined,
        frecuencia: filters.frecuencia !== 'todas' ? filters.frecuencia : undefined,
        guia: filters.numeroGuia || undefined
      });

      const data = response.guias.map(g => ({
        ...g,
        fecha: new Date(g.fecha),
        valor_servicio: Number(g.valor_servicio),
        valor_lt_adic: Number(g.valor_lt_adic),
        total: Number(g.total)
      }));

      setGuias(data);
    } catch (error) {
      console.error("Error al obtener guías:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchGuias();
}, [empresaId, filters]);//

const handleExport = (fileFormat: 'excel' | 'csv' | 'pdf') => {
  const headers = [
    'Guía',
    'Fecha',
    'Sucursal',
    'Servicio',
    'Frecuencia',
    'Lts Límite',
    'Lts Retirados',
    'Valor Servicio',
    'Valor Lt Adic.',
    'Patente',
    'Total'
  ];

  const rows = guias.map(guia => [
    guia.guia,
    format(new Date(guia.fecha), "dd/MM/yyyy", { locale: es }), // ✅ ya no hay conflicto
    guia.sucursal,
    guia.servicio,
    guia.frecuencia,
    guia.lts_limite,
    guia.lts_retirados,
    `${guia.valor_servicio.toLocaleString()}`,
    `${guia.valor_lt_adic.toLocaleString()}`,
    guia.patente,
    `${guia.total.toLocaleString()}`
  ]);

  const currentMonth = getMonthName(filters.fechaInicio!);
  const data: ExportData = {
    headers,
    rows,
    filename: `Guias_Retiro_${currentMonth.replace(' ', '_')}_${guias.length}_registros`
  };

  exportData(fileFormat, data);
};



  const resetFilters = () => {
  const currentMonth = getCurrentMonthRange();
  setFilters({
    fechaInicio: currentMonth.start,
    fechaFin: currentMonth.end,
    sucursal: 'todas',
    servicio: 'todos',
    frecuencia: 'todas',
    numeroGuia: ''
  });
};

const totalGuias = guias.length;
const totalLitrosRetirados = guias.reduce((sum, g) => sum + g.lts_retirados, 0);
const totalFacturado = guias.reduce((sum, g) => sum + g.total, 0);
const sucursalesActivas = new Set(guias.map(g => g.sucursal)).size;

if (loading) {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-32 bg-gray-200 rounded-lg"></div>
      <div className="h-64 bg-gray-200 rounded-lg"></div>
    </div>
  );
}

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-green-600" />
                <span>Filtros de Guías</span>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Filtrando por: {getMonthName(filters.fechaInicio!)} • {totalGuias} guías encontradas
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={resetFilters}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Restablecer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Fecha Inicio</Label>
              <DatePicker
                date={filters.fechaInicio}
                onSelect={(date) => setFilters({ ...filters, fechaInicio: date || currentMonth.start })}
                placeholder="Seleccionar fecha inicio"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Fecha Fin</Label>
              <DatePicker
                date={filters.fechaFin}
                onSelect={(date) => setFilters({ ...filters, fechaFin: date || currentMonth.end })}
                placeholder="Seleccionar fecha fin"
              />
            </div>

            <div className="space-y-2">
              <Label>Sucursal</Label>
              <Select
                value={filters.sucursal}
                onValueChange={(value: string) =>
                  setFilters({ ...filters, sucursal: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una sucursal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las sucursales</SelectItem>
                  {opciones.sucursales.map(sucursal => (
                    <SelectItem key={sucursal} value={sucursal}>
                      {sucursal}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Servicio</Label>
              <Select
                value={filters.servicio}
                onValueChange={(value: string) =>
                  setFilters({ ...filters, servicio: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un servicio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los servicios</SelectItem>
                  {opciones.servicios.map(servicio => (
                    <SelectItem key={servicio} value={servicio}>
                      {servicio}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

           {/* <div className="space-y-2">
              <Label>Frecuencia</Label>
              <Select
                value={filters.frecuencia}
                onValueChange={(value: string) =>
                  setFilters({ ...filters, frecuencia: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las frecuencias</SelectItem>
                  {opciones.frecuencias.map(frecuencia => (
                    <SelectItem key={frecuencia} value={frecuencia}>
                      {frecuencia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
            <div className="space-y-2">
              <Label htmlFor="numeroGuia">N° Guía</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="numeroGuia"
                  placeholder="Buscar guía..."
                  className="pl-10"
                  value={filters.numeroGuia}
                  onChange={(e) => setFilters({ ...filters, numeroGuia: e.target.value })}
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
            <div className="text-2xl font-bold">{totalGuias}</div>
            <div className="text-sm text-gray-600">Total Guías</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{totalLitrosRetirados.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Litros Retirados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">${totalFacturado.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Neto</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{sucursalesActivas}</div>
            <div className="text-sm text-gray-600">Sucursales Activas</div>
          </CardContent>
        </Card>
      </div>

      {/* Botones de Exportación */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">{totalGuias} guías de retiro</span>
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

      {/* Tabla de Guías */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guía</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Sucursal</TableHead>
                  <TableHead>Servicio</TableHead>
                  {/* <TableHead>Frecuencia</TableHead>
                  <TableHead>Lts Límite</TableHead> */}
                  <TableHead>Lts Retirados</TableHead>
                  {/* <TableHead>Valor Servicio</TableHead>
                  <TableHead>Valor Lt Adic.</TableHead> */}
                  <TableHead>Patente</TableHead>
                  <TableHead className="text-right">Total Neto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guias.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <Search className="w-8 h-8 text-gray-400" />
                        <p className="text-gray-500">No se encontraron guías con los filtros aplicados</p>
                        <Button variant="outline" size="sm" onClick={resetFilters}>
                          Mostrar todas las guías
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  guias.map((guia) => (
                  <TableRow key={guia.id}>
                    <TableCell className="font-medium">{guia.guia}</TableCell>
                    
                    <TableCell className="flex items-center gap-2">
                      <Calendar1Icon className="w-4 h-4 text-gray-500" aria-hidden="true" />
                      {format(new Date(guia.fecha), 'dd-MM-yyyy', { locale: es })}
                    </TableCell>
                    
                    <TableCell>
                        <div className="flex items-center space-x-2">                                               
                          <MapPin className="w-4 h-4 text-green-400" />
                          <span className="text-sm">{guia.sucursal}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-50 text-red-700">
                        {guia.servicio}
                      </Badge>
                    </TableCell>
                    {/*                     
                      <TableCell>
                          <Badge variant="secondary">{guia.frecuencia}</Badge>
                      </TableCell>
                      
                      <TableCell>{guia.lts_limite}</TableCell>
                     */}
                    <TableCell className="flex items-center gap-2">
                        
                         <DropletIcon className="w-4 h-4 text-gray-500" aria-hidden="true" />
                        <span className={guia.lts_retirados > guia.lts_limite ? 'text-red-600 font-medium' : ''}>
                          {guia.lts_retirados} {guia.lts_retirados > guia.lts_limite && ''}
                          {/* {guia.lts_retirados} {guia.lts_retirados > guia.lts_limite && '⚠️'} */}
                        </span>
                    </TableCell>
                    
                    {/* <TableCell>${guia.valor_servicio.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={guia.lts_retirados > guia.lts_limite ? 'text-red-600 font-medium' : ''}>
                        ${guia.valor_lt_adic.toLocaleString()}
                      </span>
                    </TableCell>
                     */}
                    <TableCell>
                        <div className="flex items-center space-x-2">                                               
                          <TruckIcon className="w-4 h-4 text-green-400" />
                          <span className="text-sm">{guia.patente}</span>
                        </div>

                      {/* //<code className="bg-gray-100 px-2 py-1 rounded text-xs">{guia.patente}</code> */}
                    </TableCell>

                    <TableCell className="flex items-center justify-end gap-2">
                        {/* <div className="flex items-center justify-end gap-2"> */}
                          <DollarSign className="w-4 h-4 text-gray-500" aria-hidden="true" />
                          
                            ${guia.total.toLocaleString()}
                          
                        {/* </div> */}
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