import React from 'react';
import { Card, CardContent } from './ui/card';
import { Usuario } from '../api/userApi';

interface UserStatsProps {
  usuarios: Usuario[];
}

export function UserStats({ usuarios }: UserStatsProps) {
  const totalClientes = usuarios.filter(u => u.rol === 'cliente').length;
  const totalAdmins = usuarios.filter(u => u.rol === 'admin').length;
  const totalEmpresas = new Set(usuarios.map(u => u.empresa)).size;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{usuarios.length}</div>
          <div className="text-sm text-gray-600">Total Usuarios</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{totalClientes}</div>
          <div className="text-sm text-gray-600">Usuarios Cliente</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{totalAdmins}</div>
          <div className="text-sm text-gray-600">Administradores</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{totalEmpresas}</div>
          <div className="text-sm text-gray-600">Empresas</div>
        </CardContent>
      </Card>
    </div>
  );
}