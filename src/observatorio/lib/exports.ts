import Papa from 'papaparse';

export function download(name: string, content: string, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([content], { type: `${type};charset=utf-8` }));
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadCsv(name: string, rows: object[]) {
  download(name, `\uFEFF${Papa.unparse(rows, { escapeFormulae: true })}`, 'text/csv');
}