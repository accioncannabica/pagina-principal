import { useRef, useState } from 'react';
import { Check, Database, FileUp, Link2, RefreshCw, Save, ShieldCheck } from 'lucide-react';
import type { OpenDataState } from '../lib/openData';
import { RESEARCH_SOURCES } from '../data/research';
import { NEW_JUSTICE_SOURCES } from '../data/justiceEvidence';
import { download } from '../lib/exports';
import { ExportButton, Notice, ResearchHeading, SourceLink, dateLabel, dateTimeLabel } from './ResearchUI';

export default function SourcesView({ data }: { data: OpenDataState }) {
  const [url, setUrl] = useState(data.customUrl);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const save = () => {
    try { data.configureUrl(url.trim()); setError(''); setMessage('Fuente guardada. Se volverá a consultar; un error no reemplaza la instantánea válida.'); }
    catch (e) { setError(e instanceof Error ? e.message : 'URL no válida.'); }
  };
  const load = async (file?: File) => {
    if (!file) return;
    try {
      if (file.size > 4 * 1024 * 1024) throw new Error('El catálogo debe pesar menos de 4 MB.');
      data.importFeed(JSON.parse(await file.text())); setError(''); setMessage('Catálogo validado e incorporado. En la próxima sincronización vuelve a prevalecer el feed configurado; publicá el archivo allí para conservarlo.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Archivo inválido. No se reemplazó el catálogo.'); }
    if (input.current) input.current.value = '';
  };
  return <div className="research-view">
    <ResearchHeading eyebrow="Transparencia / Procedencia / Actualización" title="Cada dato tiene una historia." description="Fuentes, períodos y alcance de los conectores. Una consulta reciente no convierte un registro histórico en un dato del año actual.">
      <ExportButton onClick={() => download('observatorio-catalogo.json', JSON.stringify(data.feed, null, 2))}>Descargar catálogo JSON</ExportButton>
    </ResearchHeading>
    <div className="mb-7 grid gap-6 border-b border-white/10 pb-6 sm:grid-cols-2 lg:grid-cols-4">{[
      ['Último intento de consulta', data.lastAttempt, 'Puede terminar en error; no es una actualización del contenido.'],
      ['Descarga de la instantánea NYPD', data.snapshot.retrievedAt, `Corte de registros: ${dateLabel(data.snapshot.through)}.`],
      ['Actualización de la fuente NYPD', data.snapshot.sourceUpdatedAt, 'Fecha declarada por el proveedor en sus metadatos.'],
      ['Extracción y agregado SNEEP', data.argentina.retrievedAt, `Censo ${data.argentina.censusYear}; ${data.argentina.rawRows.toLocaleString('es-AR')} registros procesados, no publicados individualmente.`],
    ].map(([label, value, note]) => <div key={label}><p className="text-[10px] uppercase tracking-widest text-slate-500">{label}</p><p className="mt-2 text-base font-medium text-slate-100">{dateTimeLabel(value)}</p><p className="mt-1 text-[11px] leading-relaxed text-slate-500">{note}</p></div>)}</div>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><label className="flex items-center gap-2 text-sm text-slate-300"><input className="accent-emerald-400" type="checkbox" checked={data.autoRefresh} onChange={e => data.setAutoRefresh(e.target.checked)} />Reconsulta automática cada 15 minutos, con la pestaña visible</label><button className="research-button" disabled={data.syncing} onClick={() => void data.refresh(true)}><RefreshCw size={14} className={data.syncing ? 'animate-spin' : ''} />Consultar ahora</button></div>
    {data.errors.map(e => <p key={e} role="alert" className="mb-3 text-xs leading-relaxed text-amber-200">{e}</p>)}
    <div className="overflow-x-auto"><table className="research-table min-w-[800px]"><thead><tr><th>Vista / conjunto</th><th>Modo de actualización</th><th>Estado y límites</th></tr></thead><tbody>
      <tr><td className="text-white">Territorio / EDA: NYC</td><td>API pública + instantánea respaldada</td><td>Datos 2022–{data.snapshot.through.slice(0, 4)}. Solo detenciones municipales; no procesos ni condenas.</td></tr>
      <tr><td className="text-white">Argentina / SNEEP</td><td>CSV oficial agregado por script; respaldo local y reconsulta del JSON</td><td>Censo {data.argentina.censusYear}: {data.argentina.provinceCount} jurisdicciones, {data.argentina.municipalityCount} municipios con cruce parcial, Ley 23.737 sin separar sustancias. Procesados dentro de la población presa, no todos los procesados.</td></tr>
      <tr><td className="text-white">Cannabis / artículo académico</td><td>Fuente publicada, revisión editorial</td><td>Muestra de 42 causas de 2010–2020. No es un censo nacional ni una serie anual de personas.</td></tr>
      <tr><td className="text-white">Investigación publicada / OpenAlex</td><td>API pública + instantánea respaldada</td><td>Tópico T10414 desde 2020, retractados excluidos. Total y grupos exactos; lista limitada a 100 trabajos por citas. Afiliación no equivale a sitio del estudio.</td></tr>
      <tr><td className="text-white">Congresos y salud</td><td>Catálogo versionado + revisión de universidades y sociedades científicas</td><td>Las fechas no se extraen automáticamente de las webs. El mapa refleja solo registros incorporados.</td></tr>
      <tr><td className="text-white">Partes de prensa / otras estadísticas</td><td>Fuente oficial o periodística documentada</td><td>Cada colección conserva su unidad, período y definición. No se mezcla con SNEEP ni con NYPD.</td></tr>
      <tr><td className="text-white">Cultura</td><td>Catálogo JSON versionado + revisión de organizadores</td><td>Fechas de edición y enlaces contrastados. La web de cada organizador no se extrae automáticamente.</td></tr>
      <tr><td className="text-white">Gasto judicial y leyes de drogas</td><td>Estudios y fuentes documentadas + catálogo JSON versionado</td><td>Argentina, Canadá, EE. UU., Australia, Brasil e Inglaterra; un escenario separado para Alemania. Estimaciones históricas, no ejecución actual uniforme. Las webs y PDF no se actualizan automáticamente.</td></tr>
      <tr><td className="text-white">Vistas originales</td><td>Se conserva la base; admite correcciones de país documentadas</td><td>Series, precios, conteos de ONGs y otros indicadores originales no tienen auditoría individual completa. No son datos en vivo.</td></tr>
      <tr><td className="text-white">Diccionario</td><td>Edición del repositorio</td><td>Contenido editorial, sin actualización estadística automática.</td></tr>
    </tbody></table></div>
    <section className="my-8 border-y border-white/10 py-6">
      <h3 className="flex items-center gap-2 text-base font-semibold text-white"><Link2 size={17} className="text-emerald-300" />Conectar un catálogo público</h3>
      <p className="mt-2 max-w-3xl text-xs leading-relaxed text-slate-400">Por defecto se consulta <code className="text-emerald-200">public/data/observatorio.json</code> al abrir cada vista. Podés editar ese archivo en GitHub o usar una URL HTTPS de JSON (por ejemplo, raw.githubusercontent.com) con CORS. Nunca coloques claves privadas en esta configuración.</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row"><label className="flex-1"><span className="sr-only">URL HTTPS del catálogo público</span><input className="research-input" type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="Vacío = catálogo incluido en este sitio" /></label><button className="research-button" onClick={save}><Save size={14} />Guardar fuente</button><button className="research-button" onClick={() => { setUrl(''); data.configureUrl(''); setMessage('Se restauró el catálogo incluido en el sitio.'); setError(''); }}>Restaurar</button></div>
      <div className="mt-3 flex flex-wrap gap-3"><button className="research-button" onClick={() => input.current?.click()}><FileUp size={14} />Importar catálogo validado</button><ExportButton onClick={() => download('plantilla-observatorio.json', JSON.stringify({ schemaVersion: 1, publishedAt: new Date().toISOString(), countryUpdates: [], events: [], costs: [], territory: [] }, null, 2))}>Plantilla JSON</ExportButton></div>
      <input ref={input} type="file" accept=".json,application/json" className="hidden" aria-label="Importar catálogo de fuentes" onChange={e => void load(e.target.files?.[0])} />
      {error && <p role="alert" className="mt-3 text-xs text-rose-300">{error}</p>}{message && <p role="status" className="mt-3 flex items-start gap-1 text-xs text-emerald-300"><Check size={14} className="shrink-0" />{message}</p>}
    </section>
    <section className="mb-7 border-b border-white/10 pb-6"><h3 className="text-base font-semibold text-white">Auditoría reproducible de Argentina</h3><p className="mt-2 text-xs leading-relaxed text-slate-400">Selección: delito 24 en cualquiera de cinco posiciones, una sola vez por registro. {data.argentina.selectedPeople.toLocaleString('es-AR')} personas seleccionadas, {data.argentina.processedInCustody.toLocaleString('es-AR')} procesadas en prisión y {data.argentina.sentencedInCustody.toLocaleString('es-AR')} condenadas. El detalle municipal corresponde a {data.argentina.matchedFacilities} unidades emparejadas; {data.argentina.unmatchedProvincialPeople.toLocaleString('es-AR')} personas de unidades provinciales bonaerenses no vinculadas no se asignan a municipios. También se excluyen las unidades federales del cruce municipal.</p><p className="mt-2 break-all font-mono text-[10px] text-slate-500">SHA-256 del CSV original: {data.argentina.sourceSha256}</p><div className="mt-3 flex flex-wrap gap-3"><SourceLink href={data.argentina.catalogUrl}>Catálogo oficial SNEEP</SourceLink><SourceLink href={data.argentina.registryUrl}>Registro geográfico utilizado</SourceLink><ExportButton onClick={() => download('evidencia-incorporada.json', JSON.stringify({ argentina: data.argentina, costs: data.costs, territory: data.territory }, null, 2))}>Descargar evidencia agregada</ExportButton></div></section>
    <h3 className="mb-4 text-base font-semibold text-white">Registro de fuentes públicas, académicas y privadas</h3>
    <div className="divide-y divide-white/10">{[...NEW_JUSTICE_SOURCES, ...RESEARCH_SOURCES].map(s => <article key={s.url} className="grid gap-2 py-4 sm:grid-cols-[220px_1fr]"><div><p className="text-[10px] uppercase tracking-wider text-emerald-300">{s.domain}</p><div className="mt-1"><SourceLink href={s.url}>{s.name}</SourceLink></div></div><div><p className="text-xs text-slate-300">{s.mode}</p><p className="mt-1 text-xs leading-relaxed text-slate-500">{s.note}</p></div></article>)}</div>
    {data.feed.countryUpdates.length > 0 && <section className="mt-7"><h3 className="mb-3 text-base font-semibold text-white">Correcciones de país activas en el catálogo</h3><div className="overflow-x-auto"><table className="research-table"><thead><tr><th>País</th><th>Período</th><th>Campos corregidos</th><th>Fuente aportada</th></tr></thead><tbody>{data.feed.countryUpdates.map((u, i) => <tr key={`${u.iso}-${i}`}><td>{u.iso}</td><td>{u.period}</td><td>{Object.keys(u.values).join(', ')}</td><td><SourceLink href={u.sourceUrl}>Consultar procedencia</SourceLink></td></tr>)}</tbody></table></div></section>}
    <Notice tone="green"><ShieldCheck size={14} className="mr-1 inline" />La aplicación mantiene la última respuesta válida si falla una fuente. NYPD se consulta agregado; SNEEP se procesa fuera del navegador y solo se publica el agregado, nunca sus microdatos. No se publican identidades, arrest keys ni domicilios. Valores desconocidos se guardan como <code>null</code>.</Notice>
    <Notice tone="slate"><Database size={14} className="mr-1 inline" />Automatización del repositorio: <code>.github/workflows/open-data.yml</code> consulta NYPD y OpenAlex y vuelve a procesar el recurso SNEEP 2024 configurado semanalmente. Requiere habilitar GitHub Actions y permisos de escritura; no equivale a descubrir censos o congresos futuros ni a un despliegue automático. Natural Earth, NYC DCP y GeoRef/IGN aportan geometrías; OpenStreetMap, el mapa base. Los PDF, congresos y artículos de gasto requieren revisión documental.</Notice>
  </div>;
}