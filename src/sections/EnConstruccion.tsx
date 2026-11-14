import { Badge, Icon, Panel, Reveal } from "../components/ui";

export default function EnConstruccion({ titulo }: { titulo: string }) {
  return (
    <Reveal>
      <Panel className="mx-auto flex max-w-2xl flex-col items-center gap-4 p-12 text-center" hover={false}>
        <span className="grid h-14 w-14 place-items-center rounded-2xl border border-lima-500/40 bg-lima-500/10 text-lima-300">
          <Icon name="flask" className="h-7 w-7" />
        </span>
        <Badge tone="ambar">{titulo}</Badge>
        <h2 className="text-2xl font-semibold tracking-tight text-white">Work In Progress</h2>
        <p className="text-xs leading-relaxed text-emerald-50/55">Estamos trabajando en esta sección. Muy pronto vas a poder consultarla.</p>
      </Panel>
    </Reveal>
  );
}
