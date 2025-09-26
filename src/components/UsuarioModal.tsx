import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { X } from 'lucide-react';
import { Usuario, CreateUsuarioData } from '../api/userApi';

interface Empresa {
  id: number;
  nombre: string;
}

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

  useEffect(() => {
    if (usuario) {
      const empresaUsuario = empresas.find(emp => emp.id === usuario.cliente_id);
      
      setFormData({
        email: usuario.email,
        password: '',
        rol: usuario.rol as 'cliente' | 'admin',
        empresa: empresaUsuario ? empresaUsuario.nombre : '',
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
<div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
  <div className="bg-green-600 rounded-xl shadow-2xl w-[120vw] max-w-4xl border border-green-700 animate-fade-in">
   
    
    {/* Header */}
    
     <div className="bg-blue-100 border border-blue-300 rounded-md p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-blue-100 tracking-wide">
          {usuario ? 'Editar Usuario' : 'Nuevo Usuario'}
        </h3>
        <Button
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-blue-700 rounded-full p-1 transition"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    </div>
    {/* Form */}
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-5 bg-gray-50">

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`bg-white border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
            placeholder="usuario@empresa.com"
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700 font-medium">
            {usuario ? 'Nueva Contraseña' : 'Contraseña'}
            {usuario && <span className="text-gray-500 text-sm ml-1">(opcional)</span>}
          </Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className={`bg-white border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
            placeholder={usuario ? 'Dejar vacío para mantener actual' : 'Ingresa la contraseña'}
          />
          {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
        </div>

        {/* Rol y Empresa */}
        <div className="grid grid-cols-2 gap-4">
          {/* Rol */}
          <div className="space-y-2">
            <Label htmlFor="rol" className="text-gray-700 font-medium">Rol</Label>
            <Select
              value={formData.rol}
              onValueChange={(value: 'cliente' | 'admin') => setFormData({ ...formData, rol: value })}
            >
              <SelectTrigger className="bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 transition">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cliente">Cliente</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>

         {/* Empresa */}
<div className="space-y-2">
  <Label htmlFor="empresa" className="text-gray-700 font-medium">Empresa</Label>
  <Select
    value={formData.cliente_id > 0 ? formData.cliente_id.toString() : ""}
    onValueChange={handleEmpresaChange}
  >
    <SelectTrigger className={`bg-white border ${errors.empresa ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 transition`}>
      <SelectValue placeholder="Seleccione empresa">
        {formData.cliente_id > 0
          ? empresas.find(emp => emp.id === formData.cliente_id)?.nombre
          : null
        }
      </SelectValue>
    </SelectTrigger>
    <SelectContent>
      {empresas.map((empresa) => (
        <SelectItem key={empresa.id} value={empresa.id.toString()}>
          {empresa.nombre}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
  {errors.empresa && <p className="text-red-600 text-sm">{errors.empresa}</p>}
</div>

        </div>

        {/* Empresa seleccionada */}
        {formData.empresa && (
          <div className="bg-blue-100 border border-blue-300 rounded-md p-3">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Empresa seleccionada:</span> {formData.empresa}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-100 rounded-b-xl p-4 border-t border-gray-300">
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            className="bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-md shadow-sm transition"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-md shadow-sm transition"
          >
            {loading ? 'Guardando...' : usuario ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </div>
    </form>
  </div>
</div>)
}