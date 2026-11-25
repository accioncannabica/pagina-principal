# PLAN-004: Reorganizar la vista de Machine Learning

Issue de referencia: https://github.com/accioncannabica/pagina-principal/issues/1

## 1. Objetivo

Mejorar la lectura de la vista avanzada de «Patrones de consumo» agrupando sus análisis en tres secciones independientes y explícitas: Matriz de correlación, Cluster K-Means y Random Forest. Cada bloque debe terminar con una conclusión breve basada en las métricas ya disponibles.

## 2. Alcance

- Renombrar la entrada de navegación «Mapa de calor y pesos» como «Machine Learning».
- Mantener la ruta interna `#patrones/avanzado`.
- Presentar tres bloques visualmente separados:
  - Matriz de correlación.
  - Cluster K-Means.
  - Random Forest.
- Ubicar PCA, perfiles de clustering y métricas auxiliares dentro del bloque metodológico correspondiente.
- Agregar a cada bloque una conclusión visible que responda qué se puede concluir.
- No modificar cifras, dataset ni fuentes del estudio.
- Preservar los cambios locales ya existentes en la carpeta de la investigación.

## 3. Análisis técnico

La navegación se define en `src/investigaciones/patrones/PatronesPage.tsx`. La vista actual está implementada en `src/investigaciones/patrones/components/Heatmap.tsx` y mezcla matriz de correlación, PCA, K-Means, Random Forest y validación ROC en una sola página lineal. Los datos ya contienen las métricas necesarias en `src/investigaciones/patrones/data/research.ts`.

La reorganización puede resolverse principalmente con JSX, manteniendo los componentes gráficos existentes y sin agregar dependencias.

## 4. Diseño propuesto

1. Encabezado general con el título «Machine Learning» y una descripción breve de los tres métodos.
2. Bloque «Matriz de correlación»:
   - Mapa de calor y lecturas clave.
   - PCA como apoyo para evaluar estructura latente.
   - Conclusión: las asociaciones lineales son débiles y no aparece un eje dominante de consumo–problemas.
3. Bloque «Cluster K-Means»:
   - Perfiles obtenidos por K-Means.
   - Indicadores de silhouette.
   - Conclusión: los grupos describen perfiles plausibles, pero las fronteras son difusas.
4. Bloque «Random Forest»:
   - Importancia de variables y curva ROC.
   - Conclusión: la edad encabeza la importancia relativa, pero el modelo no predice la percepción de problemas mejor que el azar.
5. Mantener los modelos complementarios posteriores sin incorporarlos a estas tres conclusiones principales.

## 5. Pasos verificables

1. Actualizar la etiqueta y descripción del elemento `avanzado` en `PatronesPage.tsx`.
2. Refactorizar el markup de `Heatmap.tsx` en tres secciones semánticas con títulos, iconos y separadores.
3. Mover los elementos existentes a la sección correcta sin duplicar gráficos:
   - Correlación + PCA.
   - K-Means + silhouette.
   - Random Forest + pesos + ROC.
4. Añadir una tarjeta de conclusión al final de cada sección, diferenciada por color.
5. Ejecutar `npx tsc --noEmit`.
6. Ejecutar `npm run build`.
7. Revisar visualmente la ruta `#patrones/avanzado` en viewport escritorio y móvil.

## 6. Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Interpretar métricas descriptivas como causalidad | Redactar conclusiones con alcance exploratorio y no causal. |
| Duplicar o desplazar visualizaciones al reordenar JSX | Verificar que cada gráfico existente aparezca una sola vez. |
| Pisado de cambios locales | Editar únicamente las zonas necesarias e integrar el diff actual. |
| Sobrecarga visual por títulos y conclusiones | Usar jerarquía breve, separadores y tarjetas compactas. |

## 7. Criterios de aceptación

- La navegación muestra «Machine Learning».
- Matriz de correlación, Cluster K-Means y Random Forest tienen títulos y contenedores claramente separados.
- Cada sección contiene una conclusión explícita y coherente con sus métricas.
- No cambian los valores analíticos ni el significado de los resultados.
- `npx tsc --noEmit` y `npm run build` finalizan correctamente.
