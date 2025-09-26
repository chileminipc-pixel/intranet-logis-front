import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { X } from 'lucide-react';
import { Usuario, CreateUsuarioData, Empresa } from '../api/userApi';

interface UsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuario?: Usuario | null;
  onSave: (usuarioData: CreateUsuarioData) => void;
  loading?: boolean;
  empresas: Empresa[];
}

export function UsuarioModal({ isOpen, onClose, usuario, onSave, loading = false, empresas }: UsuarioModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rol: 'cliente' as 'cliente' | 'admin',
    empresa: '',
    cliente_id: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Resetear form cuando se abre el modal o cambia el usuario
  useEffect(() => {
    if (usuario) {
      const empresaUsuario = empresas.find(emp => emp.id === usuario.cliente_id);
      
      setFormData({
        email: usuario.email,
        password: '', // No mostramos la contraseña existente
        rol: usuario.rol as 'cliente' | 'admin',
        empresa: empresaUsuario ? empresaUsuario.nombre : usuario.empresa,
        cliente_id: usuario.cliente_id
      });
    } else {
      setFormData({
        email: '',
        password: '',
        rol: 'cliente',
        empresa: '',
        cliente_id: 0
      });
    }
    setErrors({});
  }, [usuario, isOpen, empresas]);

  const handleEmpresaChange = (empresaId: string) => {
    const id = parseInt(empresaId);
    const empresaSeleccionada = empresas.find(emp => emp.id === id);
    
    if (empresaSeleccionada) {
      setFormData({
        ...formData,
        cliente_id: id,
        empresa: empresaSeleccionada.nombre
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (!usuario && !formData.password) {
      newErrors.password = 'La contraseña es requerida para nuevos usuarios';
    }
    
    if (!formData.cliente_id || formData.cliente_id <= 0) {
      newErrors.empresa = 'Debe seleccionar una empresa';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">
            {usuario ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">
                {usuario ? 'Nueva Contraseña (dejar vacío para mantener la actual)' : 'Contraseña'}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={errors.password ? 'border-red-500' : ''}
                placeholder={usuario ? 'Opcional' : 'Ingresa la contraseña'}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="roll">Rol</Label>
              <Select 
                value={formData.rol} 
                onValueChange={(value: 'cliente' | 'admin') => setFormData({ ...formData, rol: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cliente">Cliente</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa</Label>
              <Select 
                value={formData.cliente_id > 0 ? formData.cliente_id.toString() : ""} 
                onValueChange={handleEmpresaChange}
              >
                <SelectTrigger className={errors.empresa ? 'border-red-500' : ''}>
                  <SelectValue>
                    {formData.cliente_id > 0 
                      ? empresas.find(emp => emp.id === formData.cliente_id)?.nombre || "Selecciona una empresa"
                      : "Selecciona una empresa"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {empresas.map((empresa) => (
                    <SelectItem 
                      key={empresa.id} 
                      value={empresa.id.toString()}
                    >
                      {empresa.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.empresa && <p className="text-red-500 text-sm">{errors.empresa}</p>}
              {formData.empresa && (
                <p className="text-sm text-gray-600">Empresa seleccionada: {formData.empresa}</p>
              )}
            </div>
          </div>
          
          <div className="p-6 border-t flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : usuario ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}