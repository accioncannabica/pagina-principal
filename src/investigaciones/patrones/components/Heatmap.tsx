import { useMemo, useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from "recharts";
import { Flame, Scale, MousePointerClick, TrendingUp, TrendingDown, Users, BrainCircuit, GitBranch } from "lucide-react";
import { Card, SectionHeader, Badge, CHART_TOOLTIP, FadeIn, heatColor } from "./ui";
import { CORR_VARS, CORR_MATRIX, CORR_HALLAZGOS, PCA, PCA_BARRAS, CLUSTERS, RF_FEATURES, RF_METRICAS, ROC_POINTS, SILHOUETTE, fmt } from "../data/research";
import Modelos from "./Modelos";
import { cn } from "../utils/cn";

export default function Heatmap() {
  const [celda, setCelda] = useState<{ i: number; j: number } | null>({ i: 1, j: 3 });
  const maxPeso = Math.max(...RF_FEATURES.map((f) => f.peso));
  const sel = celda ? { a: CORR_VARS[celda.i], b: CORR_VARS[celda.j], v: CORR_MATRIX[celda.i][celda.j] } : null;
  const topCorr = useMemo(() => {
    if (!celda) return [];
    return CORR_VARS.map((v, j) => ({ v, c: CORR_MATRIX[celda.i][j] }))
      .filter((_, j) => j !== celda.i)
      .sort((a, b) => Math.abs(b.c) - Math.abs(a.c))
      .slice(0, 4);
  }, [celda]);

  return (
    <div>
      <SectionHeader
        eyebrow="Análisis avanzado · 5–6"
        title="Machine Learning"
        desc="Tres técnicas complementarias para explorar asociaciones, perfiles y capacidad predictiva: matriz de correlación, Cluster K-Means y Random Forest. Cada método incluye su propia conclusión y mantiene el alcance exploratorio del estudio."
      />

      <section aria-labelledby="matriz-correlacion-title" className="space-y-4 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.015] p-3 sm:p-4">
        <div className="flex flex-col gap-2 border-b border-white/[0.07] pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-300/80">Método 01</p>
            <h2 id="matriz-correlacion-title" className="mt-1 font-display text-xl font-semibold text-zinc-50">Matriz de correlación</h2>
          </div>
          <p className="max-w-xl text-xs leading-relaxed text-zinc-500">Pearson para detectar asociaciones lineales entre variables; PCA para comprobar si existe una estructura de fondo.</p>
        </div>

        <div className="grid gap-4 xl:grid-cols-5">
          <FadeIn className="xl:col-span-3">
            <Card className="p-5">
            <div className="mb-1 flex items-center gap-2.5">
              <Flame size={18} className="text-emerald-300" />
              <h3 className="font-display text-base font-semibold text-zinc-100">Matriz de correlación de Pearson</h3>
              <Badge tone="zinc">Figura 1 · 5.1</Badge>
            </div>
            <p className="mb-4 text-xs text-zinc-500">Reconstruida desde los coeficientes reportados en el texto · verde = positiva · rojo = negativa · clic para inspeccionar</p>
            <div className="overflow-x-auto pb-1">
              <div className="inline-block min-w-[560px]">
                <div className="grid" style={{ gridTemplateColumns: `96px repeat(${CORR_VARS.length}, 1fr)` }}>
                  <div />
                  {CORR_VARS.map((v) => (
                    <div key={v} className="px-0.5 pb-2 text-center text-[9.5px] font-medium leading-tight text-zinc-500">{v}</div>
                  ))}
                  {CORR_VARS.map((vi, i) => (
                    <div key={`row-${vi}`} className="contents">
                      <div className="flex items-center pr-2 text-right text-[10px] font-medium text-zinc-400">
                        <span className="w-full truncate">{vi}</span>
                      </div>
                      {CORR_VARS.map((vj, j) => {
                        const v = CORR_MATRIX[i][j];
                        const active = celda?.i === i && celda?.j === j;
                        const related = celda && (celda.i === i || celda.j === j);
                        return (
                          <button
                            key={`${vi}-${vj}`}
                            onMouseEnter={() => setCelda({ i, j })}
                            onClick={() => setCelda({ i, j })}
                            className={cn(
                              "m-[1.5px] flex aspect-square items-center justify-center rounded-[5px] font-mono text-[10px] font-semibold transition-all duration-150",
                              active ? "z-10 scale-110 ring-2 ring-white/80" : related ? "ring-1 ring-white/25" : "hover:scale-105"
                            )}
                            style={{ background: heatColor(v, i === j ? 0.45 : 0.92), color: Math.abs(v) > 0.4 ? "#fff" : "#d4d4d8" }}
                          >
                            {i === j ? "1" : v.toFixed(2).replace("0.", ".").replace("-0.", "-.")}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3 text-[11px] text-zinc-500">
              <span>r = −1</span>
              <div className="flex h-3 flex-1 overflow-hidden rounded-full">
                {Array.from({ length: 24 }, (_, k) => (
                  <div key={k} className="h-full flex-1" style={{ background: heatColor(-1 + (k / 23) * 2) }} />
                ))}
              </div>
              <span>r = +1</span>
            </div>
            {sel ? (
              <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-zinc-200">
                    <span className="font-semibold text-zinc-50">{sel.a}</span>
                    <span className="mx-2 text-zinc-600">×</span>
                    <span className="font-semibold text-zinc-50">{sel.b}</span>
                  </p>
                  <Badge tone={sel.v >= 0 ? "emerald" : "rose"}>
                    {sel.v >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />} r = {fmt(sel.v, 2)}
                  </Badge>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                  {Math.abs(sel.v) >= 0.35
                    ? "Una de las pocas asociaciones visibles: corresponde a variables conceptualmente solapadas (mismo bloque), no a un eje consumo–daño."
                    : Math.abs(sel.v) >= 0.1
                      ? "Asociación débil: variación leve sin significación estructural según la interpretación del paper (5.1)."
                      : "Asociación prácticamente nula: las dimensiones operan de manera relativamente independiente."}
                </p>
                {topCorr.length > 0 && celda && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-zinc-500">Top de {CORR_VARS[celda.i]}:</span>
                    {topCorr.map((t) => (
                      <span key={t.v} className="rounded-md px-2 py-0.5 font-mono text-[11px]" style={{ background: heatColor(t.c, 0.55), color: "#fff" }}>
                        {t.v} {fmt(t.c, 2)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-4 flex items-center gap-2 text-xs text-zinc-600">
                <MousePointerClick size={14} /> Pasa el cursor sobre una celda para inspeccionarla.
              </p>
            )}
            </Card>
          </FadeIn>

          <div className="space-y-4 xl:col-span-2">
            <FadeIn delay={0.05}>
              <Card className="p-5">
              <h3 className="font-display text-base font-semibold text-zinc-100">Lecturas clave de la matriz (5.1)</h3>
              <div className="mt-3 space-y-2.5">
                {CORR_HALLAZGOS.map((h) => (
                  <div key={h.par} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-zinc-200">{h.par}</span>
                      <span className="shrink-0 rounded-md bg-emerald-400/10 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-300">r {h.r}</span>
                    </div>
                    <p className="mt-1 text-[11.5px] leading-relaxed text-zinc-500">{h.lectura}</p>
                  </div>
                ))}
              </div>
              </Card>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Card className="p-5">
              <div className="flex items-center gap-2.5">
                <GitBranch size={17} className="text-sky-300" />
                <h3 className="font-display text-base font-semibold text-zinc-100">PCA · varianza explicada (5.2)</h3>
              </div>
              <p className="mb-3 text-xs text-zinc-500">PC1 = {fmt(PCA.pc1, 1)}% · PC2 = {fmt(PCA.pc2, 1)}% · acumulado ≈ {fmt(PCA.acumulado, 0)}% (PC3+ no reportados individualmente)</p>
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PCA_BARRAS} margin={{ top: 4, right: 6, left: -22, bottom: 0 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="comp" axisLine={false} tickLine={false} tick={{ fontSize: 10.5 }} />
                    <YAxis axisLine={false} tickLine={false} unit="%" />
                    <Tooltip {...CHART_TOOLTIP} formatter={(v: any, _n: any, item: any) => [`${fmt(Number(v), 1)}%${item?.payload?.reportado ? "" : " (distribuido)"}`, "Varianza"]} />
                    <Bar dataKey="var" radius={[5, 5, 0, 0]} maxBarSize={40} isAnimationActive={false}>
                      {PCA_BARRAS.map((b) => <Cell key={b.comp} fill={b.reportado ? "#38bdf8" : "#38bdf8"} fillOpacity={b.reportado ? 0.9 : 0.3} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-600">Sin estructura dimensional dominante: la proyección PC1×PC2 es una nube homogénea sin agrupamientos. No existe un eje «consumo–malestar».</p>
              </Card>
            </FadeIn>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-emerald-300">Conclusión</p>
          <p className="mt-2 text-base leading-7 text-emerald-50/80">
            No se observa una relación lineal entre intensidad de consumo y percepción de problemas: casi todos los coeficientes quedan por debajo de |r| = 0,20. Las dos primeras componentes del PCA explican solo ~22%, por lo que tampoco emerge un eje «consumo–malestar» dominante.
          </p>
        </div>
      </section>

      <section aria-labelledby="kmeans-title" className="mt-6 space-y-4 rounded-2xl border border-sky-400/10 bg-sky-400/[0.015] p-3 sm:p-4">
        <div className="flex flex-col gap-2 border-b border-white/[0.07] pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-sky-300/80">Método 02</p>
            <h2 id="kmeans-title" className="mt-1 font-display text-xl font-semibold text-zinc-50">Cluster K-Means</h2>
          </div>
          <p className="max-w-xl text-xs leading-relaxed text-zinc-500">Agrupamiento no supervisado para reconocer perfiles recurrentes y evaluar qué tan separadas están sus fronteras.</p>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {CLUSTERS.map((c, i) => (
            <FadeIn key={c.id} delay={i * 0.06}>
              <Card hover className="h-full p-5">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${c.color}1f`, color: c.color }}>
                    <Users size={18} />
                  </span>
                  <span className="font-display text-2xl font-bold" style={{ color: c.color }}>
                    {c.id === 3 ? "≈25" : `~${c.share}%`}
                  </span>
                </div>
                <h4 className="mt-3 font-display text-base font-semibold text-zinc-50">Perfil {c.id} · {c.nombre}</h4>
                <p className="text-xs text-zinc-500">{c.id === 3 ? "Subgrupo minoritario de la muestra" : `Participación aproximada de la muestra · edad ${c.edad}`}</p>
                <ul className="mt-3 space-y-1.5">
                  {c.rasgos.map((r) => (
                    <li key={r} className="flex gap-2 text-[12.5px] leading-snug text-zinc-400">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full" style={{ background: c.color }} /> {r}
                    </li>
                  ))}
                </ul>
              </Card>
            </FadeIn>
          ))}
        </div>

        <Card className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-display text-base font-semibold text-zinc-100">Validación de separación</h3>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-zinc-500">K-Means fue contrastado con clustering jerárquico. Un silhouette cercano a 1 indica grupos bien separados; cercano a 0, superposición.</p>
            </div>
            <Badge tone="sky">k = 3 · 5.3</Badge>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {SILHOUETTE.map((s) => (
              <div key={s.metodo} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                <div className="mb-2 flex justify-between text-xs">
                  <span className="text-zinc-300">Silhouette · {s.metodo}</span>
                  <span className="font-mono font-bold text-zinc-100">{fmt(s.valor, 2)}</span>
                </div>
                <div className="relative h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className={cn("h-full rounded-full", s.valor >= 0.25 ? "bg-emerald-400" : "bg-sky-400")} style={{ width: `${s.valor * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-zinc-600">Los resultados (0,19 y 0,16) quedan por debajo de 0,25, referencia conceptual de separación razonable.</p>
        </Card>

        <div className="rounded-xl border border-sky-400/20 bg-sky-400/[0.06] p-5">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-sky-300">Conclusión</p>
          <p className="mt-2 text-base leading-7 text-sky-50/80">
            K-Means permite describir tres perfiles útiles de lectura —recreativo, terapéutico-social y conflicto—, pero no categorías naturales y rígidas. El silhouette de 0,19 muestra fronteras difusas: la población se distribuye como un continuo.
          </p>
        </div>
      </section>

      <section aria-labelledby="random-forest-title" className="mt-6 space-y-4 rounded-2xl border border-amber-400/10 bg-amber-400/[0.015] p-3 sm:p-4">
        <div className="flex flex-col gap-2 border-b border-white/[0.07] pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-amber-300/80">Método 03</p>
            <h2 id="random-forest-title" className="mt-1 font-display text-xl font-semibold text-zinc-50">Random Forest</h2>
          </div>
          <p className="max-w-xl text-xs leading-relaxed text-zinc-500">Modelo supervisado para estimar la percepción de problemas y comparar la importancia relativa de las variables con su desempeño real.</p>
        </div>

        <div className="grid gap-4 xl:grid-cols-5">
          <FadeIn className="xl:col-span-3">
            <Card className="p-5">
            <div className="mb-1 flex items-center gap-2.5">
              <Scale size={18} className="text-amber-300" />
              <h3 className="font-display text-base font-semibold text-zinc-100">Gradientes de peso · Random Forest (6.1.7)</h3>
            </div>
            <p className="mb-5 text-xs text-zinc-500">Importancia relativa para predecir «percepción de problemas» (43 Sí · 4,3% vs 992 No). La edad domina sin que el modelo discrimine (AUC 0,49).</p>
            <div className="space-y-4">
              {RF_FEATURES.map((f, idx) => {
                const pct = f.peso * 100;
                return (
                  <div key={f.variable}>
                    <div className="mb-1.5 flex items-baseline justify-between gap-2">
                      <span className="flex items-center gap-2 text-[13px] font-medium text-zinc-200">
                        <span className="font-mono text-[10px] text-zinc-600">{String(idx + 1).padStart(2, "0")}</span>
                        {f.variable}
                      </span>
                      <span className="font-mono text-xs font-bold text-amber-300">{fmt(pct, 1)}%</span>
                    </div>
                    <div className="flex h-3.5 gap-[2px]">
                      {Array.from({ length: 28 }, (_, k) => {
                        const t = k / 27;
                        const on = t <= f.peso / maxPeso;
                        return (
                          <span
                            key={k}
                            className="flex-1 rounded-[3px]"
                            style={{ background: on ? `hsl(38, ${55 + t * 35}%, ${22 + t * 30}%)` : "rgba(255,255,255,0.05)" }}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 rounded-xl border border-amber-400/15 bg-amber-400/[0.05] p-3.5 text-xs leading-relaxed text-amber-100/80">
              Advertencia del paper (6.1.8): en datasets desbalanceados y sin señal, los árboles priorizan variables continuas de alta varianza como la edad. <strong className="text-amber-200">Importancia ≠ poder predictivo.</strong>
            </div>
            </Card>
          </FadeIn>

          <FadeIn delay={0.08} className="xl:col-span-2">
            <Card className="p-5">
            <div className="flex items-center gap-2.5">
              <BrainCircuit size={17} className="text-rose-300" />
              <h3 className="font-display text-base font-semibold text-zinc-100">Curva ROC y validación (6.1.9 · 6.2)</h3>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {[
                { k: "Accuracy", v: fmt(RF_METRICAS.accuracy, 2) },
                { k: "ROC AUC", v: fmt(RF_METRICAS.auc, 2) },
                { k: "Clase +", v: `${fmt(RF_METRICAS.pctPos, 1)}%` },
              ].map((m) => (
                <div key={m.k} className="rounded-xl border border-white/[0.06] bg-white/[0.02] py-2.5">
                  <p className="font-mono text-base font-bold text-zinc-50">{m.v}</p>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">{m.k}</p>
                </div>
              ))}
            </div>
            {/* ROC curve SVG */}
            <div className="relative mx-auto mt-4 aspect-square max-w-[250px]">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <rect x="8" y="4" width="88" height="88" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.09)" rx="3" />
                <line x1="8" y1="92" x2="96" y2="4" stroke="#71717a" strokeWidth="0.7" strokeDasharray="3 3" />
                <path
                  d={`M ${ROC_POINTS.map((p) => `${8 + p.fpr * 88},${92 - p.tpr * 88}`).join(" L ")}`}
                  fill="none"
                  stroke="#fb7185"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
                {ROC_POINTS.map((p, i) => (
                  <circle key={i} cx={8 + p.fpr * 88} cy={92 - p.tpr * 88} r="1.7" fill="#fb7185" />
                ))}
                <text x="52" y="99" textAnchor="middle" fill="#71717a" fontSize="5.5">Tasa de falsos positivos</text>
                <text x="3" y="50" textAnchor="middle" fill="#71717a" fontSize="5.5" transform="rotate(-90 3 50)">Tasa de verdaderos positivos</text>
              </svg>
              <span className="absolute right-2 top-2 rounded-md bg-rose-400/15 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-300">AUC 0,49 ≈ azar</span>
            </div>
            </Card>
          </FadeIn>
        </div>

        <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-5">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-300">Conclusión</p>
          <p className="mt-2 text-base leading-7 text-amber-50/80">
            <strong className="font-semibold text-amber-100">Las variables analizadas no permiten predecir quién percibirá problemas asociados al consumo.</strong>{" "}
            El modelo no logró distinguir de manera confiable entre quienes reportan inconvenientes y quienes no, mostrando un desempeño similar al azar.
          </p>
        </div>
      </section>

      <Modelos />
    </div>
  );
}
