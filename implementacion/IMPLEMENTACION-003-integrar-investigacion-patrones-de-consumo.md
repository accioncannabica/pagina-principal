# Implementación 003 · Integrar investigación «Patrones de consumo»

## Resumen
- Se migró el micrositio `investigacion/` dentro del árbol principal como módulo encapsulado en `src/investigaciones/patrones/` con componentes, datos y estilos propios.
- Se reemplazó el placeholder de la vista `patrones` por el nuevo `PatronesPage`, incluyendo navegación interna, ticker, animaciones condicionadas por `prefers-reduced-motion` y sincronización de hash `#patrones/<subvista>`.
- Se añadieron instrucciones/documentación (README, overview, guías Codex/Copilot) y se eliminó la carpeta autónoma original.

## Cambios principales
- Copié y adapté los componentes del micrositio: `components/`, `data/research.ts`, `styles/patrones.css` (scoped con `.patrones-root`) y utilidades (`utils/cn.ts` reexportando el helper global).
- Reescribí `PatronesPage.tsx` para:
  - aceptar sección inicial y callback;
  - respetar `prefers-reduced-motion`;
  - actualizar el hash mediante `history.replaceState` sin interferir con la shell.
- Creé `sections/Patrones.tsx` para conectar el módulo con la aplicación principal y escuchar `hashchange`.
- Actualicé `src/App.tsx` y `src/types.ts` (nueva bajada, hash condicionado, importación de la vista real).
- Añadí `framer-motion@14.9.0` como dependencia exacta.
- Documenté la nueva vista en README, `docs/overview.md`, `docs/codex.md`, `.codex/instructions.md` y `.github/copilot-instructions.md`.
- Eliminé la carpeta autónoma `investigacion/` tras completar la migración.

## Validaciones
- `npx tsc --noEmit`
- `npm run build`

## Pendientes / Notas
- QA manual adicional: navegar todas las sub-secciones en `npm run dev` y revisar accesibilidad/tipografía.
- Considerar pruebas automatizadas para `PatronesPage` en una tarea futura si se extiende la vista.
