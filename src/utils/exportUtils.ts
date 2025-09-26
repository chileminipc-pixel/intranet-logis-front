// Utilidades para exportación de datos

export interface ExportData {
  headers: string[];
  rows: (string | number)[][];
  filename: string;
}

// Exportar a CSV
export const exportToCSV = (data: ExportData) => {
  const csvContent = [
    data.headers.join(','),
    ...data.rows.map(row => 
      row.map(cell => 
        typeof cell === 'string' && cell.includes(',') 
          ? `"${cell}"` 
          : cell
      ).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${data.filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Exportar a Excel (usando una aproximación simple con CSV que Excel puede abrir)
export const exportToExcel = (data: ExportData) => {
  // Para una implementación más robusta se podría usar libraries como xlsx
  // pero para simplicidad usamos CSV con extensión .xls que Excel abre automáticamente
  const csvContent = [
    data.headers.join('\t'), // Usar tabs para mejor compatibilidad con Excel
    ...data.rows.map(row => row.join('\t'))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${data.filename}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Exportar a PDF (básico usando window.print)
export const exportToPDF = (data: ExportData) => {
  // Crear contenido HTML para impresión
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${data.filename}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #16a34a; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f8f9fa; font-weight: bold; }
        tr:nth-child(even) { background-color: #f8f9fa; }
        .header { margin-bottom: 20px; }
        .timestamp { color: #666; font-size: 12px; }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>LOGISAMB - ${data.filename}</h1>
        <p class="timestamp">Generado el: ${new Date().toLocaleString('es-ES')}</p>
      </div>
      <table>
        <thead>
          <tr>
            ${data.headers.map(header => `<th>${header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.rows.map(row => 
            `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
          ).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  // Abrir ventana para imprimir
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Esperar a que cargue y luego imprimir
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  }
};

// Función principal de exportación
export const exportData = (format: 'excel' | 'csv' | 'pdf', data: ExportData) => {
  switch (format) {
    case 'excel':
      exportToExcel(data);
      break;
    case 'csv':
      exportToCSV(data);
      break;
    case 'pdf':
      exportToPDF(data);
      break;
    default:
      console.error('Formato de exportación no soportado');
  }
};