import { useMemo, useRef, useState } from 'react';
import Papa from 'papaparse';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';
import { FileUp, FlaskConical } from 'lucide-react';
import type { Country } from '../data/countries';
import type { TerritoryRecord } from '../data/research';
import { correlation, describe, histogram, numericValues, type DataCell, type DataRow } from '../lib/eda';
import { downloadCsv } from '../lib/exports';
import { fmt, axisStyle, gridStroke } from './ui';
import { ExportButton, Notice, ResearchHeading, SummaryStrip } from './ResearchUI';
import { seriesOf } from '../lib/territory';

export function normalizeImport(value: unknown): DataRow[] {
  if (!Array.isArray(value) || !value.length || value.length > 20000) throw new Error('Usá entre 1 y 20.000 filas, como lista de objetos.');
  return value.map((v, index) => {
    if (!v || typeof v !== 'object' || Array.isArray(v)) throw new Error(`La fila ${index + 1} no es un objeto.`);
    const entries = Object.entries(v);
    if (entries.length > 60) throw new Error('El límite es de 60 columnas.');
    return Object.fromEntries(entries.map(([k, cell]) => {
      if (!k || ['__proto__', 'prototype', 'constructor'].includes(k)) throw new Error('Nombre de columna no permitido.');
      let next: DataCell = null;
      if (typeof cell === 'number') next = Number.isFinite(cell) ? cell : null;
      else if (typeof cell === 'string') {
        const trimmed = cell.trim();
        next = !trimmed || /^(null|na|n\/a|n\/d)$/i.test(trimmed) ? null : /^[-+]?\d*\.?\d+(e[-+]?\d+)?$/i.test(trimmed) ? Number(trimmed) : trimmed.slice(0, 1000);
      } else if (cell !== null && cell !== undefined) throw new Error('Solo se aceptan celdas numéricas, de texto o nulas.');
      return [k, next];
    }));
  });
}

export default function EdaView({ countries, territory }: { countries: Country[]; territory: TerritoryRecord[] }) {
  const [dataset, setDataset] = useState('territory');
  const [custom, setCustom] = useState<DataRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [variable, setVariable] = useState('detenciones');
  const [xChoice, setXChoice] = useState('año');
  const [yChoice, setYChoice] = useState('detenciones');
  const [search, setSearch] = useState('');
  const [removeMissing, setRemoveMissing] = useState(false);
  const [omitOutliers, setOmitOutliers] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const raw: DataRow[] = useMemo(() => {
    if (dataset === 'custom') return custom;
    if (dataset === 'countries') return countries.map(c => ({ país: c.name, iso: c.iso, prevalencia: c.prevalence, usuarios_millones: c.users, detenciones_por_100mil: c.arrests, pena_máxima: c.maxPrison, aceptación: c.acceptance }));
    const allowed = new Set(countries.map(c => c.iso));
    if (dataset === 'argentina') return territory.filter(r => seriesOf(r) === 'arg-sneep' && r.level === 'province' && allowed.has(r.iso)).map(r => ({ provincia: r.province, año: r.year, privadas_de_libertad: r.imprisoned, procesadas_en_prisión: r.prosecuted, condenadas_en_prisión: r.sentenced ?? null }));
    return territory.filter(r => r.scope === 'cannabis' && r.unit === 'arrest-records' && allowed.has(r.iso)).map(r => ({ territorio: `${r.province} / ${r.municipality}${r.district ? ` / ${r.district}` : ''}`, año: r.year, detenciones: r.arrests, procesadas: r.prosecuted, presas: r.imprisoned }));
  }, [dataset, custom, countries, territory]);
  const columns = [...new Set(raw.flatMap(r => Object.keys(r)))];
  const numericColumns = dataset === 'territory' ? ['año', 'detenciones', 'procesadas', 'presas'] : columns.filter(k => numericValues(raw, k).length > 0);
  const field = numericColumns.includes(variable) ? variable : numericColumns[0] || '';
  const x = numericColumns.includes(xChoice) ? xChoice : numericColumns[0] || '';
  const y = numericColumns.includes(yChoice) ? yChoice : numericColumns[1] || x;
  const originalStat = describe(raw, field);
  const rows = useMemo(() => raw.filter(r => (!search || Object.values(r).some(v => String(v ?? '').toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es')))) && (!removeMissing || (typeof r[x] === 'number' && typeof r[y] === 'number')) && (!omitOutliers || typeof r[field] !== 'number' || originalStat.q1 === null || originalStat.q3 === null || (Number(r[field]) >= originalStat.q1 - 1.5 * (originalStat.q3 - originalStat.q1) && Number(r[field]) <= originalStat.q3 + 1.5 * (originalStat.q3 - originalStat.q1)))), [raw, search, removeMissing, omitOutliers, x, y, field]);
  const stats = numericColumns.map(k => describe(rows, k));
  const stat = describe(rows, field);
  const corr = correlation(rows, x, y);
  const bins = histogram(numericValues(rows, field)).map(b => ({ ...b, range: `${fmt(b.lower, 1)}–${fmt(b.upper, 1)}` }));
  const points = rows.flatMap((r, i) => typeof r[x] === 'number' && typeof r[y] === 'number' ? [{ x: r[x], y: r[y], name: String(r.territorio || r.país || `Fila ${i + 1}`) }] : []);
  const cellCount = rows.length * numericColumns.length;
  const missing = stats.reduce((s, r) => s + r.missing, 0);
  const statValue = (v: number | null) => v === null ? 'N/D' : fmt(v, Math.abs(v) < 100 ? 2 : 0);
  const importFile = async (file?: File) => {
    if (!file) return;
    try {
      if (file.size > 3 * 1024 * 1024) throw new Error('El archivo debe pesar menos de 3 MB.');
      const source = await file.text();
      let value: unknown;
      if (file.name.toLowerCase().endsWith('.json')) value = JSON.parse(source);
      else {
        const parsed = Papa.parse(source, { header: true, skipEmptyLines: true });
        if (parsed.errors.length) throw new Error(`CSV: ${parsed.errors[0].message}`);
        value = parsed.data;
      }
      const normalized = normalizeImport(value);
      setCustom(normalized); setFileName(file.name); setDataset('custom'); setError('');
      setSearch(''); setRemoveMissing(false); setOmitOutliers(false);
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo leer el archivo.'); }
    if (input.current) input.current.value = '';
  };
  return <div className="research-view">
    <ResearchHeading eyebrow="Laboratorio / Exploración de datos" title="Preguntar antes de concluir." description="EDA calculado sobre el conjunto seleccionado: distribución, faltantes, cuartiles, valores atípicos y correlaciones. También podés analizar un CSV o JSON local sin subirlo a un servidor.">
      <div className="flex flex-wrap gap-2"><button className="research-button" onClick={() => input.current?.click()}><FileUp size={14} />Importar dataset</button><ExportButton onClick={() => downloadCsv('eda-datos-filtrados.csv', rows)} /></div>
      <input ref={input} type="file" accept=".csv,.json" className="hidden" aria-label="Importar CSV o JSON para EDA" onChange={e => void importFile(e.target.files?.[0])} />
    </ResearchHeading>
    {error && <p role="alert" className="mb-4 text-sm text-rose-300">{error}</p>}
    <div className="mb-5 flex flex-wrap items-end gap-3"><label className="research-field min-w-64">Dataset<select aria-label="Dataset" className="research-select" value={dataset} onChange={e => { setDataset(e.target.value); setSearch(''); if (e.target.value === 'argentina') { setVariable('privadas_de_libertad'); setXChoice('privadas_de_libertad'); setYChoice('procesadas_en_prisión'); } }}><option value="territory">Detenciones NYPD / agregados trazables</option><option value="argentina">Argentina / SNEEP Ley 23.737 / 24 jurisdicciones</option><option value="countries">67 países / base anterior no auditada</option>{custom.length > 0 && <option value="custom">Archivo local: {fileName}</option>}</select></label><label className="research-field">Distribución de<select aria-label="Distribución de" className="research-select" value={field} onChange={e => setVariable(e.target.value)}>{numericColumns.map(k => <option key={k}>{k}</option>)}</select></label><label className="research-field flex-1">Filtro de texto<input className="research-input" placeholder="Filtrar filas del dataset" value={search} onChange={e => setSearch(e.target.value)} /></label></div>
    <Notice tone={dataset === 'countries' ? 'amber' : 'green'}>{dataset === 'countries' ? 'La base previa de países se conserva para continuidad: sus estimaciones no están validadas registro por registro. El EDA no las convierte en datos oficiales ni demuestra relaciones causales.' : dataset === 'argentina' ? 'SNEEP: cada fila es una provincia o CABA según el establecimiento penitenciario, sin sumar la fila nacional ni los municipios. Ley 23.737, todas las drogas. Procesadas y condenadas son subconjuntos del stock de personas en prisión; las correlaciones entre partes y total no son evidencia causal.' : dataset === 'custom' ? 'Archivo analizado solo en este navegador, sin transmisión ni persistencia. La fuente y la calidad del archivo son responsabilidad de quien lo carga; usar únicamente datos agregados y no identificables.' : 'Datos de detenciones, no personas únicas. Cada fila es un distrito y año; el mismo distrito se repite entre años. Las columnas de procesos y prisión quedan nulas porque la fuente no las informa.'}</Notice>
    <SummaryStrip items={[{ label: 'Filas analizadas', value: fmt(rows.length), note: `${fmt(raw.length)} antes de filtros` }, { label: 'Variables numéricas', value: String(numericColumns.length) }, { label: 'Celdas numéricas faltantes', value: cellCount ? `${fmt(100 * missing / cellCount, 1)} %` : 'N/D', color: '#fbbf24' }, { label: 'Atípicos (IQR) de la variable', value: String(stat.outliers), note: 'No necesariamente son errores' }]} />
    <div className="mb-5 flex flex-wrap gap-5 text-xs text-slate-400"><label className="flex items-center gap-2"><input type="checkbox" className="accent-emerald-400" checked={removeMissing} onChange={e => setRemoveMissing(e.target.checked)} />Excluir filas sin par X/Y</label><label className="flex items-center gap-2"><input type="checkbox" className="accent-emerald-400" checked={omitOutliers} onChange={e => setOmitOutliers(e.target.checked)} />Excluir atípicos de la variable (umbral original)</label></div>
    <div className="grid gap-7 lg:grid-cols-2"><section className="min-w-0 border border-white/10 p-4 sm:p-5"><h3 className="text-sm font-semibold text-white">Distribución · {field || 'sin variable numérica'}</h3><p className="mt-1 text-[11px] text-slate-500">Histograma recalculado con los filtros activos.</p><div className="mt-4 h-64">{bins.length ? <ResponsiveContainer width="100%" height="100%"><BarChart data={bins} margin={{ left: -20, right: 10, bottom: 35 }}><CartesianGrid stroke={gridStroke} vertical={false} /><XAxis dataKey="range" tick={{ ...axisStyle, fontSize: 9 }} angle={-25} textAnchor="end" interval={0} /><YAxis tick={axisStyle} allowDecimals={false} /><Tooltip content={({ active, payload }) => active && payload?.length ? <div className="research-tooltip"><p>{String(payload[0].payload.range)}</p><p>{payload[0].value} observaciones</p></div> : null} /><Bar dataKey="count" fill="#34d399" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer> : <p className="py-20 text-center text-xs text-slate-500">Sin valores numéricos válidos.</p>}</div><p className="mt-2 text-xs text-slate-400">Media {statValue(stat.mean)} · Mediana {statValue(stat.median)} · Desv. muestral {statValue(stat.sd)}</p></section>
      <section className="min-w-0 border border-white/10 p-4 sm:p-5"><h3 className="text-sm font-semibold text-white">Relación exploratoria</h3><div className="mt-3 flex gap-3"><label className="research-field min-w-0 flex-1">Eje X<select aria-label="Eje X" className="research-select" value={x} onChange={e => setXChoice(e.target.value)}>{numericColumns.map(k => <option key={k}>{k}</option>)}</select></label><label className="research-field min-w-0 flex-1">Eje Y<select aria-label="Eje Y" className="research-select" value={y} onChange={e => setYChoice(e.target.value)}>{numericColumns.map(k => <option key={k}>{k}</option>)}</select></label></div><div className="mt-3 h-56">{points.length ? <ResponsiveContainer width="100%" height="100%"><ScatterChart margin={{ left: -12, right: 10, bottom: 5 }}><CartesianGrid stroke={gridStroke} /><XAxis type="number" dataKey="x" name={x} tick={axisStyle} domain={['auto', 'auto']} /><YAxis type="number" dataKey="y" name={y} tick={axisStyle} domain={['auto', 'auto']} /><Tooltip content={({ active, payload }) => active && payload?.length ? <div className="research-tooltip"><p className="max-w-56">{String(payload[0].payload.name)}</p><p>{x}: {payload[0].payload.x}</p><p>{y}: {payload[0].payload.y}</p></div> : null} /><Scatter data={points} fill="#60a5fa" fillOpacity={0.7} /></ScatterChart></ResponsiveContainer> : <p className="py-20 text-center text-xs text-slate-500">No hay pares numéricos completos.</p>}</div><p className="mt-2 text-xs text-slate-400">Pearson r: <strong className="text-sky-300">{corr.r === null ? 'No calculable' : fmt(corr.r, 3)}</strong> · n = {corr.n} pares</p></section></div>
    <section className="mt-7"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h3 className="text-base font-semibold text-white">Perfil estadístico del dataset</h3><ExportButton onClick={() => downloadCsv('eda-resumen-estadistico.csv', stats)}>Exportar resumen</ExportButton></div><div className="overflow-x-auto"><table className="research-table min-w-[800px]"><thead><tr><th>Variable</th><th>n</th><th>Faltantes</th><th>Media</th><th>Mediana</th><th>Mín.</th><th>Q1</th><th>Q3</th><th>Máx.</th><th>Desv.</th><th>Atípicos</th></tr></thead><tbody>{stats.map(s => <tr key={s.column}><td className="text-white">{s.column}</td>{[s.n, s.missing, s.mean, s.median, s.min, s.q1, s.q3, s.max, s.sd, s.outliers].map((v, i) => <td key={i} className="tabular-nums">{statValue(v)}</td>)}</tr>)}</tbody></table></div></section>
    <section className="mt-7"><h3 className="mb-3 text-base font-semibold text-white">Mapa de correlaciones</h3><div className="overflow-x-auto"><table className="research-table min-w-[480px]"><thead><tr><th>r de Pearson</th>{numericColumns.slice(0, 8).map(k => <th key={k}>{k}</th>)}</tr></thead><tbody>{numericColumns.slice(0, 8).map(a => <tr key={a}><td>{a}</td>{numericColumns.slice(0, 8).map(b => { const c = correlation(rows, a, b); return <td key={b} title={`${a} / ${b}: ${c.n} pares válidos`} style={{ background: c.r === null ? 'transparent' : c.r >= 0 ? `rgba(52,211,153,${Math.abs(c.r) * 0.4})` : `rgba(251,113,133,${Math.abs(c.r) * 0.4})` }} className="text-center tabular-nums">{c.r === null ? 'N/D' : fmt(c.r, 2)}</td>; })}</tr>)}</tbody></table></div></section>
    <section className="mt-7"><h3 className="mb-3 text-base font-semibold text-white">Vista previa · primeras 20 filas</h3><div className="max-h-72 overflow-auto"><table className="research-table min-w-[650px]"><thead><tr>{columns.slice(0, 8).map(k => <th key={k}>{k}</th>)}</tr></thead><tbody>{rows.slice(0, 20).map((r, i) => <tr key={i}>{columns.slice(0, 8).map(k => <td key={k}>{r[k] === null || r[k] === undefined ? <span className="text-amber-300/70">N/D</span> : String(r[k])}</td>)}</tr>)}</tbody></table></div></section>
    <Notice tone="slate"><FlaskConical size={14} className="mr-1 inline" />Cuartiles por interpolación lineal, desviación estándar muestral y atípicos fuera de [Q1 − 1,5 IQR; Q3 + 1,5 IQR]. Correlación por pares completos; N/D si faltan pares o la varianza es nula. No se imputan faltantes como cero. No se infiere causalidad.</Notice>
  </div>;
}