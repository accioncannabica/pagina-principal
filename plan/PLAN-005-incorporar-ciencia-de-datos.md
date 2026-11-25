# PLAN-005: Incorporar la sección «Ciencia de Datos»

Issue de referencia: https://github.com/accioncannabica/pagina-principal/issues/2

## 1. Objetivo

Agregar una introducción visual, breve y accesible a Ciencia de Datos antes de los resultados de la investigación. La nueva vista debe explicar los conceptos necesarios para que una audiencia no técnica pueda comprender las secciones posteriores sin confundir Ciencia de Datos, análisis de datos, predicción, agrupamiento o causalidad.

## 2. Alcance

- Incorporar «Ciencia de Datos» como primera pestaña del grupo «Investigación».
- Mantener el orden visible:
  1. Ciencia de Datos.
  2. Resumen del estudio.
  3. Exploración (EDA).
  4. Machine Learning.
- Usar `ciencia-datos` como subruta interna (`#patrones/ciencia-datos`).
- Convertirla en la sección predeterminada al ingresar a `#patrones` o a una subruta inválida.
- Crear una nueva vista con siete bloques progresivos:
  1. Definición e integración de la Ciencia de Datos.
  2. Análisis de datos y correlación.
  3. Problemas de Machine Learning.
  4. Proceso de Machine Learning.
  5. Algoritmos principales.
  6. Aplicaciones.
  7. Importancia para la investigación científica.
- Agregar al final el CTA «Ver cómo aplicamos estas herramientas en nuestra investigación», enlazado a «Resumen del estudio».
- No modificar contenido, datos, cifras ni estructura interna de las vistas «Resumen del estudio», «Exploración (EDA)» y «Machine Learning».

## 3. Análisis técnico

La navegación interna se define en `src/investigaciones/patrones/PatronesPage.tsx`. Cada pestaña usa un `SectionId` y un registro `VIEWS`, mientras que `src/sections/Patrones.tsx` valida la subruta y selecciona la vista inicial.

La nueva vista puede implementarse como un componente autónomo en `src/investigaciones/patrones/components/CienciaDatos.tsx`. Reutilizará las primitivas visuales locales `Card`, `SectionHeader`, `Badge` y `FadeIn`, además de iconos existentes de `lucide-react`. No requiere nuevas dependencias ni cambios en datasets.

La transición al resumen requiere recibir `onSectionChange` o un callback equivalente. Para preservar el tipado actual, el mapa `VIEWS` continuará manejando componentes sin props y `PatronesPage` podrá resolver el caso especial del CTA sin alterar las vistas existentes.

## 4. Diseño propuesto

1. Encabezado breve:
   - Título «Ciencia de Datos».
   - Bajada orientada a comprender fenómenos y convertir datos en evidencia.
2. Diagrama de integración:
   - Cuatro tarjetas compactas para Datos, Estadística, Tecnología y Conocimiento del dominio.
   - Frase central destacando que predecir es solo una de varias posibilidades.
3. Análisis de datos:
   - Lista visual de herramientas descriptivas.
   - Tres ejemplos gráficos simples de correlación positiva, negativa y sin relación lineal clara.
   - Advertencia explícita: asociación no demuestra causalidad.
4. Machine Learning:
   - Cuatro tarjetas comparables para regresión, clasificación, clustering y detección de anomalías.
5. Flujo de trabajo:
   - Ocho etapas conectadas y adaptables a una columna en móvil.
   - Mensaje sobre evaluación, confiabilidad y posible ausencia de capacidad predictiva.
6. Algoritmos:
   - Cuatro tarjetas breves para regresión lineal, regresión logística, K-Means y Random Forest.
   - Sin fórmulas ni detalles internos.
7. Aplicaciones e importancia científica:
   - Grilla compacta de áreas y usos.
   - Lista breve de capacidades aportadas a la investigación.
8. Cierre:
   - Frase destacada: «La Ciencia de Datos no reemplaza al método científico: amplía sus herramientas para transformar datos en evidencia».
   - CTA principal hacia «Resumen del estudio».

## 5. Implementación prevista

1. Crear `src/investigaciones/patrones/components/CienciaDatos.tsx`.
2. Extender `SectionId` con `ciencia-datos` en `PatronesPage.tsx`.
3. Agregar la pestaña antes de `resumen`, conservando clases y estilos actuales.
4. Registrar la nueva vista y conectar el CTA con el cambio interno de sección.
5. Actualizar `src/sections/Patrones.tsx`:
   - Validar la nueva subruta.
   - Cambiar `DEFAULT_SECTION` a `ciencia-datos`.
6. Mantener sincronización de hash con `history.replaceState` y el comportamiento responsive actual.
7. Verificar manualmente los flujos:
   - `#patrones` abre Ciencia de Datos.
   - `#patrones/ciencia-datos` mantiene la pestaña activa.
   - El CTA abre `#patrones/resumen`.
   - Las tres pestañas existentes se comportan sin cambios.

## 6. Pasos verificables

1. Ejecutar `npx tsc --noEmit`.
2. Ejecutar `npm run build`.
3. Revisar escritorio y móvil de:
   - Navegación del grupo «Investigación».
   - Estados activo e inactivo de pestañas.
   - Flujo de ocho pasos.
   - Correlaciones positiva, negativa y nula.
   - CTA final y transición al resumen.

## 7. Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Demasiado texto para una presentación pública | Limitar cada bloque a una frase, una lista corta y recursos visuales. |
| Confundir Machine Learning con Ciencia de Datos | Presentar Machine Learning como una rama dentro de Ciencia de Datos. |
| Interpretar correlación como causalidad | Mostrar una advertencia junto a la visualización y repetirla en lenguaje simple. |
| Alterar accidentalmente pestañas existentes | Aislar la nueva vista y modificar solo el registro, el tipado y el valor predeterminado. |
| Mala lectura en pantallas pequeñas | Usar grillas responsivas, `flex-wrap`, ancho completo y secuencia vertical en móvil. |

## 8. Criterios de aceptación

- «Ciencia de Datos» aparece antes de «Resumen del estudio» y queda activa al entrar al apartado.
- El diseño de pestañas activo e inactivo conserva la identidad visual existente.
- Se explican los siete temas solicitados con lenguaje accesible y apoyo visual.
- La relación entre análisis, predicción, agrupamiento y detección de anomalías queda diferenciada.
- Correlación positiva, negativa y ausencia de relación lineal se muestran claramente, con la aclaración de no causalidad.
- El cierre incluye la frase científica solicitada y el CTA lleva a «Resumen del estudio».
- Las vistas existentes no cambian.
- TypeScript y el build de Vite finalizan correctamente.
