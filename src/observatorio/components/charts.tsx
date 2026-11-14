import { useState } from 'react';
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import {
  FRAMEWORKS,
  MODE_META,
  REGION_AGG,
  REGION_COLORS,
  arrestsPerKUsers,
  type Country,
} from '../data/countries';
import { ACCEPTANCE_REGIONS, GENERATIONS, MODES_EVOLUTION, MILESTONES, SERIES } from '../data/trends';
import { ChartTip, axisStyle, fmt, gridStroke } from './ui';

/* ── 1. Ranking de países ──────────────────────────────────────────── */
export function RankingChart({
  list,
  metric,
  metricLabel,
  onSelect,
}: {
  list: Country[];
  metric: 'prevalence' | 'users' | 'arrests' | 'maxPrison' | 'acceptance';
  metricLabel: string;
  onSelect: (c: Country) => void;
}) {
  const [limit, setLimit] = useState(18);
  const data = [...list].sort((a, b) => b[metric] - a[metric]).slice(0, limit);
  return (
    <div>
      <div className="h-[26rem]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 4, right: 42, top: 4, bottom: 4 }}>
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
              content={<ChartTip />}
            />
            <Bar
              dataKey={metric}
              radius={[0, 4, 4, 0]}
              barSize={13}
              onClick={(d: any) => {
                const p = d?.payload ?? d;
                if (p?.iso) onSelect(p as Country);
              }}
            >
              {data.map((c) => (
                <Cell key={c.iso} fill={FRAMEWORKS[c.framework].color} fillOpacity={0.85} cursor="pointer" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
        <span>Top {data.length} · {metricLabel} · color = marco legal</span>
        <div className="flex gap-1">
          {[12, 18, 30].map((n) => (
            <button
              key={n}
              onClick={() => setLimit(n)}
              className={
                'rounded px-2 py-0.5 ' + (limit === n ? 'bg-white/15 text-white' : 'hover:bg-white/5 text-slate-400')
              }
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 2. Dispersión: consumo vs aplicación policial ─────────────────── */
export function EnforcementScatter({
  list,
  onSelect,
}: {
  list: Country[];
  onSelect: (c: Country) => void;
}) {
  const data = list.map((c) => ({
    ...c,
    arrestsLabel: c.arrests,
    perK: arrestsPerKUsers(c),
  }));
  return (
    <div>
      <div className="h-[22rem]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ left: 0, right: 16, top: 12, bottom: 8 }}>
            <CartesianGrid stroke={gridStroke} />
            <XAxis
              type="number"
              dataKey="prevalence"
              name="Prevalencia"
              unit="%"
              domain={[0, 24]}
              tick={axisStyle}
              axisLine={false}
              tickLine={false}
              label={{ value: '% de adultos que consumen', position: 'insideBottom', offset: -4, fill: '#64748b', fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="arrests"
              name="Detenciones /100k"
              tick={axisStyle}
              axisLine={false}
              tickLine={false}
              width={38}
            />
            <ZAxis type="number" dataKey="users" range={[28, 700]} />
            <ReferenceLine x={4.6} stroke="rgba(52,211,153,0.5)" strokeDasharray="4 4" label={{ value: 'media mundial 4,6 %', fill: '#34d399', fontSize: 10, position: 'top' }} />
            <Tooltip
              cursor={{ stroke: 'rgba(255,255,255,0.25)' }}
              content={({ active, payload }: any) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as Country;
                return (
                  <div className="pointer-events-none rounded-xl border border-white/15 bg-slate-950/95 px-3 py-2 shadow-2xl">
                    <p className="text-sm font-semibold text-white">{d.name}</p>
                    <p className="text-[11px]" style={{ color: FRAMEWORKS[d.framework].color }}>
                      {FRAMEWORKS[d.framework].label}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-300">
                      {d.prevalence}% de adultos · {d.arrests} detenciones/100k
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {fmt(arrestsPerKUsers(d), 1)} detenciones por 1.000 usuarios
                    </p>
                    <p className="text-[11px] text-slate-400">Pena máx.: {d.maxPrison === 0 ? 'sin prisión' : `${d.maxPrison} años`}</p>
                  </div>
                );
              }}
            />
            <Scatter
              data={data}
              cursor="pointer"
              onClick={(d: any) => {
                const p = d?.payload ?? d;
                if (p?.iso) onSelect(p as Country);
              }}
            >
              {data.map((c) => (
                <Cell key={c.iso} fill={FRAMEWORKS[c.framework].color} fillOpacity={0.7} stroke="rgba(255,255,255,0.5)" strokeWidth={0.6} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {Object.values(FRAMEWORKS).map((f) => (
          <span key={f.label} className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: f.color }} />
            {f.label}
          </span>
        ))}
        <span className="ml-auto text-[11px] text-slate-500">tamaño = millones de consumidores</span>
      </div>
    </div>
  );
}

/* ── 3. Comparativa de marcos: consumo, policía y pena ─────────────── */
export function FrameworkMatrix({ list }: { list: Country[] }) {
  const rows = (Object.keys(FRAMEWORKS) as (keyof typeof FRAMEWORKS)[]).map((k) => {
    const l = list.filter((c) => c.framework === k);
    if (!l.length) return null;
    const users = l.reduce((s, c) => s + c.users, 0);
    const pop = l.reduce((s, c) => s + c.pop, 0);
    const w = (fn: (c: Country) => number) =>
      l.reduce((s, c) => s + fn(c) * c.users, 0) / (users || 1);
    return {
      key: k,
      label: FRAMEWORKS[k].label,
      color: FRAMEWORKS[k].color,
      countries: l.length,
      users,
      prevalence: pop ? (users / pop) * 100 : 0,
      arrests: w((c) => c.arrests),
      perK: w((c) => arrestsPerKUsers(c)),
      prison: w((c) => c.maxPrison),
      acceptance: w((c) => c.acceptance),
      smoke: w((c) => c.modes.smoke),
      edible: w((c) => c.modes.vape + c.modes.edible + c.modes.oil + c.modes.tea),
    };
  }).filter(Boolean) as any[];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[52rem] border-separate border-spacing-y-1.5 text-sm">
        <thead>
          <tr className="text-[10px] uppercase tracking-wider text-slate-500">
            <th className="px-2 text-left font-medium">Marco normativo</th>
            <th className="px-2 text-right font-medium">Países</th>
            <th className="px-2 text-right font-medium">Usuarios</th>
            <th className="px-2 text-right font-medium">Prevalencia</th>
            <th className="px-2 text-right font-medium">Detenciones /100k</th>
            <th className="px-2 text-right font-medium">Por 1.000 usuarios</th>
            <th className="px-2 text-right font-medium">Pena media</th>
            <th className="px-2 text-right font-medium">Aceptación</th>
            <th className="w-40 px-2 text-left font-medium">Fumado / oral-vapor</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="rounded-lg bg-white/[0.03] transition hover:bg-white/[0.06]">
              <td className="rounded-l-lg px-2 py-2.5">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: r.color }} />
                  <span className="text-xs font-medium text-slate-100">{r.label}</span>
                </span>
              </td>
              <td className="px-2 text-right text-xs tabular-nums text-slate-300">{r.countries}</td>
              <td className="px-2 text-right text-xs tabular-nums text-white">{fmt(r.users, 1)} M</td>
              <td className="px-2 text-right text-xs tabular-nums text-slate-200">{fmt(r.prevalence, 1)} %</td>
              <td className="px-2 text-right text-xs tabular-nums text-slate-200">{fmt(r.arrests, 0)}</td>
              <td className="px-2 text-right text-xs tabular-nums text-slate-200">{fmt(r.perK, 1)}</td>
              <td className="px-2 text-right text-xs tabular-nums text-slate-200">
                {r.prison === 0 ? 'sin prisión' : `${fmt(r.prison, 1)} años`}
              </td>
              <td className="px-2 text-right text-xs tabular-nums text-slate-200">{fmt(r.acceptance, 0)}/100</td>
              <td className="rounded-r-lg px-2 py-2.5">
                <div className="flex h-2.5 w-36 overflow-hidden rounded-full bg-white/[0.06]">
                  <span style={{ width: `${Math.min(100, r.smoke / 2)}%`, background: '#34d399' }} />
                  <span style={{ width: `${Math.min(100, r.edible / 2)}%`, background: '#a78bfa' }} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-[11px] text-slate-500">
        Media ponderada por número de consumidores. La columna final compara la vía fumada (verde) frente a las vías
        vaporizada, comestible, en aceite y oral (violeta), suma superior al 100 % por respuesta múltiple.
      </p>
    </div>
  );
}

/* ── 4. Formas de uso ─────────────────────────────────────────────── */
export function ModesBars({ modes, base }: { modes: Record<string, number>; base: string }) {
  const max = Math.max(1, ...MODE_META.map((m) => modes[m.key] ?? 0));
  return (
    <div className="space-y-2.5">
      {MODE_META.map((m) => (
        <div key={m.key} className="flex items-center gap-3">
          <span className="w-36 shrink-0 truncate text-[11px] text-slate-300 sm:w-44">{m.label}</span>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${((modes[m.key] ?? 0) / max) * 100}%`, background: m.color }}
            />
          </div>
          <span className="w-12 shrink-0 text-right text-[11px] font-semibold tabular-nums text-white">
            {fmt(modes[m.key] ?? 0, 1)} %
          </span>
        </div>
      ))}
      <p className="pt-1 text-[11px] text-slate-500">
        Porcentaje de consumidores de {base} que emplearon cada forma en los últimos 12 meses (respuesta múltiple).
      </p>
    </div>
  );
}

export function RegionalModesStacked() {
  const data = REGION_AGG.map((r) => ({
    region: r.region.replace(' y Oriente Medio', '·OM').replace(' occidental', '·O').replace(' oriental', '·R'),
    Fumado: r.modes.smoke,
    Vaporizado: r.modes.vape,
    Comestibles: r.modes.edible,
    'Aceites/CBD': r.modes.oil,
    'Hachís/concentrados': r.modes.hash,
    'Té/oral': r.modes.tea,
  }));
  return (
    <div className="h-[19rem]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -18, right: 8, top: 8, bottom: 4 }}>
          <CartesianGrid stroke={gridStroke} vertical={false} />
          <XAxis dataKey="region" tick={{ ...axisStyle, fontSize: 10 }} axisLine={false} tickLine={false} interval={0} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<ChartTip suffix=" %" />} />
          {MODE_META.map((m, index) => (
            <Bar key={m.key} dataKey={['Fumado', 'Vaporizado', 'Comestibles', 'Aceites/CBD', 'Hachís/concentrados', 'Té/oral'][index]} name={m.label} stackId="a" fill={m.color} fillOpacity={0.85} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ModesEvolution() {
  return (
    <div className="h-[19rem]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={MODES_EVOLUTION} margin={{ left: -20, right: 12, top: 8, bottom: 4 }}>
          <CartesianGrid stroke={gridStroke} vertical={false} />
          <XAxis dataKey="year" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} unit="%" />
          <Tooltip content={<ChartTip suffix=" %" />} />
          <Line type="monotone" dataKey="Fumado" stroke="#34d399" strokeWidth={2.5} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="Vaporizado" stroke="#22d3ee" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="Comestibles" stroke="#a78bfa" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="Aceites/CBD" stroke="#f472b6" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="Hachís/concentrados" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GenerationsChart() {
  return (
    <div className="h-[17rem]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={GENERATIONS} margin={{ left: -22, right: 8, top: 8, bottom: 4 }}>
          <CartesianGrid stroke={gridStroke} vertical={false} />
          <XAxis dataKey="gen" tick={{ ...axisStyle, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} unit="%" />
          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<ChartTip suffix=" %" />} />
          <Bar dataKey="y2010" name="2010" fill="#475569" radius={[3, 3, 0, 0]} />
          <Bar dataKey="y2024" name="2024" fill="#34d399" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── 5. Evolución global ──────────────────────────────────────────── */
type EvolMetric = 'users' | 'arrests' | 'medCountries' | 'legalCountries' | 'legalMarket' | 'seizures';

const EVOL: { key: EvolMetric; label: string; color: string; unit: string; axis: 'left' | 'right' }[] = [
  { key: 'users', label: 'Consumidores (M)', color: '#34d399', unit: ' M', axis: 'left' },
  { key: 'arrests', label: 'Detenciones (M)', color: '#fb7185', unit: ' M', axis: 'right' },
  { key: 'medCountries', label: 'Países con acceso medicinal', color: '#60a5fa', unit: '', axis: 'right' },
  { key: 'legalCountries', label: 'Jurisdicciones con uso adulto', color: '#a3e635', unit: '', axis: 'right' },
  { key: 'seizures', label: 'Incautaciones (miles t)', color: '#fbbf24', unit: '', axis: 'right' },
  { key: 'legalMarket', label: 'Mercado regulado (miles M USD)', color: '#22d3ee', unit: '', axis: 'right' },
];

export function EvolutionChart({ onSelectYear }: { onSelectYear: (y: number) => void }) {
  const [sel, setSel] = useState<EvolMetric[]>(['users', 'arrests']);
  const toggle = (k: EvolMetric) =>
    setSel((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  const active = EVOL.filter((e) => sel.includes(e.key));
  const useLeft = active.some((e) => e.axis === 'left');
  const useRight = active.some((e) => e.axis === 'right');

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {EVOL.map((e) => (
          <button
            key={e.key}
            onClick={() => toggle(e.key)}
            className={
              'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition ' +
              (sel.includes(e.key)
                ? 'bg-white/15 text-white'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200')
            }
          >
            <span className="h-2 w-2 rounded-full" style={{ background: e.color, opacity: sel.includes(e.key) ? 1 : 0.4 }} />
            {e.label}
          </button>
        ))}
      </div>
      <div className="h-[21rem]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={SERIES}
            margin={{ left: -14, right: useRight ? -8 : 4, top: 10, bottom: 4 }}
            onClick={(e: any) => e?.activeLabel && onSelectYear(Number(e.activeLabel))}
          >
            <defs>
              {EVOL.map((e) => (
                <linearGradient key={e.key} id={`g-${e.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={e.color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={e.color} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid stroke={gridStroke} vertical={false} />
            <XAxis dataKey="year" tick={axisStyle} axisLine={false} tickLine={false} />
            {useLeft && <YAxis yAxisId="l" tick={axisStyle} axisLine={false} tickLine={false} />}
            {useRight && <YAxis yAxisId="r" orientation="right" tick={axisStyle} axisLine={false} tickLine={false} width={40} />}
            <Tooltip content={<ChartTip />} />
            {active.map((e) => (
              <Area
                key={e.key}
                yAxisId={e.axis === 'left' && useLeft ? 'l' : useRight ? 'r' : undefined}
                type="monotone"
                dataKey={e.key}
                name={e.label}
                stroke={e.color}
                strokeWidth={2.4}
                fill={`url(#g-${e.key})`}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
            {useLeft &&
              MILESTONES.filter((m) => [2012, 2018, 2021, 2024].includes(m.year)).map((m) => (
              <ReferenceDot
                key={m.title}
                x={m.year}
                y={SERIES.find((s) => s.year === m.year)?.users ?? 200}
                yAxisId="l"
                r={4}
                fill="#0f172a"
                stroke="#34d399"
                strokeWidth={1.5}
                  ifOverflow="extendDomain"
                />
              ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-1 text-[11px] text-slate-500">
        Puntos marcados: Colorado/Washington (2012), legalización en Canadá (2018), Malta (2021) y Ley CanG alemana
        (2024). Haz clic en un año para fijar el corte del tablero.
      </p>
    </div>
  );
}

/* ── 6. Aceptación cultural por región ────────────────────────────── */
export function AcceptanceChart() {
  return (
    <div className="h-[20rem]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={ACCEPTANCE_REGIONS} margin={{ left: -20, right: 14, top: 8, bottom: 4 }}>
          <CartesianGrid stroke={gridStroke} vertical={false} />
          <XAxis dataKey="year" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} unit=" %" />
          <Tooltip content={<ChartTip suffix=" %" />} />
          {Object.keys(ACCEPTANCE_REGIONS[0])
            .filter((k) => k !== 'year')
            .map((k) => (
              <Line
                key={k}
                type="monotone"
                dataKey={k}
                stroke={REGION_COLORS[k as keyof typeof REGION_COLORS]}
                strokeWidth={2.2}
                dot={{ r: 2.5 }}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── 7. Radar de perfil de país ───────────────────────────────────── */
export function CountryRadar({ c }: { c: Country }) {
  const data = [
    { k: 'Prevalencia', v: (c.prevalence / 24.6) * 100 },
    { k: 'Vapor/comestible', v: Math.min(100, (c.modes.vape + c.modes.edible) / 1.2) },
    { k: 'Aceptación', v: c.acceptance },
    { k: 'Aire legal', v: c.maxPrison === 0 ? 100 : Math.max(0, 100 - c.maxPrison * 18) },
    { k: 'Presión policial', v: Math.min(100, (c.arrests / 220) * 100) },
    { k: 'Mercado informal', v: Math.min(100, (c.seizures / 2200) * 100 + 12) },
  ];
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="rgba(255,255,255,0.12)" />
          <PolarAngleAxis dataKey="k" tick={{ fontSize: 10, fill: '#94a3b8' }} />
          <Radar dataKey="v" stroke={FRAMEWORKS[c.framework].color} fill={FRAMEWORKS[c.framework].color} fillOpacity={0.28} strokeWidth={2} />
          <Tooltip content={<ChartTip suffix=" /100" />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
