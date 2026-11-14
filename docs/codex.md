# Guía Codex CLI

Instrucciones extendidas para trabajar con este repositorio usando Codex CLI.

## 1. Requisitos locales

- Node.js 22.15.0 (`nvm use` lee la versión desde `.nvmrc`).
- npm 10.x compatible con esa versión de Node.
- Python 3.11 o superior con los paquetes `requests`, `pandas` y `python-dotenv` para los scripts en `scripts/observatorio/`.
- Acceso a internet cuando se ejecutan scripts que consultan APIs externas (OpenAlex, NYC Open Data, OpenStreetMap tiles).

## 2. Inicialización rápida

1. Clonar el repositorio y situarse en la raíz.
2. `nvm use` (o ajustar la versión de Node manualmente).
3. `npm ci`
4. `npx tsc --noEmit`
5. `npm run build`
6. `npm run test:observatorio`

Los pasos 4-6 ayudan a detectar incompatibilidades locales antes de realizar cambios.

## 3. Ciclo de trabajo recomendado

1. Crear/consultar el issue correspondiente en GitHub.
2. Elaborar un plan en `plan/PLAN-00N-<nombre>.md` describiendo análisis, decisiones y pasos verificables.
3. Ejecutar la implementación siguiendo el plan y validarla con `npx tsc --noEmit`, `npm run build` y, si aplica, pruebas o scripts específicos.
4. Preparar el commit referenciando el issue (`Closes #N`).

El workflow evita cambios sin contexto y mantiene la trazabilidad.

## 4. Observatorio Global de Cannabis

- Código en `src/observatorio/`; documentación en `docs/observatorio/`.
- Datos runtime en `public/data/` y snapshots en `src/observatorio/data/snapshots/`.
- Scripts de actualización:
  - `npm run observatorio:update-data`
  - `npm run observatorio:update-literature`
  - `npm run observatorio:validate-science`
- Script Python adicional: `scripts/observatorio/update-argentina-data.py` (requiere el entorno descrito arriba).
- Antes de tocar datasets, sincronizar snapshots y ejecutar `npm run observatorio:validate-science`.

## 5. Checklists rápidos

**Antes de abrir PR:**

- [ ] `npx tsc --noEmit`
- [ ] `npm run build`
- [ ] `npm run test:observatorio` (si se toca el observatorio o sus dependencias)
- [ ] Documentación actualizada (`README.md`, `docs/` o archivos específicos)

**Si se añaden vistas nuevas:**

- [ ] Actualizar `Vista` y `NAV` en `src/types.ts`
- [ ] Ajustar `VistaActual` y `GRUPOS` en `src/App.tsx`
- [ ] Añadir componente en `src/sections/`
- [ ] Revisar textos/datos en `src/data/*`

## 6. Referencias complementarias

- `.codex/instructions.md`: resumen operativo y matrices de responsabilidades.
- `.github/copilot-instructions.md`: mantener sincronía con las pautas de Copilot.
- `docs/overview.md`: arquitectura completa de la aplicación y del observatorio.

Mantén la distinción entre contenido real y demo (`demo: true`), respeta la accesibilidad (`prefers-reduced-motion`, atributos `aria-`) y evita introducir integraciones reales en secciones definidas como mockups.

