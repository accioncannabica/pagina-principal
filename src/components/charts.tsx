import { useMemo, useState, type ReactNode } from "react";

/* =======================================================================
   Utilidades
   ======================================================================= */
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

function Tooltip({ x, y, children }: { x: number | string; y: number | string; children: ReactNode }) {
  return (
    <div className="chart-tip" style={{ left: x, top: y }}>
      {children}
    </div>
  );
}

export function ChartFrame({ titulo, subtitulo, children, acciones, className = "" }: { titulo: string; subtitulo?: string; children: ReactNode; acciones?: ReactNode; className?: string }) {
  return (
    <div className={cx("panel noise p-5", className)}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-white">{titulo}</h3>
          {subtitulo && <p className="mt-1 text-xs text-emerald-50/55">{subtitulo}</p>}
        </div>
        {acciones}
      </div>
      {children}
    </div>
  );
}

/** Escala de color continua (verde → lima → ámbar → rosa). */
export function escalaCalor(t: number) {
  const p = Math.max(0, Math.min(1, t));
  const stops: [number, [number, number, number]][] = [
    [0, [12, 30, 24]],
    [0.25, [16, 122, 78]],
    [0.5, [132, 204, 22]],
    [0.75, [251, 191, 36]],
    [1, [251, 113, 133]],
  ];
  for (let i = 0; i < stops.length - 1; i++) {
    const [p0, c0] = stops[i];
    const [p1, c1] = stops[i + 1];
    if (p >= p0 && p <= p1) {
      const k = (p - p0) / (p1 - p0);
      const c = c0.map((v, j) => Math.round(v + (c1[j] - v) * k));
      return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
    }
  }
  return "rgb(251,113,133)";
}

export function LeyendaCalor({ desde = "bajo", hasta = "alto", etiquetas }: { desde?: string; hasta?: string; etiquetas?: [string, string] }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-emerald-50/50">
      <span>{etiquetas?.[0] ?? desde}</span>
      <span className="h-2.5 w-28 rounded-full" style={{ background: "linear-gradient(90deg,#0c1e18,#107a4e,#84cc16,#fbbf24,#fb7185)" }} />
      <span>{etiquetas?.[1] ?? hasta}</span>
    </div>
  );
}

/* =======================================================================
   1. Área apilada (stream) — actividad mensual
   ======================================================================= */
export function AreaStream({
  data,
  series,
}: {
  data: { mes: string; [k: string]: number | string }[];
  series: { key: string; label: string; color: string }[];
}) {
  const [activas, setActivas] = useState<string[]>(series.map((s) => s.key));
  const [hover, setHover] = useState<number | null>(null);
  const W = 720;
  const H = 260;
  const pad = { l: 34, r: 12, t: 14, b: 26 };

  const keys = series.filter((s) => activas.includes(s.key));
  const totales = data.map((d) => keys.reduce((a, s) => a + (d[s.key] as number), 0));
  const max = Math.max(...totales, 1);
  const x = (i: number) => pad.l + (i * (W - pad.l - pad.r)) / (data.length - 1);
  const y = (v: number) => H - pad.b - (v * (H - pad.t - pad.b)) / max;

  const { paths } = useMemo(() => {
    let acumulado = data.map(() => 0);
    const out: { key: string; d: string; color: string }[] = [];
    keys.forEach((s) => {
      const lower = [...acumulado];
      acumulado = acumulado.map((v, i) => v + (data[i][s.key] as number));
      const top = acumulado.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");
      const bottom = lower.map((v, i) => `L${x(i)},${y(v)}`).reverse().join(" ");
      out.push({ key: s.key, d: `${top} ${bottom} Z`, color: s.color });
    });
    return { paths: out };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, activas.join(","), max]);

  return (
    <ChartFrame
      titulo="Actividad mensual · serie apilada"
      subtitulo="Consultas, talleres y apariciones en prensa (dataset demo)"
      acciones={
        <div className="flex flex-wrap gap-1.5">
          {series.map((s) => (
            <button
              key={s.key}
              onClick={() => setActivas((a) => (a.includes(s.key) ? a.filter((k) => k !== s.key) : [...a, s.key]))}
              className={cx(
                "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition",
                activas.includes(s.key) ? "border-white/25 bg-white/8 text-white" : "border-white/8 text-emerald-50/40",
              )}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
              {s.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Gráfico de área apilada de actividad mensual">
          <defs>
            {paths.map((p) => (
              <linearGradient key={p.key} id={`grad-${p.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={p.color} stopOpacity="0.85" />
                <stop offset="100%" stopColor={p.color} stopOpacity="0.25" />
              </linearGradient>
            ))}
          </defs>
          {[0.25, 0.5, 0.75, 1].map((g) => (
            <line key={g} x1={pad.l} x2={W - pad.r} y1={y(max * g)} y2={y(max * g)} stroke="rgba(255,255,255,0.07)" strokeDasharray="3 5" />
          ))}
          {paths.map((p) => (
            <path key={p.key} d={p.d} fill={`url(#grad-${p.key})`} stroke={p.color} strokeWidth="1.2" className="transition-opacity duration-500" />
          ))}
          {data.map((d, i) => (
            <g key={d.mes}>
              <rect x={x(i) - 12} y={pad.t} width={24} height={H - pad.t - pad.b} fill="transparent" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
              <text x={x(i)} y={H - 8} textAnchor="middle" className="fill-emerald-50/40 text-[9px]">{d.mes}</text>
            </g>
          ))}
          {[0, 0.5, 1].map((g) => (
            <text key={g} x={pad.l - 6} y={y(max * g) + 3} textAnchor="end" className="fill-emerald-50/35 text-[9px]">{Math.round(max * g)}</text>
          ))}
          {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} stroke="rgba(163,230,53,0.6)" strokeWidth="1" />}
        </svg>
        {hover !== null && (
          <Tooltip x={(x(hover) / W) * 100 + "%"} y={(y(totales[hover]) / H) * 100 + "%"}>
            <div className="font-semibold text-lima-300">{data[hover].mes}</div>
            {keys.map((s) => (
              <div key={s.key} className="flex items-center justify-between gap-3 text-emerald-50/80">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
                  {s.label}
                </span>
                <span className="font-mono">{data[hover][s.key]}</span>
              </div>
            ))}
            <div className="mt-1 border-t border-white/10 pt-1 text-emerald-50/60">Total {totales[hover]}</div>
          </Tooltip>
        )}
      </div>
    </ChartFrame>
  );
}

/* =======================================================================
   2. Mapa de calor — agenda semanal 52 × 7
   ======================================================================= */
export function HeatmapAgenda({ celdas, dias }: { celdas: { semana: number; dia: number; valor: number }[]; dias: string[] }) {
  const [hover, setHover] = useState<{ semana: number; dia: number; valor: number } | null>(null);
  const [semanaSel, setSemanaSel] = useState<number | null>(null);
  const max = Math.max(...celdas.map((c) => c.valor));
  const totalSemana = (s: number) => celdas.filter((c) => c.semana === s).reduce((a, c) => a + c.valor, 0);
  const maxSemana = Math.max(...Array.from({ length: 52 }, (_, i) => totalSemana(i + 1)));

  return (
    <ChartFrame
      titulo="Mapa de calor · intensidad de agenda"
      subtitulo="52 semanas × 7 días · cada celda es la carga de actividad programada"
      acciones={<LeyendaCalor etiquetas={["sin actividad", "máxima"]} />}
    >
      <div className="relative overflow-x-auto">
        <div className="flex gap-2">
          <div className="flex flex-col justify-between py-[1px] font-mono text-[9px] text-emerald-50/35">
            {dias.map((d) => (
              <span key={d} className="leading-[13px]">{d}</span>
            ))}
          </div>
          <div className="flex flex-col gap-[2px]">
            {Array.from({ length: 52 }, (_, s) => (
              <div key={s} className="flex gap-[2px]">
                {dias.map((_, d) => {
                  const celda = celdas.find((c) => c.semana === s + 1 && c.dia === d)!;
                  const sel = semanaSel === s + 1;
                  return (
                    <button
                      key={d}
                      onMouseEnter={() => setHover(celda)}
                      onMouseLeave={() => setHover(null)}
                      onClick={() => setSemanaSel(sel ? null : s + 1)}
                      className={cx(
                        "h-[11px] w-[11px] rounded-[3px] transition-transform duration-200 hover:scale-[1.45]",
                        sel && "ring-1 ring-lima-300",
                      )}
                      style={{ background: escalaCalor(celda.valor / max), boxShadow: celda.valor / max > 0.75 ? "0 0 8px rgba(163,230,53,0.45)" : "none" }}
                      aria-label={`Semana ${s + 1}, ${dias[d]}: ${celda.valor}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] text-emerald-50/45">
          <span>S1 ─────────────── S26 ─────────────── S52</span>
          <span className="text-lima-300/80">{semanaSel ? `Semana ${semanaSel} seleccionada · ${totalSemana(semanaSel)} puntos` : "Clic en una semana para fijarla"}</span>
        </div>
        {hover && (
          <Tooltip x="50%" y="0">
            <div className="font-semibold text-lima-300">
              Semana {hover.semana} · {dias[hover.dia]}
            </div>
            <div className="text-emerald-50/80">Intensidad {hover.valor}</div>
            <div className="text-emerald-50/50">Semana total: {totalSemana(hover.semana)} / {maxSemana}</div>
          </Tooltip>
        )}
      </div>
      {semanaSel && (
        <div className="mt-4 rounded-xl border border-lima-500/25 bg-lima-500/5 p-3 text-xs text-emerald-50/70">
          <span className="font-semibold text-lima-300">Semana {semanaSel}:</span> {dias.map((d, i) => `${d} ${celdas.find((c) => c.semana === semanaSel && c.dia === i)!.valor}`).join(" · ")}
        </div>
      )}
    </ChartFrame>
  );
}

/* =======================================================================
   3. Matriz de correlación
   ======================================================================= */
export function MatrizCorr({ filas }: { filas: { fila: string; valores: number[] }[] }) {
  const [hover, setHover] = useState<{ i: number; j: number; v: number } | null>(null);
  const cortos = filas.map((f) => f.fila.split(" ")[0]);
  const color = (v: number) => (v >= 0 ? escalaCalor(0.45 + v * 0.55) : `rgba(251,113,133,${Math.min(0.95, 0.25 + Math.abs(v) * 0.8)})`);
  return (
    <ChartFrame titulo="Matriz de correlación" subtitulo="Pearson entre variables numéricas · verde = positiva, rosa = negativa">
      <div className="relative">
        <div className="overflow-x-auto">
          <table className="border-separate border-spacing-[3px]">
            <thead>
              <tr>
                <th />
                {filas.map((_f, j) => (
                  <th key={j} className="px-1 pb-1 text-[10px] font-normal text-emerald-50/45">{cortos[j]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filas.map((f, i) => (
                <tr key={i}>
                  <td className="pr-2 text-right text-[10px] text-emerald-50/45">{f.fila}</td>
                  {f.valores.map((v, j) => (
                    <td key={j}>
                      <button
                        onMouseEnter={() => setHover({ i, j, v })}
                        onMouseLeave={() => setHover(null)}
                        className="grid h-9 w-11 place-items-center rounded-md font-mono text-[10px] font-semibold text-ink-950/85 transition-transform duration-200 hover:scale-110"
                        style={{ background: color(v), opacity: i === j ? 0.9 : 1 }}
                      >
                        {v.toFixed(2)}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {hover && (
          <div className="mt-3 text-xs text-emerald-50/70">
            <span className="text-lima-300">{filas[hover.i].fila}</span> ↔ <span className="text-lima-300">{filas[hover.j].fila}</span>:{" "}
            <span className="font-mono">{hover.v.toFixed(2)}</span> —{" "}
            {Math.abs(hover.v) > 0.7 ? "asociación fuerte" : Math.abs(hover.v) > 0.4 ? "asociación moderada" : "asociación débil"}
          </div>
        )}
      </div>
    </ChartFrame>
  );
}

/* =======================================================================
   4. Histograma + boxplot por categoría
   ======================================================================= */
export function Histograma({ bins, titulo, unidad }: { bins: { label: string; conteo: number }[]; titulo: string; unidad: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...bins.map((b) => b.conteo), 1);
  return (
    <ChartFrame titulo={titulo} subtitulo={`Distribución de frecuencias · ${unidad}`}>
      <div className="relative flex h-44 items-end gap-1.5">
        {bins.map((b, i) => (
          <button
            key={b.label}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className="group flex h-full flex-1 flex-col justify-end"
          >
            <span className="mb-1 text-center font-mono text-[10px] text-emerald-50/60">{b.conteo}</span>
            <span
              className="w-full rounded-t-md bg-gradient-to-t from-verde-500/70 to-lima-400 transition-all duration-700 group-hover:from-lima-400 group-hover:to-lima-300"
              style={{ height: `${(b.conteo / max) * 100}%`, transformOrigin: "bottom" }}
            />
            <span className="mt-2 text-center font-mono text-[9px] text-emerald-50/40">{b.label}</span>
          </button>
        ))}
        {hover !== null && <Tooltip x={`${((hover + 0.5) / bins.length) * 100}%`} y="10%"><div className="font-semibold text-lima-300">{bins[hover].label} {unidad}</div><div className="text-emerald-50/80">{bins[hover].conteo} registros</div></Tooltip>}
      </div>
    </ChartFrame>
  );
}

export function BoxPlotPorTipo({
  grupos,
}: {
  grupos: { label: string; min: number; q1: number; mediana: number; q3: number; max: number; media: number }[];
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...grupos.map((g) => g.max));
  const W = 700;
  const H = 230;
  const pad = { l: 40, r: 14, t: 16, b: 30 };
  const y = (v: number) => H - pad.b - (v * (H - pad.t - pad.b)) / max;
  const bw = (W - pad.l - pad.r) / grupos.length;

  return (
    <ChartFrame titulo="Dispersión por tipo de consulta" subtitulo="Peso de flor (g): caja = Q1–Q3, línea = mediana, bigote = min–max">
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Diagrama de cajas por tipo de consulta">
          {[0.25, 0.5, 0.75, 1].map((g) => (
            <line key={g} x1={pad.l} x2={W - pad.r} y1={y(max * g)} y2={y(max * g)} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 5" />
          ))}
          {grupos.map((g, i) => {
            const xc = pad.l + bw * i + bw / 2;
            return (
              <g key={g.label} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className="cursor-pointer">
                <rect x={pad.l + bw * i} y={pad.t} width={bw} height={H - pad.t - pad.b} fill="transparent" />
                <line x1={xc} x2={xc} y1={y(g.max)} y2={y(g.q3)} stroke="rgba(163,230,53,0.55)" strokeWidth="1.2" />
                <line x1={xc} x2={xc} y1={y(g.q1)} y2={y(g.min)} stroke="rgba(163,230,53,0.55)" strokeWidth="1.2" />
                <line x1={xc - 12} x2={xc + 12} y1={y(g.max)} y2={y(g.max)} stroke="rgba(163,230,53,0.55)" strokeWidth="1.2" />
                <line x1={xc - 12} x2={xc + 12} y1={y(g.min)} y2={y(g.min)} stroke="rgba(163,230,53,0.55)" strokeWidth="1.2" />
                <rect
                  x={xc - 22}
                  y={y(g.q3)}
                  width={44}
                  height={Math.max(2, y(g.q1) - y(g.q3))}
                  rx={5}
                  fill={hover === i ? "rgba(163,230,53,0.42)" : "rgba(52,211,153,0.22)"}
                  stroke="rgba(163,230,53,0.6)"
                  className="transition-all duration-300"
                />
                <line x1={xc - 22} x2={xc + 22} y1={y(g.mediana)} y2={y(g.mediana)} stroke="#bef264" strokeWidth="2.4" />
                <circle cx={xc} cy={y(g.media)} r={3} fill="#22d3ee" />
                <text x={xc} y={H - 10} textAnchor="middle" className="fill-emerald-50/50 text-[9px]">{g.label}</text>
              </g>
            );
          })}
        </svg>
        {hover !== null && (
          <Tooltip x="50%" y="4%">
            <div className="font-semibold text-lima-300">{grupos[hover].label}</div>
            <div className="text-emerald-50/80">Mediana {grupos[hover].mediana} g · Media {grupos[hover].media} g</div>
            <div className="text-emerald-50/60">Q1 {grupos[hover].q1} · Q3 {grupos[hover].q3} · Rango {grupos[hover].min}–{grupos[hover].max}</div>
          </Tooltip>
        )}
      </div>
    </ChartFrame>
  );
}

/* =======================================================================
   5. Radar + barras radiales
   ======================================================================= */
export function Radar({ ejes }: { ejes: { eje: string; valor: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const size = 300;
  const c = size / 2;
  const r = size / 2 - 42;
  const pt = (i: number, v: number) => {
    const ang = (Math.PI * 2 * i) / ejes.length - Math.PI / 2;
    return [c + Math.cos(ang) * r * (v / 100), c + Math.sin(ang) * r * (v / 100)];
  };
  const poly = ejes.map((e, i) => pt(i, e.valor).join(",")).join(" ");
  return (
    <ChartFrame titulo="Radar de capacidades institucionales" subtitulo="Perfil cualitativo de la asociación (autoevaluación)">
      <div className="relative flex justify-center">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[300px]" role="img" aria-label="Gráfico radar de capacidades">
          <defs>
            <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a3e635" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          {[25, 50, 75, 100].map((g) => (
            <polygon key={g} points={ejes.map((_, i) => pt(i, g).join(",")).join(" ")} fill="none" stroke="rgba(255,255,255,0.08)" />
          ))}
          {ejes.map((e, i) => (
            <line key={e.eje} x1={c} y1={c} x2={pt(i, 100)[0]} y2={pt(i, 100)[1]} stroke="rgba(255,255,255,0.08)" />
          ))}
          <polygon points={poly} fill="url(#radarFill)" stroke="#bef264" strokeWidth="1.8" className="transition-all duration-700" />
          {ejes.map((e, i) => {
            const [x, y] = pt(i, e.valor);
            return (
              <g key={e.eje} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                <circle cx={x} cy={y} r={hover === i ? 6 : 4} fill="#bef264" className="transition-all" />
                <text x={pt(i, 122)[0]} y={pt(i, 122)[1]} textAnchor="middle" dominantBaseline="middle" className="fill-emerald-50/60 text-[9px]">{e.eje}</text>
              </g>
            );
          })}
        </svg>
        {hover !== null && <Tooltip x="50%" y="2%"><div className="font-semibold text-lima-300">{ejes[hover].eje}</div><div className="text-emerald-50/80">{ejes[hover].valor} / 100</div></Tooltip>}
      </div>
    </ChartFrame>
  );
}

/* =======================================================================
   6. Gradiente de peso — scatter interactivo
   ======================================================================= */
export function GradientePeso({
  puntos,
  genotipos,
}: {
  puntos: { id: number; genotipo: string; ambiente: string; semana: number; peso: number; thc: number; area: number }[];
  genotipos: string[];
}) {
  const [ambientes, setAmbientes] = useState<string[]>(["Interior", "Exterior", "Invernadero"]);
  const [gen, setGen] = useState<string>("Todos");
  const [hover, setHover] = useState<number | null>(null);
  const [rangoThc, setRangoThc] = useState(30);

  const filtrados = puntos.filter((p) => ambientes.includes(p.ambiente) && (gen === "Todos" || p.genotipo === gen) && p.thc <= rangoThc);
  const maxPeso = Math.max(...puntos.map((p) => p.peso));
  const W = 720;
  const H = 320;
  const pad = { l: 42, r: 16, t: 16, b: 34 };
  const x = (thc: number) => pad.l + (thc / 30) * (W - pad.l - pad.r);
  const y = (peso: number) => H - pad.b - (peso / maxPeso) * (H - pad.t - pad.b);
  const simboloAmbiente: Record<string, string> = { Interior: "M0,-7 L6,4 L-6,4 Z", Exterior: "M0,-7 L7,0 L0,7 L-7,0 Z", Invernadero: "M-6,-6 L6,-6 L6,6 L-6,6 Z" };

  return (
    <ChartFrame
      titulo="Gradiente de peso · rendimiento por genotipo"
      subtitulo="Eje X: % THC · Eje Y: gramos de flor seca por planta · color = peso · forma = ambiente"
      acciones={
        <div className="flex flex-wrap items-center gap-2">
          {["Interior", "Exterior", "Invernadero"].map((a) => (
            <button
              key={a}
              onClick={() => setAmbientes((s) => (s.includes(a) ? s.filter((v) => v !== a) : [...s, a]))}
              className={cx("rounded-full border px-2.5 py-1 text-[11px] transition", ambientes.includes(a) ? "border-lima-500/50 bg-lima-500/12 text-lima-200" : "border-white/10 text-emerald-50/40")}
            >
              {a}
            </button>
          ))}
        </div>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {["Todos", ...genotipos].map((g) => (
            <button
              key={g}
              onClick={() => setGen(g)}
              className={cx("rounded-lg border px-2.5 py-1 font-mono text-[11px] transition", gen === g ? "border-cian-400/60 bg-cian-400/15 text-cian-400" : "border-white/10 text-emerald-50/50 hover:text-white")}
            >
              {g}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 font-mono text-[11px] text-emerald-50/55">
          THC máx.
          <input type="range" min={5} max={30} value={rangoThc} onChange={(e) => setRangoThc(Number(e.target.value))} className="h-1 w-28 accent-lima-400" />
          <span className="text-lima-300">{rangoThc}%</span>
        </label>
      </div>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Scatter de gradiente de peso">
          <defs>
            <linearGradient id="barraPeso" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#0c1e18" />
              <stop offset="35%" stopColor="#107a4e" />
              <stop offset="70%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>
          </defs>
          {[0, 0.25, 0.5, 0.75, 1].map((g) => (
            <g key={g}>
              <line x1={pad.l} x2={W - pad.r} y1={H - pad.b - g * (H - pad.t - pad.b)} y2={H - pad.b - g * (H - pad.t - pad.b)} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 5" />
              <text x={pad.l - 6} y={H - pad.b - g * (H - pad.t - pad.b) + 3} textAnchor="end" className="fill-emerald-50/35 text-[9px]">{Math.round(maxPeso * g)}</text>
            </g>
          ))}
          {[0, 10, 20, 30].map((t) => (
            <text key={t} x={x(t)} y={H - 12} textAnchor="middle" className="fill-emerald-50/35 text-[9px]">{t}%</text>
          ))}
          {filtrados.map((p) => (
            <path
              key={p.id}
              d={simboloAmbiente[p.ambiente]}
              transform={`translate(${x(p.thc)},${y(p.peso)}) scale(${hover === p.id ? 1.9 : 1})`}
              fill={escalaCalor(p.peso / maxPeso)}
              opacity={hover === null || hover === p.id ? 0.95 : 0.35}
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setHover(p.id)}
              onMouseLeave={() => setHover(null)}
            />
          ))}
          <g transform={`translate(${W - 40},${pad.t})`}>
            <rect width={12} height={150} rx={6} fill="url(#barraPeso)" />
            <text x={6} y={-6} textAnchor="middle" className="fill-emerald-50/50 text-[9px]">peso</text>
          </g>
        </svg>
        {hover !== null && (
          <Tooltip x={`${(x(filtrados.find((p) => p.id === hover)!.thc) / W) * 100}%`} y={`${(y(filtrados.find((p) => p.id === hover)!.peso) / H) * 100}%`}>
            <div className="font-semibold text-lima-300">{filtrados.find((p) => p.id === hover)!.genotipo} · {filtrados.find((p) => p.id === hover)!.ambiente}</div>
            <div className="text-emerald-50/80">Peso {filtrados.find((p) => p.id === hover)!.peso} g</div>
            <div className="text-emerald-50/60">THC {filtrados.find((p) => p.id === hover)!.thc}% · {filtrados.find((p) => p.id === hover)!.area} m²</div>
          </Tooltip>
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-emerald-50/50">
        <span className="flex flex-wrap items-center gap-3">
          {Object.entries(simboloAmbiente).map(([k, d]) => (
            <span key={k} className="flex items-center gap-1.5">
              <svg viewBox="-8 -8 16 16" className="h-3 w-3 fill-lima-300"><path d={d} /></svg>
              {k}
            </span>
          ))}
        </span>
        <span className="font-mono text-lima-300/80">{filtrados.length} puntos visibles</span>
      </div>
    </ChartFrame>
  );
}

/* =======================================================================
   7. Grafo de organizaciones
   ======================================================================= */
export function GrafoOrganizaciones({
  nodos,
  onSelect,
  seleccionado,
}: {
  nodos: { id: string; nombre: string; sigla: string; ambito: string; facc: boolean }[];
  onSelect: (id: string | null) => void;
  seleccionado: string | null;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const W = 720;
  const H = 420;
  const centro = { x: W / 2, y: H / 2 };
  const colores: Record<string, string> = { Local: "#22d3ee", Provincial: "#a3e635", Nacional: "#34d399", Internacional: "#a78bfa" };

  const layout = useMemo(() => {
    const anillos: Record<string, number> = { Local: 1, Provincial: 2, Nacional: 3, Internacional: 3 };
    const porAnillo: Record<number, typeof nodos> = {};
    nodos.forEach((n) => {
      const a = anillos[n.ambito] ?? 2;
      (porAnillo[a] ||= []).push(n);
    });
    const out: Record<string, { x: number; y: number; r: number }> = {};
    Object.entries(porAnillo).forEach(([a, lista]) => {
      const radio = 70 + Number(a) * 52;
      lista.forEach((n, i) => {
        const ang = (Math.PI * 2 * i) / lista.length + Number(a) * 0.4;
        out[n.id] = { x: centro.x + Math.cos(ang) * radio, y: centro.y + Math.sin(ang) * radio * 0.82, r: n.facc ? 13 : 9 };
      });
    });
    return out;
  }, [nodos]);

  const activo = hover ?? seleccionado;

  return (
    <ChartFrame
      titulo="Red de organizaciones cannábicas"
      subtitulo="Nodo central: ACCA · anillos por alcance · verde lima = miembro FACC"
      acciones={
        <div className="flex flex-wrap gap-2 font-mono text-[10px]">
          {Object.entries(colores).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1.5 text-emerald-50/55">
              <span className="h-2 w-2 rounded-full" style={{ background: v }} />
              {k}
            </span>
          ))}
        </div>
      }
    >
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Grafo de organizaciones cannábicas">
          <defs>
            <radialGradient id="glowCentro">
              <stop offset="0%" stopColor="#a3e635" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#a3e635" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={centro.x} cy={centro.y} r={110} fill="url(#glowCentro)" className="anim-pulse" />
          {nodos.map((n) => {
            const p = layout[n.id];
            const esCentral = n.id === "acca";
            if (esCentral) return null;
            const resaltado = activo === n.id;
            return (
              <line
                key={`l-${n.id}`}
                x1={centro.x}
                y1={centro.y}
                x2={p.x}
                y2={p.y}
                stroke={resaltado ? "rgba(163,230,53,0.85)" : "rgba(255,255,255,0.10)"}
                strokeWidth={resaltado ? 1.8 : 1}
                strokeDasharray="4 6"
                style={{ animation: "dash 30s linear infinite" }}
              />
            );
          })}
          {nodos.map((n) => {
            const p = layout[n.id];
            const esCentral = n.id === "acca";
            const color = esCentral ? "#bef264" : colores[n.ambito] ?? "#a3e635";
            return (
              <g
                key={n.id}
                transform={`translate(${p.x},${p.y})`}
                className="cursor-pointer"
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => onSelect(seleccionado === n.id ? null : n.id)}
              >
                {esCentral && <circle r={p.r + 8} fill="none" stroke="rgba(163,230,53,0.4)" style={{ animation: "pulse-ring 3s ease-out infinite", transformOrigin: "center" }} />}
                <circle r={p.r + (activo === n.id ? 6 : 0)} fill={color} opacity={activo && activo !== n.id ? 0.35 : 0.9} className="transition-all duration-300" />
                <text y={p.r + 16} textAnchor="middle" className="fill-emerald-50/70 text-[9px]">{n.sigla}</text>
              </g>
            );
          })}
          <g transform={`translate(${centro.x},${centro.y})`}>
            <text textAnchor="middle" y={4} className="fill-ink-950 text-[11px] font-bold">ACCA</text>
          </g>
        </svg>
      </div>
    </ChartFrame>
  );
}

/* =======================================================================
   8. Mapa de calor geográfico
   ======================================================================= */
export function MapaCalorGeo({
  puntos,
}: {
  puntos: { provincia: string; x: number; y: number; intensidad: number; organizaciones: number }[];
}) {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <ChartFrame
      titulo="Mapa de calor territorial"
      subtitulo="Intensidad de presencia organizativa por provincia (esquema estilizado, no geodesia)"
      acciones={<LeyendaCalor etiquetas={["baja", "alta"]} />}
    >
      <div className="relative">
        <svg viewBox="0 0 100 112" className="w-full max-w-[420px]" role="img" aria-label="Mapa de calor de presencia por provincia">
          <path
            d="M14 22 L24 13 L36 11 L48 15 L62 13 L74 23 L81 33 L77 42 L70 45 L66 52 L62 61 L58 70 L54 80 L50 89 L46 97 L42 101 L38 96 L36 88 L32 80 L28 72 L24 64 L20 54 L16 44 L12 34 Z"
            fill="rgba(255,255,255,0.04)"
            stroke="rgba(163,230,53,0.35)"
            strokeWidth="0.6"
          />
          <path d="M44 103 L48 99 L52 103 L48 107 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(163,230,53,0.25)" strokeWidth="0.4" />
          {puntos.map((p) => {
            const r = 3 + p.intensidad * 7;
            const color = escalaCalor(p.intensidad);
            const act = hover === p.provincia;
            return (
              <g
                key={p.provincia}
                transform={`translate(${p.x},${p.y})`}
                onMouseEnter={() => setHover(p.provincia)}
                onMouseLeave={() => setHover(null)}
                className="cursor-pointer"
              >
                <circle r={r + (act ? 3 : 0)} fill={color} opacity={0.28 + p.intensidad * 0.5} className="transition-all duration-300" />
                <circle r={Math.max(1, r * 0.32)} fill="#04070a" />
                {act && (
                  <text y={-r - 2} textAnchor="middle" className="fill-lima-300 text-[3.4px] font-semibold">
                    {p.provincia}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        {hover && (
          <Tooltip x="50%" y="4%">
            <div className="font-semibold text-lima-300">{hover}</div>
            <div className="text-emerald-50/80">{puntos.find((p) => p.provincia === hover)!.organizaciones} organizaciones relevadas</div>
            <div className="text-emerald-50/60">Intensidad {Math.round(puntos.find((p) => p.provincia === hover)!.intensidad * 100)}%</div>
          </Tooltip>
        )}
      </div>
    </ChartFrame>
  );
}

/* =======================================================================
   9. Barras horizontales categóricas
   ======================================================================= */
export function BarrasCategorias({
  datos,
  titulo,
  subtitulo,
  color = "#a3e635",
}: {
  datos: { label: string; valor: number }[];
  titulo: string;
  subtitulo?: string;
  color?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...datos.map((d) => d.valor), 1);
  const total = datos.reduce((a, d) => a + d.valor, 0);
  return (
    <ChartFrame titulo={titulo} subtitulo={subtitulo}>
      <div className="relative space-y-2.5">
        {datos.map((d, i) => (
          <div
            key={d.label}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className="group grid grid-cols-[110px_1fr_46px] items-center gap-3"
          >
            <span className="truncate text-xs text-emerald-50/70">{d.label}</span>
            <div className="h-3.5 overflow-hidden rounded-full bg-white/6">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(d.valor / max) * 100}%`,
                  background: `linear-gradient(90deg, ${color}55, ${color})`,
                  boxShadow: hover === i ? `0 0 18px ${color}` : "none",
                }}
              />
            </div>
            <span className="text-right font-mono text-[11px] text-emerald-50/60">{Math.round((d.valor / total) * 100)}%</span>
          </div>
        ))}
        {hover !== null && <Tooltip x="60%" y="4%"><div className="font-semibold text-lima-300">{datos[hover].label}</div><div className="text-emerald-50/80">{datos[hover].valor} registros</div></Tooltip>}
      </div>
    </ChartFrame>
  );
}

/* =======================================================================
   10. Donut de destino de fondos
   ======================================================================= */
export function DonutDestino({ datos }: { datos: { titulo: string; pct: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const total = datos.reduce((a, d) => a + d.pct, 0);
  let acumulado = 0;
  const R = 70;
  const C = 2 * Math.PI * R;
  const colores = ["#bef264", "#a3e635", "#34d399", "#22d3ee", "#a78bfa"];
  return (
    <ChartFrame titulo="Destino de los fondos" subtitulo="Estructura propuesta · a validar por la Comisión Directiva">
      <div className="flex flex-col items-center gap-5 sm:flex-row">
        <div className="relative">
          <svg viewBox="0 0 200 200" className="h-44 w-44 -rotate-90">
            {datos.map((d, i) => {
              const frac = d.pct / total;
              const dash = frac * C;
              const offset = acumulado * C;
              acumulado += frac;
              return (
                <circle
                  key={d.titulo}
                  cx="100"
                  cy="100"
                  r={R}
                  fill="none"
                  stroke={colores[i % colores.length]}
                  strokeWidth={hover === i ? 26 : 18}
                  strokeDasharray={`${dash - 2} ${C - dash + 2}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                  className="cursor-pointer transition-all duration-500"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                />
              );
            })}
          </svg>
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <div>
              <div className="font-mono text-2xl font-bold text-lima-300">{hover !== null ? `${datos[hover].pct}%` : "100%"}</div>
              <div className="max-w-[92px] text-[10px] leading-tight text-emerald-50/60">{hover !== null ? datos[hover].titulo : "del total donado"}</div>
            </div>
          </div>
        </div>
        <ul className="flex-1 space-y-2">
          {datos.map((d, i) => (
            <li
              key={d.titulo}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className={`cursor-pointer rounded-lg border px-3 py-2 transition ${hover === i ? "border-lima-500/40 bg-lima-500/8" : "border-white/8"}`}
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="flex items-center gap-2 text-emerald-50/80">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: colores[i % colores.length] }} />
                  {d.titulo}
                </span>
                <span className="font-mono text-lima-300">{d.pct}%</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </ChartFrame>
  );
}

/* =======================================================================
   11. Línea de tiempo (timeline)
   ======================================================================= */
export function Timeline({
  hitos,
  onSelect,
  seleccionado,
}: {
  hitos: { anio: string; titulo: string; texto: string }[];
  onSelect?: (i: number) => void;
  seleccionado?: number;
}) {
  return (
    <div className="relative">
      <div className="absolute left-[19px] top-2 hidden h-[calc(100%-1rem)] w-px bg-gradient-to-b from-lima-400/70 via-verde-400/40 to-transparent sm:block" />
      <ol className="space-y-4">
        {hitos.map((h, i) => (
          <li key={h.anio}>
            <button
              onClick={() => onSelect?.(seleccionado === i ? -1 : i)}
              className={`group flex w-full gap-4 rounded-2xl border p-4 text-left transition-all duration-400 ${
                seleccionado === i ? "border-lima-500/45 bg-lima-500/8" : "border-white/8 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-lima-500/40 bg-ink-900 font-mono text-[11px] font-bold text-lima-300">
                {h.anio.slice(2)}
              </span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] text-lima-400/80">{h.anio}</span>
                  <span className="text-sm font-semibold text-white">{h.titulo}</span>
                </span>
                <span className={`mt-1 block text-xs leading-relaxed text-emerald-50/60 ${seleccionado === i ? "" : "line-clamp-2"}`}>{h.texto}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
