import { useMemo, useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from "recharts";
import { Database, HeartPulse, Scale, ShieldCheck, Sparkles } from "lucide-react";
import { Card, SectionHeader, Badge, CHART_TOOLTIP, FadeIn, ProgressBar } from "./ui";
import {
  Dist, FRECUENCIA, CANTIDAD, ANTIGUEDAD, FORMAS, MOTIVOS, PATRON_MOTIVO, INTENSIDAD, ACCESO,
  GEOGRAFIA, GENERO, EDUCACION, EFECTOS, MULTI_DIST, SALUD, SALUD_STATS, POLICIAL, CALIDAD, REGULACION, EDAD_BINS, fmt, META,
} from "../data/research";
import { cn } from "../utils/cn";

interface Dataset { id: string; titulo: string; seccion: string; validos: number; multiple?: boolean; data: Dist[]; nota: string }
const DATASETS: Dataset[] = [
  { id: "genero", titulo: "Género", seccion: "4.1.2", validos: 1041, data: GENERO, nota: "Predominio masculino (61,5%), seguido de femenino (37,6%) y otras identidades (1,0%)." },
  { id: "educacion", titulo: "Nivel educativo", seccion: "4.1.3", validos: 1037, data: EDUCACION, nota: "El 53,3% tiene formación superior a la secundaria; el perfil educativo es coherente con la autoselección online." },
  { id: "frec", titulo: "Frecuencia de consumo", seccion: "4.2.4", validos: 1036, data: FRECUENCIA, nota: "El 80,0% consume al menos varios días por semana: muestra de usuarios activos, no experimentales." },
  { id: "cant", titulo: "Cantidad por ocasión", seccion: "4.2.5", validos: 1001, data: CANTIDAD, nota: "Predominio de consumos moderados (≤1 cigarrillo: 54,2%). Sin concentración en consumos extremos." },
  { id: "antig", titulo: "Antigüedad del consumo", seccion: "4.2.7", validos: 1040, data: ANTIGUEDAD, nota: "Mayoría con experiencia consolidada: 74,7% supera los 2 años de consumo." },
  { id: "formas", titulo: "Formas de consumo", seccion: "4.2.6", validos: 1039, multiple: true, data: FORMAS, nota: "La vía inhalada domina (90,9%); vaporización y gotas suman vías no fumadas relevantes (~28%)." },
  { id: "motivos", titulo: "Motivos de consumo", seccion: "4.2.1", validos: 1036, multiple: true, data: MOTIVOS, nota: "El disfrute (86,1%) y lo terapéutico (44,9%) coexisten; transgresión e imitación son marginales." },
  { id: "patron", titulo: "Patrón de motivo (excluyente)", seccion: "4.2.1", validos: 1036, data: PATRON_MOTIVO, nota: "Uso mixto recreativo-terapéutico en ~37% al sumar disfrute+terapéutico y combinaciones." },
  { id: "intens", titulo: "Autopercepción de intensidad", seccion: "4.2.8", validos: 1013, data: INTENSIDAD, nota: "67,3% se autopercibe moderado; solo 3,7% se declara en uso abusivo." },
  { id: "acceso", titulo: "Vías de acceso", seccion: "4.2.3", validos: 1041, multiple: true, data: ACCESO, nota: "65,2% cultiva. Entre quienes compran (n=658), 60,2% desconoce la procedencia del producto." },
  { id: "geo", titulo: "Distribución geográfica", seccion: "4.1.4", validos: 933, data: GEOGRAFIA, nota: "Concentración en AMBA (59,8%): limita la comparación regional; 72,8% reside en Argentina." },
  { id: "reg", titulo: "Posición sobre regulación", seccion: "4.6", validos: 1040, data: REGULACION, nota: "Consenso amplio: 99,6% apoya alguna forma de legalización, despenalización o regulación." },
];

export default function Eda() {
  const [dsId, setDsId] = useState("genero");
  const ds = DATASETS.find((d) => d.id === dsId)!;
  const chartData = useMemo(() => ds.data.map((d) => ({ name: d.categoria, pct: d.pct, n: d.n })), [ds]);
  const coberturaGeo = useMemo(() => [
    { zona: "Ubicación normalizada", casos: 933 },
    { zona: "Sin ubicación normalizada", casos: META.n - 933 },
  ], []);
  const positivos = EFECTOS.filter((e) => e.pct >= 4.7);
  const negativos = EFECTOS.filter((e) => e.pct < 4.7);

  return (
    <div>
      <SectionHeader
        eyebrow="Exploratory Data Analysis · 4"
        title="Análisis exploratorio de resultados descriptivos"
        desc="Frecuencias y porcentajes sobre casos válidos por variable (sin imputación). Explora cada dimensión del cuestionario: la tasa de faltantes varía de <1% en sociodemográficas a ~54% en ítems de subgrupos terapéuticos."
        right={<Badge tone="sky"><Database size={12} /> n total = {META.n.toLocaleString("es-ES")}</Badge>}
      />

      <FadeIn>
        <Card className="mb-4 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-semibold text-zinc-100">Distribución etaria de la muestra</h3>
              <p className="text-xs text-zinc-500">Intervalos quinquenales modelados desde media 31,1 y DE 10,8 (n válido = 1.040) · concentración 20–35 años</p>
            </div>
            <Badge tone="sky">4.1.1</Badge>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={EDAD_BINS} margin={{ top: 6, right: 6, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="rango" axisLine={false} tickLine={false} tick={{ fontSize: 10.5 }} />
                <YAxis axisLine={false} tickLine={false} unit="%" />
                <Tooltip {...CHART_TOOLTIP} formatter={(v: any) => [`${fmt(Number(v), 1)}%`, "Participantes"]} />
                <Bar dataKey="pct" radius={[6, 6, 0, 0]} maxBarSize={46} isAnimationActive={false}>
                  {EDAD_BINS.map((b) => (
                    <Cell key={b.rango} fill="#34d399" fillOpacity={["20–24", "25–29", "30–34"].includes(b.rango) ? 0.95 : 0.4} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2 text-center">
            {[["Media", "31,1"], ["Mediana", "29"], ["DE", "10,8"], ["Rango", "13–80"]].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-white/[0.05] bg-white/[0.02] py-2">
                <p className="font-mono text-sm font-bold text-zinc-50">{v}</p>
                <p className="text-[9.5px] uppercase tracking-wide text-zinc-500">{k}</p>
              </div>
            ))}
          </div>
        </Card>
      </FadeIn>

      <FadeIn delay={0.04}>
        <Card className="mb-4 p-5">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-base font-semibold text-zinc-100">Distribución geográfica</h3>
              <p className="mt-1 max-w-3xl text-xs leading-relaxed text-zinc-500">
                El AMBA concentra el 59,8% de la muestra. La cobertura se apoya en 933 casos con país o provincia normalizados;
                los restantes no cuentan con una ubicación identificable dentro de las categorías regionales.
              </p>
            </div>
            <Badge tone="sky">4.1.4 · n = {META.n.toLocaleString("es-ES")}</Badge>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <div>
              <p className="mb-2 text-center text-[11px] font-medium text-zinc-400">Distribución regional de los casos identificados</p>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={GEOGRAFIA} layout="vertical" margin={{ top: 2, right: 46, left: 8, bottom: 0 }}>
                    <CartesianGrid horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} unit="%" />
                    <YAxis type="category" dataKey="categoria" axisLine={false} tickLine={false} width={122} tick={{ fontSize: 11 }} />
                    <Tooltip {...CHART_TOOLTIP} formatter={(v: any) => [`${fmt(Number(v), 1)}%`, "Casos"]} />
                    <Bar dataKey="pct" radius={[0, 6, 6, 0]} maxBarSize={24} isAnimationActive={false}>
                      {GEOGRAFIA.map((g, i) => (
                        <Cell key={g.categoria} fill={["#2563eb", "#22c55e", "#f59e0b", "#0ea5e9", "#f97316", "#64748b"][i]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <p className="mb-2 text-center text-[11px] font-medium text-zinc-400">Completitud geográfica</p>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={coberturaGeo} margin={{ top: 14, right: 12, left: -12, bottom: 46 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="zona" axisLine={false} tickLine={false} interval={0} tick={{ fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <Tooltip {...CHART_TOOLTIP} formatter={(v: any) => [`${Number(v).toLocaleString("es-ES")} registros`, "Cantidad"]} />
                    <Bar dataKey="casos" radius={[6, 6, 0, 0]} maxBarSize={64} isAnimationActive={false}>
                      <Cell fill="#22c55e" />
                      <Cell fill="#f59e0b" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Card>
      </FadeIn>

      <div className="grid gap-4 xl:grid-cols-3">
        <FadeIn className="xl:col-span-2">
          <Card className="p-5">
            <div className="mb-4 flex flex-wrap gap-1.5">
              {DATASETS.map((d) => (
                <button key={d.id} onClick={() => setDsId(d.id)}
                  className={cn("rounded-lg px-2.5 py-1.5 text-xs font-medium transition",
                    dsId === d.id ? "bg-emerald-400 text-emerald-950" : "bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-200")}>
                  {d.titulo}
                </button>
              ))}
            </div>
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-base font-semibold text-zinc-100">{ds.titulo}</h3>
              <span className="font-mono text-[11px] text-zinc-500">{ds.seccion} · válidos n={ds.validos.toLocaleString("es-ES")}{ds.multiple ? " · respuesta múltiple" : ""}</span>
            </div>
            <div className="h-[264px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 2, right: 34, left: 8, bottom: 0 }}>
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} unit="%" />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={150} tick={{ fontSize: 11 }} />
                  <Tooltip {...CHART_TOOLTIP} formatter={(v: any, _n: any, item: any) => [`${fmt(Number(v), 1)}%${item?.payload?.n ? ` · n=${item.payload.n}` : ""}`, "Participantes"]} />
                  <Bar dataKey="pct" radius={[0, 6, 6, 0]} maxBarSize={22} isAnimationActive={false}>
                    {chartData.map((c, i) => (
                      <Cell key={c.name} fill={i === 0 ? "#34d399" : "#2dd4bf"} fillOpacity={1 - i * 0.09} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] p-3 text-xs leading-relaxed text-emerald-100/80">{ds.nota}</p>
          </Card>
        </FadeIn>

        <FadeIn delay={0.08}>
          <Card className="p-5">
            <div className="mb-1 flex items-center gap-2">
              <Database size={16} className="text-emerald-300" />
              <h3 className="font-display text-base font-semibold text-zinc-100">Casos válidos por variable</h3>
            </div>
            <p className="mb-4 text-xs text-zinc-500">Completitud sobre n=1.046 · análisis por casos válidos, sin imputación (3.4.2)</p>
            <div className="max-h-[430px] space-y-2.5 overflow-y-auto pr-1">
              {CALIDAD.map((c) => {
                const pct = (c.validos / META.n) * 100;
                return (
                  <div key={c.variable} className="flex items-center gap-2 text-xs">
                    <span className="w-36 shrink-0 truncate text-zinc-400" title={c.variable}>{c.variable}</span>
                    <ProgressBar value={pct} tone={pct >= 90 ? "emerald" : pct >= 70 ? "amber" : "rose"} className="flex-1" />
                    <span className="w-16 shrink-0 text-right font-mono text-zinc-300">{c.validos.toLocaleString("es-ES")}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-zinc-600">
              La menor completitud (46,4%) corresponde a la escala de mejoría en salud, respondida solo por usuarios terapéuticos. País/provincia: 933 casos normalizados.
            </p>
          </Card>
        </FadeIn>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <FadeIn>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-emerald-300" />
                <h3 className="font-display text-base font-semibold text-zinc-100">Efectos percibidos</h3>
              </div>
              <Badge tone="sky">4.3 · n=1.032 · múltiple</Badge>
            </div>
            <div className="mt-4 space-y-2">
              {positivos.map((e) => (
                <div key={e.categoria} className="flex items-center gap-2 text-xs">
                  <span className="w-36 shrink-0 text-zinc-300">{e.categoria}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full bg-emerald-400" style={{ width: `${e.pct}%` }} />
                  </div>
                  <span className="w-14 shrink-0 text-right font-mono text-zinc-300">{fmt(e.pct, 1)}%</span>
                </div>
              ))}
              <div className="border-t border-white/[0.06] pt-2">
                {negativos.map((e) => (
                  <div key={e.categoria} className="mb-2 flex items-center gap-2 text-xs">
                    <span className="w-36 shrink-0 text-zinc-400">{e.categoria}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <div className="h-full rounded-full bg-rose-400" style={{ width: `${Math.max(1.2, e.pct)}%` }} />
                    </div>
                    <span className="w-14 shrink-0 text-right font-mono text-rose-300">{fmt(e.pct, 1)}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs leading-relaxed text-zinc-400">
              <span className="font-semibold text-zinc-200">Multiefectos:</span> cada usuario reporta en promedio <span className="font-mono text-emerald-300">5,01 efectos</span> simultáneos (rango 1–9): la experiencia es multidimensional.
              <div className="mt-2.5 flex h-14 items-end gap-1">
                {MULTI_DIST.map((v, i) => (
                  <div key={i} className="group relative flex-1 rounded-t bg-teal-300/70 transition-all hover:bg-teal-300" style={{ height: `${(v / 24) * 100}%` }} title={`${i + 1} efectos: ~${v}%`}>
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-mono text-[9px] text-zinc-600">{i + 1}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-[10px] text-zinc-600">Nº de efectos simultáneos por usuario (distribución aprox. en torno a la media 5,01)</p>
            </div>
          </Card>
        </FadeIn>

        <div className="space-y-4">
          <FadeIn delay={0.05}>
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HeartPulse size={16} className="text-rose-300" />
                  <h3 className="font-display text-base font-semibold text-zinc-100">Mejoría percibida en salud</h3>
                </div>
                <Badge tone="rose">4.4 · escala 0–10</Badge>
              </div>
              <p className="mt-1 text-xs text-zinc-500">Solo usuarios terapéuticos (n={SALUD_STATS.n}) · media {fmt(SALUD_STATS.media, 2)} · mediana {SALUD_STATS.mediana} · moda {SALUD_STATS.moda}</p>
              <div className="mt-4 flex h-32 items-end gap-2">
                {SALUD.map((s) => (
                  <div key={s.categoria} className="flex flex-1 flex-col items-center gap-1.5">
                    <span className="font-mono text-[11px] font-bold text-zinc-200">{fmt(s.pct, 1)}%</span>
                    <div className="w-full rounded-t-lg bg-rose-400/80 transition-all hover:bg-rose-300" style={{ height: `${(s.pct / 36.5) * 88}px` }} />
                    <span className="font-mono text-[11px] text-zinc-500">{s.categoria}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-center text-[10px] uppercase tracking-widest text-zinc-600">Puntaje de mejoría autopercibida</p>
              <p className="mt-3 text-[11px] leading-relaxed text-zinc-600">83,3% reporta mejoría alta (≥8). Son autoinformes: no establecen eficacia terapéutica ni causalidad.</p>
            </Card>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-amber-300" />
                  <h3 className="font-display text-base font-semibold text-zinc-100">Impacto policial y judicial</h3>
                </div>
                <Badge tone="amber">4.5</Badge>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  { v: "25,4%", l: "con inconvenientes policiales/judiciales", c: "text-amber-300" },
                  { v: "53,5%", l: "de ellos estuvo detenido alguna vez", c: "text-rose-300" },
                  { v: "0,1%", l: "detenidos sin inconvenientes previos", c: "text-emerald-300" },
                ].map((m) => (
                  <div key={m.l} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-2 py-3">
                    <p className={cn("font-display text-xl font-bold", m.c)}>{m.v}</p>
                    <p className="mt-1 text-[10px] leading-snug text-zinc-500">{m.l}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-36 shrink-0 text-zinc-400">Norte (n=32)</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full bg-amber-400" style={{ width: `${POLICIAL.norte}%` }} /></div>
                  <span className="font-mono text-zinc-300">{fmt(POLICIAL.norte, 1)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-36 shrink-0 text-zinc-400">Patagonia (n=93)</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full bg-amber-400/60" style={{ width: `${POLICIAL.patagonia}%` }} /></div>
                  <span className="font-mono text-zinc-300">{fmt(POLICIAL.patagonia, 1)}%</span>
                </div>
                <p className="text-[11px] text-zinc-600">Diferencia regional descriptiva, no significativa: p = 0,406 · V de Cramér = 0,075. El conflicto se concentra en el contacto con fuerzas de seguridad, no en la vida diaria (≈4%).</p>
              </div>
              <div className="mt-3 border-t border-white/[0.06] pt-3">
                <div className="mb-2 flex items-center gap-2">
                  <Scale size={14} className="text-sky-300" />
                  <span className="text-xs font-semibold text-zinc-200">Cultivo y autoabastecimiento (4.7)</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="rounded-lg bg-white/[0.02] px-3 py-2 text-zinc-400">Cohorte cultivadora depurada: <span className="font-mono font-semibold text-zinc-100">n=743</span></div>
                  <div className="rounded-lg bg-white/[0.02] px-3 py-2 text-zinc-400">Se autoabastece: <span className="font-mono font-semibold text-emerald-300">66,5%</span></div>
                  <div className="rounded-lg bg-white/[0.02] px-3 py-2 text-zinc-400">Modalidad top: <span className="text-zinc-200">exterior en maceta 64,4%</span></div>
                  <div className="rounded-lg bg-white/[0.02] px-3 py-2 text-zinc-400">Insumos orgánicos: <span className="font-mono font-semibold text-zinc-100">79,6%</span></div>
                </div>
                <p className="mt-2 text-[11px] text-zinc-600">Aprendizaje: blogs/foros 71,5% y experiencia propia 69,3% — ecosistema de autoformación comunitaria.</p>
              </div>
            </Card>
          </FadeIn>
        </div>
      </div>

    </div>
  );
}
