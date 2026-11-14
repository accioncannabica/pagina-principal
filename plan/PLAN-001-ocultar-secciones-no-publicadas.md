# PLAN-001: Ocultar secciones no publicadas

Issue de referencia: [ISSUE-001-ocultar-secciones-no-publicadas.md](../Issues/ISSUE-001-ocultar-secciones-no-publicadas.md)

## 1. Objetivo

Ocultar del sitio público las secciones **Spec & Skills** (`harness`), **Tienda** (`tienda`) y **Donaciones** (`donaciones`) sin borrar código, datos ni componentes, de forma que puedan reactivarse cambiando una sola propiedad.

## 2. Análisis del estado actual

### 2.1 Navegación central
- [src/types.ts](../src/types.ts) define:
  - `Vista` (líneas 1-12): unión de ids. Incluye `harness`, `tienda`, `donaciones`.
  - `ItemNav` (líneas 14-20): no tiene flag de visibilidad.
  - `NAV` (líneas 23-36): array fuente de sidebar, búsqueda, footer y validación de hash. `harness` está en la línea 32, `tienda` en la 33, `donaciones` en la 34, `contacto` en la 35.

### 2.2 Punto de consumo de `NAV` en la app
[src/App.tsx](../src/App.tsx) consume `NAV` en estos lugares:

| Línea | Uso | Efecto actual | Acción |
|---|---|---|---|
| 21-24 | Vista inicial desde `window.location.hash`, validada con `NAV.some(...)` | Permite abrir `#harness`, `#tienda`, `#donaciones` directamente | Validar contra la lista visible |
| 52-55 | Búsqueda: `NAV.filter(...).slice(0, 6)` | Aparecen en resultados | Usar lista visible |
| 75-80 | `switch` con casos `harness`, `tienda`, `donaciones` | Renderiza las secciones | **Mantener** (necesario para reactivar) |
| 88 | `NAV.find(...)!` para el header | Solo se ejecuta con la vista actual | Sin cambio funcional |
| 116-117 | Sidebar: `GRUPOS.map` con `NAV.filter((n) => n.grupo === g)` | Muestra los 3 ítems | Usar lista visible |
| 265 | Footer: `NAV.slice(0, 8)` | Hoy muestra los 8 primeros (inicio..eda), todos visibles | Filtrar antes de `slice` |

Notas:
- No existe listener de `hashchange`; el hash se lee solo al cargar (documentado en [docs/overview.md](../docs/overview.md), línea 56).
- Tras ocultar las 3 entradas, `NAV.slice(0, 8)` seguiría dando las mismas 8 entradas visibles, pero conviene filtrar primero para no depender de la posición.

### 2.3 Inicio
[src/sections/Inicio.tsx](../src/sections/Inicio.tsx):
- `ATAJOS` (desde la línea 13): entradas `tienda` (línea 21) y `donaciones` (línea 22). `contacto` (línea 23) se mantiene.
- Grilla de atajos con `lg:grid-cols-5`. Con 10 atajos se ven 5+5; con 8 quedarían 5+3.
- Línea 234: botón `irA("harness")` con texto "Ver spec, skills y mockups". Debe eliminarse.
- Bloque "Skills del equipo" (`SKILLS.slice(0,4)`, líneas 215-237): no depende de la sección `harness` pero su enlace principal desaparece (ver decisiones).
- Línea 1-5: `import type { Vista } from "../types"` debe pasar a `import { NAV_VISIBLE, type Vista } from "../types"`.
- Textos públicos de Inicio que mencionan el concepto interno (fuera del alcance literal del issue, ver decisiones): línea 45 ("Dashboard harness para el activismo cannábico") y líneas 128-133 (kicker "Spec driven · secciones", bajada "Cada sección responde a un requisito del spec del producto…").

### 2.4 Contacto
[src/sections/Contacto.tsx](../src/sections/Contacto.tsx):
- FAQ desde la línea 6. La respuesta de la línea 21 ("¿Reciben donaciones?") dice: *"Sí. La estructura de destino de fondos está publicada en la sección Donaciones; …"*. Apunta a una sección oculta y debe reescribirse.
- `CONTACTO.areas` en [src/data/content.ts](../src/data/content.ts) (líneas 366-381) incluye el área "Donaciones y alianzas", que se muestra en el selector del formulario y en la lista de áreas de Contacto (líneas 80 y 119). Es un área de contacto (no un enlace a la sección), por lo que **no requiere cambio**, pero conviene saberlo.

### 2.5 Referencias que NO requieren cambio
- [src/sections/Harness.tsx](../src/sections/Harness.tsx) líneas 122 y 125: botones a `tienda` y `donaciones`. El componente queda inaccesible, así que no tiene efecto visible. No se modifica el contenido de la sección (regla del issue).
- [src/sections/Facc.tsx](../src/sections/Facc.tsx) línea 127 y [src/sections/Redes.tsx](../src/sections/Redes.tsx) línea 95: mencionan "sección FACC" y "sección Redes", que siguen visibles.
- [src/data/content.ts](../src/data/content.ts): `SPEC` (S-08 Tienda, S-09 Donaciones), `TIENDA_NOTA`, `DONACION_NOTA`, `PRODUCTOS`, `DONACION_*`. Se conservan.
- [src/sections/Comercial.tsx](../src/sections/Comercial.tsx): sin cambios.

### 2.6 Documentación relacionada
- [README.md](../README.md): línea 15 (mockups de tienda y donaciones), línea 16 («Spec & Skills»), línea 20 («Las 12 vistas») y tabla de las líneas 28-29. Nota: el archivo ya figura como modificado en `git status` antes de este trabajo; revisar el diff antes de editarlo para no mezclar cambios.
- [docs/overview.md](../docs/overview.md): línea 44 (`NAV` alimenta sidebar, buscador y pie), 55 (hash), 57 (buscador) y 72-74 (tabla de vistas). Las líneas 83-86 y 103 describen tienda/donaciones como mockups y siguen siendo ciertas (el código se conserva).

### 2.8 Validaciones adicionales hechas sobre este plan
- Todas las líneas citadas de `types.ts`, `App.tsx`, `Inicio.tsx` y `Contacto.tsx` coinciden con el código actual.
- Línea de base: `npx tsc --noEmit` pasa sin errores antes de cualquier cambio.
- El buscador solo filtra `NAV` por `titulo + bajada` (App.tsx línea 54). No indexa el contenido de las secciones.
- Tras ocultar las 3 entradas ningún grupo del sidebar queda vacío: "Datos" conserva `eda` y "Acción" conserva `contacto`.
- Mantener los `import` de `Harness` y `Comercial` y los `case` del `switch` evita errores de `noUnusedLocals`.
- El footer actual (`NAV.slice(0, 8)`) ya muestra solo entradas visibles (inicio, quienes, recorrido, novedades, redes, facc, reprocann, eda); el filtrado previo solo lo hace robusto.

### 2.7 Convenciones y validación
- Stack: React 19.2.6, TypeScript 5.9.3 (strict, `noUnusedLocals`, `noUnusedParameters`), Vite 7.3.2, Tailwind 4.1.17. Versiones fijadas.
- Scripts en [package.json](../package.json): `dev`, `build` (`vite build` con `vite-plugin-singlefile`), `preview`. **No hay script `typecheck`**; usar `npx tsc --noEmit`.
- No hay tests ni linter configurados. No agregar tooling.
- Convención del repo ([.github/copilot-instructions.md](../.github/copilot-instructions.md)): identificadores y textos de UI en español; secciones como `export default` en `src/sections/`; navegación por estado + hash, sin router; `Vista` y `NAV` se actualizan juntos.

## 3. Diseño técnico propuesto

1. **Flag de visibilidad en `NAV`**: agregar `visible?: boolean` a `ItemNav`. Ausente = visible. Marcar `visible: false` en `harness`, `tienda` y `donaciones`.
2. **Lista derivada**: exportar `NAV_VISIBLE = NAV.filter((n) => n.visible !== false)` desde `types.ts`. Centraliza el filtrado (requisito del issue).
3. **App.tsx**: usar `NAV_VISIBLE` en hash inicial (21-24), búsqueda (52-55), sidebar (116-117) y footer (265, filtrar antes de `slice(0, 8)`).
4. **Inicio.tsx**: filtrar `ATAJOS` por visibilidad (`ATAJOS.filter((a) => NAV_VISIBLE.some((n) => n.id === a.vista))`) en lugar de borrar las líneas 21-22. Así las entradas quedan listas para reactivarse (RF-4). Eliminar el botón de la línea 234.
5. **Contacto.tsx**: reescribir la respuesta de la línea 21 sin mencionar la sección Donaciones. Propuesta: *"Sí. Para conocer cómo realizar un aporte, escribinos a accioncannabica@gmail.com; los datos bancarios se comunicarán de forma oficial por la Comisión Directiva."* (el correo ya aparece en la línea 9).
6. **Switch de App.tsx (75-80)**: se mantiene para que las vistas ocultas sigan siendo renderizables por reactivación.

Reactivar una sección = cambiar `visible: false` por `visible: true` (o quitarlo) en `NAV`. Los atajos de Inicio se reactivan solos, porque el filtro se basa en `NAV_VISIBLE`.

### Restricciones
- No borrar código, datos ni componentes.
- No cambiar estilos ni el contenido interno de las secciones ocultas.
- Sin dependencias nuevas.
- Comentarios solo donde haga falta aclarar (ej.: explicar que `visible: false` oculta pero conserva la sección).
- Mantener todos los ids de `Vista`.

## 4. Pasos de implementación

| # | Archivo | Cambio |
|---|---|---|
| 1 | `src/types.ts` | Agregar `visible?: boolean` a `ItemNav`; marcar `harness`, `tienda`, `donaciones` con `visible: false`; exportar `NAV_VISIBLE`. |
| 2 | `src/App.tsx` | Reemplazar `NAV` por `NAV_VISIBLE` en hash inicial, búsqueda, sidebar y footer (filtrar antes de `slice(0, 8)`). Mantener los `case` del `switch` y dejar `NAV.find(...)!` del header (línea 88) sobre `NAV` completo: con `NAV_VISIBLE` el `!` podría romper si alguna vez la vista activa fuera oculta. Cambiar el import de la línea 4 a `import { NAV, NAV_VISIBLE, type Vista } from "./types"`. |
| 3 | `src/sections/Inicio.tsx` | Filtrar `ATAJOS` por `NAV_VISIBLE`; eliminar el botón `irA("harness")` (líneas 234-236); cambiar el import de `../types` para traer `NAV_VISIBLE`. |
| 4 | `src/sections/Contacto.tsx` | Reescribir la respuesta de la FAQ de donaciones (línea 21). |
| 5 | `README.md`, `docs/overview.md` | Actualizar la lista de vistas para indicar que las 3 están ocultas y cómo reactivarlas. (Opcional según decisión.) |

Orden: 1 → 2 → 3 → 4 → 5. Los pasos 2 y 3 dependen de `NAV_VISIBLE`.

## 5. Validación

Comandos:
```powershell
npx tsc --noEmit
npm run build
```

Verificación manual con `npm run dev`:
- [ ] Sidebar: no aparecen "Spec & Skills", "Tienda" ni "Donaciones".
- [ ] Búsqueda: "tienda", "spec", "especif", "skills", "donaciones", "merch" no devuelven resultados.
- [ ] Sidebar: ningún encabezado de grupo queda vacío.
- [ ] Footer: muestra 8 entradas, todas visibles.
- [ ] Inicio: la grilla de atajos no muestra Tienda ni Donaciones; no aparece el botón "Ver spec, skills y mockups".
- [ ] URLs `#harness`, `#tienda`, `#donaciones` cargan `inicio`.
- [ ] Contacto: la FAQ de donaciones no menciona la sección Donaciones.
- [ ] Secciones visibles (Inicio, Redes, FACC, etc.) siguen funcionando.
- [ ] Criterios de aceptación del issue cumplidos.

No agregar tests nuevos (el repo no tiene framework de tests).

## 6. Decisiones pendientes

1. **Bloque "Skills del equipo" en Inicio**: tras quitar el botón, el bloque sigue visible sin enlace a la sección oculta. ¿Se oculta también, o se deja tal cual?
2. **Grilla de atajos**: con 8 atajos la grilla `lg:grid-cols-5` queda 5+3. ¿Se mantiene (sin cambios de estilo, como pide el issue) o se cambia a 4 columnas?
3. **Textos públicos que mencionan el concepto interno**: footer de App.tsx (línea 258: "dashboard harness", "especificación, inventario de skills, mockups interactivos"), Inicio línea 45 ("Dashboard harness…") y Inicio líneas 131-133 ("Spec driven", "requisito del spec del producto"). Están fuera del alcance literal del issue y no remiten a una sección oculta, pero exponen lenguaje interno. ¿Se ajustan en este issue o en otro? (Recomendación: dejarlos fuera y abrir un issue aparte.)
4. **Documentación**: ¿actualizar `README.md` y `docs/overview.md` (recomendado) o dejarlos como están? El issue no lo exige; el README ya tiene cambios sin commitear.

Decisión ya resuelta (no requiere respuesta): **filtrar `ATAJOS` en lugar de borrar las líneas 21-22**. El issue (alcance 4) habla de "quitar" los accesos, pero su instrucción 3 pide usar la lista de visibles también para los atajos de Inicio y RF-4 pide reactivación localizada; filtrar cumple las tres.

## 7. Riesgos

- Bajo: al ocultar la entrada de `NAV`, el enlace de `Harness.tsx` a Tienda/Donaciones queda sin ruta de acceso, lo cual es esperable porque el componente es inaccesible.
- Bajo: cambios de hash antiguos (`#harness`, etc.) caen a `inicio`. Es el comportamiento deseado.
- Bajo: el buscador solo recorre `NAV` (título y bajada), así que no hay otras fuentes de resultados. Con el filtro desaparecen las coincidencias "Spec & Skills" (también por "especificación" en su bajada), "Tienda" y "Donaciones".
- Bajo: `README.md` ya está modificado en el árbol de trabajo; editarlo sin revisar su diff puede mezclar cambios ajenos.
