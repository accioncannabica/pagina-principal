# Visión general del proyecto

Referencia descriptiva de `pagina-principal`. Todo lo aquí indicado proviene del código y la configuración del repositorio; lo que no pudo confirmarse se señala como tal.

## Propósito y alcance

Es la «página principal» de la **Asociación Civil Acción Cannábica** (sigla ACCA, `@accannabica`), una ONG con sede en CABA, Argentina, fundada en 2014 y miembro fundadora de la FACC (datos en `ORG` y `HITOS`, [`src/data/content.ts`](../src/data/content.ts)). El título de [`index.html`](../index.html) la define como «Dashboard institucional cannábico».

La propia aplicación se presenta como un **prototipo de tablero institucional** ("dashboard harness", texto del pie en [`src/App.tsx`](../src/App.tsx)). Distingue dos tipos de contenido:

- **Contenido institucional**: referenciado a fuentes públicas listadas en el comentario de cabecera de `content.ts` (redes sociales de la organización, directorios, InfoLEG/Boletín Oficial, etc.).
- **Datos de demostración**: marcados como `demo` en el código (dataset EDA, agenda futura, tienda, destino de donaciones, algunas organizaciones). Están pensados para reemplazarse por datos reales (el propio backlog `S-14` de `SPEC` lo indica).

Usuarios o actores: no hay autenticación ni roles. El contenido se dirige a visitantes interesados en la asociación, pacientes y familias (REPROCANN), organizaciones de la red/FACC, prensa y potenciales donantes (áreas de `CONTACTO`).

## Tecnologías

Versiones fijadas en [`package.json`](../package.json) (sin rangos `^`):

- React 19.2.6 y React DOM 19.2.6.
- TypeScript 5.9.3 con `strict`, `noUnusedLocals` y `noUnusedParameters` ([`tsconfig.json`](../tsconfig.json)); alias `@/*` → `src/*` (también en [`vite.config.ts`](../vite.config.ts)).
- Vite 7.3.2 con los plugins `@vitejs/plugin-react`, `@tailwindcss/vite` y `vite-plugin-singlefile`.
- Tailwind CSS 4.1.17; el tema (colores `ink`, `lima`, `verde`, `cian`, `ambar`, `rose`, `violeta` y fuentes) se declara con `@theme` en [`src/index.css`](../src/index.css).
- `clsx` y `tailwind-merge`, combinados en `cn()` ([`src/utils/cn.ts`](../src/utils/cn.ts)).
- Para el Observatorio Global de Cannabis (`src/observatorio/`): `leaflet` 1.9.4, `recharts` 3.10.1, `lucide-react` 1.65.0 y `papaparse` 5.7.0 (más `@types/leaflet`, `@types/papaparse` y `tsx` 4.23.15 como dependencias de desarrollo).
- Google Fonts (Space Grotesk, JetBrains Mono) cargadas por `<link>` en `index.html`.

La shell no usa backend, base de datos ni variables de entorno. El Observatorio sí hace llamadas de red en runtime (`fetch`): a `public/data/*` (catálogo, instantáneas y GeoJSON), a OpenAlex, a NYC Open Data y a los tiles de OpenStreetMap (Leaflet). Los demás recursos externos son las fuentes tipográficas y los enlaces a redes sociales/fuentes.

## Arquitectura

Aplicación SPA de una sola página, sin librería de enrutado ni de estado global:

```
index.html ─► src/main.tsx ─► src/App.tsx (shell + enrutado por estado)
                                   ├─ src/sections/*.tsx   (una vista por sección)
                                   │     ├─ src/data/content.ts, src/data/eda.ts   (datos)
                                   │     └─ src/components/ui.tsx, charts.tsx      (UI y gráficos)
                                   ├─ src/investigaciones/patrones/ (vista `patrones`; components/, data/, styles/ propios)
                                   ├─ src/observatorio/ObservatorioPage.tsx (vista `observatorio`; con sus propios components/, data/, lib/, utils/)
                                   │     └─ public/data/*.json, *.geojson  (cargados por fetch en runtime)
                                   └─ src/components/Fondo.tsx (fondo animado)
```

Responsabilidades:

- **[`src/App.tsx`](../src/App.tsx)**: shell del tablero (barra lateral agrupada, barra superior con buscador global, ticker de noticias, pie). Mantiene en `useState` la vista actual, el texto de búsqueda y el estado del menú móvil. El «router» es un `switch` sobre `Vista` en `VistaActual`.
- **[`src/types.ts`](../src/types.ts)**: tipo `Vista` y la lista `NAV` (id, título, ícono, grupo, bajada y `visible` opcional de cada vista). `NAV_VISIBLE` (las entradas sin `visible: false`) alimenta la barra lateral, el buscador, el pie, los atajos de Inicio y la validación del hash. Las vistas `harness`, `tienda` y `donaciones` están ocultas con `visible: false`; para reactivarlas basta con quitar esa propiedad.
- **[`src/investigaciones/patrones/PatronesPage.tsx`](../src/investigaciones/patrones/PatronesPage.tsx)**: versión integrada del micrositio «Patrones de consumo». Maneja navegación interna, ticker, animaciones condicionadas por `prefers-reduced-motion` y sincronización de hash `#patrones/<subvista>`.
- **[`src/sections/`](../src/sections)**: un componente por vista. Reciben la función `irA(vista)` cuando necesitan enlazar a otra sección.
- **[`src/data/content.ts`](../src/data/content.ts)**: todo el contenido textual y tipado (organización, KPIs, especificación, hitos, actividades, noticias, organizaciones, FACC, REPROCANN, productos, donaciones, contacto).
- **[`src/data/eda.ts`](../src/data/eda.ts)**: dataset sintético y funciones estadísticas (ver más abajo).
- **[`src/components/ui.tsx`](../src/components/ui.tsx)**: primitivas reutilizables (`Icon`, `Reveal`, `Counter`, `Badge`, `Panel`, `SectionTitle`, `DemoBadge`, `Tabs`, `Progress`, `Boton`). Los íconos son SVG propios seleccionados por nombre.
- **[`src/components/charts.tsx`](../src/components/charts.tsx)**: gráficos SVG propios (`AreaStream`, `HeatmapAgenda`, `MatrizCorr`, `Histograma`, `BoxPlotPorTipo`, `Radar`, `GradientePeso`, `GrafoOrganizaciones`, `MapaCalorGeo`, `BarrasCategorias`, `DonutDestino`, `Timeline`).
- **[`src/components/Fondo.tsx`](../src/components/Fondo.tsx)**: fondo animado (usa `useEffect`/`useRef`).
- **[`src/observatorio/`](../src/observatorio)**: Observatorio Global de Cannabis, fusionado desde el proyecto independiente `global-cannabis-usage-dashboard` ([PLAN-002](../plan/PLAN-002-incorporar-observatorio-global-cannabis.md)). `ObservatorioPage.tsx` es el componente de la vista `observatorio` (14 pestañas, estado de filtros y datos abiertos); `components/`, `data/`, `lib/` y `utils/` son propios y no se mezclan con los de la shell. Sus estilos están en `observatorio.css` (las reglas globales van acotadas bajo `.observatorio-root`; `@reference "../index.css"` evita duplicar Tailwind). Los datos en runtime viven en [`public/data/`](../public/data); los respaldos incluidos en el bundle, en `src/observatorio/data/snapshots/`. Más detalle en [`docs/observatorio/`](./observatorio/README.md).

## Navegación y flujo principal

1. [`src/main.tsx`](../src/main.tsx) monta `<App />` en `#root` dentro de `StrictMode` e importa `index.css`.
2. `App` calcula la vista inicial a partir del primer segmento del hash de la URL (`#eda`, `#reprocann`…); si no coincide con ningún `id` de `NAV_VISIBLE`, usa `inicio`. El observatorio guarda su pestaña como sub-ruta: `#observatorio/<pestaña>` (por ejemplo `#observatorio/territorio`; claves en `TABS` de `ObservatorioPage.tsx`). La shell solo compara el primer segmento y no pisa la sub-ruta; el observatorio la actualiza con `history.replaceState`.
3. Cada cambio de vista actualiza `window.location.hash`, hace scroll al inicio y renderiza la sección correspondiente. `VistaActual` se invoca como función (`{VistaActual()}`) y no como componente, porque está definida dentro de `App`: como componente se redefiniría en cada render y remontaría la vista (el observatorio perdería pestaña y filtros al escribir en el buscador). Nota: solo se lee el hash al cargar; no hay escucha de `hashchange` en la shell, por lo que los botones del navegador y editar el hash a mano no cambian la vista (observación derivada del código de `App.tsx`). Dentro del observatorio sí se escucha `hashchange` para cambiar de pestaña.
4. El buscador filtra `NAV_VISIBLE` por título y bajada (máx. 6 resultados). La tecla `/` enfoca el buscador y `Escape` cierra el menú móvil.
5. El ticker de la barra superior muestra las 6 noticias más recientes de `NOTICIAS` ordenadas por fecha.

## Secciones

| Vista (`id`) | Archivo | Contenido verificado |
| --- | --- | --- |
| `inicio` | `sections/Inicio.tsx` | KPIs, gráficos de resumen (serie mensual, radar, mapa de calor geográfico), accesos rápidos. |
| `quienes` | `sections/QuienesSomos.tsx` | Descripción, pilares, línea de tiempo de hitos. |
| `recorrido` | `sections/Recorrido.tsx` | Actividades y agenda con filtros por tipo (`AGENDA_FILTROS`) y heatmap. |
| `novedades` | `sections/Novedades.tsx` | Noticias con categorías y fuente. |
| `patrones` | `sections/Patrones.tsx` + `investigaciones/patrones/` | Investigación «Patrones de consumo y percepciones de salud»: navegación interna, ticker, componentes dedicados (`components/`) y dataset estático (`data/research.ts`). |
| `redes` | `sections/Redes.tsx` | Directorio y grafo de organizaciones. |
| `facc` | `sections/Facc.tsx` | Datos de la federación, asambleas y líneas de trabajo. |
| `reprocann` | `sections/Reprocann.tsx` | Definición, normativa, roles, requisitos, rangos de cultivo y pasos. |
| `eda` | `sections/DataLab.tsx` | EDA con pestañas Univariado / Bivariado / Categórico y gradiente de peso. |
| `observatorio` | `observatorio/ObservatorioPage.tsx` | Observatorio Global de Cannabis: 14 pestañas (panorama, atlas territorial, formas de uso, marcos penales, gasto judicial, cáñamo y precios, cultura, tendencias, ONGs, investigación publicada, laboratorio EDA, diccionario, fuentes y contacto). |
| `harness` (oculta) | `sections/Harness.tsx` | Especificación (`SPEC`) y habilidades (`SKILLS`) del prototipo. |
| `tienda` (oculta) | `sections/Comercial.tsx` (`Tienda`) | Catálogo mockup con carrito. |
| `donaciones` (oculta) | `sections/Comercial.tsx` (`Donaciones`) | Destino de fondos (`DONACION_DESTINOS`) y montos sugeridos. |
| `contacto` | `sections/Contacto.tsx` | Canales, FAQ y formulario. |

## Datos y modelos

- **Contenido** ([`content.ts`](../src/data/content.ts)): tipos exportados `SpecItem`, `Actividad`, `Noticia`, `Organizacion` y `Producto`; el resto son constantes literales.
- **Dataset EDA** ([`eda.ts`](../src/data/eda.ts)): 220 registros `Consulta` generados con un generador congruencial lineal con semilla fija (`20260101`) y distribución normal (Box-Muller), por lo que el resultado es determinista. Exporta estadísticos (`stats`, `ESTADISTICOS`), histogramas, correlaciones (`MATRIZ_CORR`), conteos por categoría, y las series para el heatmap de agenda, el gradiente de peso (`PUNTOS_PESO`), el mapa geográfico, la serie mensual y el radar. `EDA_META.demo` es `true`.
- **Investigación «Patrones de consumo»** ([`research.ts`](../src/investigaciones/patrones/data/research.ts)): metadatos del estudio, bins de edad y género, resultados de la encuesta, matrices de correlación, contenidos de mockups y scripts reproducibles. Alimenta los componentes `Overview`, `Eda`, `Heatmap`, `Mockups` y anexos.
- No hay persistencia: el carrito, los filtros y el formulario viven en el estado de React y se pierden al recargar.

## Formulario de contacto, tienda y donaciones

- `Contacto.tsx` valida en cliente (nombre no vacío, email con `@`, mensaje de al menos 10 caracteres) y muestra un estado «enviado»; **no realiza ninguna petición**.
- `Tienda` y `Donaciones` son mockups (`TIENDA_NOTA` y `DONACION_NOTA` lo indican explícitamente); no hay pasarela de pago.
- La pestaña Contacto del observatorio (`ContactView.tsx`) abre un `mailto:` con los datos escritos; no envía nada a un servidor.

## Estilos y accesibilidad

Estética oscura con acentos lima/verde definida en `@theme` de `index.css`, con animaciones propias (`@keyframes` como `marquee`, `rise`, `pulse-ring`) y un bloque `@media (prefers-reduced-motion: reduce)`. Los elementos interactivos usan `aria-label` / `aria-current` en navegación y buscador.

## Compilación, pruebas y despliegue

- Scripts en `package.json`: `dev`, `build` y `preview` (Vite); `observatorio:update-data`, `observatorio:update-literature` y `observatorio:validate-science` (actualizan o validan los datos del observatorio con `tsx`, desde la raíz del repositorio); y `test:observatorio` (19 pruebas `node:test` en `tests/observatorio/`). `scripts/observatorio/update-argentina-data.py` se ejecuta aparte con Python. No existen pruebas ni scripts para el resto de la app.
- `vite-plugin-singlefile` incrusta JS y CSS: `npm run build` genera un único `dist/index.html`. Los archivos de `public/data/` se copian junto a él en `dist/data/`; cómo se publican queda fuera de este documento.
- `npx tsc --noEmit` y `npm run build` se ejecutaron correctamente tras incorporar el observatorio. `tsc` solo cubre `src/`, no `scripts/` ni `tests/`.
- No hay linter, formateador, CI/CD (el workflow `open-data.yml` citado en `docs/observatorio/DATOS_ABIERTOS.md` no se incorporó), Docker ni infraestructura como código.
- El repositorio tiene un `.gitignore` con `node_modules` y `dist`.

## Desconocido o pendiente

- Versión de Node.js requerida y plataforma de despliegue: no declaradas.
- Datos reales de donaciones (CBU/alias, entidad receptora) y de series analíticas: `DONACION_NOTA` y la tarea `S-14` de `SPEC` los marcan como pendientes.
- Licencia del proyecto: no hay archivo de licencia.
