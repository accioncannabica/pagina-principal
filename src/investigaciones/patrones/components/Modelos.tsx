import { useState } from "react";
import { GitCompareArrows, Layers, TriangleAlert } from "lucide-react";
import { Card, FadeIn } from "./ui";
import { LOGREG, ROC_POINTS, ROC_LOGREG_PROBLEMAS, ROC_LOGREG_TERAPEUTICO, fmt } from "../data/research";
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

const EFECTOS_CLUSTER = [
  { efecto: "Relaja", valores: [77.5, 81.6, 80.5] },
  { efecto: "Tranquiliza", valores: [61.4, 75.4, 77.9] },
  { efecto: "Genera alegría", valores: [50.6, 68.4, 68.1] },
  { efecto: "Reduce la ansiedad", valores: [57.0, 55.1, 59.7] },
  { efecto: "Estimula", valores: [51.9, 55.1, 64.7] },
  { efecto: "Abre el apetito", valores: [46.0, 61.7, 65.2] },
  { efecto: "Calma dolores", valores: [56.8, 44.5, 53.5] },
  { efecto: "Equilibra", valores: [41.2, 37.1, 49.6] },
  { efecto: "Elude la realidad", valores: [4.9, 4.3, 4.7] },
  { efecto: "Genera alucinaciones", valores: [0.5, 3.1, 1.8] },
  { efecto: "Deprime", valores: [0.8, 1.6, 0.8] },
  { efecto: "Violenta", valores: [0.0, 0.0, 0.3] },
] as const;

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
          {curvas.map((c) => (
            <path key={c.nombre} d={`M ${pts(c.d)}`} fill="none" stroke={c.color} strokeWidth="2.1" strokeLinejoin="round" />
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

export default function Modelos() {
  const [modelo, setModelo] = useState<"problemas" | "terapeutico">("terapeutico");
  const activo = LOGREG[modelo];

  return (
    <div className="mt-8">
      <div className="mb-5 border-t border-white/[0.06] pt-7">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-amber-300/90">Modelos predictivos · 6.3–6.7</span>
        </div>
        <h3 className="mt-2 font-display text-[22px] font-semibold tracking-tight text-zinc-50">Regresión logística: predecir problemas vs. predecir uso terapéutico</h3>
        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-zinc-400">
          Mismo pipeline (one-hot, class_weight='balanced', split estratificado 80/20), dos objetivos. El contraste es el hallazgo: las variables describen el <span className="text-zinc-100">perfil de uso</span> pero no anticipan el <span className="text-zinc-100">malestar percibido</span>.
        </p>
      </div>

      <div className="mb-4 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-5">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-300">Conclusión · modelo de problemas</p>
        <p className="mt-2 text-base leading-7 text-amber-50/80">
          <strong className="font-semibold text-amber-100">Un segundo modelo llegó a una conclusión similar.</strong>{" "}
          Aunque logró detectar algunos casos, produjo muchas falsas alarmas y no permitió identificar de manera confiable quién percibirá problemas asociados al consumo.
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
                          <div className={cn("h-full rounded-full", modelo === "problemas" ? "bg-rose-400" : "bg-emerald-400")} style={{ width: `${v * 100}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-[11.5px] leading-relaxed text-zinc-400">
                  {modelo === "problemas"
                    ? <>Precision 0,06: por cada positivo correcto, ~16 falsas alarmas. El AUC 0,58 mejora al RF (0,49) pero sigue sin utilidad predictiva (6.5.4).</>
                    : <>F1 0,60 vs 0,11 del modelo de problemas: la motivación terapéutica sí tiene correlatos observables — edad, consumo diario y matutino (6.6.5).</>}
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

      <FadeIn delay={0.12}>
        <Card className="mt-4 border-sky-400/25 bg-sky-400/[0.035] p-6 sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10">
              <Layers size={20} className="text-sky-300" />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-sky-300/70">Síntesis del análisis</p>
              <h3 className="font-display text-xl font-semibold text-zinc-50 sm:text-2xl">Triangulación de métodos (6.3)</h3>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { m: "Correlaciones", r: "|r| < 0,20" },
              { m: "PCA + Clusters", r: "22% · silh. 0,19" },
              { m: "ML predictivo", r: "AUC 0,49–0,58" },
            ].map((t) => (
              <div key={t.m} className="rounded-xl border border-sky-400/20 bg-sky-400/[0.07] px-4 py-4 text-center">
                <p className="text-xs font-semibold text-sky-100">{t.m}</p>
                <p className="mt-1 font-mono text-sm font-medium text-sky-300">{t.r}</p>
              </div>
            ))}
          </div>
          <div className="mx-auto h-5 w-px bg-sky-300/40" />
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/[0.09] px-5 py-6 text-center">
            <p className="font-display text-lg font-semibold leading-snug text-emerald-50 sm:text-xl">Sin patrón estructurado de malestar asociado al consumo</p>
            <p className="mx-auto mt-2 max-w-3xl text-sm leading-relaxed text-emerald-100/70">El malestar aparece idiosincrático y contextual: probablemente mediado por variables no capturadas (clínicas, sociales, legales).</p>
          </div>
          <p className="mt-4 flex gap-2 text-[11.5px] leading-relaxed text-zinc-400">
            <TriangleAlert size={14} className="mt-0.5 shrink-0 text-amber-300" />
            Alcance (6.4 y 6.7): carácter exploratorio y transversal; el desbalance se trató con class_weight='balanced' sin mejorar la señal. Los modelos no son herramientas diagnósticas ni generalizables.
          </p>
        </Card>
      </FadeIn>

      <FadeIn delay={0.16}>
        <Card className="mt-4 overflow-hidden border-white/[0.08] p-0">
          <div className="border-b border-white/[0.07] px-5 py-5 sm:px-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-violeta-400">Efectos percibidos</p>
            <h3 className="mt-1 font-display text-xl font-semibold text-zinc-50 sm:text-2xl">Relación entre los clusters y los efectos percibidos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.025]">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 sm:px-6">Efecto percibido</th>
                  {[0, 1, 2].map((cluster) => (
                    <th key={cluster} className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-violeta-300/80 sm:px-6">Cluster {cluster}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EFECTOS_CLUSTER.map(({ efecto, valores }) => (
                  <tr key={efecto} className="border-b border-white/[0.05] transition-colors last:border-0 hover:bg-white/[0.025]">
                    <th scope="row" className="px-5 py-3 text-[13px] font-medium text-zinc-200 sm:px-6">{efecto}</th>
                    {valores.map((valor, i) => (
                      <td key={`${efecto}-${i}`} className="px-5 py-3 text-right font-mono text-[13px] text-zinc-300 sm:px-6">{fmt(valor, 1)} %</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-emerald-400/25 bg-emerald-400/[0.09] px-5 py-8 sm:px-8 sm:py-10">
            <p className="font-mono text-sm uppercase tracking-[0.26em] text-emerald-300 sm:text-base">Conclusión</p>
            <p className="mt-4 max-w-5xl font-display text-xl font-semibold leading-relaxed text-emerald-50 sm:text-2xl sm:leading-relaxed">
              No se observa una relación significativa entre los clusters y los efectos percibidos. Los tres grupos presentan porcentajes similares, por lo que los efectos son independientes del cluster de pertenencia.
            </p>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
}
