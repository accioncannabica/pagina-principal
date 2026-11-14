import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "../../../lib/motion-lite";
import { FileCheck2, GitBranch, ListChecks, ChevronRight, CircleCheck, Telescope } from "lucide-react";
import { Card, SectionHeader, Badge, ProgressBar, FadeIn } from "./ui";
import { cn } from "../utils/cn";

type Estado = "Cumplido" | "Cumplido parcial" | "Línea futura";
interface Objetivo {
  id: string;
  titulo: string;
  metodo: string;
  seccion: string;
  estado: Estado;
  avance: number;
  evidencia: string;
}
const OBJETIVOS: Objetivo[] = [
  { id: "OE-01", titulo: "Caracterizar sociodemográficamente a los participantes", metodo: "Frecuencias, media/mediana/DE", seccion: "§4.1", estado: "Cumplido", avance: 100, evidencia: "Edad 31,1 (DE 10,8) · 61,5% masculino · AMBA 59,8% · n válido 933–1.041" },
  { id: "OE-02", titulo: "Analizar patrones, motivos y efectos percibidos (recreativo / terapéutico / mixto)", metodo: "Tablas de frecuencia multirrespuesta", seccion: "§4.2–4.3", estado: "Cumplido", avance: 100, evidencia: "Disfrute 86,1% · diario 52,0% · relaja 79,7% · multiefectos x̄=5,01" },
  { id: "OE-03", titulo: "Evaluar problemas/conflictos asociados, incl. experiencias policiales y judiciales", metodo: "Tablas de contingencia + χ²", seccion: "§4.5", estado: "Cumplido", avance: 100, evidencia: "Vida diaria ≈4% · policial 25,4% · detenidos 13,6% · Norte vs Patagonia p=0,406" },
  { id: "OE-04", titulo: "Explorar cultivo, acceso y autoabastecimiento", metodo: "Reclasificación reproducible (§14.4)", seccion: "§4.2.3 · §4.7", estado: "Cumplido", avance: 100, evidencia: "Cultiva 65,2% · cohorte n=743 · autoabastece 66,5% · procedencia desconocida 60,2%" },
  { id: "OE-05", titulo: "Investigar posicionamientos regulatorios y participación en colectivos", metodo: "Frecuencias y cruces descriptivos", seccion: "§4.6", estado: "Cumplido", avance: 100, evidencia: "Legalización 69,3% · colectivos 33,2% · Marcha 56,2%" },
  { id: "OE-06", titulo: "Explorar asociaciones entre variables clave", metodo: "Correlación de Pearson + χ²", seccion: "§5.1", estado: "Cumplido", avance: 100, evidencia: "Consumo×problemas r≈0,04 · mayoría |r|<0,20" },
  { id: "OE-07", titulo: "Aplicar PCA y determinar la varianza explicada", metodo: "PCA con StandardScaler (sklearn)", seccion: "§5.2", estado: "Cumplido", avance: 100, evidencia: "PC1 13,1% + PC2 9,1% ≈ 22% · sin eje dominante" },
  { id: "OE-08", titulo: "Identificar y caracterizar perfiles de usuarios/as", metodo: "K-Means k=3 + silhouette", seccion: "§5.3 · §6.2", estado: "Cumplido parcial", avance: 78, evidencia: "3 perfiles descriptivos · silhouette 0,19 (fronteras difusas)" },
  { id: "OE-09", titulo: "Modelos predictivos exploratorios de problemas y uso terapéutico", metodo: "Random Forest + regresión logística, ROC", seccion: "§6.1 · §6.5 · §6.6", estado: "Cumplido parcial", avance: 72, evidencia: "RF AUC 0,49 · Logística problemas AUC 0,58/F1 0,11 · Logística terapéutico AUC 0,67/F1 0,60" },
  { id: "OE-10", titulo: "Proponer líneas de investigación futura", metodo: "Síntesis multidisciplinaria", seccion: "§11–12", estado: "Cumplido", avance: 100, evidencia: "Longitudinales, variables clínicas, modelos supervisados, comparativos regionales" },
  { id: "OE-11", titulo: "Profundizar policonsumo, comorbilidades y diferencias entre países", metodo: "Diseños futuros / ampliación de muestra", seccion: "§2.7.2 · §12", estado: "Línea futura", avance: 15, evidencia: "Formulado como ampliación posible del estudio actual" },
];

const TECNICAS = ["Descriptivo", "χ²", "Pearson", "PCA", "K-Means", "Random Forest", "Logística"];
const MATRIZ: Record<string, string[]> = {
  "OE-01": ["Descriptivo"], "OE-02": ["Descriptivo"], "OE-03": ["Descriptivo", "χ²"],
  "OE-04": ["Descriptivo"], "OE-05": ["Descriptivo", "χ²"], "OE-06": ["Pearson", "χ²"],
  "OE-07": ["PCA"], "OE-08": ["K-Means", "PCA"], "OE-09": ["Random Forest", "Logística"],
  "OE-10": [], "OE-11": [],
};
const ESTADO_TONE: Record<Estado, "emerald" | "amber" | "sky"> = { Cumplido: "emerald", "Cumplido parcial": "amber", "Línea futura": "sky" };

export default function Specs() {
  const [sel, setSel] = useState<Objetivo>(OBJETIVOS[7]);
  const [filtro, setFiltro] = useState<string>("Todos");
  const visibles = OBJETIVOS.filter((o) => filtro === "Todos" || o.estado === filtro);
  const counts = useMemo(() => {
    const m = new Map<Estado, number>();
    OBJETIVOS.forEach((o) => m.set(o.estado, (m.get(o.estado) ?? 0) + 1));
    return m;
  }, []);
  const avance = Math.round(OBJETIVOS.reduce((a, o) => a + o.avance, 0) / OBJETIVOS.length);

  return (
    <div>
      <SectionHeader
        eyebrow="Spec-Driven · Protocolo del estudio"
        title="Objetivos específicos como especificaciones verificables"
        desc="El estudio es exploratorio, sin hipótesis confirmatorias a priori (§2.7): cada objetivo específico funciona como una especificación con método asignado, sección del manuscrito donde se resuelve y evidencia numérica trazable a los scripts del Anexo 14."
        right={<Badge tone="emerald">Avance global {avance}%</Badge>}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <FadeIn className="xl:col-span-2">
          <Card className="p-5">
            <div className="mb-4 flex flex-wrap gap-1.5">
              {["Todos", "Cumplido", "Cumplido parcial", "Línea futura"].map((e) => (
                <button key={e} onClick={() => setFiltro(e)}
                  className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition",
                    filtro === e ? "bg-emerald-400 text-emerald-950" : "bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-200")}>
                  {e} {e !== "Todos" && <span className="opacity-60">({counts.get(e as Estado) ?? 0})</span>}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {visibles.map((o) => {
                  const activo = sel.id === o.id;
                  return (
                    <motion.button layout key={o.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }}
                      onClick={() => setSel(o)}
                      className={cn("flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition",
                        activo ? "border-emerald-400/40 bg-emerald-400/[0.06]" : "border-white/[0.05] bg-white/[0.02] hover:border-white/[0.12]")}>
                      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        o.estado === "Cumplido" ? "bg-emerald-400/10 text-emerald-300" : o.estado === "Cumplido parcial" ? "bg-amber-400/10 text-amber-300" : "bg-sky-400/10 text-sky-300")}>
                        {o.estado === "Línea futura" ? <Telescope size={17} /> : <CircleCheck size={17} />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="font-mono text-[11px] text-zinc-500">{o.id} · {o.seccion}</span>
                        <span className="mt-0.5 block truncate text-sm font-medium text-zinc-100">{o.titulo}</span>
                      </span>
                      <span className="hidden w-24 shrink-0 sm:block">
                        <span className="mb-1 flex justify-between text-[10px] text-zinc-500"><span>Avance</span><span className="font-mono text-zinc-300">{o.avance}%</span></span>
                        <ProgressBar value={o.avance} tone={o.avance === 100 ? "emerald" : "amber"} />
                      </span>
                      <ChevronRight size={16} className={cn("shrink-0 transition", activo ? "text-emerald-300" : "text-zinc-600")} />
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </Card>
        </FadeIn>

        <FadeIn delay={0.08}>
          <Card className="sticky top-28 p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-zinc-500">{sel.id} · {sel.seccion}</span>
              <Badge tone={ESTADO_TONE[sel.estado]}>{sel.estado}</Badge>
            </div>
            <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-zinc-50">{sel.titulo}</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-3 border-b border-white/[0.05] pb-2.5">
                <span className="text-zinc-500">Método asignado</span><span className="text-right font-medium text-zinc-200">{sel.metodo}</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.05] pb-2.5">
                <span className="text-zinc-500">Resuelto en</span><span className="font-mono font-medium text-zinc-200">{sel.seccion}</span>
              </div>
              <div>
                <div className="mb-1.5 flex justify-between">
                  <span className="text-zinc-500">Grado de cumplimiento</span>
                  <span className="font-mono font-medium text-emerald-300">{sel.avance}%</span>
                </div>
                <ProgressBar value={sel.avance} tone={sel.avance === 100 ? "emerald" : "amber"} />
              </div>
            </div>
            <div className="mt-5 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] p-3.5 text-xs leading-relaxed text-emerald-100/80">
              <span className="mb-1 flex items-center gap-1.5 font-semibold text-emerald-300"><ListChecks size={13} /> Evidencia trazable</span>
              {sel.evidencia}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-zinc-600">
              Los «cumplidos parciales» reflejan resultados técnicamente ejecutados cuya interpretación es limitada por diseño (silhouette bajo, AUC ≈ azar): el objetivo se resolvió, y su resultado es informativo en sí mismo.
            </p>
          </Card>
        </FadeIn>
      </div>

      <FadeIn>
        <Card className="mt-4 p-5">
          <div className="mb-1 flex items-center gap-2.5">
            <GitBranch size={18} className="text-emerald-300" />
            <h3 className="font-display text-base font-semibold text-zinc-100">Matriz de trazabilidad · Objetivo × Técnica analítica</h3>
          </div>
          <p className="mb-4 text-xs text-zinc-500">Cada objetivo se resuelve con técnicas declaradas en la estrategia analítica (§3.6). Intensidad = peso de la técnica en ese objetivo.</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-separate text-sm" style={{ borderSpacing: 3 }}>
              <thead>
                <tr>
                  <th className="p-2 text-left text-[11px] font-medium uppercase tracking-wider text-zinc-500">Objetivo</th>
                  {TECNICAS.map((t) => <th key={t} className="p-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">{t}</th>)}
                  <th className="p-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">Estado</th>
                </tr>
              </thead>
              <tbody>
                {OBJETIVOS.map((o) => (
                  <tr key={o.id} onClick={() => setSel(o)} className="cursor-pointer">
                    <td className="rounded-l-lg bg-white/[0.02] px-2 py-2">
                      <span className="font-mono text-[11px] text-zinc-500">{o.id}</span>
                      <span className="block max-w-[250px] truncate text-xs font-medium text-zinc-200">{o.titulo}</span>
                    </td>
                    {TECNICAS.map((t) => {
                      const usadas = MATRIZ[o.id];
                      const idx = usadas.indexOf(t);
                      const on = idx >= 0;
                      const principal = idx === 0;
                      return (
                        <td key={t} className="rounded-md px-2 py-2 text-center font-mono text-xs"
                          style={{
                            background: on ? `hsla(152,65%,${principal ? 38 : 24}%,0.9)` : "rgba(255,255,255,0.025)",
                            color: on ? "#ecfdf5" : "#52525b",
                          }}>
                          {on ? (principal ? "Principal" : "Apoyo") : "—"}
                        </td>
                      );
                    })}
                    <td className="rounded-r-lg bg-white/[0.02] px-2 py-2 text-center"><Badge tone={ESTADO_TONE[o.estado]}>{o.estado}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
            <FileCheck2 size={14} className="text-emerald-300" />
            11 especificaciones · 8 cumplidas · 2 parciales (resultado informativo) · 1 línea futura · trazabilidad objetivo → técnica → sección → script.
          </div>
        </Card>
      </FadeIn>
    </div>
  );
}
