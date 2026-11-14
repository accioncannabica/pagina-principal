import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Leaf, Globe2, Target, Users, Sprout, HeartPulse,
  Landmark, BrainCircuit, GitCompareArrows, Code2, Flag, Maximize2,
} from "lucide-react";
import { Card, SectionHeader, Badge, FadeIn, heatColor } from "./ui";
import {
  FRECUENCIA, RF_FEATURES, CORR_VARS, CORR_MATRIX, EDAD_BINS, REGULACION,
  ROC_POINTS, ROC_LOGREG_PROBLEMAS, ROC_LOGREG_TERAPEUTICO, fmt,
} from "../data/research";
import { cn } from "../utils/cn";

type Visual = "ninguna" | "frecuencia" | "salud" | "calor" | "pesos" | "roc" | "perfiles" | "codigo" | "muestra" | "sociedad";
interface Slide {
  kicker: string; titulo: string; icono: typeof Leaf; color: string;
  bullets: string[]; metrica: { valor: string; etiqueta: string }; visual: Visual; pie: string;
}

const SLIDES: Slide[] = [
  {
    kicker: "01 · Portada", titulo: "Patrones de consumo de cannabis y percepciones de salud en usuarios/as de Argentina y América Latina", icono: Leaf, color: "#34d399",
    bullets: [
      "Trabajo de investigación exploratorio con análisis estadístico y ciencia de datos",
      "Rodríguez, Sánchez, Rodríguez (Acción Cannábica) y Calabria (ciencia de datos) · Colaboradoras UNLP y UBA",
      "Asociación Civil Acción Cannábica (IGJ 1921803) · Junio de 2026 · Sin financiamiento externo",
    ],
    metrica: { valor: "Junio 2026", etiqueta: "manuscrito finalizado y verificado" }, visual: "ninguna", pie: "Textura de correlación del estudio",
  },
  {
    kicker: "02 · Contexto y problema", titulo: "La sustancia más usada del mundo, estudiada sin la voz de sus usuarios", icono: Globe2, color: "#38bdf8",
    bullets: [
      "UNODC 2025: ~244 millones de usuarios de cannabis en 2023 (6% de la población de 15–64 años)",
      "La literatura regional se basa en datos secundarios y poblaciones clínicas: falta la percepción directa de usuarios/as",
      "Problema: ¿cómo consumen, qué efectos perciben y qué conflictos enfrentan los usuarios latinoamericanos?",
    ],
    metrica: { valor: "244 M", etiqueta: "usuarios de cannabis en el mundo (UNODC 2025)" }, visual: "ninguna", pie: "Textura de correlación del estudio",
  },
  {
    kicker: "03 · Objetivos y diseño", titulo: "Estudio observacional, transversal y exploratorio — sin hipótesis a priori", icono: Target, color: "#a3e635",
    bullets: [
      "Objetivo: describir patrones, motivos, efectos, conflictos y perfiles en una encuesta online de 21 meses (2018–2020)",
      "11 objetivos específicos verificables: de la caracterización sociodemográfica a los modelos predictivos",
      "Estrategia: descriptivos y χ² → correlaciones → PCA → clustering → Random Forest y regresión logística",
    ],
    metrica: { valor: "11", etiqueta: "objetivos específicos trazables (§2.7.2)" }, visual: "codigo", pie: "Pipeline reproducible en Python (Anexo 14)",
  },
  {
    kicker: "04 · La muestra", titulo: "1.046 usuarios/as únicos: jóvenes, escolarizados y del AMBA", icono: Users, color: "#2dd4bf",
    bullets: [
      "De 1.048 registros se eliminaron 2 duplicados por correo (script 14.2): n final = 1.046",
      "61,5% varones · edad media 31,1 años (mediana 29) · 53,3% con estudios superiores",
      "AMBA 59,8% de residencias válidas · muestra no probabilística por autoselección (limitación declarada)",
    ],
    metrica: { valor: "n = 1.046", etiqueta: "casos únicos tras la depuración" }, visual: "muestra", pie: "Distribución etaria modelada (media/DE reportados)",
  },
  {
    kicker: "05 · Patrones de consumo", titulo: "Consumo frecuente y moderado, con autocultivo mayoritario", icono: Sprout, color: "#fbbf24",
    bullets: [
      "52,0% consume a diario · cantidad típica ≤ 1 cigarrillo (54,2%) · fumado 90,9% · flores 91,8%",
      "Motivos: disfrute 86,1% y terapéutico 44,9% — el uso mixto alcanza ~37% de la muestra",
      "65,2% cultiva y 66,5% se autoabastece; entre quienes compran, 60,2% ignora la procedencia",
    ],
    metrica: { valor: "52,0%", etiqueta: "consume todos los días" }, visual: "frecuencia", pie: "Frecuencia de consumo (§4.2.4)",
  },
  {
    kicker: "06 · Efectos y salud", titulo: "Efectos positivos, mejoría percibida alta y violencia excepcional", icono: HeartPulse, color: "#fb7185",
    bullets: [
      "Relaja 79,7% · tranquiliza 71,0% · alegría 61,5% · 5,01 efectos simultáneos promedio por usuario",
      "Terapéuticos (n=485): 83,3% reporta mejoría ≥8/10 (media 8,57) — autoinforme, no eficacia clínica",
      "Efecto «violenta»: 1 solo caso (0,1%) · inconvenientes en la vida diaria ≈ 4%",
    ],
    metrica: { valor: "0,1%", etiqueta: "asocia el consumo con violencia" }, visual: "salud", pie: "Indicadores de efectos y salud (§4.3–4.4)",
  },
  {
    kicker: "07 · Sociedad y legalidad", titulo: "Consenso regulatorio y conflicto concentrado en lo policial", icono: Landmark, color: "#f59e0b",
    bullets: [
      "Legalización 69,3% · despenalización 17,1% · regulación 13,2%: consenso del 99,6%",
      "Participación: colectivos 33,2% · Marcha de la Marihuana 56,2%",
      "25,4% tuvo inconvenientes policiales/judiciales y 53,5% de ellos fue detenido (vs. ≈4% de problemas cotidianos)",
    ],
    metrica: { valor: "25,4%", etiqueta: "con inconvenientes policiales o judiciales" }, visual: "sociedad", pie: "Posición frente a la regulación (§4.6)",
  },
  {
    kicker: "08 · Análisis avanzado", titulo: "Sin ejes lineales: correlaciones nulas, PCA difuso y tres perfiles tenues", icono: BrainCircuit, color: "#34d399",
    bullets: [
      "Consumo × problemas r ≈ 0,04 · participación × resto r < 0,20: las dimensiones son independientes (Figura 1)",
      "PCA: PC1 + PC2 ≈ 22% de varianza, sin un eje «consumo–malestar» en la proyección",
      "K-Means k=3: recreativo integrado (~45%), terapéutico-social (~30%), minoría con conflicto (≈25) · silhouette 0,19",
    ],
    metrica: { valor: "r ≈ 0,04", etiqueta: "correlación consumo – problemas" }, visual: "calor", pie: "Matriz de correlación (Figura 1)",
  },
  {
    kicker: "09 · Modelos predictivos", titulo: "Predecir el uso sí; predecir el malestar, no", icono: GitCompareArrows, color: "#38bdf8",
    bullets: [
      "Random Forest sobre «problemas» (4,3% positivos): accuracy 0,94 engañoso, ROC AUC = 0,49 ≈ azar",
      "Regresión logística: problemas AUC 0,58 / F1 0,11 vs. uso terapéutico AUC 0,67 / F1 0,60",
      "OR más robusto: género masculino 2,44 (IC 1,51–4,14) · el malestar es idiosincrático, no estructurado por el consumo",
    ],
    metrica: { valor: "0,49 → 0,67", etiqueta: "AUC: del azar (problemas) a moderado (terapéutico)" }, visual: "roc", pie: "Curvas ROC comparativas (Figura 9)",
  },
  {
    kicker: "10 · Reproducibilidad", titulo: "22 scripts open source y doble verificación humano–IA", icono: Code2, color: "#a3e635",
    bullets: [
      "Pipeline completo en Python (pandas, scikit-learn, SciPy, Seaborn): del Excel crudo a las figuras del paper",
      "ChatGPT, Claude, Copilot y Codex como apoyo — nunca como evidencia: contraste cruzado + revisión manual",
      "Sin imputaciones, casos válidos por variable y decisiones documentadas (p. ej., 162 ramas de cultivo reclasificadas)",
    ],
    metrica: { valor: "22", etiqueta: "scripts verificados del Anexo 14" }, visual: "pesos", pie: "Importancia de variables del RF (§6.1.7)",
  },
  {
    kicker: "11 · Conclusiones", titulo: "Consumo integrado, conflicto externo y agenda de investigación", icono: Flag, color: "#34d399",
    bullets: [
      "Tres métodos convergen: no hay patrón de daño asociado a la intensidad del consumo en esta muestra",
      "El conflicto medido es legal (25,4% policial) más que sanitario (≈4%): insumo para políticas basadas en evidencia",
      "Futuro: estudios longitudinales, variables clínicas y de salud mental, muestras representativas y validación externa",
    ],
    metrica: { valor: "3 métodos", etiqueta: "convergentes en la misma conclusión" }, visual: "perfiles", pie: "Perfiles descriptivos de usuarios (§5.3)",
  },
];

function SlideVisual({ slide }: { slide: Slide }) {
  if (slide.visual === "muestra") {
    const max = Math.max(...EDAD_BINS.map((b) => b.pct));
    return (
      <div className="flex h-28 items-end gap-1.5">
        {EDAD_BINS.map((b) => (
          <div key={b.rango} className="flex flex-1 flex-col items-center gap-1">
            <motion.div className="w-full rounded-t bg-teal-300/80" initial={{ height: 0 }} animate={{ height: `${(b.pct / max) * 74}px` }} transition={{ duration: 0.55 }} />
            <span className="text-[8px] text-zinc-500">{b.rango}</span>
          </div>
        ))}
      </div>
    );
  }
  if (slide.visual === "frecuencia") {
    return (
      <div className="flex h-28 items-end gap-2">
        {FRECUENCIA.map((f) => (
          <div key={f.categoria} className="flex flex-1 flex-col items-center gap-1.5">
            <motion.div className="w-full rounded-t-md bg-amber-400/80" initial={{ height: 0 }} animate={{ height: `${(f.pct / 52) * 76}px` }} transition={{ duration: 0.6 }} />
            <span className="text-center text-[8.5px] leading-tight text-zinc-500">{f.categoria}</span>
          </div>
        ))}
      </div>
    );
  }
  if (slide.visual === "sociedad") {
    return (
      <div className="space-y-2.5 pt-1">
        {REGULACION.map((r) => (
          <div key={r.categoria}>
            <div className="mb-1 flex justify-between text-[11px] text-zinc-400"><span>{r.categoria}</span><span className="font-mono text-amber-300">{fmt(r.pct, 1)}%</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div className="h-full bg-amber-400" initial={{ width: 0 }} animate={{ width: `${r.pct}%` }} transition={{ duration: 0.7 }} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (slide.visual === "salud") {
    return (
      <div className="flex h-28 items-end justify-center gap-6 text-center">
        {[{ v: "83,3%", l: "mejoría ≥8/10" }, { v: "5,01", l: "efectos promedio" }, { v: "0,1%", l: "violencia" }].map((m) => (
          <div key={m.l}>
            <p className="font-display text-[22px] font-bold text-rose-300">{m.v}</p>
            <p className="mt-1 text-[9.5px] uppercase tracking-wide text-zinc-500">{m.l}</p>
          </div>
        ))}
      </div>
    );
  }
  if (slide.visual === "calor") {
    return (
      <div className="mx-auto grid max-w-[190px] gap-[2px]" style={{ gridTemplateColumns: `repeat(${CORR_VARS.length}, 1fr)` }}>
        {CORR_MATRIX.flatMap((row, i) => row.map((v, j) => (
          <span key={`${i}-${j}`} className="aspect-square rounded-[2px]" style={{ background: heatColor(v, i === j ? 0.45 : 0.92) }} />
        )))}
      </div>
    );
  }
  if (slide.visual === "pesos" || slide.visual === "codigo") {
    if (slide.visual === "codigo") {
      return (
        <div className="rounded-lg bg-black/50 p-3 font-mono text-[10px] leading-relaxed text-zinc-400">
          <p><span className="text-zinc-600">$</span> python scripts/14_2_dedup.py</p>
          <p className="text-emerald-300/90">Registros tras eliminar duplicados: 1046</p>
          <p><span className="text-zinc-600">$</span> python scripts/14_17_random_forest.py</p>
          <p className="text-emerald-300/90">Accuracy 0.9372 · ROC AUC 0.4910</p>
          <p><span className="text-zinc-600">$</span> python scripts/14_22_kmeans.py</p>
          <p className="text-emerald-300/90">{`{ "kmeans_silhouette": 0.19 }`}</p>
        </div>
      );
    }
    return (
      <div className="space-y-2.5">
        {RF_FEATURES.slice(0, 4).map((f) => (
          <div key={f.variable}>
            <div className="mb-1 flex justify-between text-[11px] text-zinc-400">
              <span>{f.variable}</span><span className="font-mono text-lime-300">{fmt(f.peso * 100, 1)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div className="h-full bg-lime-400" initial={{ width: 0 }} animate={{ width: `${(f.peso / 0.435) * 100}%` }} transition={{ duration: 0.7 }} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (slide.visual === "roc") {
    const pts = (arr: { fpr: number; tpr: number }[]) => arr.map((p) => `${6 + p.fpr * 88},${94 - p.tpr * 84}`).join(" L ");
    return (
      <div className="mx-auto max-w-[210px]">
        <svg viewBox="0 0 100 100" className="w-full">
          <rect x="6" y="10" width="88" height="84" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.09)" rx="3" />
          <line x1="6" y1="94" x2="94" y2="10" stroke="#71717a" strokeWidth="0.7" strokeDasharray="3 3" />
          <motion.path d={`M ${pts(ROC_LOGREG_TERAPEUTICO)}`} fill="none" stroke="#34d399" strokeWidth="2.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
          <motion.path d={`M ${pts(ROC_LOGREG_PROBLEMAS)}`} fill="none" stroke="#fbbf24" strokeWidth="2.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.15 }} />
          <motion.path d={`M ${pts(ROC_POINTS)}`} fill="none" stroke="#fb7185" strokeWidth="2.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.3 }} />
        </svg>
        <div className="mt-1 flex justify-center gap-3 font-mono text-[9px]">
          <span className="text-emerald-300">Terap. 0,67</span><span className="text-amber-300">Probl. 0,58</span><span className="text-rose-300">RF 0,49</span>
        </div>
      </div>
    );
  }
  if (slide.visual === "perfiles") {
    return (
      <div className="space-y-2">
        {[
          { n: "Recreativo integrado", v: "~45%", c: "#34d399", d: "frecuente, moderado, sin problemas" },
          { n: "Terapéutico-social", v: "~30%", c: "#38bdf8", d: "mayor edad, colectivos, autocuidado" },
          { n: "Minoría con conflicto", v: "≈25", c: "#fb7185", d: "conflicto legal/social concentrado" },
        ].map((p) => (
          <div key={p.n} className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: p.c }} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-zinc-100">{p.n}</p>
              <p className="truncate text-[10px] text-zinc-500">{p.d}</p>
            </div>
            <span className="font-mono text-[12px] font-bold" style={{ color: p.c }}>{p.v}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {Array.from({ length: 35 }, (_, k) => {
        const v = Math.sin(k * 1.3) * 0.5 + Math.cos(k * 0.4) * 0.5;
        return <span key={k} className="aspect-square rounded-[4px]" style={{ background: v >= 0 ? `hsl(152,60%,${15 + v * 32}%)` : `hsl(8,65%,${15 + Math.abs(v) * 32}%)` }} />;
      })}
    </div>
  );
}

export default function Presentation() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const slide = SLIDES[idx];
  const Icon = slide.icono;

  const go = useCallback((d: number) => {
    setDir(d);
    setIdx((p) => Math.max(0, Math.min(SLIDES.length - 1, p + d)));
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [go]);

  return (
    <div>
      <SectionHeader
        eyebrow="Modo Presentación"
        title="Presentación del paper completo"
        desc="Deck de 11 láminas que organiza todo el manuscrito: contexto, diseño, muestra, resultados, análisis avanzado, modelos, reproducibilidad y conclusiones. Navega con los botones o las flechas del teclado (← →)."
        right={<Badge tone="zinc"><Maximize2 size={12} /> {idx + 1} / {SLIDES.length}</Badge>}
      />

      <FadeIn>
        <Card className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 z-20 h-1 bg-white/[0.06]">
            <motion.div className="h-full bg-emerald-400" animate={{ width: `${((idx + 1) / SLIDES.length) * 100}%` }} transition={{ duration: 0.5 }} />
          </div>

          <div className="relative min-h-[440px] p-8 sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-[0.07]" style={{ background: slide.color }} />
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={idx}
                custom={dir}
                initial={{ opacity: 0, x: 60 * dir }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 * dir }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative grid items-center gap-10 lg:grid-cols-5"
              >
                <div className="lg:col-span-3">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${slide.color}1f`, color: slide.color }}>
                      <Icon size={21} />
                    </span>
                    <span className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: slide.color }}>{slide.kicker}</span>
                  </div>
                  <h3 className="font-display text-[25px] font-semibold leading-tight tracking-tight text-zinc-50 sm:text-[30px]">{slide.titulo}</h3>
                  <ul className="mt-6 space-y-3.5">
                    {slide.bullets.map((b, i) => (
                      <motion.li key={b} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.1 }}
                        className="flex gap-3 text-[14.5px] leading-relaxed text-zinc-300">
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: slide.color }} />
                        {b}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-2">
                  <div className="rounded-2xl border border-white/[0.08] bg-black/30 p-6">
                    <p className="font-display text-[36px] font-bold leading-none tracking-tight" style={{ color: slide.color }}>{slide.metrica.valor}</p>
                    <p className="mt-2 text-sm text-zinc-400">{slide.metrica.etiqueta}</p>
                    <div className="mt-6 border-t border-white/[0.07] pt-5">
                      <SlideVisual slide={slide} />
                      <p className="mt-3 text-center text-[10px] uppercase tracking-widest text-zinc-600">{slide.pie}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative flex items-center justify-between border-t border-white/[0.07] bg-black/20 px-6 py-4">
            <button onClick={() => go(-1)} disabled={idx === 0}
              className="flex items-center gap-1.5 rounded-lg bg-white/[0.05] px-3.5 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.1] disabled:opacity-35">
              <ChevronLeft size={16} /> Anterior
            </button>
            <div className="flex gap-1.5">
              {SLIDES.map((s, i) => (
                <button key={s.kicker} onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
                  aria-label={`Ir a la lámina ${i + 1}`}
                  className={cn("h-2 rounded-full transition-all duration-300", i === idx ? "w-7 bg-emerald-400" : "w-2 bg-white/20 hover:bg-white/40")} />
              ))}
            </div>
            <button onClick={() => go(1)} disabled={idx === SLIDES.length - 1}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-400 px-3.5 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300 disabled:opacity-35">
              Siguiente <ChevronRight size={16} />
            </button>
          </div>
        </Card>
      </FadeIn>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {SLIDES.map((s, i) => {
          const Ic = s.icono;
          return (
            <button key={s.kicker} onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
              className={cn("rounded-xl border p-3 text-left transition",
                i === idx ? "border-emerald-400/50 bg-emerald-400/[0.07]" : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.15]")}>
              <Ic size={16} style={{ color: s.color }} />
              <p className="mt-2 line-clamp-2 text-[11px] font-medium leading-snug text-zinc-300">{s.titulo}</p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-zinc-600">{s.kicker}</p>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-center text-xs text-zinc-600">
        Estructura del deck: contexto → diseño → evidencia descriptiva → análisis avanzado → modelos → reproducibilidad → conclusiones. Cada lámina remite a su sección del manuscrito (§).
      </p>
    </div>
  );
}
