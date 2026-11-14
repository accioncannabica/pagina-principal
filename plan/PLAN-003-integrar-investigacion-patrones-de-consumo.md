# PLAN-003: Integrar el proyecto «Patrones de consumo y percepciones de salud»

Issue de referencia: [ISSUE-003-integrar-investigacion-patrones-de-consumo.md](../Issues/ISSUE-003-integrar-investigacion-patrones-de-consumo.md)

> **Estado de implementación (2026-11-14):** Sin iniciar. Este documento define el plan para que otra IA ejecute la integración.

## 1. Objetivo

Migrar el micrositio React alojado en `investigacion/` al proyecto principal, de modo que la vista `patrones` (grupo «Investigaciones») reemplace el placeholder por la investigación completa con su navegación, gráficos y datos estáticos, manteniendo la coherencia visual/funcional del tablero y la distinción demo/real del contenido.

## 2. Línea de base

### 2.1 Shell principal (`pagina-principal`)
- Stack: React 19.2.6, TypeScript 5.9.3, Tailwind CSS 4.1.17, Vite 7.3.2, `vite-plugin-singlefile`.
- Dependencias fijadas sin rangos (`package.json`). Scripts: `dev`, `build`, `preview`, comandos del observatorio y pruebas `test:observatorio`.
- Navegación: estado + hash, sin router. `NAV_VISIBLE` controla menú, buscador, pie y validación de hash. `case "patrones"` en `src/App.tsx` devuelve `<EnConstruccion titulo="Patrones de Consumo" />`.
- `src/types.ts` define la vista `patrones` con `grupo: "Investigaciones"`. No existe `src/sections/Patrones.tsx`.
- Estilos globales en `src/index.css` usan tokens `ink-*`, `lima-*`, `verde-*` y respetan `prefers-reduced-motion`.

### 2.2 Proyecto `investigacion/`
- Shell propia (`src/App.tsx`) que controla sidebar, ticker, topbar, navegación por `SectionId` usando `useState` y `AnimatePresence` (`framer-motion`).
- Datos centralizados en `src/data/research.ts` (estadísticos, tablas, textos descriptivos).
- Componentes en `src/components/` (`Overview`, `Eda`, `Heatmap`, `Harness`, `Specs`, `Skills`, `Mockups`, `Presentation`, `Conclusions`, `Codigo`, `Referencias`, `Contacto`, `ui.tsx`).
- Dependencias adicionales: `framer-motion`, `recharts`, `lucide-react` (versión con `^`), `tailwind-merge`, `clsx`.
- Estilos específicos en `src/index.css` (tema oscuro esmeralda, animaciones `FadeIn`, ticker). No hay `prefers-reduced-motion` explícito.
- No contiene tests ni scripts adicionales.

## 3. Decisiones a confirmar con el usuario

| ID | Pregunta | Recomendación por defecto |
| --- | --- | --- |
| D-1 | ¿Usar sub-rutas `#patrones/<subvista>` para reflejar la sección interna en el hash? | Sí, replicar esquema del observatorio para deep links y acceso directo. |
| D-2 | ¿Mantener la estética original (sidebar propia, ticker) dentro de la vista o adaptarla completamente al shell actual? | Mantener contenidos y jerarquías, pero encapsularlos en un contenedor que herede tipografías/colores del tablero (paleta lima/verde). |
| D-3 | ¿Corregir manualmente los textos con caracteres corruptos (`Â`, `Ã`) reescribiendo strings? | Sí, reescribir literales en UTF-8 claro durante la migración. |
| D-4 | ¿Crear un subdirectorio dedicado (`src/investigaciones/patrones/`) para aislar componentes y estilos? | Sí, facilita mantenimiento y evita colisiones con `src/components/` existentes. |
| D-5 | ¿Conservar el ticker y atajos del micrositio como parte de la vista? | Sí, siempre que se encapsule para no interferir con el ticker global del tablero. |

Si no hay respuesta, aplicar la recomendación y registrarlo en el informe final.

## 4. Estrategia general

1. **Encapsular**: trasladar el micrositio bajo `src/investigaciones/patrones/` con componentes, datos y estilos propios, exponiendo un único componente `PatronesPage` que se monte dentro de `case "patrones"`.
2. **Reutilizar utilidades existentes** (`cn`, theme Tailwind) evitando duplicados. Adaptar estilos personalizados para convivir con el shell (prefijos CSS, clases scoped).
3. **Sincronizar hashes**: permitir enlaces internos del estudio (`#patrones/<subvista>`) sin romper la navegación global ni el buscador.
4. **Alinear dependencias**: incorporar `framer-motion` con versión exacta, alinear `lucide-react`/`recharts` con las ya presentes (usar la misma versión o subir la raíz si es compatible).
5. **Actualizar documentación e instrucciones** reflejando la nueva sección y su mantenimiento.

## 5. Plan de implementación

### Fase 0 · Preparación
1. Confirmar decisiones D-1 a D-5.
2. Ejecutar `npx tsc --noEmit` y `npm run build` para tener baseline limpia.
3. Crear snapshot local de `investigacion/` (por si se necesita comparar). Opcional: `Copy-Item investigacion src/investigaciones/patrones-orig -Recurse` dentro de `/tmp` solo para referencia temporal.

### Fase 1 · Estructura y dependencias
4. Crear directorio `src/investigaciones/patrones/` con subcarpetas `components/`, `data/`, `hooks/` (si aplica) y `styles/`.
5. Copiar `src/data/research.ts` como `src/investigaciones/patrones/data/research.ts`, corrigiendo encoding (`ñ`, comillas) durante la copia.
6. Copiar componentes relevantes (`Overview`, `Eda`, etc.) ajustando imports relativos para apuntar al nuevo layout.
7. Crear wrapper `src/investigaciones/patrones/PatronesPage.tsx` que replique la lógica de `App.tsx` (estado sección, ticker, animaciones) pero sin elementos globales (sidebar, topbar) que ya ofrece la shell.
8. Agregar `framer-motion` al `package.json` de la raíz con versión exacta (`14.9.0` → fijar sin `^`). Actualizar `package-lock.json` con `npm install framer-motion@14.9.0 --save-exact`.
9. Verificar si `lucide-react` y `recharts` del micrositio coinciden con la raíz. Si difieren, alinear: usar versiones existentes (1.65.0 para `lucide-react`, 3.10.1 para `recharts`). Ajustar imports en componentes si cambia API.

### Fase 2 · Componentes y datos
10. Adaptar `ui.tsx` del micrositio: reutilizar `src/components/ui.tsx` cuando sea equivalente; para elementos exclusivos, crear `components/` propios (`Card`, `SectionHeader`, etc.) bajo el subdirectorio.
11. Revisar componentes que dependan de globales (e.g., iconos, `cn`). Importar `cn` desde `src/utils/cn.ts` para evitar duplicado.
12. Encapsular ticker, grupos y navegación dentro de `PatronesPage`:
    - Mantener estructura de secciones (`SectionId`).
    - Convertir la barra lateral en un panel interno (usar `section` con scroll y estilos scoped).
    - Si D-1 se aprueba, sincronizar sub-rutas usando `history.replaceState` (no `window.location.hash = …`). El shell seguirá controlando el segmento principal `#patrones`; `PatronesPage` solo actualizará el sub-segmento (`#patrones/<subvista>`). Propagar el valor inicial del sub-hash mediante prop.
13. Sustituir literales con encoding corrupto por strings UTF-8 limpios durante la transcripción del dataset y textos.

### Fase 3 · Integración con la shell
14. Crear archivo `src/sections/Patrones.tsx` que importe `PatronesPage` y lo envuelva en contenedores compatibles con la shell (por ejemplo, un `div` con clases `space-y-6`). No necesitará `irA`; la navegación interna se maneja dentro del módulo.
15. En `src/App.tsx`, reemplazar `case "patrones": return <EnConstruccion .../>;` por `<Patrones />`.
16. Ajustar `NAV` si la bajada debe reflejar el contenido actualizado (ej. “Encuesta y análisis de patrones de consumo”).
17. Validar que el buscador global (filtra por `titulo`/`bajada`) continúe funcionando y retorne una sola entrada.
18. Si se adopta D-1, ampliar la lógica del hash inicial para soportar `#patrones/<subvista>` (validar primer segmento) y propagar la subvista a `PatronesPage` mediante props o un store local.

### Fase 4 · Estilos y accesibilidad
19. Crear `styles/patrones.css` (opcional) y usar `@reference "../../index.css"` para acceder a tokens existentes.
20. Prefijar clases exclusivas con `.patrones-root`. En el JSX de `PatronesPage`, envolver contenido en `<div className="patrones-root">`. Mantener ticker y animaciones propias, pero evitar resets globales. Reescribir las animaciones usando Tailwind o `@keyframes` locales.
21. Revisar animaciones (`FadeIn`, `AnimatePresence`). Añadir salvaguardas `prefers-reduced-motion` (p. ej. no ejecutar animaciones si `window.matchMedia('(prefers-reduced-motion: reduce)').matches`).
22. Cambiar encabezados `h1` internos del micrositio a `h2`/`h3` para evitar colisión con el `h1` del shell.

### Fase 5 · Limpieza y documentación
23. Actualizar `docs/overview.md` con la incorporación de la investigación (sección Investigaciones).
24. Añadir instrucciones a `.codex/instructions.md` y `docs/codex.md` sobre cómo mantener la vista (datos, dependencias, scripts inexistentes).
25. Actualizar `.github/copilot-instructions.md` si se mencionan vistas o datasets.
26. Una vez validado, eliminar la carpeta `investigacion/` o moverla a `archive/` según decisión (por defecto, eliminar). Antes de borrarla, comparar contenido con el módulo migrado y documentar la eliminación.

### Fase 6 · Validaciones
27. Ejecutar en la raíz:
    - `npx tsc --noEmit`
    - `npm run build`
    - (Opcional) `npm run test:observatorio` para garantizar que no se rompió nada en scripts existentes.
28. Navegar con `npm run dev` y validar manualmente:
    - Menú Investigaciones → Patrones muestra el estudio sin errores de consola.
    - Cada subsección principal (`Resumen`, `Exploración`, `Mapa de calor`, `Harness`, `Specs`, `Skills`, `Encuesta`, `Presentación`, `Conclusiones`, `Código`, `Referencias`, `Contacto`).
    - Ticker y animaciones responden a `prefers-reduced-motion`.
    - Hash `#patrones/<subvista>` mantiene la subvista activa al recargar.
    - El buscador global y la navegación lateral siguen funcionando como antes.
29. Verificar que el buscador global, enlaces en pie y menú siguen funcionando como antes y que `Patrones` mantiene el estado al interactuar con otras partes del shell (evitar remontado inesperado).

## 6. Salidas
- Código migrado bajo `src/investigaciones/patrones/`.
- `src/sections/Patrones.tsx` expone la vista integrada.
- `case "patrones"` en `src/App.tsx` renderiza el nuevo módulo.
- Dependencias alineadas (incluye `framer-motion`).
- Documentación actualizada.
- Carpeta `investigacion/` removida o archivada según acuerdo.

## 7. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
| --- | --- | --- |
| Incremento de bundle único (`framer-motion`, dataset grande) | build más pesado, posible degradación performance en Single File | Revisar tamaño final de `dist/index.html`; considerar carga diferida de gráficos pesados si excede límites aceptables. |
| Conflicto de estilos (clases globales, fuentes) | Interferencia con el shell | Encapsular en `.patrones-root`, usar tokens existentes, eliminar resets globales del micrositio. |
| Hash routing inconsistente | Navegación rota o secciones inaccesibles | Validar `#patrones` y subrutas con `NAV_VISIBLE`; añadir fallback a vista por defecto. |
| Literales con encoding corrupto | Presentación poco profesional | Reescribir strings en UTF-8 al migrar, revisar especialmente dataset y títulos. |
| Dependencias duplicadas/obsoletas | Errores de build o versión | Alinear versiones en `package.json`, evitar `^`. |
| Falta de pruebas automatizadas | Recae en verificación manual | Documentar pasos de QA manual en este plan y en instrucciones finales. |

## 8. Instrucciones para la IA implementadora

1. Leer este plan completo y el issue asociado antes de editar.
2. Confirmar decisiones D-1 a D-5 con el usuario; si no responde, aplicar recomendaciones y mencionarlo en el reporte.
3. Seguir las fases en orden, generando commits lógicos (cuando estén habilitados) y verificando `tsc` + `build` tras cambios significativos.
4. No inventar scripts ni integrar APIs reales. Mantener distinción entre contenido institucional y datos demo (`demo: true`).
5. No modificar secciones ajenas salvo que se indique explícitamente en este plan.
6. En el reporte final, listar pasos ejecutados, comandos de validación y cualquier desviación.

