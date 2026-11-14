import { useMemo, useState } from 'react';
import { BookOpen, Scale } from 'lucide-react';
import type { Country } from '../data/countries';
import type { JusticeCost } from '../data/research';
import { costKey, costScope, EVIDENCE_TYPE_LABELS } from '../data/justiceEvidence';
import { fmt } from './ui';
import { downloadCsv } from '../lib/exports';
import { dateLabel, ExportButton, Notice, ResearchHeading, SourceLink, SummaryStrip } from './ResearchUI';

export default function JusticeView({ countries, costs }: { countries: Country[]; costs: JusticeCost[] }) {
  const [country, setCountry] = useState('all');
  const [substance, setSubstance] = useState('all');
  const [type, setType] = useState('all');
  const [onlyData, setOnlyData] = useState(false);
  const [detail, setDetail] = useState('arg-reset-users-2018');
  const rows = useMemo(() => countries.filter(c => country === 'all' || c.iso === country).map(c => ({
    c, costs: costs.filter(k => k.iso === c.iso && (substance === 'all' || costScope(k) === substance) && (type === 'all' || (k.evidenceType || 'estimate') === type)).sort((a, b) => b.year - a.year || costKey(a).localeCompare(costKey(b))),
  })).filter(row => !onlyData || row.costs.length), [countries, costs, country, onlyData, substance, type]);
  const references = rows.flatMap(row => row.costs);
  const chosen = references.find(k => costKey(k) === detail) || references.find(k => k.id === 'arg-reset-users-2018') || references[0];
  const nameOf = (iso: string) => countries.find(c => c.iso === iso)?.name || iso;
  const goArgentina = () => { setCountry('ARG'); setSubstance('all-drugs'); setType('all'); setDetail('arg-reset-users-2018'); };
  const exportRows = (): object[] => rows.flatMap<object>(({ c, costs: values }) => values.length ? values.map(v => ({ pais: c.name, ...v, sustancia: costScope(v), tipo_evidencia: v.evidenceType || 'estimate' })) : [{ pais: c.name, iso: c.iso, estado: 'Sin referencia incorporada para este filtro' }]);
  return <div className="research-view">
    <ResearchHeading eyebrow="Justicia / Leyes de drogas / Recursos públicos" title="El costo de la respuesta penal." description="Fuentes públicas, académicas y de organizaciones civiles. Argentina y Ley 23.737, cannabis y otras leyes de drogas: cada cifra conserva año, moneda, territorio y naturaleza de la evidencia.">
      <ExportButton onClick={() => downloadCsv('costos-justicia-drogas-fuentes.csv', exportRows())} />
    </ResearchHeading>
    <SummaryStrip items={[
      { label: 'Referencias visibles', value: String(references.length), note: 'No se suman períodos ni subconjuntos' },
      { label: 'Países con referencia visible', value: String(rows.filter(r => r.costs.length).length), color: '#34d399' },
      { label: 'Sin referencia en este filtro', value: String(rows.filter(r => !r.costs.length).length), color: '#fbbf24' },
      { label: 'Comparación internacional', value: 'No directa', note: 'Distintas monedas, coberturas y métodos' },
    ]} />
    <div className="mb-5 flex flex-wrap items-end gap-3">
      <button className="research-button border-emerald-400/30 text-emerald-200" onClick={goArgentina}>Argentina / Ley 23.737</button>
      <label className="research-field">País<select aria-label="País" className="research-select" value={country} onChange={e => setCountry(e.target.value)}><option value="all">Todos los países</option>{countries.map(c => <option key={c.iso} value={c.iso}>{c.name}</option>)}</select></label>
      <label className="research-field">Ámbito de sustancias<select aria-label="Ámbito de sustancias" className="research-select" value={substance} onChange={e => setSubstance(e.target.value)}><option value="all">Cannabis y leyes de drogas</option><option value="cannabis">Solo referencias de cannabis</option><option value="all-drugs">Todas las drogas / Ley 23.737</option></select></label>
      <label className="research-field">Naturaleza de la cifra<select aria-label="Naturaleza de la cifra" className="research-select" value={type} onChange={e => setType(e.target.value)}><option value="all">Todos los tipos de evidencia</option>{Object.entries(EVIDENCE_TYPE_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
      <label className="flex items-center gap-2 pb-3 text-xs text-slate-400"><input className="accent-emerald-400" type="checkbox" checked={onlyData} onChange={e => setOnlyData(e.target.checked)} />Solo referencias documentadas</label>
    </div>
    <Notice>Una <strong>estimación</strong> no es ejecución presupuestaria auditada, una asignación no es gasto pagado y un <strong>escenario de ahorro</strong> no es un ahorro observado. Las cifras de leyes de drogas no se atribuyen exclusivamente al cannabis. Tampoco se suman referencias solapadas de un mismo año.</Notice>
    {chosen && <section className="my-7 grid gap-8 border-y border-white/10 py-6 lg:grid-cols-[1fr_1.15fr]">
      <div className="min-w-0">
        <label className="research-field mb-4">Referencia para explorar<select aria-label="Referencia para explorar" className="research-select" value={costKey(chosen)} onChange={e => setDetail(e.target.value)}>{references.map(c => <option key={costKey(c)} value={costKey(c)}>{nameOf(c.iso)} · {c.fiscalPeriod || c.year} · {c.territory || 'referencia nacional'}</option>)}</select></label>
        <p className="text-[10px] uppercase tracking-widest text-emerald-300">{EVIDENCE_TYPE_LABELS[chosen.evidenceType || 'estimate']} · {chosen.fiscalPeriod || chosen.year}</p>
        <p className="mt-2 text-4xl font-semibold tracking-tight text-white">{fmt(chosen.totalMillions, chosen.totalMillions < 1 ? 3 : 1)} <span className="text-base font-normal text-slate-400">M {chosen.currency}</span></p>
        {chosen.originalMillions !== undefined && <p className="mt-2 text-xs text-emerald-200/80">La misma estimación también fue publicada como {fmt(chosen.originalMillions)} M {chosen.originalCurrency} nominales de {chosen.year}. No es otra erogación ni una conversión a tipo de cambio actual.</p>}
        <p className="mt-2 text-xs font-medium text-slate-300">{chosen.territory || nameOf(chosen.iso)}</p>
        <p className="mt-3 text-xs leading-relaxed text-slate-400">{chosen.scope}</p>
        {chosen.perCase !== undefined && <p className="mt-3 border-l-2 border-emerald-400/40 pl-3 text-xs text-emerald-200">Referencia unitaria publicada: {fmt(chosen.perCase)} {chosen.currency} por causa de tenencia en {chosen.year}, no por persona ni a precios actuales.</p>}
      </div>
      <div className="min-w-0 space-y-4">
        {[
          { label: 'Policía / rubro policial', value: chosen.policingMillions, color: '#60a5fa' },
          { label: 'Fiscalías / Ministerio Público', value: chosen.prosecutionMillions, color: '#22d3ee' },
          { label: chosen.iso === 'DEU' ? 'Fiscalías y tribunales (agrupados)' : 'Tribunales', value: chosen.courtsMillions, color: '#34d399' },
          { label: 'Sistema penitenciario', value: chosen.correctionsMillions, color: '#a78bfa' },
        ].map(s => <div key={s.label}><div className="mb-1.5 flex justify-between gap-4 text-xs"><span className="text-slate-400">{s.label}</span><span className="font-semibold tabular-nums text-slate-200">{s.value == null ? 'Sin desglose incorporado' : `${fmt(s.value, 1)} M ${chosen.currency}`}</span></div><div className="h-2 bg-white/5"><div className="h-full transition-all duration-700" style={{ background: s.color, width: s.value == null ? '0%' : `${Math.min(100, 100 * s.value / Math.max(Number.EPSILON, chosen.totalMillions))}%` }} /></div></div>)}
        <p className="text-[11px] leading-relaxed text-slate-500">{chosen.method}</p>
        <p className="text-[10px] leading-relaxed text-slate-500">{chosen.sourceName} · Publicación: {chosen.publicationYear || 'ver fuente'} · Revisión: {dateLabel(chosen.verifiedAt)}</p>
        <SourceLink href={chosen.sourceUrl}><BookOpen size={12} />Abrir fuente original</SourceLink>
      </div>
    </section>}
    {(country === 'all' || country === 'ARG') && substance !== 'cannabis' && (type === 'all' || type === 'estimate') && <section className="mb-7 border-b border-white/10 pb-6">
      <h3 className="text-sm font-semibold text-white">Argentina: estimación de conductas vinculadas al uso, 2016–2018</h3>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">Solo la serie de RESET sobre fiscalías federales. No se le agregan los valores del art. 5.a porque ya están incluidos en la estimación más amplia.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">{costs.filter(c => c.id?.startsWith('arg-reset-users-')).sort((a, b) => a.year - b.year).map(c => <button key={c.id} onClick={() => setDetail(costKey(c))} className="group border-l border-white/15 pl-4 text-left"><p className="text-[11px] text-slate-500">{c.year}</p><p className="mt-1 text-xl font-semibold text-slate-100 group-hover:text-emerald-300">{fmt(c.totalMillions, 1)} <span className="text-xs font-normal text-slate-500">M USD del estudio</span></p><div className="mt-2 h-1.5 bg-white/5"><div className="h-full bg-emerald-400/70" style={{ width: `${c.totalMillions / 45 * 100}%` }} /></div></button>)}</div>
    </section>}
    <div className="max-h-[38rem] overflow-auto"><table className="research-table min-w-[1000px]"><thead><tr><th>País / territorio</th><th>Período y precios</th><th>Sustancia / evidencia</th><th>Importe reportado</th><th>Fiscalías / tribunales</th><th>Fuente</th></tr></thead><tbody>
      {rows.flatMap(({ c, costs: values }) => values.length ? values.map(v => <tr key={costKey(v)} className={chosen && costKey(chosen) === costKey(v) ? 'bg-emerald-400/5' : ''}>
        <td><button className="text-left text-slate-100 hover:text-emerald-300" onClick={() => setDetail(costKey(v))}>{c.name}</button><p className="mt-1 max-w-56 text-[10px] text-slate-500">{v.territory || 'Ver delimitación en fuente'}</p></td>
        <td className="max-w-48">{v.fiscalPeriod || v.year}</td><td><p className={costScope(v) === 'cannabis' ? 'text-emerald-300' : 'text-violet-300'}>{costScope(v) === 'cannabis' ? 'Cannabis' : 'Todas las drogas'}</p><p className="mt-1 text-[10px]">{EVIDENCE_TYPE_LABELS[v.evidenceType || 'estimate']}</p></td>
        <td className="whitespace-nowrap tabular-nums text-slate-200">{fmt(v.totalMillions, v.totalMillions < 1 ? 3 : 1)} M {v.currency}</td>
        <td className="text-[10px]">{v.prosecutionMillions != null ? `Fiscalías: ${fmt(v.prosecutionMillions, 1)} M ${v.currency}` : ''}{v.courtsMillions != null ? `${v.prosecutionMillions != null ? ' / ' : ''}${v.iso === 'DEU' ? 'Agrupados' : 'Tribunales'}: ${fmt(v.courtsMillions, 1)} M ${v.currency}` : v.prosecutionMillions == null ? 'Sin desglose incorporado' : ''}</td>
        <td><SourceLink href={v.sourceUrl}>Fuente original</SourceLink></td>
      </tr>) : [<tr key={`${c.iso}-missing`}><td className="text-slate-100">{c.name}</td><td>N/D</td><td>Sin referencia para este filtro</td><td>Sin datos</td><td>Sin datos</td><td>No equivale a gasto cero</td></tr>])}
    </tbody></table></div>
    {!rows.length && <p className="py-10 text-center text-sm text-slate-500">No hay referencias para esta selección.</p>}
    <Notice tone="slate"><Scale size={14} className="mr-1 inline" />No se compara un monto subnacional brasileño con un supuesto total nacional, ni un escenario alemán con gasto ejecutado. Las referencias son históricas y no se actualizan a dinero de hoy sin un método explícito. N/D significa no incorporado, no inexistente.</Notice>
  </div>;
}