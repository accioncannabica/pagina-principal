import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  PieChart, Pie,
} from "recharts";
import { Users, CalendarDays, HeartPulse, ShieldAlert, Leaf, FileText, Quote } from "lucide-react";
import { Card, SectionHeader, Stat, Badge, CHART_TOOLTIP, FadeIn } from "./ui";
import {
  META, AUTORES, COLABORADORAS, EDAD_BINS, GENERO, EDUCACION, FRECUENCIA, MOTIVOS, fmt,
} from "../data/research";

const G_COLORS = ["#34d399", "#2dd4bf", "#a3e635"];

export default function Overview() {
  return (
    <div>
      <SectionHeader
        eyebrow="Paper · Acción Cannábica · Junio 2026"
        title="Patrones de consumo y percepciones de salud en Argentina y América Latina"
        desc="Estudio exploratorio observacional y transversal sobre una encuesta online autoadministrada (21 meses, 2018–2020). De 1.048 registros se depuraron 2 duplicados: muestra final de 1.046 usuarios/as únicos."
        right={<Badge tone="emerald"><span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-300" /> Manuscrito · Junio 2026</Badge>}
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <FadeIn><Stat label="Muestra final (casos únicos)" value="1.046" sub="1.048 registros − 2 duplicados" icon={<Users size={16} />} /></FadeIn>
        <FadeIn delay={0.05}><Stat label="Edad media · mediana 29" value="31,1 años" sub="DE = 10,8 · rango 13–80" icon={<CalendarDays size={16} />} accent="sky" /></FadeIn>
        <FadeIn delay={0.1}><Stat label="Mejoría ≥8 en terapéuticos" value="83,3%" sub="escala 0–10 · n = 485 · media 8,57" icon={<HeartPulse size={16} />} accent="amber" /></FadeIn>
        <FadeIn delay={0.15}><Stat label="Inconvenientes en vida diaria" value="≈ 4%" sub="sin asociación con frecuencia/cantidad" icon={<ShieldAlert size={16} />} accent="rose" /></FadeIn>
      </div>

      <FadeIn>
        <Card className="mt-4 border-emerald-400/20 bg-emerald-400/[0.04] p-5">
          <div className="flex flex-wrap items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400 text-emerald-950"><Quote size={20} /></span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[17px] font-medium leading-relaxed text-emerald-50">
                En esta muestra autoseleccionada, el consumo se presenta integrado en la vida cotidiana: efectos percibidos mayoritariamente positivos o neutros, violencia excepcional (0,1%) y ninguna asociación lineal entre consumo y malestar.
              </p>
              <p className="mt-2 text-xs text-emerald-200/60">Síntesis de conclusiones · §1.5 del manuscrito — resultados exploratorios, sin inferencia causal ni representatividad poblacional.</p>
            </div>
            <div className="flex shrink-0 flex-col gap-1.5 text-right font-mono text-[11px] text-emerald-200/70">
              <span>ROC AUC (RF) = 0,49</span>
              <span>PCA PC1+PC2 ≈ 22%</span>
              <span>Silhouette = 0,19</span>
            </div>
          </div>
        </Card>
      </FadeIn>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <FadeIn className="xl:col-span-2">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-semibold text-zinc-100">Distribución etaria de la muestra</h3>
                <p className="text-xs text-zinc-500">Intervalos quinquenales modelados desde media 31,1 y DE 10,8 (n válido = 1.040) · concentración 20–35 años</p>
              </div>
              <Badge tone="sky">§4.1.1</Badge>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={EDAD_BINS} margin={{ top: 6, right: 6, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="rango" axisLine={false} tickLine={false} tick={{ fontSize: 10.5 }} />
                  <YAxis axisLine={false} tickLine={false} unit="%" />
                  <Tooltip {...CHART_TOOLTIP} formatter={(v: any) => [`${fmt(Number(v), 1)}%`, "Participantes"]} />
                  <Bar dataKey="pct" radius={[6, 6, 0, 0]} maxBarSize={46}>
                    {EDAD_BINS.map((b) => (
                      <Cell key={b.rango} fill={["20–24", "25–29", "30–34"].includes(b.rango) ? "#34d399" : "#34d399"} fillOpacity={["20–24", "25–29", "30–34"].includes(b.rango) ? 0.95 : 0.4} />
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

        <FadeIn delay={0.08}>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-zinc-100">Género</h3>
              <Badge tone="sky">§4.1.2 · n=1.041</Badge>
            </div>
            <div className="h-[168px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={GENERO} dataKey="pct" nameKey="categoria" innerRadius={52} outerRadius={76} paddingAngle={3} strokeWidth={0}>
                    {GENERO.map((g, i) => <Cell key={g.categoria} fill={G_COLORS[i]} />)}
                  </Pie>
                  <Tooltip {...CHART_TOOLTIP} formatter={(v: any, n: any) => [`${fmt(Number(v), 1)}%`, n]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5">
              {GENERO.map((g, i) => (
                <div key={g.categoria} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-zinc-400">
                    <span className="h-2 w-2 rounded-sm" style={{ background: G_COLORS[i] }} /> {g.categoria}
                  </span>
                  <span className="font-mono font-semibold text-zinc-200">{fmt(g.pct, 1)}% <span className="text-zinc-600">(n={g.n})</span></span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-white/[0.06] pt-3">
              <p className="mb-2 text-xs font-semibold text-zinc-300">Nivel educativo <span className="font-normal text-zinc-600">· §4.1.3 · n=1.037</span></p>
              {EDUCACION.map((e) => (
                <div key={e.categoria} className="mb-1.5 flex items-center gap-2 text-xs">
                  <span className="w-24 shrink-0 text-zinc-400">{e.categoria}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full bg-teal-300/80" style={{ width: `${e.pct}%` }} />
                  </div>
                  <span className="w-12 shrink-0 text-right font-mono text-zinc-300">{fmt(e.pct, 1)}%</span>
                </div>
              ))}
              <p className="mt-2 text-[11px] leading-relaxed text-zinc-600">53,3% con formación superior a la secundaria: perfil de alta escolaridad, coherente con la autoselección online.</p>
            </div>
          </Card>
        </FadeIn>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <FadeIn>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-semibold text-zinc-100">Frecuencia de consumo</h3>
                <p className="text-xs text-zinc-500">Más del 80% consume al menos semanalmente · §4.2.4</p>
              </div>
              <Badge tone="sky">n=1.036</Badge>
            </div>
            <div className="mt-4 space-y-3">
              {FRECUENCIA.map((f) => (
                <div key={f.categoria}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-zinc-300">{f.categoria}</span>
                    <span className="font-mono text-zinc-400">{fmt(f.pct, 1)}% · n={f.n}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full bg-emerald-400" style={{ width: `${f.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </FadeIn>

        <FadeIn delay={0.08}>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-semibold text-zinc-100">Motivos de consumo</h3>
                <p className="text-xs text-zinc-500">Respuesta múltiple: las proporciones superan el 100% · §4.2.1</p>
              </div>
              <Badge tone="sky">n=1.036</Badge>
            </div>
            <div className="mt-4 space-y-3">
              {MOTIVOS.slice(0, 5).map((m) => (
                <div key={m.categoria}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-zinc-300">{m.categoria}</span>
                    <span className="font-mono text-zinc-400">{fmt(m.pct, 1)}% · n={m.n}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full bg-amber-400" style={{ width: `${m.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-zinc-600">Uso mixto (disfrute + terapéutico): 24,9% · solo disfrute: 42,6% · solo terapéutico: 12,0%.</p>
          </Card>
        </FadeIn>
      </div>

      <FadeIn>
        <Card className="mt-4 p-5">
          <div className="mb-4 flex items-center gap-2.5">
            <FileText size={18} className="text-emerald-300" />
            <h3 className="font-display text-base font-semibold text-zinc-100">Ficha del estudio y equipo autor</h3>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="space-y-2 text-sm lg:col-span-1">
              {[
                ["Institución", META.institucion],
                ["Tipo de trabajo", "Trabajo de investigación"],
                ["Diseño", "Observacional · transversal · exploratorio"],
                ["Instrumento", "Encuesta online autoadministrada (piloto n=30)"],
                ["Período de campo", "21 meses · 2018–2020"],
                ["Financiamiento", "Sin financiamiento externo · herramientas open source"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 border-b border-white/[0.05] pb-2">
                  <span className="shrink-0 text-zinc-500">{k}</span>
                  <span className="text-right font-medium text-zinc-200">{v}</span>
                </div>
              ))}
            </div>
            <div className="lg:col-span-2">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Autores</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {AUTORES.map((a) => (
                  <div key={a.nombre} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                    <p className="text-sm font-medium text-zinc-100">{a.nombre}</p>
                    <p className="text-[11px] text-zinc-500">{a.rol}</p>
                    <p className="mt-0.5 truncate font-mono text-[10.5px] text-emerald-300/70">{a.email}</p>
                  </div>
                ))}
              </div>
              <p className="mb-2 mt-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Colaboradoras</p>
              <div className="flex flex-wrap gap-2">
                {COLABORADORAS.map((c) => (
                  <span key={c.nombre} className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-300">
                    {c.nombre} · <span className="text-zinc-500">{c.rol}</span>
                  </span>
                ))}
              </div>
              <p className="mt-4 flex items-start gap-2 rounded-xl border border-amber-400/15 bg-amber-400/[0.05] p-3 text-[11.5px] leading-relaxed text-amber-100/80">
                <Leaf size={14} className="mt-0.5 shrink-0 text-amber-300" />
                Conflicto de interés declarado: los/as autores/as pertenecen a una organización de usuarios de cannabis (Acción Cannábica). La responsabilidad de métodos, análisis e interpretación es exclusivamente de los autores (§9).
              </p>
            </div>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
}
