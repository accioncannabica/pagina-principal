import { useMemo, useState } from "react";
import { ORGANIZACIONES } from "../data/content";
import { GrafoOrganizaciones } from "../components/charts";
import { Badge, Boton, DemoBadge, Icon, Panel, Reveal, SectionTitle, Tabs } from "../components/ui";

const AMBITOS = ["Todos", "Local", "Provincial", "Nacional", "Internacional"] as const;

export default function Redes({ irA }: { irA: (v: "facc") => void }) {
  const [sel, setSel] = useState<string | null>("acca");
  const [ambito, setAmbito] = useState<(typeof AMBITOS)[number]>("Todos");
  const [q, setQ] = useState("");
  const [soloFacc, setSoloFacc] = useState(false);
  const [copiado, setCopiado] = useState<string | null>(null);

  const nodos = useMemo(() => ORGANIZACIONES.map((o) => ({ id: o.sigla, nombre: o.nombre, sigla: o.sigla, ambito: o.ambito, facc: o.facc })), []);
  const seleccionada = ORGANIZACIONES.find((o) => o.sigla === sel) ?? null;

  const lista = useMemo(
    () =>
      ORGANIZACIONES.filter((o) => (ambito === "Todos" ? true : o.ambito === ambito))
        .filter((o) => (soloFacc ? o.facc : true))
        .filter((o) => (q ? (o.nombre + o.sigla + o.territorio + o.eje).toLowerCase().includes(q.toLowerCase()) : true)),
    [ambito, soloFacc, q],
  );

  const copiar = (texto: string) => {
    navigator.clipboard?.writeText(texto).catch(() => {});
    setCopiado(texto);
    window.setTimeout(() => setCopiado(null), 1800);
  };

  return (
    <div className="space-y-12">
      <SectionTitle
        kicker="Redes de organizaciones cannábicas"
        titulo="Tejido local, provincial e internacional"
        bajada="Hacé clic en un nodo del grafo para ver su ficha de contacto. Las organizaciones miembras de la FACC se resaltan en verde lima."
        icono="network"
      />

      <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <GrafoOrganizaciones nodos={nodos} seleccionado={sel} onSelect={setSel} />
        <Panel className="p-6">
          {seleccionada ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-lima-400/80">{seleccionada.sigla}</p>
                  <h3 className="mt-2 text-base font-semibold leading-snug text-white">{seleccionada.nombre}</h3>
                </div>
                {seleccionada.facc ? <Badge tone="lima">FACC</Badge> : <Badge tone="slate">Aliada</Badge>}
              </div>
              <dl className="mt-5 space-y-3 text-xs">
                {[
                  ["Ámbito", seleccionada.ambito],
                  ["Territorio", seleccionada.territorio],
                  ["Eje de trabajo", seleccionada.eje],
                  ["Contacto", seleccionada.contacto],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3 border-b border-white/6 pb-2">
                    <dt className="w-28 shrink-0 text-emerald-50/45">{k}</dt>
                    <dd className="min-w-0 flex-1 break-words text-emerald-50/85">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                {seleccionada.web && (
                  <a href={seleccionada.web} target="_blank" rel="noreferrer">
                    <Boton variante="fantasma">
                      <Icon name="globe" className="h-4 w-4" /> Sitio web
                    </Boton>
                  </a>
                )}
                {seleccionada.instagram && (
                  <a href={seleccionada.instagram} target="_blank" rel="noreferrer">
                    <Boton variante="fantasma">
                      <Icon name="insta" className="h-4 w-4" /> Instagram
                    </Boton>
                  </a>
                )}
                <Boton variante="fantasma" onClick={() => copiar(seleccionada.contacto)}>
                  <Icon name="check" className="h-4 w-4" /> {copiado === seleccionada.contacto ? "¡Copiado!" : "Copiar contacto"}
                </Boton>
              </div>
            </>
          ) : (
            <p className="text-sm text-emerald-50/60">Seleccioná una organización en el grafo.</p>
          )}
          <div className="mt-6 rounded-xl border border-lima-500/25 bg-lima-500/6 p-4">
            <p className="text-[11px] leading-relaxed text-emerald-50/70">
              La <strong className="text-lima-300">Federación Argentina de Cannabis y Cáñamo (FACC)</strong> agrupa a 25 organizaciones
              con personería jurídica en 9-10 provincias. Acción Cannábica es una de las seis organizaciones fundadoras.
            </p>
            <button onClick={() => irA("facc")} className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-lima-300 hover:text-lima-200">
              Ver sección FACC <Icon name="arrow" className="h-3.5 w-3.5" />
            </button>
          </div>
        </Panel>
      </div>

      {/* Tabla */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Tabs opciones={AMBITOS} activa={ambito} onChange={setAmbito} />
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.03] px-3 py-1.5">
              <Icon name="search" className="h-3.5 w-3.5 text-emerald-50/40" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar organización" className="w-40 bg-transparent text-[11px] text-white placeholder:text-emerald-50/30 focus:outline-none" />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-[11px] text-emerald-50/60">
              <input type="checkbox" checked={soloFacc} onChange={(e) => setSoloFacc(e.target.checked)} className="h-3.5 w-3.5 accent-lima-400" />
              Solo miembros FACC
            </label>
          </div>
        </div>

        <Panel className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-emerald-50/45">
                  <th className="px-5 py-3">Organización</th>
                  <th className="px-3 py-3">Ámbito</th>
                  <th className="px-3 py-3">Territorio</th>
                  <th className="px-3 py-3">Eje</th>
                  <th className="px-3 py-3">Contacto</th>
                  <th className="px-3 py-3">FACC</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((o) => (
                  <tr
                    key={o.sigla}
                    onClick={() => setSel(o.sigla)}
                    className={`cursor-pointer border-b border-white/5 transition hover:bg-lima-500/6 ${sel === o.sigla ? "bg-lima-500/8" : ""}`}
                  >
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-2">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] font-mono text-[9px] text-lima-300">
                          {o.sigla.slice(0, 3)}
                        </span>
                        <span>
                          <span className="block font-semibold text-white">{o.nombre}</span>
                          <span className="block text-[10px] text-emerald-50/40">{o.sigla}</span>
                        </span>
                        {o.demo && <DemoBadge />}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <Badge tone={o.ambito === "Internacional" ? "violeta" : o.ambito === "Nacional" ? "lima" : o.ambito === "Provincial" ? "ambar" : "cian"}>{o.ambito}</Badge>
                    </td>
                    <td className="px-3 py-3 text-emerald-50/70">{o.territorio}</td>
                    <td className="px-3 py-3 text-emerald-50/60">{o.eje}</td>
                    <td className="px-3 py-3 font-mono text-[10px] text-emerald-50/60">{o.contacto}</td>
                    <td className="px-3 py-3">
                      {o.facc ? (
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-lima-500/20 text-lima-300">
                          <Icon name="check" className="h-3 w-3" />
                        </span>
                      ) : (
                        <span className="text-emerald-50/25">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-white/8 px-5 py-3 text-[11px] text-emerald-50/45">
            <span>
              {lista.length} organizaciones · {ORGANIZACIONES.filter((o) => o.facc).length} miembros FACC
            </span>
            <span>Los contactos se completan con la información pública disponible; algunos datos deben confirmarse con cada organización.</span>
          </div>
        </Panel>
      </section>

      <Reveal>
        <Panel className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-sm font-semibold text-white">¿Tu organización quiere sumarse a la red?</h3>
            <p className="mt-1 text-[11px] text-emerald-50/60">Escribinos y te acercamos la información sobre adhesión a la FACC y trabajo en secretarías.</p>
          </div>
          <Boton>
            <Icon name="mail" className="h-4 w-4" /> Contactar
          </Boton>
        </Panel>
      </Reveal>
    </div>
  );
}
