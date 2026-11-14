import { useState } from "react";
import { motion } from "framer-motion";
import { Scale, GitCompareArrows, TriangleAlert, Layers, Crosshair } from "lucide-react";
import { Card, Badge, FadeIn } from "./ui";
import { LOGREG, ODDS_PROBLEMAS, ODDS_TERAPEUTICO, ROC_POINTS, ROC_LOGREG_PROBLEMAS, ROC_LOGREG_TERAPEUTICO, fmt } from "../data/research";
import { cn } from "../utils/cn";

function ConfusionMatrix({ matriz, titulo, subtitulo, color }: { matriz: number[][]; titulo: string; subtitulo: string; color: string }) {
  const [[vn, fp], [fn, vp]] = matriz;
  const total = vn + fp + fn + vp;
  const max = Math.max(vn, fp, fn, vp);
  const celda = (v: number, etiqueta: string, correcto: boolean) => (
    <div className="flex aspect-[1.35] flex-col items-center justify-center rounded-lg border transition-transform hover:scale-[1.04]"
      style={{
        background: correcto ? `hsla(152,60%,${14 + (v / max) * 26}%,0.92)` : `hsla(8,65%,${14 + (v / max) * 24}%,0.92)`,
        borderColor: "rgba(255,255,255,0.08)",
      }}>
      <span className="font-display text-[22px] font-bold leading-none text-white">{v}</span>
      <span className="mt-1 text-[9px] font-medium uppercase tracking-wider text-white/70">{etiqueta}</span>
      <span className="font-mono text-[9.5px] text-white/50">{fmt((v / total) * 100, 1)}%</span>
    </div>
  );
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-zinc-100">{titulo}</h4>
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      </div>
      <p className="mb-3 text-[11px] text-zinc-500">{subtitulo}</p>
      <div className="grid grid-cols-[26px_1fr_1fr] items-center gap-1.5">
        <span />
        <span className="text-center text-[9.5px] uppercase tracking-wider text-zinc-500">Predicho: No</span>
        <span className="text-center text-[9.5px] uppercase tracking-wider text-zinc-500">Predicho: Sí</span>
        <span className="rotate-180 text-center text-[9.5px] uppercase tracking-wider text-zinc-500" style={{ writingMode: "vertical-rl" }}>Real: No</span>
        {celda(vn, "Verdaderos −", true)}
        {celda(fp, "Falsos +", false)}
        <span className="rotate-180 text-center text-[9.5px] uppercase tracking-wider text-zinc-500" style={{ writingMode: "vertical-rl" }}>Real: Sí</span>
        {celda(fn, "Falsos −", false)}
        {celda(vp, "Verdaderos +", true)}
      </div>
    </div>
  );
}

const METRICAS: { k: keyof typeof LOGREG.problemas; label: string }[] = [
  { k: "accuracy", label: "Accuracy" }, { k: "auc", label: "ROC AUC" }, { k: "precision", label: "Precision" },
  { k: "recall", label: "Recall" }, { k: "f1", label: "F1-score" },
];

function RocChart() {
  const pts = (arr: { fpr: number; tpr: number }[]) => arr.map((p) => `${10 + p.fpr * 84},${94 - p.tpr * 84}`).join(" L ");
  const curvas = [
    { nombre: "Logística · uso terapéutico", auc: "0,67", color: "#34d399", d: ROC_LOGREG_TERAPEUTICO },
    { nombre: "Logística · problemas", auc: "0,58", color: "#fbbf24", d: ROC_LOGREG_PROBLEMAS },
    { nombre: "Random Forest · problemas", auc: "0,49", color: "#fb7185", d: ROC_POINTS },
  ];
  return (
    <div>
      <div className="relative mx-auto aspect-square max-w-[290px]">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <rect x="10" y="10" width="84" height="84" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.09)" rx="3" />
          <line x1="10" y1="94" x2="94" y2="10" stroke="#71717a" strokeWidth="0.7" strokeDasharray="3 3" />
          {curvas.map((c, i) => (
            <motion.path key={c.nombre} d={`M ${pts(c.d)}`} fill="none" stroke={c.color} strokeWidth="2.1" strokeLinejoin="round"
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: i * 0.15 }} />
          ))}
          <text x="52" y="99.5" textAnchor="middle" fill="#71717a" fontSize="5">Falsos positivos →</text>
          <text x="4" y="52" textAnchor="middle" fill="#71717a" fontSize="5" transform="rotate(-90 4 52)">Verdaderos positivos →</text>
        </svg>
      </div>
      <div className="mt-3 space-y-1.5">
        {curvas.map((c) => (
          <div key={c.nombre} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-zinc-300"><span className="h-2 w-2 rounded-full" style={{ background: c.color }} />{c.nombre}</span>
            <span className="font-mono font-bold" style={{ color: c.color }}>AUC {c.auc}</span>
          </div>
        ))}
        <p className="pt-1 text-[11px] leading-relaxed text-zinc-600">Figura 9 del paper: el modelo terapéutico separa moderadamente; el de problemas apenas supera la diagonal del azar.</p>
      </div>
    </div>
  );
}

function ForestPlot() {
  // Escala logarítmica entre 0.1 y 60
  const lo = Math.log(0.1), hi = Math.log(60);
  const x = (v: number) => ((Math.log(Math.max(0.1, Math.min(60, v))) - lo) / (hi - lo)) * 100;
  return (
    <div>
      <div className="relative mb-2 h-5 border-b border-white/[0.07] font-mono text-[9.5px] text-zinc-500">
        {[0.1, 0.5, 1, 2, 5, 10, 50].map((t) => (
          <span key={t} className="absolute -translate-x-1/2" style={{ left: `${x(t)}%` }}>{t}</span>
        ))}
      </div>
      <div className="space-y-2.5">
        {ODDS_PROBLEMAS.map((o) => {
          const sig = o.lo > 1 || o.hi < 1;
          const color = o.or >= 1 ? (sig ? "#fb7185" : "#fbbf24") : sig ? "#34d399" : "#a1a1aa";
          return (
            <div key={o.variable} className="group">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-medium text-zinc-200">{o.variable}</span>
                <span className="font-mono text-[11px] text-zinc-400">
                  OR <span className="font-bold" style={{ color }}>{fmt(o.or, 2)}</span>
                  <span className="text-zinc-600"> [{fmt(o.lo, 2)}–{fmt(o.hi, 2)}]</span>
                </span>
              </div>
              <div className="relative mt-1 h-4">
                <div className="absolute inset-y-0 w-px bg-white/25" style={{ left: `${x(1)}%` }} />
                <motion.div className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full"
                  style={{ left: `${x(o.lo)}%`, width: `${Math.max(1.5, x(o.hi) - x(o.lo))}%`, background: color, opacity: 0.55 }}
                  initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }} />
                <motion.span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#0d120e]"
                  style={{ left: `${x(o.or)}%`, background: color }}
                  initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }} />
              </div>
              <p className={cn("text-[10.5px]", sig ? "text-zinc-400" : "text-zinc-600")}>{o.nota}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-zinc-600">
        IC 95% por bootstrap (500 iteraciones, §14.20). Solo el género masculino no cruza la unidad con claridad; con 43 positivos ningún OR es estable. El OR 10,20 de «fin de semana» es un evento raro con incertidumbre extrema.
      </p>
    </div>
  );
}

export default function Modelos() {
  const [modelo, setModelo] = useState<"problemas" | "terapeutico">("terapeutico");
  const activo = LOGREG[modelo];

  return (
    <div className="mt-8">
      <div className="mb-5 border-t border-white/[0.06] pt-7">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-amber-300/90">Modelos predictivos · §6.3–6.7</span>
        </div>
        <h3 className="mt-2 font-display text-[22px] font-semibold tracking-tight text-zinc-50">Regresión logística: predecir problemas vs. predecir uso terapéutico</h3>
        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-zinc-400">
          Mismo pipeline (one-hot, class_weight='balanced', split estratificado 80/20), dos objetivos. El contraste es el hallazgo: las variables describen el <span className="text-zinc-100">perfil de uso</span> pero no anticipan el <span className="text-zinc-100">malestar percibido</span>.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <FadeIn className="xl:col-span-3">
          <Card className="p-5">
            <div className="mb-4 flex flex-wrap gap-1.5">
              {(Object.keys(LOGREG) as (keyof typeof LOGREG)[]).map((k) => (
                <button key={k} onClick={() => setModelo(k)}
                  className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition",
                    modelo === k ? "bg-amber-400 text-amber-950" : "bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-200")}>
                  {LOGREG[k].nombre}
                </button>
              ))}
              <span className="ml-auto hidden font-mono text-[11px] text-zinc-500 sm:block">{activo.balance}</span>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <ConfusionMatrix
                matriz={activo.matriz}
                titulo={`Matriz de confusión · ${activo.nombre}`}
                subtitulo={modelo === "problemas" ? "Figura 7 · detecta 4 de 9 positivos con 63 falsas alarmas" : "Figura 8 · desempeño equilibrado entre clases"}
                color={modelo === "problemas" ? "#fb7185" : "#34d399"}
              />
              <div>
                <h4 className="mb-3 text-sm font-semibold text-zinc-100">Métricas en conjunto de prueba</h4>
                <div className="space-y-2.5">
                  {METRICAS.map((m) => {
                    const p = LOGREG.problemas[m.k] as number;
                    const t = LOGREG.terapeutico[m.k] as number;
                    const v = modelo === "problemas" ? p : t;
                    return (
                      <div key={m.k}>
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="text-zinc-400">{m.label}</span>
                          <span className="font-mono text-zinc-200">
                            <span className={modelo === "problemas" ? "font-bold text-rose-300" : "text-zinc-500"}>{fmt(p, 2)}</span>
                            <span className="mx-1 text-zinc-700">vs</span>
                            <span className={modelo === "terapeutico" ? "font-bold text-emerald-300" : "text-zinc-500"}>{fmt(t, 2)}</span>
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                          <motion.div key={modelo} className={cn("h-full rounded-full", modelo === "problemas" ? "bg-rose-400" : "bg-emerald-400")}
                            initial={{ width: 0 }} animate={{ width: `${v * 100}%` }} transition={{ duration: 0.6 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-[11.5px] leading-relaxed text-zinc-400">
                  {modelo === "problemas"
                    ? <>Precision 0,06: por cada positivo correcto, ~16 falsas alarmas. El AUC 0,58 mejora al RF (0,49) pero sigue sin utilidad predictiva (§6.5.4).</>
                    : <>F1 0,60 vs 0,11 del modelo de problemas: la motivación terapéutica sí tiene correlatos observables — edad, consumo diario y matutino (§6.6.5).</>}
                </p>
              </div>
            </div>
          </Card>
        </FadeIn>

        <FadeIn delay={0.08} className="xl:col-span-2">
          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2.5">
              <GitCompareArrows size={17} className="text-emerald-300" />
              <h3 className="font-display text-base font-semibold text-zinc-100">Curvas ROC comparativas</h3>
            </div>
            <RocChart />
          </Card>
        </FadeIn>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <FadeIn>
          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2.5">
              <Scale size={17} className="text-amber-300" />
              <h3 className="font-display text-base font-semibold text-zinc-100">Odds Ratios · modelo de problemas (§6.5.6)</h3>
              <Badge tone="amber">escala logarítmica</Badge>
            </div>
            <ForestPlot />
          </Card>
        </FadeIn>

        <div className="space-y-4">
          <FadeIn delay={0.05}>
            <Card className="p-5">
              <div className="mb-3 flex items-center gap-2.5">
                <Crosshair size={17} className="text-emerald-300" />
                <h3 className="font-display text-base font-semibold text-zinc-100">OR destacados · uso terapéutico (§6.6)</h3>
              </div>
              <div className="space-y-2.5">
                {ODDS_TERAPEUTICO.map((o) => (
                  <div key={o.variable} className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-3.5 py-2.5">
                    <div>
                      <p className="text-[13px] font-medium text-zinc-100">{o.variable}</p>
                      <p className="text-[11px] text-zinc-500">{o.lectura}</p>
                    </div>
                    <span className="rounded-lg bg-emerald-400/10 px-2.5 py-1 font-mono text-sm font-bold text-emerald-300">OR ≈ {fmt(o.or, 2)}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-zinc-600">
                Predictores coherentes con la hipótesis: usuarios más maduros, con hábitos continuos y rutinas matinales tienden a reportar uso terapéutico.
              </p>
            </Card>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Card className="p-5">
              <div className="mb-3 flex items-center gap-2.5">
                <Layers size={17} className="text-sky-300" />
                <h3 className="font-display text-base font-semibold text-zinc-100">Triangulación de métodos (§6.3)</h3>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { m: "Correlaciones", r: "|r| < 0,20" },
                  { m: "PCA + Clusters", r: "22% · silh. 0,19" },
                  { m: "ML predictivo", r: "AUC 0,49–0,58" },
                ].map((t) => (
                  <div key={t.m} className="rounded-xl border border-sky-400/15 bg-sky-400/[0.05] px-2 py-3">
                    <p className="text-[11px] font-semibold text-sky-200">{t.m}</p>
                    <p className="mt-1 font-mono text-[11px] text-sky-300/80">{t.r}</p>
                  </div>
                ))}
              </div>
              <div className="mx-auto my-2 h-4 w-px bg-sky-300/30" />
              <div className="rounded-xl border border-emerald-400/25 bg-emerald-400/[0.07] px-4 py-3 text-center">
                <p className="text-[13px] font-semibold leading-snug text-emerald-100">Sin patrón estructurado de malestar asociado al consumo</p>
                <p className="mt-1 text-[11px] leading-snug text-emerald-200/60">El malestar aparece idiosincrático y contextual: probablemente mediado por variables no capturadas (clínicas, sociales, legales).</p>
              </div>
              <p className="mt-3 flex gap-2 text-[11px] leading-relaxed text-zinc-500">
                <TriangleAlert size={13} className="mt-0.5 shrink-0 text-amber-300" />
                Alcance (§6.4 y §6.7): carácter exploratorio y transversal; el desbalance se trató con class_weight='balanced' sin mejorar la señal. Los modelos no son herramientas diagnósticas ni generalizables.
              </p>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
