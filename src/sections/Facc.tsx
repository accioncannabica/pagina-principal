import { FACC, ORGANIZACIONES } from "../data/content";
import { Badge, Boton, DemoBadge, Icon, Panel, Reveal, SectionTitle } from "../components/ui";
import type { Vista } from "../types";

export default function Facc({ irA }: { irA: (v: Vista) => void }) {
  const miembros = ORGANIZACIONES.filter((o) => o.facc && o.sigla !== "FACC");
  const fundadoras = miembros.filter((o) => FACC.fundadoras.some((f) => f.startsWith(o.sigla.slice(0, 3)) || f.includes(o.sigla)));

  return (
    <div className="space-y-12">
      <SectionTitle
        kicker="Federación"
        titulo={
          <>
            FACC · <span className="text-grad">Federación Argentina de Cannabis y Cáñamo</span>
          </>
        }
        bajada={FACC.identidad}
        icono="globe"
      />

      {/* Cabecera */}
      <Panel className="relative overflow-hidden p-7">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-lima-400/12 blur-[90px] anim-drift" />
        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="lima">Fundada en {FACC.fundacion}</Badge>
              <Badge tone="cian">{FACC.miembros} organizaciones</Badge>
              <Badge tone="violeta">{FACC.provincias}</Badge>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-emerald-50/70">
              La FACC nuclea asociaciones civiles, fundaciones y cooperativas dedicadas a la investigación, la formación, el cultivo y la
              producción de derivados del cannabis y el cáñamo. Surge en 2022, en pleno proceso de reglamentación de la Ley 27.350 y de la
              Ley 27.669, y tiene como antecedente al Frente de Organizaciones Cannábicas Argentinas (FOCA).
            </p>
            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["Presidencia", FACC.presidencia],
                ["Secretaría General", FACC.secretariaGeneral],
                ["Antecedente", FACC.antecedente],
                ["Identidad", "Feminista y agroecológica"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-emerald-50/40">{k}</dt>
                  <dd className="mt-1 text-xs text-emerald-50/85">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              <a href={FACC.web} target="_blank" rel="noreferrer">
                <Boton>
                  <Icon name="globe" className="h-4 w-4" /> facc.info
                </Boton>
              </a>
              <a href={FACC.instagram} target="_blank" rel="noreferrer">
                <Boton variante="fantasma">
                  <Icon name="insta" className="h-4 w-4" /> @faccarg
                </Boton>
              </a>
              <Boton variante="fantasma" onClick={() => irA("redes")}>
                <Icon name="network" className="h-4 w-4" /> Ver grafo completo
              </Boton>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-lima-500/25 bg-lima-500/6 p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-lima-400/80">Organizaciones fundadoras</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {FACC.fundadoras.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[11px] text-emerald-50/75">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lima-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[10px] text-emerald-50/45">
                De las 16 organizaciones iniciales (2022) se pasó a 25 asociaciones con personería jurídica en 9-10 provincias.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-cian-400/80">Asambleas</p>
              <ul className="mt-3 space-y-3">
                {FACC.asambleas.map((a) => (
                  <li key={a.n} className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-white">{a.n}</span>
                      <span className="font-mono text-[10px] text-lima-300">{a.fecha}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-emerald-50/60">
                      {a.lugar} · organiza {a.org}
                    </p>
                    <p className="text-[10px] text-emerald-50/45">{a.asistentes}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Panel>

      {/* Líneas de trabajo */}
      <section>
        <SectionTitle kicker="Líneas de trabajo" titulo="Cuatro ejes de la Federación" icono="clipboard" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FACC.lineas.map((l, i) => (
            <Reveal key={l.titulo} delay={i * 80}>
              <Panel className="h-full p-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-cian-400/25 bg-cian-400/10 text-cian-400">
                  <Icon name="check" className="h-4 w-4" />
                </span>
                <h3 className="mt-3 text-sm font-semibold text-white">{l.titulo}</h3>
                <p className="mt-2 text-[11px] leading-relaxed text-emerald-50/60">{l.texto}</p>
              </Panel>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Miembros */}
      <section>
        <SectionTitle
          kicker="Miembros"
          titulo="Organizaciones que integran la Federación"
          bajada="Referenciadas e interconectadas desde este tablero: hacé clic en una ficha para ver su contacto en la sección Redes."
          icono="network"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {miembros.map((o, i) => (
            <Reveal key={o.sigla} delay={Math.min(i * 55, 400)}>
              <button onClick={() => irA("redes")} className="group h-full w-full text-left">
                <Panel className="h-full p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-xl border border-lima-500/30 bg-lima-500/10 font-mono text-[10px] font-bold text-lima-300">
                      {o.sigla.slice(0, 3)}
                    </span>
                    <Badge tone={o.ambito === "Nacional" ? "lima" : "ambar"}>{o.ambito}</Badge>
                  </div>
                  <h3 className="mt-3 text-xs font-semibold leading-snug text-white group-hover:text-lima-200">{o.nombre}</h3>
                  <p className="mt-1 text-[10px] text-emerald-50/50">{o.territorio}</p>
                  <p className="mt-2 text-[10px] leading-relaxed text-emerald-50/60">{o.eje}</p>
                  <p className="mt-3 border-t border-white/8 pt-2 font-mono text-[9px] text-emerald-50/45">{o.contacto}</p>
                </Panel>
              </button>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <Panel className="mt-5 flex flex-wrap items-center gap-3 p-5">
            <DemoBadge texto="En actualización" />
            <p className="text-[11px] leading-relaxed text-emerald-50/60">
              La nómina completa y actualizada de organizaciones miembras se publica en los canales oficiales de la FACC. Este tablero
              referencia a las organizaciones con presencia pública documentada en asambleas, congresos y entrevistas.
            </p>
          </Panel>
        </Reveal>
      </section>

      {/* Fundadoras destacadas */}
      {fundadoras.length > 0 && (
        <section>
          <SectionTitle kicker="Detalle" titulo="Las seis fundadoras" icono="spark" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {fundadoras.map((o) => (
              <Panel key={o.sigla} className="p-4">
                <p className="text-xs font-semibold text-white">{o.nombre}</p>
                <p className="mt-1 text-[10px] text-lima-300/80">{o.territorio}</p>
                <p className="mt-2 text-[11px] leading-relaxed text-emerald-50/60">{o.eje}</p>
              </Panel>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
