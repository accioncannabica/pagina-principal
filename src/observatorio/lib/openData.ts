import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Country } from '../data/countries';
import { COUNTRIES } from '../data/countries';
import { CULTURAL_EVENTS, JUSTICE_COSTS, CONTEXT_TERRITORY, type CulturalEvent, type JusticeCost, type NycSnapshot, type TerritoryRecord } from '../data/research';
import { fetchJson, loadNyc } from './nyc';
import { localDataUrl } from './assets';
import initialSnapshot from '../data/snapshots/nyc.json';
import initialArgentina from '../data/snapshots/arg-justice.json';
import { ADDITIONAL_JUSTICE_COSTS, ARGENTINA_RESEARCH_TERRITORY, COST_CURRENCIES, costKey } from '../data/justiceEvidence';
import { SCIENCE_EVENTS } from '../data/science';

export interface ArgentinaSnapshot {
  retrievedAt: string;
  censusYear: number;
  rawRows: number;
  selectedPeople: number;
  processedInCustody: number;
  sentencedInCustody: number;
  primaryOffencePeople: number;
  provinceCount: number;
  municipalMappedPeople: number;
  municipalityCount: number;
  matchedFacilities: number;
  unmatchedProvincialPeople: number;
  sourceSha256: string;
  sourceUrl: string;
  catalogUrl: string;
  registryUrl: string;
  registryPeriod: string;
  records: TerritoryRecord[];
}

export interface CountryUpdate {
  iso: string;
  sourceUrl: string;
  period: string;
  values: Partial<Pick<Country, 'prevalence' | 'users' | 'arrests' | 'acceptance' | 'maxPrison' | 'pop'>>;
}
export interface PublicFeed {
  schemaVersion: 1;
  publishedAt: string;
  countryUpdates: CountryUpdate[];
  events: CulturalEvent[];
  costs: JusticeCost[];
  territory: TerritoryRecord[];
}

const baseFeed: PublicFeed = { schemaVersion: 1, publishedAt: '', countryUpdates: [], events: [], costs: [], territory: [] };
const knownIsos = new Set(COUNTRIES.map(c => c.iso));
const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const number = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0;
const nullableNumber = (v: unknown) => v === null || number(v);
const text = (v: unknown): v is string => typeof v === 'string' && v.length <= 4000;
const iso = (v: unknown): v is string => typeof v === 'string' && knownIsos.has(v);
const date = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v) && Number.isFinite(Date.parse(v));
const day = (v: unknown): v is string => date(v) && /^\d{4}-\d{2}-\d{2}$/.test(v) && new Date(v).toISOString().slice(0, 10) === v;
export const publicUrl = (v: unknown): v is string => {
  if (typeof v !== 'string') return false;
  try { const url = new URL(v); return url.protocol === 'https:' && !url.username && !url.password; } catch { return false; }
};

export function validateFeed(value: unknown): PublicFeed {
  if (!isObject(value) || value.schemaVersion !== 1 || !date(value.publishedAt)) throw new Error('Se requiere schemaVersion: 1 y publishedAt ISO válido.');
  for (const key of ['countryUpdates', 'events', 'costs', 'territory']) {
    if (value[key] !== undefined && (!Array.isArray(value[key]) || value[key].length > 10000)) throw new Error(`La colección ${key} no es válida.`);
  }
  const updates = (value.countryUpdates ?? []) as unknown[];
  const allowed = ['prevalence', 'users', 'arrests', 'acceptance', 'maxPrison', 'pop'];
  for (const row of updates) {
    if (!isObject(row) || !iso(row.iso) || !publicUrl(row.sourceUrl) || !text(row.period) || !row.period || !isObject(row.values)) throw new Error('Una actualización de país no tiene fuente, período o valores válidos.');
    for (const [key, v] of Object.entries(row.values)) {
      if (!allowed.includes(key) || !number(v) || (['prevalence', 'acceptance'].includes(key) && v > 100)) throw new Error(`Valor inválido para ${key}.`);
    }
  }
  for (const row of (value.events ?? []) as unknown[]) {
    if (!isObject(row) || !iso(row.iso) || ![row.id, row.name, row.city, row.venue, row.description].every(text) || !/^[a-zA-Z0-9_-]{1,80}$/.test(String(row.id)) || !publicUrl(row.url) || !publicUrl(row.sourceUrl) || !date(row.verifiedAt) || !['Exposición', 'Festival', 'Copa', 'Encuentro', 'Congreso científico', 'Simposio', 'Jornada académica'].includes(String(row.kind)) || !['confirmed', 'check'].includes(String(row.dateStatus)) || !(row.start === null || day(row.start)) || !(row.end === null || day(row.end)) || (row.dateStatus === 'confirmed' && row.start === null) || (typeof row.start === 'string' && typeof row.end === 'string' && row.end < row.start)) throw new Error('Evento inválido: revisar fecha, país y enlaces HTTPS.');
    if (row.focus !== undefined && !['Cultura', 'Salud', 'Investigación', 'Industria y regulación'].includes(String(row.focus))) throw new Error('Enfoque de evento inválido.');
    if (row.modality !== undefined && !['Presencial', 'Virtual', 'Híbrida'].includes(String(row.modality))) throw new Error('Modalidad de evento inválida.');
    if (row.lat !== undefined && row.lat !== null && (typeof row.lat !== 'number' || !Number.isFinite(row.lat) || Math.abs(row.lat) > 90)) throw new Error('Latitud de evento inválida.');
    if (row.lon !== undefined && row.lon !== null && (typeof row.lon !== 'number' || !Number.isFinite(row.lon) || Math.abs(row.lon) > 180)) throw new Error('Longitud de evento inválida.');
  }
  for (const row of (value.costs ?? []) as unknown[]) {
    if (!isObject(row) || !iso(row.iso) || !Number.isInteger(row.year) || Number(row.year) < 1900 || Number(row.year) > 2100 || !number(row.totalMillions) || ![row.courtsMillions, row.policingMillions, row.correctionsMillions].every(nullableNumber) || !COST_CURRENCIES.includes(String(row.currency)) || ![row.sourceName, row.scope, row.method].every(text) || !publicUrl(row.sourceUrl) || !date(row.verifiedAt)) throw new Error('Registro de costos inválido: conservar moneda, año, alcance y fuente.');
    if (row.id !== undefined && (!text(row.id) || !row.id)) throw new Error('Identificador de costo inválido.');
    if (row.substanceScope !== undefined && !['cannabis', 'all-drugs'].includes(String(row.substanceScope))) throw new Error('Ámbito de sustancia inválido.');
    if (row.evidenceType !== undefined && !['estimate', 'executed', 'budget', 'scenario'].includes(String(row.evidenceType))) throw new Error('Tipo de evidencia de gasto inválido.');
    for (const k of ['territory', 'fiscalPeriod']) if (row[k] !== undefined && !text(row[k])) throw new Error(`Campo de gasto inválido: ${k}`);
    if (row.perCase !== undefined && !number(row.perCase)) throw new Error('Costo unitario inválido.');
    if (row.originalMillions !== undefined && (!number(row.originalMillions) || row.originalCurrency !== 'ARS')) throw new Error('Importe original inválido: mantener la moneda publicada.');
    if (row.prosecutionMillions !== undefined && !nullableNumber(row.prosecutionMillions)) throw new Error('Desglose fiscal inválido.');
    if (row.publicationYear !== undefined && (!Number.isInteger(row.publicationYear) || Number(row.publicationYear) < 1900 || Number(row.publicationYear) > 2100)) throw new Error('Año de publicación inválido.');
  }
  for (const row of (value.territory ?? []) as unknown[]) {
    if (!isObject(row) || !iso(row.iso) || ![row.id, row.province, row.municipality, row.sourceName, row.note].every(text) || (row.district !== undefined && !text(row.district)) || !Number.isInteger(row.year) || Number(row.year) < 1900 || Number(row.year) > 2100 || !['country', 'province', 'municipality'].includes(String(row.level)) || !['cannabis', 'all-drugs'].includes(String(row.scope)) || !['people', 'arrest-records', 'cases'].includes(String(row.unit)) || !publicUrl(row.sourceUrl) || ![row.arrests, row.prosecuted, row.imprisoned].every(v => v === null || (number(v) && Number.isInteger(v))) || typeof row.lat !== 'number' || !Number.isFinite(row.lat) || Math.abs(row.lat) > 90 || typeof row.lon !== 'number' || !Number.isFinite(row.lon) || Math.abs(row.lon) > 180) throw new Error('Registro territorial inválido: solo agregados con coordenadas, fuente y métricas anulables.');
    for (const k of ['sentenced', 'cases']) if (row[k] !== undefined && !(row[k] === null || number(row[k]) && Number.isInteger(row[k]))) throw new Error(`Métrica territorial inválida: ${k}`);
    for (const k of ['seriesId', 'seriesName', 'period']) if (row[k] !== undefined && !text(row[k])) throw new Error(`Metadato territorial inválido: ${k}`);
    if (row.timeBasis !== undefined && !['stock', 'flow', 'sample', 'case-report'].includes(String(row.timeBasis))) throw new Error('Base temporal inválida.');
    if (row.geographyBasis !== undefined && !['custody-location', 'incident-location', 'judicial-seat', 'judicial-jurisdiction'].includes(String(row.geographyBasis))) throw new Error('Base geográfica inválida.');
    if (row.geographySourceUrl !== undefined && !publicUrl(row.geographySourceUrl)) throw new Error('Fuente geográfica inválida.');
    const keys = ['id', 'iso', 'province', 'municipality', 'district', 'level', 'lat', 'lon', 'year', 'arrests', 'prosecuted', 'imprisoned', 'sentenced', 'cases', 'seriesId', 'seriesName', 'period', 'timeBasis', 'geographyBasis', 'geographySourceUrl', 'scope', 'unit', 'sourceUrl', 'sourceName', 'note'];
    if (Object.keys(row).some(k => !keys.includes(k))) throw new Error('El registro territorial contiene campos no admitidos. No se aceptan identificadores individuales ni datos personales.');
  }
  return { ...baseFeed, ...value } as PublicFeed;
}

export function validateArgentinaSnapshot(value: unknown): ArgentinaSnapshot {
  if (!isObject(value) || !date(value.retrievedAt) || !number(value.censusYear) || !Number.isInteger(value.censusYear) || !publicUrl(value.sourceUrl) || typeof value.sourceSha256 !== 'string' || !/^[a-f0-9]{64}$/.test(value.sourceSha256)) throw new Error('Metadatos argentinos inválidos.');
  const feed = validateFeed({ schemaVersion: 1, publishedAt: value.retrievedAt, territory: value.records });
  const provinces = feed.territory.filter(r => r.seriesId === 'arg-sneep' && r.level === 'province');
  const national = feed.territory.find(r => r.seriesId === 'arg-sneep' && r.level === 'country');
  if (provinces.length !== 24 || !national || !number(value.selectedPeople) || !number(value.processedInCustody) || !number(value.sentencedInCustody) || feed.territory.some(r => r.iso !== 'ARG' || r.year !== value.censusYear || r.scope !== 'all-drugs' || r.unit !== 'people')) throw new Error('Universo SNEEP incompleto o incompatible.');
  for (const [metric, key] of [['imprisoned', 'selectedPeople'], ['prosecuted', 'processedInCustody'], ['sentenced', 'sentencedInCustody']] as const) {
    if (provinces.reduce((sum, r) => sum + (r[metric] ?? 0), 0) !== value[key] || national[metric] !== value[key]) throw new Error('Los totales argentinos no coinciden con la suma provincial.');
  }
  const municipalities = feed.territory.filter(r => r.level === 'municipality');
  if (municipalities.length !== value.municipalityCount || municipalities.some(r => (r.imprisoned ?? 0) < 5 || (r.prosecuted !== null && (r.prosecuted ?? 0) < 5) || (r.sentenced != null && r.sentenced < 5))) throw new Error('Celdas municipales inválidas o no protegidas.');
  return value as unknown as ArgentinaSnapshot;
}

function readCache<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    if (key === 'ac-feed-v1') return validateFeed(parsed) as T;
    if (key === 'ac-arg-v1') return validateArgentinaSnapshot(parsed) as T;
    if (!parsed || !Array.isArray(parsed.records) || !Array.isArray(parsed.points) || !date(parsed.retrievedAt)) return fallback;
    return parsed as T;
  } catch { return fallback; }
}
function cache(key: string, value: unknown) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage can be unavailable in private browsers. */ } }
function merge<T>(base: T[], extra: T[], id: (row: T) => string) {
  return [...new Map([...base, ...extra].map(row => [id(row), row])).values()];
}

export function useOpenData(view: string) {
  const [feed, setFeed] = useState<PublicFeed>(() => readCache('ac-feed-v1', baseFeed));
  const [snapshot, setSnapshot] = useState<NycSnapshot>(() => readCache('ac-nyc-v1', initialSnapshot as NycSnapshot));
  const [argentina, setArgentina] = useState<ArgentinaSnapshot>(() => readCache('ac-arg-v1', initialArgentina as ArgentinaSnapshot));
  const [syncing, setSyncing] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<string | null>(null);
  const [feedFetchedAt, setFeedFetchedAt] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [customUrl, setCustomUrl] = useState(() => { try { return localStorage.getItem('ac-feed-url') ?? ''; } catch { return ''; } });
  const lastNyc = useRef(0);
  const controller = useRef<AbortController | null>(null);

  const refresh = useCallback(async (force = false) => {
    controller.current?.abort();
    const abort = new AbortController();
    controller.current = abort;
    setSyncing(true);
    setLastAttempt(new Date().toISOString());
    const nextErrors: string[] = [];
    const feedTask = (async () => {
      try {
        const url = customUrl || localDataUrl('observatorio.json');
        const parsed = validateFeed(await fetchJson(url, abort.signal));
        if (!abort.signal.aborted) { setFeed(parsed); cache('ac-feed-v1', parsed); setFeedFetchedAt(new Date().toISOString()); }
      } catch (e) {
        if (!abort.signal.aborted) nextErrors.push(`Catálogo: ${e instanceof Error ? e.message : 'sin conexión'}. Se conserva la última versión.`);
      }
    })();
    const wantsNyc = ['territorio', 'eda', 'fuentes'].includes(view);
    const nycTask = (async () => {
      if (!(force || wantsNyc) || (!force && Date.now() - lastNyc.current < 15 * 60000)) return;
      try {
        const fresh = await loadNyc(abort.signal);
        if (!abort.signal.aborted) { setSnapshot(fresh); cache('ac-nyc-v1', fresh); lastNyc.current = Date.now(); }
      } catch (e) {
        if (!abort.signal.aborted) nextErrors.push(`NYPD: ${e instanceof Error ? e.message : 'sin conexión'}. Mostrando instantánea guardada, no datos en vivo.`);
      }
    })();
    const argentinaTask = (async () => {
      try {
        const next = validateArgentinaSnapshot(await fetchJson(localDataUrl('arg-justice-snapshot.json'), abort.signal));
        if (!abort.signal.aborted) { setArgentina(next); cache('ac-arg-v1', next); }
      } catch (e) {
        if (!abort.signal.aborted) nextErrors.push(`Argentina: ${e instanceof Error ? e.message : 'sin conexión'}. Se mantiene el agregado incluido.`);
      }
    })();
    await Promise.all([feedTask, nycTask, argentinaTask]);
    if (!abort.signal.aborted) { setErrors(nextErrors); setSyncing(false); }
  }, [customUrl, view]);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => { if (autoRefresh && document.visibilityState === 'visible') void refresh(); }, 15 * 60000);
    return () => { window.clearInterval(timer); controller.current?.abort(); };
  }, [refresh, autoRefresh]);

  const configureUrl = (url: string) => {
    if (url && !publicUrl(url)) throw new Error('El feed debe ser una URL HTTPS pública con CORS habilitado.');
    setCustomUrl(url);
    try { localStorage.setItem('ac-feed-url', url); } catch { /* Keep in memory when storage is unavailable. */ }
  };
  const importFeed = (value: unknown) => {
    const parsed = validateFeed(value);
    setFeed(parsed); cache('ac-feed-v1', parsed); setErrors([]);
  };

  const events = useMemo(() => merge([...CULTURAL_EVENTS, ...SCIENCE_EVENTS], feed.events, r => r.id), [feed.events]);
  const costs = useMemo(() => merge([...JUSTICE_COSTS, ...ADDITIONAL_JUSTICE_COSTS], feed.costs, costKey), [feed.costs]);
  const territory = useMemo(() => merge([...snapshot.records, ...CONTEXT_TERRITORY, ...argentina.records, ...ARGENTINA_RESEARCH_TERRITORY], feed.territory, r => r.id), [snapshot.records, argentina.records, feed.territory]);
  const countries = useMemo(() => COUNTRIES.map(c => {
    const update = feed.countryUpdates.find(u => u.iso === c.iso);
    return update ? { ...c, ...update.values } : c;
  }), [feed.countryUpdates]);

  return {
    feed, snapshot, syncing, lastAttempt, feedFetchedAt, errors, autoRefresh, setAutoRefresh, customUrl,
    configureUrl, importFeed, refresh,
    events, costs, territory, countries, argentina,
  };
}

export type OpenDataState = ReturnType<typeof useOpenData>;