/**
 * Espacio reservado para el logo de Acción Cannábica.
 * Reemplazar el contenido de este cuadro por la imagen oficial
 * (por ejemplo, importando un archivo desde /public y poniéndolo
 * dentro del <div> como <img className="h-full w-full object-contain" />).
 */
export default function LogoSlot({ className = '' }: { className?: string }) {
  return (
    <div
      className={
        'flex shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-emerald-400/40 bg-emerald-400/[0.05] text-emerald-300/70 ' +
        className
      }
      title="Espacio reservado para el logo de Acción Cannábica"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="3" y="4" width="18" height="16" rx="2.5" />
        <circle cx="9" cy="10" r="1.6" />
        <path d="M4.5 17.5 L10 12.5 L14 16 L16.5 13.5 L19.5 16.5" />
      </svg>
      <span className="text-[9px] font-semibold uppercase tracking-[0.18em]">Logo</span>
    </div>
  );
}
