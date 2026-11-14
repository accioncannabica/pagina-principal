# ISSUE-001: Ocultar secciones Spec & Skills, Tienda y Donaciones

- **Estado:** abierto
- **Tipo:** cambio de visibilidad (no se elimina código)
- **Prioridad:** alta, antes de publicar la página principal

## Contexto

La página principal ([`src/types.ts`](../src/types.ts), `NAV`) muestra tres secciones que no están listas para el público:

- `harness` → "Spec & Skills": documentación interna del proyecto (especificación, skills y mockups). Ver [`src/sections/Harness.tsx`](../src/sections/Harness.tsx).
- `tienda` → "Tienda": catálogo mockup, sin pasarela de pago ni stock real. Ver [`src/sections/Comercial.tsx`](../src/sections/Comercial.tsx).
- `donaciones` → "Donaciones": destino de fondos y montos de demostración, sin CBU/alias reales. Ver [`src/sections/Comercial.tsx`](../src/sections/Comercial.tsx).

Estas secciones se van a trabajar más adelante. Hasta entonces deben quedar **invisibles** para el visitante, sin perder el código ni los datos.

## Objetivo

Que ninguna de las tres secciones sea visible ni accesible desde la interfaz, manteniendo el código, los datos y los componentes para retomarlos después.

## Alcance

**Incluye**

1. Menú lateral: no mostrar "Spec & Skills", "Tienda" ni "Donaciones" (en [`src/App.tsx`](../src/App.tsx), los grupos se construyen con `NAV.filter(...)`).
2. Buscador global: no devolver resultados de esas tres secciones.
3. Pie de página: el listado de `NAV.slice(0, 8)` no debe incluir secciones ocultas. Revisar que el pie siga mostrando 8 entradas visibles o ajustar el número.
4. Portada ([`src/sections/Inicio.tsx`](../src/sections/Inicio.tsx)):
   - quitar los accesos rápidos a Tienda y Donaciones (líneas 21-22, lista de atajos);
   - quitar el botón "Ver spec, skills y mockups" (línea 234).
5. Acceso directo por URL: si se abre `#harness`, `#tienda` o `#donaciones`, la app debe mostrar `inicio`, igual que con un hash inexistente. Hoy esto se resuelve en `App.tsx` (línea 23) con `NAV.some(...)`, así que basta con que el filtrado use solo las entradas visibles.
6. Texto de [`src/sections/Contacto.tsx`](../src/sections/Contacto.tsx) (línea 21): la respuesta FAQ dice que "la estructura de destino de fondos está publicada en la sección Donaciones". Como esa sección queda oculta, el texto debe ajustarse para no remitir a una sección inexistente para el visitante.

**No incluye**

- Borrar componentes, datos (`SPEC`, `SKILLS`, `PRODUCTOS`, `DONACION_*`, `TIENDA_NOTA`, `DONACION_NOTA`) ni tipos.
- Cambiar el contenido o el diseño de esas tres secciones.
- Ocultar la sección "Contacto" ni ninguna otra.
- Crear issues en GitHub (ver nota al final).

## Requisitos funcionales

- RF-1: las entradas ocultas no aparecen en la barra lateral, el buscador, el pie ni los accesos de la portada.
- RF-2: navegar a `#harness`, `#tienda` o `#donaciones` muestra la portada.
- RF-3: las demás secciones (incluida Contacto) siguen funcionando igual.
- RF-4: para reactivar una sección debe bastar con un cambio localizado (idealmente un flag por entrada en `NAV`, por ejemplo `visible: false`, en lugar de borrarla).

## Criterios de aceptación

- [ ] Con la app en `npm run dev`, el menú lateral y el buscador no muestran "Spec & Skills", "Tienda" ni "Donaciones".
- [ ] El pie no muestra las tres secciones.
- [ ] La portada no tiene atajos ni botones que lleven a ellas.
- [ ] Abrir `#harness`, `#tienda` o `#donaciones` en el navegador muestra la portada.
- [ ] La FAQ de Contacto no menciona una sección oculta como si estuviera disponible.
- [ ] `npx tsc --noEmit` y `npm run build` terminan sin errores.
- [ ] No se eliminó ningún archivo ni dato.

## Archivos probablemente afectados

- `src/types.ts` (flag de visibilidad en `ItemNav` y entradas de `NAV`)
- `src/App.tsx` (filtrado de menú, buscador, pie y validación de hash)
- `src/sections/Inicio.tsx` (atajos y botón)
- `src/sections/Contacto.tsx` (texto de FAQ)

## Instrucciones para la IA

1. Leer este issue completo antes de tocar código.
2. Usar un flag de visibilidad por entrada de `NAV` (por ejemplo `visible?: boolean`, por defecto visible). Marcar `harness`, `tienda` y `donaciones` como ocultas. No borrar entradas.
3. Centralizar el filtro en un único lugar: derivar de `NAV` una lista de entradas visibles y usarla en menú, buscador, pie, validación de hash y atajos de Inicio.
4. Las secciones ocultas siguen siendo `Vista` válidas en el tipo, para poder reactivarlas. Si la validación de hash usa solo las visibles, la URL directa cae en `inicio`.
5. Ajustar el texto de la FAQ de Contacto sin cambiar el resto de respuestas.
6. No agregar comentarios salvo que aclaren algo no obvio.
7. No cambiar dependencias, estilos ni datos.
8. Validar con `npx tsc --noEmit` y `npm run build`. Verificar a mano los criterios de aceptación con `npm run dev`.

## Nota sobre GitHub

Este issue vive en el repositorio como archivo en `Issues/`. Si se decide también abrirlo como issue en GitHub (`accioncannabica/pagina-principal`), se puede crear con `gh issue create` usando el contenido de este archivo como cuerpo.
