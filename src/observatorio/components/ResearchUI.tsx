import type { ReactNode } from 'react';
import { ArrowUpRight, Database, Download, RefreshCw, ShieldCheck } from 'lucide-react';
import type { OpenDataState } from '../lib/openData';

export function ResearchHeading({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: ReactNode }) {
  return <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
    <div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300">{eyebrow}</p>
      <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">{description}</p></div>{children}
  </header>;
}

export function SummaryStrip({ items }: { items: { label: string; value: string; note?: string; color?: string }[] }) {
  return <dl className="mb-7 grid grid-cols-2 gap-x-6 gap-y-5 border-b border-white/10 pb-6 lg:grid-cols-4">
    {items.map(item => <div key={item.label} className="border-l border-white/15 pl-4">
      <dt className="text-[10px] uppercase tracking-widest text-slate-500">{item.label}</dt>
      <dd className="mt-1 text-2xl font-semibold tabular-nums" style={{ color: item.color || '#f1f5f9' }}>{item.value}</dd>
      {item.note && <p className="mt-1 text-[11px] text-slate-500">{item.note}</p>}
    </div>)}
  </dl>;
}

export function Notice({ children, tone = 'amber' }: { children: ReactNode; tone?: 'amber' | 'green' | 'slate' }) {
  return <div role="note" className={`my-4 border-l-2 px-4 py-2.5 text-xs leading-relaxed ${tone === 'amber' ? 'border-amber-400/60 bg-amber-400/5 text-amber-100/75' : tone === 'green' ? 'border-emerald-400/60 bg-emerald-400/5 text-emerald-100/80' : 'border-slate-500 bg-slate-400/5 text-slate-400'}`}>{children}</div>;
}

export function SourceLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] text-emerald-300 transition hover:text-emerald-100">{children}<ArrowUpRight size={12} /></a>;
}

export function ExportButton({ onClick, children = 'Exportar CSV' }: { onClick: () => void; children?: ReactNode }) {
  return <button onClick={onClick} className="research-button"><Download size={14} />{children}</button>;
}

export function dateLabel(value: string | null | undefined) {
  if (!value || !Number.isFinite(Date.parse(value))) return 'Sin consulta';
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : new Date(value);
  return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }).format(parsed);
}

export function dateTimeLabel(value: string | null | undefined) {
  if (!value || !Number.isFinite(Date.parse(value))) return 'Sin consulta';
  return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }).format(new Date(value));
}

export function FreshnessBar({ data, view, onSources }: { data: OpenDataState; view: string; onSources: () => void }) {
  const territorial = ['territorio', 'eda'].includes(view);
  const titles: Record<string, string> = {
    cultura: 'Agenda cultural documentada · fechas por edición',
    investigacion: 'OpenAlex · tópico T10414 · instantánea y API bibliográfica abierta',
    gasto: 'Gasto judicial · estimaciones publicadas, no presupuesto actual',
    fuentes: 'Fuentes públicas, cobertura y conectores',
    contacto: 'Contacto institucional · Acción Cannábica',
  };
  return <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-[11px]">
    <div className="flex min-w-0 items-center gap-2.5">
      {territorial ? <ShieldCheck size={16} className="shrink-0 text-emerald-300" /> : <Database size={16} className="shrink-0 text-sky-300" />}
      <div><p className="text-slate-200">{territorial ? `Fuentes penales: SNEEP Argentina ${data.argentina.censusYear} · NYPD y colecciones documentadas` : titles[view] || 'Base anterior conservada · trazabilidad en revisión'}
      </p><p className="mt-0.5 text-slate-500">{data.syncing ? 'Consultando fuentes públicas...' : data.errors.length ? 'Alguna fuente no respondió: se conservan los respaldos' : data.feedFetchedAt ? 'Catálogo consultado en esta sesión' : 'Instantánea local'} · {data.autoRefresh ? 'reconsulta cada 15 min' : 'reconsulta periódica pausada'}</p></div>
    </div>
    <div className="flex items-center gap-3">
      <button className="text-slate-400 underline decoration-white/20 underline-offset-4 hover:text-white" onClick={onSources}>Fuentes y cobertura</button>
      <button onClick={() => void data.refresh(true)} disabled={data.syncing} className="research-button disabled:opacity-50"><RefreshCw size={13} className={data.syncing ? 'animate-spin' : ''} />{data.syncing ? 'Consultando' : 'Actualizar vista'}</button>
    </div>
  </div>;
}