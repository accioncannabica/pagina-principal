import {
  ChartNoAxesCombined,
  ExternalLink,
  Gavel,
  Maximize2,
  Network,
  Scale,
} from "lucide-react";
import { Badge, Card, FadeIn, SectionHeader } from "./ui";

const PRESENTACION_URL =
  "https://docs.google.com/presentation/d/e/2PACX-1vSZll51rfsg8Tznh5JUMqpTtV5MHaiKMBpYjHfxbcZhHoMikJ9VYnv19JHkJHbYXw/pubembed?start=false&loop=false&delayms=15000";

const INTERROGANTES = [
  {
    icono: Scale,
    texto: "¿Existe una frontera clara entre el uso terapéutico y el uso recreativo del Cannabis?",
  },
  {
    icono: Network,
    texto: "¿Cuáles son los efectos percibidos por las personas que consumen Cannabis?",
  },
  {
    icono: ChartNoAxesCombined,
    texto: "¿A mayor frecuencia de consumo de Cannabis, mayores problemas asociados?",
  },
  {
    icono: Gavel,
    texto: "¿La problemática radica en las sustancias o en la Ley de Drogas y su aplicación por parte de la Justicia y la Policía?",
  },
] as const;

export default function Presentation() {
  return (
    <div>
      <SectionHeader
        eyebrow="Presentación de proyecto de investigación"
        title="Patrones de consumo de cannabis y percepciones de salud en usuarios y usuarias de Argentina y América Latina"
        right={
          <Badge tone="zinc">
            <Maximize2 size={12} /> Pantalla completa disponible
          </Badge>
        }
      />

      <FadeIn>
        <Card className="mb-6 overflow-hidden p-5 sm:p-7">
          <p className="font-display text-lg font-semibold uppercase leading-snug text-zinc-50">
            Grandes interrogantes de nuestra investigación:
          </p>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {INTERROGANTES.map(({ icono: Icono, texto }) => (
              <div
                key={texto}
                className="flex items-start gap-4 rounded-xl border border-lime-300/20 bg-lime-300/[0.04] p-4"
              >
                <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lime-300/10 text-lime-300">
                  <Icono size={21} />
                </span>
                <p className="text-sm font-medium leading-relaxed text-zinc-100 sm:text-base">{texto}</p>
              </div>
            ))}
          </div>
        </Card>
      </FadeIn>

      <FadeIn>
        <Card className="overflow-hidden">
          <div className="aspect-[960/569] w-full bg-black">
            <iframe
              src={PRESENTACION_URL}
              title="Cannabis, salud y soberanía"
              className="h-full w-full border-0"
              allowFullScreen
              allow="fullscreen"
              loading="lazy"
            />
          </div>
        </Card>
      </FadeIn>

      <div className="mt-4 flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
        <p className="text-xs leading-relaxed text-zinc-500">
          Usá los controles del reproductor para avanzar. También podés abrir la presentación en pantalla completa.
        </p>
        <a
          href={PRESENTACION_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-emerald-400/25 bg-emerald-400/10 px-3.5 py-2 text-sm font-medium text-emerald-200 transition hover:border-emerald-300/40 hover:bg-emerald-400/15"
        >
          Abrir presentación <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
