import { ClipboardList, ExternalLink } from "lucide-react";
import { Card, SectionHeader } from "./ui";

const URL_ENCUESTA = "https://forms.gle/x2w37wpWeCJ1u7847";

export default function Mockups() {
  return (
    <div>
      <SectionHeader
        eyebrow="Instrumento · Encuesta"
        title="Encuesta Online"
        desc="Queremos conocer tu experiencia. Invitamos a usuarios y usuarias de cannabis a completar esta encuesta anónima y aportar una mirada propia sobre sus consumos, prácticas y necesidades."
      />

      <Card className="relative overflow-hidden border-emerald-400/20 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.18),transparent_42%)] p-5 sm:p-7">
        <div className="mb-5 max-w-xl">
          <p className="text-lg font-semibold text-zinc-50">
            Tu participación ayuda a construir información más representativa.
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
            Respondé con total libertad y privacidad. Solo lleva unos minutos.
          </p>
        </div>
        <a
          href={URL_ENCUESTA}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-emerald-950 shadow-[0_10px_30px_-12px_rgba(52,211,153,0.75)] transition hover:-translate-y-0.5 hover:bg-emerald-300 hover:shadow-[0_14px_34px_-12px_rgba(52,211,153,0.9)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300 motion-reduce:transform-none"
        >
          <ClipboardList size={16} />
          Quiero completar la encuesta
          <ExternalLink size={14} />
        </a>
      </Card>
    </div>
  );
}
