import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import type { Country } from '../data/countries';
import { FRAMEWORKS, REGIONS, REGION_COLORS } from '../data/countries';
import {
  ECO_BY_ISO,
  GLOSSARY,
  GLOSSARY_CATS,
  type EcoRow,
  type GlossaryCat,
} from '../data/ecosystem';
import { axisStyle, fmt, gridStroke } from './ui';

export interface EcoJoined extends Country {
  e: EcoRow;
}

export function joinEco(list: Country[]): EcoJoined[] {
  return list
    .map((c) => ({ ...c, e: ECO_BY_ISO[c.iso] }))
    .filter((c): c is EcoJoined => Boolean(c.e));
}

/* ── 1. Ranking de ONGs y universidades ───────────────────────────── */
export function EcoRanking({
  list,
  onSelect,
}: {
  list: EcoJoined[];
  onSelect: (c: Country) => void;
}) {
  const [key, setKey] = useState<'ngos' | 'universities' | 'programs' | 'patientOrgs'>('ngos');
  const meta = {
    ngos: { label: 'ONGs y asociaciones civiles', color: '#a3e635' },
    patientOrgs: { label: 'Organizaciones de pacientes', color: '#f472b6' },
    universities: { label: 'Universidades con formación', color: '#60a5fa' },
    programs: { label: 'Programas y diplomaturas', color: '#22d3ee' },
  }[key];

  const data = useMemo(
    () =>
      [...list]
        .sort((a, b) => b.e[key] - a.e[key])
        .slice(0, 18)
        .map((c) => ({ iso2: c.iso2, name: c.name, valor: c.e[key], country: c })),
    [list, key],
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {(
          [
            ['ngos', 'ONGs'],
            ['patientOrgs', 'Org. de pacientes'],
            ['universities', 'Universidades'],
            ['programs', 'Programas'],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setKey(k)}
            className={
              'rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition ' +
              (key === k ? 'bg-white/15 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200')
            }
          >
            {l}
          </button>
        ))}
      </div>
      <div className="h-[24rem]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 4, right: 34, top: 4, bottom: 4 }}>
            <CartesianGrid stroke={gridStroke} horizontal={false} />
            <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="iso2"
              tick={{ ...axisStyle, fontSize: 11 }}
              width={38}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              content={({ active, payload }: any) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                const e = d.country.e as EcoRow;
                return (
                  <div className="max-w-xs rounded-xl border border-white/15 bg-slate-950/95 px-3 py-2 shadow-2xl">
                    <p className="text-sm font-semibold text-white">{d.name}</p>
                    <p className="mt-1 text-[11px]" style={{ color: meta.color }}>
                      {meta.label}: {fmt(d.valor, 0)}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {e.ngos} ONGs · {e.universities} universidades · {e.programs} programas
                    </p>
                    <p className="mt-1 text-[11px] leading-snug text-slate-500">{e.highlight}</p>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="valor"
              name={meta.label}
              radius={[0, 4, 4, 0]}
              barSize={13}
              cursor="pointer"
              onClick={(d: any) => (d?.payload ?? d)?.country && onSelect((d.payload ?? d).country)}
            >
              {data.map((d) => (
                <Cell key={d.iso2} fill={FRAMEWORKS[d.country.framework].color} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-1 text-[11px] text-slate-500">
        Top 18 · {meta.label} · color según el marco legal del país.
      </p>
    </div>
  );
}

/* ── 2. Dispersión: tejido civil vs. académico ────────────────────── */
export function EcoScatter({ list, onSelect }: { list: EcoJoined[]; onSelect: (c: Country) => void }) {
  const data = list.map((c) => ({
    ...c,
    ngos: c.e.ngos,
    universities: c.e.universities,
    papers: c.e.papers,
  }));
  return (
    <div>
      <div className="h-[22rem]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ left: 0, right: 16, top: 12, bottom: 10 }}>
            <CartesianGrid stroke={gridStroke} />
            <XAxis
              type="number"
              dataKey="ngos"
              name="ONGs"
              scale="sqrt"
              domain={[0, 440]}
              tick={axisStyle}
              axisLine={false}
              tickLine={false}
              label={{ value: 'ONGs y asociaciones civiles', position: 'insideBottom', offset: -6, fill: '#64748b', fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="universities"
              name="Universidades"
              tick={axisStyle}
              axisLine={false}
              tickLine={false}
              width={38}
            />
            <ZAxis type="number" dataKey="papers" range={[25, 650]} />
            <Tooltip
              cursor={{ stroke: 'rgba(255,255,255,0.25)' }}
              content={({ active, payload }: any) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as EcoJoined;
                return (
                  <div className="max-w-xs rounded-xl border border-white/15 bg-slate-950/95 px-3 py-2 shadow-2xl">
                    <p className="text-sm font-semibold text-white">{d.name}</p>
                    <p className="text-[11px]" style={{ color: REGION_COLORS[d.region] }}>{d.region}</p>
                    <p className="mt-1 text-[11px] text-slate-300">
                      {d.e.ngos} ONGs ({d.e.patientOrgs} de pacientes) · {d.e.universities} universidades
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {fmt(d.e.papers, 0)} publicaciones · desde {d.e.since}
                    </p>
                    <p className="mt-1 text-[11px] leading-snug text-slate-500">{d.e.highlight}</p>
                  </div>
                );
              }}
            />
            <Scatter data={data} cursor="pointer" onClick={(d: any) => (d?.payload ?? d)?.iso && onSelect(d.payload ?? d)}>
              {data.map((c) => (
                <Cell
                  key={c.iso}
                  fill={REGION_COLORS[c.region]}
                  fillOpacity={0.7}
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth={0.6}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {REGIONS.map((r) => (
          <span key={r} className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: REGION_COLORS[r] }} />
            {r}
          </span>
        ))}
        <span className="ml-auto text-[11px] text-slate-500">tamaño = publicaciones científicas</span>
      </div>
    </div>
  );
}

/* ── 3. Agregado por región ───────────────────────────────────────── */
export function EcoByRegion({ list }: { list: EcoJoined[] }) {
  const data = REGIONS.map((r) => {
    const l = list.filter((c) => c.region === r);
    return {
      region: r.replace(' y Oriente Medio', '·OM').replace(' occidental', '·O').replace(' oriental', '·Or'),
      full: r,
      ONGs: l.reduce((s, c) => s + c.e.ngos, 0),
      Universidades: l.reduce((s, c) => s + c.e.universities, 0),
      Programas: l.reduce((s, c) => s + c.e.programs, 0),
    };
  }).filter((d) => d.ONGs + d.Universidades > 0);

  return (
    <div className="h-[19rem]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -18, right: 8, top: 8, bottom: 4 }}>
          <CartesianGrid stroke={gridStroke} vertical={false} />
          <XAxis dataKey="region" tick={{ ...axisStyle, fontSize: 10 }} axisLine={false} tickLine={false} interval={0} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            content={({ active, payload }: any) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="rounded-xl border border-white/15 bg-slate-950/95 px-3 py-2 shadow-2xl">
                  <p className="text-sm font-semibold text-white">{d.full}</p>
                  <p className="mt-1 text-[11px] text-lime-300">{d.ONGs} ONGs y asociaciones</p>
                  <p className="text-[11px] text-sky-300">{d.Universidades} universidades</p>
                  <p className="text-[11px] text-cyan-300">{d.Programas} programas de formación</p>
                </div>
              );
            }}
          />
          <Bar dataKey="ONGs" fill="#a3e635" radius={[3, 3, 0, 0]} />
          <Bar dataKey="Universidades" fill="#60a5fa" radius={[3, 3, 0, 0]} />
          <Bar dataKey="Programas" fill="#22d3ee" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── 4. Tabla del ecosistema ──────────────────────────────────────── */
export function EcoTable({ list, onSelect }: { list: EcoJoined[]; onSelect: (c: Country) => void }) {
  const [sort, setSort] = useState<'ngos' | 'universities' | 'programs' | 'papers' | 'since'>('ngos');
  const rows = useMemo(() => [...list].sort((a, b) => (sort === 'since' ? a.e.since - b.e.since : b.e[sort] - a.e[sort])), [list, sort]);

  const th = (k: typeof sort, label: string) => (
    <th
      onClick={() => setSort(k)}
      className={
        'cursor-pointer select-none whitespace-nowrap px-2.5 py-2 text-right font-medium transition hover:text-slate-200 ' +
        (sort === k ? 'text-white' : '')
      }
    >
      {label} <span className="text-[9px] text-slate-500">{sort === k ? '▼' : '↕'}</span>
    </th>
  );

  return (
    <div>
      <div className="max-h-[28rem] overflow-auto rounded-xl border border-white/[0.07]">
        <table className="w-full min-w-[56rem] text-sm">
          <thead className="sticky top-0 z-10 bg-slate-950/95 text-[10px] uppercase tracking-wider text-slate-500 backdrop-blur">
            <tr>
              <th className="px-2.5 py-2 text-left font-medium">País</th>
              {th('ngos', 'ONGs')}
              <th className="px-2.5 py-2 text-right font-medium">De pacientes</th>
              {th('universities', 'Universidades')}
              {th('programs', 'Programas')}
              {th('papers', 'Publicaciones')}
              {th('since', 'Desde')}
              <th className="px-2.5 py-2 text-left font-medium">Referencia</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr
                key={c.iso}
                onClick={() => onSelect(c)}
                className="cursor-pointer border-t border-white/[0.05] transition hover:bg-white/[0.05]"
              >
                <td className="px-2.5 py-2">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: REGION_COLORS[c.region] }} />
                    <span className="text-xs font-medium text-slate-100">{c.name}</span>
                  </span>
                </td>
                <td className="px-2.5 py-2 text-right text-xs tabular-nums text-white">{c.e.ngos}</td>
                <td className="px-2.5 py-2 text-right text-xs tabular-nums text-slate-300">{c.e.patientOrgs}</td>
                <td className="px-2.5 py-2 text-right text-xs tabular-nums text-sky-300">{c.e.universities}</td>
                <td className="px-2.5 py-2 text-right text-xs tabular-nums text-cyan-300">{c.e.programs}</td>
                <td className="px-2.5 py-2 text-right text-xs tabular-nums text-slate-300">{fmt(c.e.papers, 0)}</td>
                <td className="px-2.5 py-2 text-right text-xs tabular-nums text-slate-400">{c.e.since}</td>
                <td className="max-w-lg px-2.5 py-2 text-[11px] leading-snug text-slate-400">{c.e.highlight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] text-slate-500">
        {rows.length} países · haz clic en una fila para abrir la ficha completa del país.
      </p>
    </div>
  );
}

/* ── 5. Diccionario de términos ───────────────────────────────────── */
export function Glossary() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<GlossaryCat | 'todas'>('todas');
  const [open, setOpen] = useState<string | null>(null);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return GLOSSARY.filter(
      (t) =>
        (cat === 'todas' || t.cat === cat) &&
        (!needle ||
          t.term.toLowerCase().includes(needle) ||
          t.def.toLowerCase().includes(needle) ||
          (t.also ?? '').toLowerCase().includes(needle)),
    ).sort((a, b) => a.term.localeCompare(b.term, 'es'));
  }, [q, cat]);

  const colorOf = (c: GlossaryCat) => GLOSSARY_CATS.find((g) => g.key === c)?.color ?? '#94a3b8';

  return (
    <div>
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar término, sinónimo o definición…"
          className="w-full max-w-sm rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-emerald-400/50 focus:outline-none"
        />
        <p className="text-[11px] text-slate-500">
          {rows.length} de {GLOSSARY.length} términos
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        <button
          onClick={() => setCat('todas')}
          className={
            'rounded-full border px-3 py-1.5 text-[11px] font-medium transition ' +
            (cat === 'todas'
              ? 'border-white/25 bg-white/15 text-white'
              : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200')
          }
        >
          Todas
        </button>
        {GLOSSARY_CATS.map((g) => (
          <button
            key={g.key}
            onClick={() => setCat(g.key)}
            className={
              'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition ' +
              (cat === g.key
                ? 'border-white/25 bg-white/15 text-white'
                : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200')
            }
          >
            <span className="h-2 w-2 rounded-full" style={{ background: g.color, opacity: cat === g.key ? 1 : 0.5 }} />
            {g.key}
            <span className="rounded-full bg-black/30 px-1.5 py-0.5 text-[10px] tabular-nums text-slate-300">
              {GLOSSARY.filter((t) => t.cat === g.key).length}
            </span>
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center text-xs text-slate-400">
          No se encontraron términos para «{q}».
        </p>
      ) : (
        <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((t) => {
            const c = colorOf(t.cat);
            const isOpen = open === t.term;
            return (
              <button
                key={t.term}
                onClick={() => setOpen(isOpen ? null : t.term)}
                className={
                  'rounded-xl border p-3.5 text-left transition ' +
                  (isOpen
                    ? 'border-white/25 bg-white/[0.07]'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]')
                }
              >
                <p className="flex items-start gap-2 text-xs font-semibold text-white">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: c }} />
                  {t.term}
                </p>
                <p
                  className={
                    'mt-1.5 pl-4 text-[11px] leading-relaxed text-slate-400 ' + (isOpen ? '' : 'line-clamp-3')
                  }
                >
                  {t.def}
                </p>
                {t.also && (
                  <p className="mt-1.5 pl-4 text-[10px] italic text-slate-500">También: {t.also}</p>
                )}
                <p className="mt-2 pl-4 text-[10px] uppercase tracking-wide" style={{ color: c }}>
                  {t.cat}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── 6. Ficha de ecosistema para el panel de país ─────────────────── */
export function CountryEcoCard({ iso }: { iso: string }) {
  const e = ECO_BY_ISO[iso];
  if (!e) return null;
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
      <p className="mb-2 text-xs font-semibold text-white">Tejido civil y académico</p>
      <div className="grid grid-cols-3 gap-2">
        {[
          ['ONGs', e.ngos, '#a3e635'],
          ['De pacientes', e.patientOrgs, '#f472b6'],
          ['Universidades', e.universities, '#60a5fa'],
          ['Programas', e.programs, '#22d3ee'],
          ['Publicaciones', e.papers, '#94a3b8'],
          ['Desde', e.since, '#fbbf24'],
        ].map(([l, v, c]) => (
          <div key={l as string} className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-2 py-2">
            <p className="text-[9px] uppercase tracking-wide text-slate-500">{l}</p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums" style={{ color: c as string }}>
              {typeof v === 'number' && (l === 'Publicaciones' ? fmt(v, 0) : v)}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{e.highlight}</p>
    </div>
  );
}

export type { GlossaryCat };
