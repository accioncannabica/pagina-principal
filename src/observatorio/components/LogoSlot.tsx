import logoAccionCannabica from '../../assets/logo-accion-cannabica.png';

export default function LogoSlot({ className = '' }: { className?: string }) {
  return (
    <img
      src={logoAccionCannabica}
      alt="Acción Cannábica"
      className={'shrink-0 rounded-2xl object-contain ' + className}
    />
  );
}
