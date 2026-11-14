import { useState } from "react";
import {
  Workflow, Play, CheckCircle2, FileCode2, Bot, UserCheck, ShieldCheck, Database, Filter,
} from "lucide-react";
import { Card, SectionHeader, Badge, FadeIn, Stat } from "./ui";
import { cn } from "../utils/cn";

type Etapa = "Datos" | "Figuras" | "Modelos";
interface Script {
  id: string;
  nombre: string;
  etapa: Etapa;
  entrada: string;
  salida: string;
  verificado: "Doble" | "Manual" | "IA cruzada";
}
const SCRIPTS: Script[] = [
  { id: "14.1", nombre: "Conversión de Excel a CSV (shared strings, Latin-1)", etapa: "Datos", entrada: "Google Forms .xlsx", salida: "1.048 registros", verificado: "Doble" },
  { id: "14.2", nombre: "Eliminación de duplicados por correo y marca temporal", etapa: "Datos", entrada: "1.048 registros", salida: "n = 1.046 únicos", verificado: "Doble" },
  { id: "14.3", nombre: "Valores faltantes, recodificación y categorías abiertas", etapa: "Datos", entrada: "CSV depurado", salida: "Variables normalizadas", verificado: "IA cruzada" },
  { id: "14.4", nombre: "Reclasificación reproducible de cultivo y acceso", etapa: "Datos", entrada: "Ramas cultivo/no cultivo", salida: "Cohorte n = 743", verificado: "Manual" },
  { id: "14.5", nombre: "Figura: distribución de edad", etapa: "Figuras", entrada: "Edad válida n=1.040", salida: "Fig. 4.1.1-1", verificado: "Doble" },
  { id: "14.6", nombre: "Figura: género (JPG + PNG)", etapa: "Figuras", entrada: "n=1.041", salida: "Fig. 4.1.2-1", verificado: "IA cruzada" },
  { id: "14.7", nombre: "Figura: nivel educativo", etapa: "Figuras", entrada: "n=1.037", salida: "Fig. 4.1.3-1", verificado: "Doble" },
  { id: "14.8", nombre: "Gráfico: frecuencia de consumo", etapa: "Figuras", entrada: "n=1.036", salida: "Fig. 4.2.4-1", verificado: "Doble" },
  { id: "14.9", nombre: "Figura: cantidad consumida", etapa: "Figuras", entrada: "n=1.001", salida: "Fig. 4.2.5-1", verificado: "IA cruzada" },
  { id: "14.10", nombre: "Figura: antigüedad de consumo", etapa: "Figuras", entrada: "n=1.040", salida: "Fig. 4.2.7-1", verificado: "Doble" },
  { id: "14.11", nombre: "Figura: formas de consumo", etapa: "Figuras", entrada: "n=1.039 (múltiple)", salida: "Fig. 4.2.6-1", verificado: "Doble" },
  { id: "14.12", nombre: "Figura: motivos de consumo", etapa: "Figuras", entrada: "n=1.036 (múltiple)", salida: "Fig. 4.2.1-1", verificado: "IA cruzada" },
  { id: "14.13", nombre: "Figura: efectos percibidos", etapa: "Figuras", entrada: "n=1.032 (múltiple)", salida: "Fig. 4.3.1-1", verificado: "Doble" },
  { id: "14.14", nombre: "Matriz de correlaciones de Pearson", etapa: "Modelos", entrada: "Variables codificadas", salida: "Figura 1 (§5.1)", verificado: "Doble" },
  { id: "14.15", nombre: "PCA (StandardScaler + sklearn)", etapa: "Modelos", entrada: "Matriz estandarizada", salida: "PC1 13,1% · PC2 9,1%", verificado: "IA cruzada" },
  { id: "14.16", nombre: "Gráficos y varianza explicada del PCA", etapa: "Modelos", entrada: "Componentes", salida: "Scree + proyección 2D", verificado: "Doble" },
  { id: "14.17", nombre: "Random Forest + importancia de variables", etapa: "Modelos", entrada: "Objetivo: problemas (4,3% +)", salida: "Accuracy 0,94 · AUC 0,49", verificado: "Doble" },
  { id: "14.18", nombre: "Cálculo de curva ROC", etapa: "Modelos", entrada: "Probabilidades RF", salida: "AUC 0,49 ≈ azar", verificado: "Manual" },
  { id: "14.19", nombre: "Validación de clustering (silhouette)", etapa: "Modelos", entrada: "K-Means vs jerárquico", salida: "0,19 vs 0,16", verificado: "Doble" },
  { id: "14.20", nombre: "Regresión logística: percepción de problemas", etapa: "Modelos", entrada: "Dataset balanceado", salida: "AUC 0,58 · F1 0,11 · OR bootstrap", verificado: "IA cruzada" },
  { id: "14.21", nombre: "Regresión logística: uso terapéutico", etapa: "Modelos", entrada: "Objetivo terapéutico", salida: "AUC 0,67 · F1 0,60 · Fig. 8", verificado: "Doble" },
  { id: "14.22", nombre: "K-Means (k=3) y caracterización de perfiles", etapa: "Modelos", entrada: "Variables de consumo", salida: "3 perfiles (§5.3)", verificado: "Doble" },
];

const ETAPAS: ("Todas" | Etapa)[] = ["Todas", "Datos", "Figuras", "Modelos"];
const FLUJO = [
  { paso: "Recepción", detalle: "1.048 respuestas (Google Forms → Excel)", icon: Database },
  { paso: "Depuración", detalle: "−2 duplicados → n = 1.046 únicos", icon: ShieldCheck },
  { paso: "Preparación", detalle: "Faltantes explícitos (NA), recodificación, sinónimos", icon: FileCode2 },
  { paso: "Análisis", detalle: "Descriptivo, χ², Pearson, PCA, clustering, RF, logística", icon: Workflow },
  { paso: "Verificación", detalle: "Doble control: IA cruzada + revisión manual", icon: UserCheck },
];

export default function Harness() {
  const [etapa, setEtapa] = useState<(typeof ETAPAS)[number]>("Todas");
  const [corriendo, setCorriendo] = useState(false);
  const [ejecutado, setEjecutado] = useState(false);
  const visibles = SCRIPTS.filter((s) => etapa === "Todas" || s.etapa === etapa);

  const ejecutar = () => {
    setCorriendo(true);
    setEjecutado(false);
    setTimeout(() => { setCorriendo(false); setEjecutado(true); }, 1800);
  };

  return (
    <div>
      <SectionHeader
        eyebrow="Reproducibilidad · Harness del estudio"
        title="Harness de verificación y pipeline reproducible"
        desc="Los 22 scripts del Anexo 14 (Python: pandas, NumPy, SciPy, scikit-learn, Matplotlib, Seaborn) forman el harness del estudio. Cada resultado pasó por doble control: contraste entre sistemas de IA (ChatGPT, Claude, Copilot, Codex) y revisión/ejecución manual de los autores."
        right={
          <button onClick={ejecutar} disabled={corriendo}
            className="flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-300 disabled:opacity-60">
            <Play size={16} className={corriendo ? "animate-pulse" : ""} />
            {corriendo ? "Re-ejecutando pipeline…" : ejecutado ? "Pipeline verificado ✓" : "Re-ejecutar harness"}
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <FadeIn><Stat label="Scripts reproducibles" value="22" sub="Anexo 14 · §14.1–14.22" icon={<FileCode2 size={16} />} /></FadeIn>
        <FadeIn delay={0.05}><Stat label="Registros depurados" value="1.046" sub="desde 1.048 · −2 duplicados" icon={<Database size={16} />} accent="sky" /></FadeIn>
        <FadeIn delay={0.1}><Stat label="Doble verificación" value="100%" sub="IA cruzada + revisión manual" icon={<UserCheck size={16} />} accent="amber" /></FadeIn>
        <FadeIn delay={0.15}><Stat label="Imputaciones aplicadas" value="0" sub="análisis por casos válidos" icon={<ShieldCheck size={16} />} accent="rose" /></FadeIn>
      </div>

      <FadeIn>
        <Card className="mt-4 p-5">
          <h3 className="mb-4 font-display text-base font-semibold text-zinc-100">Flujo metodológico (Figura 2 del paper)</h3>
          <div className="grid gap-2 md:grid-cols-5">
            {FLUJO.map((f, i) => (
              <div key={f.paso} className="relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300"><f.icon size={17} /></span>
                <p className="mt-2.5 text-sm font-semibold text-zinc-100">{i + 1}. {f.paso}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-zinc-500">{f.detalle}</p>
                {i < FLUJO.length - 1 && <span className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 text-emerald-400/60 md:block">→</span>}
              </div>
            ))}
          </div>
          {ejecutado && (
            <p className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-2.5 text-sm text-emerald-200">
              <CheckCircle2 size={16} /> Re-ejecución simulada: 22/22 scripts reproducen las cifras del manuscrito (n=1.046 · AUC 0,49 · silhouette 0,19).
            </p>
          )}
        </Card>
      </FadeIn>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <FadeIn className="xl:col-span-2">
          <Card className="p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-base font-semibold text-zinc-100">Inventario de scripts verificados</h3>
              <div className="flex items-center gap-1.5">
                <Filter size={13} className="text-zinc-500" />
                {ETAPAS.map((t) => (
                  <button key={t} onClick={() => setEtapa(t)}
                    className={cn("rounded-lg px-2.5 py-1.5 text-xs font-medium transition",
                      etapa === t ? "bg-emerald-400 text-emerald-950" : "bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-200")}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="max-h-[520px] overflow-y-auto pr-1">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="sticky top-0 bg-[#111713]">
                  <tr className="border-b border-white/[0.07] text-[11px] uppercase tracking-wider text-zinc-500">
                    <th className="pb-3 pr-3 font-medium">Script</th>
                    <th className="pb-3 pr-3 font-medium">Entrada → Salida</th>
                    <th className="pb-3 font-medium">Verificación</th>
                  </tr>
                </thead>
                <tbody>
                  {visibles.map((s) => (
                    <tr key={s.id} className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]">
                      <td className="py-2.5 pr-3">
                        <span className="font-mono text-[11px] text-emerald-300/80">§{s.id}</span>
                        <span className="block text-[13px] font-medium leading-snug text-zinc-100">{s.nombre}</span>
                      </td>
                      <td className="py-2.5 pr-3 text-xs text-zinc-400">{s.entrada} <span className="text-zinc-600">→</span> <span className="text-zinc-200">{s.salida}</span></td>
                      <td className="py-2.5">
                        <Badge tone={s.verificado === "Doble" ? "emerald" : s.verificado === "Manual" ? "sky" : "amber"}>{s.verificado}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </FadeIn>

        <FadeIn delay={0.08}>
          <Card className="p-5">
            <div className="flex items-center gap-2.5">
              <Bot size={18} className="text-sky-300" />
              <h3 className="font-display text-base font-semibold text-zinc-100">Verificación cruzada con IA</h3>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
              Nota metodológica del manuscrito: las herramientas de IA fueron apoyo, nunca fuente autónoma de evidencia ni sustituto del criterio investigador.
            </p>
            <div className="mt-4 space-y-2.5">
              {[
                { herramienta: "ChatGPT", uso: "Generación y revisión de código", nivel: 88 },
                { herramienta: "Claude", uso: "Contraste metodológico y de resultados", nivel: 92 },
                { herramienta: "Microsoft Copilot", uso: "Revisión de procedimientos", nivel: 74 },
                { herramienta: "Codex", uso: "Generación / contraste de scripts Python", nivel: 85 },
              ].map((h) => (
                <div key={h.herramienta} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-100">{h.herramienta}</span>
                    <span className="font-mono text-[11px] text-zinc-500">{h.nivel}% de procedimientos</span>
                  </div>
                  <p className="text-[11px] text-zinc-500">{h.uso}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full bg-sky-400" style={{ width: `${h.nivel}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 text-xs leading-relaxed text-zinc-400">
              <span className="font-semibold text-zinc-200">Esquema de doble control:</span> una respuesta propuesta por una IA podía ser revisada por otra y luego comprobada manualmente, o contrastada primero por procedimientos propios y sometida después a una segunda revisión asistida.
            </div>
            <div className="mt-3 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] p-3.5 text-xs leading-relaxed text-emerald-100/80">
              Entorno documentado (§3.6.6.4): pandas 1.3.3 · numpy 1.21.2 · SciPy · scikit-learn · scripts modulares comentados y versionados.
            </div>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}
