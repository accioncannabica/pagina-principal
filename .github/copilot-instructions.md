# Instrucciones para Copilot

## Proyecto

SPA de frontend puro (React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS 4) que funciona como tablero institucional de la Asociación Civil Acción Cannábica. No hay backend, base de datos, variables de entorno ni linter. La app es un *shell* (`src/App.tsx`) que renderiza una sección de `src/sections/` según el estado `vista`, con datos locales en `src/data/`. La vista `observatorio` es una sub-aplicación fusionada que vive aparte en `src/observatorio/`.

Para entender el propósito, la arquitectura o los flujos, consulta [`docs/overview.md`](../docs/overview.md).

## Dónde cambiar cada cosa

- **Textos y datos institucionales** (organización, noticias, actividades, organizaciones, REPROCANN, FACC, productos, donaciones, contacto): `src/data/content.ts`.
- **Dataset analítico sintético y estadísticas**: `src/data/eda.ts`.
- **Nueva vista o cambio de una vista**: `src/sections/<Nombre>.tsx`. Para añadir una vista nueva hay que actualizar a la vez el tipo `Vista` y `NAV` en `src/types.ts`, el `switch` de `VistaActual` en `src/App.tsx` y, si hace falta un grupo nuevo, `GRUPOS` en `App.tsx` y el tipo `grupo` de `ItemNav`.
- **Componentes de UI reutilizables**: `src/components/ui.tsx`; **gráficos SVG**: `src/components/charts.tsx` (no se usa librería de gráficos).
- **Tema, colores y animaciones**: `@theme` y `@keyframes` en `src/index.css`.
- **Observatorio Global de Cannabis** (vista `observatorio`): todo en `src/observatorio/` (`ObservatorioPage.tsx`, `components/`, `data/`, `lib/`, `utils/`, `observatorio.css`). Datos en runtime en `public/data/`; respaldos en `src/observatorio/data/snapshots/`. Scripts en `scripts/observatorio/`, pruebas en `tests/observatorio/`, documentación en `docs/observatorio/`.

## Convenciones observables

- Código, identificadores y textos de interfaz en **español**.
- Estilos con clases utilitarias de Tailwind; combina clases con `cn()` de `src/utils/cn.ts`. Usa los colores del tema (`ink-*`, `lima-*`, `verde-*`, `cian-400`, `ambar-400`, `rose-400`, `violeta-400`).
- Componentes funcionales con hooks y props tipadas; secciones con `export default`, componentes de UI con exportaciones nombradas.
- Navegación por estado + hash de la URL; no hay librería de enrutado. El observatorio usa sub-rutas `#observatorio/<pestaña>`: la shell compara solo el primer segmento del hash y el observatorio cambia de pestaña con `history.replaceState`, nunca con `window.location.hash = …`.
- `VistaActual` se llama como función (`{VistaActual()}`), no como componente, para que las vistas con estado (observatorio) no se remonten en cada render de `App`.
- El código del observatorio mantiene su propio estilo (comillas simples, inglés/español mixto) y no debe usar selectores CSS globales: acota bajo `.observatorio-root` y usa `@reference "../index.css"` si necesitas `@apply` en un CSS propio. Los elementos `position: fixed` dentro del observatorio deben renderizarse con un portal (`createPortal` a `document.body`), porque el contenedor de la shell se anima con `transform`.
- TypeScript estricto (`noUnusedLocals`, `noUnusedParameters`). El alias `@/*` → `src/*` está configurado, pero el código actual usa rutas relativas.
- El contenido de demostración se marca con `demo: true` y se muestra con `DemoBadge`; mantén esa distinción entre dato real y demo.

## Comandos verificados

```bash
npm ci               # instalar dependencias
npm run dev          # desarrollo
npm run build        # genera dist/index.html (un único archivo)
npx tsc --noEmit     # verificación de tipos (no existe como script)
npm run test:observatorio            # pruebas node:test del observatorio (tests/observatorio/)
npm run observatorio:update-data     # actualiza instantánea de NYC Open Data (public/data y src/observatorio/data/snapshots)
npm run observatorio:update-literature   # actualiza literatura desde OpenAlex
npm run observatorio:validate-science    # valida el harness de ciencia
```

No existen scripts de lint ni pruebas para el resto de la app: no los inventes ni los documentes.

## Cuidados al modificar

- Mantén el contenido institucional verificable (fuentes citadas en la cabecera de `content.ts`); no inventes datos legales, normativos ni de la organización, y no presentes datos de demostración como reales.
- El formulario de contacto, la tienda y las donaciones son mockups sin red ni pago; no añadas integraciones reales sin pedirlo. La pestaña Contacto del observatorio solo abre un `mailto:`.
- En el observatorio no cambies contenido, cifras ni fuentes; mantén `null` para datos desconocidos y la distinción real / muestra / demo.
- Respeta `prefers-reduced-motion` al agregar animaciones.
- Las versiones de `package.json` están fijadas (sin `^`); no las cambies sin necesidad.
- El `.gitignore` excluye `node_modules` y `dist`.
