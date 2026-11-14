import { useMemo, useState } from "react";
import {
  DATASET,
  EDA_META,
  ESTADISTICOS,
  MATRIZ_CORR,
  NUMERICAS,
  PESO_POR_GENOTIPO,
  POR_DERIVADO,
  POR_PROVINCIA,
  POR_RANGO,
  POR_TIPO,
  PUNTOS_PESO,
  stats,
} from "../data/eda";
import { BarrasCategorias, BoxPlotPorTipo, GradientePeso, Histograma, MatrizCorr } from "../components/charts";
import { DemoBadge, Panel, Reveal, SectionTitle, Tabs } from "../components/ui";

const VARS = NUMERICAS.map((n) => n.label);

export default function DataLab() {
  const [varSel, setVarSel] = useState(VARS[1]);
  const [vista, setVista] = useState<"Univariado" | "Bivariado" | "Categórico">("Univariado");

  const col = NUMERICAS.find((n) => n.label === varSel)!;
  const bins = useMemo(() => {
    const vals = DATASET.map((d) => d[col.key] as number);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const n = 8;
    const ancho = (max - min) / n;
    return Array.from({ length: n }, (_, i) => {
      const desde = min + i * ancho;
      const hasta = desde + ancho;
      const conteo = vals.filter((v) => (i === n - 1 ? v >= desde && v <= hasta : v >= desde && v < hasta)).length;
      return { label: `${Math.round(desde)}–${Math.round(hasta)}`, conteo };
    });
  }, [col]);

  const cajas = useMemo(
    () =>
      POR_TIPO.map(({ label }) => {
        const vals = DATASET.filter((d) => d.tipo === label).map((d) => d.pesoFlor);
        const s = stats(vals);
        return { label, ...s };
      }),
    [],
  );

  return (
    <div className="space-y-12">
      <SectionTitle
        kicker="Análisis exploratorio de datos"
        titulo={
          <>
            EDA, mapa de calor y <span className="text-grad">gradiente de peso</span>
          </>
        }
        bajada="Perfilado completo del dataset de la asociación: estadísticos descriptivos, distribuciones, correlaciones, cortes categóricos y rendimiento por genotipo. Todos los gráficos son interactivos."
        icono="lab"
      />

      {/* Cabecera del dataset */}
      <div className="grid gap-4 lg:grid-cols-4">
        <Panel className="p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-50/45">Dataset</p>
          <p className="mt-2 text-sm font-semibold leading-snug text-white">{EDA_META.nombre}</p>
          <p className="mt-2 text-[11px] text-emerald-50/50">{EDA_META.fuente}</p>
        </Panel>
        <Panel className="p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-50/45">Filas</p>
          <p className="mt-2 text-3xl font-bold text-grad">{EDA_META.filas}</p>
          <p className="mt-1 text-[11px] text-emerald-50/50">registros de consultas y acompañamientos</p>
        </Panel>
        <Panel className="p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-50/45">Columnas</p>
          <p className="mt-2 text-3xl font-bold text-grad">{EDA_META.columnas}</p>
          <p className="mt-1 text-[11px] text-emerald-50/50">5 numéricas · 6 categóricas</p>
        </Panel>
        <Panel className="flex flex-col justify-between p-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-50/45">Estado</p>
            <div className="mt-2">
              <DemoBadge texto="Dataset demo" />
            </div>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-emerald-50/50">
            Sustituir por registros internos: el pipeline acepta el mismo esquema de columnas.
          </p>
        </Panel>
      </div>

      {/* Vistas */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs opciones={["Univariado", "Bivariado", "Categórico"] as const} activa={vista} onChange={setVista} />
        {vista === "Univariado" && <Tabs opciones={VARS} activa={varSel} onChange={setVarSel} />}
      </div>

      {vista === "Univariado" && (
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <Histograma bins={bins} titulo={`Distribución · ${col.label}`} unidad={col.unidad} />
          <Panel className="p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-lima-400/80">Estadísticos descriptivos</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-white/10 font-mono text-[9px] uppercase tracking-wider text-emerald-50/40">
                    <th className="py-2">Variable</th>
                    <th className="py-2">Media</th>
                    <th className="py-2">Mediana</th>
                    <th className="py-2">σ</th>
                    <th className="py-2">Q1</th>
                    <th className="py-2">Q3</th>
                    <th className="py-2">Min</th>
                    <th className="py-2">Max</th>
                  </tr>
                </thead>
                <tbody>
                  {ESTADISTICOS.map((e) => (
                    <tr key={e.key} className={`border-b border-white/5 ${e.label === col.label ? "bg-lima-500/8" : ""}`}>
                      <td className="py-2 pr-2">
                        <button onClick={() => setVarSel(e.label)} className="text-left text-emerald-50/85 hover:text-lima-300">
                          {e.label}
                        </button>
                      </td>
                      <td className="py-2 font-mono text-lima-300">{e.media}</td>
                      <td className="py-2 font-mono text-emerald-50/70">{e.mediana}</td>
                      <td className="py-2 font-mono text-emerald-50/70">{e.desvio}</td>
                      <td className="py-2 font-mono text-emerald-50/50">{e.q1}</td>
                      <td className="py-2 font-mono text-emerald-50/50">{e.q3}</td>
                      <td className="py-2 font-mono text-emerald-50/40">{e.min}</td>
                      <td className="py-2 font-mono text-emerald-50/40">{e.max}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-5 rounded-xl border border-white/8 bg-white/[0.02] p-3">
              <p className="text-[11px] leading-relaxed text-emerald-50/60">
                <strong className="text-lima-300">Lectura:</strong> la media y la mediana de <em>{col.label}</em> ({ESTADISTICOS.find((e) => e.label === col.label)!.media} y{" "}
                {ESTADISTICOS.find((e) => e.label === col.label)!.mediana} {col.unidad}) se mantienen próximas, lo que sugiere una distribución
                sin asimetrías extremas. La comparación Q1–Q3 ({ESTADISTICOS.find((e) => e.label === col.label)!.q1}–{ESTADISTICOS.find((e) => e.label === col.label)!.q3}) cubre el
                50% central de los registros.
              </p>
            </div>
          </Panel>
        </div>
      )}

      {vista === "Bivariado" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <MatrizCorr filas={MATRIZ_CORR} />
          <BoxPlotPorTipo grupos={cajas} />
        </div>
      )}

      {vista === "Categórico" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <BarrasCategorias datos={POR_TIPO} titulo="Consultas por tipo" subtitulo="Frecuencia relativa sobre el total" color="#a3e635" />
          <BarrasCategorias datos={POR_RANGO} titulo="Consultas por rango etario" color="#22d3ee" />
          <BarrasCategorias datos={POR_PROVINCIA} titulo="Consultas por provincia" color="#34d399" />
          <BarrasCategorias datos={POR_DERIVADO} titulo="Formato de uso más acompañado" color="#fbbf24" />
        </div>
      )}

      {/* Gradiente de peso */}
      <section>
        <SectionTitle
          kicker="Gradiente de peso"
          titulo="Rendimiento por genotipo y ambiente"
          bajada="Cada punto es un cultivo: el color y el tamaño codifican el peso de flor seca. Usá los filtros de ambiente, genotipo y el control de THC para explorar."
          icono="leaf"
        />
        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <GradientePeso puntos={PUNTOS_PESO} genotipos={PESO_POR_GENOTIPO.map((p) => p.genotipo)} />
          <Panel className="p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-lima-400/80">Resumen por genotipo</p>
            <div className="mt-4 space-y-3">
              {PESO_POR_GENOTIPO.map((p) => {
                const maxMedia = Math.max(...PESO_POR_GENOTIPO.map((x) => x.media));
                return (
                  <div key={p.genotipo}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-emerald-50/80">{p.genotipo}</span>
                      <span className="font-mono text-lima-300">{p.media} g</span>
                    </div>
                    <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-white/8">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cian-400 via-lima-400 to-ambar-400"
                        style={{ width: `${(p.media / maxMedia) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1 font-mono text-[9px] text-emerald-50/40">
                      mediana {p.mediana} g · σ {p.desvio} · rango {p.min}–{p.max} g
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 rounded-xl border border-white/8 bg-white/[0.02] p-3">
              <p className="text-[11px] leading-relaxed text-emerald-50/60">
                <strong className="text-lima-300">Cómo leer el gradiente:</strong> los tonos fríos indican pesos bajos y los cálidos, pesos
                altos. La forma del marcador distingue el ambiente de cultivo. Un mismo genotipo puede variar notablemente según el ambiente,
                la superficie y el porcentaje de THC analizado.
              </p>
            </div>
          </Panel>
        </div>
      </section>

      <Reveal>
        <Panel className="flex flex-wrap items-center gap-3 p-5">
          <DemoBadge texto="Metodología" />
          <p className="text-[11px] leading-relaxed text-emerald-50/60">
            Generación determinista con semilla fija (LCG + Box-Muller), perfiles con clamp a rangos biológicamente plausibles: 1-9 plantas
            florecidas, THC 4-29%, peso de flor 25-640 g. Estadísticos calculados sobre la muestra completa; cuantiles por interpolación
            lineal. Todas las visualizaciones son SVG accesibles con texto alternativo.
          </p>
        </Panel>
      </Reveal>
    </div>
  );
}
