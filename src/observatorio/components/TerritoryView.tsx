import { useEffect, useMemo, useRef, useState } from 'react';
import * as L from 'leaflet';
import type { FeatureCollection } from 'geojson';
import { Flame, Layers3, LocateFixed, MapPin, ShieldCheck } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import type { Country } from '../data/countries';
import { METRIC_LABELS, type GeographyLevel, type HeatPoint, type JudicialMetric, type TerritoryRecord } from '../data/research';
import type { OpenDataState } from '../lib/openData';
import { downloadCsv } from '../lib/exports';
import { localDataUrl } from '../lib/assets';
import { fmt } from './ui';
import { ExportButton, Notice, ResearchHeading, SourceLink, SummaryStrip } from './ResearchUI';
import { aggregateTerritory, geographyLevels as levels, seriesLabel, seriesOf, unitLabel, type TerritoryAggregate as Aggregate } from '../lib/territory';

export function weightColor(value: number, max: number, allDrugs = false) {
  const t = Math.min(1, max > 0 ? Math.sqrt(Math.max(0, value) / max) : 0);
  const from = allDrugs ? [39, 32, 65] : [25, 72, 69], to = allDrugs ? [196, 181, 253] : [251, 185, 65];
  return `rgb(${from.map((c, i) => Math.round(c + (to[i] - c) * t)).join(',')})`;
}

class HeatCanvas extends L.Layer {
  private canvas = document.createElement('canvas');
  private mapRef?: L.Map;
  constructor(private points: HeatPoint[], private radius: number, private allDrugs = false) { super(); }
  onAdd(map: L.Map): this {
    this.mapRef = map;
    this.canvas.className = 'leaflet-heat-canvas';
    this.canvas.setAttribute('aria-hidden', 'true');
    map.getPane('overlayPane')?.appendChild(this.canvas);
    map.on('moveend zoomend resize', this.render);
    this.render();
    return this;
  }
  onRemove(map: L.Map): this { map.off('moveend zoomend resize', this.render); this.canvas.remove(); return this; }
  private render = () => {
    const map = this.mapRef;
    if (!map) return;
    const { x, y } = map.getSize();
    this.canvas.width = x; this.canvas.height = y;
    L.DomUtil.setPosition(this.canvas, map.containerPointToLayerPoint([0, 0]));
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, x, y);
    ctx.globalCompositeOperation = 'screen';
    const max = Math.max(1, ...this.points.map(p => p.value));
    for (const point of this.points) {
      const at = map.latLngToContainerPoint([point.lat, point.lon]);
      const radius = this.radius;
      const gradient = ctx.createRadialGradient(at.x, at.y, 0, at.x, at.y, radius);
      const opacity = 0.2 + 0.65 * Math.sqrt(point.value / max);
      gradient.addColorStop(0, this.allDrugs ? `rgba(214,190,255,${opacity})` : `rgba(255,178,65,${opacity})`);
      gradient.addColorStop(0.35, this.allDrugs ? `rgba(135,95,235,${opacity * 0.7})` : `rgba(69,218,160,${opacity * 0.7})`);
      gradient.addColorStop(1, 'rgba(10,90,100,0)');
      ctx.fillStyle = gradient; ctx.fillRect(at.x - radius, at.y - radius, radius * 2, radius * 2);
    }
  };
}

function GeographicMap({ groups, points, level, heat, radius, reset, onSelect }: { groups: Aggregate[]; points: HeatPoint[]; level: GeographyLevel; heat: boolean; radius: number; reset: number; onSelect: (r: Aggregate) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [world, setWorld] = useState<FeatureCollection | null>(null);
  const [boroughs, setBoroughs] = useState<FeatureCollection | null>(null);
  const [argProvinces, setArgProvinces] = useState<FeatureCollection | null>(null);
  const [tileError, setTileError] = useState(false);
  useEffect(() => {
    const abort = new AbortController();
    fetch(localDataUrl('world.geojson'), { signal: abort.signal }).then(r => { if (!r.ok) throw new Error('Sin geometría'); return r.json(); }).then(setWorld).catch(() => {});
    fetch(localDataUrl('nyc-boroughs.geojson'), { signal: abort.signal }).then(r => { if (!r.ok) throw new Error('Sin geometría'); return r.json(); }).then(setBoroughs).catch(() => {});
    fetch(localDataUrl('arg-provinces.geojson'), { signal: abort.signal }).then(r => { if (!r.ok) throw new Error('Sin geometría'); return r.json(); }).then(setArgProvinces).catch(() => {});
    return () => abort.abort();
  }, []);
  useEffect(() => {
    if (!ref.current) return;
    const map = L.map(ref.current, { center: [20, -30], zoom: 2, zoomSnap: 0.25, zoomDelta: 0.5, minZoom: 2, maxZoom: 14, scrollWheelZoom: false, worldCopyJump: true });
    mapRef.current = map;
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>', maxZoom: 19, className: 'territory-base-tiles' }).on('tileerror', () => setTileError(true)).addTo(map);
    map.attributionControl.setPrefix('<a href="https://leafletjs.com/">Leaflet</a>');
    map.attributionControl.addAttribution('Límites: Natural Earth / NYC DCP / IGN');
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(ref.current);
    return () => { observer.disconnect(); map.remove(); mapRef.current = null; };
  }, []);
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const layer = L.layerGroup().addTo(map);
    const max = Math.max(1, ...groups.map(r => r.value));
    if (world && level === 'country') {
      L.geoJSON(world, {
        style: feature => {
          const iso = feature?.properties?.ADM0_A3;
          const g = groups.find(r => r.iso === iso);
          return { weight: 0.6, color: '#50606a', fillColor: g ? weightColor(g.value, max, g.context) : '#18242d', fillOpacity: g ? 0.8 : 0.5 };
        },
        onEachFeature: (feature, polygon) => {
          const g = groups.find(r => r.iso === feature.properties?.ADM0_A3);
          const node = document.createElement('span');
          node.textContent = `${feature.properties?.NAME_ES || feature.properties?.NAME || ''}: ${g ? `${fmt(g.value)} ${unitLabel(g.records[0])}; universo de la fuente` : 'sin datos específicos'}`;
          polygon.bindTooltip(node);
          if (g) polygon.on('click', () => onSelect(g));
        },
      }).addTo(layer);
    }
    if (argProvinces && level === 'province' && groups.some(g => g.iso === 'ARG')) {
      L.geoJSON(argProvinces, {
        style: feature => {
          const g = groups.find(r => r.iso === 'ARG' && r.name === feature?.properties?.nombre);
          return { weight: 0.7, color: '#7a749a', fillColor: g ? weightColor(g.value, max, g.context) : '#18242d', fillOpacity: g ? 0.7 : 0.35 };
        },
        onEachFeature: (feature, polygon) => {
          const g = groups.find(r => r.iso === 'ARG' && r.name === feature.properties?.nombre);
          const label = document.createElement('span');
          label.textContent = `${feature.properties?.nombre}: ${g ? `${fmt(g.value)} ${unitLabel(g.records[0])}` : 'sin datos'}`;
          polygon.bindTooltip(label);
          if (g) polygon.on('click', () => onSelect(g));
        },
      }).addTo(layer);
    }
    if (boroughs && level === 'municipality' && groups.some(g => g.iso === 'USA' && g.records.some(r => r.municipality === 'Nueva York'))) {
      L.geoJSON(boroughs, {
        style: feature => {
          const group = groups.find(g => g.iso === 'USA' && g.records.some(r => r.district === feature?.properties?.name));
          return { weight: 1, color: '#608680', fillColor: group ? weightColor(group.value, max) : '#20303a', fillOpacity: heat ? 0.2 : 0.55 };
        },
        onEachFeature: (feature, polygon) => {
          const group = groups.find(g => g.iso === 'USA' && g.records.some(r => r.district === feature.properties?.name));
          const label = document.createElement('span');
          label.textContent = `${feature.properties?.name}: ${group ? `${fmt(group.value)} registros` : 'sin dato para esta selección'}`;
          polygon.bindTooltip(label);
          if (group) polygon.on('click', () => onSelect(group));
        },
      }).addTo(layer);
    }
    if (heat && points.length) new HeatCanvas(points, radius, groups.every(g => g.context)).addTo(layer);
    for (const g of groups) {
      const marker = L.circleMarker([g.lat, g.lon], { radius: heat ? 5 : 7 + 19 * Math.sqrt(g.value / Math.max(1, max)), color: g.context ? '#c4b5fd' : '#f8dfa3', weight: 1, fillColor: weightColor(g.value, max, g.context), fillOpacity: heat ? 0.4 : 0.85 });
      const node = document.createElement('span'); node.textContent = `${g.name}: ${fmt(g.value)} ${unitLabel(g.records[0])}${g.context ? ' · todas las drogas' : ' · cannabis'}`;
      marker.bindTooltip(node).on('click', () => onSelect(g)).addTo(layer);
    }
    return () => { layer.remove(); };
  }, [groups, points, world, boroughs, argProvinces, level, heat, radius, onSelect]);
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (level === 'country' || !groups.length) map.setView([16, -30], 2);
    else map.fitBounds(L.latLngBounds(groups.map(r => [r.lat, r.lon])), { padding: [36, 36], maxZoom: level === 'municipality' ? 10 : 5, animate: false });
  }, [groups, level, reset]);
  return <div><div ref={ref} className="territory-map" role="region" aria-label="Mapa geográfico de agregados de detenciones, procesos y privación de libertad" />{tileError && <p className="mt-2 text-[10px] text-amber-200/75">El fondo cartográfico no está disponible. Los agregados y las geometrías locales siguen accesibles; no afecta a las cifras.</p>}</div>;
}

export default function TerritoryView({ data, countries }: { data: OpenDataState; countries: Country[] }) {
  const [series, setSeries] = useState('arg-sneep');
  const [level, setLevel] = useState<GeographyLevel>('province');
  const [metric, setMetric] = useState<JudicialMetric>('imprisoned');
  const [unit, setUnit] = useState<TerritoryRecord['unit']>('people');
  const [year, setYear] = useState(data.argentina.censusYear);
  const [country, setCountry] = useState('all');
  const [province, setProvince] = useState('all');
  const [municipality, setMunicipality] = useState('all');
  const [context, setContext] = useState(true);
  const [heat, setHeat] = useState(true);
  const [radius, setRadius] = useState(30);
  const [reset, setReset] = useState(0);
  const [selected, setSelected] = useState<Aggregate | null>(null);
  const collections = [...new Map(data.territory.map(r => [seriesOf(r), seriesLabel(r)])).entries()];
  const sourceRows = useMemo(() => data.territory.filter(r => seriesOf(r) === series), [data.territory, series]);
  const chooseSource = (id: string) => {
    const next = data.territory.filter(r => seriesOf(r) === id);
    const lastYear = Math.max(...next.map(r => r.year));
    const current = next.filter(r => r.year === lastYear);
    const preferred: JudicialMetric = id === 'nyc' || id === 'arg-case-reports' ? 'arrests' : current.some(r => typeof r.imprisoned === 'number') ? 'imprisoned' : current.some(r => typeof r.sentenced === 'number') ? 'sentenced' : current.some(r => typeof r.cases === 'number') ? 'cases' : 'prosecuted';
    setSeries(id); setYear(lastYear); setMetric(preferred);
    setUnit(current.find(r => typeof r[preferred] === 'number')?.unit || current[0]?.unit || 'people');
    setLevel(current.some(r => r.level === 'province') ? 'province' : current.some(r => r.level === 'municipality') ? 'municipality' : 'country');
    setContext(current[0]?.scope === 'all-drugs'); setCountry('all'); setProvince('all'); setMunicipality('all'); setSelected(null);
  };
  const years = [...new Set(sourceRows.map(r => r.year))].sort((a, b) => b - a);
  const allowed = countries.map(c => c.iso);
  const available = sourceRows.filter(r => allowed.includes(r.iso) && r.year === year && (country === 'all' || r.iso === country));
  const provinces = [...new Set(available.map(r => r.province).filter(Boolean))];
  const municipalities = [...new Set(available.filter(r => province === 'all' || province === r.province).map(r => r.municipality).filter(Boolean))];
  const rows = useMemo(() => sourceRows.filter(r => allowed.includes(r.iso) && r.year === year && r.unit === unit && (country === 'all' || country === r.iso) && (province === 'all' || province === r.province) && (municipality === 'all' || municipality === r.municipality) && r.scope === (context ? 'all-drugs' : 'cannabis')), [sourceRows, countries, year, country, province, municipality, context, unit]);
  const groups = useMemo(() => aggregateTerritory(rows, metric, level, countries), [rows, metric, level, countries]);
  const currentSelection = selected ? groups.find(g => g.id === selected.id) : null;
  const points = useMemo<HeatPoint[]>(() => {
    if (series === 'nyc' && metric === 'arrests' && unit === 'arrest-records' && level === 'municipality') return data.snapshot.points.filter(p => p.year === year && groups.some(g => g.records.some(r => r.district === p.borough)));
    return groups.filter(g => g.value >= 5).map(g => ({ id: g.id, year, borough: g.name, lat: g.lat, lon: g.lon, value: g.value }));
  }, [series, metric, unit, level, groups, data.snapshot.points, year]);
  const sum = groups.reduce((s, g) => s + g.value, 0);
  const first = sourceRows.find(r => r.year === year);
  const isSneep = series === 'arg-sneep';
  const isSample = first?.timeBasis === 'sample';
  const isPress = first?.timeBasis === 'case-report';
  const metricLabel = isSneep && metric === 'prosecuted' ? 'Procesadas dentro de la población presa' : METRIC_LABELS[metric];
  return <div className="research-view">
    <ResearchHeading eyebrow="Atlas territorial / Argentina e internacional" title="El territorio de la criminalización." description="Fuentes documentadas por país, provincia y municipio. Elegí una colección: los censos penitenciarios, registros policiales, muestras académicas y operativos de prensa no se mezclan.">
      <ExportButton onClick={() => downloadCsv(`${series}-${year}-${metric}.csv`, groups.flatMap(g => g.records))} />
    </ResearchHeading>
    <div className="mb-5 flex flex-wrap items-end gap-3">
      <button className="research-button border-violet-400/30 text-violet-200" onClick={() => chooseSource('arg-sneep')}>Argentina / Ley 23.737</button>
      <button className="research-button" onClick={() => chooseSource('arg-cannabis-sample')}>Argentina / causas de cannabis</button>
      <button className="research-button" onClick={() => chooseSource('nyc')}>Nueva York / cannabis</button>
      <label className="research-field min-w-0 flex-1">Colección y universo<select aria-label="Colección y universo" className="research-select" value={series} onChange={e => chooseSource(e.target.value)}>{collections.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label>
    </div>
    <SummaryStrip items={[
      { label: metricLabel, value: groups.length ? fmt(sum) : 'N/D', color: context ? '#c4b5fd' : '#fbbf24', note: `${context ? 'Todas las drogas, no solo cannabis' : 'Cannabis'} · universo seleccionado` },
      { label: 'Territorios con dato', value: String(groups.length), note: levels[level] },
      { label: 'Naturaleza del conjunto', value: isSneep ? 'Censo en prisión' : isSample ? 'Muestra' : isPress ? 'Partes publicados' : first?.timeBasis === 'flow' ? 'Flujo del período' : 'Registro policial', note: isSample ? 'No probabilística ni representativa' : isPress ? 'No es un censo municipal' : 'No equivale a personas consumidoras' },
      { label: 'Período del dato', value: first?.period || String(year), note: isSneep ? 'Ubicación del establecimiento, no del hecho' : 'Ver definición en la fuente' },
    ]} />
    {isSneep && <Notice>Fuente oficial SNEEP {data.argentina.censusYear}: <strong>{fmt(data.argentina.selectedPeople)} personas en prisión</strong> con al menos una mención a la Ley 23.737; <strong>{fmt(data.argentina.processedInCustody)} procesadas dentro de ese universo</strong>. Todas las drogas, no solo cannabis. El detalle municipal cubre {data.argentina.municipalityCount} municipios bonaerenses y {fmt(data.argentina.municipalMappedPeople)} personas en {data.argentina.matchedFacilities} unidades emparejadas: es parcial, excluye unidades no vinculadas y federales. Registro geográfico PBA {data.argentina.registryPeriod || 'según versión publicada'} aplicado al censo {data.argentina.censusYear}.</Notice>}
    {isSample && <Notice>La publicación académica estudia <strong>42 causas entre 2010 y 2020</strong> en 12 jurisdicciones, con 59 personas únicas y 64 participaciones persona-causa. El mapa muestra CAUSAS por provincia, no personas procesadas. No son 42 causas de 2020 ni un total nacional; no se extrapola la muestra.</Notice>}
    {isPress && <Notice>Estos son operativos y resoluciones publicados, no estadísticas exhaustivas. Pueden involucrar varias sustancias y varios municipios. Se preserva el período de cada noticia y, cuando corresponde, se ubica una sede judicial. No se infiere culpabilidad ni permanencia posterior en prisión.</Notice>}
    <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      <label className="research-field">Indicador<select aria-label="Indicador" className="research-select" value={metric} onChange={e => { const m = e.target.value as JudicialMetric; setMetric(m); setUnit(m === 'cases' ? 'cases' : m === 'arrests' && sourceRows.some(r => r.unit === 'arrest-records') ? 'arrest-records' : 'people'); }}>{Object.entries(METRIC_LABELS).map(([k, v]) => <option key={k} value={k}>{isSneep && k === 'prosecuted' ? 'Procesadas dentro de prisión' : v}</option>)}</select></label>
      <label className="research-field">Año territorial<select aria-label="Año territorial" className="research-select" value={year} onChange={e => { setYear(Number(e.target.value)); setProvince('all'); setMunicipality('all'); }}>{years.map(y => <option key={y} value={y}>{y}{isSample ? ' (fin del intervalo)' : ''}</option>)}</select></label>
      <label className="research-field">Escala<select aria-label="Escala" className="research-select" value={level} onChange={e => setLevel(e.target.value as GeographyLevel)}>{Object.entries(levels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
      <label className="research-field">País<select aria-label="País" className="research-select" value={country} onChange={e => { setCountry(e.target.value); setProvince('all'); setMunicipality('all'); }}><option value="all">Todos los países</option>{countries.map(c => <option key={c.iso} value={c.iso}>{c.name}</option>)}</select></label>
      <label className="research-field">Provincia / estado<select aria-label="Provincia / estado" className="research-select" value={province} onChange={e => { setProvince(e.target.value); setMunicipality('all'); }}><option value="all">Todas</option>{provinces.map(p => <option key={p}>{p}</option>)}</select></label>
      <label className="research-field">Municipio<select aria-label="Municipio" className="research-select" value={municipality} onChange={e => setMunicipality(e.target.value)}><option value="all">Todos</option>{municipalities.map(p => <option key={p}>{p}</option>)}</select></label>
    </div>
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3 text-xs"><button onClick={() => setHeat(v => !v)} className={`research-button ${heat ? 'text-emerald-300' : ''}`}><Flame size={14} />{heat ? 'Calor activado' : 'Ver calor'}</button><label className="flex items-center gap-2 text-slate-400">Radio<input aria-label="Radio del mapa de calor" type="range" min="15" max="65" value={radius} onChange={e => setRadius(Number(e.target.value))} className="w-24 accent-emerald-400" /></label><button className="research-button" onClick={() => setReset(v => v + 1)}><LocateFixed size={14} />Reencuadrar</button></div>
      <div className="flex flex-wrap items-center gap-3"><label className="flex items-center gap-2 text-[11px] text-slate-400">Unidad<select aria-label="Unidad territorial" className="research-select w-auto" value={unit} onChange={e => setUnit(e.target.value as TerritoryRecord['unit'])}><option value="arrest-records">Registros de detención</option><option value="people">Personas</option><option value="cases">Causas / expedientes</option></select></label><label className="flex items-center gap-2 text-[11px] text-slate-400"><input type="checkbox" checked={context} onChange={e => setContext(e.target.checked)} className="accent-violet-400" />Todas las drogas / Ley 23.737 (no solo cannabis)</label></div>
    </div>
    <GeographicMap groups={groups} points={points} level={level} heat={heat} radius={radius} reset={reset} onSelect={setSelected} />
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[10px] text-slate-500"><span className="flex items-center gap-2"><span>Menor peso</span><span className="h-2 w-32" style={{ background: context ? 'linear-gradient(90deg,#272041,#c4b5fd)' : 'linear-gradient(90deg,#194845,#fbb941)' }} /><span>Mayor peso</span><span className="ml-2 h-2 w-2 bg-slate-700" />Sin dato</span><span><Layers3 size={12} className="mr-1 inline" />Países y provincias argentinas: polígonos · municipios: centroides</span></div>
    {!groups.length && <Notice>No hay datos verificables para este indicador, escala y período. No se asume cero. En SNEEP hay stock de personas en prisión, no detenciones anuales; en la muestra académica hay causas, no una distribución provincial de personas procesadas.</Notice>}
    {currentSelection && <section className="mt-5 border-y border-emerald-400/20 py-5"><p className="flex items-center gap-2 text-base font-semibold text-white"><MapPin size={16} className="text-emerald-300" />{currentSelection.name}<span className="ml-auto text-emerald-300">{fmt(currentSelection.value)}</span></p>{[...new Map(currentSelection.records.map(r => [r.sourceUrl + r.period, r])).values()].map(r => <div key={r.id} className="mt-3"><p className="text-[11px] text-slate-300">{r.period || r.year} · {unitLabel(r)} · {r.geographyBasis || 'geografía de la fuente'}</p><p className="mt-1 text-xs leading-relaxed text-slate-400">{r.note}</p><div className="mt-2"><SourceLink href={r.sourceUrl}>{r.sourceName}</SourceLink></div></div>)}</section>}
    <Notice tone="green"><ShieldCheck size={14} className="mr-1 inline" />Sin nombres, domicilios, identificadores individuales ni coordenadas de personas. {series === 'nyc' ? 'NYPD: calor por centroides de comisarías con al menos 5 registros, redondeados a 0,01°; celdas pequeñas suprimidas.' : 'Calor sobre agregados territoriales de al menos 5 observaciones, no sobre ubicaciones individuales. Los municipios SNEEP con celdas pequeñas no se publican; sus faltantes no son cero.'}</Notice>
    <Notice tone="slate">El calor indica peso visual del universo seleccionado, no tasas de consumo ni riesgo individual. Una detención no es una condena. SNEEP ubica cárceles, no lugares del delito o residencia; los procesados allí contados están privados de libertad. No se suman censos de años distintos, RUD y SNEEP, ni partes de prensa a totales administrativos. Las cifras de NYC no son un total estadounidense.</Notice>
    <div className="mt-5 max-h-[32rem] overflow-auto"><table className="research-table min-w-[800px]"><thead><tr><th>Territorio</th><th>Ámbito</th><th>Valor</th><th>Período / unidad</th><th>Fuente y detalle</th></tr></thead><tbody>{groups.map(g => <tr key={g.id} className="hover:bg-white/5"><td><button className="text-left text-slate-100 hover:text-emerald-300" onClick={() => setSelected(g)}>{g.name}</button></td><td>{g.context ? 'Todas las drogas' : 'Cannabis'}</td><td className="font-medium tabular-nums" style={{ color: g.context ? '#c4b5fd' : '#fbbf24' }}>{fmt(g.value)}</td><td>{g.records[0].period || year}<p className="mt-1 text-[10px]">{unitLabel(g.records[0])}</p></td><td><SourceLink href={g.records[0].sourceUrl}>Documento / datos originales</SourceLink><button className="mt-1 block text-[10px] text-slate-400 underline underline-offset-2" onClick={() => setSelected(g)}>Ver definición y cobertura</button></td></tr>)}</tbody></table></div>
  </div>;
}
