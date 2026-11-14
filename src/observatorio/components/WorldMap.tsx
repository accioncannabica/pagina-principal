import { useMemo, useState } from 'react';
import { FRAMEWORKS, type Country, type FrameworkKey } from '../data/countries';
import { HEMP_META, MARKET_BY_ISO } from '../data/market';

const COLS = 25;
const ROWS = 12;

export type MapMetric = 'framework' | 'prevalence' | 'arrests' | 'acceptance' | 'hemp' | 'price';

export const MAP_METRICS: { key: MapMetric; label: string; hint: string }[] = [
  { key: 'framework', label: 'Marco legal', hint: 'Estatus normativo del cannabis en 2026' },
  { key: 'prevalence', label: 'Prevalencia', hint: '% de la población 15-64 que consumió en el último año' },
  { key: 'arrests', label: 'Presión policial', hint: 'Detenciones por cannabis por 100.000 habitantes' },
  { key: 'acceptance', label: 'Aceptación cultural', hint: 'Índice de opinión pública favorable (0-100)' },
  { key: 'hemp', label: 'Cáñamo', hint: 'Estatus legal del cáñamo industrial y su límite de THC' },
  { key: 'price', label: 'Precio de la flor', hint: 'Precio estimado del gramo de flor con THC (USD)' },
];

function lerpColor(a: string, b: string, t: number) {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [r1, g1, b1] = p(a);
  const [r2, g2, b2] = p(b);
  const m = (x: number, y: number) => Math.round(x + (y - x) * t);
  return `rgb(${m(r1, r2)},${m(g1, g2)},${m(b1, b2)})`;
}

const SCALE: Record<MapMetric, [string, string]> = {
  framework: ['#1e293b', '#1e293b'],
  prevalence: ['#0f2e29', '#34d399'],
  arrests: ['#2b1c22', '#fb7185'],
  acceptance: ['#101c33', '#60a5fa'],
  hemp: ['#1e293b', '#1e293b'],
  price: ['#2a2412', '#fbbf24'],
};

const priceOf = (c: Country) => {
  const m = MARKET_BY_ISO[c.iso];
  if (!m) return 0;
  return m.thcLegal > 0 ? m.thcLegal : m.thcIllicit;
};

const CONTINENT_LABELS: { text: string; x: number; y: number }[] = [
  { text: 'AMÉRICA DEL NORTE', x: 4.5, y: 0.45 },
  { text: 'AMÉRICA LATINA', x: 4.5, y: 9.55 },
  { text: 'EUROPA', x: 12.5, y: 0.45 },
  { text: 'ÁFRICA', x: 13.2, y: 5.55 },
  { text: 'ASIA', x: 20, y: 2.55 },
  { text: 'OCEANÍA', x: 22.5, y: 11.45 },
];

export default function WorldMap({
  countries: COUNTRIES,
  metric,
  onMetricChange,
  selected,
  onSelect,
}: {
  countries: Country[];
  metric: MapMetric;
  onMetricChange: (m: MapMetric) => void;
  selected: string | null;
  onSelect: (c: Country) => void;
}) {
  const [hover, setHover] = useState<Country | null>(null);

  const maxPrevalence = useMemo(
    () => Math.max(1, ...COUNTRIES.map((c) => c.prevalence)),
    [COUNTRIES],
  );
  const maxArrests = useMemo(() => Math.max(1, ...COUNTRIES.map((c) => c.arrests)), [COUNTRIES]);
  const maxPrice = useMemo(() => Math.max(1, ...COUNTRIES.map(priceOf)), [COUNTRIES]);

  const colorFor = (c: Country) => {
    if (metric === 'framework') return FRAMEWORKS[c.framework as FrameworkKey].color;
    if (metric === 'hemp') {
      const m = MARKET_BY_ISO[c.iso];
      return m ? HEMP_META[m.hemp].color : '#334155';
    }
    const [from, to] = SCALE[metric];
    const v =
      metric === 'prevalence'
        ? c.prevalence
        : metric === 'arrests'
          ? c.arrests
          : metric === 'price'
            ? priceOf(c)
            : c.acceptance;
    const max =
      metric === 'prevalence'
        ? maxPrevalence
        : metric === 'arrests'
          ? maxArrests
          : metric === 'price'
            ? maxPrice
            : 100;
    return lerpColor(from, to, Math.pow(v / max, 0.85));
  };

  const tipValue = (c: Country) => {
    if (metric === 'prevalence') return `${c.prevalence.toFixed(1)} % de adultos`;
    if (metric === 'arrests') return `${c.arrests} detenciones / 100k`;
    if (metric === 'acceptance') return `${c.acceptance}/100 aceptación`;
    if (metric === 'hemp') {
      const m = MARKET_BY_ISO[c.iso];
      return m ? `${HEMP_META[m.hemp].label}${m.thcLimit > 0 ? ` · ${m.thcLimit} % THC` : ''}` : 'Sin datos';
    }
    if (metric === 'price') {
      const m = MARKET_BY_ISO[c.iso];
      if (!m) return 'Sin datos';
      return m.thcLegal > 0
        ? `${m.thcLegal.toFixed(1)} USD/g en canal legal`
        : `${m.thcIllicit.toFixed(1)} USD/g (solo ilícito)`;
    }
    return FRAMEWORKS[c.framework].label;
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {MAP_METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => onMetricChange(m.key)}
              title={m.hint}
              className={
                'rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition ' +
                (metric === m.key
                  ? 'bg-white/15 text-white shadow-inner'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200')
              }
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-slate-500">{MAP_METRICS.find((m) => m.key === metric)?.hint}</p>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-[radial-gradient(120%_120%_at_20%_0%,rgba(16,185,129,0.07),transparent_60%),radial-gradient(90%_90%_at_90%_10%,rgba(99,102,241,0.09),transparent_60%)] p-2">
        <svg viewBox={`-0.6 -0.6 ${COLS + 1.2} ${ROWS + 1.2}`} className="w-full">
          {CONTINENT_LABELS.map((l) => (
            <text
              key={l.text}
              x={l.x}
              y={l.y}
              textAnchor="middle"
              fill="rgba(148,163,184,0.4)"
              style={{ fontSize: 0.36, letterSpacing: 0.12, fontWeight: 600 }}
            >
              {l.text}
            </text>
          ))}
          {COUNTRIES.map((c) => {
            const [col, row] = c.grid;
            const isActive = selected === c.iso;
            const isHover = hover?.iso === c.iso;
            const big = c.pop > 40 || c.iso === 'CHN' || c.iso === 'IND';
            return (
              <g
                key={c.iso}
                onMouseEnter={() => setHover(c)}
                onMouseLeave={() => setHover((h) => (h?.iso === c.iso ? null : h))}
                onClick={() => onSelect(c)}
                className="cursor-pointer"
              >
                <rect
                  x={col + 0.06}
                  y={row + 0.06}
                  width={0.88}
                  height={0.88}
                  rx={0.16}
                  fill={colorFor(c)}
                  opacity={isActive ? 1 : isHover ? 0.98 : 0.82}
                  stroke={isActive ? '#ffffff' : isHover ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.09)'}
                  strokeWidth={isActive ? 0.055 : 0.02}
                />
                {big && (
                  <text
                    x={col + 0.5}
                    y={row + 0.62}
                    textAnchor="middle"
                    fill={metric === 'framework' || metric === 'hemp' ? 'rgba(6,10,15,0.75)' : 'rgba(255,255,255,0.92)'}
                    style={{ fontSize: 0.32, fontWeight: 700 }}
                  >
                    {c.iso2}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {hover && (
          <div className="pointer-events-none absolute left-3 bottom-3 max-w-[15rem] rounded-xl border border-white/15 bg-slate-950/92 p-3 shadow-2xl backdrop-blur">
            <p className="text-sm font-semibold text-white">{hover.name}</p>
            <p className="mt-0.5 text-[11px] text-slate-400">{hover.region}</p>
            <p className="mt-2 text-xs font-medium" style={{ color: FRAMEWORKS[hover.framework].color }}>
              {tipValue(hover)}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              {hover.users < 1 ? `${Math.round(hover.users * 1000)} mil` : `${hover.users.toFixed(1)} M`} consumidores ·{' '}
              {hover.arrests}/100k detenciones
            </p>
            <p className="mt-1 text-[10px] text-slate-500">Clic para ver la ficha del país</p>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        {metric === 'hemp' ? (
          Object.entries(HEMP_META).map(([k, f]) => (
            <span key={k} className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: f.color }} />
              {f.label}
              <span className="tabular-nums text-slate-500">
                ({COUNTRIES.filter((c) => MARKET_BY_ISO[c.iso]?.hemp === k).length})
              </span>
            </span>
          ))
        ) : metric === 'framework' ? (
          Object.entries(FRAMEWORKS).map(([k, f]) => (
            <span key={k} className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: f.color }} />
              {f.label}
              <span className="tabular-nums text-slate-500">
                ({COUNTRIES.filter((c) => c.framework === k).length})
              </span>
            </span>
          ))
        ) : (
          <>
            <span className="text-[11px] text-slate-500">bajo</span>
            <div
              className="h-2.5 w-40 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${SCALE[metric][0]}, ${SCALE[metric][1]})`,
              }}
            />
            <span className="text-[11px] text-slate-500">
              {metric === 'prevalence'
                ? `${maxPrevalence.toFixed(1)} % de adultos`
                : metric === 'arrests'
                  ? `${maxArrests} detenciones / 100k`
                  : metric === 'price'
                    ? `${maxPrice.toFixed(0)} USD por gramo`
                    : '100 aceptación'}
            </span>
          </>
        )}
        <span className="ml-auto text-[10px] text-slate-600">
          Mapa de mosaicos esquemático · {COUNTRIES.length} países · datos 2024-2026
        </span>
      </div>
    </div>
  );
}
