import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip,
} from "recharts";
import { CheckCircle2, AlertTriangle, Lightbulb, Rocket, BookOpenCheck, Quote, Scale, HeartPulse, Users, Landmark, BrainCircuit } from "lucide-react";
import { Card, SectionHeader, Badge, CHART_TOOLTIP, FadeIn } from "./ui";

const HALLAZGOS = [
  { id: "F1", texto: "El consumo está integrado a la vida cotidiana: efectos percibidos mayoritariamente positivos o neutros", evidencia: "Relaja 79,7% · violencia 0,1% (1 caso) · multiefectos x̄ = 5,01", fuerza: 95 },
  { id: "F2", texto: "No hay asociación lineal entre intensidad de consumo (frecuencia/cantidad) y percepción de problemas", evidencia: "r ≈ 0,04 en ambos casos · inconvenientes en vida diaria ≈ 4%", fuerza: 93 },
  { id: "F3", texto: "Los usuarios terapéuticos perciben una mejoría alta de su salud (autoinforme, no eficacia clínica)", evidencia: "83,3% ≥8/10 · media 8,57 · mediana 9 · n=485", fuerza: 88 },
  { id: "F4", texto: "El conflicto se concentra en el contacto con fuerzas de seguridad y el sistema judicial", evidencia: "25,4% con inconvenientes · 53,5% de ellos detenidos · vida diaria solo ≈4%", fuerza: 90 },
  { id: "F5", texto: "El fenómeno es multidimensional y difuso: sin ejes lineales ni dimensiones dominantes", evidencia: "Mayoría |r| < 0,20 · PCA PC1+PC2 ≈ 22% · nube homogénea", fuerza: 89 },
  { id: "F6", texto: "Existen perfiles descriptivos, pero el fenómeno es continuo y no categórico", evidencia: "K-Means k=3 · silhouette 0,19 (K-Means) y 0,16 (jerárquico)", fuerza: 76 },
  { id: "F7", texto: "Las variables disponibles no permiten predecir quién percibe problemas", evidencia: "Random Forest: accuracy 0,94 engañoso · ROC AUC = 0,49 ≈ azar", fuerza: 92 },
  { id: "F8", texto: "Fuerte cultura de autocultivo y autoformación comunitaria", evidencia: "Cultiva 65,2% · autoabastece 66,5% · blogs/foros 71,5% · orgánicos 79,6%", fuerza: 87 },
];

const RADAR_CALIDAD = [
  { eje: "Validez interna", valor: 72 },
  { eje: "Validez externa", valor: 48 },
  { eje: "Reproducibilidad", valor: 96 },
  { eje: "Transparencia", valor: 94 },
  { eje: "Novedad regional", valor: 85 },
  { eje: "Robustez analítica", valor: 81 },
];

export default function Conclusions() {
  return (
    <div>
      <SectionHeader
        eyebrow="Discusión y conclusiones · §7–12"
        title="Conclusiones del estudio"
        desc="Hallazgos principales (§11.1) con su evidencia numérica y fuerza interpretativa. El estudio es exploratorio: describe asociaciones y patrones en una muestra autoseleccionada, sin causalidad ni generalización poblacional."
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          {HALLAZGOS.map((h, i) => (
            <FadeIn key={h.id} delay={i * 0.03}>
              <Card hover className="p-5">
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] font-mono text-sm font-bold text-zinc-200">{h.id}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-snug text-zinc-50">{h.texto}</p>
                    <p className="mt-1 font-mono text-xs text-zinc-500">{h.evidencia}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full bg-emerald-400 transition-all duration-700" style={{ width: `${h.fuerza}%` }} />
                      </div>
                      <span className="text-[11px] text-zinc-500">Fuerza de evidencia <span className="font-mono font-semibold text-zinc-300">{h.fuerza}/100</span></span>
                    </div>
                  </div>
                  <Badge tone="emerald"><CheckCircle2 size={12} /> Hallazgo</Badge>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>

        <div className="space-y-4">
          <FadeIn delay={0.05}>
            <Card className="p-5">
              <h3 className="font-display text-base font-semibold text-zinc-100">Calidad y alcance del estudio</h3>
              <p className="text-xs text-zinc-500">Autoevaluación según las limitaciones declaradas (§8)</p>
              <div className="h-[230px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={RADAR_CALIDAD} outerRadius="68%">
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="eje" tick={{ fill: "#a1a1aa", fontSize: 10 }} />
                    <Radar name="Puntuación" dataKey="valor" stroke="#34d399" fill="#34d399" fillOpacity={0.32} strokeWidth={2} />
                    <Tooltip {...CHART_TOOLTIP} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-600">
                La validez externa es el punto débil declarado (muestra no probabilística, 48/100); la reproducibilidad, el más fuerte: 22 scripts y doble verificación (§14, nota metodológica).
              </p>
            </Card>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Card className="border-emerald-400/20 bg-emerald-400/[0.04] p-5">
              <Quote size={18} className="text-emerald-300" />
              <p className="mt-3 font-display text-[16.5px] font-medium leading-relaxed text-emerald-50">
                «Los datos no sostienen supuestos de daño generalizado: el conflicto no nace del consumo, se concentra en su criminalización.»
              </p>
              <p className="mt-3 text-xs leading-relaxed text-emerald-200/60">
                Síntesis interpretativa de §7 y §11 — en esta muestra, los problemas reportados se asocian al contacto policial-judicial (25,4%) y no a la frecuencia ni a la cantidad consumida (r ≈ 0,04).
              </p>
            </Card>
          </FadeIn>

          <FadeIn delay={0.14}>
            <Card className="p-5">
              <div className="flex items-center gap-2">
                <Scale size={16} className="text-amber-300" />
                <h3 className="font-display text-base font-semibold text-zinc-100">Consideraciones éticas (§9)</h3>
              </div>
              <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-zinc-400">
                <li>· <span className="text-zinc-200">Conflicto de interés declarado:</span> los autores pertenecen a una organización de usuarios de cannabis.</li>
                <li>· <span className="text-zinc-200">Consentimiento implícito</span> al completar la encuesta anónima.</li>
                <li>· <span className="text-zinc-200">Uso de IA transparente:</span> apoyo en código y revisión, con verificación cruzada y responsabilidad autoral plena.</li>
                <li>· <span className="text-zinc-200">Sin financiamiento externo</span> (§10): herramientas open source.</li>
              </ul>
            </Card>
          </FadeIn>
        </div>
      </div>

      <div className="mt-6 mb-2 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300/90">Discusión por enfoque · §7.6–7.9</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            icon: HeartPulse, color: "#fb7185", titulo: "Salud pública (§7.6)",
            texto: "Baja autopercepción de daño sin medición clínica objetiva. Recomendación: vigilancia en subpoblaciones vulnerables (adolescentes, embarazadas, comorbilidades), monitoreo de policonsumo (28,3%) y campañas de reducción de daños centradas en prácticas seguras, no en daños generalizados supuestos.",
          },
          {
            icon: Users, color: "#38bdf8", titulo: "Sociología (§7.7)",
            texto: "La normalización del consumo convive con capital social real: colectivos (33,2%) y redes de autocultivo como espacios de apoyo mutuo y aprendizaje de reducción de riesgos. Advertencia: esas redes pueden sobrerrepresentar sectores de mayor capital cultural y económico.",
          },
          {
            icon: Landmark, color: "#fbbf24", titulo: "Políticas de drogas (§7.8)",
            texto: "La evidencia exploratoria contrasta con los supuestos de la «guerra contra las drogas» (gateway, caos): violencia 0,1% y sin patrón de malestar. Una regulación responsable —autocultivo licenciado, mercados comunitarios, acceso medicinal controlado— surge como alternativa a discutir con datos.",
          },
          {
            icon: BrainCircuit, color: "#a3e635", titulo: "Ciencia de datos (§7.9)",
            texto: "PCA y clustering aportaron estructura sin perder interpretabilidad, con reproducibilidad open source. Límites del dataset: tamaño, ausencia de imputación y autoselección. Futuro: modelos supervisados y longitudinales con variables clínicas, comorbilidades y validación cruzada.",
          },
        ].map((e, i) => (
          <FadeIn key={e.titulo} delay={i * 0.05}>
            <Card hover className="h-full p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${e.color}1a`, color: e.color }}><e.icon size={18} /></span>
              <h4 className="mt-3 font-display text-[15px] font-semibold text-zinc-50">{e.titulo}</h4>
              <p className="mt-2 text-[13px] leading-relaxed text-zinc-400">{e.texto}</p>
            </Card>
          </FadeIn>
        ))}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <FadeIn>
          <Card hover className="h-full p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300"><Lightbulb size={18} /></span>
            <h4 className="mt-3 font-display text-base font-semibold text-zinc-50">Implicancias (§11.2)</h4>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-zinc-400">
              <li>· <span className="text-zinc-200">Salud pública:</span> diseñar prevención y reducción de daños desde la experiencia de usuarios, no desde el estereotipo de daño.</li>
              <li>· <span className="text-zinc-200">Políticas:</span> la evidencia respalda revisar el enfoque punitivo: el conflicto medido es legal, no sanitario.</li>
              <li>· <span className="text-zinc-200">Regulación:</span> 99,6% apoya legalizar, despenalizar o regular; el autocultivo ya es la vía mayoritaria de acceso (65,2%).</li>
            </ul>
          </Card>
        </FadeIn>
        <FadeIn delay={0.06}>
          <Card hover className="h-full p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300"><AlertTriangle size={18} /></span>
            <h4 className="mt-3 font-display text-base font-semibold text-zinc-50">Limitaciones (§8)</h4>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-zinc-400">
              <li>· Muestra <span className="text-zinc-200">no probabilística y autoseleccionada</span>: sin representatividad poblacional.</li>
              <li>· Datos <span className="text-zinc-200">autoinformados</span> y diseño <span className="text-zinc-200">transversal</span>: no hay causalidad ni trayectorias.</li>
              <li>· Faltantes altos en ítems de subgrupos y variables clínicas/mental health ausentes; límites del ML con clases desbalanceadas.</li>
            </ul>
          </Card>
        </FadeIn>
        <FadeIn delay={0.12}>
          <Card hover className="h-full p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300"><Rocket size={18} /></span>
            <h4 className="mt-3 font-display text-base font-semibold text-zinc-50">Líneas futuras (§12)</h4>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-zinc-400">
              <li>· Estudios <span className="text-zinc-200">longitudinales</span> y con muestras representativas por país.</li>
              <li>· Incorporar <span className="text-zinc-200">variables clínicas y de salud mental</span> validadas, y policonsumo en profundidad.</li>
              <li>· Modelos predictivos supervisados con variables socioeconómicas y validación externa.</li>
            </ul>
          </Card>
        </FadeIn>
      </div>

      <FadeIn>
        <Card className="mt-4 flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400 text-emerald-950"><BookOpenCheck size={20} /></span>
            <div>
              <h4 className="font-display text-lg font-semibold text-zinc-50">Veredicto del estudio</h4>
              <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
                Tres técnicas independientes —correlaciones, PCA/clustering y modelos predictivos— convergen: en esta muestra el consumo de cannabis aparece <span className="text-zinc-200">integrado, con efectos percibidos positivos y sin asociación con el malestar</span>. El hallazgo «negativo» de los modelos (AUC 0,49) es, en sí mismo, el resultado científico central.
              </p>
            </div>
          </div>
          <Badge tone="emerald">Exploratorio · evidencia convergente</Badge>
        </Card>
      </FadeIn>
    </div>
  );
}
