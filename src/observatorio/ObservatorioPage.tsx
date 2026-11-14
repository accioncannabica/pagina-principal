import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AtSign, BookOpen, CalendarDays, ChartNoAxesCombined, CircleDot, Database, FlaskConical, Globe2, GraduationCap, LibraryBig, Mail, MapPinned, Scale, Sprout, Wallet } from 'lucide-react';
import {
  COUNTRIES,
  FRAMEWORKS,
  REGIONS,
  REGION_COLORS,
  arrestsPerKUsers,
  type Country,
  type FrameworkKey,
  type RegionKey,
} from './data/countries';
import { MILESTONES, SERIES, SOURCES } from './data/trends';
import WorldMap, { type MapMetric } from './components/WorldMap';
import LogoSlot from './components/LogoSlot';
import {
  AcceptanceChart,
  EnforcementScatter,
  EvolutionChart,
  FrameworkMatrix,
  GenerationsChart,
  ModesEvolution,
  ModesBars,
  RankingChart,
  RegionalModesStacked,
} from './components/charts';
import { CountryDrawer, CountryTable } from './components/CountryPanel';
import {
  CommercialScatter,
  HempEvolution,
  HempTable,
  ModelSummary,
  OilPriceChart,
  PriceGapChart,
  join,
} from './components/MarketCharts';
import { HEMP_META, type HempStatus } from './data/market';
import {
  EcoByRegion,
  EcoRanking,
  EcoScatter,
  EcoTable,
  Glossary,
  joinEco,
} from './components/EcoCharts';
import { BarMeter, Badge, Card, Chip, Kpi, Sparkline, fmt, fmtM } from './components/ui';
import { useOpenData } from './lib/openData';
import { FreshnessBar, Notice } from './components/ResearchUI';
import CultureView from './components/CultureView';
import JusticeView from './components/JusticeView';
import TerritoryView from './components/TerritoryView';
import EdaView from './components/EdaView';
import SourcesView from './components/SourcesView';
import ContactView from './components/ContactView';
import LiteratureView from './components/LiteratureView';
import './observatorio.css';

const TABS = [
  { key: 'panorama', label: 'Panorama global', icon: Globe2 },
  { key: 'territorio', label: 'Atlas territorial', icon: MapPinned },
  { key: 'uso', label: 'Formas de uso', icon: CircleDot },
  { key: 'penal', label: 'Marcos penales y policiales', icon: Scale },
  { key: 'gasto', label: 'Gasto judicial', icon: Wallet },
  { key: 'mercado', label: 'Cáñamo, comercio y precios', icon: Sprout },
  { key: 'cultura', label: 'Cultura y encuentros', icon: CalendarDays },
  { key: 'tendencias', label: 'Evolución y tendencias', icon: ChartNoAxesCombined },
  { key: 'redes', label: 'ONGs y formación', icon: GraduationCap },
  { key: 'investigacion', label: 'Investigación publicada', icon: LibraryBig },
  { key: 'eda', label: 'Laboratorio EDA', icon: FlaskConical },
  { key: 'diccionario', label: 'Diccionario', icon: BookOpen },
  { key: 'fuentes', label: 'Fuentes y actualización', icon: Database },
  { key: 'contacto', label: 'Contacto', icon: Mail },
] as const;
type TabKey = (typeof TABS)[number]['key'];

// El hash del sitio es "#observatorio/<pestaña>": el primer segmento es la vista de la shell.
function tabFromHash(): TabKey | null {
  const [vista, key] = window.location.hash.slice(1).split('/');
  return vista === 'observatorio' && TABS.some(t => t.key === key) ? key as TabKey : null;
}

export default function ObservatorioPage() {
  const [tab, setTab] = useState<TabKey>(() => tabFromHash() ?? 'panorama');
  const [metric, setMetric] = useState<MapMetric>('prevalence');
  const [regions, setRegions] = useState<RegionKey[]>([]);
  const [frameworks, setFrameworks] = useState<FrameworkKey[]>([]);
  const [year, setYear] = useState(2024);
  const [selected, setSelected] = useState<Country | null>(null);
  const navigationRef = useRef<HTMLElement>(null);
  const openData = useOpenData(tab);
  const extendedView = ['territorio', 'gasto', 'cultura', 'investigacion', 'eda', 'fuentes', 'contacto'].includes(tab);
  useEffect(() => { window.history.replaceState(null, '', `#observatorio/${tab}`); }, [tab]);
  useEffect(() => {
    const nav = navigationRef.current;
    const active = nav?.querySelector<HTMLElement>('button[aria-current="page"]');
    if (nav && active) nav.scrollTo({ left: active.offsetLeft - nav.offsetLeft - (nav.clientWidth - active.clientWidth) / 2, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }, [tab]);
  useEffect(() => {
    const onHashChange = () => {
      const key = tabFromHash();
      if (key) setTab(key);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const list = useMemo(
    () =>
      openData.countries.filter(
        (c) =>
          (regions.length === 0 || regions.includes(c.region)) &&
          (frameworks.length === 0 || frameworks.includes(c.framework)),
      ),
    [regions, frameworks, openData.countries],
  );

  const agg = useMemo(() => {
    const users = list.reduce((s, c) => s + c.users, 0);
    const pop = list.reduce((s, c) => s + c.pop, 0);
    const w = (fn: (c: Country) => number) =>
      list.reduce((s, c) => s + fn(c) * c.users, 0) / (users || 1);
    return {
      users,
      pop,
      prevalence: pop ? (users / pop) * 100 : 0,
      arrests: w((c) => c.arrests),
      perK: w((c) => arrestsPerKUsers(c)),
      acceptance: w((c) => c.acceptance),
      prison: w((c) => c.maxPrison),
      legal: list.filter((c) => c.framework === 'legal').length,
      medical: list.filter((c) => c.framework === 'medicinal').length,
      zeroJail: list.filter((c) => c.maxPrison === 0).length,
      modes: {
        smoke: w((c) => c.modes.smoke),
        vape: w((c) => c.modes.vape),
        edible: w((c) => c.modes.edible),
        oil: w((c) => c.modes.oil),
        hash: w((c) => c.modes.hash),
        tea: w((c) => c.modes.tea),
      },
    };
  }, [list]);

  const joined = useMemo(() => join(list), [list]);

  const mkt = useMemo(() => {
    const n = joined.length || 1;
    const withLegal = joined.filter((c) => c.m.thcLegal > 0);
    const withCbdOil = joined.filter((c) => c.m.cbdOil > 0);
    const avg = (fn: (c: (typeof joined)[number]) => number) => joined.reduce((s, c) => s + fn(c), 0) / n;
    return {
      marketUsd: joined.reduce((s, c) => s + c.m.marketUsd, 0),
      hempHa: joined.reduce((s, c) => s + c.m.hempHa, 0),
      hempCountries: joined.filter((c) => c.m.hemp === 'industrial').length,
      cbdFree: joined.filter((c) => c.m.cbd === 'libre').length,
      illicit: avg((c) => c.m.illicitShare),
      tax: avg((c) => c.m.tax),
      cagr: avg((c) => c.m.cagr),
      priceLegal: withLegal.length ? withLegal.reduce((s, c) => s + c.m.thcLegal, 0) / withLegal.length : 0,
      priceIllicit: avg((c) => c.m.thcIllicit),
      cbdOil: withCbdOil.length ? withCbdOil.reduce((s, c) => s + c.m.cbdOil, 0) / withCbdOil.length : 0,
      legalChannels: withLegal.length,
      cheapest: [...joined].filter((c) => c.m.thcIllicit > 0).sort((a, b) => a.m.thcIllicit - b.m.thcIllicit)[0],
      priciest: [...joined].sort((a, b) => b.m.thcIllicit - a.m.thcIllicit)[0],
      topHemp: [...joined].sort((a, b) => b.m.hempHa - a.m.hempHa)[0],
      topMarket: [...joined].sort((a, b) => b.m.marketUsd - a.m.marketUsd)[0],
    };
  }, [joined]);

  const ecoList = useMemo(() => joinEco(list), [list]);

  const eco = useMemo(() => {
    const n = ecoList.length || 1;
    const sum = (fn: (c: (typeof ecoList)[number]) => number) => ecoList.reduce((s, c) => s + fn(c), 0);
    return {
      ngos: sum((c) => c.e.ngos),
      patientOrgs: sum((c) => c.e.patientOrgs),
      universities: sum((c) => c.e.universities),
      programs: sum((c) => c.e.programs),
      papers: sum((c) => c.e.papers),
      perCountry: sum((c) => c.e.ngos) / n,
      topNgo: [...ecoList].sort((a, b) => b.e.ngos - a.e.ngos)[0],
      topUni: [...ecoList].sort((a, b) => b.e.universities - a.e.universities)[0],
      topPapers: [...ecoList].sort((a, b) => b.e.papers - a.e.papers)[0],
      pioneer: [...ecoList].sort((a, b) => a.e.since - b.e.since)[0],
      withoutUni: ecoList.filter((c) => c.e.universities === 0).length,
    };
  }, [ecoList]);

  const seriesUpTo = SERIES.filter((s) => s.year <= year);
  const point = SERIES.find((s) => s.year === year) ?? SERIES[SERIES.length - 1];
  const prev = seriesUpTo[seriesUpTo.length - 2] ?? point;
  const y2000 = SERIES.find((s) => s.year === 2000)!;

  const delta = (v: number, b: number, d = 0) => `${v >= b ? '+' : ''}${fmt(v - b, d)}`;

  const insights = useMemo(() => {
    const penal = list.filter((c) => c.framework === 'penal');
    const legal = list.filter((c) => c.framework === 'legal');
    const penalUsers = penal.reduce((s, c) => s + c.users, 0);
    const legalUsers = legal.reduce((s, c) => s + c.users, 0);
    const penalPerK = penal.length ? penal.reduce((s, c) => s + arrestsPerKUsers(c) * c.users, 0) / (penalUsers || 1) : 0;
    const legalPerK = legal.length ? legal.reduce((s, c) => s + arrestsPerKUsers(c) * c.users, 0) / (legalUsers || 1) : 0;
    const harshest = [...list].sort((a, b) => b.arrests - a.arrests)[0];
    const biggest = [...list].sort((a, b) => b.users - a.users)[0];
    const fastest = [...list].sort((a, b) => b.trend - a.trend)[0];
    return { penalUsers, legalUsers, penalPerK, legalPerK, harshest, biggest, fastest };
  }, [list]);

  const reset = () => {
    setRegions([]);
    setFrameworks([]);
  };

  return (
    <div className="observatorio-root relative text-slate-100">
      <div className="relative">
        {/* ── Cabecera ───────────────────────────────────────────── */}
        <header className="mb-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Espacio reservado para el logo de Acción Cannábica */}
              <LogoSlot className="h-[60px] w-[60px] sm:h-[72px] sm:w-[72px]" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300/80">
                  Observatorio global de cannabis · edición 2026
                </p>
                <h2 className="mt-2 text-3xl font-semibold leading-[1.1] tracking-tight sm:text-[40px]">
                  <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-indigo-300 bg-clip-text text-transparent">
                    Acción Cannábica
                  </span>
                </h2>
                <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-emerald-100/90">
                  Asociación Civil Acción Cannábica, inscripta y aprobada legalmente bajo la personería jurídica número
                  1921803 de la Inspección General de Justicia (I.G.J.) Argentina
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                  Consumo, policía y ley: el mapa mundial del cannabis. {COUNTRIES.length} países comparados por formas
                  de consumo, prevalencia, régimen penal y aplicación policial. Explora cómo la misma sustancia se
                  castiga —o se vende en farmacia— según la frontera que se cruce.
                </p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-slate-400">
                  <a className="inline-flex items-center gap-1.5 hover:text-emerald-300" href="mailto:accioncannabica@gmail.com"><Mail size={12} />accioncannabica@gmail.com</a>
                  <a className="inline-flex items-center gap-1.5 hover:text-emerald-300" href="https://www.instagram.com/accannabica/" target="_blank" rel="noopener noreferrer"><AtSign size={12} />@accannabica</a>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Corte temporal global</p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {SERIES.filter((s) => [2000, 2010, 2015, 2020, 2024].includes(s.year)).map((s) => (
                  <button
                    key={s.year}
                    onClick={() => setYear(s.year)}
                    className={
                      'rounded-lg px-2.5 py-1 text-xs font-medium tabular-nums transition ' +
                      (year === s.year ? 'bg-emerald-400/20 text-emerald-200' : 'text-slate-400 hover:bg-white/5')
                    }
                  >
                    {s.year}
                  </button>
                ))}
              </div>
              <p className="mt-2 max-w-[15rem] text-[10px] leading-snug text-slate-500">
                Corte de la serie histórica de la base anterior, no de las nuevas fuentes territoriales. Su fecha de
                consulta y su período se informan en cada vista.
              </p>
            </div>
          </div>

          {/* filtros */}
          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-[10px] uppercase tracking-wider text-slate-500">Región</span>
              {REGIONS.map((r) => (
                <Chip
                  key={r}
                  active={regions.includes(r)}
                  color={REGION_COLORS[r]}
                  onClick={() =>
                    setRegions((v) => (v.includes(r) ? v.filter((x) => x !== r) : [...v, r]))
                  }
                >
                  {r.replace(' y Oriente Medio', '·OM').replace('Europa occidental', 'Europa O.').replace('Europa oriental', 'Europa Or.')}
                </Chip>
              ))}
            </div>
            <div className="hidden h-6 w-px bg-white/10 sm:block" />
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-[10px] uppercase tracking-wider text-slate-500">Marco</span>
              {(Object.keys(FRAMEWORKS) as FrameworkKey[]).map((k) => (
                <Chip
                  key={k}
                  active={frameworks.includes(k)}
                  color={FRAMEWORKS[k].color}
                  count={COUNTRIES.filter((c) => c.framework === k).length}
                  onClick={() =>
                    setFrameworks((v) => (v.includes(k) ? v.filter((x) => x !== k) : [...v, k]))
                  }
                >
                  {FRAMEWORKS[k].short}
                </Chip>
              ))}
              {(regions.length > 0 || frameworks.length > 0) && (
                <button
                  onClick={reset}
                  className="ml-1 rounded-full border border-white/10 px-2.5 py-1.5 text-[11px] text-slate-400 transition hover:text-white"
                >
                  ✕ Quitar filtros
                </button>
              )}
            </div>
          </div>
        </header>

        {/* ── KPIs ───────────────────────────────────────────────── */}
        {!extendedView && <p className="mb-3 text-[10px] uppercase tracking-wider text-amber-200/70">Base histórica orientativa: indicadores originales pendientes de validación individual</p>}
        {!extendedView && <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
          <Kpi
            label="Consumidores en el mundo"
            value={fmt(point.users, 0)}
            unit="millones"
            color="#34d399"
            delta={delta(point.users, prev.users, 0)}
            deltaLabel="vs. corte anterior"
            spark={seriesUpTo.map((s) => s.users)}
            hint={`${fmt((point.users / point.prevalence) * 100, 0)} M de personas de 15-64 años bajo ese régimen`}
          />
          <Kpi
            label="Prevalencia adulta"
            value={fmt(point.prevalence, 1)}
            unit="% 15-64"
            color="#22d3ee"
            delta={delta(point.prevalence, y2000.prevalence, 1)}
            deltaLabel="pp desde 2000"
            spark={seriesUpTo.map((s) => s.prevalence)}
            hint="El crecimiento se concentra en América del Norte y Oceanía"
          />
          <Kpi
            label="Detenciones por cannabis"
            value={fmt(point.arrests, 2)}
            unit="millones/año"
            color="#fb7185"
            delta={delta(point.arrests, prev.arrests, 2)}
            deltaLabel="vs. corte anterior"
            spark={seriesUpTo.map((s) => s.arrests)}
            hint="Baja donde se reguló el mercado, se mantiene en regímenes penales"
          />
          <Kpi
            label="Jurisdicciones con reformas"
            value={`${point.legalCountries + point.medCountries}`}
            unit={`(${point.legalCountries} uso adulto · ${point.medCountries} medicinal)`}
            color="#a3e635"
            delta={`+${point.legalCountries + point.medCountries - y2000.legalCountries - y2000.medCountries}`}
            deltaLabel="desde 2000"
            spark={seriesUpTo.map((s) => s.medCountries + s.legalCountries)}
            hint="El acceso medicinal es la puerta de entrada habitual"
          />
          <Kpi
            label="Aceptación cultural"
            value={fmt(point.acceptance, 0)}
            unit="/100"
            color="#818cf8"
            delta={delta(point.acceptance, y2000.acceptance, 0)}
            deltaLabel="pp desde 2000"
            spark={seriesUpTo.map((s) => s.acceptance)}
            hint="La opinión pública precede a la reforma legal entre 5 y 10 años"
          />
        </div>}

        {/* ── Navegación ─────────────────────────────────────────── */}
        <nav ref={navigationRef} aria-label="Vistas del observatorio" className="mb-4 flex gap-2 overflow-x-auto border-b border-white/10 pb-3">
          {TABS.map((t) => (
            <button
              key={t.key}
              aria-current={tab === t.key ? 'page' : undefined}
              onClick={() => setTab(t.key)}
              className={
                'flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-[12px] font-medium transition ' +
                (tab === t.key
                  ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-100'
                  : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-200')
              }
            >
              <t.icon size={15} aria-hidden />
              {t.label}
            </button>
          ))}
        </nav>
          <p className="mb-3 text-[11px] text-slate-500">
            Selección: <span className="text-slate-300">{list.length} países</span>
            {!extendedView && <> · <span className="text-slate-300">{fmtM(agg.users)}</span> de consumidores (base orientativa)</>}
          </p>
          <FreshnessBar data={openData} view={tab} onSources={() => setTab('fuentes')} />
          {!extendedView && <Notice>La base anterior se mantiene para continuidad del trabajo. Sus estimaciones, precios, series y conteos institucionales no tienen verificación individual completa y no deben citarse como cifras oficiales. Las fuentes nuevas, períodos y vacíos están detallados en Fuentes y actualización.</Notice>}

          {tab === 'territorio' && <TerritoryView data={openData} countries={list} />}
          {tab === 'gasto' && <JusticeView countries={list} costs={openData.costs} />}
          {tab === 'cultura' && <CultureView events={openData.events} countries={list} />}
          {tab === 'investigacion' && <LiteratureView countries={list} />}
          {tab === 'eda' && <EdaView countries={list} territory={openData.territory} />}
          {tab === 'fuentes' && <SourcesView data={openData} />}
          {tab === 'contacto' && <ContactView />}

        {/* ── PANORAMA ───────────────────────────────────────────── */}
        {tab === 'panorama' && (
          <div className="space-y-5">
            <Card
              title="Dónde se consume y con qué régimen legal"
              subtitle="Coropleta esquemática: cambia la métrica para ver el estatus normativo, la prevalencia, la presión policial, la aceptación social, el régimen del cáñamo o el precio del gramo. Cada mosaico es un país."
            >
              <WorldMap countries={list} metric={metric} onMetricChange={setMetric} selected={selected?.iso ?? null} onSelect={setSelected} />
            </Card>

            <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
              <Card
                title="Ranking de países en la selección"
                subtitle="Ordena por prevalencia, usuarios, detenciones, pena máxima o aceptación cultural. Color según marco legal."
              >
                <RankingChart list={list} metric="prevalence" metricLabel="prevalencia adulta (%)" onSelect={setSelected} />
              </Card>

              <Card title="Qué dice la comparación" subtitle="Lecturas automáticas de la selección activa.">
                <div className="space-y-3">
                  <Insight
                    color="#34d399"
                    title="Uso adulto regulado"
                    body={`${agg.legal} países del análisis concentran ${fmtM(insights.legalUsers)} de consumidores. La media de detenciones es de ${fmt(insights.legalPerK, 1)} por cada 1.000 usuarios: la policía sale del circuito del consumidor.`}
                  />
                  <Insight
                    color="#fb7185"
                    title="Régimen penal estricto"
                    body={`${fmtM(insights.penalUsers)} de consumidores viven bajo penas de prisión, con ${fmt(insights.penalPerK, 1)} detenciones por cada 1.000 usuarios — ${
                      insights.legalPerK > 0 ? fmt(insights.penalPerK / insights.legalPerK, 1) : '—'
                    } veces más que en los mercados regulados.`}
                  />
                  <Insight
                    color="#fbbf24"
                    title="Máxima presión policial"
                    body={
                      insights.harshest
                        ? `${insights.harshest.name} registra ${insights.harshest.arrests} detenciones por 100.000 habitantes con una prevalencia del ${fmt(insights.harshest.prevalence, 1)} % y una pena máxima de ${insights.harshest.maxPrison === 0 ? 'sin prisión' : `${insights.harshest.maxPrison} años`}.`
                        : 'Sin datos para la selección.'
                    }
                  />
                  <Insight
                    color="#a78bfa"
                    title="Mercado en expansión"
                    body={
                      insights.fastest
                        ? `${insights.fastest.name} es el país que más crece en la selección: ${fmt(insights.fastest.trend, 1)} puntos porcentuales de prevalencia desde 2010.`
                        : '—'
                    }
                  />
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Formas de uso en la selección</p>
                    <div className="mt-2">
                      <ModesBars modes={agg.modes} base="los países filtrados" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card
              title="Ficha comparativa de todos los países"
              subtitle="Tabla ordenable con el conjunto de indicadores: prevalencia, usuarios, intensidad policial, pena máxima y año de la última reforma."
            >
              <CountryTable list={list} onSelect={setSelected} selected={selected?.iso ?? null} />
            </Card>
          </div>
        )}

        {/* ── FORMAS DE USO ──────────────────────────────────────── */}
        {tab === 'uso' && (
          <div className="space-y-5">
            <div className="grid gap-5 lg:grid-cols-3">
              <Card
                title="Formas de consumo en el mundo"
                subtitle="Media ponderada por número de consumidores en los países del análisis."
                className="lg:col-span-1"
              >
                <ModesBars modes={agg.modes} base="los países seleccionados" />
              </Card>
              <Card
                title="Regiones: coctel de vías de consumo"
                subtitle="Barras apiladas con el peso de cada vía. El hachís domina en Europa occidental, el té y el hachís artesanal en Asia meridional."
                className="lg:col-span-2"
              >
                <RegionalModesStacked />
              </Card>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <Card
                title="La forma de consumo cambia con la regulación"
                subtitle="Cuando el producto pasa a ser regulado, la vía fumada pierde terreno frente al vaporizador, los comestibles y los aceites estandarizados en dosis."
              >
                <ModesEvolution />
              </Card>
              <Card
                title="Generaciones: quién consume hoy"
                subtitle="Distribución de los consumidores por cohorte de edad. En 2010 el peso estaba en la Generación X; en 2024, en Millennials y Gen Z."
              >
                <GenerationsChart />
                <div className="mt-3 space-y-1.5">
                  {[
                    ['Gen Z (18-27)', 'Vaporiza y prefiere comestibles: productos con etiqueta, dosis y sabor.'],
                    ['Millennials (28-43)', 'Compran en tiendas reguladas y buscan perfiles CBD/THC equilibrados.'],
                    ['Gen X (44-59)', 'Estabilizan su consumo; el acceso medicinal llega por dolor crónico e insomnio.'],
                  ].map(([g, t]) => (
                    <p key={g} className="text-[11px] leading-snug text-slate-400">
                      <span className="font-semibold text-slate-200">{g}:</span> {t}
                    </p>
                  ))}
                </div>
              </Card>
            </div>

            <Card
              title="Formas de uso frente al castigo"
              subtitle="Los países que castigan la vía fumada pero toleran el aceite y los comestibles generan mercados paralelos: el mismo usuario, dos marcos distintos."
            >
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    t: 'Tailandia',
                    n: 'Aceite y comestibles sobre un mercado informal recién deslistado; la nueva ley vuelve a limitar la flor.',
                    c: '#a3e635',
                    iso: 'THA',
                    k: 'oil',
                  },
                  {
                    t: 'India y Nepal',
                    n: 'El té de bhang y el uso ritual conviven con la prohibición de flor y resina desde 1976-1985.',
                    c: '#f59e0b',
                    iso: 'IND',
                    k: 'tea',
                  },
                  {
                    t: 'España',
                    n: 'La resina prensada sigue siendo la puerta de entrada pese al protagonismo de la flor en los clubes.',
                    c: '#60a5fa',
                    iso: 'ESP',
                    k: 'hash',
                  },
                ].map((x) => {
                  const c = COUNTRIES.find((cc) => cc.iso === x.iso)!;
                  return (
                    <div key={x.t} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">{x.t}</p>
                        <Badge color={x.c}>{FRAMEWORKS[c.framework].short}</Badge>
                      </div>
                      <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{x.n}</p>
                      <p className="mt-3 text-2xl font-semibold tabular-nums" style={{ color: x.c }}>
                        {fmt(c.modes[x.k as 'tea'], 0)}
                        <span className="text-xs text-slate-500"> %</span>
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {x.k === 'tea'
                          ? 'consumo oral tradicional'
                          : x.k === 'oil'
                            ? 'aceites y sublingual'
                            : 'hachís y concentrados'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* ── MARCOS PENALES ─────────────────────────────────────── */}
        {tab === 'penal' && (
          <div className="space-y-5">
            <Card
              title="Prevalencia frente a aplicación policial"
              subtitle="Cada burbuja es un país de la base anterior. Es una comparación exploratoria no auditada: no permite inferir causalidad entre la intensidad del castigo y el consumo."
            >
              <EnforcementScatter list={list} onSelect={setSelected} />
            </Card>

            <Card
              title="Matriz de marcos: consumo, policía y pena"
              subtitle="Promedios ponderados por usuarios. La columna «por 1.000 usuarios» mide cuántos consumidores terminan en el circuito policial."
            >
              <FrameworkMatrix list={list} />
            </Card>

            <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
              <Card
                title="Escala de penas por posesión simple"
                subtitle="Años máximos de prisión teórica. Cero significa que la posesión para consumo no es delito o solo lleva multa administrativa."
              >
                <RankingChart list={list} metric="maxPrison" metricLabel="pena máxima por posesión (años)" onSelect={setSelected} />
              </Card>
              <Card
                title="Volumen estimado de detenciones por marco"
                subtitle="Millones de detenciones o comunicaciones anuales atribuibles al cannabis, calculadas con la tasa por 100.000 habitantes y la población adulta de cada país."
              >
                <div className="space-y-3">
                  {(Object.keys(FRAMEWORKS) as FrameworkKey[])
                    .map((k) => {
                      const l = list.filter((c) => c.framework === k);
                      const volume = l.reduce((s, c) => s + c.arrests * c.pop * 10, 0) / 1e6;
                      return { k, l, volume };
                    })
                    .filter((x) => x.l.length)
                    .sort((a, b) => b.volume - a.volume)
                    .map((x) => (
                      <div key={x.k}>
                        <BarMeter
                          value={x.volume}
                          max={Math.max(
                            ...(list.length
                              ? (Object.keys(FRAMEWORKS) as FrameworkKey[]).map((k2) =>
                                  list
                                    .filter((c) => c.framework === k2)
                                    .reduce((s, c) => s + c.arrests * c.pop * 10, 0) / 1e6,
                                )
                              : [1]),
                          )}
                          color={FRAMEWORKS[x.k].color}
                          label={FRAMEWORKS[x.k].label}
                          right={`${fmt(x.volume, 2)} M`}
                        />
                        <p className="mt-1 pl-[10.75rem] text-[10px] text-slate-500">
                          {x.l.length} países · {fmtM(x.l.reduce((s, c) => s + c.users, 0))} de consumidores
                        </p>
                      </div>
                    ))}
                  <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Total en la selección</p>
                    <p className="text-2xl font-semibold tabular-nums text-white">
                      {fmt(
                        list.reduce((s, c) => s + c.arrests * c.pop * 10, 0) / 1e6,
                        2,
                      )}{' '}
                      <span className="text-xs font-normal text-slate-400">millones de detenciones/año</span>
                    </p>
                    <p className="mt-1 text-[11px] leading-snug text-slate-500">
                      Equivale a una detención policial cada{' '}
                      {fmt(
                        (list.reduce((s, c) => s + c.users, 0) * 1e6) /
                          ((list.reduce((s, c) => s + c.arrests * c.pop * 10, 0) / 1e6) * 1e6 || 1),
                        0,
                      )}{' '}
                      consumidores cada año, aproximadamente.
                    </p>
                  </div>
                </div>
              </Card>

              <Card
                title="Cuatro contrastes que explican el mapa"
                subtitle="Mismo producto, marcos incomparables."
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {contrast(list).map((x) => (
                    <div key={x.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                      <p className="text-xs font-semibold text-white">{x.title}</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{x.body}</p>
                      <div className="mt-2.5 flex items-end gap-4">
                        {x.pairs.map((p) => (
                          <div key={p.l}>
                            <p className="text-lg font-semibold tabular-nums" style={{ color: p.c }}>
                              {p.v}
                            </p>
                            <p className="text-[10px] text-slate-500">{p.l}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card
              title="Aceptación cultural por región"
              subtitle="La opinión pública se adelanta a la ley. Europa occidental y América del Norte cruzan el umbral mayoritario antes de 2018; Asia y África siguen por debajo de 30."
            >
              <AcceptanceChart />
            </Card>
          </div>
        )}

        {/* ── CÁÑAMO, COMERCIO Y PRECIOS ─────────────────────────── */}
        {tab === 'mercado' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
              <Kpi
                label="Mercado legal en la selección"
                value={fmt(mkt.marketUsd / 1000, 1)}
                unit="miles M USD"
                color="#34d399"
                delta={`+${fmt(mkt.cagr, 0)} %`}
                deltaLabel="crecimiento anual medio"
                hint={`${mkt.legalChannels} países con canal de venta legal de flor con THC`}
              />
              <Kpi
                label="Superficie de cáñamo"
                value={fmt(mkt.hempHa / 1000, 1)}
                unit="miles de ha"
                color="#a3e635"
                hint={`${mkt.hempCountries} países con cáñamo industrial plenamente regulado`}
              />
              <Kpi
                label="Consumo en canal ilícito"
                value={fmt(mkt.illicit, 0)}
                unit="% medio"
                color="#fb7185"
                hint="Incluso donde hay mercado regulado persiste la oferta informal"
              />
              <Kpi
                label="Precio medio de la flor"
                value={fmt(mkt.priceIllicit, 1)}
                unit="USD/g (ilícito)"
                color="#fbbf24"
                delta={mkt.priceLegal > 0 ? `${fmt(mkt.priceLegal - mkt.priceIllicit, 1)}` : undefined}
                deltaLabel={mkt.priceLegal > 0 ? `USD/g vs. canal legal (${fmt(mkt.priceLegal, 1)} $)` : undefined}
                hint={
                  mkt.cheapest && mkt.priciest
                    ? `De ${fmt(mkt.cheapest.m.thcIllicit, 1)} $ en ${mkt.cheapest.name} a ${fmt(mkt.priciest.m.thcIllicit, 0)} $ en ${mkt.priciest.name}`
                    : undefined
                }
              />
              <Kpi
                label="Aceite de CBD"
                value={fmt(mkt.cbdOil, 0)}
                unit="USD / 10 ml"
                color="#22d3ee"
                hint={`${mkt.cbdFree} países con venta libre de CBD · impuesto medio ${fmt(mkt.tax, 1)} %`}
              />
            </div>

            <Card
              title="El cáñamo industrial, la otra mitad de la planta"
              subtitle="Mismo género botánico, régimen jurídico distinto: el umbral de THC (0,2 %, 0,3 % o 1 %) decide si una plantación es agricultura o delito."
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {(Object.keys(HEMP_META) as HempStatus[]).map((k) => {
                  const l = joined.filter((c) => c.m.hemp === k);
                  const ha = l.reduce((a, c) => a + c.m.hempHa, 0);
                  return (
                    <div key={k} className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                      <p className="flex items-center gap-2 text-xs font-semibold text-white">
                        <span className="h-2.5 w-2.5 rounded-sm" style={{ background: HEMP_META[k].color }} />
                        {HEMP_META[k].label}
                      </p>
                      <p className="mt-2 text-2xl font-semibold tabular-nums" style={{ color: HEMP_META[k].color }}>
                        {l.length}
                        <span className="text-xs font-normal text-slate-500"> países</span>
                      </p>
                      <p className="text-[11px] text-slate-400">{fmt(ha, 0)} ha declaradas</p>
                      <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{HEMP_META[k].desc}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4">
                <HempTable list={joined} onSelect={setSelected} />
              </div>
            </Card>

            <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
              <Card
                title="Precio de la flor con THC: canal legal vs. mercado ilícito"
                subtitle="Un gramo cuesta menos de 1 USD en Paraguay o Nigeria y supera los 50 USD en Japón. Donde el mercado se regula, el precio legal tiende a situarse por debajo del ilícito."
              >
                <PriceGapChart list={joined} onSelect={setSelected} />
              </Card>
              <Card
                title="Flor de CBD y aceites"
                subtitle="Comparativa de precios minoristas del cáñamo y los extractos. Los aceites se normalizan a frascos de 10 ml."
              >
                <OilPriceChart list={joined} />
              </Card>
            </div>

            <Card
              title="Modelos comerciales: impuesto, mercado ilícito y tamaño"
              subtitle="Cada burbuja es un país; el tamaño representa el mercado legal en dólares. Una carga fiscal alta sin oferta competitiva mantiene vivo el circuito informal."
            >
              <CommercialScatter list={joined} onSelect={setSelected} />
            </Card>

            <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <Card
                title="Resumen por modelo de regulación comercial"
                subtitle="Promedios de la selección: desde la venta comercial abierta hasta los países sin ningún canal legal."
              >
                <ModelSummary list={joined} />
              </Card>
              <Card title="Tendencias comerciales destacadas" subtitle="Lecturas sobre los países de la selección.">
                <div className="space-y-3">
                  <Insight
                    color="#a3e635"
                    title="El cáñamo abre la puerta"
                    body={
                      mkt.topHemp
                        ? `${mkt.topHemp.name} lidera la superficie con ${fmt(mkt.topHemp.m.hempHa, 0)} hectáreas. ${mkt.topHemp.m.hempNote}`
                        : 'Sin datos en la selección.'
                    }
                  />
                  <Insight
                    color="#34d399"
                    title="Mayor mercado legal"
                    body={
                      mkt.topMarket
                        ? `${mkt.topMarket.name} concentra ${fmt(mkt.topMarket.m.marketUsd, 0)} millones de USD anuales. ${mkt.topMarket.m.trend}`
                        : '—'
                    }
                  />
                  <Insight
                    color="#fb7185"
                    title="La brecha de precios manda"
                    body={`Con un precio ilícito medio de ${fmt(mkt.priceIllicit, 1)} USD/g frente a ${mkt.priceLegal > 0 ? `${fmt(mkt.priceLegal, 1)} USD/g` : 'ninguna oferta'} en el canal regulado, el ${fmt(mkt.illicit, 0)} % del consumo sigue fuera del sistema fiscal.`}
                  />
                  <Insight
                    color="#22d3ee"
                    title="CBD, el mercado silencioso"
                    body={`${mkt.cbdFree} países permiten la venta libre de CBD; en otros solo llega por farmacia o está directamente prohibido pese a no ser psicoactivo.`}
                  />
                  <Insight
                    color="#818cf8"
                    title="Impuestos y competitividad"
                    body={`La carga fiscal media de la selección es del ${fmt(mkt.tax, 1)} %. Canadá y varios estados de EE. UU. ya la recortaron para frenar la reventa ilícita.`}
                  />
                </div>
              </Card>
            </div>

            <Card
              title="Diez años de cáñamo y CBD"
              subtitle="La burbuja del cannabidiol de 2019 dejó sobreoferta y caída de superficie; el crecimiento actual viene de la fibra, el grano, los bioplásticos y la construcción."
            >
              <HempEvolution />
            </Card>
          </div>
        )}

        {/* ── TENDENCIAS ─────────────────────────────────────────── */}
        {tab === 'tendencias' && (
          <div className="space-y-5">
            <Card
              title="35 años de cannabis: usuarios, policía y ley"
              subtitle="Combina series (los puntos verdes marcan hitos de legalización) y haz clic sobre un año para fijar el corte de todo el tablero."
            >
              <EvolutionChart onSelectYear={setYear} />
            </Card>

            <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
              <Card
                title="Cronología regulatoria y cultural"
                subtitle="De la prohibición internacional de 1961 a los clubes sociales europeos de 2025."
              >
                <ol className="relative space-y-4 border-l border-white/10 pl-5">
                  {MILESTONES.map((m) => {
                    const c =
                      m.kind === 'legal'
                        ? '#34d399'
                        : m.kind === 'medicinal'
                          ? '#60a5fa'
                          : m.kind === 'despenalización'
                            ? '#a3e635'
                            : m.kind === 'represión'
                              ? '#fb7185'
                              : '#a78bfa';
                    const past = m.year <= year;
                    return (
                      <li key={m.year + m.title} className="relative">
                        <span
                          className="absolute -left-[26px] top-1.5 h-3 w-3 rounded-full border-2"
                          style={{ borderColor: c, background: past ? c : 'transparent', opacity: past ? 1 : 0.4 }}
                        />
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-sm font-semibold tabular-nums text-white">{m.year}</span>
                          <span className="text-sm font-medium text-slate-100">{m.title}</span>
                          <span className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ background: `${c}1f`, color: c }}>
                            {m.kind}
                          </span>
                        </div>
                        <p className="text-[11px] uppercase tracking-wider text-slate-500">{m.place}</p>
                        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-400">{m.text}</p>
                      </li>
                    );
                  })}
                </ol>
              </Card>

              <div className="space-y-5">
                <Card title="Corte activo" subtitle="Indicadores globales del año seleccionado.">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ['Consumidores', `${fmt(point.users, 0)} M`],
                      ['Prevalencia', `${fmt(point.prevalence, 1)} %`],
                      ['Detenciones', `${fmt(point.arrests, 2)} M`],
                      ['Mercado regulado', `${fmt(point.legalMarket, 0)} mM USD`],
                      ['Incautaciones', `${fmt(point.seizures, 0)} miles t`],
                      ['Reformas acumuladas', `${point.medCountries + point.legalCountries}`],
                    ].map(([l, v]) => (
                      <div key={l} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                        <p className="text-[10px] uppercase tracking-wide text-slate-500">{l}</p>
                        <p className="mt-1 text-lg font-semibold tabular-nums text-white">{v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Trayectoria del mercado regulado</p>
                    <Sparkline data={SERIES.map((s) => s.legalMarket)} color="#22d3ee" />
                    <p className="text-[11px] leading-snug text-slate-400">
                      De 0 a {fmt(point.legalMarket, 0)} miles de millones de USD desde 2012; el mercado ilegal global se
                      estima en 3-4 veces ese volumen.
                    </p>
                  </div>
                </Card>

                <Card title="Lecturas de la tendencia" subtitle="Patrones que atraviesan todas las regiones.">
                  <div className="space-y-3">
                    <Insight
                      color="#34d399"
                      title="Efecto sustitución"
                      body="Donde se regula el mercado, las incautaciones caen y las detenciones se desplazan al mercado ilícito residencial y a la venta sin licencia."
                    />
                    <Insight
                      color="#60a5fa"
                      title="La vía medicinal es el camino"
                      body="68 países tienen acceso legal con receta: es la reforma con menos resistencia política y prepara el debate del uso adulto."
                    />
                    <Insight
                      color="#fb7185"
                      title="Endurecimiento selectivo"
                      body="Japón, Corea del Sur, Rusia e Indonesia aumentan penas y controles de orina mientras su prevalencia juvenil crece lentamente."
                    />
                    <Insight
                      color="#fbbf24"
                      title="Cáñamo como caballo de Troya"
                      body="Marruecos, Zimbabue, Ghana y Malasia entran por la cadena industrial y medicinal, no por el consumidor recreativo."
                    />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* ── ONGs Y FORMACIÓN ───────────────────────────────────── */}
        {tab === 'redes' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
              <Kpi
                label="ONGs y asociaciones"
                value={fmt(eco.ngos, 0)}
                unit="organizaciones"
                color="#a3e635"
                hint={`Media de ${fmt(eco.perCountry, 1)} por país en la selección`}
              />
              <Kpi
                label="Organizaciones de pacientes"
                value={fmt(eco.patientOrgs, 0)}
                unit={`${fmt((eco.patientOrgs / (eco.ngos || 1)) * 100, 0)} % del total`}
                color="#f472b6"
                hint="Cultivo solidario y acompañamiento terapéutico"
              />
              <Kpi
                label="Universidades con formación"
                value={fmt(eco.universities, 0)}
                unit="casas de estudio"
                color="#60a5fa"
                hint={`${eco.withoutUni} países de la selección aún sin oferta formal`}
              />
              <Kpi
                label="Programas y diplomaturas"
                value={fmt(eco.programs, 0)}
                unit="activos"
                color="#22d3ee"
                hint="Cátedras, posgrados, tecnicaturas y cursos certificados"
              />
              <Kpi
                label="Producción científica"
                value={fmt(eco.papers / 1000, 0)}
                unit="miles de publicaciones"
                color="#818cf8"
                hint={eco.topPapers ? `${eco.topPapers.name} lidera con ${fmt(eco.topPapers.e.papers, 0)}` : undefined}
              />
            </div>

            <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
              <Card
                title="Quién organiza y quién enseña"
                subtitle="Ranking por ONGs, organizaciones de pacientes, universidades con formación y cantidad de programas activos."
              >
                <EcoRanking list={ecoList} onSelect={setSelected} />
              </Card>
              <Card
                title="Tejido civil frente a tejido académico"
                subtitle="Eje horizontal: cantidad de ONGs (escala raíz). Eje vertical: universidades con formación. El tamaño indica la producción científica acumulada."
              >
                <EcoScatter list={ecoList} onSelect={setSelected} />
              </Card>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <Card
                title="Distribución regional"
                subtitle="El activismo civil y la oferta académica se concentran en América y Europa occidental; en Asia la investigación avanza sin tejido asociativo."
              >
                <EcoByRegion list={ecoList} />
              </Card>
              <Card title="Lecturas del ecosistema" subtitle="Patrones de la selección activa.">
                <div className="space-y-3">
                  <Insight
                    color="#a3e635"
                    title="Donde hay organización, hay reforma"
                    body={
                      eco.topNgo
                        ? `${eco.topNgo.name} concentra ${eco.topNgo.e.ngos} organizaciones. ${eco.topNgo.e.highlight}`
                        : 'Sin datos en la selección.'
                    }
                  />
                  <Insight
                    color="#f472b6"
                    title="Las madres y los pacientes primero"
                    body={`${fmt(eco.patientOrgs, 0)} organizaciones de la selección nacieron de familias y pacientes: en América Latina (Mamá Cultiva, ABRACE, Daya) fueron el motor de las leyes medicinales.`}
                  />
                  <Insight
                    color="#60a5fa"
                    title="La universidad llega después"
                    body={
                      eco.topUni
                        ? `${eco.topUni.name} encabeza con ${eco.topUni.e.universities} universidades. La formación formal suele aparecer una vez que existe acceso medicinal regulado.`
                        : '—'
                    }
                  />
                  <Insight
                    color="#fbbf24"
                    title="Pioneros"
                    body={
                      eco.pioneer
                        ? `La organización o cátedra más antigua de la selección data de ${eco.pioneer.e.since} en ${eco.pioneer.name}.`
                        : '—'
                    }
                  />
                  <Insight
                    color="#fb7185"
                    title="Desiertos asociativos"
                    body={`${eco.withoutUni} países de la selección no registran oferta académica formal; en regímenes penales estrictos el activismo es directamente ilegal.`}
                  />
                </div>
              </Card>
            </div>

            <Card
              title="Ecosistema país por país"
              subtitle="Cantidad de ONGs, organizaciones de pacientes, universidades, programas de formación, publicaciones científicas y año de la primera iniciativa."
            >
              <EcoTable list={ecoList} onSelect={setSelected} />
            </Card>
          </div>
        )}

        {/* ── DICCIONARIO ────────────────────────────────────────── */}
        {tab === 'diccionario' && (
          <div className="space-y-5">
            <Card
              title="Diccionario de términos"
              subtitle="Vocabulario de botánica, farmacología, formas de consumo, derecho, mercado, cultura y reducción de daños. Busca por palabra o filtra por categoría; haz clic en una ficha para desplegar la definición completa."
            >
              <Glossary />
            </Card>
            <Card
              title="Por qué importan las palabras"
              subtitle="Buena parte de la confusión regulatoria nace de usar términos distintos para la misma cosa — o el mismo término para cosas distintas."
            >
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  {
                    t: 'Despenalizar ≠ legalizar',
                    c: '#fbbf24',
                    b: 'Despenalizar quita la sanción al consumidor; legalizar crea un mercado con reglas, calidad e impuestos. Confundirlos lleva a esperar resultados que la norma nunca prometió.',
                  },
                  {
                    t: 'Cáñamo ≠ marihuana',
                    c: '#34d399',
                    b: 'Son la misma especie botánica separada por un umbral de THC fijado por ley. Ese número —0,2 %, 0,3 % o 1 %— decide si una plantación es agricultura o delito.',
                  },
                  {
                    t: 'CBD ≠ sin efectos',
                    c: '#22d3ee',
                    b: 'No es embriagante, pero interactúa con fármacos por el citocromo P450. "No psicoactivo" no significa "sin farmacología".',
                  },
                ].map((x) => (
                  <div key={x.t} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-white">
                      <span className="h-2 w-2 rounded-full" style={{ background: x.c }} />
                      {x.t}
                    </p>
                    <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{x.b}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── Pie ────────────────────────────────────────────────── */}
        <footer className="mt-8 grid gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5 lg:grid-cols-[auto_1.3fr_1fr]">
          <div className="flex flex-col items-center gap-2 text-center lg:items-start lg:text-left">
            {/* Espacio reservado para el logo de Acción Cannábica */}
            <LogoSlot className="h-16 w-16" />
            <p className="text-sm font-semibold text-white">Acción Cannábica</p>
            <div className="mt-1 flex flex-col gap-2 text-[11px] text-slate-400">
              <a className="hover:text-emerald-300" href="mailto:accioncannabica@gmail.com">accioncannabica@gmail.com</a>
              <a className="hover:text-emerald-300" href="https://www.instagram.com/accannabica/" target="_blank" rel="noopener noreferrer">Instagram @accannabica</a>
            </div>
            <p className="text-[11px] leading-snug text-slate-500">
              Asociación Civil inscripta bajo la personería jurídica número 1921803 (I.G.J. Argentina)
              <br />
              Observatorio global de cannabis · edición 2026
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Metodología y advertencias</h4>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              La base inicial es una compilación orientativa no auditada por registro. Se conserva, pero las fuentes
              generales listadas no certifican cada cifra. La cobertura trazable de las nuevas vistas se informa por
              conjunto, con fecha, unidad y enlace. La
              prevalencia se refiere al consumo en los últimos 12 meses sobre la población de 15 a 64 años. Los marcos
              se agrupan en cinco categorías porque dentro de cada país coexisten jurisdicciones subnacionales (estados,
              provincias, ciudades) con reglas propias. Las cifras de detenciones no son comparables entre sistemas
              judiciales: en unos países cuentan llamadas y comunicaciones, en otros solo condenas.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              El conteo previo de ONGs incluye asociaciones civiles, cámaras sectoriales y colectivos de pacientes;
              no se verificó su inscripción uno por uno. El de universidades, casas de estudio con formación curricular o de posgrado
              específica en cannabis. Ambos son estimaciones de orden de magnitud: en países con régimen penal
              estricto buena parte del tejido asociativo opera sin registro formal.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Los precios son estimaciones de referencia en dólares estadounidenses para un gramo de flor o un frasco
              de 10 ml y varían fuertemente según la calidad, la región y el canal: deben leerse como órdenes de
              magnitud comparables, no como cotizaciones. Las hectáreas de cáñamo corresponden a superficie declarada
              bajo licencia y omiten el cultivo informal.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Este tablero es una herramienta de análisis con fines informativos y educativos: no constituye asesoría
              jurídica ni promueve el uso de sustancias.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Referencias y fuentes</h4>
            <button className="mt-2 text-xs text-emerald-300 underline decoration-emerald-300/30 underline-offset-4 hover:text-emerald-100" onClick={() => setTab('fuentes')}>Ver fuentes trazables y cobertura de las nuevas vistas</button>
            <ul className="mt-2 space-y-1.5">
              {SOURCES.map((s) => (
                <li key={s} className="flex gap-2 text-[11px] leading-relaxed text-slate-400">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400/70" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>

      {/* Portal: la shell anima su contenedor con transform, lo que rompería el `fixed` del panel. */}
      {selected && createPortal(
        <div className="observatorio-root text-slate-100">
          <CountryDrawer country={openData.countries.find(c => c.iso === selected.iso) || selected} onClose={() => setSelected(null)} />
        </div>,
        document.body,
      )}
    </div>
  );
}

function Insight({ color, title, body }: { color: string; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
      <p className="flex items-center gap-2 text-xs font-semibold text-white">
        <span className="h-2 w-2 rounded-full" style={{ background: color }} />
        {title}
      </p>
      <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">{body}</p>
    </div>
  );
}

/** Cuatro contrastes calculados sobre la selección activa */
function contrast(list: Country[]) {
  const get = (iso: string) => list.find((c) => c.iso === iso);
  const sorted = [...list].sort((a, b) => b.arrests - a.arrests);
  const top = sorted[0];
  const legal = list.filter((c) => c.framework === 'legal').sort((a, b) => b.prevalence - a.prevalence)[0];
  const zero = list.filter((c) => c.maxPrison === 0).sort((a, b) => b.users - a.users)[0];
  const strict = list.filter((c) => c.maxPrison >= 5).sort((a, b) => b.prevalence - a.prevalence)[0];
  const de = get('DEU');
  const fr = get('FRA');
  const nl = get('NLD');
  const us = get('USA');

  const out: { title: string; body: string; pairs: { l: string; v: string; c: string }[] }[] = [];

  if (fr && de)
    out.push({
      title: 'Francia vs. Alemania',
      body: 'Prevalencias vecinas y castigo opuesto: un año de cárcel y 79 % de las causas por drogas en Francia frente a la posesión regulada alemana desde 2024.',
      pairs: [
        { l: 'FR detenciones/100k', v: `${fr.arrests}`, c: '#fb7185' },
        { l: 'DE detenciones/100k', v: `${de?.arrests ?? 0}`, c: '#34d399' },
      ],
    });
  if (top)
    out.push({
      title: 'Dónde más se detiene',
      body: `${top.name} lidera la presión policial con ${top.arrests} detenciones por 100.000 habitantes y ${top.shareDrugOffences} % de todas las causas de drogas.`,
      pairs: [
        { l: 'detenciones/100k', v: `${top.arrests}`, c: '#fbbf24' },
        { l: 'prevalencia', v: `${fmt(top.prevalence, 1)} %`, c: '#94a3b8' },
      ],
    });
  if (legal && us)
    out.push({
      title: 'El mayor mercado regulado',
      body: `${legal.name} y Estados Unidos suman ${fmtM(legal.users + us.users)} de consumidores con venta regulada; la aceptación social supera el 70 % en ambos.`,
      pairs: [
        { l: 'usuarios regulados', v: fmtM(legal.users + us.users), c: '#34d399' },
        { l: 'aceptación', v: `${legal.acceptance}/100`, c: '#22d3ee' },
      ],
    });
  if (zero && strict)
    out.push({
      title: 'Pena cero vs. prisión',
      body: `${zero.name} no contempla cárcel y sostiene una prevalencia del ${fmt(zero.prevalence, 1)} %; ${strict.name} castiga con hasta ${strict.maxPrison} años y su prevalencia es del ${fmt(strict.prevalence, 1)} %.`,
      pairs: [
        { l: 'sin prisión', v: `${fmt(zero.prevalence, 1)} %`, c: '#a3e635' },
        { l: `${strict.maxPrison} años`, v: `${fmt(strict.prevalence, 1)} %`, c: '#fb7185' },
      ],
    });
  if (nl)
    out.push({
      title: '50 años de tolerancia',
      body: `Países Bajos mantiene desde 1976 un modelo sin venta regulada formal: prevalencia del ${fmt(nl.prevalence, 1)} % y solo ${nl.arrests} detenciones por 100.000 habitantes.`,
      pairs: [
        { l: 'prevalencia', v: `${fmt(nl.prevalence, 1)} %`, c: '#a3e635' },
        { l: 'detenciones/100k', v: `${nl.arrests}`, c: '#22d3ee' },
      ],
    });

  return out.slice(0, 4);
}
