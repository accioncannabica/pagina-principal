import { useMemo, useState } from "react";
import { BookOpen, Search, Landmark, Wrench, BookMarked } from "lucide-react";
import { Card, SectionHeader, Badge, FadeIn } from "./ui";
import { GLOSARIO, BIBLIOGRAFIA, HERRAMIENTAS_FUENTE, NORMATIVAS } from "../data/research";
import { cn } from "../utils/cn";

export default function Referencias() {
  const [busca, setBusca] = useState("");
  const [soloGlosario, setSoloGlosario] = useState(false);

  const terminos = useMemo(
    () => GLOSARIO.filter((g) => g.termino.toLowerCase().includes(busca.toLowerCase()) || g.definicion.toLowerCase().includes(busca.toLowerCase())),
    [busca]
  );
  const biblio = useMemo(
    () => BIBLIOGRAFIA.filter((b) => b.cita.toLowerCase().includes(busca.toLowerCase()) || b.detalle.toLowerCase().includes(busca.toLowerCase())),
    [busca]
  );

  return (
    <div>
      <SectionHeader
        eyebrow="Anexos · §15–16"
        title="Glosario, bibliografía y fuentes"
        desc="Diccionario de términos del estudio, las 28 referencias bibliográficas, las fuentes de datos y herramientas open source, y las fuentes normativas recomendadas para el apartado de políticas de drogas."
        right={
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar término o referencia…"
              className="w-64 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-9 pr-3 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-emerald-400/50" />
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-5">
        <FadeIn className="xl:col-span-3">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookMarked size={18} className="text-emerald-300" />
                <h3 className="font-display text-base font-semibold text-zinc-100">Diccionario de términos (§15)</h3>
              </div>
              <Badge tone="zinc">{terminos.length} términos</Badge>
            </div>
            <div className="grid max-h-[560px] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
              {terminos.map((g) => (
                <div key={g.termino} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 transition-colors hover:border-emerald-400/20">
                  <p className="text-[13px] font-semibold text-emerald-200">{g.termino}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-zinc-400">{g.definicion}</p>
                </div>
              ))}
              {terminos.length === 0 && <p className="text-sm text-zinc-500">Sin términos para «{busca}».</p>}
            </div>
          </Card>
        </FadeIn>

        <div className="space-y-4 xl:col-span-2">
          {!soloGlosario && (
            <>
              <FadeIn delay={0.06}>
                <Card className="p-5">
                  <div className="mb-3 flex items-center gap-2.5">
                    <BookOpen size={17} className="text-sky-300" />
                    <h3 className="font-display text-base font-semibold text-zinc-100">Bibliografía (§16.1)</h3>
                    <Badge tone="zinc">{biblio.length}</Badge>
                  </div>
                  <div className="max-h-[330px] space-y-2 overflow-y-auto pr-1">
                    {biblio.map((b, i) => (
                      <div key={b.cita} className="flex gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.02]">
                        <span className="font-mono text-[10px] leading-5 text-zinc-600">{String(i + 1).padStart(2, "0")}</span>
                        <p className="text-[12px] leading-snug text-zinc-400">
                          <span className="font-semibold text-zinc-200">{b.cita}.</span> {b.detalle}
                        </p>
                      </div>
                    ))}
                    {biblio.length === 0 && <p className="text-sm text-zinc-500">Sin referencias para «{busca}».</p>}
                  </div>
                </Card>
              </FadeIn>

              <FadeIn delay={0.1}>
                <Card className="p-5">
                  <div className="mb-3 flex items-center gap-2.5">
                    <Wrench size={16} className="text-amber-300" />
                    <h3 className="font-display text-base font-semibold text-zinc-100">Fuentes de datos y herramientas (§16.2)</h3>
                  </div>
                  <div className="space-y-2">
                    {HERRAMIENTAS_FUENTE.map((h) => (
                      <div key={h.cita} className="flex justify-between gap-3 border-b border-white/[0.05] pb-2 text-[12.5px]">
                        <span className="font-medium text-zinc-200">{h.cita}</span>
                        <span className="text-right text-zinc-500">{h.detalle}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </FadeIn>
            </>
          )}

          <FadeIn delay={0.14}>
            <Card className="p-5">
              <div className="mb-3 flex items-center gap-2.5">
                <Landmark size={16} className="text-rose-300" />
                <h3 className="font-display text-base font-semibold text-zinc-100">Fuentes normativas (§16.3)</h3>
              </div>
              <div className="space-y-2.5">
                {NORMATIVAS.map((n) => (
                  <div key={n.cita} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                    <p className="text-[13px] font-semibold text-zinc-100">{n.cita}</p>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-zinc-500">{n.detalle}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setSoloGlosario(!soloGlosario)}
                className={cn("mt-4 w-full rounded-xl border py-2.5 text-xs font-medium transition",
                  soloGlosario ? "border-emerald-400/40 bg-emerald-400/[0.08] text-emerald-200" : "border-white/[0.08] bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]")}>
                {soloGlosario ? "Mostrar bibliografía y fuentes" : "Ver solo el glosario a pantalla completa"}
              </button>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
