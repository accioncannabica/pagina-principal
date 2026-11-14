import { ACTIVIDADES, KPIS, NOTICIAS, ORG, SKILLS } from "../data/content";
import { GEO_CALOR, RADAR_ACCA, SERIE_MENSUAL } from "../data/eda";
import { AreaStream, MapaCalorGeo, Radar } from "../components/charts";
import { Badge, Boton, Counter, DemoBadge, Icon, Panel, Reveal, SectionTitle } from "../components/ui";
import { NAV_VISIBLE, type Vista } from "../types";

const SERIES = [
  { key: "consultas", label: "Consultas", color: "#a3e635" },
  { key: "talleres", label: "Talleres", color: "#34d399" },
  { key: "prensa", label: "Prensa", color: "#22d3ee" },
];

const ATAJOS: { vista: Vista; titulo: string; detalle: string; icono: string }[] = [
  { vista: "quienes", titulo: "Quiénes somos", detalle: "Manifiesto, pilares e historia desde 2014", icono: "users" },
  { vista: "recorrido", titulo: "Recorrido", detalle: "Actividades realizadas y agenda próxima", icono: "calendar" },
  { vista: "novedades", titulo: "Novedades", detalle: "Legislación, ciencia, agronomía y cultura", icono: "news" },
  { vista: "redes", titulo: "Redes", detalle: "Organizaciones locales, provinciales e internacionales", icono: "network" },
  { vista: "reprocann", titulo: "REPROCANN", detalle: "Programa, normativa y contacto", icono: "clipboard" },
  { vista: "facc", titulo: "FACC", detalle: "Federación y organizaciones miembras", icono: "globe" },
  { vista: "eda", titulo: "Laboratorio de datos", detalle: "EDA, mapa de calor y gradiente de peso", icono: "lab" },
  { vista: "tienda", titulo: "Tienda", detalle: "Merchandising institucional", icono: "shop" },
  { vista: "donaciones", titulo: "Donaciones", detalle: "Estructura de destino de fondos", icono: "gift" },
  { vista: "contacto", titulo: "Contacto", detalle: "Escribinos y sumate", icono: "mail" },
];

export default function Inicio({ irA }: { irA: (v: Vista) => void }) {
  const ultimas = [...NOTICIAS].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 3);
  const proximas = [...ACTIVIDADES].sort((a, b) => a.fecha.localeCompare(b.fecha)).slice(-3).reverse();

  return (
    <div className="space-y-14">
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-verde-500/12 via-white/[0.02] to-cian-400/8 p-7 sm:p-12">
        <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-lima-400/18 blur-[90px] anim-drift" />
        <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="lima">
                <Icon name="check" className="h-3 w-3" /> Asociación Civil · IGJ 1921803
              </Badge>
              <Badge tone="cian">Miembro fundadora de la FACC</Badge>
              <Badge tone="slate">CABA · Argentina</Badge>
            </div>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">
              Dashboard <span className="text-grad">harness</span> para el activismo cannábico
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-emerald-50/70">
              {ORG.descripcion}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Boton onClick={() => irA("quienes")}>
                Conocer la asociación <Icon name="arrow" className="h-4 w-4" />
              </Boton>
              <Boton variante="fantasma" onClick={() => irA("contacto")}>
                <Icon name="mail" className="h-4 w-4" /> Contacto
              </Boton>
              <Boton variante="fantasma" onClick={() => irA("eda")}>
                <Icon name="lab" className="h-4 w-4" /> Ver el análisis de datos
              </Boton>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
              {ORG.socials.map((s) => (
                <a
                  key={s.red}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 text-xs text-emerald-50/60 transition hover:text-lima-300"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/12 bg-white/[0.04] transition group-hover:border-lima-500/40 group-hover:text-lima-300">
                    <Icon name={s.red === "Facebook" ? "face" : s.red === "Instagram" ? "insta" : "youtube"} className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block font-semibold text-emerald-50/85">{s.red}</span>
                    {s.handle}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Hoja animada + KPIs */}
          <div className="space-y-4">
            <Panel className="relative overflow-hidden p-6">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-lima-400/12 blur-3xl" />
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-lima-400/80">Ficha institucional</p>
                  <p className="mt-2 text-sm font-semibold text-white">{ORG.nombre}</p>
                </div>
                <svg viewBox="0 0 24 24" className="anim-sway h-12 w-12 text-lima-400" fill="currentColor">
                  <path d="M12 2c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z" opacity="0.85" />
                  <path d="M12 6v14" stroke="#04070a" strokeWidth="1.2" fill="none" />
                </svg>
              </div>
              <dl className="mt-4 space-y-2 text-xs">
                {[
                  ["CUIT", ORG.cuit],
                  ["IGJ", ORG.igj],
                  ["Sede", ORG.sede],
                  ["Contacto", ORG.email],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3 border-b border-white/6 pb-2 last:border-0">
                    <dt className="w-20 shrink-0 text-emerald-50/45">{k}</dt>
                    <dd className="min-w-0 flex-1 break-words text-emerald-50/85">{v}</dd>
                  </div>
                ))}
              </dl>
            </Panel>

            <div className="grid grid-cols-2 gap-3">
              {KPIS.map((k, i) => (
                <Reveal key={k.label} delay={i * 90}>
                  <Panel className="h-full p-4">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-50/45">{k.label}</p>
                    <p className="mt-1 text-3xl font-bold text-grad">
                      <Counter value={Number(k.display.replace(/[^\d.]/g, ""))} suffix={k.display.replace(/[\d.]/g, "")} />
                    </p>
                    <p className="mt-1 text-[11px] leading-snug text-emerald-50/50">{k.nota}</p>
                  </Panel>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- ATAJOS (spec-driven) ---------- */}
      <section>
        <SectionTitle
          kicker="Spec driven · secciones"
          titulo="Todo el tablero, en una sola vista"
          bajada="Cada sección responde a un requisito del spec del producto. Usá los atajos para saltar directamente."
          icono="cursor"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {ATAJOS.filter((a) => NAV_VISIBLE.some((n) => n.id === a.vista)).map((a, i) => (
            <Reveal key={a.vista} delay={i * 50}>
              <button onClick={() => irA(a.vista)} className="group h-full w-full text-left">
                <Panel className="h-full p-4">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-lima-500/25 bg-lima-500/10 text-lima-300 transition group-hover:scale-110">
                    <Icon name={a.icono} />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-white">{a.titulo}</p>
                  <p className="mt-1 text-[11px] leading-snug text-emerald-50/55">{a.detalle}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[11px] text-lima-300 opacity-0 transition group-hover:opacity-100">
                    Abrir <Icon name="arrow" className="h-3 w-3" />
                  </span>
                </Panel>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- GRÁFICOS ---------- */}
      <section>
        <SectionTitle kicker="Analítica" titulo="Gráficas innovadoras e interactivas" bajada="Pasá el cursor, activá y desactivá series y hacé clic en los puntos para explorar." icono="chart" />
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AreaStream data={SERIE_MENSUAL} series={SERIES} />
          </div>
          <Radar ejes={RADAR_ACCA} />
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <MapaCalorGeo puntos={GEO_CALOR} />
          <Panel className="p-5">
            <h3 className="text-sm font-semibold text-white">Próximas actividades</h3>
            <p className="mt-1 text-xs text-emerald-50/55">Agenda 2026-2027 · la última está marcada como demo</p>
            <ul className="mt-4 space-y-3">
              {proximas.map((a) => (
                <li key={a.titulo} className="flex gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-lima-500/25 bg-lima-500/10 font-mono text-[10px] leading-tight text-lima-300">
                    {a.fecha.slice(8, 10)}
                    <br />
                    {["", "ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"][Number(a.fecha.slice(5, 7))]}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold text-white">{a.titulo}</span>
                    <span className="mt-0.5 block text-[11px] text-emerald-50/55">
                      {a.lugar} · {a.alcance}
                    </span>
                  </span>
                  {a.demo && <DemoBadge />}
                </li>
              ))}
            </ul>
            <Boton variante="fantasma" className="mt-4 w-full" onClick={() => irA("recorrido")}>
              Ver recorrido completo <Icon name="arrow" className="h-4 w-4" />
            </Boton>
          </Panel>
        </div>
      </section>

      {/* ---------- NOVEDADES PREVIEW ---------- */}
      <section>
        <SectionTitle kicker="Novedades" titulo="Lo último del ecosistema cannábico" icono="news" />
        <div className="grid gap-4 md:grid-cols-3">
          {ultimas.map((n, i) => (
            <Reveal key={n.titular} delay={i * 90}>
              <Panel className="h-full p-5">
                <div className="flex items-center justify-between gap-2">
                  <Badge tone={n.categoria === "Legislación" ? "cian" : n.categoria === "Internacional" ? "violeta" : "lima"}>{n.categoria}</Badge>
                  <span className="font-mono text-[10px] text-emerald-50/40">{n.fecha}</span>
                </div>
                <h4 className="mt-3 text-sm font-semibold leading-snug text-white">{n.titular}</h4>
                <p className="mt-2 line-clamp-4 text-[11px] leading-relaxed text-emerald-50/60">{n.bajada}</p>
                <p className="mt-3 border-t border-white/8 pt-2 text-[10px] text-emerald-50/40">Fuente: {n.fuente}</p>
              </Panel>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- SKILLS PREVIEW ---------- */}
      <section>
        <SectionTitle kicker="Skills del equipo" titulo="Capacidades aplicadas a este tablero" icono="spark" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SKILLS.slice(0, 4).map((s, i) => (
            <Reveal key={s.titulo} delay={i * 70}>
              <Panel className="h-full p-4">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-cian-400/25 bg-cian-400/10 text-cian-400">
                  <Icon name={s.icono} className="h-4 w-4" />
                </span>
                <p className="mt-3 text-xs font-semibold text-white">{s.titulo}</p>
                <p className="mt-1 text-[11px] leading-snug text-emerald-50/55">{s.detalle}</p>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                  <div className="h-full rounded-full bg-gradient-to-r from-cian-400 to-lima-400" style={{ width: `${s.nivel}%` }} />
                </div>
              </Panel>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
