import { useEffect, useMemo, useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  FlaskConical,
  FileCheck2,
  GraduationCap,
  ClipboardList,
  BarChart3,
  Flame,
  Presentation,
  BookOpenCheck,
  Leaf,
  FileText,
  ChevronRight,
  Code2,
  BookMarked,
  Mail,
} from "lucide-react";

import Overview from "./components/Overview";
import Harness from "./components/Harness";
import Specs from "./components/Specs";
import Skills from "./components/Skills";
import Mockups from "./components/Mockups";
import Eda from "./components/Eda";
import Heatmap from "./components/Heatmap";
import PresentationView from "./components/Presentation";
import Conclusions from "./components/Conclusions";
import Codigo from "./components/Codigo";
import Referencias from "./components/Referencias";
import Contacto from "./components/Contacto";
import { cn } from "./utils/cn";

import "./styles/patrones.css";

export type SectionId =
  | "resumen"
  | "harness"
  | "specs"
  | "skills"
  | "encuesta"
  | "eda"
  | "avanzado"
  | "presentacion"
  | "conclusiones"
  | "codigo"
  | "referencias"
  | "contacto";

type PatronesPageProps = {
  initialSection?: SectionId;
  onSectionChange?: (section: SectionId) => void;
};

const NAV: { id: SectionId; label: string; icon: typeof LayoutDashboard; grupo: string; desc: string }[] = [
  { id: "resumen", label: "Resumen del estudio", icon: LayoutDashboard, grupo: "Investigación", desc: "Muestra y hallazgos clave" },
  { id: "eda", label: "Exploración (EDA)", icon: BarChart3, grupo: "Investigación", desc: "Resultados descriptivos §4" },
  { id: "avanzado", label: "Mapa de calor y pesos", icon: Flame, grupo: "Investigación", desc: "Correlaciones · PCA · RF §5–6" },
  { id: "harness", label: "Harness reproducible", icon: FlaskConical, grupo: "Metodología", desc: "22 scripts · doble verificación" },
  { id: "specs", label: "Protocolo Spec-Driven", icon: FileCheck2, grupo: "Metodología", desc: "Objetivos y trazabilidad" },
  { id: "skills", label: "Equipo y Skills", icon: GraduationCap, grupo: "Metodología", desc: "Matriz multidisciplinaria" },
  { id: "encuesta", label: "Encuesta interactiva", icon: ClipboardList, grupo: "Instrumento", desc: "Mockup + instrumento §13.1" },
  { id: "codigo", label: "Anexo de código", icon: Code2, grupo: "Metodología", desc: "22 scripts Python §14" },
  { id: "presentacion", label: "Presentación", icon: Presentation, grupo: "Entrega", desc: "Deck del paper" },
  { id: "conclusiones", label: "Conclusiones", icon: BookOpenCheck, grupo: "Entrega", desc: "Hallazgos y veredicto" },
  { id: "referencias", label: "Glosario y fuentes", icon: BookMarked, grupo: "Entrega", desc: "Términos y bibliografía §15–16" },
  { id: "contacto", label: "Contacto", icon: Mail, grupo: "Entrega", desc: "Mail e Instagram oficiales" },
];

const VIEWS: Record<SectionId, ComponentType> = {
  resumen: Overview,
  harness: Harness,
  specs: Specs,
  skills: Skills,
  encuesta: Mockups,
  eda: Eda,
  avanzado: Heatmap,
  presentacion: PresentationView,
  conclusiones: Conclusions,
  codigo: Codigo,
  referencias: Referencias,
  contacto: Contacto,
};

const TICKER: [string, string, string][] = [
  ["Muestra final", "n = 1.046", "21 meses"],
  ["Consumo diario", "52,0%", "n=539"],
  ["Efecto «relaja»", "79,7%", "n=822"],
  ["Mejoría ≥8/10", "83,3%", "terapéuticos"],
  ["Violencia", "0,1%", "1 caso"],
  ["Consumo × problemas", "r ≈ 0,04", "nulo"],
  ["ROC AUC (RF)", "0,49", "≈ azar"],
  ["Silhouette", "0,19", "k=3"],
  ["Legalización", "69,3%", "apoyo"],
  ["Autocultivo", "65,2%", "acceso"],
];

const isSection = (value: string | undefined): value is SectionId => NAV.some((item) => item.id === value);

export function PatronesPage({ initialSection, onSectionChange }: PatronesPageProps) {
  const [section, setSection] = useState<SectionId>(() => (isSection(initialSection) ? initialSection : "resumen"));
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const View = VIEWS[section];
  const activa = NAV.find((item) => item.id === section)!;
  const grupos = useMemo(() => [...new Set(NAV.map((item) => item.grupo))], []);
  const navItems = useMemo(() => grupos.map((grupo) => ({ grupo, items: NAV.filter((item) => item.grupo === grupo) })), [grupos]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (isSection(initialSection) && initialSection !== section) {
      setSection(initialSection);
    }
  }, [initialSection, section]);

  useEffect(() => {
    onSectionChange?.(section);
    if (typeof window !== "undefined") {
      const hash = `#patrones/${section}`;
      if (window.location.hash !== hash) {
        history.replaceState(null, "", hash);
      }
    }
  }, [section, onSectionChange]);

  const ir = (id: SectionId) => {
    setSection(id);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="patrones-root space-y-6">
      <div className="rounded-3xl border border-white/10 bg-ink-950/85 p-4 shadow-xl shadow-ink-900/40 sm:p-6">
        <header className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lima-400 text-ink-950 shadow-lg shadow-lima-500/25">
                <Leaf size={22} strokeWidth={2.2} />
              </span>
              <div className="min-w-0">
                <p className="font-display text-sm font-semibold leading-tight text-white">Acción Cannábica · Investigación</p>
                <p className="text-[10px] uppercase tracking-[0.24em] text-emerald-50/50">Patrones de consumo y percepciones de salud</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-emerald-50/70">
              <span className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-lima-400" /> n = 1.046
              </span>
              <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5">Junio 2026</span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/25">
            <div className="ticker-track flex w-max items-center gap-8 px-5 py-1.5">
              {[...TICKER, ...TICKER].map(([k, v, d], index) => (
                <span key={`${k}-${index}`} className="flex items-center gap-2 whitespace-nowrap text-[11px] text-emerald-50/65">
                  <span>{k}</span>
                  <span className="font-mono font-semibold text-emerald-50">{v}</span>
                  <span className="font-mono text-emerald-50/55">{d}</span>
                </span>
              ))}
            </div>
          </div>
        </header>

        <nav className="mt-4 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 sm:px-6">
          {navItems.map(({ grupo, items }) => (
            <div key={grupo} className="flex items-center gap-1.5">
              <span className="mr-1 text-[9px] font-semibold uppercase tracking-[0.3em] text-emerald-50/40">{grupo}</span>
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => ir(item.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    section === item.id
                      ? "border-lima-400/50 bg-lima-400 text-ink-900 shadow-lg shadow-lima-500/30"
                      : "border-white/10 bg-white/[0.06] text-emerald-50/70 hover:border-lima-300/40 hover:text-white"
                  )}
                  aria-current={section === item.id ? "page" : undefined}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2 text-[11px] text-emerald-50/65 sm:px-6">
          <span className="font-semibold text-emerald-100">{activa.label}</span>
          <ChevronRight size={12} className="text-emerald-50/40" />
          <span className="truncate text-emerald-50/55">{activa.desc}</span>
        </div>

        <main className="mt-5">
          <AnimatePresence mode="wait" initial={!prefersReducedMotion}>
            <motion.div
              key={section}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <View />
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-5 text-xs text-emerald-50/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="flex items-center gap-2">
            <Leaf size={13} className="text-lima-300" />
            «Patrones de consumo de cannabis y percepciones de salud» · Acción Cannábica · Estudio exploratorio (sin inferencia causal).
          </p>
          <p className="flex flex-wrap items-center gap-3 font-mono">
            <a href="mailto:accioncannabica@gmail.com" className="flex items-center gap-1.5 transition hover:text-lima-200">
              <Mail size={12} /> accioncannabica@gmail.com
            </a>
            <a
              href="https://www.instagram.com/accannabica"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 transition hover:text-rose-200"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              @accannabica
            </a>
            <span>n=1.046 · 2018–2020 · Junio 2026</span>
          </p>
        </footer>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4 text-xs text-emerald-50/60 sm:p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-emerald-100">
          <FileText size={14} className="text-lima-300" /> Metodología del estudio
        </h2>
        <p className="mt-2 leading-relaxed">
          Manuscrito incorporado · junio 2026 · 22 scripts verificados. Estudio transversal sin inferencia causal, basado en una encuesta online autoadministrada
          (2018–2020). El módulo conserva las dinámicas originales del micrositio: navegación contextual, ticker de hallazgos y componentes analíticos alimentados desde
          `research.ts`.
        </p>
      </div>
    </div>
  );
}
