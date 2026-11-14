import type { Country } from '../data/countries';
import type { GeographyLevel, JudicialMetric, TerritoryRecord } from '../data/research';

export interface TerritoryAggregate {
  id: string; name: string; iso: string; lat: number; lon: number; value: number;
  records: TerritoryRecord[]; context: boolean;
}
export const geographyLevels: Record<GeographyLevel, string> = { country: 'País', province: 'Provincia / estado', municipality: 'Municipio / distrito' };
const ranks: Record<GeographyLevel, number> = { country: 0, province: 1, municipality: 2 };
export function seriesOf(record: TerritoryRecord) {
  if (record.seriesId) return record.seriesId;
  if (record.id.startsWith('nyc-')) return 'nyc';
  if (record.sourceUrl.includes('mpba.gov.ar')) return 'mpba-rud';
  return record.sourceUrl;
}
export function seriesLabel(record: TerritoryRecord) {
  if (record.seriesName) return record.seriesName;
  if (seriesOf(record) === 'nyc') return 'NYPD / detenciones de cannabis';
  if (seriesOf(record) === 'mpba-rud') return 'MPBA / RUD Ley 23.737';
  return record.sourceName;
}
export function unitLabel(record: TerritoryRecord) {
  return record.unit === 'cases' ? 'causas' : record.unit === 'people' ? 'personas (definición de la fuente)' : 'registros de detención';
}
export function aggregateTerritory(rows: TerritoryRecord[], metric: JudicialMetric, level: GeographyLevel, countries: Country[]): TerritoryAggregate[] {
  const usable = rows.filter(r => typeof r[metric] === 'number' && Number.isFinite(r[metric]) && ranks[r.level] >= ranks[level]);
  // Parent totals supersede their own children, never another source or period.
  const sameUniverse = (a: TerritoryRecord, b: TerritoryRecord) => a.iso === b.iso && a.year === b.year && a.scope === b.scope && a.unit === b.unit && seriesOf(a) === seriesOf(b) && a.timeBasis === b.timeBasis;
  const disjoint = usable.filter(r => !usable.some(p => p !== r && sameUniverse(p, r) && ranks[p.level] < ranks[r.level] && (p.level === 'country' || p.province === r.province)));
  const groups = new Map<string, TerritoryAggregate>();
  for (const r of disjoint) {
    const suffix = level === 'country' ? '' : level === 'province' ? r.province : `${r.province}-${r.municipality}-${r.district || ''}`;
    const key = `${seriesOf(r)}-${r.year}-${r.iso}-${suffix}-${r.scope}-${r.unit}-${r.timeBasis || ''}`;
    const name = level === 'country' ? countries.find(c => c.iso === r.iso)?.name || r.iso : level === 'province' ? r.province : r.district ? `${r.municipality} / ${r.district}` : r.municipality;
    const previous = groups.get(key);
    if (previous) { previous.value += r[metric] ?? 0; previous.records.push(r); }
    else {
      const center = level === 'country' ? (r.iso === 'USA' ? [39, -98] : r.iso === 'ARG' ? [-36, -64] : [r.lat, r.lon]) : level === 'province' && r.iso === 'USA' ? [42.8, -75.5] : [r.lat, r.lon];
      groups.set(key, { id: key, name, iso: r.iso, lat: center[0], lon: center[1], value: r[metric] ?? 0, records: [r], context: r.scope !== 'cannabis' });
    }
  }
  return [...groups.values()];
}