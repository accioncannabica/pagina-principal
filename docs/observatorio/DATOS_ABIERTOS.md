# Observatorio Acción Cannábica

Se conservan las siete vistas anteriores, el espacio reservado para el logo y la
identidad institucional. Las vistas nuevas son Cultura, Atlas Territorial, Gasto
Judicial, EDA, Fuentes y Contacto.

## Qué Se Actualiza

- Al abrir cada vista se reconsulta `public/data/observatorio.json`.
- Cada 15 minutos, con la página visible, se reconsulta el catálogo. Puede pausarse.
- Atlas, EDA y Fuentes consultan la API pública NYPD, con una caché de 15 minutos.
- El botón de actualización fuerza ambas consultas. Un fallo conserva la última
  respuesta válida, sin cambiar la fecha de los datos ni reemplazar nulos por cero.
- `public/data/nyc-snapshot.json` es el respaldo agregado. Su copia de compilación
  en `src/data/snapshots/nyc.json` se incluye en el bundle para que la primera
  visualización no dependa de internet. El actualizador genera ambos archivos.
- Las fechas de consulta, de actualización del proveedor y del período estadístico
  se mantienen separadas.
- Las webs de organizadores y los informes PDF NO se extraen automáticamente.
- No hay una API mundial uniforme que actualice todos los indicadores anteriores.
  Esa base se conserva pero se señala como no auditada por registro. Sus precios,
  cantidades de ONGs y universidades no deben citarse como cifras oficiales.

## Actualización En GitHub

La acción `.github/workflows/open-data.yml` ejecuta semanalmente:

```sh
npm ci
npx tsx scripts/update-open-data.ts
```

La acción guarda únicamente agregados en `public/data/nyc-snapshot.json` y su
copia de compilación en `src/data/snapshots/nyc.json`.
Requiere habilitar Actions y permisos de escritura del repositorio. El despliegue
del sitio depende de la configuración de alojamiento y no se configura aquí.
Para GitHub Pages bajo una subcarpeta puede usarse `npm run build -- --base=./`.
Publicar todo `dist/`, incluido `dist/data/`, no solo el archivo HTML.

Para actualizar agenda, costos y nuevos agregados, editar el catálogo y desplegar,
o configurar en Fuentes una URL HTTPS de JSON con CORS (por ejemplo GitHub Raw).
No usar secretos en URLs ni archivos públicos. La URL se guarda solo en este
navegador. Importar un catálogo sirve como previsualización local: la siguiente
sincronización vuelve a leer la fuente configurada.

## Esquema Del Catálogo

Todos los arreglos son opcionales. `schemaVersion` y `publishedAt` son obligatorios.
Ejemplo estructural, sin cifras inventadas:

```json
{
  "schemaVersion": 1,
  "publishedAt": "2026-10-30T00:00:00Z",
  "countryUpdates": [],
  "events": [],
  "costs": [],
  "territory": []
}
```

Los tipos de `events`, `costs` y `territory` están en `src/data/research.ts`.
`src/lib/openData.ts` valida forma, país, unidades, enlaces HTTPS, coordenadas,
rangos y valores antes de aceptar una publicación.

Las correcciones de `countryUpdates` deben tener `iso`, `sourceUrl`, `period` y
`values`. Solo se aceptan los campos numéricos `prevalence`, `users` (millones),
`arrests` (tasa por 100.000), `acceptance`, `maxPrison` (años) y `pop` (millones).
No cargar conteos absolutos en la tasa de detenciones. Estas correcciones se
reflejan en el mapa anterior, tablas, agregados y ficha de país.

Para un agregado territorial se requieren: `id`, `iso`, `province`, `municipality`,
`level` (`country`, `province`, `municipality`), `lat`, `lon`, `year`, `arrests`,
`prosecuted`, `imprisoned`, `scope` (`cannabis`, `all-drugs`), `unit`
(`arrest-records`, `people`), `sourceUrl`, `sourceName` y `note`. `district` es
opcional. Las tres métricas deben ser números no negativos o `null`. Publicar
solo agregados no identificables y no mezclar stock de presos, flujos anuales,
personas únicas y registros policiales.

Los costos se expresan en millones de la moneda publicada (`USD`, `CAD`, `EUR`,
`ARS`), sin conversión automática ni inflación implícita. Para reemplazar una
referencia usar la misma combinación `iso` y `year`. Los eventos y territorios
se reemplazan por `id`.

## Cobertura Y Limitaciones

- NYPD: 2022–2025 en la instantánea inicial. Cinco distritos de la ciudad de Nueva
  York. Es una cobertura municipal parcial, NO un total estadounidense.
- Selección textual de `pd_desc` con MARIJUANA o CANNABIS. Puede no captar cambios
  en códigos o infracciones cuya descripción no contenga esos términos.
- Un registro de detención no prueba culpabilidad y no identifica personas únicas.
- La API no aporta procesos ni encarcelamiento: esas columnas quedan nulas.
- Heatmap: centroides por comisaría y año, al menos cinco registros, coordenadas
  redondeadas a 0,01 grados. No representa domicilios ni cada arresto individual.
  Celdas suprimidas implican que el calor no totaliza todos los registros.
- Nivel país: polígonos de Natural Earth, dominio público. NYC: límites de los
  cinco distritos de NYC DCP (`gthc-hcne`), con simplificación cartográfica de
  aproximadamente 60 metros. Otras provincias y municipios: centroides, no
  límites administrativos detallados. Mapa base: OpenStreetMap, con atribución,
  caché estándar del navegador y sin descarga de teselas para uso offline.
- MPBA: 7.567 personas privadas de libertad en Buenos Aires al 31/12/2023 por la
  Ley 23.737. Incluye TODAS las drogas, no solo cannabis. Capa contextual opcional,
  separada en violeta, excluida de indicadores cannabis y EDA de detenciones.
- Canadá: CSUCH 2020, 1.066,8 millones CAD de costos penales atribuibles, incluidos
  535,6 de policía, 198,3 de tribunales y 332,9 de servicios penitenciarios. No es
  solo persecución de posesión ni una partida presupuestaria ejecutada.
- EE. UU.: ACLU, estimación histórica redondeada de 3.600 millones USD para 2010.
  No se extrapola a 2026 ni se compara como equivalente al método canadiense.
- Las referencias originales de Canadá y EE. UU. se amplían con Argentina,
  Australia, Brasil e Inglaterra y un escenario separado para Alemania. Los países
  sin referencia incorporada siguen como N/D, no como gasto cero. Las definiciones,
  fuentes y cobertura ampliada se documentan en `FUENTES_JUSTICIA.md`.

## EDA Y Contacto

EDA calcula cuartiles interpolados, desviación estándar muestral, IQR y Pearson
por pares completos. No imputa faltantes ni infiere causalidad. CSV/JSON locales
de hasta 3 MB y 20.000 filas se analizan solo en memoria, sin subirlos a servidores.
Las exportaciones CSV escapan fórmulas para evitar interpretación en planillas.

Contacto: `accioncannabica@gmail.com` e Instagram `@accannabica`. El formulario
abre un borrador en el programa de correo; no envía ni almacena mensajes.

## Verificación

```sh
TZ=America/Argentina/Buenos_Aires npx tsx --test tests/statistics.test.ts
npx playwright install chromium
npx playwright test
npm run build
```

Las pruebas de navegador bloquean los servicios externos para verificar el
respaldo local sin descargar teselas en forma automatizada. El actualizador
`scripts/update-open-data.ts` prueba separadamente la conexión al proveedor real.

## Ampliación De Justicia

Ver `FUENTES_JUSTICIA.md` para las nuevas fuentes de costos argentinos, SNEEP,
21 municipios bonaerenses con cruce parcial, RUD 2025, muestra de causas de cannabis
y fuentes internacionales. El atlas ahora selecciona una colección por vez para
no mezclar stocks, flujos, muestras y operativos. El dataset SNEEP adicional del
EDA usa solamente provincias, evitando sumar país, provincias y municipios.

La tarea de GitHub también ejecuta `python3 scripts/update-argentina-data.py`.
Sus salidas son agregados, no el CSV de microdatos. Reprocesa el recurso SNEEP
2024 configurado y no descubre automáticamente nuevas ediciones.

Verificación ampliada: `npx tsx --test tests/*.test.ts` y `npx playwright test`.

## Congresos E Investigación Publicada

La especificación funcional está en `specs/science-congresses.spec.md`; el contrato
de validación en `harness/science-evidence.harness.json`; la habilidad reutilizable
en `skills/evidence-maps/SKILL.md`; y el mockup de referencia en
`mockups/science-evidence.svg`. Estos artefactos no agregan datos simulados al sitio.

`scripts/update-literature.ts` consulta OpenAlex con el tópico curado T10414
“Cannabis and Cannabinoid Research”, desde 2020 hasta la fecha de ejecución y con
retractados excluidos. Guarda total, agrupaciones exactas por año y país, los 100
trabajos más citados y 60 instituciones con coordenadas públicas. No descarga el
texto completo de las publicaciones.

La agrupación de país se basa en afiliaciones institucionales. Un artículo con
autores de varios países cuenta en todos ellos; por eso los conteos nacionales no
suman el total de trabajos. El calor usa trabajos afiliados por institución. La vista
de citas usa únicamente la muestra de 100 trabajos, no todo OpenAlex.

Los congresos se revisaron contra fuentes universitarias, científicas u oficiales:
UNAJ, UNR, CONICET/RACME, UNCo, ICRS, RSMj, CMCR, CCORC y MCC, entre otras.
El mapa cultural pesa cada edición documentada como 1; no estima asistencia.
Las webs de eventos requieren revisión editorial y no se scrapean semanalmente.

Verificación del contrato: `npx tsx scripts/validate-science-harness.ts`.