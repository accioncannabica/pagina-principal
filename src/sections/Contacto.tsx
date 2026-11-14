import { useState } from "react";
import { CONTACTO, ORG } from "../data/content";
import { Badge, Boton, Icon, Panel, Reveal, SectionTitle } from "../components/ui";
import type { Vista } from "../types";

const FAQ = [
  {
    p: "¿Cómo me acerco a la asociación?",
    r: "Escribinos a accioncannabica@gmail.com o por mensaje directo en Instagram y Facebook. Contanos desde qué rol te acercás (paciente, familiar, profesional, organización o prensa) para derivarte con el área correspondiente.",
  },
  {
    p: "¿Orientan sobre REPROCANN?",
    r: "Sí, damos orientación general sobre roles, requisitos y documentación. No reemplazamos la asesoría médica ni la información oficial del Ministerio de Salud.",
  },
  {
    p: "¿Cómo se suma una organización?",
    r: "Podés escribirnos para conocer el trabajo de la FACC, las secretarías y el proceso de adhesión de nuevas organizaciones con personería jurídica.",
  },
  {
    p: "¿Reciben donaciones?",
    r: "Sí. Para conocer cómo realizar un aporte, escribinos a accioncannabica@gmail.com; los datos bancarios se comunicarán de forma oficial por la Comisión Directiva.",
  },
];

export default function Contacto({ irA }: { irA: (v: Vista) => void }) {
  const [form, setForm] = useState({ nombre: "", email: "", area: CONTACTO.areas[0].area, mensaje: "", newsletter: true });
  const [error, setError] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);
  const [faq, setFaq] = useState(0);

  const enviar = () => {
    if (!form.nombre.trim() || !form.email.includes("@") || form.mensaje.trim().length < 10) {
      setError("Revisá nombre, email y mensaje (mínimo 10 caracteres).");
      return;
    }
    setError(null);
    setEnviado(true);
  };

  return (
    <div className="space-y-12">
      <SectionTitle
        kicker="Vista y contacto"
        titulo="Hablemos"
        bajada="Canales directos, formulario y referencia de la sede. También podés seguir la actividad diaria en las redes institucionales."
        icono="mail"
      />

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Formulario */}
        <Panel className="p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-lima-400/80">Formulario de contacto</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-50/45">Nombre *</span>
              <input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-white/12 bg-white/[0.03] px-3 py-2 text-xs text-white placeholder:text-emerald-50/25 focus:border-lima-500/50 focus:outline-none"
                placeholder="Nombre y apellido"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-50/45">Email *</span>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-white/12 bg-white/[0.03] px-3 py-2 text-xs text-white placeholder:text-emerald-50/25 focus:border-lima-500/50 focus:outline-none"
                placeholder="tu@email.com"
              />
            </label>
          </div>
          <label className="mt-4 block">
            <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-50/45">Área</span>
            <select
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-white/12 bg-white/[0.03] px-3 py-2 text-xs text-white focus:border-lima-500/50 focus:outline-none"
            >
              {CONTACTO.areas.map((a) => (
                <option key={a.area} value={a.area} className="bg-ink-900">
                  {a.area}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-4 block">
            <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-50/45">Mensaje *</span>
            <textarea
              value={form.mensaje}
              onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
              rows={5}
              className="mt-1.5 w-full resize-none rounded-xl border border-white/12 bg-white/[0.03] px-3 py-2 text-xs text-white placeholder:text-emerald-50/25 focus:border-lima-500/50 focus:outline-none"
              placeholder="Contanos en qué podemos ayudarte…"
            />
          </label>
          <label className="mt-4 flex cursor-pointer items-start gap-2.5">
            <input type="checkbox" checked={form.newsletter} onChange={(e) => setForm({ ...form, newsletter: e.target.checked })} className="mt-0.5 h-3.5 w-3.5 accent-lima-400" />
            <span className="text-[11px] leading-relaxed text-emerald-50/60">Quiero recibir novedades, agenda y materiales de divulgación.</span>
          </label>
          {error && <p className="mt-3 rounded-lg border border-rose-400/40 bg-rose-400/10 px-3 py-2 text-[11px] text-rose-400">{error}</p>}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Boton onClick={enviar}>
              <Icon name="mail" className="h-4 w-4" /> Enviar mensaje
            </Boton>
            {enviado && (
              <span className="inline-flex items-center gap-2 rounded-lg border border-lima-500/40 bg-lima-500/10 px-3 py-2 text-[11px] text-lima-300">
                <Icon name="check" className="h-3.5 w-3.5" /> Mensaje enviado. ¡Gracias {form.nombre}!
              </span>
            )}
          </div>
        </Panel>

        {/* Canales + mapa */}
        <div className="space-y-5">
          <Panel className="p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-cian-400/80">Áreas de contacto</p>
            <ul className="mt-4 space-y-3">
              {CONTACTO.areas.map((a) => (
                <li key={a.area} className="flex gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-cian-400/25 bg-cian-400/10 text-cian-400">
                    <Icon name="mail" className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold text-white">{a.area}</span>
                    <span className="block text-[11px] text-emerald-50/55">{a.detalle}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.02] p-3">
              <p className="text-[11px] text-emerald-50/60">
                <strong className="text-lima-300">Email:</strong> {ORG.email} · <strong className="text-lima-300">Sede:</strong> {ORG.sede}
              </p>
            </div>
          </Panel>

          {/* Mapa de referencia */}
          <Panel className="overflow-hidden p-0">
            <div className="relative h-56 bg-[radial-gradient(120%_120%_at_30%_10%,#0f2a20,#05090b)]">
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage: "linear-gradient(rgba(163,230,53,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(163,230,53,0.18) 1px, transparent 1px)",
                  backgroundSize: "34px 34px",
                }}
              />
              <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
                <path d="M8 40 C22 22 34 30 44 18 C56 4 74 10 92 22" fill="none" stroke="rgba(163,230,53,0.35)" strokeWidth="0.8" strokeDasharray="4 4" />
                <path d="M6 12 C24 26 40 22 58 34 C74 44 84 40 94 46" fill="none" stroke="rgba(34,211,238,0.3)" strokeWidth="0.8" />
              </svg>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="relative mx-auto grid h-10 w-10 place-items-center rounded-full border border-lima-500/50 bg-lima-500/15 text-lima-300">
                  <Icon name="pin" className="h-5 w-5" />
                  <span className="absolute inset-0 rounded-full border border-lima-400/50" style={{ animation: "pulse-ring 2.6s ease-out infinite" }} />
                </span>
                <p className="mt-2 text-[11px] font-semibold text-white">Ciudad Autónoma de Buenos Aires</p>
                <p className="text-[10px] text-emerald-50/50">{ORG.domicilio}</p>
                <p className="mt-1 text-[9px] text-emerald-50/35">Esquema de referencia, no un mapa navegable</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/8 px-5 py-3">
              <span className="text-[11px] text-emerald-50/50">{CONTACTO.horarios}</span>
              <div className="flex gap-2">
                {ORG.socials.map((s) => (
                  <a key={s.red} href={s.url} target="_blank" rel="noreferrer" aria-label={s.red} className="grid h-8 w-8 place-items-center rounded-lg border border-white/12 bg-white/[0.03] text-emerald-50/60 transition hover:border-lima-500/40 hover:text-lima-300">
                    <Icon name={s.red === "Facebook" ? "face" : s.red === "Instagram" ? "insta" : "youtube"} className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* FAQ */}
      <section>
        <SectionTitle kicker="Preguntas frecuentes" titulo="Antes de escribir" icono="clipboard" />
        <div className="grid gap-3 lg:grid-cols-2">
          {FAQ.map((f, i) => (
            <Reveal key={f.p} delay={i * 70}>
              <button onClick={() => setFaq(faq === i ? -1 : i)} className="w-full text-left">
                <Panel className={`h-full p-5 ${faq === i ? "!border-lima-500/40" : ""}`}>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xs font-semibold text-white">{f.p}</h3>
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/12 text-emerald-50/60 transition ${faq === i ? "rotate-45 border-lima-500/50 text-lima-300" : ""}`}>
                      <Icon name="plus" className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <p className={`mt-2 text-[11px] leading-relaxed text-emerald-50/60 ${faq === i ? "" : "line-clamp-2"}`}>{f.r}</p>
                </Panel>
              </button>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <Panel className="mt-5 flex flex-wrap items-center justify-between gap-4 p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="lima">Respuesta por agenda</Badge>
              <Badge tone="slate">Datos protegidos</Badge>
              <Badge tone="cian">Orientación, no asesoría médica</Badge>
            </div>
            <Boton variante="fantasma" onClick={() => irA("reprocann")}>
              Ver sección REPROCANN <Icon name="arrow" className="h-4 w-4" />
            </Boton>
          </Panel>
        </Reveal>
      </section>
    </div>
  );
}
