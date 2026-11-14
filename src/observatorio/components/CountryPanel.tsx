import { useEffect, useMemo, useState } from 'react';
import {
  COUNTRIES,
  FRAMEWORKS,
  REGION_COLORS,
  arrestsPerKUsers,
  type Country,
} from '../data/countries';
import { Badge, fmt, fmtM } from './ui';
import { CountryRadar, ModesBars } from './charts';
import { CountryMarketCard } from './MarketCharts';
import { CountryEcoCard } from './EcoCharts';

type SortKey = 'name' | 'prevalence' | 'users' | 'arrests' | 'maxPrison' | 'acceptance' | 'lawYear';

export function CountryTable({
  list,
  onSelect,
  selected,
}: {
  list: Country[];
  onSelect: (c: Country) => void;
  selected: string | null;
}) {
  const [sort, setSort] = useState<SortKey>('users');
  const [asc, setAsc] = useState(false);
  const [q, setQ] = useState('');

  const rows = useMemo(() => {
    const f = list.filter(
      (c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.iso.toLowerCase().includes(q.toLowerCase()),
    );
    return [...f].sort((a, b) => {
      const av = a[sort];
      const bv = b[sort];
      if (typeof av === 'string' && typeof bv === 'string') return asc ? av.localeCompare(bv) : bv.localeCompare(av);
      return asc ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
  }, [list, sort, asc, q]);

  const th = (k: SortKey, label: string, right = true) => (
    <th
      onClick={() => {
        if (sort === k) setAsc((v) => !v);
        else {
          setSort(k);
          setAsc(k === 'name');
        }
      }}
      className={
        'cursor-pointer select-none whitespace-nowrap px-2.5 py-2 font-medium transition hover:text-slate-200 ' +
        (right ? 'text-right' : 'text-left') +
        (sort === k ? ' text-white' : '')
      }
    >
      {label}
      <span className="ml-1 text-[9px] text-slate-500">{sort === k ? (asc ? '▲' : '▼') : '↕'}</span>
    </th>
  );

  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar país o código ISO…"
        className="mb-3 w-full max-w-xs rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-emerald-400/50 focus:outline-none"
      />
      <div className="max-h-[30rem] overflow-auto rounded-xl border border-white/[0.07]">
        <table className="w-full min-w-[54rem] text-sm">
          <thead className="sticky top-0 z-10 bg-slate-950/95 text-[10px] uppercase tracking-wider text-slate-500 backdrop-blur">
            <tr>
              {th('name', 'País', false)}
              <th className="px-2.5 py-2 text-left font-medium">Marco</th>
              {th('prevalence', '% adultos')}
              {th('users', 'Usuarios')}
              {th('arrests', 'Detenc./100k')}
              {th('maxPrison', 'Pena máx.')}
              {th('acceptance', 'Aceptación')}
              {th('lawYear', 'Reforma')}
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr
                key={c.iso}
                onClick={() => onSelect(c)}
                className={
                  'cursor-pointer border-t border-white/[0.05] transition hover:bg-white/[0.05] ' +
                  (selected === c.iso ? 'bg-emerald-400/10' : '')
                }
              >
                <td className="px-2.5 py-2">
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: REGION_COLORS[c.region] }}
                    />
                    <span className="text-xs font-medium text-slate-100">{c.name}</span>
                  </span>
                </td>
                <td className="px-2.5 py-2">
                  <Badge color={FRAMEWORKS[c.framework].color}>{FRAMEWORKS[c.framework].short}</Badge>
                </td>
                <td className="px-2.5 py-2 text-right text-xs tabular-nums text-slate-200">{fmt(c.prevalence, 1)} %</td>
                <td className="px-2.5 py-2 text-right text-xs tabular-nums text-white">{fmtM(c.users)}</td>
                <td className="px-2.5 py-2 text-right text-xs tabular-nums text-slate-200">{fmt(c.arrests, 0)}</td>
                <td className="px-2.5 py-2 text-right text-xs tabular-nums text-slate-200">
                  {c.maxPrison === 0 ? '—' : `${c.maxPrison} a.`}
                </td>
                <td className="px-2.5 py-2 text-right text-xs tabular-nums text-slate-200">{c.acceptance}</td>
                <td className="px-2.5 py-2 text-right text-xs tabular-nums text-slate-400">{c.lawYear}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] text-slate-500">{rows.length} países · haz clic en una fila para abrir la ficha.</p>
    </div>
  );
}

export function CountryDrawer({ country, onClose }: { country: Country; onClose: () => void }) {
  const f = FRAMEWORKS[country.framework];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  const global = COUNTRIES.reduce((s, c) => s + c.users, 0);
  const worldPrev = 4.6;
  const stats = [
    { l: 'Consumidores (12 meses)', v: fmtM(country.users), h: `${fmt((country.users / global) * 100, 1)} % del total mundial` },
    { l: 'Prevalencia adulta', v: `${fmt(country.prevalence, 1)} %`, h: `${country.prevalence > worldPrev ? '+' : ''}${fmt(country.prevalence - worldPrev, 1)} pp vs. mundo` },
    { l: 'Detenciones /100k', v: fmt(country.arrests, 0), h: `${fmt(arrestsPerKUsers(country), 1)} por cada 1.000 usuarios` },
    { l: '% delito de drogas', v: `${country.shareDrugOffences} %`, h: 'de todas las causas por drogas' },
    { l: 'Pena por posesión', v: country.maxPrison === 0 ? 'sin prisión' : `${country.maxPrison} años`, h: 'posesión simple, máximo legal' },
    { l: 'Incautaciones', v: country.seizures < 1 ? `${Math.round(country.seizures * 1000)} kg` : `${fmt(country.seizures, 0)} t`, h: 'por año (hierba + resina)' },
    { l: 'Aceptación cultural', v: `${country.acceptance}/100`, h: 'opinión pública favorable' },
    { l: 'Última reforma', v: String(country.lawYear), h: country.lawYear >= 2020 ? 'ciclo regulatorio reciente' : 'marco consolidado' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-white/10 bg-slate-950/95 p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{country.region}</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">{country.name}</h2>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
              style={{ background: `${f.color}1f`, color: f.color }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: f.color }} />
              {f.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-slate-300 transition hover:bg-white/10"
          >
            Cerrar ✕
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Marco vigente</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-200">{country.lawNote}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
            <div className="h-full rounded-full" style={{ width: `${(country.acceptance / 100) * 100}%`, background: f.color }} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {stats.map((s) => (
            <div key={s.l} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">{s.l}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-white">{s.v}</p>
              <p className="mt-0.5 text-[10px] leading-snug text-slate-500">{s.h}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
            <p className="mb-1 text-xs font-semibold text-white">Perfil de riesgo y contexto</p>
            <CountryRadar c={country} />
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
            <p className="mb-2 text-xs font-semibold text-white">Formas de consumo</p>
            <ModesBars modes={country.modes as any} base={country.name} />
          </div>
        </div>

        <div className="mt-4">
          <CountryMarketCard iso={country.iso} />
        </div>

        <div className="mt-4">
          <CountryEcoCard iso={country.iso} />
        </div>

        <p className="mt-4 text-[10px] leading-relaxed text-slate-600">
          Ficha de la base anterior: estimaciones sin auditoría individual completa, no cifras oficiales actualizadas.
          Los umbrales de posesión y las penas varían por jurisdicción y pueden cambiar con cada reforma.
          {' '}<a href="#observatorio/fuentes" onClick={onClose} className="text-emerald-300/80 underline underline-offset-2">Consultar fuentes y cobertura verificable.</a>
        </p>
      </aside>
    </div>
  );
}
