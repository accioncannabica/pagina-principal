import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Area,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import type { Country } from '../data/countries';
import { FRAMEWORKS } from '../data/countries';
import {
  CBD_META,
  HEMP_META,
  HEMP_SERIES,
  MARKET_BY_ISO,
  MODEL_META,
  PRICE_META,
  type HempStatus,
  type MarketModel,
  type MarketRow,
  type PriceKey,
} from '../data/market';
import { Badge, ChartTip, axisStyle, fmt, gridStroke } from './ui';

export interface Joined extends Country {
  m: MarketRow;
}

export function join(list: Country[]): Joined[] {
  return list
    .map((c) => ({ ...c, m: MARKET_BY_ISO[c.iso] }))
    .filter((c): c is Joined => Boolean(c.m));
}

/* ── 1. Precio de la flor: canal legal vs. mercado ilícito ─────────── */
export function PriceGapChart({ list, onSelect }: { list: Joined[]; onSelect: (c: Country) => void }) {
  const [mode, setMode] = useState<'caros' | 'baratos' | 'brecha'>('caros');
  const data = useMemo(() => {
    const base = list.filter((c) => c.m.thcIllicit > 0);
    const sorted =
      mode === 'caros'
        ? [...base].sort((a, b) => b.m.thcIllicit - a.m.thcIllicit)
        : mode === 'baratos'
          ? [...base].sort((a, b) => a.m.thcIllicit - b.m.thcIllicit)
          : [...base]
              .filter((c) => c.m.thcLegal > 0)
              .sort(
                (a, b) =>
                  Math.abs(b.m.thcIllicit - b.m.thcLegal) - Math.abs(a.m.thcIllicit - a.m.thcLegal),
              );
    return sorted.slice(0, 16).map((c) => ({
      iso2: c.iso2,
      name: c.name,
      iso: c.iso,
      country: c,
      legal: c.m.thcLegal,
      ilicito: c.m.thcIllicit,
    }));
  }, [list, mode]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {([
          ['caros', 'Más caros'],
          ['baratos', 'Más baratos'],
          ['brecha', 'Mayor brecha legal/ilícito'],
        ] as const).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setMode(k)}
            className={
              'rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition ' +
              (mode === k ? 'bg-white/15 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200')
            }
          >
            {l}
          </button>
        ))}
      </div>
      <div className="h-[23rem]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -20, right: 8, top: 8, bottom: 4 }}>
            <CartesianGrid stroke={gridStroke} vertical={false} />
            <XAxis dataKey="iso2" tick={{ ...axisStyle, fontSize: 10 }} axisLine={false} tickLine={false} interval={0} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} unit="$" />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              content={({ active, payload }: any) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="rounded-xl border border-white/15 bg-slate-950/95 px-3 py-2 shadow-2xl">
                    <p className="text-sm font-semibold text-white">{d.name}</p>
                    <p className="mt-1 text-[11px] text-emerald-300">
                      Canal legal: {d.legal > 0 ? `${fmt(d.legal, 1)} USD/g` : 'sin oferta legal'}
                    </p>
                    <p className="text-[11px] text-rose-300">Mercado ilícito: {fmt(d.ilicito, 1)} USD/g</p>
                    {d.legal > 0 && (
                      <p className="mt-1 text-[11px] text-slate-400">
                        Diferencia: {fmt(d.ilicito - d.legal, 1)} USD/g (
                        {fmt(((d.ilicito - d.legal) / d.legal) * 100, 0)} %)
                      </p>
                    )}
                  </div>
                );
              }}
            />
            <Bar
              dataKey="legal"
              name="Canal legal"
              fill="#34d399"
              radius={[3, 3, 0, 0]}
              onClick={(d: any) => (d?.payload ?? d)?.country && onSelect((d.payload ?? d).country)}
              cursor="pointer"
            />
            <Bar
              dataKey="ilicito"
              name="Mercado ilícito"
              fill="#fb7185"
              radius={[3, 3, 0, 0]}
              onClick={(d: any) => (d?.payload ?? d)?.country && onSelect((d.payload ?? d).country)}
              cursor="pointer"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-1 text-[11px] text-slate-500">
        Precio estimado de un gramo de flor con THC en dólares. Las barras verdes vacías indican países sin ningún
        canal de venta legal.
      </p>
    </div>
  );
}

/* ── 2. Precios de aceites y flor de CBD ──────────────────────────── */
export function OilPriceChart({ list }: { list: Joined[] }) {
  const [key, setKey] = useState<PriceKey>('cbdOil');
  const meta = PRICE_META.find((p) => p.key === key)!;
  const data = useMemo(
    () =>
      list
        .filter((c) => c.m[key] > 0)
        .sort((a, b) => b.m[key] - a.m[key])
        .slice(0, 18)
        .map((c) => ({ iso2: c.iso2, name: c.name, valor: c.m[key] })),
    [list, key],
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {PRICE_META.filter((p) => p.key !== 'thcLegal' && p.key !== 'thcIllicit').map((p) => (
          <button
            key={p.key}
            onClick={() => setKey(p.key)}
            className={
              'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition ' +
              (key === p.key ? 'bg-white/15 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200')
            }
          >
            <span className="h-2 w-2 rounded-full" style={{ background: p.color, opacity: key === p.key ? 1 : 0.45 }} />
            {p.label}
          </button>
        ))}
      </div>
      <div className="h-[22rem]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 4, right: 30, top: 4, bottom: 4 }}>
            <CartesianGrid stroke={gridStroke} horizontal={false} />
            <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} unit="$" />
            <YAxis type="category" dataKey="iso2" tick={{ ...axisStyle, fontSize: 11 }} width={38} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              content={({ active, payload }: any) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="rounded-xl border border-white/15 bg-slate-950/95 px-3 py-2 shadow-2xl">
                    <p className="text-sm font-semibold text-white">{d.name}</p>
                    <p className="mt-1 text-[11px]" style={{ color: meta.color }}>
                      {meta.label}: {fmt(d.valor, 1)} {meta.unit}
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="valor" name={meta.label} fill={meta.color} radius={[0, 4, 4, 0]} barSize={13} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-1 text-[11px] text-slate-500">
        {meta.label} · {meta.unit}. Solo se muestran países con oferta disponible; los aceites se comparan por frasco
        estándar de 10 ml.
      </p>
    </div>
  );
}

/* ── 3. Tabla de cáñamo por país ──────────────────────────────────── */
export function HempTable({ list, onSelect }: { list: Joined[]; onSelect: (c: Country) => void }) {
  const [status, setStatus] = useState<HempStatus | 'todos'>('todos');
  const rows = useMemo(
    () =>
      list
        .filter((c) => status === 'todos' || c.m.hemp === status)
        .sort((a, b) => b.m.hempHa - a.m.hempHa),
    [list, status],
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {(['todos', ...(Object.keys(HEMP_META) as HempStatus[])] as const).map((k) => (
          <button
            key={k}
            onClick={() => setStatus(k as HempStatus | 'todos')}
            className={
              'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition ' +
              (status === k
                ? 'border-white/25 bg-white/15 text-white'
                : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200')
            }
          >
            {k !== 'todos' && (
              <span className="h-2 w-2 rounded-full" style={{ background: HEMP_META[k as HempStatus].color }} />
            )}
            {k === 'todos' ? 'Todos' : HEMP_META[k as HempStatus].label}
            <span className="rounded-full bg-black/30 px-1.5 py-0.5 text-[10px] tabular-nums text-slate-300">
              {k === 'todos' ? list.length : list.filter((c) => c.m.hemp === k).length}
            </span>
          </button>
        ))}
      </div>
      <div className="max-h-[28rem] overflow-auto rounded-xl border border-white/[0.07]">
        <table className="w-full min-w-[56rem] text-sm">
          <thead className="sticky top-0 z-10 bg-slate-950/95 text-[10px] uppercase tracking-wider text-slate-500 backdrop-blur">
            <tr>
              <th className="px-2.5 py-2 text-left font-medium">País</th>
              <th className="px-2.5 py-2 text-left font-medium">Estatus del cáñamo</th>
              <th className="px-2.5 py-2 text-right font-medium">Límite THC</th>
              <th className="px-2.5 py-2 text-right font-medium">Hectáreas</th>
              <th className="px-2.5 py-2 text-left font-medium">Venta de CBD</th>
              <th className="px-2.5 py-2 text-left font-medium">Marco del cáñamo</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr
                key={c.iso}
                onClick={() => onSelect(c)}
                className="cursor-pointer border-t border-white/[0.05] transition hover:bg-white/[0.05]"
              >
                <td className="px-2.5 py-2 text-xs font-medium text-slate-100">{c.name}</td>
                <td className="px-2.5 py-2">
                  <Badge color={HEMP_META[c.m.hemp].color}>{c.m.hemp}</Badge>
                </td>
                <td className="px-2.5 py-2 text-right text-xs tabular-nums text-slate-200">
                  {c.m.thcLimit > 0 ? `${fmt(c.m.thcLimit, c.m.thcLimit < 1 ? 1 : 0)} %` : '—'}
                </td>
                <td className="px-2.5 py-2 text-right text-xs tabular-nums text-white">
                  {c.m.hempHa > 0 ? fmt(c.m.hempHa, 0) : '—'}
                </td>
                <td className="px-2.5 py-2">
                  <span className="text-[11px]" style={{ color: CBD_META[c.m.cbd].color }}>
                    {CBD_META[c.m.cbd].label}
                  </span>
                </td>
                <td className="max-w-md px-2.5 py-2 text-[11px] leading-snug text-slate-400">{c.m.hempNote}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] text-slate-500">
        {rows.length} países · hectáreas declaradas bajo licencia en la última campaña.
      </p>
    </div>
  );
}

/* ── 4. Modelos comerciales: tamaño, impuesto y mercado ilícito ───── */
export function CommercialScatter({ list, onSelect }: { list: Joined[]; onSelect: (c: Country) => void }) {
  const data = list.map((c) => ({
    ...c,
    tax: c.m.tax,
    illicitShare: c.m.illicitShare,
    marketUsd: c.m.marketUsd,
  }));
  return (
    <div>
      <div className="h-[22rem]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ left: 0, right: 16, top: 12, bottom: 10 }}>
            <CartesianGrid stroke={gridStroke} />
            <XAxis
              type="number"
              dataKey="tax"
              name="Carga fiscal"
              unit="%"
              domain={[0, 28]}
              tick={axisStyle}
              axisLine={false}
              tickLine={false}
              label={{ value: 'carga fiscal sobre la venta legal (%)', position: 'insideBottom', offset: -6, fill: '#64748b', fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="illicitShare"
              name="Mercado ilícito"
              unit="%"
              domain={[20, 100]}
              tick={axisStyle}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <ZAxis type="number" dataKey="marketUsd" range={[30, 700]} />
            <ReferenceLine y={50} stroke="rgba(52,211,153,0.4)" strokeDasharray="4 4" label={{ value: 'mitad del consumo en canal legal', fill: '#34d399', fontSize: 10, position: 'insideTopRight' }} />
            <Tooltip
              cursor={{ stroke: 'rgba(255,255,255,0.25)' }}
              content={({ active, payload }: any) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as Joined;
                return (
                  <div className="rounded-xl border border-white/15 bg-slate-950/95 px-3 py-2 shadow-2xl">
                    <p className="text-sm font-semibold text-white">{d.name}</p>
                    <p className="text-[11px]" style={{ color: MODEL_META[d.m.model].color }}>
                      {MODEL_META[d.m.model].label}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-300">
                      Mercado legal: {fmt(d.m.marketUsd, 0)} M USD · impuesto {fmt(d.m.tax, 1)} %
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {d.m.illicitShare} % del consumo sigue en el circuito ilícito
                    </p>
                    <p className="text-[11px] text-slate-400">Crecimiento anual: {fmt(d.m.cagr, 0)} %</p>
                  </div>
                );
              }}
            />
            <Scatter data={data} cursor="pointer" onClick={(d: any) => (d?.payload ?? d)?.iso && onSelect(d.payload ?? d)}>
              {data.map((c) => (
                <Cell key={c.iso} fill={MODEL_META[c.m.model].color} fillOpacity={0.72} stroke="rgba(255,255,255,0.5)" strokeWidth={0.6} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {Object.values(MODEL_META).map((m) => (
          <span key={m.label} className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: m.color }} />
            {m.label}
          </span>
        ))}
        <span className="ml-auto text-[11px] text-slate-500">tamaño = mercado legal en USD</span>
      </div>
    </div>
  );
}

/* ── 5. Resumen por modelo comercial ──────────────────────────────── */
export function ModelSummary({ list }: { list: Joined[] }) {
  const rows = (Object.keys(MODEL_META) as MarketModel[])
    .map((k) => {
      const l = list.filter((c) => c.m.model === k);
      if (!l.length) return null;
      const avg = (fn: (c: Joined) => number) => l.reduce((s, c) => s + fn(c), 0) / l.length;
      const withLegal = l.filter((c) => c.m.thcLegal > 0);
      return {
        k,
        countries: l.length,
        market: l.reduce((s, c) => s + c.m.marketUsd, 0),
        illicit: avg((c) => c.m.illicitShare),
        tax: avg((c) => c.m.tax),
        cagr: avg((c) => c.m.cagr),
        priceLegal: withLegal.length ? withLegal.reduce((s, c) => s + c.m.thcLegal, 0) / withLegal.length : 0,
        priceIllicit: avg((c) => c.m.thcIllicit),
      };
    })
    .filter(Boolean) as any[];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[46rem] border-separate border-spacing-y-1.5 text-sm">
        <thead>
          <tr className="text-[10px] uppercase tracking-wider text-slate-500">
            <th className="px-2 text-left font-medium">Modelo comercial</th>
            <th className="px-2 text-right font-medium">Países</th>
            <th className="px-2 text-right font-medium">Mercado legal</th>
            <th className="px-2 text-right font-medium">Impuesto medio</th>
            <th className="px-2 text-right font-medium">Mercado ilícito</th>
            <th className="px-2 text-right font-medium">Crecimiento</th>
            <th className="px-2 text-right font-medium">Flor legal</th>
            <th className="px-2 text-right font-medium">Flor ilícita</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.k} className="rounded-lg bg-white/[0.03] transition hover:bg-white/[0.06]">
              <td className="rounded-l-lg px-2 py-2.5">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: MODEL_META[r.k as MarketModel].color }} />
                  <span className="text-xs font-medium text-slate-100">{MODEL_META[r.k as MarketModel].label}</span>
                </span>
              </td>
              <td className="px-2 text-right text-xs tabular-nums text-slate-300">{r.countries}</td>
              <td className="px-2 text-right text-xs tabular-nums text-white">{fmt(r.market, 0)} M</td>
              <td className="px-2 text-right text-xs tabular-nums text-slate-200">{fmt(r.tax, 1)} %</td>
              <td className="px-2 text-right text-xs tabular-nums text-slate-200">{fmt(r.illicit, 0)} %</td>
              <td className="px-2 text-right text-xs tabular-nums text-emerald-300">+{fmt(r.cagr, 0)} %</td>
              <td className="px-2 text-right text-xs tabular-nums text-slate-200">
                {r.priceLegal > 0 ? `${fmt(r.priceLegal, 1)} $` : '—'}
              </td>
              <td className="rounded-r-lg px-2 text-right text-xs tabular-nums text-slate-200">
                {fmt(r.priceIllicit, 1)} $
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-[11px] text-slate-500">
        Mercado legal en millones de USD anuales (medicinal + uso adulto + CBD). Precios de flor por gramo.
      </p>
    </div>
  );
}

/* ── 6. Evolución del cáñamo y del CBD ────────────────────────────── */
export function HempEvolution() {
  return (
    <div className="h-[20rem]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={HEMP_SERIES} margin={{ left: -16, right: -8, top: 10, bottom: 4 }}>
          <defs>
            <linearGradient id="hemp-ha" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#34d399" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={gridStroke} vertical={false} />
          <XAxis dataKey="year" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis yAxisId="l" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis yAxisId="r" orientation="right" tick={axisStyle} axisLine={false} tickLine={false} width={40} />
          <Tooltip content={<ChartTip />} />
          <Area
            yAxisId="l"
            type="monotone"
            dataKey="hectares"
            name="Superficie de cáñamo (miles ha)"
            stroke="#34d399"
            strokeWidth={2.4}
            fill="url(#hemp-ha)"
            dot={false}
          />
          <Line yAxisId="r" type="monotone" dataKey="countries" name="Países con marco de cáñamo" stroke="#60a5fa" strokeWidth={2.2} dot={{ r: 2.5 }} />
          <Line yAxisId="r" type="monotone" dataKey="cbdMarket" name="Mercado de CBD (miles M USD)" stroke="#22d3ee" strokeWidth={2.2} dot={{ r: 2.5 }} />
          <Line yAxisId="r" type="monotone" dataKey="hempMarket" name="Cáñamo industrial (miles M USD)" stroke="#a3e635" strokeWidth={2.2} dot={{ r: 2.5 }} />
        </ComposedChart>
      </ResponsiveContainer>
      <p className="mt-1 text-[11px] text-slate-500">
        La burbuja del CBD de 2019 provocó una caída de superficie en 2020-2021; desde entonces el cáñamo crece por
        fibra, grano y materiales de construcción más que por cannabinoides.
      </p>
    </div>
  );
}

/* ── 7. Ficha de mercado para el panel de país ────────────────────── */
export function CountryMarketCard({ iso }: { iso: string }) {
  const m = MARKET_BY_ISO[iso];
  if (!m) return null;
  const price = (v: number, unit: string) => (v > 0 ? `${fmt(v, 1)} $${unit}` : '—');
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
      <p className="mb-2 text-xs font-semibold text-white">Cáñamo, comercio y precios</p>
      <div className="flex flex-wrap gap-1.5">
        <Badge color={HEMP_META[m.hemp].color}>Cáñamo: {m.hemp}</Badge>
        <Badge color={CBD_META[m.cbd].color}>CBD: {CBD_META[m.cbd].label}</Badge>
        <Badge color={MODEL_META[m.model].color}>{MODEL_META[m.model].label}</Badge>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{m.hempNote}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
        <span className="font-semibold text-slate-200">Tendencia:</span> {m.trend}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[
          ['Límite THC cáñamo', m.thcLimit > 0 ? `${fmt(m.thcLimit, m.thcLimit < 1 ? 1 : 0)} %` : '—'],
          ['Superficie', m.hempHa > 0 ? `${fmt(m.hempHa, 0)} ha` : '—'],
          ['Mercado legal', `${fmt(m.marketUsd, 0)} M USD`],
          ['Mercado ilícito', `${m.illicitShare} %`],
          ['Impuesto', `${fmt(m.tax, 1)} %`],
          ['Crecimiento', `+${fmt(m.cagr, 0)} % anual`],
        ].map(([l, v]) => (
          <div key={l as string} className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-2.5 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-500">{l}</p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums text-white">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-1.5">
        <p className="text-[10px] uppercase tracking-wide text-slate-500">Precios estimados</p>
        {[
          ['Flor THC — canal legal', price(m.thcLegal, '/g'), '#34d399'],
          ['Flor THC — ilícito', price(m.thcIllicit, '/g'), '#fb7185'],
          ['Flor de CBD', price(m.cbdFlower, '/g'), '#60a5fa'],
          ['Aceite con THC', price(m.thcOil, '/10 ml'), '#a78bfa'],
          ['Aceite de CBD', price(m.cbdOil, '/10 ml'), '#22d3ee'],
        ].map(([l, v, c]) => (
          <div key={l as string} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-[11px] text-slate-300">
              <span className="h-2 w-2 rounded-full" style={{ background: c as string }} />
              {l}
            </span>
            <span className="text-[11px] font-semibold tabular-nums text-white">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export { FRAMEWORKS };
