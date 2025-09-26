// Utilidades para manejo de fechas

export const getCurrentMonthRange = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);
  
  return {
    start: startOfMonth,
    end: endOfMonth
  };
};

export const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const parseDateFromInput = (dateString: string): Date => {
  return new Date(dateString + 'T00:00:00');
};

export const isDateInRange = (date: string, startDate: Date, endDate: Date): boolean => {
  const checkDate = new Date(date);
  return checkDate >= startDate && checkDate <= endDate;
};

export const getMonthName = (date: Date): string => {
  return date.toLocaleDateString('es-ES', { 
    month: 'long', 
    year: 'numeric' 
  });
};