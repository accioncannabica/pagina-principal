import { useMemo, useState } from "react";
import { NOTICIAS } from "../data/content";
import { Badge, Icon, Panel, Reveal, SectionTitle, Tabs } from "../components/ui";

const CATEGORIAS = ["Todas", "Legislación", "Investigación", "Agronomía", "Cultura", "Salud", "Internacional"] as const;

const TONO: Record<string, "lima" | "cian" | "ambar" | "rose" | "violeta" | "slate"> = {
  Legislación: "cian",
  Investigación: "lima",
  Agronomía: "ambar",
  Cultura: "rose",
  Salud: "violeta",
  Internacional: "slate",
};

const TERMOMETRO = [
  { tema: "ARICCAME y licencias", calor: 96, detalle: "Resoluciones 41/2026 y 69/2026 · intervención prorrogada" },
  { tema: "REPROCANN", calor: 82, detalle: "Resolución 1780/2025 · nuevos requisitos" },
  { tema: "Cáñamo industrial", calor: 88, detalle: "Flor y biomasa con THC ≤ 1%" },
  { tema: "Nueva Ley de Drogas", calor: 74, detalle: "Agenda federal de la FACC" },
  { tema: "Semillas e INASE", calor: 68, detalle: "Restricciones y fitomejoramiento" },
  { tema: "Regulación internacional", calor: 55, detalle: "Nueva Zelanda, Europa y ONU" },
];

export default function Novedades() {
  const [cat, setCat] = useState<(typeof CATEGORIAS)[number]>("Todas");
  const [q, setQ] = useState("");

  const lista = useMemo(
    () =>
      [...NOTICIAS]
        .sort((a, b) => b.fecha.localeCompare(a.fecha))
        .filter((n) => (cat === "Todas" ? true : n.categoria === cat))
        .filter((n) => (q ? (n.titular + n.bajada + n.etiquetas.join(" ")).toLowerCase().includes(q.toLowerCase()) : true)),
    [cat, q],
  );

  return (
    <div className="space-y-12">
      <SectionTitle
        kicker="Novedades y noticias"
        titulo="Investigación, legislación, agronomía y cultura"
        bajada="Selección curada de actividades recientes locales e internacionales del ecosistema cannábico, con fuente y fecha para cada dato."
        icono="news"
      />

      <div className="grid gap-5 lg:grid-cols-[0.62fr_1.38fr]">
        {/* Termómetro temático */}
        <div className="space-y-5">
          <Panel className="p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-lima-400/80">Termómetro temático</p>
            <p className="mt-2 text-[11px] text-emerald-50/55">Intensidad relativa de cada tema en la agenda pública reciente.</p>
            <ul className="mt-4 space-y-3">
              {TERMOMETRO.map((t) => (
                <li key={t.tema}>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-50/80">{t.tema}</span>
                    <span className="font-mono text-lima-300">{t.calor}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${t.calor}%`,
                        background: "linear-gradient(90deg,#22d3ee,#a3e635,#fbbf24)",
                        boxShadow: "0 0 14px rgba(163,230,53,0.45)",
                      }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-emerald-50/45">{t.detalle}</p>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel className="p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-cian-400/80">Buscar</p>
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.03] px-3 py-2">
              <Icon name="search" className="h-4 w-4 text-emerald-50/40" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="REPROCANN, cáñamo, INASE…"
                className="w-full bg-transparent text-xs text-white placeholder:text-emerald-50/30 focus:outline-none"
              />
            </div>
            <div className="mt-4 space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-50/40">Cobertura por categoría</p>
              {(["Legislación", "Investigación", "Agronomía", "Internacional"] as const).map((c) => (
                <div key={c} className="flex items-center justify-between text-[11px]">
                  <span className="text-emerald-50/65">{c}</span>
                  <span className="font-mono text-emerald-50/50">{NOTICIAS.filter((n) => n.categoria === c).length}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Muro de noticias */}
        <div>
          <div className="mb-4">
            <Tabs opciones={CATEGORIAS} activa={cat} onChange={setCat} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {lista.map((n, i) => (
              <Reveal key={n.titular} delay={Math.min(i * 70, 400)}>
                <Panel className="flex h-full flex-col p-5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone={TONO[n.categoria] ?? "slate"}>{n.categoria}</Badge>
                    <span className="font-mono text-[10px] text-emerald-50/40">{n.fecha}</span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold leading-snug text-white">{n.titular}</h3>
                  <p className="mt-2 flex-1 text-[11px] leading-relaxed text-emerald-50/65">{n.bajada}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {n.etiquetas.map((e) => (
                      <span key={e} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[9px] text-emerald-50/50">
                        #{e}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-white/8 pt-2">
                    <span className="text-[10px] text-emerald-50/40">Fuente: {n.fuente}</span>
                    {n.url && (
                      <a href={n.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-semibold text-lima-300 hover:text-lima-200">
                        Leer <Icon name="arrow" className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </Panel>
              </Reveal>
            ))}
          </div>
          {lista.length === 0 && (
            <Panel className="p-10 text-center">
              <p className="text-sm text-emerald-50/60">Sin resultados para “{q}”.</p>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
