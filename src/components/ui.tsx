import { useEffect, useRef, useState, type ReactNode } from "react";

/* ---------------- Iconos (SVG inline) ---------------- */
const PATHS: Record<string, ReactNode> = {
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  flask: <path d="M9 3h6M10 3v6L4 19a2 2 0 0 0 1.8 2.9h12.4A2 2 0 0 0 20 19l-6-10V3M7 15h10" />,
  cursor: <path d="M4 3l7 17 2.5-6.5L20 11 4 3z" />,
  spark: <path d="M12 2l2.2 6.2L20 10l-5.8 1.8L12 18l-2.2-6.2L4 10l5.8-1.8L12 2zM19 15l1 2.6L22.6 19 20 20l-1 2.6L18 20l-2.6-1L18 19l1-2.6L19 15z" />,
  eye: <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />,
  scale: <path d="M12 3v18M5 7h14M7 7l-3 6h6L7 7zm10 0l-3 6h6l-3-6zM8 21h8" />,
  megaphone: <path d="M3 11v3l4 .8V10.2L3 11zm4-.8L16 6v13L7 14.8M19 9a4 4 0 0 1 0 7" />,
  code: <path d="M8 6l-6 6 6 6M16 6l6 6-6 6M13 4l-2 16" />,
  heart: <path d="M12 20s-7-4.6-7-9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5C19 15.4 12 20 12 20z" />,
  book: <path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4V4zm16 0h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7V4z" />,
  leaf: <path d="M4 20c0-8 6-14 16-15 1 11-5 16-13 16H4zm2-2c2-5 5-8 9-10" />,
  home: <path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9z" />,
  users: <path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm13 10v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />,
  calendar: <path d="M3 9h18M7 3v3M17 3v3M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />,
  news: <path d="M4 5h13a2 2 0 0 1 2 2v12H6a2 2 0 0 1-2-2V5zm15 3h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2M8 9h7M8 13h7" />,
  network: <path d="M12 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM5 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm14 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM7.5 18l4-4.5m5 0l4 4.5M9 7l3 3h0l3-3" />,
  clipboard: <path d="M9 3h6v3H9V3zM7 6h10a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm2 6h6M9 15h6" />,
  shop: <path d="M4 8h16l-1.2 12H5.2L4 8zm4 0V6a4 4 0 0 1 8 0v2M9 12v6M15 12v6" />,
  gift: <path d="M4 10h16v10H4V10zm2-6h12v4H6V4zm6 4v12M6 10c-1.5 0-2.5-1-2.5-2S4.5 6 6 6m12 4c1.5 0 2.5-1 2.5-2S19.5 6 18 6" />,
  mail: <path d="M3 6h18v12H3V6zm0 0l9 7 9-7" />,
  pin: <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />,
  search: <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm10 2l-4.5-4.5" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="M4 12l5 5L20 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  insta: <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM17.5 6.5h.01" />,
  face: <path d="M14 8h2.5C18 8 20 10 20 12.5c0 3-2 5.5-4.5 5.5H12v-4M14 8V5h-2v3M9 12h4M9 15.5h4" />,
  youtube: <path d="M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8zm7 1l5 3-5 3V9z" />,
  globe: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0 0c2.5-2.4 3.8-5.6 3.8-9S14.5 5.4 12 3c-2.5 2.4-3.8 5.6-3.8 9S9.5 18.6 12 21zM3.5 9h17M3.5 15h17" />,
  lab: <path d="M4 4h16v5H4V4zm2 5v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9M10 13h4" />,
  sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />,
};

export function Icon({ name, className = "h-5 w-5", stroke = true }: { name: string; className?: string; stroke?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={stroke ? "none" : "currentColor"}
      stroke={stroke ? "currentColor" : "none"}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name] ?? PATHS.sparkle}
    </svg>
  );
}

/* ---------------- Reveal on scroll ---------------- */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${visible ? "is-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---------------- Contador animado ---------------- */
export function Counter({ value, suffix = "", duration = 1400 }: { value: number; suffix?: string; duration?: number }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let start = 0;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const step = (t: number) => {
          if (!start) start = t;
          const p = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(value * eased);
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        obs.disconnect();
      }
    });
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);
  const decimals = value % 1 !== 0 ? 1 : 0;
  return (
    <span ref={ref}>
      {n.toLocaleString("es-AR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/* ---------------- Piezas de UI ---------------- */
export function Badge({ children, tone = "lima", className = "" }: { children: ReactNode; tone?: "lima" | "cian" | "ambar" | "rose" | "violeta" | "slate"; className?: string }) {
  const tones: Record<string, string> = {
    lima: "bg-lima-500/12 text-lima-300 border-lima-500/30",
    cian: "bg-cian-400/12 text-cian-400 border-cian-400/30",
    ambar: "bg-ambar-400/12 text-ambar-400 border-ambar-400/30",
    rose: "bg-rose-400/12 text-rose-400 border-rose-400/30",
    violeta: "bg-violeta-400/12 text-violeta-400 border-violeta-400/30",
    slate: "bg-white/6 text-emerald-50/70 border-white/12",
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide ${tones[tone]} ${className}`}>{children}</span>;
}

export function Panel({ children, className = "", hover = true }: { children: ReactNode; className?: string; hover?: boolean }) {
  return <div className={`panel noise ${hover ? "panel-hover" : ""} ${className}`}>{children}</div>;
}

export function SectionTitle({ kicker, titulo, bajada, icono }: { kicker: string; titulo: ReactNode; bajada?: string; icono?: string }) {
  return (
    <Reveal className="mb-8">
      <div className="flex items-center gap-3">
        {icono && (
          <span className="grid h-11 w-11 place-items-center rounded-2xl border border-lima-500/30 bg-lima-500/10 text-lima-300">
            <Icon name={icono} className="h-5 w-5" />
          </span>
        )}
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-lima-400/80">{kicker}</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{titulo}</h2>
        </div>
      </div>
      {bajada && <p className="mt-4 max-w-3xl text-sm leading-relaxed text-emerald-50/65">{bajada}</p>}
    </Reveal>
  );
}

export function DemoBadge({ texto = "Dato demo" }: { texto?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-dashed border-ambar-400/50 bg-ambar-400/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ambar-400">
      {texto}
    </span>
  );
}

export function Tabs<T extends string>({ opciones, activa, onChange, className = "" }: { opciones: readonly T[]; activa: T; onChange: (v: T) => void; className?: string }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`} role="group" aria-label="Filtros">
      {opciones.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={activa === o}
          onClick={() => onChange(o)}
          className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-300 ${
            activa === o
              ? "border-lima-500/60 bg-lima-500/15 text-lima-200 shadow-[0_0_24px_-8px_rgba(163,230,53,0.8)]"
              : "border-white/10 bg-white/[0.03] text-emerald-50/60 hover:border-white/25 hover:text-emerald-50/90"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function Progress({ value, tone = "lima", className = "" }: { value: number; tone?: "lima" | "cian" | "ambar"; className?: string }) {
  const bg = tone === "lima" ? "from-lima-400 to-verde-400" : tone === "cian" ? "from-cian-400 to-verde-400" : "from-ambar-400 to-rose-400";
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-white/8 ${className}`}>
      <div className={`h-full rounded-full bg-gradient-to-r ${bg}`} style={{ width: `${Math.min(100, value)}%`, transition: "width 1.2s cubic-bezier(0.22,1,0.36,1)" }} />
    </div>
  );
}

export function Boton({ children, onClick, variante = "primario", type = "button", className = "" }: { children: ReactNode; onClick?: () => void; variante?: "primario" | "fantasma"; type?: "button" | "submit"; className?: string }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 active:scale-[0.98]";
  const styles =
    variante === "primario"
      ? "bg-gradient-to-r from-lima-400 to-verde-400 text-ink-950 hover:shadow-[0_18px_40px_-18px_rgba(52,211,153,0.9)] hover:brightness-110"
      : "border border-white/15 bg-white/[0.04] text-emerald-50/80 hover:border-lima-500/40 hover:text-white";
  return (
    <button type={type} onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}
