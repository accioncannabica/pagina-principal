import { Users, CalendarDays, HeartPulse, ShieldAlert, Leaf, FileText, Quote } from "lucide-react";
import { Card, SectionHeader, Stat, Badge, FadeIn } from "./ui";
import {
  META, AUTORES, COLABORADORAS,
} from "../data/research";

export default function Overview() {
  return (
    <div>
      <SectionHeader
        eyebrow="Paper · Acción Cannábica · Junio 2026"
        title={META.titulo}
        desc="Análisis estadístico avanzado y técnicas de machine learning aplicadas a una encuesta de 1.046 usuarios/as de cannabis."
        right={<Badge tone="emerald"><span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-300" /> Manuscrito · Junio 2026</Badge>}
      />

      <FadeIn>
        <div className="mt-4 rounded-2xl border border-lima-400/15 bg-gradient-to-r from-lima-400/[0.07] to-emerald-400/[0.03] px-5 py-4 text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-lima-200">
            Cannabis, salud y soberanía
          </p>
          <p className="mt-1 text-sm text-zinc-400">Universidad y comunidad construyendo saberes hacia una sociedad con derechos</p>
          <p className="mt-3 text-xs text-emerald-200/70">
            Horacio Rodríguez · Claudia Sánchez · Daniela Rodríguez · Esteban Calabria
          </p>
        </div>
      </FadeIn>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <FadeIn>
          <Card className="h-full p-5">
            <Badge tone="sky">Introducción</Badge>
            <p className="mt-4 text-sm leading-relaxed text-zinc-300">
              El cannabis es la sustancia psicoactiva más utilizada a nivel mundial: 228 millones de usuarios en 2022, según UNODC. La perspectiva de los usuarios requiere evidencia que combine descripción con análisis avanzado.
            </p>
            <p className="mt-3 border-l-2 border-emerald-400/50 pl-3 text-sm font-medium leading-relaxed text-emerald-100">
              ¿Qué estructuras latentes, perfiles y capacidad predictiva aporta la ciencia de datos a esta encuesta?
            </p>
          </Card>
        </FadeIn>

        <FadeIn delay={0.05}>
          <Card className="h-full p-5">
            <Badge tone="emerald">Objetivo</Badge>
            <p className="mt-4 text-sm leading-relaxed text-zinc-300">
              Describir exploratoriamente los patrones de consumo y las percepciones de salud obtenidos a partir de una encuesta online a 1.046 usuarios de cannabis de Argentina y otros países de América Latina, aplicando técnicas de ciencia de datos y machine learning para identificar perfiles empíricos, explorar estructuras latentes y evaluar la capacidad predictiva de las variables analizadas utilizando Python.
            </p>
          </Card>
        </FadeIn>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <FadeIn><Stat label="Muestra final (casos únicos)" value="1.046" sub="1.048 registros − 2 duplicados" icon={<Users size={16} />} /></FadeIn>
        <FadeIn delay={0.05}><Stat label="Edad media · mediana 29" value="31,1 años" sub="DE = 10,8 · rango 13–80" icon={<CalendarDays size={16} />} accent="sky" /></FadeIn>
        <FadeIn delay={0.1}><Stat label="Mejoría ≥8 en terapéuticos" value="83,3%" sub="escala 0–10 · n = 485 · media 8,57" icon={<HeartPulse size={16} />} accent="amber" /></FadeIn>
        <FadeIn delay={0.15}><Stat label="Inconvenientes en vida diaria" value="≈ 4%" sub="sin asociación con frecuencia/cantidad" icon={<ShieldAlert size={16} />} accent="rose" /></FadeIn>
      </div>

      <FadeIn className="xl:col-span-2">
        <Card className="mt-4 border-emerald-400/20 bg-emerald-400/[0.04] p-5">
          <div className="flex flex-wrap items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400 text-emerald-950"><Quote size={20} /></span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[17px] font-medium leading-relaxed text-emerald-50">
                En esta muestra autoseleccionada, el consumo se presenta integrado en la vida cotidiana: efectos percibidos mayoritariamente positivos o neutros, violencia excepcional (0,1%) y ninguna asociación lineal entre consumo y malestar.
              </p>
              <p className="mt-2 text-xs text-emerald-200/60">Síntesis de conclusiones · 1.5 del manuscrito — resultados exploratorios, sin inferencia causal ni representatividad poblacional.</p>
            </div>
            <div className="flex shrink-0 flex-col gap-1.5 text-right font-mono text-[11px] text-emerald-200/70">
              <span>ROC AUC (RF) = 0,49</span>
              <span>PCA PC1+PC2 ≈ 22%</span>
              <span>Silhouette = 0,19</span>
            </div>
          </div>
        </Card>
      </FadeIn>

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
                Conflicto de interés declarado: los/as autores/as pertenecen a una organización de usuarios de cannabis (Acción Cannábica). La responsabilidad de métodos, análisis e interpretación es exclusivamente de los autores (9).
              </p>
            </div>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
}
