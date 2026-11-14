import { useState } from "react";
import { HITOS, ORG, PILARES } from "../data/content";
import { Timeline } from "../components/charts";
import { Badge, DemoBadge, Icon, Panel, Reveal, SectionTitle } from "../components/ui";
import type { Vista } from "../types";

const FUENTES = [
  "Instagram y Facebook @accannabica — bio institucional y publicaciones.",
  "Directorio Marimba — ficha de Asociación Civil Acción Cannábica (CABA, contacto).",
  "Idealist — N° correlativo IGJ 1921803, Resolución 08/03/2018, Registro N°374.",
  "Revista Cannabis y Salud (CONICET-CIM), edición #5, octubre 2025 — entrevista a la FACC.",
  "Cannábica Argentina, El Planteo e Izquierda Diario — cobertura de asambleas de la FACC.",
  "InfoLEG y Boletín Oficial — Ley 27.350, Decreto 883/2020, Ley 27.669 y resoluciones.",
];

export default function QuienesSomos({ irA }: { irA: (v: Vista) => void }) {
  const [sel, setSel] = useState(-1);

  return (
    <div className="space-y-12">
      <SectionTitle
        kicker="Quiénes somos"
        titulo={
          <>
            Una asociación civil que <span className="text-grad">acciona</span> desde 2014
          </>
        }
        bajada={ORG.descripcion}
        icono="users"
      />

      <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <Reveal>
          <Panel className="relative h-full overflow-hidden p-7">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lima-400/70 to-transparent" />
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-lima-400/80">Manifiesto</p>
            <blockquote className="mt-4 text-lg font-medium leading-relaxed text-white sm:text-xl">
              “{ORG.lema}.”
            </blockquote>
            <p className="mt-5 text-sm leading-relaxed text-emerald-50/65">
              Somos un grupo abierto de activistas, usuaries terapéutiques y recreatives, cultivadores, investigadores, familiares de
              pacientes y profesionales de distintas áreas. Trabajamos por el reconocimiento del derecho a todos los usos y aplicaciones
              responsables del cannabis, con una mirada de derechos humanos, salud pública y justicia social.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge tone="lima">Asociación Civil sin fines de lucro</Badge>
              <Badge tone="cian">ONG vinculada a la salud</Badge>
              <Badge tone="violeta">Derechos Humanos y Libertades Civiles</Badge>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                { k: "Año de fundación", v: "2014" },
                { k: "Personería IGJ", v: "2018" },
                { k: "Miembro FACC", v: "Fundadora" },
              ].map((d) => (
                <div key={d.k} className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-50/40">{d.k}</p>
                  <p className="mt-1 text-lg font-bold text-lima-300">{d.v}</p>
                </div>
              ))}
            </div>
          </Panel>
        </Reveal>

        <Reveal delay={120}>
          <Panel className="h-full p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-cian-400/80">Composición</p>
            <ul className="mt-4 space-y-3">
              {[
                ["Activistas", "Militancia y articulación política"],
                ["Usuaries terapéutiques", "Acompañamiento y defensa del acceso"],
                ["Cultivadores", "Saberes agroecológicos y cultivo asociativo"],
                ["Investigadores", "Producción de evidencia y datos"],
                ["Familiares de pacientes", "Cuidados y demanda por derechos"],
                ["Profesionales", "Salud, derecho, comunicación y educación"],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-lima-500/30 bg-lima-500/10 text-lima-300">
                    <Icon name="check" className="h-3 w-3" />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold text-white">{t}</span>
                    <span className="block text-[11px] text-emerald-50/55">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </Reveal>
      </div>

      {/* Pilares */}
      <section>
        <SectionTitle kicker="Ejes de trabajo" titulo="Cuatro pilares" icono="leaf" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILARES.map((p, i) => (
            <Reveal key={p.titulo} delay={i * 90}>
              <Panel className="h-full p-6 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-lima-500/25 bg-gradient-to-br from-lima-500/20 to-transparent text-lima-300">
                  <Icon name={p.icono} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-white">{p.titulo}</h3>
                <p className="mt-2 text-[11px] leading-relaxed text-emerald-50/60">{p.texto}</p>
              </Panel>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section>
        <SectionTitle
          kicker="Historia"
          titulo="Línea de tiempo institucional y normativa"
          bajada="Hacé clic en un hito para desplegar el detalle."
          icono="calendar"
        />
        <div className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
          <Timeline hitos={HITOS} seleccionado={sel} onSelect={setSel} />
          <Panel className="p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-ambar-400/80">Rigor de datos</p>
            <p className="mt-3 text-xs leading-relaxed text-emerald-50/65">
              Todo el contenido institucional de este tablero fue construido a partir de fuentes públicas y verificables. Los bloques de
              analítica (EDA, mapa de calor y gradiente de peso) utilizan un dataset de demostración y están señalados como tal.
            </p>
            <ul className="mt-4 space-y-2">
              {FUENTES.map((f) => (
                <li key={f} className="flex gap-2 text-[11px] leading-relaxed text-emerald-50/55">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lima-400/70" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-xl border border-white/8 bg-white/[0.02] p-3">
              <p className="text-[11px] text-emerald-50/60">
                <DemoBadge texto="Verificado" /> = dato de fuente pública. <DemoBadge texto="Dato demo" /> = simulación para mockups.
              </p>
            </div>
            <button onClick={() => irA("contacto")} className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-lima-300 hover:text-lima-200">
              Enviar una corrección o sumar información <Icon name="arrow" className="h-3.5 w-3.5" />
            </button>
          </Panel>
        </div>
      </section>
    </div>
  );
}
