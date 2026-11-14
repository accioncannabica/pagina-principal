export type DataCell = number | string | null;
export type DataRow = Record<string, DataCell>;
export interface Description {
  column: string; n: number; missing: number; mean: number | null; median: number | null;
  min: number | null; max: number | null; q1: number | null; q3: number | null; sd: number | null;
  outliers: number; distinct: number;
}
export function quantile(sorted: number[], p: number): number | null {
  if (!sorted.length) return null;
  const at = (sorted.length - 1) * p;
  const lo = Math.floor(at), hi = Math.ceil(at);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (at - lo);
}
export function numericValues(rows: DataRow[], column: string): number[] {
  return rows.map(r => r[column]).filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
}
export function describe(rows: DataRow[], column: string): Description {
  const v = numericValues(rows, column).sort((a, b) => a - b);
  const n = v.length, mean = n ? v.reduce((s, x) => s + x, 0) / n : null;
  const q1 = quantile(v, 0.25), q3 = quantile(v, 0.75);
  const iqr = q1 !== null && q3 !== null ? q3 - q1 : 0;
  return {
    column, n, missing: rows.length - n, mean, median: quantile(v, 0.5), min: n ? v[0] : null,
    max: n ? v[n - 1] : null, q1, q3,
    sd: n > 1 && mean !== null ? Math.sqrt(v.reduce((s, x) => s + (x - mean) ** 2, 0) / (n - 1)) : null,
    outliers: q1 === null || q3 === null ? 0 : v.filter(x => x < q1 - 1.5 * iqr || x > q3 + 1.5 * iqr).length,
    distinct: new Set(v).size,
  };
}
export function correlation(rows: DataRow[], x: string, y: string) {
  const pairs = rows.filter(r => typeof r[x] === 'number' && typeof r[y] === 'number' && Number.isFinite(r[x]) && Number.isFinite(r[y]));
  const n = pairs.length;
  if (n < 2) return { r: null, n };
  const mx = pairs.reduce((s, p) => s + Number(p[x]), 0) / n;
  const my = pairs.reduce((s, p) => s + Number(p[y]), 0) / n;
  let xy = 0, xx = 0, yy = 0;
  for (const p of pairs) { const dx = Number(p[x]) - mx, dy = Number(p[y]) - my; xy += dx * dy; xx += dx * dx; yy += dy * dy; }
  return { r: xx && yy ? Math.max(-1, Math.min(1, xy / Math.sqrt(xx * yy))) : null, n };
}
export function histogram(values: number[]) {
  if (!values.length) return [];
  const lo = Math.min(...values), hi = Math.max(...values);
  const count = lo === hi ? 1 : Math.min(12, Math.max(4, Math.ceil(Math.log2(values.length) + 1)));
  const width = (hi - lo) / count || 1;
  const bins = Array.from({ length: count }, (_, i) => ({ lower: lo + i * width, upper: lo + (i + 1) * width, count: 0 }));
  for (const v of values) bins[Math.min(count - 1, Math.floor((v - lo) / width))].count++;
  return bins;
}