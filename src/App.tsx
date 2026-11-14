import { useEffect, useMemo, useState } from "react";
import Fondo from "./components/Fondo";
import { Badge, Boton, DemoBadge, Icon, Reveal } from "./components/ui";
import { NAV, NAV_VISIBLE, type Vista } from "./types";
import { NOTICIAS, ORG } from "./data/content";
import Inicio from "./sections/Inicio";
import QuienesSomos from "./sections/QuienesSomos";
import Recorrido from "./sections/Recorrido";
import Novedades from "./sections/Novedades";
import Patrones from "./sections/Patrones";
import Redes from "./sections/Redes";
import Reprocann from "./sections/Reprocann";
import Facc from "./sections/Facc";
import DataLab from "./sections/DataLab";
import Harness from "./sections/Harness";
import { Donaciones, Tienda } from "./sections/Comercial";
import Contacto from "./sections/Contacto";
import ObservatorioPage from "./observatorio/ObservatorioPage";

const GRUPOS = ["Tablero", "Institucional", "Investigaciones", "Observatorio", "Redes", "Programas", "Datos", "Acción"] as const;

export default function App() {
  const [vista, setVista] = useState<Vista>(() => {
    const [segment] = typeof window !== "undefined" ? window.location.hash.replace("#", "").split("/") : [""];
    const candidate = segment as Vista;
    return NAV_VISIBLE.some((n) => n.id === candidate) ? candidate : "inicio";
  });
  const [q, setQ] = useState("");
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (vista !== "patrones") {
      const expectedHash = `#${vista}`;
      if (window.location.hash !== expectedHash) {
        history.replaceState(null, "", expectedHash);
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [vista]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        document.getElementById("buscador-global")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const irA = (v: Vista) => {
    setVista(v);
    setMenu(false);
    setQ("");
  };

  const resultados = useMemo(() => {
    if (!q.trim()) return [];
    const t = q.toLowerCase();
    return NAV_VISIBLE.filter((n) => (n.titulo + n.bajada).toLowerCase().includes(t)).slice(0, 6);
  }, [q]);

  const titulares = useMemo(() => [...NOTICIAS].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 6), []);

  const VistaActual = () => {
    switch (vista) {
      case "quienes":
        return <QuienesSomos irA={irA} />;
      case "recorrido":
        return <Recorrido />;
      case "novedades":
        return <Novedades />;
      case "patrones":
        return <Patrones />;
      case "observatorio":
        return <ObservatorioPage />;
      case "redes":
        return <Redes irA={irA} />;
      case "reprocann":
        return <Reprocann />;
      case "facc":
        return <Facc irA={irA} />;
      case "eda":
        return <DataLab />;
      case "harness":
        return <Harness irA={irA} />;
      case "tienda":
        return <Tienda />;
      case "donaciones":
        return <Donaciones />;
      case "contacto":
        return <Contacto irA={irA} />;
      default:
        return <Inicio irA={irA} />;
    }
  };

  const item = NAV.find((n) => n.id === vista)!;

  return (
    <div className="min-h-screen">
      <Fondo />

      {/* ---------------- SIDEBAR ---------------- */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[268px] transform border-r border-white/8 bg-ink-900/80 backdrop-blur-xl transition-transform duration-500 lg:translate-x-0 ${
          menu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 border-b border-white/8 px-5 py-5">
            <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-lima-400 to-verde-500 text-ink-950">
              <Icon name="leaf" className="h-6 w-6" />
              <span className="absolute inset-0 rounded-2xl border border-lima-300/40" style={{ animation: "pulse-ring 3.4s ease-out infinite" }} />
            </span>
            <span>
              <span className="block text-sm font-bold leading-tight text-white">Acción Cannábica</span>
              <span className="block font-mono text-[10px] text-lima-400/80">@accannabica · dashboard</span>
            </span>
          </div>

          <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
            {GRUPOS.map((g) => (
              <div key={g}>
                <p className="px-2 font-mono text-[9px] uppercase tracking-[0.28em] text-emerald-50/30">{g}</p>
                <ul className="mt-2 space-y-1">
                  {NAV_VISIBLE.filter((n) => n.grupo === g).map((n) => (
                    <li key={n.id}>
                      <button
                        onClick={() => irA(n.id)}
                        aria-current={vista === n.id ? "page" : undefined}
                        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-300 ${
                          vista === n.id
                            ? "border border-lima-500/35 bg-gradient-to-r from-lima-500/18 to-transparent text-white"
                            : "border border-transparent text-emerald-50/60 hover:bg-white/[0.04] hover:text-white"
                        }`}
                      >
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border transition ${vista === n.id ? "border-lima-500/40 bg-lima-500/15 text-lima-300" : "border-white/8 bg-white/[0.03] text-emerald-50/50 group-hover:text-lima-300"}`}>
                          <Icon name={n.icono} className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-semibold">{n.titulo}</span>
                          <span className="block truncate text-[10px] text-emerald-50/40">{n.bajada}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="border-t border-white/8 p-4">
            <div className="rounded-xl border border-lima-500/25 bg-lima-500/6 p-3">
              <p className="text-[10px] leading-relaxed text-emerald-50/65">
                Tablero de prototipo. Los datasets analíticos son de demostración; el contenido institucional está referenciado a fuentes
                públicas.
              </p>
            </div>
            <div className="mt-3 flex gap-2">
              {ORG.socials.map((s) => (
                <a key={s.red} href={s.url} target="_blank" rel="noreferrer" aria-label={s.red} className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-emerald-50/55 transition hover:border-lima-500/40 hover:text-lima-300">
                  <Icon name={s.red === "Facebook" ? "face" : s.red === "Instagram" ? "insta" : "youtube"} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {menu && <button className="fixed inset-0 z-30 bg-ink-950/60 backdrop-blur-sm lg:hidden" onClick={() => setMenu(false)} aria-label="Cerrar menú" />}

      {/* ---------------- MAIN ---------------- */}
      <div className="lg:pl-[268px]">
        {/* Topbar */}
        <header className="sticky top-0 z-30 border-b border-white/8 bg-ink-950/70 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <button onClick={() => setMenu(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-emerald-50/70 lg:hidden" aria-label="Abrir menú">
              <Icon name="menu" className="h-5 w-5" />
            </button>

            <div className="relative min-w-0 flex-1 max-w-md">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-50/35">
                <Icon name="search" className="h-4 w-4" />
              </span>
              <input
                id="buscador-global"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onBlur={() => window.setTimeout(() => setQ(""), 150)}
                placeholder="Buscar sección…  ( / )"
                aria-label="Buscar sección"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-emerald-50/30 focus:border-lima-500/40 focus:outline-none"
              />
              {resultados.length > 0 && (
                <div className="absolute left-0 top-12 z-40 w-full overflow-hidden rounded-xl border border-white/10 bg-ink-900/95 shadow-2xl backdrop-blur-xl">
                  {resultados.map((r) => (
                    <button key={r.id} onClick={() => irA(r.id)} className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-lima-500/10">
                      <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-lima-300">
                        <Icon name={r.icono} className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-xs font-semibold text-white">{r.titulo}</span>
                        <span className="block text-[10px] text-emerald-50/50">{r.bajada}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <DemoBadge texto="Datos demo en analítica" />
              <Boton onClick={() => irA("contacto")}>
                <Icon name="mail" className="h-4 w-4" /> <span className="hidden sm:inline">Contacto</span>
              </Boton>
            </div>
          </div>

          {/* Ticker */}
          <div className="flex items-center gap-3 overflow-hidden border-t border-white/6 bg-white/[0.015] px-4 py-2 sm:px-6">
            <Badge tone="lima" className="shrink-0">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lima-400" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lima-400" />
              </span>
              En vivo
            </Badge>
            <div className="relative flex-1 overflow-hidden">
              <div className="anim-marquee flex w-max gap-8 whitespace-nowrap font-mono text-[11px] text-emerald-50/55">
                {[...titulares, ...titulares].map((n, i) => (
                  <span key={`${n.titular}-${i}`} className="flex items-center gap-2">
                    <span className="text-lima-400/70">{n.fecha}</span>
                    {n.titular}
                    <span className="text-emerald-50/25">·</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-8 sm:px-6 lg:px-10">
          <div key={vista} className="mx-auto max-w-7xl" style={{ animation: "rise 0.6s cubic-bezier(0.22,1,0.36,1) both" }}>
            <div className="mb-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-lima-400/70">
                {item.grupo} / {item.titulo}
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{item.bajada}</h1>
            </div>
            {/* Llamada directa: como componente, VistaActual se redefine en cada render y remontaría la vista. */}
            {VistaActual()}
          </div>

          {/* Footer */}
          <footer className="mx-auto mt-20 max-w-7xl border-t border-white/8 pt-8 pb-10">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr_1fr]">
              <div>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-lima-400 to-verde-500 text-ink-950">
                    <Icon name="leaf" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">{ORG.nombre}</p>
                    <p className="font-mono text-[10px] text-lima-400/80">{ORG.miembro}</p>
                  </div>
                </div>
                <p className="mt-4 max-w-md text-[11px] leading-relaxed text-emerald-50/50">
                  Prototipo de tablero institucional (dashboard harness) con especificación, inventario de skills, mockups interactivos,
                  análisis exploratorio de datos, mapa de calor y gradiente de peso.
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-50/35">Secciones</p>
                <ul className="mt-3 grid grid-cols-2 gap-1.5">
                  {NAV_VISIBLE.slice(0, 8).map((n) => (
                    <li key={n.id}>
                      <button onClick={() => irA(n.id)} className="text-[11px] text-emerald-50/55 transition hover:text-lima-300">
                        {n.titulo}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-50/35">Fuentes</p>
                <ul className="mt-3 space-y-1.5 text-[11px] text-emerald-50/50">
                  <li>Instagram / Facebook @accannabica</li>
                  <li>FACC · facc.info · @faccarg</li>
                  <li>Revista Cannabis y Salud (CONICET-CIM)</li>
                  <li>InfoLEG · Boletín Oficial · ARICCAME</li>
                  <li>Cannábica Argentina · El Planteo</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/6 pt-5">
              <p className="text-[10px] text-emerald-50/35">
                © {new Date().getFullYear()} {ORG.sigla} · Contenido institucional verificado; datasets analíticos de demostración.
              </p>
              <div className="flex items-center gap-3">
                {ORG.socials.map((s) => (
                  <a key={s.red} href={s.url} target="_blank" rel="noreferrer" className="text-[10px] text-emerald-50/40 transition hover:text-lima-300">
                    {s.handle}
                  </a>
                ))}
              </div>
            </div>
          </footer>
        </main>
      </div>

      <Reveal className="fixed bottom-5 right-5 z-40 hidden lg:block">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="grid h-11 w-11 place-items-center rounded-full border border-lima-500/30 bg-ink-900/80 text-lima-300 backdrop-blur transition hover:border-lima-500/60 hover:text-lima-200"
          aria-label="Volver arriba"
        >
          <Icon name="arrow" className="h-4 w-4 -rotate-90" />
        </button>
      </Reveal>
    </div>
  );
}
