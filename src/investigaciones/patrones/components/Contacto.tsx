import { useState } from "react";
import { Mail, Copy, Check, Send, Building2, Users, ExternalLink, MessageSquare } from "lucide-react";
import { Card, SectionHeader, Badge, FadeIn } from "./ui";
import { AUTORES, COLABORADORAS, META } from "../data/research";
import { cn } from "../utils/cn";

function InstagramIcon({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const EMAIL = "accioncannabica@gmail.com";
const INSTAGRAM = "accannabica";
const IG_URL = `https://www.instagram.com/${INSTAGRAM}`;

export default function Contacto() {
  const [copiado, setCopiado] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [asunto, setAsunto] = useState("Consulta sobre el estudio de patrones de consumo");
  const [mensaje, setMensaje] = useState("");

  const copiar = async (texto: string, clave: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(clave);
      setTimeout(() => setCopiado(null), 1600);
    } catch { /* sin portapapeles */ }
  };

  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(
    `${mensaje}\n\n— ${nombre || "(nombre)"}\nEnviado desde el dashboard del estudio InvestiCann/Acción Cannábica`
  )}`;

  return (
    <div>
      <SectionHeader
        eyebrow="Contacto"
        title="Contacto y redes del equipo"
        desc="Canales oficiales de la Asociación Civil Acción Cannábica y de los autores del estudio «Patrones de consumo de cannabis y percepciones de salud en usuarios/as de Argentina y América Latina» (junio 2026)."
        right={<Badge tone="emerald"><span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-300" /> Respuesta por correo</Badge>}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <FadeIn>
          <Card hover className="group relative overflow-hidden p-6">
            <div className="flex items-start justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 text-emerald-950 shadow-lg shadow-emerald-500/25">
                <Mail size={22} />
              </span>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-1 text-xs font-medium text-zinc-500 transition group-hover:text-emerald-300">
                Abrir correo <ExternalLink size={12} />
              </a>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-zinc-50">Correo electrónico</h3>
            <p className="text-sm text-zinc-400">Consultas académicas, prensa, colaboración en investigación y acceso a los datos del estudio.</p>
            <div className="mt-4 flex items-center gap-2">
              <a href={`mailto:${EMAIL}`} className="min-w-0 flex-1 truncate rounded-xl border border-white/[0.08] bg-black/30 px-4 py-3 font-mono text-sm text-emerald-200 transition hover:border-emerald-400/40">
                {EMAIL}
              </a>
              <button onClick={() => copiar(EMAIL, "mail")} aria-label="Copiar correo"
                className={cn("flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl border transition",
                  copiado === "mail" ? "border-emerald-400 bg-emerald-400 text-emerald-950" : "border-white/[0.08] bg-white/[0.03] text-zinc-300 hover:bg-white/[0.08]")}>
                {copiado === "mail" ? <Check size={17} /> : <Copy size={17} />}
              </button>
            </div>
          </Card>
        </FadeIn>

        <FadeIn delay={0.06}>
          <Card hover className="group relative overflow-hidden p-6">
            <div className="flex items-start justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-400 text-rose-950 shadow-lg shadow-rose-500/25">
                <InstagramIcon size={22} />
              </span>
              <a href={IG_URL} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-medium text-zinc-500 transition group-hover:text-rose-300">
                Ver perfil <ExternalLink size={12} />
              </a>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-zinc-50">Instagram</h3>
            <p className="text-sm text-zinc-400">Difusión de resultados, actividades de la asociación, Marcha de la Marihuana y comunidad cannábica.</p>
            <div className="mt-4 flex items-center gap-2">
              <a href={IG_URL} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate rounded-xl border border-white/[0.08] bg-black/30 px-4 py-3 font-mono text-sm text-rose-200 transition hover:border-rose-400/40">
                @{INSTAGRAM}
              </a>
              <button onClick={() => copiar(`@${INSTAGRAM}`, "ig")} aria-label="Copiar usuario de Instagram"
                className={cn("flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl border transition",
                  copiado === "ig" ? "border-rose-400 bg-rose-400 text-rose-950" : "border-white/[0.08] bg-white/[0.03] text-zinc-300 hover:bg-white/[0.08]")}>
                {copiado === "ig" ? <Check size={17} /> : <Copy size={17} />}
              </button>
            </div>
          </Card>
        </FadeIn>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-5">
        <FadeIn className="xl:col-span-3">
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2.5">
              <MessageSquare size={18} className="text-emerald-300" />
              <h3 className="font-display text-base font-semibold text-zinc-100">Escribinos</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-zinc-400">Tu nombre</span>
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre y apellido"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-emerald-400/50" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-zinc-400">Asunto</span>
                <input value={asunto} onChange={(e) => setAsunto(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-emerald-400/50" />
              </label>
            </div>
            <label className="mt-3 block">
              <span className="mb-1.5 block text-xs font-medium text-zinc-400">Mensaje</span>
              <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} rows={4}
                placeholder="Contanos el motivo de tu contacto: consulta sobre el estudio, prensa, datos, charlas, colaboración…"
                className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-emerald-400/50" />
            </label>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a href={mailto}
                className="flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-300">
                <Send size={15} /> Enviar a {EMAIL}
              </a>
              <p className="text-[11px] leading-snug text-zinc-600">Se abrirá tu cliente de correo con el mensaje pre-cargado.<br />También podés escribirnos por Instagram: @{INSTAGRAM}</p>
            </div>
          </Card>
        </FadeIn>

        <div className="space-y-4 xl:col-span-2">
          <FadeIn delay={0.06}>
            <Card className="p-5">
              <div className="mb-3 flex items-center gap-2.5">
                <Building2 size={17} className="text-sky-300" />
                <h3 className="font-display text-base font-semibold text-zinc-100">Institución</h3>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  ["Organización", "Asociación Civil Acción Cannábica"],
                  ["Registro", "N.º correlativo IGJ 1921803 · ONG vinculada a la salud"],
                  ["País", "Argentina"],
                  ["Estudio", "Encuesta 2018–2020 · publicación junio 2026"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 border-b border-white/[0.05] pb-2">
                    <span className="shrink-0 text-zinc-500">{k}</span>
                    <span className="text-right font-medium text-zinc-200">{v}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11.5px] leading-relaxed text-zinc-600">{META.titulo}. {META.periodo} · n = {META.n.toLocaleString("es-ES")} casos únicos.</p>
            </Card>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Card className="p-5">
              <div className="mb-3 flex items-center gap-2.5">
                <Users size={17} className="text-amber-300" />
                <h3 className="font-display text-base font-semibold text-zinc-100">Autores y colaboradoras</h3>
              </div>
              <div className="space-y-2">
                {AUTORES.map((a) => (
                  <a key={a.nombre} href={`mailto:${a.email}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3.5 py-2.5 transition hover:border-emerald-400/25">
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-medium text-zinc-100">{a.nombre}</span>
                      <span className="block truncate text-[11px] text-zinc-500">{a.rol}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5 font-mono text-[10.5px] text-emerald-300/80">
                      <Mail size={12} /> <span className="hidden sm:inline">{a.email}</span>
                    </span>
                  </a>
                ))}
              </div>
              <p className="mb-2 mt-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Colaboradoras</p>
              <div className="flex flex-wrap gap-1.5">
                {COLABORADORAS.map((c) => (
                  <span key={c.nombre} className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-300">
                    {c.nombre} · <span className="text-zinc-500">{c.rol}</span>
                  </span>
                ))}
              </div>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
