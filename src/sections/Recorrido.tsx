import { useMemo, useState } from "react";
import { ACTIVIDADES, AGENDA_FILTROS } from "../data/content";
import { DIAS_SEMANA, HEATMAP_AGENDA } from "../data/eda";
import { HeatmapAgenda } from "../components/charts";
import { Badge, DemoBadge, Icon, Panel, Reveal, SectionTitle, Tabs } from "../components/ui";

const MESES = ["", "ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

const tonoAlcance: Record<string, "lima" | "cian" | "ambar" | "violeta"> = {
  Local: "cian",
  Provincial: "ambar",
  Nacional: "lima",
  Internacional: "violeta",
};

export default function Recorrido() {
  const [filtro, setFiltro] = useState<(typeof AGENDA_FILTROS)[number]>("Todos");
  const [soloDemo, setSoloDemo] = useState(false);

  const lista = useMemo(
    () =>
      [...ACTIVIDADES]
        .sort((a, b) => b.fecha.localeCompare(a.fecha))
        .filter((a) => (filtro === "Todos" ? true : a.tipo === filtro))
        .filter((a) => (soloDemo ? a.demo : true)),
    [filtro, soloDemo],
  );

  const porTipo = useMemo(() => {
    const m = new Map<string, number>();
    ACTIVIDADES.forEach((a) => m.set(a.tipo, (m.get(a.tipo) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, []);
  const maxTipo = Math.max(...porTipo.map(([, v]) => v), 1);

  return (
    <div className="space-y-12">
      <SectionTitle
        kicker="Recorrido"
        titulo="Actividades realizadas y agenda"
        bajada="Asambleas, jornadas, capacitaciones, acciones de militancia y producción de conocimiento. La agenda 2026-2027 está estructurada y marcada como demo hasta la confirmación de la organización."
        icono="calendar"
      />

      {/* Resumen */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Panel className="p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-50/45">Actividades relevadas</p>
          <p className="mt-1 text-3xl font-bold text-grad">{ACTIVIDADES.length}</p>
          <p className="mt-1 text-[11px] text-emerald-50/50">entre 2025 y 2027</p>
        </Panel>
        <Panel className="p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-50/45">Alcance nacional</p>
          <p className="mt-1 text-3xl font-bold text-grad">{ACTIVIDADES.filter((a) => a.alcance === "Nacional").length}</p>
          <p className="mt-1 text-[11px] text-emerald-50/50">acciones federales y regulatorias</p>
        </Panel>
        <Panel className="p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-50/45">Provincias alcanzadas</p>
          <p className="mt-1 text-3xl font-bold text-grad">{new Set(ACTIVIDADES.map((a) => a.provincia)).size}</p>
          <p className="mt-1 text-[11px] text-emerald-50/50">territorios con actividad</p>
        </Panel>
        <Panel className="p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-50/45">Por tipo</p>
          <div className="mt-2 space-y-1.5">
            {porTipo.slice(0, 3).map(([t, v]) => (
              <div key={t} className="flex items-center gap-2">
                <span className="w-20 shrink-0 text-[10px] text-emerald-50/60">{t}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/8">
                  <span className="block h-full rounded-full bg-gradient-to-r from-verde-400 to-lima-400" style={{ width: `${(v / maxTipo) * 100}%` }} />
                </span>
                <span className="font-mono text-[10px] text-emerald-50/50">{v}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Filtros + lista */}
      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Tabs opciones={AGENDA_FILTROS} activa={filtro} onChange={setFiltro} />
          <label className="flex cursor-pointer items-center gap-2 text-[11px] text-emerald-50/60">
            <input type="checkbox" checked={soloDemo} onChange={(e) => setSoloDemo(e.target.checked)} className="h-3.5 w-3.5 accent-ambar-400" />
            Ver solo agenda a confirmar
          </label>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {lista.map((a, i) => (
            <Reveal key={`${a.titulo}-${a.fecha}`} delay={Math.min(i * 60, 420)}>
              <Panel className="flex h-full gap-4 p-5">
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border border-lima-500/25 bg-lima-500/10">
                  <span className="font-mono text-lg font-bold leading-none text-lima-300">{a.fecha.slice(8, 10)}</span>
                  <span className="font-mono text-[10px] text-emerald-50/60">{MESES[Number(a.fecha.slice(5, 7))]}</span>
                  <span className="font-mono text-[9px] text-emerald-50/40">{a.fecha.slice(0, 4)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="slate">{a.tipo}</Badge>
                    <Badge tone={tonoAlcance[a.alcance]}>{a.alcance}</Badge>
                    {a.demo && <DemoBadge texto="A confirmar" />}
                  </div>
                  <h3 className="mt-2 text-sm font-semibold leading-snug text-white">{a.titulo}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-50/50">
                    <Icon name="pin" className="h-3 w-3" /> {a.lugar} · {a.provincia}
                  </p>
                  <p className="mt-2 text-[11px] leading-relaxed text-emerald-50/65">{a.detalle}</p>
                </div>
              </Panel>
            </Reveal>
          ))}
        </div>
        {lista.length === 0 && (
          <Panel className="p-10 text-center">
            <p className="text-sm text-emerald-50/60">No hay actividades para este filtro.</p>
          </Panel>
        )}
      </section>

      {/* Heatmap */}
      <section>
        <SectionTitle kicker="Mapa de calor" titulo="Intensidad de la agenda" bajada="Cada columna es una semana del año; cada fila, un día. El color indica la carga de actividad." icono="chart" />
        <HeatmapAgenda celdas={HEATMAP_AGENDA} dias={DIAS_SEMANA} />
      </section>
    </div>
  );
}
