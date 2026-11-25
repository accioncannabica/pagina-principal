import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Binary,
  BookOpen,
  Boxes,
  CheckCircle2,
  CircleDot,
  Database,
  Factory,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  Leaf,
  LineChart,
  Network,
  Scale,
  Search,
  ShieldAlert,
  Sigma,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import { Badge, Card, FadeIn, SectionHeader } from "./ui";

type CienciaDatosProps = {
  onVerResumen?: () => void;
};

const PILARES = [
  { titulo: "Datos", texto: "La información disponible", icono: Database, tono: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20" },
  { titulo: "Estadística", texto: "Métodos para interpretar", icono: Sigma, tono: "text-sky-300 bg-sky-400/10 border-sky-400/20" },
  { titulo: "Tecnología", texto: "Herramientas para procesar", icono: Binary, tono: "text-violet-300 bg-violet-400/10 border-violet-400/20" },
  { titulo: "Conocimiento del dominio", texto: "Contexto para comprender", icono: BookOpen, tono: "text-amber-300 bg-amber-400/10 border-amber-400/20" },
];

const HERRAMIENTAS_ANALISIS = [
  "Estadística descriptiva",
  "Distribuciones y porcentajes",
  "Comparación entre grupos",
  "Visualización de datos",
  "Matriz de correlación",
];

const TIPOS_ML = [
  {
    titulo: "Regresión",
    texto: "Estima un valor numérico.",
    ejemplos: ["Una cantidad", "Una tendencia", "Un valor continuo"],
    icono: LineChart,
    iconoClass: "bg-emerald-400/10 text-emerald-300",
    puntoClass: "bg-emerald-400",
  },
  {
    titulo: "Clasificación",
    texto: "Asigna un caso a una categoría.",
    ejemplos: ["Sí o no", "Riesgo alto o bajo", "Presencia o ausencia"],
    icono: CheckCircle2,
    iconoClass: "bg-sky-400/10 text-sky-300",
    puntoClass: "bg-sky-400",
  },
  {
    titulo: "Clustering",
    texto: "Descubre grupos de casos similares.",
    ejemplos: ["Perfiles", "Segmentos de población", "Comportamientos semejantes"],
    icono: Users,
    iconoClass: "bg-violet-400/10 text-violet-300",
    puntoClass: "bg-violet-400",
  },
  {
    titulo: "Detección de anomalías",
    texto: "Encuentra casos que se alejan de lo habitual.",
    ejemplos: ["Valores atípicos", "Mediciones inusuales", "Casos excepcionales"],
    icono: ShieldAlert,
    iconoClass: "bg-amber-400/10 text-amber-300",
    puntoClass: "bg-amber-400",
  },
];

const PROCESO = [
  "Definir la pregunta",
  "Obtener los datos",
  "Limpiar y preparar",
  "Explorar los datos",
  "Seleccionar variables",
  "Entrenar el modelo",
  "Evaluar el modelo",
  "Interpretar y comunicar",
];

const ALGORITMOS = [
  {
    titulo: "Regresión lineal",
    texto: "Representa la relación entre variables y estima un valor numérico continuo.",
    icono: LineChart,
    color: "text-emerald-300",
  },
  {
    titulo: "Regresión logística",
    texto: "Estima la probabilidad de pertenecer a una categoría, como “sí” o “no”.",
    nota: "Aunque se llama regresión, se usa principalmente para clasificar.",
    icono: CircleDot,
    color: "text-sky-300",
  },
  {
    titulo: "K-Means",
    texto: "Organiza los casos en grupos según sus similitudes, sin categorías definidas de antemano.",
    icono: Boxes,
    color: "text-violet-300",
  },
  {
    titulo: "Random Forest",
    texto: "Combina varios árboles de decisión para clasificar, predecir y reconocer variables relevantes.",
    icono: Network,
    color: "text-amber-300",
  },
];

const APLICACIONES = [
  { titulo: "Salud pública", icono: HeartPulse },
  { titulo: "Investigación científica", icono: FlaskConical },
  { titulo: "Políticas públicas", icono: Scale },
  { titulo: "Educación", icono: GraduationCap },
  { titulo: "Ambiente", icono: Leaf },
  { titulo: "Economía", icono: LineChart },
  { titulo: "Industria", icono: Factory },
  { titulo: "Análisis social", icono: Users },
];

function MiniCorrelacion({ tipo }: { tipo: "positiva" | "negativa" | "sin-relacion" }) {
  const puntos =
    tipo === "positiva"
      ? [[10, 76], [20, 67], [30, 70], [42, 54], [54, 45], [68, 40], [78, 24], [90, 18]]
      : tipo === "negativa"
        ? [[10, 18], [22, 29], [31, 23], [43, 42], [55, 49], [68, 55], [80, 72], [90, 78]]
        : [[10, 27], [21, 72], [32, 41], [43, 64], [55, 18], [67, 73], [78, 36], [91, 54]];
  const color = tipo === "positiva" ? "#34d399" : tipo === "negativa" ? "#fb7185" : "#94a3b8";

  return (
    <svg viewBox="0 0 100 90" className="h-28 w-full" role="img" aria-label={`Ejemplo de correlación ${tipo.replace("-", " ")}`}>
      <line x1="8" y1="82" x2="96" y2="82" stroke="rgba(255,255,255,.18)" />
      <line x1="8" y1="82" x2="8" y2="8" stroke="rgba(255,255,255,.18)" />
      {tipo !== "sin-relacion" && (
        <line
          x1="12"
          y1={tipo === "positiva" ? 79 : 15}
          x2="92"
          y2={tipo === "positiva" ? 14 : 78}
          stroke={color}
          strokeOpacity=".35"
          strokeWidth="2"
        />
      )}
      {puntos.map(([cx, cy], index) => (
        <circle key={index} cx={cx} cy={cy} r="3.8" fill={color} fillOpacity=".9" />
      ))}
    </svg>
  );
}

export default function CienciaDatos({ onVerResumen }: CienciaDatosProps) {
  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow=""
        title="Ciencia de Datos"
        desc="Una guía visual para comprender cómo los datos, el análisis y la evidencia se convierten en conocimiento útil para investigar y decidir."
        right={<Badge tone="emerald"><Sparkles size={12} /> Guía para público general</Badge>}
      />

      <FadeIn>
        <Card className="overflow-hidden p-5 sm:p-6">
          <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300/80 sm:text-base">¿Qué es la Ciencia de Datos?</p>
              <h3 className="mt-2 font-display text-xl font-semibold text-zinc-50">Una disciplina que integra distintas miradas</h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
                La Ciencia de Datos combina datos, estadística, programación y conocimiento del área de estudio para comprender fenómenos,
                encontrar patrones y generar evidencia para tomar decisiones.
              </p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {PILARES.map(({ titulo, texto, icono: Icono, tono }) => (
                  <div key={titulo} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${tono}`}><Icono size={16} /></span>
                    <div>
                      <p className="text-sm font-semibold text-zinc-100">{titulo}</p>
                      <p className="text-[11px] text-zinc-500">{texto}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-full rounded-2xl border border-lima-400/20 bg-gradient-to-br from-lima-400/[0.09] to-emerald-400/[0.025] p-5">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lima-400 text-lima-950"><Search size={18} /></span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lima-200">Idea principal</p>
                    <p className="mt-2 font-display text-lg font-semibold leading-relaxed text-lima-50">
                      No consiste solamente en predecir.
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-emerald-50/65">
                      También permite describir, explorar, comparar, explicar y descubrir patrones.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </FadeIn>

      <FadeIn>
        <Card className="p-5 sm:p-6">
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.6fr]">
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-sky-300/80 sm:text-base">¿Qué es el Análisis de Datos?</p>
              <h3 className="mt-2 font-display text-xl font-semibold text-zinc-50">Comprender lo que muestran los datos</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Permite estudiar la información disponible para saber qué ocurrió, cómo se distribuyen los datos y qué relaciones aparecen entre las variables.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {HERRAMIENTAS_ANALISIS.map((item) => (
                  <Badge key={item} tone="sky">{item}</Badge>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
              <div className="flex items-center gap-2">
                <BarChart3 size={17} className="text-sky-300" />
                <h4 className="font-display text-sm font-semibold text-zinc-100">¿Qué muestra una matriz de correlación?</h4>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                Permite observar qué variables cambian juntas y con qué intensidad. Una correlación indica asociación, pero no demuestra causalidad.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { tipo: "positiva" as const, titulo: "Positiva", texto: "Aumentan juntas", Icono: ArrowUpRight, color: "text-emerald-300" },
                  { tipo: "negativa" as const, titulo: "Negativa", texto: "Una sube y otra baja", Icono: ArrowDownRight, color: "text-rose-300" },
                  { tipo: "sin-relacion" as const, titulo: "Sin relación lineal clara", texto: "No hay tendencia visible", Icono: Workflow, color: "text-zinc-300" },
                ].map(({ tipo, titulo, texto, Icono, color }) => (
                  <div key={tipo} className="rounded-xl border border-white/[0.06] bg-[#0d120e] p-3">
                    <MiniCorrelacion tipo={tipo} />
                    <p className={`mt-1 flex items-center gap-1.5 text-xs font-semibold ${color}`}><Icono size={13} /> {titulo}</p>
                    <p className="mt-1 text-[11px] text-zinc-500">{texto}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </FadeIn>

      <FadeIn>
        <Card className="p-5 sm:p-6">
          <div className="mb-5 max-w-3xl">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-violet-300/80 sm:text-base">¿Qué es Machine Learning?</p>
            <h3 className="mt-2 font-display text-xl font-semibold text-zinc-50">Modelos que aprenden patrones a partir de datos</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Es una rama de la Inteligencia Artificial. Ayuda a construir modelos que reconocen patrones para resolver distintos tipos de problemas.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {TIPOS_ML.map(({ titulo, texto, ejemplos, icono: Icono, iconoClass, puntoClass }) => (
              <div key={titulo} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                <span className={`grid h-9 w-9 place-items-center rounded-xl ${iconoClass}`}><Icono size={17} /></span>
                <h4 className="mt-3 font-display text-base font-semibold text-zinc-100">{titulo}</h4>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">{texto}</p>
                <ul className="mt-3 space-y-1.5">
                  {ejemplos.map((ejemplo) => (
                    <li key={ejemplo} className="flex items-center gap-2 text-[11px] text-zinc-500">
                      <span className={`h-1 w-1 rounded-full ${puntoClass}`} /> {ejemplo}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      </FadeIn>

      <FadeIn>
        <Card className="border-emerald-400/15 p-5 sm:p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300/80 sm:text-base">¿Cómo es el proceso?</p>
              <h3 className="mt-2 font-display text-xl font-semibold text-zinc-50">De una pregunta a una evidencia evaluada</h3>
            </div>
            <Badge tone="emerald"><Workflow size={12} /> 8 pasos</Badge>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
            {PROCESO.map((paso, index) => (
              <div key={paso} className="relative rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                <span className="font-mono text-[10px] font-bold text-emerald-300/70">{String(index + 1).padStart(2, "0")}</span>
                <p className="mt-2 text-xs font-medium leading-snug text-zinc-200">{paso}</p>
                {index < PROCESO.length - 1 && <ArrowRight size={12} className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 text-emerald-300/60 xl:block" />}
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.05] p-4">
              <p className="text-sm font-semibold text-amber-100">El proceso no termina con una predicción.</p>
              <p className="mt-1 text-xs leading-relaxed text-amber-100/60">Un modelo debe evaluarse para saber si sus resultados son confiables y útiles.</p>
            </div>
            <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4">
              <p className="text-sm font-semibold text-emerald-100">Un resultado también puede ser no poder predecir.</p>
              <p className="mt-1 text-xs leading-relaxed text-emerald-100/60">Demostrar que los datos disponibles no permiten una predicción confiable también es científicamente valioso.</p>
            </div>
          </div>
        </Card>
      </FadeIn>

      <FadeIn>
        <Card className="p-5 sm:p-6">
          <div className="mb-5">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-sky-300/80 sm:text-base">Algoritmos de Machine Learning</p>
            <h3 className="mt-2 font-display text-xl font-semibold text-zinc-50">Herramientas diferentes para preguntas diferentes</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {ALGORITMOS.map(({ titulo, texto, nota, icono: Icono, color }) => (
              <div key={titulo} className="flex gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.04] ${color}`}><Icono size={17} /></span>
                <div>
                  <h4 className="font-display text-sm font-semibold text-zinc-100">{titulo}</h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{texto}</p>
                  {nota && <p className="mt-2 rounded-lg border border-sky-400/15 bg-sky-400/[0.04] px-2.5 py-2 text-[11px] text-sky-100/65">{nota}</p>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </FadeIn>

      <FadeIn>
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="p-5 sm:p-6">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-amber-300/80 sm:text-base">Aplicaciones</p>
            <h3 className="mt-2 font-display text-xl font-semibold text-zinc-50">Herramientas con usos concretos</h3>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {APLICACIONES.map(({ titulo, icono: Icono }) => (
                <div key={titulo} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                  <Icono size={17} className="mx-auto text-amber-300" />
                  <p className="mt-2 text-[11px] font-medium leading-snug text-zinc-300">{titulo}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-zinc-400">
              Identificar patrones, comparar grupos, detectar factores asociados, construir perfiles, evaluar hipótesis, estimar riesgos y apoyar decisiones basadas en evidencia.
            </p>
          </Card>

          <Card className="p-5 sm:p-6">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300/80 sm:text-base">Importancia científica</p>
            <h3 className="mt-2 font-display text-xl font-semibold text-zinc-50">Más capacidad para investigar</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Permite trabajar con grandes cantidades de información, integrar múltiples variables y analizar relaciones complejas.
            </p>
            <ul className="mt-4 grid gap-2 text-xs text-zinc-400 sm:grid-cols-2">
              {[
                "Organizar y preparar los datos",
                "Describir una población",
                "Explorar relaciones",
                "Identificar patrones y perfiles",
                "Contrastar hipótesis",
                "Evaluar capacidad predictiva",
                "Comunicar con visualizaciones",
                "Reconocer los límites",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-emerald-300" /> {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="rounded-2xl border border-lima-400/25 bg-gradient-to-r from-lima-400/[0.1] to-emerald-400/[0.04] p-5 text-center sm:p-7">
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-lima-400 text-lima-950"><FlaskConical size={20} /></span>
          <p className="mx-auto mt-4 max-w-3xl font-display text-lg font-semibold leading-relaxed text-lima-50 sm:text-xl">
            La Ciencia de Datos no reemplaza al método científico: amplía sus herramientas para transformar datos en evidencia.
          </p>
          <button
            type="button"
            onClick={onVerResumen}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-lima-400 to-emerald-400 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:brightness-110"
          >
            Ver cómo aplicamos estas herramientas en nuestra investigación
            <ArrowRight size={16} />
          </button>
        </div>
      </FadeIn>
    </div>
  );
}
