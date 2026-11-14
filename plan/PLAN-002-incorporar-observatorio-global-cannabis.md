# PLAN-002: Incorporar el Observatorio Global de Cannabis

Issue de referencia: [ISSUE-002-incorporar-observatorio-global-cannabis.md](../Issues/ISSUE-002-incorporar-observatorio-global-cannabis.md)

> **Estado de implementación (2026-11-14):** Fases 1 y 2 aplicadas en el árbol de trabajo (sin commit) con los valores recomendados: D-1 sub-rutas `#observatorio/<pestaña>`, D-3 bloque de identidad conservado, D-4/D-5 scripts y docs movidos, D-11 `.gitignore` creado. D-10 aplicado: la carpeta `global-cannabis-usage-dashboard/` se eliminó. Pendiente: D-6 (Fase 3, división por pestañas, no aplicada). Playwright queda fuera de alcance. Desviación respecto del plan: el `CountryDrawer` se renderiza en un portal (`createPortal` a `document.body`) porque el contenedor de la shell se anima con `transform` y rompe el `position: fixed`.

## 1. Objetivo

Fusionar el código TSX del proyecto `global-cannabis-usage-dashboard/` dentro del proyecto principal, de modo que la vista `observatorio` deje de mostrar el placeholder `EnConstruccion` y renderice el Observatorio Global de Cannabis completo (14 pestañas), sin cambiar su contenido, cifras ni fuentes.

### Principio de la fusión
- Ambos proyectos usan el mismo stack (React 19.2.6, TypeScript 5.9.3, Vite 7.3.2, Tailwind 4.1.17). Por eso la incorporación es una **fusión de código fuente** dentro de `src/`: un solo `package.json`, un solo `vite.config.ts`, un solo `index.html`, un solo `tsconfig.json`.
- La carpeta temporal `global-cannabis-usage-dashboard/` desaparece al final.
- **Fuera de alcance:** la carpeta `dist/`, el plugin `vite-plugin-singlefile`, el tamaño del bundle y la forma de publicación. No se analizan ni se modifican. El único requisito de build es que `npm run build` siga pasando. Al publicar habrá una sola `dist/`, y eso no condiciona este trabajo.

Este plan no implementa código. Está escrito para que otra IA lo ejecute (ver sección 9).

## 2. Análisis del estado actual

### 2.1 Shell (`pagina-principal`)
- Dependencias con versión exacta (sin `^`). Scripts: solo `dev`, `build`, `preview`. No hay `test`, `lint` ni `typecheck`: se valida con `npx tsc --noEmit`.
- `tsconfig.json` de la shell y el del observatorio son **idénticos** (strict, `noUnusedLocals`, `noUnusedParameters`, alias `@/*`, `include: ["src", "vite.config.ts"]`). El código del observatorio ya cumple estas reglas.
- Estructura de `src/`: `components/`, `data/`, `sections/`, `utils/`, `App.tsx`, `index.css`, `main.tsx`, `types.ts`. Ya existen `components/`, `data/` y `utils/`, por lo que **copiar las carpetas del observatorio a `src/` causaría colisiones**: hay que usar un espacio de nombres propio, `src/observatorio/`.
- Los componentes del observatorio usan imports relativos. No hay imports con alias `@/`, así que se pueden mover sin reescribir rutas internas.
- No hay `public/` ni `.gitignore` en la raíz de la shell.
- Estado de git al momento de escribir este plan (hay trabajo previo sin commitear):
  - Modificados: `src/App.tsx` y `src/types.ts` (trabajo de ISSUE-001).
  - Sin trackear: `src/sections/EnConstruccion.tsx` (el placeholder que se reemplaza), `Notes.md`, `Issues/ISSUE-002-…`, `plan/PLAN-002-…`, `dist/`, `node_modules/`, `global-cannabis-usage-dashboard/`.
- Navegación: estado + hash, sin router. [src/App.tsx](../src/App.tsx):
  - Líneas 21-24: el hash se lee una sola vez al montar y se valida con `NAV_VISIBLE`.
  - Línea 30: `window.location.hash = vista` dentro de un `useEffect` sobre `vista`.
  - No hay listener de `hashchange`.
  - Alrededor de la línea 75: `case "observatorio": return <EnConstruccion titulo="Observatorio Global de Cannabis" />;`.
  - Línea 246: `<VistaActual />`. **`VistaActual` está definido dentro de `App`** (función creada en cada render). React lo trata como un tipo de componente nuevo en cada render y **remonta todo el subárbol** cada vez que `App` cambia de estado (por ejemplo al escribir en el buscador `q` o abrir el menú). Para secciones simples es inocuo; para el observatorio significa perder pestaña, filtros, datos cargados y reiniciar los `fetch`. Hay que corregirlo (ver 5.2).
  - Líneas 238-239: `<main>` con `<div className="mx-auto max-w-7xl">` que antepone un encabezado de página (`grupo / titulo` y un `<h1>` con `item.bajada`).
  - Línea 97: `<Fondo />` (fondo animado propio de la shell). Línea 169: contenido con `lg:pl-[268px]`. Header sticky `z-30`, sidebar `z-40`.
- [src/index.css](../src/index.css): `@theme` con tokens `ink-*`, `lima-*`, `verde-*`, `cian-400`, `ambar-400`, `rose-400`, `violeta-400`; `@layer base` con `color-scheme: dark`, `scroll-behavior: smooth`, estilos de `body` y scrollbar; bloque `prefers-reduced-motion` (línea 176).
- Documentación a actualizar: [docs/overview.md](../docs/overview.md) y `.github/copilot-instructions.md`.

### 2.2 Observatorio (`global-cannabis-usage-dashboard/`)
- Estructura de `src/`: `components/` (16 archivos), `data/` (7 `.ts` + `snapshots/` con 3 JSON), `lib/` (9 archivos), `utils/`, `App.tsx`, `index.css`, `main.tsx`, `vite-env.d.ts`.
- Dependencias que la shell **no tiene**: `leaflet`, `recharts`, `lucide-react`, `papaparse`, `@types/leaflet`, `@types/papaparse`; para tests: `tsx`. `react`, `react-dom`, `clsx`, `tailwind-merge`, `tailwindcss`, `vite` y `typescript` ya están en la shell con las mismas versiones (verificado para `clsx 2.1.1` y `tailwind-merge 3.4.0`).
- **Versiones exactas** (tomadas de `global-cannabis-usage-dashboard/package-lock.json`; el `node_modules` de la copia está casi vacío, no sirve `npm ls`): `leaflet 1.9.4`, `recharts 3.10.1`, `lucide-react 1.65.0`, `papaparse 5.7.0`, `@types/leaflet 1.9.22`, `@types/papaparse 5.5.2`, `tsx 4.23.15`.
- [App.tsx](../global-cannabis-usage-dashboard/src/App.tsx) (~1.200 líneas, monolito):
  - Líneas 57-72: `TABS` con 14 claves: `panorama`, `territorio`, `uso`, `penal`, `gasto`, `mercado`, `cultura`, `tendencias`, `redes`, `investigacion`, `eda`, `diccionario`, `fuentes`, `contacto`. Línea 73: `TabKey`.
  - Líneas 76-79: `tab` inicial desde `window.location.hash` (defecto `panorama`).
  - Línea 87: `extendedView`. Línea 88: `history.replaceState(null, '', '#' + tab)`. Líneas 93-100: listener de `hashchange`.
  - Estado compartido en `App`: `metric`, `regions`, `frameworks`, `year`, `selected`, `useOpenData(tab)` y derivados (`list`, `agg`, `point`, etc.).
  - Línea 212: wrapper raíz `min-h-screen bg-[#070b11] text-slate-100 antialiased` con un fondo decorativo `fixed inset-0` (blobs con blur, líneas 213-217).
  - Línea 220: contenedor `relative mx-auto max-w-[1420px] px-4 pb-16 pt-6`. Líneas 222+: `<header>` con `LogoSlot`, kicker, `<h1>` "Acción Cannábica", texto de personería jurídica (I.G.J. 1921803), bajada y datos.
  - Línea 372: `<nav>` con los 14 botones de pestaña. Línea 397: `FreshnessBar` con `onSources={() => setTab('fuentes')}`.
  - Línea 1113: `<footer>` con tres columnas: identidad/contacto, **Metodología y advertencias** y **Referencias y fuentes** (con `setTab('fuentes')` en la línea 1158). La columna de metodología es contenido del observatorio y no debe perderse.
  - Línea final: `CountryDrawer` (panel lateral, `fixed inset-0 z-50`).
- Hash: guarda `#panorama`, `#territorio`…, valores que no son `Vista` de la shell. **Conflicto con el hash de la shell** (ver 5.2).
  - Enlace interno extra: [CountryPanel.tsx](../global-cannabis-usage-dashboard/src/components/CountryPanel.tsx) línea 205: `<a href="#fuentes">`.
- Datos en runtime (se **conservan tal cual**, ver D-2):
  - [lib/assets.ts](../global-cannabis-usage-dashboard/src/lib/assets.ts): `localDataUrl(file)` = `new URL('data/' + file, document.baseURI)`.
  - [lib/openData.ts](../global-cannabis-usage-dashboard/src/lib/openData.ts): `fetch` de `observatorio.json` (línea ~158, con override `ac-feed-url`) y `arg-justice-snapshot.json` (línea ~177). Refresca cada 15 min y cae a `src/data/snapshots/*.json`.
  - `EvidenceMap.tsx:25` y `TerritoryView.tsx:68-70`: `fetch` de `world.geojson`, `nyc-boroughs.geojson`, `arg-provinces.geojson`.
  - Estos archivos viven en `public/data/`: `arg-justice-snapshot.json`, `arg-provinces.geojson`, `literature-snapshot.json`, `nyc-boroughs.geojson`, `nyc-snapshot.json`, `observatorio.json`, `world.geojson`. Los tres `*-snapshot.json` duplican a `src/data/snapshots/*.json` por diseño (los scripts de actualización escriben ambos).
  - [SourcesView.tsx](../global-cannabis-usage-dashboard/src/components/SourcesView.tsx) línea 52 le dice al usuario que edite `public/data/observatorio.json`: ese texto debe seguir siendo cierto.
- `localStorage`: claves `ac-feed-v1`, `ac-nyc-v1`, `ac-arg-v1`, `ac-feed-url`, `ac-literature-v1`. La shell **no usa** `localStorage` (verificado), así que no hay colisión.
- Red externa: OpenAlex (`lib/openAlex.ts`), NYC Open Data (`lib/nyc.ts`), tiles de OpenStreetMap. Se mantiene.
- Pestaña `contacto` ([ContactView.tsx](../global-cannabis-usage-dashboard/src/components/ContactView.tsx)): formulario que abre un `mailto:` (no envía nada a un servidor). No es una integración nueva; se conserva sin cambios.
- CSS ([src/index.css](../global-cannabis-usage-dashboard/src/index.css)). **No tiene `@theme`**; los colores están en hexadecimal y con las paletas por defecto de Tailwind (`slate`, `emerald`, etc.). Contenido:
  - `@import "tailwindcss";`
  - Reglas globales (las únicas que pueden afectar a la shell): `:root { color-scheme: dark }`, `html { scroll-behavior: smooth }`, `button, a, input, select, textarea { -webkit-tap-highlight-color: transparent }`, `button { cursor: pointer }`, `button:disabled { cursor: wait }`, `:focus-visible { outline: 2px solid #6ee7b7; outline-offset: 4px }` y un `@media (prefers-reduced-motion: reduce)` con `html` y `*, *::before, *::after` (animaciones y transiciones a 0.01ms `!important`).
  - `@layer components` con clases `.research-button`, `.research-field`, `.research-input`, `.research-select`, `.research-table`, `.research-tooltip` definidas con `@apply`.
  - Clases propias (sin riesgo de colisión): `.research-view`, `@keyframes research-enter`, `.territory-map`, `.territory-base-tiles`, `.leaflet-*` (afectan solo a Leaflet).
  - Además `TerritoryView.tsx` línea 5 importa `leaflet/dist/leaflet.css`.
- Scripts: `scripts/update-open-data.ts`, `update-literature.ts`, `update-argentina-data.py`, `validate-science-harness.ts`. Escriben en `public/data/…` y `src/data/snapshots/…` (rutas relativas al directorio de ejecución) e importan `../src/data/...`.
- Tests: `tests/argentina.test.ts`, `science.test.ts`, `statistics.test.ts` (`node:test`, importan `.ts` y `.json` → requieren `tsx`; `statistics.test.ts` importa `../public/data/nyc-snapshot.json`) y `tests/browser/observatory.spec.ts` (Playwright; **fuera de alcance**: Horacio verifica el navegador manualmente, no se migra ni se instala `@playwright/test`). Ninguno está enlazado a un script npm. `tsc` no tipa `tests/` ni `scripts/` (fuera de `src`).
- Documentación de desarrollo del observatorio: `specs/`, `skills/`, `harness/`, `mockups/`, `DATOS_ABIERTOS.md`, `FUENTES_JUSTICIA.md`. `DATOS_ABIERTOS.md` cita `.github/workflows/open-data.yml`, que **no existe** en la copia.
- `index.html` del observatorio (título y meta description) y `main.tsx`: **no se migran**; la shell tiene los suyos.

### 2.3 Restricciones del issue
- No cambiar contenido, cifras ni fuentes. Mantener `null` para datos desconocidos y la distinción real / muestra / demo.
- No tocar `harness`, `tienda`, `donaciones` (ISSUE-001). `patrones` sigue como `EnConstruccion`.
- Dependencias con versión exacta y lockfile actualizado.
- Sin integraciones de pago ni nuevos formularios de envío.
- Documentar en `docs/overview.md` y `.github/copilot-instructions.md`.

## 3. Decisiones

Las marcadas **(confirmar)** requieren respuesta de Horacio; si no responde, se aplica la recomendación y se deja constancia en el reporte final.

| Id | Decisión | Estado |
|---|---|---|
| D-1 | Hash de sub-rutas: `#observatorio/<pestaña>` | Recomendado, **(confirmar)** |
| D-2 | Datos y GeoJSON: se conserva la carga por `fetch` y se fusiona `public/data/` en `public/data/` de la shell | Decidido |
| D-3 | Chrome del observatorio dentro de la shell: modo embebido (ver 5.4) | Recomendado, **(confirmar)** el bloque de identidad |
| D-4 | Scripts de actualización: se conservan, bajo `scripts/observatorio/`, con scripts npm `observatorio:*` | Recomendado, **(confirmar)** |
| D-5 | Documentación de desarrollo en `docs/observatorio/` | Recomendado, **(confirmar)** |
| D-6 | Dividir `App.tsx` en un archivo por pestaña: **Fase 2, opcional**, posterior a la fusión | **(confirmar)** |
| D-7 | CSS: se aíslan solo las reglas realmente globales (ver 5.5) | Decidido |
| D-8 | Dependencias con versión exacta (sección 2.2) | Decidido |
| D-9 | Tests `node:test` se incorporan; Playwright **no** se migra (verificación manual de Horacio) | Decidido |
| D-10 | Eliminar `global-cannabis-usage-dashboard/` al terminar | **(confirmar)** |
| D-11 | Crear `.gitignore` en la raíz (`node_modules`, `dist`) como primer paso | Recomendado, **(confirmar)** |

### D-2 en detalle
- No se cambia ninguna línea de `assets.ts`, `openData.ts`, `EvidenceMap.tsx` ni `TerritoryView.tsx` relacionada con datos. Así se preserva el comportamiento de refresco y el texto de `SourcesView`.
- Se crea `public/` en la raíz de la shell y se mueve ahí `public/data/` del observatorio **con los mismos nombres**. Vite sirve `public/` en `dev` y `preview`, y la forma exacta de publicarlo queda fuera de este plan.
- Se conservan los duplicados `public/data/*-snapshot.json` ↔ `src/observatorio/data/snapshots/*.json` (los scripts los mantienen sincronizados).

### D-6 en detalle
- La primera entrega usa `App.tsx` del observatorio **tal cual** (renombrado a `ObservatorioPage.tsx`). Es la forma más segura de respetar "no cambiar contenido".
- La división por pestañas (Fase 2) es una mejora de mantenibilidad. Tiene riesgo real: el estado compartido (`metric`, `regions`, `frameworks`, `year`, `selected`, `openData`, `list`, `agg`) y `setTab` (líneas 397 y 1158) deben pasarse como props o contexto, y los bloques de pestaña son JSX inline, no componentes. Hacerla solo si el usuario lo confirma, en commits separados.

## 4. Estructura destino

```
public/
  data/                       # fusionado desde global-cannabis-usage-dashboard/public/data (7 archivos)
src/
  observatorio/
    ObservatorioPage.tsx      # ex App.tsx del observatorio (export default)
    observatorio.css          # reglas aisladas + clases .research-* (ver 5.5)
    components/               # ex src/components (16 archivos)
    data/                     # ex src/data (7 .ts + snapshots/)
    lib/                      # ex src/lib (9 archivos)
    utils/                    # ex src/utils
  App.tsx                     # integra <ObservatorioPage />
docs/observatorio/            # specs, skills, harness, mockups, DATOS_ABIERTOS.md, FUENTES_JUSTICIA.md
scripts/observatorio/         # update-open-data.ts, update-literature.ts, update-argentina-data.py, validate-science-harness.ts
tests/observatorio/           # argentina/science/statistics .test.ts
```

`index.html`, `main.tsx`, `vite.config.ts`, `tsconfig.json` y `package.json` del observatorio **no se copian**: la shell ya tiene los suyos (ver `vite-env.d.ts` en el paso P-06).

## 5. Diseño técnico

### 5.1 Fusión de código
Mover (no reescribir) `components/`, `data/`, `lib/`, `utils/` y `App.tsx` → `ObservatorioPage.tsx`. Los imports relativos internos siguen siendo válidos porque la estructura relativa no cambia. Solo hay que renombrar `export default function App` → `export default function ObservatorioPage`.

### 5.2 Hash de sub-rutas e integración en `App.tsx`

**Shell (`src/App.tsx`):**
1. Estado inicial (líneas 21-24): validar solo el primer segmento del hash.
   ```ts
   const h = window.location.hash.replace("#", "").split("/")[0] as Vista;
   ```
2. Efecto de escritura (línea 30): no pisar la sub-ruta.
   ```ts
   const actual = window.location.hash.replace("#", "").split("/")[0];
   if (actual !== vista) window.location.hash = vista;
   ```
   Los efectos de los hijos corren antes que los del padre: `ObservatorioPage` escribe `#observatorio/<tab>` con `replaceState` y luego este efecto ve `actual === "observatorio"` y no lo borra.
3. `case "observatorio": return <ObservatorioPage />;`.
4. **Evitar el remonte:** `VistaActual` se redefine en cada render. Reemplazar `<VistaActual />` (línea 246) por `{VistaActual()}`. `VistaActual` es solo un `switch` sin hooks, por lo que llamarlo como función es seguro y el árbol conserva su identidad entre renders. Es un cambio mínimo que aplica a todas las vistas y no altera su salida.
5. No se agrega `hashchange` a la shell (comportamiento actual). Consecuencia a documentar: el deep-link `#observatorio/<tab>` funciona al cargar la página; cambiar a mano el hash estando en otra vista no cambia de vista.

**Observatorio (`ObservatorioPage.tsx`):**
1. Estado inicial de `tab`: leer el segundo segmento de `window.location.hash.slice(1).split('/')`; si no es una clave de `TABS` usar `'panorama'`.
2. Efecto de escritura (línea 88): `window.history.replaceState(null, '', '#observatorio/' + tab)`. Se mantiene `replaceState` (no genera `hashchange` ni historial).
3. Listener de `hashchange` (líneas 93-100): tomar `const [vista, key] = window.location.hash.slice(1).split('/')`; si `vista === 'observatorio'` y `key` es una pestaña válida, `setTab(key)`. Ignorar el resto (la shell dispara `hashchange` con `#observatorio` sin pestaña).
4. `CountryPanel.tsx` línea 205: cambiar `href="#fuentes"` por `href="#observatorio/fuentes"` (el listener del punto 3 lo atiende).
5. Al salir y volver al observatorio se reinicia (pestaña `panorama`, filtros por defecto), porque la shell desmonta la vista. Es aceptable y se documenta; mantenerlo montado queda fuera de alcance.

### 5.3 Datos
- Mover `public/data/*` del observatorio a `public/data/` de la shell. No modificar el código de carga (D-2).
- Mover `src/data/**` a `src/observatorio/data/**`. Los imports de `snapshots/*.json` dentro de `lib/openData.ts`, `lib/literature.ts` y `data/justiceEvidence.ts` son relativos y siguen funcionando.

### 5.4 Modo embebido (D-3)
La shell ya aporta fondo (`Fondo`), encabezado de página con `<h1>` (grupo, título, bajada), contenedor `max-w-7xl` con padding y footer. Cambios en `ObservatorioPage.tsx`, solo de estructura (sin tocar textos, cifras ni fuentes):
- Quitar el wrapper `min-h-screen bg-[#070b11]` (línea 212) y el fondo decorativo `fixed inset-0` (213-217), que taparía el `Fondo` de la shell. Reemplazar el wrapper por `<div className="observatorio-root relative text-slate-100">`.
- Quitar del contenedor de la línea 220 el centrado y padding duplicados (`mx-auto max-w-[1420px] px-4 pb-16 pt-6 sm:px-6`), dejando `relative`. El ancho lo define la shell (`max-w-7xl`).
- Cambiar el `<h1>` "Acción Cannábica" (línea ~229) a `<h2>` conservando clases y texto, para no tener dos `<h1>`.
- **Se conserva** el resto del header (kicker, bajada, datos), la navegación por pestañas y el `<footer>` completo, porque contienen metodología, advertencias y referencias del observatorio. **(confirmar)**: el bloque de identidad (`LogoSlot`, personería jurídica, correo e Instagram) duplica información que ya está en la shell; por defecto **se mantiene** y se deja a Horacio decidir si se retira.
- `CountryDrawer` usa `fixed inset-0 z-50`: queda por encima del header (`z-30`) y del sidebar (`z-40`) de la shell. Verificar visualmente.

### 5.5 CSS (D-7)
Crear `src/observatorio/observatorio.css` e importarlo desde `ObservatorioPage.tsx` (`import './observatorio.css'`):
1. **No** repetir `@import "tailwindcss"`: duplicaría preflight y utilidades. Empezar con `@reference "../index.css";` para poder usar `@apply`.
2. Copiar `@layer components` (`.research-*`) y las clases propias (`.research-view`, `@keyframes research-enter`, `.territory-map`, `.territory-base-tiles`, `.leaflet-*`) **sin cambios**: tienen nombres específicos o solo afectan a Leaflet.
3. Reglas globales:
   - `:root { color-scheme: dark }` y `html { scroll-behavior: smooth }`: **descartar** (la shell ya las define).
   - `@media (prefers-reduced-motion)`: **descartar** (la shell ya tiene el suyo en `src/index.css`, con efecto equivalente).
   - `-webkit-tap-highlight-color`, `button { cursor: pointer }`, `button:disabled { cursor: wait }`: reescribir bajo `.observatorio-root`.
   - `:focus-visible { outline: 2px solid #6ee7b7; outline-offset: 4px }`: reescribir como `.observatorio-root :focus-visible { … }` para no cambiar el foco del resto del sitio.
4. Importar `leaflet/dist/leaflet.css` desde `TerritoryView.tsx` ya existe; no moverlo (solo afecta a Leaflet).
5. Tailwind 4 detecta clases por escaneo del proyecto: no hay que registrar `src/observatorio/**`. Los tokens `@theme` de la shell no pisan los colores usados por el observatorio (solo redefine `rose-400` con el mismo valor por defecto).

### 5.6 Dependencias (D-8)
Instalar en la raíz con `--save-exact` y las versiones de 2.2 (`clsx` y `tailwind-merge` ya existen en la shell; no reinstalar). Verificar que `package-lock.json` queda actualizado y que `package.json` no tiene `^` ni `~` nuevos.

### 5.7 Scripts y tests (D-4, D-9)
- Mover `scripts/` → `scripts/observatorio/` y `tests/` → `tests/observatorio/`.
- Actualizar rutas internas:
  - Imports `../src/data/...` → `../../src/observatorio/data/...`; `../public/data/...` → `../../public/data/...`.
  - Escrituras: `public/data/…` no cambia; `src/data/snapshots/…` → `src/observatorio/data/snapshots/…` (en `update-open-data.ts`, `update-literature.ts` y la línea 142 de `update-argentina-data.py`). Todos asumen ejecutarse desde la raíz del repo.
- Scripts npm nuevos en `package.json`: `observatorio:update-data` (`tsx scripts/observatorio/update-open-data.ts`), `observatorio:update-literature` (`tsx scripts/observatorio/update-literature.ts`), `observatorio:validate-science` (`tsx scripts/observatorio/validate-science-harness.ts`) y `test:observatorio` (`node --import tsx --test tests/observatorio/*.test.ts`). El script Python se documenta pero no se integra.
- `tsc --noEmit` no cubre `scripts/` ni `tests/`. No se amplía el `include` (evita cambiar la configuración de la shell); los tests se validan al ejecutarse.
- No crear `.github/workflows/open-data.yml` (no está en la copia). Si Horacio lo tiene en el repo original, se agrega aparte.
- Playwright (`tests/browser/`, `playwright.config.ts`): no se migra ni se instala (D-9). Queda en la copia original.

## 6. Pasos de implementación

Ejecutar en orden; cada paso termina con su verificación. Si falla, detenerse y corregir antes de continuar.

### Fase 1: fusión funcional

| # | Paso | Acción | Verificación |
|---|---|---|---|
| P-00 | Confirmar decisiones | Pedir D-1, D-3 (bloque de identidad), D-4, D-5, D-6, D-10, D-11 | Respuestas o defaults registrados |
| P-01 | Rama y estado base | `git checkout -b feature/issue-002-observatorio`. Anotar `git status --short`. No mezclar los cambios previos de ISSUE-001: si hay que commitearlos, hacerlo antes en su propio commit | `git branch --show-current` |
| P-02 | `.gitignore` | Crear `.gitignore` con `node_modules` y `dist` (D-11) | `git status --short` ya no lista `node_modules/` ni `dist/` |
| P-03 | Línea base | `npx tsc --noEmit` y `npm run build` | Ambos pasan antes de cambiar nada |
| P-04 | Dependencias | `clsx 2.1.1` y `tailwind-merge 3.4.0` ya están en la shell con la misma versión (no reinstalar). Ejecutar `npm install --save-exact leaflet@1.9.4 recharts@3.10.1 lucide-react@1.65.0 papaparse@5.7.0` y `npm install --save-dev --save-exact @types/leaflet@1.9.22 @types/papaparse@5.5.2 tsx@4.23.15` | `package.json` sin `^`/`~` nuevos; `package-lock.json` modificado; `npx tsc --noEmit` pasa |
| P-05 | Copiar código | Copiar `components/`, `data/`, `lib/`, `utils/` a `src/observatorio/`. Copiar `App.tsx` como `src/observatorio/ObservatorioPage.tsx` y `index.css` como `src/observatorio/observatorio.css`. No copiar `main.tsx` ni `index.html` | Archivos presentes; contenido idéntico (comparar hashes con los originales) |
| P-06 | Tipos de entorno | Comparar `global-cannabis-usage-dashboard/src/vite-env.d.ts` con la shell; si la shell no tiene uno equivalente y `tsc` lo requiere, agregarlo en `src/vite-env.d.ts` | `npx tsc --noEmit` sin errores de tipos de Vite |
| P-07 | Renombrar componente | En `ObservatorioPage.tsx`: `export default function ObservatorioPage`; añadir `import './observatorio.css'` | Compila |
| P-08 | Datos públicos | Crear `public/` y mover/copiar `global-cannabis-usage-dashboard/public/data/*` a `public/data/` (7 archivos) | `Get-ChildItem public\data` lista los 7 archivos; tamaños iguales a los originales |
| P-09 | Hash en el observatorio | Aplicar 5.2 (lado observatorio): estado inicial, `replaceState`, `hashchange` y el `href` de `CountryPanel.tsx` | `npx tsc --noEmit` pasa |
| P-10 | Modo embebido | Aplicar 5.4 en `ObservatorioPage.tsx` | `npx tsc --noEmit` pasa |
| P-11 | CSS | Reescribir `observatorio.css` según 5.5 | `npx tsc --noEmit` y `npm run build` pasan; el `@apply` resuelve (sin errores de Tailwind) |
| P-12 | Integrar en la shell | Aplicar 5.2 (lado shell): primer segmento en el hash, escritura condicional, `case "observatorio"`, `{VistaActual()}`. Quitar el import de `EnConstruccion` solo si deja de usarse (sigue usándose en `patrones`) | `npx tsc --noEmit` pasa |
| P-13 | Verificación en navegador | `npm run dev`. Abrir `#observatorio`, `#observatorio/territorio`, recargar. Recorrer las 14 pestañas. Escribir en el buscador del sitio estando en el observatorio | Ver sección 7 |
| P-14 | Build | `npx tsc --noEmit` y `npm run build` | Ambos pasan |
| P-15 | Commit fase 1 | `git add` solo los archivos propios de esta fase (no `git add -A`). Mensaje con trailer `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>` | `git show --stat` solo muestra archivos del plan |

### Fase 2: scripts, tests y documentación

| # | Paso | Acción | Verificación |
|---|---|---|---|
| P-16 | Scripts | Aplicar 5.7: mover a `scripts/observatorio/`, corregir rutas, añadir scripts npm | `npm run observatorio:validate-science` ejecuta sin error de rutas |
| P-17 | Tests | Mover tests a `tests/observatorio/`, corregir imports, añadir `test:observatorio` | `npm run test:observatorio` pasa. Anotar cualquier test que ya fallara en el proyecto original |
| P-19 | Documentación de desarrollo | Mover `specs/`, `skills/`, `harness/`, `mockups/`, `DATOS_ABIERTOS.md`, `FUENTES_JUSTICIA.md` a `docs/observatorio/`. Corregir rutas internas citadas (por ejemplo `public/data` y `src/data/snapshots`) | Sin enlaces rotos |
| P-20 | Docs del proyecto | Actualizar `docs/overview.md` (tabla de vistas, hash con sub-rutas, estructura `src/observatorio/`, scripts) y `.github/copilot-instructions.md` (convenciones, scripts `observatorio:*`). Revisar `README.md` (vistas y dependencias) sin mezclar cambios previos ajenos | Diff revisado |
| P-21 | Limpieza | Con confirmación de D-10, eliminar `global-cannabis-usage-dashboard/` | `git status --short` solo muestra cambios intencionales |
| P-22 | Commit fase 2 | Igual que P-15 | `git log -2` |

### Fase 3 (opcional, D-6): dividir por pestañas
Un commit por pestaña o grupo de pestañas, moviendo el JSX inline a `src/observatorio/tabs/<Pestaña>.tsx` y pasando por props el estado compartido y `onNavigate(tab)` en lugar de `setTab`. Tras cada commit: `npx tsc --noEmit`, `npm run build` y recorrido visual de la pestaña afectada. No cambiar textos ni lógica.

## 7. Validación

- [ ] `npx tsc --noEmit` y `npm run build` pasan.
- [ ] La vista `observatorio` ya no muestra `EnConstruccion`; `patrones` sí lo sigue mostrando.
- [ ] Las 14 pestañas se renderizan con los mismos títulos y contenido que en el proyecto original (comparación visual lado a lado con el original antes de eliminarlo).
- [ ] `#observatorio` abre `panorama`; `#observatorio/territorio` abre Atlas territorial al cargar y tras recargar; clave inválida cae a `panorama`.
- [ ] Al cambiar de pestaña la URL pasa a `#observatorio/<tab>` y no se agregan entradas al historial.
- [ ] El enlace "Consultar fuentes y cobertura verificable" del panel de país abre `fuentes`.
- [ ] **Sin remonte:** estando en una pestaña con filtros, escribir en el buscador del sitio no reinicia pestaña, filtros ni datos. (Falla si no se aplica `{VistaActual()}`.)
- [ ] Mapas de Territorio y Evidencia cargan los GeoJSON (sin errores 404 en la consola de red para `data/*.geojson`) en `npm run dev` y `npm run preview`.
- [ ] La pestaña Fuentes muestra el estado del catálogo sin errores nuevos de `fetch` para `observatorio.json` y `arg-justice-snapshot.json`.
- [ ] Una sola `<h1>` visible en la vista (la de la shell).
- [ ] Las demás vistas de la shell conservan su aspecto y foco: comparar `inicio`, `redes` y `eda` antes y después (el `outline` de `:focus-visible` no cambió fuera del observatorio).
- [ ] El panel lateral de país (`CountryDrawer`) se ve por encima del header y el sidebar de la shell, y el scroll de pestañas funciona en móvil.
- [ ] El buscador de la shell encuentra "Observatorio Global de Cannabis".
- [ ] `npm run test:observatorio` pasa. La verificación en navegador la hace Horacio manualmente.
- [ ] Sin cambios de contenido: los 7 archivos de `public/data/` y los 3 snapshots tienen el mismo hash que los originales.
- [ ] Ninguna dependencia nueva con `^` o `~`; `package-lock.json` actualizado.
- [ ] `docs/overview.md` y `.github/copilot-instructions.md` actualizados.
- [ ] `harness`, `tienda` y `donaciones` no se modificaron.
- [ ] `git status` limpio salvo cambios intencionales (sin `node_modules/` ni `dist/`).

## 8. Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Choque entre el hash de la shell y el del observatorio | Pestaña perdida o URL incorrecta | 5.2: primer segmento, escritura condicional, `replaceState` |
| `VistaActual` se redefine en cada render | El observatorio se remonta al escribir en el buscador y pierde estado/datos | `{VistaActual()}` (5.2 punto 4) y validación específica |
| Reglas CSS globales del observatorio | Cambio de foco/cursores en toda la shell | Reescribir bajo `.observatorio-root` o descartar (5.5) |
| `@apply` sin `@reference` | Error de build o CSS duplicado | `@reference "../index.css"`, no repetir `@import "tailwindcss"` (5.5) |
| Colisión de carpetas `components/`, `data/`, `utils/` | Archivos pisados | Todo bajo `src/observatorio/` |
| Rutas de scripts/tests tras moverlos | Scripts escriben en rutas inexistentes o tests no resuelven imports | 5.7 y verificación P-16/P-17 |
| Fondo `fixed` y wrapper `min-h-screen` del observatorio | Fondo tapa a `Fondo` de la shell o doble scroll | 5.4 |
| Dos `<h1>` | Accesibilidad/SEO | `<h2>` en el observatorio |
| `git add -A` sin `.gitignore` | Se versionan `node_modules/` y `dist/` | P-02 y commits con archivos explícitos |
| Trabajo previo sin commitear (ISSUE-001) mezclado con este | Commits confusos | P-01 |
| División por pestañas rompe estado compartido | Regresiones | Fase 3 opcional, en commits pequeños |
| Dependencias de red externas (OSM, OpenAlex, NYC) | Mapas o datos no cargan sin conexión | Comportamiento existente del observatorio; no cambia |

## 9. Instrucciones para otra IA

1. **Leer primero** este plan, [ISSUE-002](../Issues/ISSUE-002-incorporar-observatorio-global-cannabis.md) y [PLAN-001](./PLAN-001-ocultar-secciones-no-publicadas.md).
2. **Resolver P-00**: pedir las decisiones marcadas **(confirmar)** mediante una pregunta al usuario. Si no responde, usar la recomendación y declararlo en el reporte final.
3. **Alcance:** fusionar código TSX en `src/observatorio/`. **No** analizar ni tocar `dist/`, `vite-plugin-singlefile`, el tamaño del bundle ni el despliegue. No modificar `vite.config.ts`.
4. **No cambiar contenido**: textos, cifras, fuentes, lógica de datos, `null` para datos desconocidos y la distinción real / muestra / demo. Solo se permiten los cambios estructurales descritos en 5.2, 5.4 y 5.5.
5. **No tocar** `harness`, `tienda`, `donaciones` ni `patrones`. No agregar pagos ni formularios de envío.
6. **Datos:** no modificar `assets.ts`, `openData.ts`, `EvidenceMap.tsx` ni `TerritoryView.tsx` en lo relativo a carga de datos. Solo mover los archivos de `public/data/`.
7. **Hash:** en el observatorio usar siempre `history.replaceState` para cambiar de pestaña; nunca `window.location.hash = …`. En la shell comparar solo el primer segmento.
8. **CSS:** ningún selector global fuera de `.observatorio-root`; no repetir `@import "tailwindcss"`.
9. **Herramientas:** `npm install --save-exact` con las versiones de 2.2; validar con `npx tsc --noEmit` y `npm run build` en cada paso. No agregar ESLint, Prettier ni otro framework de tests.
10. **Edición:** crear y editar archivos con las herramientas de creación/edición, no escribiendo archivos desde PowerShell. Para copiar archivos grandes sin modificar (código y JSON del observatorio) usar `Copy-Item` y verificar con hashes.
11. **Comentarios:** solo en código que necesite aclaración.
12. **Git:** commits por fase, con archivos explícitos (nunca `git add -A`), y con el trailer `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`. No commitear `node_modules/`, `dist/` ni `Notes.md`.
13. **Antes de borrar** `global-cannabis-usage-dashboard/` (P-21): confirmar D-10, completar la validación de la sección 7 y comparar contenido con el original.
14. **Reporte final:** pasos completados, resultados de `tsc`, `build`, `test:observatorio` y verificación en navegador, decisiones aplicadas por defecto y desviaciones del plan.

## 10. Decisiones pendientes para Horacio

- **D-1:** ¿Sub-rutas `#observatorio/<pestaña>` (recomendado)?
- **D-3:** ¿Mantener o retirar el bloque de identidad del observatorio (logo, personería, correo, Instagram) que duplica la shell? Por defecto se mantiene.
- **D-4 / D-5:** ¿Conservar los scripts de actualización y mover la documentación del observatorio a `docs/observatorio/`?
- **D-6:** ¿Dividir `App.tsx` por pestañas después de la fusión (Fase 3)?
- **D-10:** ¿Eliminar `global-cannabis-usage-dashboard/` al terminar?
- **D-11:** ¿Crear un `.gitignore` en la raíz?

## 11. Supuestos no verificados

- Si `vite-env.d.ts` es necesario en la shell (P-06).
- Si `@reference "../index.css"` resuelve sin ajustes en Tailwind 4.1.17 con `@tailwindcss/vite` (P-11); si no, usar la ruta relativa correcta al `src/index.css`.
- Si `node --import tsx --test` ejecuta los tests con imports de JSON sin flags adicionales (P-17).
