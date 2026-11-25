import { useMemo, useState } from "react";
import { BookMarked, Search } from "lucide-react";
import { Badge, Card, FadeIn, SectionHeader } from "./ui";
import { DICCIONARIO } from "../data/research";

export default function Variables() {
  const [busca, setBusca] = useState("");
  const variables = useMemo(
    () => DICCIONARIO.filter(
      (variable) =>
        variable.variable.toLowerCase().includes(busca.toLowerCase()) ||
        variable.definicion.toLowerCase().includes(busca.toLowerCase())
    ),
    [busca]
  );

  return (
    <div>
      <SectionHeader
        eyebrow="Anexo · 13.2"
        title="Diccionario de variables"
        desc="Definición, tipo y codificación de las variables derivadas del instrumento."
        right={
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar variable…"
              className="w-64 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-9 pr-3 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-emerald-400/50"
            />
          </div>
        }
      />

      <FadeIn>
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <BookMarked size={18} className="text-emerald-300" />
              <h3 className="font-display text-base font-semibold text-zinc-100">Variables del estudio</h3>
            </div>
            <Badge tone="zinc">{variables.length} variables</Badge>
          </div>
          <div className="max-h-[620px] overflow-auto pr-1">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="sticky top-0 bg-[#111713]">
                <tr className="border-b border-white/[0.07] text-[11px] uppercase tracking-wider text-zinc-500">
                  <th className="pb-3 pr-3 font-medium">Variable</th>
                  <th className="pb-3 pr-3 font-medium">Definición</th>
                  <th className="pb-3 pr-3 font-medium">Tipo</th>
                  <th className="pb-3 font-medium">Codificación</th>
                </tr>
              </thead>
              <tbody>
                {variables.map((variable) => (
                  <tr key={variable.variable} className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]">
                    <td className="py-2.5 pr-3 font-medium text-zinc-100">{variable.variable}</td>
                    <td className="py-2.5 pr-3 text-xs text-zinc-400">{variable.definicion}</td>
                    <td className="py-2.5 pr-3"><Badge tone="sky">{variable.tipo}</Badge></td>
                    <td className="py-2.5 font-mono text-[11px] text-zinc-400">{variable.codificacion}</td>
                  </tr>
                ))}
                {variables.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-sm text-zinc-500">
                      Sin variables para «{busca}».
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
}
