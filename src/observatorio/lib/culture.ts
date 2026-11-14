import type { CulturalEvent } from '../data/research';

export function eventStatus(event: CulturalEvent, now = new Date()) {
  if (!event.start || event.dateStatus !== 'confirmed') return 'Por confirmar';
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  if ((event.end || event.start) < today) return 'Edición pasada';
  if (event.start <= today) return 'En curso';
  return 'Próxima edición';
}