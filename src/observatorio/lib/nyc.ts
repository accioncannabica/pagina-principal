import { BOROUGHS, type NycSnapshot, type TerritoryRecord, type HeatPoint } from '../data/research';

export const NYC_BASE = 'https://data.cityofnewyork.us/resource/8h9b-rp9u.json';
const FILTER = "arrest_date >= '2022-01-01T00:00:00' AND (upper(pd_desc) like '%MARIJUANA%' OR upper(pd_desc) like '%CANNABIS%')";

export function nycQuery(kind: 'boroughs' | 'heat' | 'period') {
  const params = new URLSearchParams();
  params.set('$where', FILTER);
  if (kind === 'boroughs') {
    params.set('$select', 'date_extract_y(arrest_date) as year, arrest_boro, count(*) as arrests');
    params.set('$group', 'date_extract_y(arrest_date), arrest_boro');
    params.set('$order', 'year DESC');
    params.set('$limit', '500');
  } else if (kind === 'heat') {
    params.set('$where', `${FILTER} AND latitude between 40.4 and 41 AND longitude between -74.3 and -73.6`);
    params.set('$select', 'date_extract_y(arrest_date) as year, arrest_boro, arrest_precinct, avg(latitude) as lat, avg(longitude) as lon, count(*) as arrests');
    params.set('$group', 'date_extract_y(arrest_date), arrest_boro, arrest_precinct');
    params.set('$having', 'count(*) >= 5');
    params.set('$limit', '5000');
  } else {
    params.set('$select', 'max(arrest_date) as through');
  }
  return `${NYC_BASE}?${params}`;
}

export async function fetchJson(url: string, signal?: AbortSignal) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  const abort = () => controller.abort();
  signal?.addEventListener('abort', abort);
  try {
    const response = await fetch(url, { signal: controller.signal, cache: 'no-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
}

export async function loadNyc(signal?: AbortSignal): Promise<NycSnapshot> {
  const urls = [nycQuery('boroughs'), nycQuery('heat'), nycQuery('period')];
  const [rows, cells, period, metadata] = await Promise.all([
    fetchJson(urls[0], signal), fetchJson(urls[1], signal), fetchJson(urls[2], signal),
    fetchJson('https://data.cityofnewyork.us/api/views/8h9b-rp9u.json', signal).catch(() => null),
  ]);
  if (!Array.isArray(rows) || !Array.isArray(cells)) throw new Error('La fuente no devolvió agregados válidos.');
  const records: TerritoryRecord[] = rows.flatMap((r: Record<string, string>) => {
    const b = BOROUGHS[r.arrest_boro];
    if (!b || !Number.isFinite(Number(r.arrests)) || !Number.isFinite(Number(r.year))) return [];
    return [{
      id: `nyc-${r.year}-${r.arrest_boro}`, iso: 'USA', province: 'Nueva York', municipality: 'Nueva York', district: b.name,
      level: 'municipality' as const, lat: b.lat, lon: b.lon, year: Number(r.year), arrests: Number(r.arrests),
      prosecuted: null, imprisoned: null, scope: 'cannabis' as const, unit: 'arrest-records' as const,
      sourceUrl: 'https://data.cityofnewyork.us/d/8h9b-rp9u', sourceName: 'NYPD / NYC Open Data',
      note: 'Registros de detención del municipio, no personas únicas ni total de EE. UU. Selección por descripción MARIJUANA/CANNABIS; el año puede ser parcial.',
    }];
  });
  const points: HeatPoint[] = cells.flatMap((r: Record<string, string>) => {
    const lat = Number(r.lat), lon = Number(r.lon), value = Number(r.arrests), year = Number(r.year);
    if (![lat, lon, value, year].every(Number.isFinite) || value < 5 || !BOROUGHS[r.arrest_boro]) return [];
    return [{ id: `cell-${year}-${r.arrest_boro}-${r.arrest_precinct}`, year, borough: BOROUGHS[r.arrest_boro].name,
      lat: Math.round(lat * 100) / 100, lon: Math.round(lon * 100) / 100, value }];
  });
  if (!records.length) throw new Error('La consulta no contiene filas válidas; se conserva la última instantánea.');
  return {
    records, points, queries: urls, retrievedAt: new Date().toISOString(),
    through: typeof period?.[0]?.through === 'string' ? period[0].through.slice(0, 10) : '',
    sourceUpdatedAt: metadata?.rowsUpdatedAt ? new Date(metadata.rowsUpdatedAt * 1000).toISOString() : null,
  };
}