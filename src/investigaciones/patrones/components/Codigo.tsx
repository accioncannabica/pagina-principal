import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Copy, Check, FileCode2, Library, Filter } from "lucide-react";
import { Card, SectionHeader, Badge, FadeIn } from "./ui";
import { CODIGO } from "../data/research";
import { cn } from "../utils/cn";

const ETAPAS = ["Todas", "Datos", "Figuras", "Modelos"] as const;

export default function Codigo() {
  const [etapa, setEtapa] = useState<(typeof ETAPAS)[number]>("Todas");
  const [selId, setSelId] = useState("14.17");
  const [copiado, setCopiado] = useState(false);

  const visibles = CODIGO.filter((s) => etapa === "Todas" || s.etapa === etapa);
  const sel = CODIGO.find((s) => s.id === selId) ?? CODIGO[0];

  const libs = useMemo(() => {
    const m = new Map<string, number>();
    CODIGO.forEach((s) => s.libs.forEach((l) => m.set(l, (m.get(l) ?? 0) + 1)));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, []);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(sel.codigo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1600);
    } catch { /* portapapeles no disponible */ }
  };

  return (
    <div>
      <SectionHeader
        eyebrow="Anexo 14 · Código Python"
        title="Anexo de códigos: el pipeline, script por script"
        desc="Extractos fieles de los 22 scripts reproducibles del estudio (datos personales anonimizados). Todo el análisis se ejecutó con software open source, sin imputaciones y con doble verificación IA + manual."
        right={<Badge tone="sky"><Library size={12} /> {libs.map(([l]) => l).slice(0, 4).join(" · ")}</Badge>}
      />

      <div className="grid gap-4 xl:grid-cols-5">
        <FadeIn className="xl:col-span-2">
          <Card className="p-5">
            <div className="mb-4 flex flex-wrap gap-1.5">
              {ETAPAS.map((t) => (
                <button key={t} onClick={() => setEtapa(t)}
                  className={cn("rounded-lg px-2.5 py-1.5 text-xs font-medium transition",
                    etapa === t ? "bg-emerald-400 text-emerald-950" : "bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-200")}>
                  {t}
                </button>
              ))}
            </div>
            <div className="max-h-[540px] space-y-1.5 overflow-y-auto pr-1">
              {visibles.map((s) => {
                const on = sel.id === s.id;
                return (
                  <button key={s.id} onClick={() => setSelId(s.id)}
                    className={cn("flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition",
                      on ? "border-emerald-400/40 bg-emerald-400/[0.07]" : "border-white/[0.05] bg-white/[0.02] hover:border-white/[0.12]")}>
                    <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-[10px] font-bold",
                      on ? "bg-emerald-400 text-emerald-950" : "bg-white/[0.05] text-zinc-400")}>
                      {s.id}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium text-zinc-100">{s.titulo}</span>
                      <span className="block truncate font-mono text-[10px] text-zinc-600">{s.libs.join(", ")}</span>
                    </span>
                    <Badge tone={s.etapa === "Modelos" ? "amber" : s.etapa === "Figuras" ? "sky" : "emerald"}>{s.etapa}</Badge>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 border-t border-white/[0.06] pt-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Librerías utilizadas</p>
              <div className="flex flex-wrap gap-1.5">
                {libs.map(([l, n]) => (
                  <span key={l} className="rounded-md bg-white/[0.04] px-2 py-1 font-mono text-[10.5px] text-zinc-300">{l} <span className="text-zinc-600">×{n}</span></span>
                ))}
              </div>
            </div>
          </Card>
        </FadeIn>

        <FadeIn delay={0.08} className="xl:col-span-3">
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-white/[0.07] bg-white/[0.03] px-5 py-3">
              <FileCode2 size={16} className="text-emerald-300" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-zinc-100">§{sel.id} · {sel.titulo}</p>
                <p className="font-mono text-[10.5px] text-zinc-500">scripts/{sel.id.replace(".", "_")}.py · etapa {sel.etapa}</p>
              </div>
              <button onClick={copiar}
                className={cn("flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition",
                  copiado ? "bg-emerald-400 text-emerald-950" : "bg-white/[0.05] text-zinc-300 hover:bg-white/[0.1]")}>
                {copiado ? <Check size={13} /> : <Copy size={13} />} {copiado ? "Copiado" : "Copiar"}
              </button>
            </div>
            <div className="p-5">
              <p className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] p-3.5 text-[13px] leading-relaxed text-emerald-100/85">{sel.descripcion}</p>
              <AnimatePresence mode="wait">
                <motion.div key={sel.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.08] bg-[#070a08]">
                    <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-4 py-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                      <span className="ml-2 flex items-center gap-1.5 font-mono text-[10px] text-zinc-500"><Code2 size={11} /> python · extracto del Anexo 14</span>
                    </div>
                    <pre className="max-h-[430px] overflow-auto p-4 font-mono text-[12px] leading-relaxed text-zinc-300">
                      {sel.codigo.split("\n").map((linea, i) => (
                        <div key={i} className="flex">
                          <span className="w-8 shrink-0 select-none pr-3 text-right text-zinc-700">{i + 1}</span>
                          <code className={cn("whitespace-pre", linea.trim().startsWith("#") ? "text-zinc-500 italic" : "")}>{linea || " "}</code>
                        </div>
                      ))}
                    </pre>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
                <Filter size={12} className="text-zinc-600" />
                Flujo: los scripts de Datos alimentan a los de Figuras y Modelos; todos leen el mismo CSV depurado en Latin-1 y no lo modifican salvo 14.1–14.3 (documentado en sus docstrings).
              </div>
            </div>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}
