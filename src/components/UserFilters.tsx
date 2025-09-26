import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search } from 'lucide-react';

interface UserFiltersProps {
  filtros: {
    email: string;
    rol: string;
  };
  onFiltrosChange: (filtros: { email: string; rol: string }) => void;
}

export function UserFilters({ filtros, onFiltrosChange }: UserFiltersProps) {
  const handleEmailChange = (email: string) => {
    onFiltrosChange({ ...filtros, email });
  };

  const handleRolChange = (rol: string) => {
    onFiltrosChange({ ...filtros, rol });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Buscar por email</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Email del usuario..."
            className="pl-10"
            value={filtros.email}
            onChange={(e) => handleEmailChange(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Filtrar por rol</Label>
        <Select 
          value={filtros.rol} 
          onValueChange={handleRolChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los roles</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
            <SelectItem value="cliente">Cliente</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}