import { useState } from "react";
import { SKILLS, SPEC } from "../data/content";
import { Badge, Boton, DemoBadge, Icon, Panel, Progress, Reveal, SectionTitle, Tabs } from "../components/ui";
import type { Vista } from "../types";

const VISTAS = ["Especificación", "Skills", "Mockups", "Estado"] as const;

const TONO_ESTADO = { listo: "lima", "en curso": "ambar", backlog: "slate" } as const;

export default function Harness({ irA }: { irA: (v: Vista) => void }) {
  const [vista, setVista] = useState<(typeof VISTAS)[number]>("Especificación");
  const listos = SPEC.filter((s) => s.estado === "listo").length;
  const avance = Math.round((listos / SPEC.length) * 100);

  return (
    <div className="space-y-12">
      <SectionTitle
        kicker="Harness · spec driven"
        titulo="Especificación, skills y mockups"
        bajada="Este tablero se construyo con una especificación viva: cada sección tiene criterios de aceptación, un inventario de capacidades y maquetas interactivas validadas antes de integrar datos reales."
        icono="code"
      />

      <div className="grid gap-4 lg:grid-cols-4">
        <Panel className="p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-50/45">Requisitos del spec</p>
          <p className="mt-2 text-3xl font-bold text-grad">{SPEC.length}</p>
          <p className="mt-1 text-[11px] text-emerald-50/50">{listos} listos · {SPEC.length - listos} en curso o backlog</p>
        </Panel>
        <Panel className="p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-50/45">Avance</p>
          <p className="mt-2 text-3xl font-bold text-grad">{avance}%</p>
          <div className="mt-2">
            <Progress value={avance} />
          </div>
        </Panel>
        <Panel className="p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-50/45">Skills relevadas</p>
          <p className="mt-2 text-3xl font-bold text-grad">{SKILLS.length}</p>
          <p className="mt-1 text-[11px] text-emerald-50/50">aplicadas a datos, diseño y normativa</p>
        </Panel>
        <Panel className="p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-50/45">Vistas</p>
          <p className="mt-2 text-3xl font-bold text-grad">12</p>
          <p className="mt-1 text-[11px] text-emerald-50/50">secciones navegables del harness</p>
        </Panel>
      </div>

      <Tabs opciones={VISTAS} activa={vista} onChange={setVista} />

      {vista === "Especificación" && (
        <Panel className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 font-mono text-[9px] uppercase tracking-wider text-emerald-50/40">
                  <th className="px-5 py-3">ID</th>
                  <th className="px-3 py-3">Sección</th>
                  <th className="px-3 py-3">Requisito</th>
                  <th className="px-3 py-3">Criterio de aceptación</th>
                  <th className="px-3 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {SPEC.map((s) => (
                  <tr key={s.id} className="border-b border-white/5 align-top transition hover:bg-lima-500/5">
                    <td className="px-5 py-3 font-mono text-lima-300">{s.id}</td>
                    <td className="px-3 py-3 text-emerald-50/60">{s.seccion}</td>
                    <td className="px-3 py-3 font-semibold text-white">{s.titulo}</td>
                    <td className="px-3 py-3 text-emerald-50/60">{s.criterio}</td>
                    <td className="px-3 py-3">
                      <Badge tone={TONO_ESTADO[s.estado]}>{s.estado}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {vista === "Skills" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SKILLS.map((s, i) => (
            <Reveal key={s.titulo} delay={Math.min(i * 60, 400)}>
              <Panel className="h-full p-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-lima-500/25 bg-lima-500/10 text-lima-300">
                  <Icon name={s.icono} className="h-5 w-5" />
                </span>
                <h3 className="mt-3 text-xs font-semibold text-white">{s.titulo}</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-emerald-50/55">{s.detalle}</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/8">
                    <div className="h-full rounded-full bg-gradient-to-r from-verde-400 to-lima-400" style={{ width: `${s.nivel}%` }} />
                  </div>
                  <span className="font-mono text-[10px] text-lima-300">{s.nivel}</span>
                </div>
              </Panel>
            </Reveal>
          ))}
        </div>
      )}

      {vista === "Mockups" && (
        <div className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-3">
            <MockupTarjeta />
            <MockupCarrito />
            <MockupDonacion />
          </div>
          <Panel className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <h3 className="text-sm font-semibold text-white">Mockups completos en las secciones</h3>
              <p className="mt-1 text-[11px] text-emerald-50/60">
                Simulador de inscripción REPROCANN · catálogo con carrito · calculadora de donaciones · grafo de organizaciones.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Boton variante="fantasma" onClick={() => irA("reprocann")}>
                REPROCANN
              </Boton>
              <Boton variante="fantasma" onClick={() => irA("tienda")}>
                Tienda
              </Boton>
              <Boton variante="fantasma" onClick={() => irA("donaciones")}>
                Donaciones
              </Boton>
            </div>
          </Panel>
        </div>
      )}

      {vista === "Estado" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel className="p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-lima-400/80">Stack técnico</p>
            <ul className="mt-4 space-y-2 text-xs">
              {[
                ["Framework", "React 19 + TypeScript (tipado estricto)"],
                ["Estilos", "Tailwind CSS 4 con tokens de tema propios"],
                ["Gráficos", "SVG a medida, sin dependencias externas"],
                ["Animación", "CSS keyframes + IntersectionObserver + canvas"],
                ["Build", "Vite 7 · bundle único estático"],
              ].map(([k, v]) => (
                <li key={k} className="flex gap-3 border-b border-white/6 pb-2">
                  <span className="w-28 shrink-0 text-emerald-50/45">{k}</span>
                  <span className="min-w-0 flex-1 text-emerald-50/85">{v}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-cian-400/80">Calidad y accesibilidad</p>
            <ul className="mt-4 space-y-3">
              {[
                "Todos los gráficos tienen role=img y aria-label descriptivo.",
                "Contraste AA sobre fondo oscuro; foco visible en elementos interactivos.",
                "prefers-reduced-motion desactiva animaciones y partículas.",
                "Navegación por teclado con Tab/Shift+Tab y cierre de diálogos con Escape.",
                "Datos sintéticos etiquetados explícitamente como demo.",
              ].map((t) => (
                <li key={t} className="flex gap-2.5 text-[11px] leading-relaxed text-emerald-50/65">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-lima-500/30 bg-lima-500/10 text-lima-300">
                    <Icon name="check" className="h-3 w-3" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      )}
    </div>
  );
}

/* ---------------------------- Mockups ---------------------------- */
function MockupTarjeta() {
  const [frente, setFrente] = useState(true);
  return (
    <Panel className="p-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-lima-400/80">Mockup · credencial</p>
        <DemoBadge texto="UI" />
      </div>
      <button onClick={() => setFrente((f) => !f)} className="mt-4 block w-full text-left">
        <div className="relative h-40 [perspective:900px]">
          <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d]" style={{ transform: frente ? "rotateY(0deg)" : "rotateY(180deg)" }}>
            <div className="absolute inset-0 rounded-2xl border border-lima-500/30 bg-gradient-to-br from-verde-500/20 via-ink-800 to-cian-400/10 p-4 [backface-visibility:hidden]">
              <p className="font-mono text-[9px] uppercase tracking-wider text-lima-300">REPROCANN</p>
              <p className="mt-2 text-sm font-semibold text-white">Autorización de cultivo</p>
              <p className="mt-1 text-[10px] text-emerald-50/60">Asociación Civil Acción Cannábica</p>
              <div className="mt-3 space-y-1">
                {["Plantas: 1 a 9", "Interior: 6 m²", "Exterior: 15 m²"].map((t) => (
                  <p key={t} className="font-mono text-[10px] text-emerald-50/70">
                    {t}
                  </p>
                ))}
              </div>
              <p className="absolute bottom-3 right-3 text-[9px] text-emerald-50/40">clic para girar</p>
            </div>
            <div className="absolute inset-0 rounded-2xl border border-cian-400/30 bg-gradient-to-br from-cian-400/15 via-ink-800 to-lima-500/10 p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <p className="font-mono text-[9px] uppercase tracking-wider text-cian-400">Dorso</p>
              <p className="mt-2 text-[11px] leading-relaxed text-emerald-50/70">
                Transporte: 1 a 6 frascos de 30 ml o hasta 40 g de flores secas. Decreto 883/2020, Anexo II.
              </p>
              <p className="mt-3 text-[10px] text-emerald-50/50">Válido conforme a la normativa vigente.</p>
            </div>
          </div>
        </div>
      </button>
    </Panel>
  );
}

function MockupCarrito() {
  const [precio, setPrecio] = useState(28000);
  const [envio, setEnvio] = useState(false);
  return (
    <Panel className="p-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-cian-400/80">Mockup · checkout</p>
        <DemoBadge texto="UI" />
      </div>
      <label className="mt-4 block">
        <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-50/45">Precio base (ARS)</span>
        <input type="range" min={5000} max={90000} step={1000} value={precio} onChange={(e) => setPrecio(Number(e.target.value))} className="mt-2 h-1 w-full accent-cian-400" />
      </label>
      <label className="mt-3 flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
        <span className="text-[11px] text-emerald-50/70">Envío a domicilio</span>
        <input type="checkbox" checked={envio} onChange={(e) => setEnvio(e.target.checked)} className="h-3.5 w-3.5 accent-cian-400" />
      </label>
      <div className="mt-4 space-y-1.5 font-mono text-[11px]">
        <div className="flex justify-between text-emerald-50/60">
          <span>Subtotal</span>
          <span>${precio.toLocaleString("es-AR")}</span>
        </div>
        <div className="flex justify-between text-emerald-50/60">
          <span>Envío</span>
          <span>${(envio ? 6500 : 0).toLocaleString("es-AR")}</span>
        </div>
        <div className="flex justify-between border-t border-white/10 pt-1.5 text-sm font-bold text-lima-300">
          <span>Total</span>
          <span>${(precio + (envio ? 6500 : 0)).toLocaleString("es-AR")}</span>
        </div>
      </div>
    </Panel>
  );
}

function MockupDonacion() {
  const [monto, setMonto] = useState(30000);
  return (
    <Panel className="p-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-ambar-400/80">Mockup · donación</p>
        <DemoBadge texto="UI" />
      </div>
      <div className="mt-4 text-center">
        <p className="font-mono text-3xl font-bold text-grad">${monto.toLocaleString("es-AR")}</p>
        <p className="text-[10px] text-emerald-50/45">aporte mensual estimado</p>
      </div>
      <input type="range" min={5000} max={150000} step={5000} value={monto} onChange={(e) => setMonto(Number(e.target.value))} className="mt-4 h-1 w-full accent-ambar-400" />
      <div className="mt-4 space-y-2">
        {[
          { k: "Acompañamientos", v: Math.max(1, Math.round(monto / 12000)) },
          { k: "Horas de asesoría", v: Math.max(1, Math.round(monto / 3500)) },
        ].map((r) => (
          <div key={r.k} className="flex items-center justify-between rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2">
            <span className="text-[11px] text-emerald-50/65">{r.k}</span>
            <span className="font-mono text-xs text-lima-300">{r.v}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
