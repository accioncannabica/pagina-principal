# PLAN-006: Reemplazar la presentación de Patrones de Consumo

Issue de referencia: https://github.com/accioncannabica/pagina-principal/issues/3

## 1. Objetivo

Reemplazar el deck React actual de once láminas por la presentación publicada del congreso «Cannabis, salud y soberanía», manteniendo la experiencia dentro de la sección «Presentación» de Patrones de Consumo.

## 2. Alcance

- Sustituir la presentación actual accesible en `#patrones/presentacion`.
- Insertar directamente la presentación publicada en Google Slides mediante un `iframe`.
- Conservar en la página las capacidades nativas del reproductor: avance, retroceso, selección de diapositivas y pantalla completa.
- Adaptar el iframe a escritorio y móvil respetando la proporción original 960 × 569.
- Mantener un enlace para abrir la presentación fuera de la página.
- No recrear, transcribir ni duplicar manualmente el contenido del deck.
- No modificar las restantes secciones de Patrones de Consumo ni sus datos.

## 3. Análisis técnico

La presentación vigente está implementada en `src/investigaciones/patrones/components/Presentation.tsx`. Define un arreglo local con textos y visualizaciones construidas en React, junto con controles propios.

La publicación proporcionada ya ofrece un reproductor compatible con navegadores y admite pantalla completa. Reemplazar el componente local por un iframe conserva la fidelidad exacta de la presentación, evita conversiones y no aumenta el bundle con imágenes o el archivo PowerPoint original.

El componente conservará los elementos de presentación habituales de la sección (`SectionHeader`, `Card`, `FadeIn` y `Badge`) y eliminará los estados, datos, gráficos y controles que pertenecían al deck anterior.

## 4. Diseño propuesto

- Encabezado:
  - «Presentación de proyecto de investigación».
  - «Patrones de consumo de cannabis y percepciones de salud en usuarios y usuarias de Argentina y América Latina».
  - Indicador de disponibilidad de pantalla completa.
- Introducción:
  - Título «Grandes interrogantes de nuestra investigación».
  - Cuatro preguntas provistas en la referencia visual, sobre frontera terapéutica/recreativa, efectos percibidos, frecuencia/problemas asociados y enfoque sobre sustancias o aplicación de la ley.
- Visor:
  - `iframe` publicado de Google Slides.
  - Ancho completo y proporción 960/569.
  - Bordes y fondo coherentes con las tarjetas de Patrones de Consumo.
  - Permisos `fullscreen` y `allowFullScreen`.
- Ayuda inferior:
  - Texto breve sobre navegación.
  - Enlace visible «Abrir presentación» en una pestaña externa.

## 5. Implementación prevista

1. Eliminar del componente `Presentation.tsx` los once datos de láminas, visualizaciones, importaciones y estado del deck anterior.
2. Definir como única URL fuente la publicación suministrada de Google Slides.
3. Renderizar un iframe responsive con título accesible y carga diferida.
4. Agregar antes del iframe el título y los cuatro interrogantes de la referencia entregada.
5. Conservar la tarjeta y los estilos locales de la sección.
6. Añadir enlace externo con `target="_blank"` y `rel="noreferrer"`.
7. Verificar que pantalla completa y controles pertenezcan al reproductor de Google Slides.

## 6. Pasos verificables

1. Abrir `#patrones/presentacion` desde una URL directa.
2. Confirmar que aparece la presentación publicada y no el deck anterior.
3. Avanzar y retroceder entre diapositivas con los controles del iframe.
4. Probar el modo de pantalla completa.
5. Probar el enlace «Abrir presentación».
6. Revisar la proporción y los controles en escritorio y móvil.
7. Confirmar que las demás vistas de Patrones de Consumo no cambiaron.
8. Ejecutar `npx tsc --noEmit`.
9. Ejecutar `npm run build`.

## 7. Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Google Slides no carga por una red o bloqueador externo | Mostrar la presentación mediante un enlace alternativo; verificar la publicación pública. |
| La publicación deja de estar disponible o cambia de identificador | Centralizar la URL en una constante y documentarla en el plan/issue. |
| El iframe se deforma en móviles | Usar `aspect-[960/569]` y ancho completo sin fijar altura. |
| El navegador limita pantalla completa dentro de un iframe | Declarar `allow="fullscreen"` y `allowFullScreen`; conservar también apertura externa. |
| Los cambios locales existentes se mezclan con esta tarea | Modificar únicamente `Presentation.tsx` y los artefactos del issue/plan. |

## 8. Decisiones confirmadas

- La presentación se mostrará directamente desde Google Slides.
- Se mantendrá el modo de pantalla completa del reproductor.
- Se agregará un enlace para abrir la presentación fuera de la página.
- No se copiará el PowerPoint al repositorio como descarga local.

## 9. Criterios de aceptación

- `#patrones/presentacion` muestra la presentación de Google Slides suministrada.
- Antes del reproductor aparecen el título institucional y las cuatro preguntas de la referencia visual.
- No se muestran las once láminas del deck React anterior.
- La presentación conserva su proporción y se adapta a escritorio y móvil.
- Funcionan los controles del reproductor y el modo de pantalla completa.
- El enlace externo abre la misma presentación.
- Las demás vistas de Patrones de Consumo no cambian.
- TypeScript y el build de Vite finalizan correctamente.
