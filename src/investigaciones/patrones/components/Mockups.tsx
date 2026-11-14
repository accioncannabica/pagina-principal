import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList, RotateCcw, CheckCircle2, Users, Leaf, HeartPulse, ShieldAlert, Sparkles, Search, ChevronDown, ListOrdered,
} from "lucide-react";
import { Card, SectionHeader, Badge, FadeIn } from "./ui";
import { CLUSTERS, INSTRUMENTO } from "../data/research";
import { cn } from "../utils/cn";

interface Pregunta { id: string; texto: string; ayuda: string; opciones: string[] }
const PREGUNTAS: Pregunta[] = [
  { id: "frecuencia", texto: "¿Con qué frecuencia consumís cannabis?", ayuda: "Ítem de frecuencia · §3.5.2", opciones: ["Todos los días", "Días salteados", "De vez en cuando", "Fin de semana"] },
  { id: "motivo", texto: "¿Cuál es tu motivo principal de consumo?", ayuda: "Respuesta múltiple en el instrumento real · §3.5.3", opciones: ["Lo disfruto", "Terapéutico", "Disfrute + terapéutico", "Afrontar problemas"] },
  { id: "colectivo", texto: "¿Participás en colectivos o grupos cannábicos?", ayuda: "Participación social · §3.5.7", opciones: ["Sí, activamente", "A veces", "No participo"] },
  { id: "inconvenientes", texto: "¿El consumo te generó inconvenientes en tu vida diaria?", ayuda: "Variable objetivo de los modelos · §3.5.8", opciones: ["No, nunca", "Sí, alguna vez"] },
  { id: "cultivo", texto: "¿Cultivás tu propio cannabis?", ayuda: "Cultivo y acceso · §3.5.5", opciones: ["Sí, me autoabastezco", "Sí, parcialmente", "No cultivo"] },
];

const DIMENSIONES = [
  "Sociodemográficas", "Patrones y prácticas", "Motivos", "Efectos percibidos",
  "Cultivo y acceso", "Salud y uso terapéutico", "Participación y regulación", "Experiencias policiales",
];

export default function Mockups() {
  const [resp, setResp] = useState<Record<string, string>>({});
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const respondidas = Object.keys(resp).length;
  const completa = respondidas === PREGUNTAS.length;

  const perfil = useMemo(() => {
    if (!completa) return null;
    let p1 = 0, p2 = 0, p3 = 0;
    if (resp.inconvenientes === "Sí, alguna vez") p3 += 3;
    if (resp.motivo === "Terapéutico" || resp.motivo === "Disfrute + terapéutico") p2 += 2;
    if (resp.colectivo === "Sí, activamente") p2 += 2;
    if (resp.motivo === "Lo disfruto") p1 += 2;
    if (resp.frecuencia === "Todos los días" && resp.inconvenientes === "Sí, alguna vez") p3 += 1;
    if (resp.frecuencia === "De vez en cuando" || resp.frecuencia === "Fin de semana") p1 += 1;
    if (resp.cultivo?.startsWith("Sí")) p1 += 1;
    const max = Math.max(p1, p2, p3);
    const idx = max === p3 ? 2 : max === p2 ? 1 : 0;
    return { ...CLUSTERS[idx], puntajes: [p1, p2, p3] };
  }, [resp, completa]);

  const reiniciar = () => { setResp({}); setMostrarResultado(false); };
  const [bloqueAbierto, setBloqueAbierto] = useState<string | null>("Datos generales");
  const [buscaItem, setBuscaItem] = useState("");

  return (
    <div>
      <SectionHeader
        eyebrow="Instrumento · Mockup interactivo"
        title="La encuesta online, tal como la respondieron 1.046 personas"
        desc="Mockup navegable del cuestionario autoadministrado (§3.2, Anexo 13.1): anónimo, con preguntas cerradas y abiertas, validado en un piloto con 30 participantes y desplegado durante 21 meses. Completá las 5 preguntas clave y el sistema te asigna el perfil de clúster más cercano (§5.3)."
        right={<Badge tone="sky"><ClipboardList size={12} /> Piloto n=30 · campo 2018–2020</Badge>}
      />

      <div className="grid gap-4 xl:grid-cols-5">
        <FadeIn className="xl:col-span-3">
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-white/[0.07] bg-white/[0.03] px-5 py-3">
              <span className="flex gap-1.5">
                <i className="h-2.5 w-2.5 rounded-full bg-rose-400/80" /><i className="h-2.5 w-2.5 rounded-full bg-amber-400/80" /><i className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              </span>
              <span className="ml-2 flex-1 rounded-md bg-black/40 px-3 py-1 text-center font-mono text-[10.5px] text-zinc-500">encuesta.accioncannabica.org · anónima y confidencial</span>
            </div>
            <div className="p-5 sm:p-7">
              <div className="mb-1 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400 text-emerald-950"><Leaf size={18} /></span>
                <div>
                  <h3 className="font-display text-lg font-semibold leading-tight text-zinc-50">Encuesta a usuarios/as de cannabis</h3>
                  <p className="text-[11px] text-zinc-500">Acción Cannábica · Tus respuestas son anónimas · consentimiento implícito al enviar (§9.2)</p>
                </div>
              </div>
              <div className="mb-6 mt-4">
                <div className="mb-1.5 flex justify-between text-[11px] text-zinc-500">
                  <span>Progreso</span><span className="font-mono">{respondidas}/{PREGUNTAS.length}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                  <motion.div className="h-full rounded-full bg-emerald-400" animate={{ width: `${(respondidas / PREGUNTAS.length) * 100}%` }} transition={{ duration: 0.4 }} />
                </div>
              </div>

              <div className="space-y-6">
                {PREGUNTAS.map((p, i) => (
                  <div key={p.id}>
                    <p className="text-sm font-medium text-zinc-100"><span className="mr-1.5 font-mono text-xs text-emerald-300">{i + 1}.</span>{p.texto}</p>
                    <p className="mb-2.5 ml-5 text-[11px] text-zinc-600">{p.ayuda}</p>
                    <div className="ml-5 flex flex-wrap gap-2">
                      {p.opciones.map((op) => {
                        const on = resp[p.id] === op;
                        return (
                          <button key={op} onClick={() => { setResp({ ...resp, [p.id]: op }); setMostrarResultado(false); }}
                            className={cn("rounded-xl border px-3.5 py-2 text-[13px] font-medium transition active:scale-[0.97]",
                              on ? "border-emerald-400 bg-emerald-400 text-emerald-950 shadow-lg shadow-emerald-500/20" : "border-white/[0.09] bg-white/[0.03] text-zinc-300 hover:border-emerald-400/40 hover:text-zinc-50")}>
                            {op}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-2.5">
                <button disabled={!completa} onClick={() => setMostrarResultado(true)}
                  className="flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-40">
                  <CheckCircle2 size={16} /> Enviar y ver mi perfil
                </button>
                <button onClick={reiniciar} className="flex items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.03] px-4 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.07]">
                  <RotateCcw size={15} /> Reiniciar
                </button>
              </div>

              <AnimatePresence>
                {mostrarResultado && perfil && (
                  <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-6 rounded-2xl border p-5" style={{ borderColor: `${perfil.color}44`, background: `${perfil.color}0d` }}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="flex items-center gap-2 font-display text-base font-semibold text-zinc-50">
                        <Users size={17} style={{ color: perfil.color }} /> Tu perfil más cercano: {perfil.nombre}
                      </p>
                      <span className="rounded-lg px-2.5 py-1 font-mono text-xs font-bold" style={{ background: `${perfil.color}22`, color: perfil.color }}>
                        {perfil.id === 3 ? "≈25 usuarios" : `~${perfil.share}% de la muestra`}
                      </span>
                    </div>
                    <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                      {perfil.rasgos.map((r) => (
                        <li key={r} className="flex gap-2 text-xs leading-snug text-zinc-300">
                          <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full" style={{ background: perfil.color }} /> {r}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {["Recreativo integrado", "Terapéutico-social", "Minoría con conflicto"].map((n, i) => (
                        <div key={n} className="rounded-lg bg-black/25 px-2.5 py-2 text-center">
                          <p className="font-mono text-sm font-bold text-zinc-100">{perfil.puntajes[i]} pts</p>
                          <p className="text-[9.5px] leading-tight text-zinc-500">{n}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-[11px] leading-relaxed text-zinc-500">
                      Asignación ilustrativa por reglas simples. En el estudio, los perfiles provienen de K-Means (k=3) con separación difusa (silhouette 0,19): son heurísticos descriptivos, no categorías estrictas (§6.2.6).
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </FadeIn>

        <div className="space-y-4 xl:col-span-2">
          <FadeIn delay={0.06}>
            <Card className="p-5">
              <h3 className="font-display text-base font-semibold text-zinc-100">Diseño del instrumento (§3.2.2)</h3>
              <div className="mt-3 space-y-2 text-sm">
                {[
                  ["Dimensiones temáticas", "8 bloques de variables"],
                  ["Tipos de ítem", "Cerradas, escalas y abiertas"],
                  ["Prueba piloto", "30 participantes · claridad y operatividad"],
                  ["Despliegue", "21 meses · 2018–2020"],
                  ["Difusión", "Redes sociales y colectivos cannábicos"],
                  ["Garantías", "Anonimato y confidencialidad"],
                  ["Registros crudos", "1.048 → 1.046 únicos depurados"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 border-b border-white/[0.05] pb-2">
                    <span className="text-zinc-500">{k}</span>
                    <span className="text-right font-medium text-zinc-200">{v}</span>
                  </div>
                ))}
              </div>
              <p className="mb-2 mt-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Las 8 dimensiones (§3.5)</p>
              <div className="flex flex-wrap gap-1.5">
                {DIMENSIONES.map((d) => (
                  <span key={d} className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-300">{d}</span>
                ))}
              </div>
            </Card>
          </FadeIn>

          <FadeIn delay={0.12}>
            <Card className="p-5">
              <h3 className="font-display text-base font-semibold text-zinc-100">De la encuesta a los perfiles</h3>
              <p className="mb-4 text-xs text-zinc-500">Cómo las respuestas alimentan el análisis (§3.6, §5.3)</p>
              <div className="space-y-3">
                {[
                  { icon: ClipboardList, titulo: "1 · Relevamiento", texto: "Respuestas autoinformadas, varias de selección múltiple tratadas como tales (one-hot para efectos)." },
                  { icon: Sparkles, titulo: "2 · Depuración reproducible", texto: "Duplicados, faltantes explícitos y recodificación con diccionarios de sinónimos (scripts 14.1–14.4)." },
                  { icon: HeartPulse, titulo: "3 · Análisis descriptivo y bivariado", texto: "Frecuencias, χ² y correlaciones de Pearson sobre casos válidos por variable." },
                  { icon: Users, titulo: "4 · PCA + clustering", texto: "Reducción dimensional y K-Means k=3: emergen los tres perfiles que acabás de explorar." },
                  { icon: ShieldAlert, titulo: "5 · Modelos predictivos", texto: "Random Forest y regresión logística sobre «percepción de problemas»: AUC 0,49, sin patrón discriminativo." },
                ].map((p) => (
                  <div key={p.titulo} className="flex gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300"><p.icon size={15} /></span>
                    <div>
                      <p className="text-[13px] font-semibold text-zinc-100">{p.titulo}</p>
                      <p className="text-[11.5px] leading-snug text-zinc-500">{p.texto}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </FadeIn>
        </div>
      </div>

      <FadeIn>
        <Card className="mt-4 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ListOrdered size={18} className="text-emerald-300" />
              <div>
                <h3 className="font-display text-base font-semibold text-zinc-100">Instrumento completo · Anexo 13.1</h3>
                <p className="text-xs text-zinc-500">47 ítems en 7 bloques, con lógica condicional por subgrupo (terapéuticos, compradores, cultivadores…)</p>
              </div>
            </div>
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input value={buscaItem} onChange={(e) => setBuscaItem(e.target.value)} placeholder="Buscar ítem…"
                className="w-52 rounded-lg border border-white/10 bg-white/[0.03] py-1.5 pl-8 pr-2 text-xs text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-emerald-400/50" />
            </div>
          </div>
          <div className="space-y-2">
            {INSTRUMENTO.map((b) => {
              const items = b.items.filter((it) => it.texto.toLowerCase().includes(buscaItem.toLowerCase()));
              if (buscaItem && items.length === 0) return null;
              const abierto = buscaItem ? true : bloqueAbierto === b.bloque;
              return (
                <div key={b.bloque} className="overflow-hidden rounded-xl border border-white/[0.06]">
                  <button onClick={() => setBloqueAbierto(abierto && !buscaItem ? null : b.bloque)}
                    className="flex w-full items-center justify-between bg-white/[0.03] px-4 py-3 text-left transition hover:bg-white/[0.05]">
                    <span className="text-sm font-semibold text-zinc-100">{b.bloque} <span className="ml-1 font-mono text-[11px] font-normal text-zinc-500">{items.length} ítems</span></span>
                    <ChevronDown size={16} className={cn("text-zinc-500 transition-transform", abierto && "rotate-180")} />
                  </button>
                  {abierto && (
                    <div className="divide-y divide-white/[0.04]">
                      {items.map((it) => (
                        <div key={it.n} className="flex flex-wrap items-center gap-2 px-4 py-2 text-[13px]">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-400/10 font-mono text-[10.5px] font-bold text-emerald-300">{it.n}</span>
                          <span className="min-w-0 flex-1 text-zinc-200">{it.texto}</span>
                          {it.condicional && <Badge tone="amber">{it.condicional}</Badge>}
                          <Badge tone={it.tipo === "Múltiple" ? "sky" : it.tipo === "Escala 0–10" ? "rose" : "zinc"}>{it.tipo}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-zinc-600">
            Limitación registrada (§8.5): la lógica de salto no impidió que 162 casos completaran a la vez las ramas de cultivo y no cultivo; 150 fueron reclasificados con reglas reproducibles (§14.4) y el resto se excluyó.
          </p>
        </Card>
      </FadeIn>
    </div>
  );
}
