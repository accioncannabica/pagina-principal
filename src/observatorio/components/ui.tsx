import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

export const fmt = (n: number, d = 0) =>
  n.toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d });

export const fmtM = (n: number) =>
  n >= 10 ? `${fmt(n, 0)} M` : n >= 1 ? `${fmt(n, 1)} M` : `${fmt(n * 1000, 0)} mil`;

export function Card({
  children,
  className,
  title,
  subtitle,
  right,
  id,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-sm sm:p-5',
        'shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_18px_40px_-30px_rgba(0,0,0,0.9)]',
        className,
      )}
    >
      {(title || right) && (
        <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h3 className="text-[15px] font-semibold tracking-tight text-white">{title}</h3>}
            {subtitle && <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-400">{subtitle}</p>}
          </div>
          {right}
        </header>
      )}
      {children}
    </section>
  );
}

export function Sparkline({
  data,
  color = '#34d399',
  height = 34,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const w = 100;
  const pts = data.map((v, i) => {
    const x = data.length === 1 ? w / 2 : (i / (data.length - 1)) * w;
    const y = height - 3 - ((v - min) / span) * (height - 8);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const id = `sp-${color.replace('#', '')}-${data.length}-${Math.round(min)}`;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="h-9 w-full">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${pts.join(' ')} ${w},${height}`} fill={`url(#${id})`} />
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function Kpi({
  label,
  value,
  unit,
  delta,
  deltaLabel,
  spark,
  color = '#34d399',
  hint,
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  deltaLabel?: string;
  spark?: number[];
  color?: string;
  hint?: string;
}) {
  const up = delta?.startsWith('+');
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-4">
      <div
        className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full opacity-20 blur-2xl transition group-hover:opacity-40"
        style={{ background: color }}
      />
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <div className="mt-2 flex items-end gap-1.5">
        <span className="text-2xl font-semibold tabular-nums text-white sm:text-[27px]">{value}</span>
        {unit && <span className="pb-1 text-xs text-slate-400">{unit}</span>}
      </div>
      {spark && <div className="mt-2 -mx-1"><Sparkline data={spark} color={color} /></div>}
      {delta && (
        <p className="mt-2 flex flex-wrap items-center gap-1 text-[11px]">
          <span
            className={cn(
              'rounded-md px-1.5 py-0.5 font-semibold tabular-nums',
              up ? 'bg-emerald-400/15 text-emerald-300' : 'bg-rose-400/15 text-rose-300',
            )}
          >
            {delta}
          </span>
          <span className="text-slate-400">{deltaLabel}</span>
        </p>
      )}
      {hint && <p className="mt-2 text-[11px] leading-snug text-slate-500">{hint}</p>}
    </div>
  );
}

export function Chip({
  active,
  onClick,
  children,
  color,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  color?: string;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition',
        active
          ? 'border-white/25 bg-white/15 text-white'
          : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200',
      )}
    >
      {color && (
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ background: color, opacity: active ? 1 : 0.45 }}
        />
      )}
      {children}
      {typeof count === 'number' && (
        <span className="rounded-full bg-black/30 px-1.5 py-0.5 text-[10px] tabular-nums text-slate-300">{count}</span>
      )}
    </button>
  );
}

export function Badge({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
      style={{ background: `${color}22`, color }}
    >
      {children}
    </span>
  );
}

export function BarMeter({
  value,
  max,
  color,
  label,
  right,
}: {
  value: number;
  max: number;
  color: string;
  label: string;
  right: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-40 shrink-0 truncate text-xs text-slate-300">{label}</span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color }}
        />
      </div>
      <span className="w-16 shrink-0 text-right text-xs font-semibold tabular-nums text-white">{right}</span>
    </div>
  );
}

/* ── Tooltip reutilizable para recharts ─────────────────────────────── */
export function ChartTip({ active, payload, label, suffix }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="pointer-events-none rounded-xl border border-white/15 bg-slate-950/95 px-3 py-2 shadow-2xl backdrop-blur">
      {label !== undefined && (
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      )}
      <div className="space-y-0.5">
        {payload.map((p: any, i: number) => (
          <p key={i} className="flex items-center gap-2 text-xs text-slate-200">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.fill }} />
            <span className="text-slate-400">{p.name}:</span>
            <span className="font-semibold tabular-nums text-white">
              {typeof p.value === 'number' ? fmt(p.value, p.value < 10 ? 1 : 0) : p.value}
              {suffix ?? ''}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}

export const axisStyle = { fontSize: 11, fill: '#94a3b8' };
export const gridStroke = 'rgba(255,255,255,0.07)';
