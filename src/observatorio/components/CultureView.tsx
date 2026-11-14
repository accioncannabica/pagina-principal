import { useMemo, useState } from 'react';
import { ArrowUpRight, CalendarDays, MapPin, Search } from 'lucide-react';
import type { Country } from '../data/countries';
import type { CulturalEvent } from '../data/research';
import { downloadCsv, download } from '../lib/exports';
import { ExportButton, Notice, ResearchHeading, SourceLink, SummaryStrip, dateLabel } from './ResearchUI';
import EvidenceMap from './EvidenceMap';
import { eventStatus } from '../lib/culture';

const eventColors: Record<CulturalEvent['kind'], string> = { Exposición: '#34d399', Festival: '#a78bfa', Copa: '#fbbf24', Encuentro: '#60a5fa', 'Congreso científico': '#22d3ee', Simposio: '#818cf8', 'Jornada académica': '#f472b6' };
function calendar(event: CulturalEvent) {
  if (!event.start) return;
  const end = new Date(`${event.end || event.start}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() + 1);
  const clean = (v: string) => v.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  download(`${event.id}.ics`, ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Accion Cannabica//Observatorio//ES', 'BEGIN:VEVENT',
    `UID:${event.id}@accioncannabica`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z')}`,
    `DTSTART;VALUE=DATE:${event.start.replace(/-/g, '')}`, `DTEND;VALUE=DATE:${end.toISOString().slice(0, 10).replace(/-/g, '')}`,
    `SUMMARY:${clean(event.name)}`, `LOCATION:${clean(`${event.venue}, ${event.city}`)}`, `URL:${event.url}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n'), 'text/calendar');
}

export default function CultureView({ events, countries }: { events: CulturalEvent[]; countries: Country[] }) {
  const [q, setQ] = useState('');
  const [kind, setKind] = useState('all');
  const [country, setCountry] = useState('all');
  const [period, setPeriod] = useState('all');
  const [focus, setFocus] = useState('all');
  const allowed = new Set(countries.map(c => c.iso));
  const rows = useMemo(() => events.filter(e => allowed.has(e.iso) && (country === 'all' || e.iso === country) && (kind === 'all' || e.kind === kind) && (focus === 'all' || (e.focus || 'Cultura') === focus) && `${e.name} ${e.city} ${e.description}`.toLocaleLowerCase('es').includes(q.toLocaleLowerCase('es')) && (period === 'all' || (period === 'upcoming' ? eventStatus(e) !== 'Edición pasada' : eventStatus(e) === 'Edición pasada'))).sort((a, b) => (a.start || '9999').localeCompare(b.start || '9999')), [events, countries, country, kind, focus, period, q]);
  const nameOf = (iso: string) => countries.find(c => c.iso === iso)?.name || iso;
  return <div className="research-view">
    <ResearchHeading eyebrow="Cultura / Salud / Ciencia / Comunidad" title="La cultura y la ciencia también hacen historia." description="Exposiciones, congresos nacionales e internacionales, encuentros, simposios, festivales y copas. Cada registro enlaza a su universidad, sociedad científica u organizador.">
      <ExportButton onClick={() => downloadCsv('agenda-cultural.csv', rows)} />
    </ResearchHeading>
    <SummaryStrip items={[{ label: 'Actividades visibles', value: String(rows.length), color: '#34d399' }, { label: 'Congresos y simposios', value: String(rows.filter(r => ['Congreso científico', 'Simposio', 'Jornada académica'].includes(r.kind)).length), color: '#22d3ee' }, { label: 'Países representados', value: String(new Set(rows.map(r => r.iso)).size) }, { label: 'Con coordenada pública', value: String(rows.filter(r => Number.isFinite(r.lat) && Number.isFinite(r.lon)).length), note: 'El resto no se inventa' }]} />
    <div className="mb-5 grid grid-cols-2 items-end gap-3 xl:grid-cols-[minmax(230px,1fr)_165px_180px_185px_185px]">
      <label className="relative col-span-2 xl:col-span-1"><span className="sr-only">Buscar actividad cultural</span><Search className="absolute left-3 top-3 text-slate-500" size={15} /><input className="research-input pl-9" value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar una actividad o ciudad" /></label>
      <label className="research-field">País<select aria-label="País" className="research-select" value={country} onChange={e => setCountry(e.target.value)}><option value="all">Todos los países</option>{countries.map(c => <option key={c.iso} value={c.iso}>{c.name}</option>)}</select></label>
      <label className="research-field">Tipo<select aria-label="Tipo" className="research-select" value={kind} onChange={e => setKind(e.target.value)}><option value="all">Todas las actividades</option>{Object.keys(eventColors).map(k => <option key={k}>{k}</option>)}</select></label>
      <label className="research-field">Enfoque<select aria-label="Enfoque" className="research-select" value={focus} onChange={e => setFocus(e.target.value)}><option value="all">Todos los enfoques</option>{['Cultura', 'Salud', 'Investigación', 'Industria y regulación'].map(v => <option key={v}>{v}</option>)}</select></label>
      <label className="research-field col-span-2 xl:col-span-1">Edición<select aria-label="Edición" className="research-select" value={period} onChange={e => setPeriod(e.target.value)}><option value="all">Todas</option><option value="upcoming">Próximas / por confirmar</option><option value="past">Archivo</option></select></label>
    </div>
    <section className="mb-7 border border-white/10 p-4 sm:p-5"><div className="mb-4"><h3 className="text-sm font-semibold text-white">Mapa de encuentros documentados</h3><p className="mt-1 text-[11px] text-slate-500">Gradiente = cantidad de actividades visibles por país. Calor y puntos = sedes con coordenadas publicadas o centroides de la institución. No representa asistencia ni impacto.</p></div><EvidenceMap countries={countries} values={[...new Set(rows.map(r => r.iso))].map(iso => ({ iso, value: rows.filter(r => r.iso === iso).length, note: 'actividades documentadas' }))} points={rows.flatMap(e => Number.isFinite(e.lat) && Number.isFinite(e.lon) ? [{ id: e.id, name: e.name, lat: e.lat as number, lon: e.lon as number, value: 1, note: `${e.city} · ${e.kind}`, color: eventColors[e.kind] }] : [])} label="Mapa de congresos y actividades culturales de cannabis" height={410} /></section>
    <div className="border-t border-white/10">
      {rows.map(event => <article key={event.id} className="group grid gap-4 border-b border-white/10 py-6 sm:grid-cols-[140px_1fr_auto]">
        <div><p className="text-[10px] uppercase tracking-widest" style={{ color: eventColors[event.kind] }}>{event.kind}</p><p className="mt-1 text-[10px] text-slate-500">{event.focus || 'Cultura'} · {event.modality || 'Modalidad no informada'}</p><p className="mt-2 text-sm font-medium text-slate-200">{event.start ? dateLabel(event.start) : 'Fecha por confirmar'}</p><p className="mt-1 text-[11px] text-slate-500">{event.end && event.end !== event.start ? `Hasta ${dateLabel(event.end)}` : eventStatus(event)}</p></div>
        <div><a className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-white hover:text-emerald-300" href={event.url} target="_blank" rel="noopener noreferrer">{event.name}<ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400"><MapPin size={12} />{event.city}, {nameOf(event.iso)}</p>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400">{event.description}</p>
          <p className="mt-2 text-[10px] text-slate-500">{event.venue} · Revisión: {dateLabel(event.verifiedAt)}</p>
        </div>
        <div className="flex flex-wrap items-start gap-3 sm:flex-col sm:items-end"><SourceLink href={event.sourceUrl}>Organizador / fuente</SourceLink>{event.start && <button className="research-button" onClick={() => calendar(event)}><CalendarDays size={13} />Calendario .ics</button>}</div>
      </article>)}
    </div>
    {!rows.length && <p className="py-16 text-center text-sm text-slate-400">No hay actividades documentadas para estos filtros. No significa que no existan.</p>}
    <Notice tone="slate">Las fechas se contrastaron con universidades, sociedades científicas u organizadores. Una reconsulta del catálogo no confirma cambios en sus webs: verificá la edición antes de viajar. El mapa cuenta registros incorporados, no todos los eventos existentes. Un punto repetido puede representar varias ediciones en la misma institución.</Notice>
  </div>;
}