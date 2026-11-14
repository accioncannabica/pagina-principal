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
- Google Fonts (Space Grotesk, JetBrains Mono) cargadas por `<link>` en `index.html`.

No hay backend, base de datos, llamadas de red (`fetch`) ni variables de entorno. Los únicos recursos externos son las fuentes tipográficas y los enlaces a redes sociales/fuentes.

## Arquitectura

Aplicación SPA de una sola página, sin librería de enrutado ni de estado global:

```
index.html ─► src/main.tsx ─► src/App.tsx (shell + enrutado por estado)
                                   ├─ src/sections/*.tsx   (una vista por sección)
                                   │     ├─ src/data/content.ts, src/data/eda.ts   (datos)
                                   │     └─ src/components/ui.tsx, charts.tsx      (UI y gráficos)
                                   └─ src/components/Fondo.tsx (fondo animado)
```

Responsabilidades:

- **[`src/App.tsx`](../src/App.tsx)**: shell del tablero (barra lateral agrupada, barra superior con buscador global, ticker de noticias, pie). Mantiene en `useState` la vista actual, el texto de búsqueda y el estado del menú móvil. El «router» es un `switch` sobre `Vista` en `VistaActual`.
- **[`src/types.ts`](../src/types.ts)**: tipo `Vista` y la lista `NAV` (id, título, ícono, grupo, bajada y `visible` opcional de cada vista). `NAV_VISIBLE` (las entradas sin `visible: false`) alimenta la barra lateral, el buscador, el pie, los atajos de Inicio y la validación del hash. Las vistas `harness`, `tienda` y `donaciones` están ocultas con `visible: false`; para reactivarlas basta con quitar esa propiedad.
- **[`src/sections/`](../src/sections)**: un componente por vista. Reciben la función `irA(vista)` cuando necesitan enlazar a otra sección.
- **[`src/data/content.ts`](../src/data/content.ts)**: todo el contenido textual y tipado (organización, KPIs, especificación, hitos, actividades, noticias, organizaciones, FACC, REPROCANN, productos, donaciones, contacto).
- **[`src/data/eda.ts`](../src/data/eda.ts)**: dataset sintético y funciones estadísticas (ver más abajo).
- **[`src/components/ui.tsx`](../src/components/ui.tsx)**: primitivas reutilizables (`Icon`, `Reveal`, `Counter`, `Badge`, `Panel`, `SectionTitle`, `DemoBadge`, `Tabs`, `Progress`, `Boton`). Los íconos son SVG propios seleccionados por nombre.
- **[`src/components/charts.tsx`](../src/components/charts.tsx)**: gráficos SVG propios (`AreaStream`, `HeatmapAgenda`, `MatrizCorr`, `Histograma`, `BoxPlotPorTipo`, `Radar`, `GradientePeso`, `GrafoOrganizaciones`, `MapaCalorGeo`, `BarrasCategorias`, `DonutDestino`, `Timeline`).
- **[`src/components/Fondo.tsx`](../src/components/Fondo.tsx)**: fondo animado (usa `useEffect`/`useRef`).

## Navegación y flujo principal

1. [`src/main.tsx`](../src/main.tsx) monta `<App />` en `#root` dentro de `StrictMode` e importa `index.css`.
2. `App` calcula la vista inicial a partir del hash de la URL (`#eda`, `#reprocann`…); si no coincide con ningún `id` de `NAV_VISIBLE`, usa `inicio`.
3. Cada cambio de vista actualiza `window.location.hash`, hace scroll al inicio y renderiza la sección correspondiente. Nota: solo se lee el hash al cargar; no hay escucha de `hashchange`, por lo que los botones del navegador no cambian la vista (observación derivada del código de `App.tsx`).
4. El buscador filtra `NAV_VISIBLE` por título y bajada (máx. 6 resultados). La tecla `/` enfoca el buscador y `Escape` cierra el menú móvil.
5. El ticker de la barra superior muestra las 6 noticias más recientes de `NOTICIAS` ordenadas por fecha.

## Secciones

| Vista (`id`) | Archivo | Contenido verificado |
| --- | --- | --- |
| `inicio` | `sections/Inicio.tsx` | KPIs, gráficos de resumen (serie mensual, radar, mapa de calor geográfico), accesos rápidos. |
| `quienes` | `sections/QuienesSomos.tsx` | Descripción, pilares, línea de tiempo de hitos. |
| `recorrido` | `sections/Recorrido.tsx` | Actividades y agenda con filtros por tipo (`AGENDA_FILTROS`) y heatmap. |
| `novedades` | `sections/Novedades.tsx` | Noticias con categorías y fuente. |
| `redes` | `sections/Redes.tsx` | Directorio y grafo de organizaciones. |
| `facc` | `sections/Facc.tsx` | Datos de la federación, asambleas y líneas de trabajo. |
| `reprocann` | `sections/Reprocann.tsx` | Definición, normativa, roles, requisitos, rangos de cultivo y pasos. |
| `eda` | `sections/DataLab.tsx` | EDA con pestañas Univariado / Bivariado / Categórico y gradiente de peso. |
| `harness` (oculta) | `sections/Harness.tsx` | Especificación (`SPEC`) y habilidades (`SKILLS`) del prototipo. |
| `tienda` (oculta) | `sections/Comercial.tsx` (`Tienda`) | Catálogo mockup con carrito. |
| `donaciones` (oculta) | `sections/Comercial.tsx` (`Donaciones`) | Destino de fondos (`DONACION_DESTINOS`) y montos sugeridos. |
| `contacto` | `sections/Contacto.tsx` | Canales, FAQ y formulario. |

## Datos y modelos

- **Contenido** ([`content.ts`](../src/data/content.ts)): tipos exportados `SpecItem`, `Actividad`, `Noticia`, `Organizacion` y `Producto`; el resto son constantes literales.
- **Dataset EDA** ([`eda.ts`](../src/data/eda.ts)): 220 registros `Consulta` generados con un generador congruencial lineal con semilla fija (`20260101`) y distribución normal (Box-Muller), por lo que el resultado es determinista. Exporta estadísticos (`stats`, `ESTADISTICOS`), histogramas, correlaciones (`MATRIZ_CORR`), conteos por categoría, y las series para el heatmap de agenda, el gradiente de peso (`PUNTOS_PESO`), el mapa geográfico, la serie mensual y el radar. `EDA_META.demo` es `true`.
- No hay persistencia: el carrito, los filtros y el formulario viven en el estado de React y se pierden al recargar.

## Formulario de contacto, tienda y donaciones

- `Contacto.tsx` valida en cliente (nombre no vacío, email con `@`, mensaje de al menos 10 caracteres) y muestra un estado «enviado»; **no realiza ninguna petición**.
- `Tienda` y `Donaciones` son mockups (`TIENDA_NOTA` y `DONACION_NOTA` lo indican explícitamente); no hay pasarela de pago.

## Estilos y accesibilidad

Estética oscura con acentos lima/verde definida en `@theme` de `index.css`, con animaciones propias (`@keyframes` como `marquee`, `rise`, `pulse-ring`) y un bloque `@media (prefers-reduced-motion: reduce)`. Los elementos interactivos usan `aria-label` / `aria-current` en navegación y buscador.

## Compilación, pruebas y despliegue

- Scripts en `package.json`: `dev`, `build` y `preview` (Vite).
- `vite-plugin-singlefile` incrusta JS y CSS: `npm run build` genera un único `dist/index.html`.
- `npm ci`, `npm run build` y `npx tsc --noEmit` se ejecutaron correctamente durante la elaboración de esta documentación.
- No hay pruebas, linter, formateador, CI/CD, Docker ni infraestructura como código.
- El repositorio no tiene `.gitignore`: tras instalar o compilar, `node_modules/` y `dist/` aparecerían como archivos sin seguimiento.

## Desconocido o pendiente

- Versión de Node.js requerida y plataforma de despliegue: no declaradas.
- Datos reales de donaciones (CBU/alias, entidad receptora) y de series analíticas: `DONACION_NOTA` y la tarea `S-14` de `SPEC` los marcan como pendientes.
- Licencia del proyecto: no hay archivo de licencia.
