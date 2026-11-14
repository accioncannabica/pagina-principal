# ISSUE-003: Integrar el proyecto "Patrones de consumo" en la sección Investigaciones

- **Estado:** implementado (pendiente de validación final)
- **Tipo:** nueva funcionalidad (integración de un proyecto existente)
- **Plan técnico:** [PLAN-003-integrar-investigacion-patrones-de-consumo.md](../plan/PLAN-003-integrar-investigacion-patrones-de-consumo.md)
- **Implementación:** [IMPLEMENTACION-003-integrar-investigacion-patrones-de-consumo.md](../implementacion/IMPLEMENTACION-003-integrar-investigacion-patrones-de-consumo.md)
- **Prioridad:** alta
- **Siguiente paso:** validar en entorno local (`npx tsc --noEmit`, `npm run build`, navegación manual) y cerrar issue si todo pasa.

## Contexto

En la raíz del repositorio hay un proyecto React independiente en [`investigacion/`](../investigacion/) que replica un micrositio interactivo llamado **«Patrones de consumo y percepciones de salud»**. Está construido con Vite + Tailwind 4, usa `framer-motion`, `recharts` y `lucide-react`, y define su propio `App.tsx` como shell completo (sidebar, ticker, topbar, navegación interna, contenido). La aplicación principal ya tiene reservada la vista `patrones` dentro del grupo **Investigaciones** (`NAV` en [`src/types.ts`](../src/types.ts)), pero hoy solo muestra el placeholder `<EnConstruccion titulo="Patrones de Consumo" />`.

## Objetivo

Que la vista `patrones` de la página principal renderice el micrositio de investigación con todas sus secciones y funcionalidades, integrado al shell existente (menú lateral, buscador global, hash routing, pie), sin duplicar proyectos ni romper la consistencia visual/funcional del tablero.

## Qué contiene `investigacion/`

### Aplicación (`src/`)

- `App.tsx`: mantiene el estado `section`, agrupa navegación por `grupo`, controla el ticker y las transiciones entre secciones (usa `AnimatePresence`/`motion` de `framer-motion`).
- `components/`: 12 vistas temáticas (`Overview`, `Eda`, `Heatmap`, `Harness`, `Specs`, `Skills`, `Mockups`, `Presentation`, `Conclusions`, `Codigo`, `Referencias`, `Contacto`) más utilidades compartidas (`ui.tsx`, cards, badges, tooltips).
- `data/research.ts`: dataset estático (metadatos del estudio, bins de edad/género, resultados de encuestas, matrices de correlación, series para gráficos), además de descripciones de scripts y mockups.
- `utils/cn.ts`: helper Tailwind (`clsx` + `tailwind-merge`).

### Configuración y dependencias

- `package.json`: duplica el stack base (React 19, Tailwind 4, `vite-plugin-singlefile`) y añade `framer-motion` (`^14.9.0`). Usa rangos con `^` para `lucide-react` y `recharts`, lo que no coincide con las versiones fijadas en la app principal.
- `tsconfig.json`, `vite.config.ts`, `index.html` y `src/index.css` definen tema oscuro propio (fuentes `Space Grotesk` + `JetBrains Mono`, acentos esmeralda) y las animaciones `FadeIn`/ticker.

## Alcance

**Incluye**

1. Migrar el código y los datos necesarios de `investigacion/` al árbol principal (`src/`), integrándolos como la vista real de `patrones`.
2. Unificar dependencias: agregar `framer-motion` (versión exacta) y ajustar `lucide-react`/`recharts` si se reutiliza código compartido.
3. Adaptar componentes/estilos para que usen las utilidades existentes (`cn`, tokens `ink-*`, `lima-*`, respeto a `prefers-reduced-motion`) sin romper la propuesta visual del estudio.
4. Exponer la navegación interna del estudio dentro de la vista `patrones` sin interferir con la navegación global: hash compatible (`#patrones/...`) o manejo de estado local que conviva con el shell.
5. Actualizar documentación (`docs/overview.md`, `.codex/instructions.md`, `docs/codex.md`, `.github/copilot-instructions.md`) y, si corresponde, datasets referenciados en `src/data/`.
6. Eliminar o archivar la carpeta `investigacion/` una vez migrada (sin dejar dependencias huérfanas).

**No incluye**

- Cambiar conclusiones, cifras o textos científicos del estudio (solo corregir encoding/acentos si se corrompieron al copiar).
- Añadir fuentes de datos nuevas ni backends; todo sigue siendo contenido estático/local.
- Implementar pruebas automáticas (no existen en el proyecto original).
- Rediseñar por completo la vista Investigaciones ni mover otras secciones del tablero.

## Requisitos funcionales

- RF-1: La vista `patrones` debe mostrar el mismo contenido seccional que `investigacion/src/App.tsx`, con sus 10+ subsecciones navegables.
- RF-2: El ticker, las animaciones (respetando `prefers-reduced-motion`), los gráficos `recharts` y las tarjetas estadísticas funcionan sin errores de consola.
- RF-3: La navegación global (`NAV`, hash, buscador, pie) sigue operativa; al entrar en `#patrones` la shell no se vuelve a montar.
- RF-4: Todos los datos provienen de fuentes locales (`src/data/...`); no se ejecutan `fetch` ni side effects externos.
- RF-5: El contenido respeta encoding UTF-8; los textos no muestran caracteres corruptos.

## Criterios de aceptación

- [ ] `npm ci`, `npx tsc --noEmit` y `npm run build` terminan sin errores en la raíz tras la integración.
- [ ] Con `npm run dev`, `#patrones` reemplaza el placeholder por la investigación completa y cada subsección se puede abrir (navegación lateral interna, resaltado actual, scroll al top).
- [ ] Los gráficos y métricas del estudio muestran los mismos resultados que el proyecto original (comparado manualmente).
- [ ] El buscador global y el menú lateral siguen listando una sola entrada para «Patrones de Consumo».
- [ ] No quedan referencias a `investigacion/` ni dependencias duplicadas fuera de `src/`.
- [ ] La documentación y las instrucciones de Codex/Copilot mencionan la nueva integración y cómo actualizarla.

## Archivos probablemente afectados

- `src/App.tsx` (cambio de `case "patrones"` y posible manejo de hash interno).
- `src/sections/` (nuevo/reestructurado `Patrones.tsx` y componentes auxiliares).
- `src/data/` (nuevos módulos para el dataset del estudio, ticker, metadatos).
- `src/components/` o subdirectorios dedicados a investigaciones.
- `package.json`, `package-lock.json` (nueva dependencia `framer-motion`, ajustes de versiones exactas).
- `src/index.css` y/o CSS modularizado para el estudio.
- `docs/overview.md`, `docs/codex.md`, `.codex/instructions.md`, `.github/copilot-instructions.md`.
- Carpeta `investigacion/` (para mover o eliminar tras migrar).

## Decisiones abiertas

1. ¿Se migra el layout tal cual (`App.tsx` monolítico) o se descompone en componentes React reutilizables bajo `src/investigaciones/patrones/`?
2. ¿Cómo se sincroniza la navegación interna con el hash global (`#patrones/{subvista}`) sin romper los enlaces existentes?
3. ¿Dónde residirán los estilos específicos (CSS modular vs Tailwind + `@apply`)?
4. ¿Qué hacer con las utilidades duplicadas (`cn`, componentes UI) para evitar código redundante?
5. ¿Cómo se corrigen los caracteres mal codificados (¿forzar UTF-8 al migrar, reescribir strings, usar `iconv`)?

## Riesgos

- Inflar el bundle único (`vite-plugin-singlefile`) al incorporar animaciones, gráficos y dataset (~45 KB en `research.ts`).
- Conflictos de estilos/animaciones con la shell (clases Tailwind personalizadas, sombras, fondos).
- Desalineación de dependencias (versiones con `^` o peer conflicts de `framer-motion`).
- Pérdida de funcionalidad del micrositio si se simplifica demasiado la navegación.
- Texto corrupto por encoding o copy/paste (acentos mostrados como `Â`, `Ã`).

## Instrucciones para la IA / planificador

1. Leer este issue completo y revisar el proyecto `investigacion/` (especialmente `App.tsx`, `components/`, `data/research.ts`, `src/index.css`) junto con [`docs/overview.md`](../docs/overview.md) y las instrucciones de Codex/Copilot.
2. Redactar `plan/PLAN-003-integrar-investigacion-patrones-de-consumo.md` describiendo el enfoque de migración, estructura de componentes, gestión de hash y ajustes de dependencias.
3. Respetar las convenciones de la página principal: textos en español, theme Tailwind, distinción demo/real, accesibilidad.
4. No añadir scripts o comandos extra sin definirlos explícitamente.
5. Validar con `npx tsc --noEmit`, `npm run build` y chequeo manual en `npm run dev` antes de cerrar la implementación.

