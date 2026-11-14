# Instrucciones para Codex

Guía operativa para trabajar con Codex CLI en `pagina-principal`.

## Proyecto

SPA de frontend puro (React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS 4) que funciona como tablero institucional de la Asociación Civil Acción Cannábica. La shell vive en `src/App.tsx`, renderiza vistas de `src/sections/` según el estado `vista` y usa datos locales en `src/data/`. La vista `observatorio` es una sub-app con stack propio en `src/observatorio/` y datos cargados en runtime desde `public/data/`.

Para entender propósito, arquitectura y flujos, revisar `docs/overview.md` antes de tocar código.

## Dónde cambiar cada cosa

- **Textos y datos institucionales**: `src/data/content.ts`.
- **Dataset analítico sintético y estadísticas**: `src/data/eda.ts`.
- **Nueva vista o cambio de vista**: `src/sections/<Nombre>.tsx`. Al añadir vistas, actualizar también `Vista` y `NAV` en `src/types.ts`, el `switch` de `VistaActual` en `src/App.tsx` y, si se crean grupos nuevos, `GRUPOS` en `App.tsx` y el tipo `grupo` de `ItemNav`.
- **Componentes reutilizables**: `src/components/ui.tsx`; **gráficos SVG**: `src/components/charts.tsx`.
- **Tema, colores y animaciones**: `@theme` y `@keyframes` en `src/index.css`.
- **Observatorio Global de Cannabis**: código en `src/observatorio/` (`ObservatorioPage.tsx`, `components/`, `data/`, `lib/`, `utils/`, `observatorio.css`), datos runtime en `public/data/`, snapshots en `src/observatorio/data/snapshots/`, scripts en `scripts/observatorio/`, pruebas en `tests/observatorio/` y documentación en `docs/observatorio/`.

## Convenciones observables

- Código, identificadores y textos de interfaz en español.
- Tailwind utilitario combinado con `cn()` (`src/utils/cn.ts`). Usa la paleta (`ink-*`, `lima-*`, `verde-*`, `cian-400`, `ambar-400`, `rose-400`, `violeta-400`) y respeta `prefers-reduced-motion`.
- Componentes funcionales con hooks y props tipadas; vistas con `export default`; componentes de UI con exportaciones nombradas.
- Navegación por estado + hash (`window.location.hash`). La shell invoca `VistaActual()` como función para evitar remontar la vista observatorio.
- Observatorio mantiene su estilo propio (comillas simples, inglés/español mixto). Scope CSS bajo `.observatorio-root` y usa portales (`createPortal`) para `position: fixed`.

## Flujo de trabajo recomendado

1. Abrir issue en GitHub (`accioncannabica/pagina-principal`) con problema, alcance y criterios.
2. Redactar plan en `plan/PLAN-00N-<nombre>.md` enlazando al issue y describiendo pasos verificables. No modificar código en el plan.
3. Tras acuerdo, implementar cambios siguiendo el plan. Validar con `npx tsc --noEmit` y `npm run build`. Referenciar el issue en el commit (`Closes #N`).

No hacer commits ni pushes desde Codex sin pedido explícito.

## Checklists para Codex

**Arranque de sesión**

1. `npm ci`
2. `npm run dev` (servidor local) o `npm run build` según necesidad
3. `npx tsc --noEmit`
4. `npm run test:observatorio`

**Antes de tocar observatorio**

1. Confirmar que los datos de `public/data/` están actualizados
2. Revisar scripts en `scripts/observatorio/` y doc `docs/observatorio/`
3. Ejecutar `npm run observatorio:validate-science` si se cambian fuentes/datasets

## Requisitos y herramientas

- Node.js 22.15.0 (documentado en `README.md`). Se incluye `.nvmrc` con esta versión para alinear entornos.
- npm 10.x compatible.
- Python 3.11+ con `requests`, `pandas` y `python-dotenv` para `scripts/observatorio/update-argentina-data.py` (ver doc en `docs/observatorio/` antes de correrlo).
- Acceso a internet para las APIs (OpenAlex, NYC Open Data, OpenStreetMap) usadas por los scripts.

## Comandos verificados

```bash
npm ci
npm run dev
npm run build
npm run preview
npx tsc --noEmit
npm run test:observatorio
npm run observatorio:update-data
npm run observatorio:update-literature
npm run observatorio:validate-science
```

No hay linter ni formateador configurado; no inventarlos.

## Cuidados

- Mantener la distinción entre contenido institucional real y datos de demostración (`demo: true`).
- No inventar datos legales, normativos ni de la organización; conservar citas en `src/data/content.ts`.
- Formulario de contacto, tienda y donaciones son mockups sin integración real: no agregar endpoints ni pasarelas.
- En observatorio, no modificar cifras ni fuentes sin validar contra la documentación y los scripts asociados.
- Respetar animaciones y accesibilidad (`prefers-reduced-motion`, uso de `aria-*`).

## Documentación clave

- `README.md`: resumen, scripts y requisitos.
- `docs/overview.md`: arquitectura, flujos, datasets.
- `docs/codex.md`: guía extendida para trabajar desde Codex CLI (checklist de inicialización, entorno y buenas prácticas).
- `.github/copilot-instructions.md`: referencia cruzada para mantener coherencia con Copilot.

