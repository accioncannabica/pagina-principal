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
  Menu,
  X,
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

type SectionId =
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const View = VIEWS[section];
  const activa = NAV.find((item) => item.id === section)!;
  const grupos = useMemo(() => [...new Set(NAV.map((item) => item.grupo))], []);

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
    setMenuOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navContent = (
    <div className="flex h-full flex-col gap-4">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lima-400 text-ink-950 shadow-lg shadow-lima-500/25">
            <Leaf size={22} strokeWidth={2.2} />
          </span>
          <div className="min-w-0">
            <p className="font-display text-sm font-semibold leading-tight text-white">Acción Cannábica</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-emerald-50/60">Estudio de usuarios/as</p>
          </div>
          <button
            className="ml-auto rounded-lg border border-white/[0.08] p-1.5 text-emerald-50/60 transition hover:border-white/20 hover:text-emerald-200 lg:hidden"
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
          >
            <X size={16} />
          </button>
        </div>
        <div className="mt-4 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 text-[11px] text-emerald-50/70">
          <div className="flex items-center gap-2 font-medium text-emerald-50">
            <FileText size={13} className="text-lima-300" />
            <span className="truncate">1paper_investigacion.pdf</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full w-full rounded-full bg-lima-400" />
          </div>
          <p className="mt-2 text-[10.5px] leading-snug text-emerald-50/60">Manuscrito incorporado · junio 2026 · 22 scripts verificados</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto pr-1 text-left">
        {grupos.map((grupo) => (
          <div key={grupo} className="space-y-2">
            <p className="px-2 font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-50/40">{grupo}</p>
            <div className="space-y-1.5">
              {NAV.filter((item) => item.grupo === grupo).map((item) => {
                const Icon = item.icon;
                const isActive = section === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => ir(item.id)}
                    className={cn(
                      "group relative flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left transition-all",
                      isActive
                        ? "border-lima-400/40 bg-lima-400/15 text-white shadow-inner"
                        : "text-emerald-50/70 hover:border-lima-400/30 hover:bg-lima-400/10 hover:text-white"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {isActive && <motion.span layoutId="patrones-nav" className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-lima-400" />}
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-lima-200 group-hover:border-lima-300/40">
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold leading-tight">{item.label}</span>
                      <span className="block truncate text-[10.5px] text-emerald-50/50">{item.desc}</span>
                    </span>
                    {isActive && <ChevronRight size={14} className="text-lima-200" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 text-[11px] text-emerald-50/70">
        <p className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lima-400/20 text-lima-300"><Leaf size={14} /></span>
          Asociación Civil Acción Cannábica
        </p>
        <p className="mt-2 font-mono text-[10px] text-emerald-50/50">IGJ 1921803 · Argentina</p>
      </div>
    </div>
  );

  return (
    <div className="patrones-root">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-950/80 p-4 shadow-xl shadow-ink-950/40 sm:p-6">
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[280px,1fr]">
          <aside className="hidden h-full lg:block">{navContent}</aside>

          <div className="flex min-w-0 flex-col gap-6">
            <header className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-emerald-50/70 transition hover:border-lima-400/40 hover:text-lima-200 lg:hidden"
                  onClick={() => setMenuOpen(true)}
                  aria-label="Abrir menú"
                >
                  <Menu size={20} />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-[0.35em] text-emerald-50/40">Cannabis y salud en LatAm</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-emerald-50">
                    <span className="font-semibold">{activa.label}</span>
                    <ChevronRight size={14} className="text-emerald-50/40" />
                    <span className="truncate text-emerald-50/60">{activa.desc}</span>
                  </div>
                </div>
                <div className="hidden items-center gap-2 md:flex">
                  <span className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-emerald-50/70">
                    <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-lima-400" />
                    <span className="font-mono font-semibold text-lima-200">n = 1.046</span>
                  </span>
                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-emerald-50/60">Junio 2026</span>
                </div>
              </div>

              <div className="relative overflow-hidden border-t border-white/10 bg-black/20">
                <div className="ticker-track flex w-max items-center gap-10 px-6 py-1.5">
                  {[...TICKER, ...TICKER].map(([k, v, d], index) => (
                    <span key={`${k}-${index}`} className="flex items-center gap-2 whitespace-nowrap text-[11px] text-emerald-50/60">
                      <span>{k}</span>
                      <span className="font-mono font-semibold text-emerald-50">{v}</span>
                      <span className="font-mono text-emerald-50/55">{d}</span>
                    </span>
                  ))}
                </div>
              </div>
            </header>

            <main className="min-w-0">
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

            <footer className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-5 text-xs text-emerald-50/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
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
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                  @accannabica
                </a>
                <span>n=1.046 · 2018–2020 · Junio 2026</span>
              </p>
            </footer>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="fixed inset-0 z-40 flex items-start justify-center bg-ink-950/80 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className="absolute inset-0"
              aria-label="Cerrar menú"
              onClick={() => setMenuOpen(false)}
            />
            <div className="relative z-10 mt-16 w-full max-w-sm px-4">
              <div className="rounded-3xl border border-white/10 bg-ink-950/95 p-4 shadow-2xl shadow-black/50">
                {navContent}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export type { SectionId };
