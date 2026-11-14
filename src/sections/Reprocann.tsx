import { useMemo, useState } from "react";
import { CONTACTO, ORG, REPROCANN } from "../data/content";
import { Badge, Boton, DemoBadge, Icon, Panel, Progress, Reveal, SectionTitle } from "../components/ui";

type Rol = "Usuarie / Paciente" | "Autocultivo" | "Familiar / Responsable" | "Tercere cultivadore" | "Persona jurídica permitida";

const PASOS_POR_ROL: Record<Rol, { titulo: string; texto: string }[]> = {
  "Usuarie / Paciente": [
    { titulo: "Indicación médica", texto: "Un profesional registrado en REFEPS con formación en cannabis medicinal indica el tratamiento y suscribe el consentimiento informado." },
    { titulo: "Validación en Mi Argentina", texto: "La persona crea o ingresa su cuenta y selecciona el rol “Paciente”." },
    { titulo: "Elección de modalidad", texto: "Autocultivo, familiar, tercere cultivadore u organización civil (persona jurídica permitida)." },
    { titulo: "Autorización", texto: "Se obtiene la autorización de cultivo controlado con su credencial y los rangos del Anexo II." },
  ],
  Autocultivo: [
    { titulo: "Indicación médica", texto: "Igual que el resto de las modalidades: profesional REFEPS y consentimiento informado." },
    { titulo: "Domicilio del cultivo", texto: "Se registra el domicilio donde se realizará el cultivo; puede editarse ante una mudanza." },
    { titulo: "Vinculación única", texto: "En autocultivo la persona se vincula solo con su profesional de la salud mediante código." },
    { titulo: "Rangos", texto: "1 a 9 plantas florecidas, hasta 6 m² en interior o 15 m² en exterior." },
  ],
  "Familiar / Responsable": [
    { titulo: "Registro del paciente", texto: "Desde “Mis personas a cargo” se busca a la persona por DNI y se la registra como paciente." },
    { titulo: "Vínculo declarado", texto: "Madre, padre, tutore, curadore judicial o hije a cargo." },
    { titulo: "Cultivo responsable", texto: "El familiar puede ser quien cultive dentro de los rangos permitidos." },
    { titulo: "Seguimiento", texto: "El profesional mantiene la responsabilidad del tratamiento y su seguimiento." },
  ],
  "Tercere cultivadore": [
    { titulo: "Requisitos", texto: "Cultivar solo para sí y para une únique usuarie; no exceder el doble del rango de un autocultivador." },
    { titulo: "Límite de representación", texto: "Como máximo 2 personas bajo el rol de cultivador, incluyéndose a sí mismo." },
    { titulo: "Conformidad del usuarie", texto: "Se acredita la conformidad y la renuncia del usuarie a ser autocultivador o vincularse con otra persona jurídica." },
    { titulo: "Transporte", texto: "Entre 1 y 6 frascos de 30 ml o hasta 40 g de flores secas." },
  ],
  "Persona jurídica permitida": [
    { titulo: "Constitución", texto: "Ser Asociación Civil, Fundación o persona jurídica con proyectos de I+D aprobados por la Ley 27.350." },
    { titulo: "Objeto social", texto: "Contemplar los objetivos del Programa Nacional para el Estudio y la Investigación del Uso Medicinal de la Planta de Cannabis." },
    { titulo: "Nómina y declaraciones", texto: "Nómina de usuaries con nombre, apellido, DNI y domicilio; declaración jurada de cada usuarie." },
    { titulo: "Mantenimiento", texto: "Certificado de vigencia anual, declaración jurada de domicilio y notificación municipal." },
  ],
};

export default function Reprocann() {
  const [rol, setRol] = useState<Rol>("Usuarie / Paciente");
  const [chequeados, setChequeados] = useState<number[]>([]);
  const [normaAbierta, setNormaAbierta] = useState<string | null>("Decreto 883/2020");
  const [enviado, setEnviado] = useState(false);
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", rolForm: rol, mensaje: "" });
  const [error, setError] = useState<string | null>(null);

  const pasos = useMemo(() => PASOS_POR_ROL[rol], [rol]);
  const avance = Math.round((chequeados.length / REPROCANN.requisitos.length) * 100);

  const enviar = () => {
    if (!form.nombre.trim() || !form.email.includes("@") || form.mensaje.trim().length < 10) {
      setError("Completá nombre, un email válido y un mensaje de al menos 10 caracteres.");
      return;
    }
    setError(null);
    setEnviado(true);
  };

  return (
    <div className="space-y-12">
      <SectionTitle
        kicker="Programa nacional"
        titulo={REPROCANN.titulo}
        bajada={REPROCANN.definicion}
        icono="clipboard"
      />

      {/* Rangos */}
      <section>
        <SectionTitle kicker="Anexo II · Decreto 883/2020" titulo="Rangos permitidos de cultivo y transporte" icono="leaf" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {REPROCANN.rangos.map((r, i) => (
            <Reveal key={r.item} delay={i * 70}>
              <Panel className="h-full p-5 text-center">
                <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-50/45">{r.item}</p>
                <p className="mt-2 text-xl font-bold text-grad">{r.valor}</p>
                <p className="mt-1 text-[10px] text-emerald-50/50">{r.detalle}</p>
                <div className="mt-3">
                  <Progress value={30 + i * 14} tone={i % 2 ? "cian" : "lima"} />
                </div>
              </Panel>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Mockup interactivo: simulador de rol */}
      <section>
        <SectionTitle
          kicker="Mockup interactivo"
          titulo="Simulador de inscripción por rol"
          bajada="Elegí un rol para ver el recorrido estimado del trámite. Es una maqueta: no sustituye la información oficial del Ministerio de Salud."
          icono="cursor"
        />
        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <Panel className="p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-lima-400/80">Roles previstos</p>
            <div className="mt-4 space-y-2">
              {REPROCANN.roles.map((r) => (
                <button
                  key={r.rol}
                  onClick={() => setRol(r.rol as Rol)}
                  className={`w-full rounded-xl border p-3 text-left transition ${rol === r.rol ? "border-lima-500/50 bg-lima-500/10" : "border-white/8 bg-white/[0.02] hover:border-white/20"}`}
                >
                  <span className="block text-xs font-semibold text-white">{r.rol}</span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-emerald-50/55">{r.detalle}</span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel className="p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-cian-400/80">Recorrido · {rol}</p>
              <DemoBadge texto="Maqueta" />
            </div>
            <ol className="mt-5 space-y-4">
              {pasos.map((p, i) => (
                <li key={p.titulo} className="flex gap-4">
                  <span className="relative">
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-cian-400/40 bg-cian-400/10 font-mono text-xs font-bold text-cian-400">
                      {i + 1}
                    </span>
                    {i < pasos.length - 1 && <span className="absolute left-1/2 top-9 h-[calc(100%-0.5rem)] w-px -translate-x-1/2 bg-gradient-to-b from-cian-400/50 to-transparent" />}
                  </span>
                  <span>
                    <span className="block text-xs font-semibold text-white">{p.titulo}</span>
                    <span className="mt-1 block text-[11px] leading-relaxed text-emerald-50/60">{p.texto}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      </section>

      {/* Normativa + requisitos */}
      <section className="grid gap-5 lg:grid-cols-2">
        <Panel className="p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-lima-400/80">Marco normativo</p>
          <ul className="mt-4 space-y-2">
            {REPROCANN.normativa.map((n) => {
              const abierta = normaAbierta === n.norma;
              return (
                <li key={n.norma}>
                  <button
                    onClick={() => setNormaAbierta(abierta ? null : n.norma)}
                    className={`w-full rounded-xl border p-3 text-left transition ${abierta ? "border-lima-500/45 bg-lima-500/8" : "border-white/8 bg-white/[0.02] hover:border-white/20"}`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-white">{n.norma}</span>
                      <span className="font-mono text-[10px] text-lima-300">{n.anio}</span>
                    </span>
                    <span className={`mt-1 block text-[11px] leading-relaxed text-emerald-50/60 ${abierta ? "" : "line-clamp-1"}`}>{n.detalle}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-cian-400/80">Checklist de requisitos</p>
              <p className="mt-2 text-[11px] text-emerald-50/55">Herramienta de orientación para organizaciones y pacientes.</p>
            </div>
            <span className="font-mono text-sm font-bold text-lima-300">{avance}%</span>
          </div>
          <ul className="mt-4 space-y-2">
            {REPROCANN.requisitos.map((r, i) => {
              const on = chequeados.includes(i);
              return (
                <li key={r}>
                  <button
                    onClick={() => setChequeados((c) => (on ? c.filter((x) => x !== i) : [...c, i]))}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${on ? "border-lima-500/45 bg-lima-500/8" : "border-white/8 bg-white/[0.02] hover:border-white/20"}`}
                  >
                    <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border ${on ? "border-lima-400 bg-lima-400 text-ink-950" : "border-white/20"}`}>
                      {on && <Icon name="check" className="h-3 w-3" />}
                    </span>
                    <span className="text-[11px] leading-relaxed text-emerald-50/70">{r}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-4">
            <Progress value={avance} />
          </div>
        </Panel>
      </section>

      {/* Contacto REPROCANN */}
      <section>
        <SectionTitle
          kicker="Contacto"
          titulo="Consultas sobre REPROCANN"
          bajada="Dejanos tu mensaje y te orientamos sobre roles, requisitos y documentación. No compartimos datos personales con terceros."
          icono="mail"
        />
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Panel className="p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-50/45">Nombre *</span>
                <input
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-white/12 bg-white/[0.03] px-3 py-2 text-xs text-white placeholder:text-emerald-50/25 focus:border-lima-500/50 focus:outline-none"
                  placeholder="Tu nombre"
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
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-50/45">Teléfono</span>
                <input
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-white/12 bg-white/[0.03] px-3 py-2 text-xs text-white placeholder:text-emerald-50/25 focus:border-lima-500/50 focus:outline-none"
                  placeholder="Opcional"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-50/45">Rol o motivo</span>
                <select
                  value={form.rolForm}
                  onChange={(e) => setForm({ ...form, rolForm: e.target.value as Rol })}
                  className="mt-1.5 w-full rounded-xl border border-white/12 bg-white/[0.03] px-3 py-2 text-xs text-white focus:border-lima-500/50 focus:outline-none"
                >
                  {REPROCANN.roles.map((r) => (
                    <option key={r.rol} value={r.rol} className="bg-ink-900">
                      {r.rol}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="mt-4 block">
              <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-50/45">Mensaje *</span>
              <textarea
                value={form.mensaje}
                onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                rows={4}
                className="mt-1.5 w-full resize-none rounded-xl border border-white/12 bg-white/[0.03] px-3 py-2 text-xs text-white placeholder:text-emerald-50/25 focus:border-lima-500/50 focus:outline-none"
                placeholder="Contanos en qué podemos orientarte…"
              />
            </label>
            {error && <p className="mt-3 rounded-lg border border-rose-400/40 bg-rose-400/10 px-3 py-2 text-[11px] text-rose-400">{error}</p>}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Boton onClick={enviar}>
                <Icon name="mail" className="h-4 w-4" /> Enviar consulta
              </Boton>
              {enviado && (
                <span className="inline-flex items-center gap-2 rounded-lg border border-lima-500/40 bg-lima-500/10 px-3 py-2 text-[11px] text-lima-300">
                  <Icon name="check" className="h-3.5 w-3.5" /> ¡Gracias {form.nombre}! Te respondemos a la brevedad.
                </span>
              )}
            </div>
            <p className="mt-3 text-[10px] text-emerald-50/40">
              Formulario de demostración: al integrarse al backend, los mensajes se enviarán a {ORG.email}.
            </p>
          </Panel>

          <div className="space-y-4">
            <Panel className="p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-lima-400/80">Canales</p>
              <ul className="mt-4 space-y-3 text-xs">
                <li className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-lima-300">
                    <Icon name="mail" className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-emerald-50/45">Email</span>
                    <a href={`mailto:${ORG.email}`} className="text-emerald-50/90 hover:text-lima-300">
                      {ORG.email}
                    </a>
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-lima-300">
                    <Icon name="pin" className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-emerald-50/45">Sede</span>
                    <span className="text-emerald-50/90">{ORG.sede}</span>
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-lima-300">
                    <Icon name="calendar" className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-emerald-50/45">Atención</span>
                    <span className="text-emerald-50/90">{CONTACTO.horarios}</span>
                  </span>
                </li>
              </ul>
            </Panel>
            <Panel className="p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-ambar-400/80">Importante</p>
              <p className="mt-3 text-[11px] leading-relaxed text-emerald-50/65">
                La información de esta sección es de carácter orientativo y se basa en la normativa pública citada. Para trámites
                oficiales, consultá siempre la {""}
                <a href="https://www.argentina.gob.ar/salud/cannabis-medicinal" target="_blank" rel="noreferrer" className="text-lima-300 hover:underline">
                  información oficial del Ministerio de Salud
                </a>
                .
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge tone="cian">Ley 27.350</Badge>
                <Badge tone="cian">Decreto 883/2020</Badge>
                <Badge tone="cian">Res. 1780/2025</Badge>
              </div>
            </Panel>
          </div>
        </div>
      </section>
    </div>
  );
}
