import { ReactNode } from "react";
import { cn } from "../utils/cn";

export const EASE = [0.22, 1, 0.36, 1] as const;

export function Card({ children, className, hover = false }: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.07] bg-[#111713] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_12px_32px_-16px_rgba(0,0,0,0.7)]",
        hover && "transition-all duration-300 hover:border-emerald-400/25 hover:bg-[#131a15]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  desc,
  right,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <div className="mb-2 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300/90">{eyebrow}</span>
        </div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-zinc-50 sm:text-[28px]">{title}</h2>
        {desc && <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{desc}</p>}
      </div>
      {right}
    </div>
  );
}

export function Stat({
  label,
  value,
  sub,
  delta,
  icon,
  accent = "emerald",
}: {
  label: string;
  value: string;
  sub?: string;
  delta?: number;
  icon?: ReactNode;
  accent?: "emerald" | "amber" | "rose" | "sky";
}) {
  const colors = {
    emerald: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
    amber: "text-amber-300 bg-amber-400/10 border-amber-400/20",
    rose: "text-rose-300 bg-rose-400/10 border-rose-400/20",
    sky: "text-sky-300 bg-sky-400/10 border-sky-400/20",
  }[accent];
  return (
    <Card hover className="group relative overflow-hidden p-5">
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">{label}</p>
        {icon && <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg border", colors)}>{icon}</span>}
      </div>
      <p className="mt-3 font-display text-[30px] font-semibold leading-none tracking-tight text-zinc-50">{value}</p>
      <div className="mt-2.5 flex items-center gap-2 text-xs">
        {delta !== undefined && (
          <span className={cn("rounded-md px-1.5 py-0.5 font-mono font-semibold", delta >= 0 ? "bg-emerald-400/10 text-emerald-300" : "bg-rose-400/10 text-rose-300")}>
            {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%
          </span>
        )}
        {sub && <span className="text-zinc-500">{sub}</span>}
      </div>
    </Card>
  );
}

export function Badge({ children, tone = "zinc" }: { children: ReactNode; tone?: "emerald" | "amber" | "rose" | "sky" | "zinc" }) {
  const tones = {
    emerald: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    amber: "border-amber-400/25 bg-amber-400/10 text-amber-300",
    rose: "border-rose-400/25 bg-rose-400/10 text-rose-300",
    sky: "border-sky-400/25 bg-sky-400/10 text-sky-300",
    zinc: "border-white/10 bg-white/[0.04] text-zinc-300",
  }[tone];
  return <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium", tones)}>{children}</span>;
}

export function ProgressBar({ value, tone = "emerald", className }: { value: number; tone?: "emerald" | "amber" | "rose"; className?: string }) {
  const bar = { emerald: "bg-emerald-400", amber: "bg-amber-400", rose: "bg-rose-400" }[tone];
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]", className)}>
      <div className={cn("h-full rounded-full", bar)} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}

export function FadeIn({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return <div className={className} style={delay ? { transitionDelay: `${delay}s` } : undefined}>{children}</div>;
}

// Escala de color divergente para mapas de calor: esmeralda (+) ↔ rojo (−), sólido por celda
export function heatColor(v: number, alpha = 1): string {
  const t = Math.max(-1, Math.min(1, v));
  if (t >= 0) {
    const l = 16 + t * 30; // lightness
    return `hsla(152, 65%, ${l}%, ${alpha})`;
  }
  const l = 16 + Math.abs(t) * 30;
  return `hsla(8, 72%, ${l}%, ${alpha})`;
}

// Escala secuencial esmeralda para intensidades 0..1
export function seqColor(t: number): string {
  const c = Math.max(0, Math.min(1, t));
  return `hsl(152, ${45 + c * 35}%, ${10 + c * 42}%)`;
}

export const CHART_TOOLTIP = {
  contentStyle: {
    backgroundColor: "#0d120e",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    fontSize: 12,
    color: "#e4e4e7",
    boxShadow: "0 16px 40px -12px rgba(0,0,0,0.8)",
  },
  labelStyle: { color: "#a1a1aa", fontWeight: 600 },
};
