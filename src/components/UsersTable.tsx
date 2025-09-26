import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Mail, Building, Edit, Trash2 } from 'lucide-react';
import { Usuario } from '../api/userApi';

interface UsersTableProps {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onDelete: (usuarioId: number) => void;
}

export function UsersTable({ usuarios, onEdit, onDelete }: UsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Empresa</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {usuarios.map(usuario => (
          <TableRow key={usuario.id}>
            <TableCell className="font-medium">{usuario.id}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{usuario.email}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={usuario.rol === 'admin' ? 'destructive' : 'secondary'}>
                {usuario.rol.toUpperCase()}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-gray-400" />
                <span>{usuario.empresa}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(usuario)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDelete(usuario.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}