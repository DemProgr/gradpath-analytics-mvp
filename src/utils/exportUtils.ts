export function downloadCSV(data: (string | number)[], filename: string) {
  const csvContent = data.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export function downloadExcel(data: (string | number)[][], filename: string) {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?>';
  const workbook = [
    '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"',
    ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">',
    '<Worksheet ss:Name="Sheet1"><Table>'
  ];

  data.forEach(row => {
    workbook.push('<Row>');
    row.forEach(cell => {
      const escapedCell = String(cell)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
      workbook.push(`<Cell><Data ss:Type="String">${escapedCell}</Data></Cell>`);
    });
    workbook.push('</Row>');
  });

  workbook.push('</Table></Worksheet></Workbook>');
  
  const blob = new Blob([xmlHeader + workbook.join('')], { 
    type: 'application/vnd.ms-excel;charset=utf-8;' 
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export function exportToCSV(data: (string | number)[][], headers: string[], filename: string) {
  const allData: (string | number)[] = [...headers, ...data.flat()];
  const csvContent = allData.map(row => 
    typeof row === 'string' ? `"${row.replace(/"/g, '""')}"` : String(row)
  ).join('\n');
  downloadCSV([csvContent], filename);
}

export function exportToExcel(data: (string | number)[][], headers: string[], filename: string) {
  const allData = [headers, ...data];
  downloadExcel(allData, filename);
}
