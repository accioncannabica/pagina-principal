import { useState } from "react";
import { DONACION_DESTINOS, DONACION_MONTOS, DONACION_NOTA, PRODUCTOS, TIENDA_NOTA, type Producto } from "../data/content";
import { DonutDestino } from "../components/charts";
import { Badge, Boton, DemoBadge, Icon, Panel, Progress, Reveal, SectionTitle, Tabs } from "../components/ui";

/* =============================== TIENDA =============================== */
const CATS = ["Todos", "Indumentaria", "Papelería", "Hogar", "Cultivo", "Libros"] as const;

type Item = { id: string; talle: string; color: string; qty: number };

export function Tienda() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("Todos");
  const [sel, setSel] = useState<Record<string, { talle: string; color: string }>>({});
  const [carrito, setCarrito] = useState<Item[]>([]);
  const [abierto, setAbierto] = useState(false);

  const lista = PRODUCTOS.filter((p) => (cat === "Todos" ? true : p.categoria === cat));
  const total = carrito.reduce((a, i) => a + (PRODUCTOS.find((p) => p.id === i.id)?.precio ?? 0) * i.qty, 0);
  const items = carrito.reduce((a, i) => a + i.qty, 0);

  const elegir = (p: Producto, campo: "talle" | "color", valor: string) =>
    setSel((s) => ({ ...s, [p.id]: { talle: s[p.id]?.talle ?? p.talles[0], color: s[p.id]?.color ?? p.colores[0], [campo]: valor } }));

  const agregar = (p: Producto) => {
    const conf = sel[p.id] ?? { talle: p.talles[0], color: p.colores[0] };
    setCarrito((c) => {
      const existe = c.find((i) => i.id === p.id && i.talle === conf.talle && i.color === conf.color);
      if (existe) return c.map((i) => (i === existe ? { ...i, qty: i.qty + 1 } : i));
      return [...c, { id: p.id, talle: conf.talle, color: conf.color, qty: 1 }];
    });
    setAbierto(true);
  };

  return (
    <div className="space-y-12">
      <SectionTitle
        kicker="Tienda · merchandising"
        titulo="Productos institucionales"
        bajada="Mockup de catálogo con variantes y carrito. La recaudación se destina al fondo de actividades de la asociación."
        icono="shop"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs opciones={CATS} activa={cat} onChange={setCat} />
        <Boton variante="fantasma" onClick={() => setAbierto(true)}>
          <Icon name="shop" className="h-4 w-4" /> Ver carrito ({items})
        </Boton>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {lista.map((p, i) => {
          const conf = sel[p.id] ?? { talle: p.talles[0], color: p.colores[0] };
          return (
            <Reveal key={p.id} delay={Math.min(i * 60, 360)}>
              <Panel className="flex h-full flex-col p-4">
                <div className="relative grid h-32 place-items-center overflow-hidden rounded-xl border border-white/8 bg-gradient-to-br from-lima-500/12 via-transparent to-cian-400/10">
                  <span className="text-4xl anim-float" style={{ animationDelay: `${i * 0.3}s` }}>
                    {p.emoji}
                  </span>
                  <span className="absolute right-2 top-2">
                    <Badge tone={p.stock === "Bajo" ? "rose" : p.stock === "Medio" ? "ambar" : "lima"}>{p.stock}</Badge>
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-semibold leading-snug text-white">{p.nombre}</h3>
                <p className="mt-1 flex-1 text-[11px] leading-relaxed text-emerald-50/55">{p.descripcion}</p>

                <div className="mt-3 space-y-2">
                  {p.colores.length > 1 && (
                    <div className="flex flex-wrap gap-1.5">
                      {p.colores.map((c) => (
                        <button
                          key={c}
                          onClick={() => elegir(p, "color", c)}
                          className={`rounded-lg border px-2 py-1 text-[10px] transition ${conf.color === c ? "border-lima-500/50 bg-lima-500/12 text-lima-200" : "border-white/10 text-emerald-50/50"}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                  {p.talles.length > 1 && (
                    <div className="flex flex-wrap gap-1.5">
                      {p.talles.map((t) => (
                        <button
                          key={t}
                          onClick={() => elegir(p, "talle", t)}
                          className={`grid h-7 w-7 place-items-center rounded-lg border font-mono text-[10px] transition ${conf.talle === t ? "border-cian-400/60 bg-cian-400/15 text-cian-400" : "border-white/10 text-emerald-50/50"}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/8 pt-3">
                  <span className="font-mono text-sm font-bold text-lima-300">{p.precio === 0 ? "Gratis" : `$${p.precio.toLocaleString("es-AR")}`}</span>
                  <Boton onClick={() => agregar(p)}>
                    <Icon name="plus" className="h-3.5 w-3.5" /> Sumar
                  </Boton>
                </div>
              </Panel>
            </Reveal>
          );
        })}
      </div>

      <Panel className="flex flex-wrap items-center gap-3 p-5">
        <DemoBadge texto="Precios demo" />
        <p className="text-[11px] leading-relaxed text-emerald-50/60">{TIENDA_NOTA}</p>
      </Panel>

      {abierto && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" onClick={() => setAbierto(false)} aria-label="Cerrar carrito" />
          <aside className="relative z-10 h-full w-full max-w-sm overflow-y-auto border-l border-white/10 bg-ink-900/95 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Carrito</h3>
              <button onClick={() => setAbierto(false)} className="text-emerald-50/50 hover:text-white">
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>
            {carrito.length === 0 ? (
              <p className="mt-8 text-xs text-emerald-50/50">Todavía no sumaste productos.</p>
            ) : (
              <ul className="mt-5 space-y-3">
                {carrito.map((i, idx) => {
                  const p = PRODUCTOS.find((x) => x.id === i.id)!;
                  return (
                    <li key={`${i.id}-${i.talle}-${i.color}-${idx}`} className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-white">{p.nombre}</span>
                        <span className="font-mono text-[11px] text-lima-300">${(p.precio * i.qty).toLocaleString("es-AR")}</span>
                      </div>
                      <p className="mt-1 text-[10px] text-emerald-50/50">
                        {i.color} · Talle {i.talle}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => setCarrito((c) => c.map((x, xi) => (xi === idx ? { ...x, qty: Math.max(1, x.qty - 1) } : x)))}
                          className="grid h-6 w-6 place-items-center rounded-md border border-white/12 text-emerald-50/60 hover:text-white"
                        >
                          <Icon name="minus" className="h-3 w-3" />
                        </button>
                        <span className="font-mono text-xs text-white">{i.qty}</span>
                        <button
                          onClick={() => setCarrito((c) => c.map((x, xi) => (xi === idx ? { ...x, qty: x.qty + 1 } : x)))}
                          className="grid h-6 w-6 place-items-center rounded-md border border-white/12 text-emerald-50/60 hover:text-white"
                        >
                          <Icon name="plus" className="h-3 w-3" />
                        </button>
                        <button onClick={() => setCarrito((c) => c.filter((_, xi) => xi !== idx))} className="ml-auto text-[10px] text-rose-400 hover:underline">
                          Quitar
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="mt-6 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-50/60">Total</span>
                <span className="font-mono text-lg font-bold text-lima-300">${total.toLocaleString("es-AR")}</span>
              </div>
              <Boton className="mt-4 w-full">
                Finalizar compra <Icon name="arrow" className="h-4 w-4" />
              </Boton>
              <p className="mt-3 text-[10px] leading-relaxed text-emerald-50/40">
                Checkout de demostración. Al integrarse, se conectará con la pasarela de pagos y el sistema de envíos.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

/* ============================= DONACIONES ============================= */
export function Donaciones() {
  const [monto, setMonto] = useState(30000);
  const [frecuencia, setFrecuencia] = useState<"Única" | "Mensual">("Única");
  const [custom, setCustom] = useState("");
  const [destacado, setDestacado] = useState(0);

  const montoFinal = custom ? Number(custom) : monto;
  const acompanamientos = Math.max(1, Math.round(montoFinal / 12000));
  const horas = Math.max(1, Math.round(montoFinal / 3500));
  const destino = DONACION_DESTINOS[destacado];

  return (
    <div className="space-y-12">
      <SectionTitle
        kicker="Donaciones"
        titulo="Estructura de destino de los fondos"
        bajada="La asociación se sostiene con el aporte voluntario. Esta sección deja preparada la estructura para incorporar los datos reales de recaudación y rendición de cuentas."
        icono="gift"
      />

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <DonutDestino datos={DONACION_DESTINOS} />
        <Panel className="p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-lima-400/80">Calculadora de impacto</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {DONACION_MONTOS.map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMonto(m);
                  setCustom("");
                }}
                className={`rounded-xl border px-3 py-2 font-mono text-xs transition ${custom === "" && monto === m ? "border-lima-500/50 bg-lima-500/12 text-lima-200" : "border-white/10 text-emerald-50/60 hover:text-white"}`}
              >
                ${m.toLocaleString("es-AR")}
              </button>
            ))}
          </div>
          <label className="mt-4 block">
            <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-50/45">Otro monto (ARS)</span>
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="Ingresá un monto"
              className="mt-1.5 w-full rounded-xl border border-white/12 bg-white/[0.03] px-3 py-2 font-mono text-xs text-white placeholder:text-emerald-50/25 focus:border-lima-500/50 focus:outline-none"
            />
          </label>
          <div className="mt-4">
            <Tabs opciones={["Única", "Mensual"] as const} activa={frecuencia} onChange={setFrecuencia} />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { k: "Acompañamientos", v: acompanamientos, icono: "heart" },
              { k: "Horas de asesoría", v: horas, icono: "users" },
              { k: "Materiales", v: Math.max(1, Math.round(montoFinal / 4000)), icono: "book" },
            ].map((m) => (
              <div key={m.k} className="rounded-xl border border-white/8 bg-white/[0.02] p-3 text-center">
                <span className="mx-auto grid h-8 w-8 place-items-center rounded-lg border border-lima-500/25 bg-lima-500/10 text-lima-300">
                  <Icon name={m.icono} className="h-4 w-4" />
                </span>
                <p className="mt-2 font-mono text-lg font-bold text-lima-300">
                  {m.v}
                  {frecuencia === "Mensual" ? <span className="text-[10px] text-emerald-50/45">/mes</span> : null}
                </p>
                <p className="text-[10px] text-emerald-50/50">{m.k}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-lima-500/25 bg-lima-500/6 p-4">
            <p className="text-[11px] leading-relaxed text-emerald-50/70">
              Con <strong className="text-lima-300">${montoFinal.toLocaleString("es-AR")}</strong> {frecuencia === "Mensual" ? "por mes" : "por única vez"} se
              estima un aporte de <strong className="text-lima-300">{Math.round((montoFinal * destino.pct) / 100).toLocaleString("es-AR")} ARS</strong> a{" "}
              <strong className="text-lima-300">{destino.titulo}</strong>.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {DONACION_DESTINOS.map((d, i) => (
                <button
                  key={d.titulo}
                  onClick={() => setDestacado(i)}
                  className={`rounded-full border px-2.5 py-1 text-[10px] transition ${destacado === i ? "border-lima-500/50 bg-lima-500/12 text-lima-200" : "border-white/10 text-emerald-50/45"}`}
                >
                  {d.titulo}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Boton>
              <Icon name="gift" className="h-4 w-4" /> Donar {frecuencia === "Mensual" ? "mensualmente" : "ahora"}
            </Boton>
            <Boton variante="fantasma" onClick={() => navigator.clipboard?.writeText("CBU/Alias a incorporar")}>
              <Icon name="check" className="h-4 w-4" /> Copiar CBU / Alias
            </Boton>
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel className="p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-cian-400/80">Estructura de cuenta</p>
          <ul className="mt-4 space-y-3 text-xs">
            {[
              ["Titular", "Asociación Civil Acción Cannábica"],
              ["CUIT", "30-71629859-7"],
              ["CBU / Alias", "A incorporar (datos reales pendientes)"],
              ["Medios", "Transferencia · Mercado Pago · Tarjeta (a definir)"],
              ["Recibo", "Constancia de donación por email"],
            ].map(([k, v]) => (
              <li key={k} className="flex gap-3 border-b border-white/6 pb-2">
                <span className="w-28 shrink-0 text-emerald-50/45">{k}</span>
                <span className="min-w-0 flex-1 break-words text-emerald-50/85">{v}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel className="p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-ambar-400/80">Rendición de cuentas</p>
          <div className="mt-4 space-y-3">
            {DONACION_DESTINOS.map((d, i) => (
              <div key={d.titulo}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-emerald-50/75">{d.titulo}</span>
                  <span className="font-mono text-lima-300">{d.pct}%</span>
                </div>
                <div className="mt-1">
                  <Progress value={d.pct * 2.6} tone={i === 0 ? "lima" : i % 2 ? "cian" : "ambar"} />
                </div>
                <p className="mt-1 text-[10px] text-emerald-50/45">{d.detalle}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel className="flex flex-wrap items-center gap-3 p-5">
        <DemoBadge texto="Datos reales a incorporar" />
        <p className="text-[11px] leading-relaxed text-emerald-50/60">{DONACION_NOTA}</p>
      </Panel>
    </div>
  );
}
