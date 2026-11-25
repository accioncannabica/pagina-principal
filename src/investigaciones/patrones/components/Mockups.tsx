import { ClipboardList, ExternalLink } from "lucide-react";
import { Card, SectionHeader } from "./ui";

const URL_ENCUESTA = "https://forms.gle/x2w37wpWeCJ1u7847";

export default function Mockups() {
  return (
    <div>
      <SectionHeader
        eyebrow="Instrumento · Encuesta"
        title="La encuesta online, tal como la respondieron 1.046 personas"
        desc="Mockup navegable del cuestionario autoadministrado (3.2, Anexo 13.1): anónimo, con preguntas cerradas y abiertas, validado en un piloto con 30 participantes y desplegado durante 21 meses. Completá las 5 preguntas clave y el sistema te asigna el perfil de clúster más cercano (5.3)."
      />

      <Card className="p-5 sm:p-7">
        <a
          href={URL_ENCUESTA}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
        >
          <ClipboardList size={16} />
          Completar la encuesta
          <ExternalLink size={14} />
        </a>
      </Card>
    </div>
  );
}
