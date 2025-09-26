import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Plus, Download, User } from 'lucide-react';
import { getUsuarios, deleteUsuario, createUsuario, updateUsuario, Usuario, CreateUsuarioData } from '../api/userApi';
import { getEmpresas, Empresa } from '../api/empresaApi';
import { UsuarioModal } from './UsuarioModal';
import { UserStats } from './UserStats';
import { UserFilters } from './UserFilters';
import { UsersTable } from './UsersTable';

interface AdminTabProps {
  empresaId: number;
}

export function AdminTab({ empresaId }: AdminTabProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingEmpresas, setLoadingEmpresas] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState({
    email: '',
    rol: 'todos'
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [exportando, setExportando] = useState(false);

  // Función para exportar a CSV
  const exportarACSV = () => {
    setExportando(true);
    try {
      // Datos a exportar (puedes ajustar las columnas según necesites)
      const datosExportar = usuariosFiltrados.map(usuario => ({
        'ID': usuario.id,
        'Email': usuario.email,
        'Rol': usuario.rol,
        'Empresa': usuario.empresa,
        'Empresa ID': usuario.cliente_id
      }));

      // Crear cabeceras CSV
      const cabeceras = Object.keys(datosExportar[0]).join(',');
      const filas = datosExportar.map(objeto => 
        Object.values(objeto).map(valor => 
          `"${String(valor).replace(/"/g, '""')}"`
        ).join(',')
      );
      
      const csvContent = [cabeceras, ...filas].join('\n');
      
      // Crear y descargar archivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `usuarios_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error exportando datos:', error);
      setError('Error al exportar los datos.');
    } finally {
      setExportando(false);
    }
  };

  // Función para exportar a Excel (usando una solución simple)
  const exportarAExcel = () => {
    setExportando(true);
    try {
      // Crear tabla HTML para Excel
      const tablaHTML = `
        <html xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head>
          <meta charset="UTF-8">
          <style>
            table { border-collapse: collapse; }
            td { border: 1px solid black; padding: 5px; }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Empresa</th>
                <th>Empresa ID</th>
                <th>Fecha Creación</th>
                <th>Última Actualización</th>
              </tr>
            </thead>
            <tbody>
              ${usuariosFiltrados.map(usuario => `
                <tr>
                  <td>${usuario.id}</td>
                  <td>${usuario.email}</td>
                  <td>${usuario.rol}</td>
                  <td>${usuario.empresa}</td>
                  <td>${usuario.cliente_id}</td>
 
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;

      const blob = new Blob([tablaHTML], { 
        type: 'application/vnd.ms-excel;charset=utf-8' 
      });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `usuarios_${new Date().toISOString().split('T')[0]}.xls`;
      link.click();
      
    } catch (error) {
      console.error('Error exportando a Excel:', error);
      setError('Error al exportar los datos.');
    } finally {
      setExportando(false);
    }
  };

  // Función principal de exportar (puedes elegir el formato)
  const handleExportar = () => {
    if (usuariosFiltrados.length === 0) {
      setError('No hay datos para exportar.');
      return;
    }
    
    // Por defecto exportamos a CSV, pero puedes cambiar a Excel si prefieres
    exportarACSV();
    
    // O si prefieres Excel:
    // exportarAExcel();
  };

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setError('Error al cargar los usuarios. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  const cargarEmpresas = async () => {
    try {
      setLoadingEmpresas(true);
      const data = await getEmpresas();
      setEmpresas(data);
    } catch (error) {
      console.error('Error cargando empresas:', error);
      const empresasDeUsuarios = Array.from(new Set(usuarios.map(u => ({
        id: u.cliente_id,
        nombre: u.empresa
      }))));
      setEmpresas(empresasDeUsuarios);
    } finally {
      setLoadingEmpresas(false);
    }
  };

  const eliminarUsuario = async (usuarioId: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    
    try {
      await deleteUsuario(usuarioId);
      await cargarUsuarios();
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      setError('Error al eliminar el usuario.');
    }
  };

  const guardarUsuario = async (usuarioData: CreateUsuarioData) => {
    try {
      setGuardando(true);
      setError(null);
      
      if (usuarioEditando) {
        await updateUsuario(usuarioEditando.id, usuarioData);
      } else {
        await createUsuario(usuarioData);
      }
      
      await cargarUsuarios();
      cerrarModal();
    } catch (error: any) {
      console.error('Error guardando usuario:', error);
      setError(error.response?.data?.message || 'Error al guardar el usuario.');
    } finally {
      setGuardando(false);
    }
  };

  const abrirModalNuevo = () => {
    setUsuarioEditando(null);
    setModalOpen(true);
  };

  const abrirModalEditar = (usuario: Usuario) => {
    setUsuarioEditando(usuario);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setUsuarioEditando(null);
  };

  useEffect(() => {
    cargarUsuarios();
    cargarEmpresas();
  }, []);

  const usuariosFiltrados = usuarios.filter(usuario => {
    const coincideEmail = usuario.email.toLowerCase().includes(filtros.email.toLowerCase());
    const coincideRoll = filtros.rol === 'todos' || usuario.rol === filtros.rol;
    return coincideEmail && coincideRoll;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
          <button 
            onClick={() => {
              setError(null);
              cargarUsuarios();
            }}
            className="ml-4 bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Reintentar
          </button>
        </div>
      )}

      <UserStats usuarios={usuarios} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Gestión de Usuarios</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportar}
                disabled={exportando || usuariosFiltrados.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                {exportando ? 'Exportando...' : 'Exportar'}
              </Button>
              <Button size="sm" onClick={abrirModalNuevo}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Usuario
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <UserFilters filtros={filtros} onFiltrosChange={setFiltros} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <UsersTable 
            usuarios={usuariosFiltrados} 
            onEdit={abrirModalEditar}
            onDelete={eliminarUsuario}
          />
        </CardContent>
      </Card>

      <UsuarioModal
        isOpen={modalOpen}
        onClose={cerrarModal}
        usuario={usuarioEditando}
        onSave={guardarUsuario}
        loading={guardando}
        empresas={empresas}
      />
    </div>
  );
}