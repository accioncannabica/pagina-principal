# ISSUE-002: Incorporar el Observatorio Global de Cannabis a la página principal

- **Estado:** abierto
- **Tipo:** nueva funcionalidad (integración de un proyecto existente)
- **Prioridad:** alta
- **Siguiente paso:** análisis y plan técnico (`plan/PLAN-002-...`) por parte de un planificador técnico

## Contexto

Existe un proyecto independiente, el **Observatorio Global de Cannabis** ("Acción Cannábica · Observatorio Global del Cannabis"), desarrollado aparte con el mismo stack base que esta página (React 19 + TypeScript 5.9 + Vite 7 + Tailwind 4 + `vite-plugin-singlefile`). Se copió completo en la carpeta [`global-cannabis-usage-dashboard/`](../global-cannabis-usage-dashboard) de este repositorio (el original sigue en `C:\Proyectos\Horacio\global-cannabis-usage-dashboard`).

La carpeta copiada **no está integrada**: es un proyecto autónomo (tiene su propio `package.json`, `vite.config.ts`, `index.html`, `node_modules/` y sus pruebas) y hoy aparece sin seguimiento en git (`??`).

En la página principal ya existe el lugar donde debe ir: la vista `observatorio` ("Observatorio Global de Cannabis", grupo `Observatorio`, ícono `globe`) en [`src/types.ts`](../src/types.ts), que hoy renderiza un placeholder `EnConstruccion` en [`src/App.tsx`](../src/App.tsx) (`case "observatorio"`).

## Objetivo

Que al entrar en la sección **Observatorio Global de Cannabis** del menú lateral se muestre el observatorio completo y funcional, integrado en el *shell* de la página principal (menú, buscador, pie, estilos y navegación), reemplazando el placeholder, sin perder funcionalidad ni trazabilidad de datos del proyecto original.

## Qué contiene `global-cannabis-usage-dashboard/`

### Aplicación (`src/`, ~36 archivos TS/TSX, ~440 KB de código)

Es una SPA con **14 pestañas** controladas por estado + hash (`TABS` en `src/App.tsx`, que es un archivo monolítico de ~1.200 líneas):

| Pestaña (`key`) | Contenido |
| --- | --- |
| `panorama` | Mapa mundial (`WorldMap`), KPIs, filtros por región y marco legal, ficha de país (`CountryPanel`) |
| `territorio` | Atlas territorial con mapas Leaflet, gradiente y calor (`TerritoryView`, datos NYC y Argentina) |
| `uso` | Formas de uso (fumado, vapeo, comestibles, aceite, hash, té) |
| `penal` | Marcos penales y policiales |
| `gasto` | Gasto judicial (costos con moneda y año, Argentina, escenario alemán) (`JusticeView`) |
| `mercado` | Cáñamo, comercio y precios (`MarketCharts`) |
| `cultura` | Cultura, encuentros y congresos científicos (`CultureView`, `EvidenceMap`) |
| `tendencias` | Evolución y tendencias (`trends.ts`, `EcoCharts`) |
| `redes` | ONGs y formación |
| `investigacion` | Investigación publicada vía OpenAlex (`LiteratureView`) |
| `eda` | Laboratorio EDA: cálculo, filtros e importación de CSV local (`EdaView`) |
| `diccionario` | Diccionario de términos |
| `fuentes` | Fuentes, actualización, validación y catálogo configurable (`SourcesView`) |
| `contacto` | Aportes al observatorio por correo (`ContactView`) |

Estructura:

- `src/components/`: 15 componentes de vista y gráficos (`charts.tsx`, `EcoCharts.tsx`, `MarketCharts.tsx`, `WorldMap.tsx`, `TerritoryView.tsx`, `EvidenceMap.tsx`, `ui.tsx`, `ResearchUI.tsx`, `LogoSlot.tsx`, etc.).
- `src/data/`: datos tipados (`countries.ts`, `ecosystem.ts`, `justiceEvidence.ts`, `market.ts`, `research.ts`, `science.ts`, `trends.ts`) e instantáneas JSON (`snapshots/arg-justice.json`, `literature.json`, `nyc.json`).
- `src/lib/`: lógica (`openData.ts` con validación del catálogo y refresco cada 15 min, `openAlex.ts`, `nyc.ts`, `literature.ts`, `territory.ts`, `eda.ts`, `exports.ts`, `assets.ts`, `culture.ts`).
- `src/index.css`: clases propias (`research-*`, `territory-map`, estilos de Leaflet) y reglas globales.

### Datos estáticos (`public/data/`, ~970 KB)

`observatorio.json` (catálogo publicable, hoy con arreglos vacíos), `arg-justice-snapshot.json`, `literature-snapshot.json`, `nyc-snapshot.json` (duplicados de `src/data/snapshots/`) y las geometrías `world.geojson`, `arg-provinces.geojson`, `nyc-boroughs.geojson`, que **solo** existen en `public/`.

### Scripts, pruebas y documentación

- `scripts/`: `update-open-data.ts` (NYC), `update-literature.ts` (OpenAlex), `update-argentina-data.py` (SNEEP/Georef, Python), `validate-science-harness.ts`.
- `tests/`: 3 archivos de pruebas unitarias con `node:test` (`argentina`, `science`, `statistics`) y 13 pruebas Playwright en `tests/browser/observatory.spec.ts` (`playwright.config.ts`, puerto 4173).
- `specs/science-congresses.spec.md`, `skills/evidence-maps/SKILL.md`, `harness/science-evidence.harness.json`, `mockups/science-evidence.svg`: especificación, skill y *harness* de desarrollo del propio observatorio.
- `DATOS_ABIERTOS.md` y `FUENTES_JUSTICIA.md`: documentación de la actualización de datos, esquema del catálogo y evidencia judicial.
- `package.json` del observatorio.

### Dependencias que la página principal no tiene

| Paquete | Uso | Tipo |
| --- | --- | --- |
| `leaflet` (+ `@types/leaflet`) | Mapas territoriales y de evidencia | runtime |
| `recharts` | Gráficos | runtime |
| `lucide-react` | Íconos | runtime |
| `papaparse` (+ `@types/papaparse`) | Importar/exportar CSV (EDA, exportaciones) | runtime |
| `@playwright/test` | Pruebas de navegador | dev |
| `tsx` | Ejecutar scripts TS y, probablemente, las pruebas `node:test` | dev |

Las demás dependencias (React, Vite, Tailwind, `clsx`, `tailwind-merge`, etc.) coinciden en versión con la página principal. El observatorio usa rangos `^` y la página principal fija versiones exactas.

## Idea de la integración

Convertir el observatorio en **una sección más** de la página principal (`observatorio`), no en un sitio aparte ni en un `iframe`. El contenido de las 14 pestañas se mantiene; lo que cambia es dónde vive el código, cómo se navega y cómo se estiliza para convivir con el *shell* existente.

Lo que el planificador debe resolver (hay decisiones abiertas, ver más abajo):

1. **Ubicación y aislamiento del código.** El observatorio comparte nombres de archivo con la página principal (`src/App.tsx`, `src/main.tsx`, `src/index.css`, `src/components/ui.tsx`, `src/components/charts.tsx`, `src/utils/cn.ts`). No se puede copiar encima de `src/`. Debe vivir en un subárbol propio (por ejemplo `src/observatorio/`) y exponer un único componente de entrada (`export default`) que consuma `src/App.tsx` en `case "observatorio"`. El `App.tsx` del observatorio no es un *shell*: hay que convertirlo en la vista contenedora de sus pestañas (y conviene partirlo, ya que es un archivo de ~1.200 líneas).
2. **Navegación y hash.** La página principal usa `#<vista>` y solo lee el hash al cargar; el observatorio hace `history.replaceState` con `#<pestaña>` y escucha `hashchange`. Si se dejan así, ambos se pisan (por ejemplo `#panorama` no es una vista válida de la página principal y caería en `inicio`). Hay que definir un esquema de sub-rutas (por ejemplo `#observatorio/panorama`) y adaptar la validación del hash de `App.tsx`, el observatorio y el tipo `Vista` si hace falta.
3. **Estilos.** El observatorio usa la paleta estándar de Tailwind (`emerald`, `slate`, `bg-white/[0.035]`) y clases globales propias; la página principal usa tokens de tema (`ink-*`, `lima-*`, `verde-*`, etc.) definidos con `@theme`. Debe verse coherente con el resto del sitio, y las reglas globales del observatorio (`:focus-visible`, `button { cursor }`, `html { scroll-behavior }`, `color-scheme`, `.leaflet-*`) no deben alterar las demás secciones. Respetar `prefers-reduced-motion`.
4. **Elementos duplicados con el *shell*.** El observatorio trae su propio encabezado (título, `LogoSlot` placeholder), pie y una pestaña `contacto` (correo, Instagram, formulario `mailto:`) que se solapan con el *shell* y con la sección `Contacto` de la página principal. Decidir qué se conserva, qué se quita y qué se enlaza a `contacto`.
5. **Datos y *build*.** La página principal se compila con `vite-plugin-singlefile` y genera un único `dist/index.html`. El observatorio, en cambio, hace `fetch` en tiempo de ejecución a `data/observatorio.json` (vía `localDataUrl` + `document.baseURI`) y carga `world.geojson`, `arg-provinces.geojson` y `nyc-boroughs.geojson` desde `public/data/`. En un único HTML esos archivos **no existen**. Hay que elegir: incrustar los datos (importarlos y mantenerlos en el bundle), publicar `dist/data/` junto al HTML o cambiar el esquema de *build*. Eliminar la duplicación `public/data/*-snapshot.json` ↔ `src/data/snapshots/*.json` o mantenerla de forma controlada por los scripts de actualización.
6. **Red y recursos externos.** El observatorio consulta OpenAlex y NYC Open Data, usa teselas de OpenStreetMap, guarda cachés en `localStorage` (`ac-literature-v1`, `ac-feed-url`, entre otras) y permite configurar una URL de catálogo. Hoy la documentación de la página principal afirma que no hay llamadas de red ni persistencia. Hay que mantener el comportamiento de contingencia del observatorio (si falla la red, se conserva la última instantánea válida) y **actualizar la documentación** ([`docs/overview.md`](../docs/overview.md) y [`.github/copilot-instructions.md`](../.github/copilot-instructions.md)).
7. **Dependencias.** Agregar las dependencias de la tabla al `package.json` de la raíz, **con versión exacta** (convención del repositorio) y actualizar `package-lock.json`. Evaluar el impacto de `recharts` y `leaflet` en el tamaño del HTML único (y si los mapas pueden cargarse de forma diferida; con `singlefile` el *code splitting* queda incrustado).
8. **Scripts, pruebas y documentos del observatorio.** Decidir cuáles se llevan a la raíz y dónde: `scripts/` (`update-*.ts`, `update-argentina-data.py`), `tests/` (unitarias y Playwright) y la documentación (`DATOS_ABIERTOS.md`, `FUENTES_JUSTICIA.md`, `specs/`, `skills/`, `harness/`, `mockups/`). La página principal hoy no tiene scripts de test ni linter; agregarlos implica definirlos explícitamente (no existen scripts `test` en ninguno de los dos `package.json`). `DATOS_ABIERTOS.md` menciona un *workflow* `.github/workflows/open-data.yml` que **no está** en la copia; decidir si se crea.
9. **Limpieza de la carpeta copiada.** Una vez integrado el código, `global-cannabis-usage-dashboard/` no debe quedar como proyecto duplicado ni versionarse con su `node_modules/`. El repositorio no tiene `.gitignore`: definir cómo evitar que `node_modules/` y `dist/` (de ambas carpetas) entren al control de versiones.

## Alcance

**Incluye**

- Reemplazar el placeholder de `observatorio` por el observatorio funcional con sus 14 pestañas (o las que se decidan conservar, justificando las que se quiten).
- Integración visual, de navegación y de *build* con la página principal.
- Dependencias, datos estáticos y scripts de actualización necesarios para que funcione igual que el original.
- Pruebas del observatorio funcionando en su nueva ubicación (al menos las unitarias y las de navegador que sigan aplicando).
- Actualización de la documentación del repositorio afectada.

**No incluye**

- Cambiar el contenido, las cifras o las fuentes del observatorio (no inventar datos; mantener `null` como desconocido y la distinción entre dato real, muestra y demostración).
- Rediseñar el observatorio más allá de lo necesario para que sea coherente con el *shell*.
- Tocar las secciones ocultas por [ISSUE-001](./ISSUE-001-ocultar-secciones-no-publicadas.md) (`harness`, `tienda`, `donaciones`) ni la vista `patrones` (sigue como `EnConstruccion`).
- Integraciones nuevas (pasarelas de pago, envío real de formularios, backend).

## Requisitos funcionales

- RF-1: al abrir la vista `observatorio` se muestra el observatorio y no el placeholder `EnConstruccion`.
- RF-2: las pestañas del observatorio funcionan como en el original (filtros, mapas, EDA con importación de CSV, exportaciones, validación y refresco de datos abiertos, caché y contingencia ante fallos de red).
- RF-3: las URL con hash son estables: abrir `#observatorio` muestra la vista; el esquema de sub-rutas permite compartir una pestaña concreta y funciona con los botones atrás/adelante del navegador, sin romper la validación de hash de las demás secciones.
- RF-4: el resto de las secciones (incluido el buscador, el menú y el pie) se comportan igual que antes y no heredan estilos del observatorio.
- RF-5: en móvil y escritorio no hay desbordes horizontales (el original ya lo verifica en una prueba).
- RF-6: los datos del observatorio están disponibles en el *build* de producción sin depender de rutas que el HTML único no incluye (o el esquema de publicación elegido lo garantiza).
- RF-7: se conservan los avisos metodológicos y de privacidad del original (cobertura, no auditado, solo agregados, sin datos personales).

## Criterios de aceptación

- [ ] `npm ci`, `npx tsc --noEmit` y `npm run build` terminan sin errores en la raíz.
- [ ] Con `npm run dev`, la sección "Observatorio Global de Cannabis" muestra el observatorio y todas sus pestañas cargan sin errores de consola.
- [ ] Los mapas (mundial, territorial, de evidencia) cargan con sus geometrías en desarrollo y en el *build* de producción.
- [ ] Un hash de pestaña (`#observatorio/...` o el esquema elegido) abre la pestaña correcta, y un hash inválido cae en la portada de la sección o en `inicio` sin errores.
- [ ] El menú, el buscador, el pie y las demás secciones funcionan igual; no hay estilos globales del observatorio filtrados a ellas.
- [ ] Sin conexión (o con las APIs caídas) el observatorio usa las instantáneas incluidas y lo informa.
- [ ] Las pruebas unitarias y de navegador del observatorio pasan desde su nueva ubicación.
- [ ] La documentación de la raíz (`docs/overview.md`, `.github/copilot-instructions.md`) refleja la nueva sección, las dependencias, la red/`localStorage` y los comandos reales.
- [ ] `global-cannabis-usage-dashboard/` ya no queda duplicando código; `node_modules/` y `dist/` no se versionan.

## Archivos probablemente afectados

- `src/types.ts` (vista `observatorio`, posible ajuste de grupo/sub-rutas)
- `src/App.tsx` (render de la nueva sección y validación de hash)
- `src/index.css` (estilos y reglas del observatorio, sin filtrado global)
- `src/observatorio/**` (nuevo; código migrado de `global-cannabis-usage-dashboard/src/`)
- `package.json`, `package-lock.json` (nuevas dependencias exactas, scripts)
- `vite.config.ts` y estrategia de datos estáticos (`public/data/` o importaciones)
- `scripts/`, `tests/` (nuevos, migrados)
- `docs/overview.md`, `.github/copilot-instructions.md`
- `.gitignore` (nuevo, si se decide)
- `global-cannabis-usage-dashboard/` (se retira o se reduce tras la migración)

## Decisiones abiertas (para confirmar antes o durante la planificación)

1. Esquema de sub-rutas para las pestañas del observatorio.
2. Cómo servir los GeoJSON y el catálogo: incrustados en el bundle, `dist/data/` publicado junto al HTML, o *build* sin `singlefile`.
3. Qué hacer con la pestaña `contacto` y el encabezado/pie propios del observatorio (unificar con el *shell* vs conservar).
4. Si se mantienen los scripts de actualización y el *workflow* de GitHub Actions mencionado en `DATOS_ABIERTOS.md`.
5. Qué documentos de desarrollo del observatorio (`specs/`, `skills/`, `harness/`, `mockups/`) se conservan y dónde (por ejemplo bajo `docs/observatorio/`).
6. Si se parte `src/App.tsx` del observatorio en un archivo por pestaña (recomendado) como parte de esta tarea o en una posterior.

## Riesgos

- **Tamaño del HTML único** al sumar `recharts`, `leaflet` y ~1 MB de datos.
- **Conflicto de hash y de estilos globales** entre el *shell* y el observatorio.
- **Dependencia de red** (OpenAlex, NYC Open Data, OSM) en una página que hasta ahora no la tenía.
- **Colisión de nombres** de archivos si se copia sin aislar en un subárbol.
- **Versionado accidental** de `node_modules/` por falta de `.gitignore`.

## Instrucciones para la IA / planificador

1. Leer este issue completo y revisar la carpeta [`global-cannabis-usage-dashboard/`](../global-cannabis-usage-dashboard) (en especial `src/App.tsx`, `src/lib/openData.ts`, `src/lib/assets.ts`, `src/index.css`, `DATOS_ABIERTOS.md` y `tests/`) y [`docs/overview.md`](../docs/overview.md) antes de planificar.
2. Producir `plan/PLAN-002-incorporar-observatorio-global-cannabis.md` con el mismo formato que [`PLAN-001`](../plan/PLAN-001-ocultar-secciones-no-publicadas.md): análisis del estado actual, decisiones (resolviendo o proponiendo una opción para cada decisión abierta), pasos ordenados y verificables, y validación.
3. Convenciones obligatorias de la página principal: textos e identificadores en español, versiones exactas en `package.json`, colores del tema, `export default` en secciones, `prefers-reduced-motion`, y datos de demostración marcados con `demo`.
4. No inventar comandos ni scripts de test/lint que no existan; si se agregan, definirlos explícitamente en el plan.
5. No modificar contenido ni cifras del observatorio. No añadir integraciones reales de pago o envío.
6. Validar con `npx tsc --noEmit` y `npm run build`, y verificar a mano los criterios de aceptación con `npm run dev`.
