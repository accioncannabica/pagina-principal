import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip, Legend,
} from "recharts";
import { GraduationCap, Users, HeartHandshake, Code2 } from "lucide-react";
import { Card, SectionHeader, Badge, CHART_TOOLTIP, FadeIn, Stat, seqColor } from "./ui";

const EQUIPO = [
  { nombre: "Horacio Adrián Rodríguez", rol: "Coordinación · Acción Cannábica", foco: "Territorio y usuarios" },
  { nombre: "Claudia Sánchez", rol: "Investigadora · Acción Cannábica", foco: "Trabajo comunitario" },
  { nombre: "Daniela Rodríguez", rol: "Investigadora · Acción Cannábica", foco: "Difusión y relevamiento" },
  { nombre: "Esteban Calabria", rol: "Analista en ciencia de datos", foco: "Python · estadística · ML" },
  { nombre: "Ana Flor Sclani Horrac", rol: "Lic. en Geografía · UNLP", foco: "Análisis territorial" },
  { nombre: "Magali Avruj", rol: "Médica · UBA", foco: "Salud y clínica" },
  { nombre: "Lila Torres", rol: "Investigadora · UNLP", foco: "Método y academia" },
];

const RADAR_DATA = [
  { eje: "Ciencia de datos", equipo: 90, requerido: 85 },
  { eje: "Estadística", equipo: 84, requerido: 85 },
  { eje: "Salud pública", equipo: 82, requerido: 88 },
  { eje: "Clínica", equipo: 72, requerido: 70 },
  { eje: "Territorio", equipo: 93, requerido: 80 },
  { eje: "Geografía", equipo: 74, requerido: 68 },
  { eje: "Políticas", equipo: 88, requerido: 85 },
  { eje: "Comunidad", equipo: 95, requerido: 90 },
];

const ROLES = ["Coord.", "Campo", "Data Sci.", "Salud", "Academia"];
const MATRIX: Record<string, number[]> = {
  "Python / pipelines de datos": [62, 40, 98, 35, 66],
  "Estadística inferencial (χ², r)": [58, 38, 94, 52, 84],
  "Machine Learning (PCA, RF)": [45, 30, 92, 28, 58],
  "Salud pública y epidemiología": [76, 64, 48, 94, 78],
  "Clínica y uso terapéutico": [60, 55, 30, 96, 62],
  "Geografía / análisis territorial": [52, 46, 44, 38, 88],
  "Trabajo con usuarios/as": [96, 94, 36, 58, 60],
  "Políticas de drogas": [92, 84, 42, 66, 80],
  "Ética de la investigación": [90, 86, 64, 82, 88],
};

const ENFOQUES = [
  { nombre: "Salud pública", detalle: "Prevalencia, reducción de daños y determinantes sociales (§2.6.1)", nivel: 86 },
  { nombre: "Sociología", detalle: "Normalización, capital social e identidades (§2.6.2)", nivel: 82 },
  { nombre: "Políticas de drogas", detalle: "Prohibición vs. regulación: Ley 27.350, Ley 27.669, Uruguay 19.172 (§2.6.3)", nivel: 89 },
  { nombre: "Ciencia de datos", detalle: "Correlaciones, PCA, clustering y modelos supervisados (§2.6.4)", nivel: 91 },
];

export default function Skills() {
  return (
    <div>
      <SectionHeader
        eyebrow="Equipo multidisciplinario · §2.6"
        title="Skills del equipo investigador"
        desc="El estudio integra salud pública, sociología, políticas de drogas y ciencia de datos. La matriz cruza competencias con los perfiles del equipo: autores de Acción Cannábica, un analista de datos y colaboradoras de UNLP y UBA."
        right={<Badge tone="emerald">7 integrantes · 4 disciplinas</Badge>}
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <FadeIn><Stat label="Integrantes del equipo" value="7" sub="4 autores + 3 colaboradoras" icon={<Users size={16} />} /></FadeIn>
        <FadeIn delay={0.05}><Stat label="Competencia más fuerte" value="Comunidad" sub="trabajo con usuarios/as: 95/100" icon={<HeartHandshake size={16} />} accent="amber" /></FadeIn>
        <FadeIn delay={0.1}><Stat label="Pipeline técnico" value="Python" sub="pandas · sklearn · SciPy · Seaborn" icon={<Code2 size={16} />} accent="sky" /></FadeIn>
        <FadeIn delay={0.15}><Stat label="Cobertura disciplinar" value="4 enfoques" sub="salud, sociología, política, datos" icon={<GraduationCap size={16} />} accent="rose" /></FadeIn>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <FadeIn>
          <Card className="p-5">
            <h3 className="font-display text-base font-semibold text-zinc-100">Radar de competencias</h3>
            <p className="mb-2 text-xs text-zinc-500">Nivel consolidado del equipo frente al requerido por el diseño del estudio</p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={RADAR_DATA} outerRadius="72%">
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="eje" tick={{ fill: "#a1a1aa", fontSize: 11 }} />
                  <Radar name="Equipo" dataKey="equipo" stroke="#34d399" fill="#34d399" fillOpacity={0.32} strokeWidth={2} />
                  <Radar name="Requerido" dataKey="requerido" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.1} strokeWidth={2} strokeDasharray="5 4" />
                  <Tooltip {...CHART_TOOLTIP} />
                  <Legend iconType="circle" iconSize={8} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {EQUIPO.map((p) => (
                <div key={p.nombre} className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2">
                  <p className="text-xs font-semibold text-zinc-100">{p.nombre}</p>
                  <p className="text-[10.5px] text-zinc-500">{p.rol} · <span className="text-emerald-300/80">{p.foco}</span></p>
                </div>
              ))}
            </div>
          </Card>
        </FadeIn>

        <FadeIn delay={0.08}>
          <Card className="p-5">
            <h3 className="font-display text-base font-semibold text-zinc-100">Enfoques disciplinarios del estudio</h3>
            <p className="mb-4 text-xs text-zinc-500">Intensidad con que cada disciplina estructura el análisis (§2.6.1–2.6.4)</p>
            <div className="space-y-4">
              {ENFOQUES.map((e) => (
                <div key={e.nombre}>
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="text-sm font-semibold text-zinc-100">{e.nombre}</span>
                    <span className="font-mono text-xs font-bold text-emerald-300">{e.nivel}/100</span>
                  </div>
                  <p className="mb-1.5 text-[11px] leading-snug text-zinc-500">{e.detalle}</p>
                  <div className="flex h-2.5 gap-[2px]">
                    {Array.from({ length: 24 }, (_, k) => (
                      <span key={k} className="flex-1 rounded-[2px]" style={{ background: k / 24 <= e.nivel / 100 ? seqColor(0.35 + (k / 24) * 0.6) : "rgba(255,255,255,0.05)" }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 text-xs leading-relaxed text-zinc-400">
              <span className="font-semibold text-zinc-200">Lectura:</span> el diferencial del estudio es la combinación de capital comunitario (organización de usuarios) con capacidad técnica de datos — una configuración poco frecuente en la literatura regional, donde predominan enfoques clínicos o de vigilancia (§2.4).
            </div>
          </Card>
        </FadeIn>
      </div>

      <FadeIn>
        <Card className="mt-4 p-5">
          <h3 className="font-display text-base font-semibold text-zinc-100">Mapa de calor · Skills × Perfiles del equipo</h3>
          <p className="mb-4 text-xs text-zinc-500">Nivel medio por perfil (0–100). Los puntos blancos marcan concentración experta: conocimiento crítico en un solo perfil.</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-separate" style={{ borderSpacing: 3 }}>
              <thead>
                <tr>
                  <th className="p-2 text-left text-[11px] font-medium uppercase tracking-wider text-zinc-500">Competencia</th>
                  {ROLES.map((r) => <th key={r} className="p-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">{r}</th>)}
                  <th className="p-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">Media</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(MATRIX).map(([skill, vals]) => {
                  const media = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
                  return (
                    <tr key={skill}>
                      <td className="rounded-l-lg bg-white/[0.02] px-3 py-2 text-xs font-medium text-zinc-200">{skill}</td>
                      {vals.map((v, i) => (
                        <td key={i} className="relative rounded-md px-2 py-2 text-center font-mono text-xs font-semibold transition-transform hover:scale-[1.06]"
                          style={{ background: seqColor(v / 100), color: v > 55 ? "#ecfdf5" : "#a7f3d0" }}>
                          {v}
                          {v >= 90 && <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-white/80" />}
                        </td>
                      ))}
                      <td className="rounded-r-lg bg-white/[0.02] px-2 py-2 text-center font-mono text-xs font-bold text-zinc-100">{media}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-500">
            <span className="flex items-center gap-2"><span className="h-3 w-6 rounded" style={{ background: seqColor(0.15) }} /> Bajo (&lt;50)</span>
            <span className="flex items-center gap-2"><span className="h-3 w-6 rounded" style={{ background: seqColor(0.55) }} /> Competente (50–79)</span>
            <span className="flex items-center gap-2"><span className="h-3 w-6 rounded" style={{ background: seqColor(0.95) }} /> Experto (≥90) · punto blanco</span>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.05] px-3.5 py-2.5 text-xs leading-relaxed text-amber-100/80">
              <span className="font-semibold text-amber-200">Punto único de fallo:</span> el pipeline Python/ML concentra su expertise en el perfil de ciencia de datos; el harness de doble verificación con IA (§14) mitiga ese riesgo.
            </div>
            <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] px-3.5 py-2.5 text-xs leading-relaxed text-emerald-100/80">
              <span className="font-semibold text-emerald-200">Fortaleza distintiva:</span> coordinación y campo superan 90 en trabajo con usuarios/as y políticas — la base del acceso a una población de difícil alcance.
            </div>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
}
