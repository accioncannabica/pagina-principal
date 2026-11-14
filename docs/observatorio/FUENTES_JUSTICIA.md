# Evidencia De Justicia Y Leyes De Drogas

Revisión documental: 30 de octubre de 2026. Se conservan las vistas anteriores.
No se presenta una estimación de investigación como gasto ejecutado ni un stock
penitenciario como detenciones anuales.

## Argentina: Costos Fiscales

Fuente primaria: RESET, **Costo económico en la persecución de personas que usan
drogas**, publicado en septiembre de 2019, apartado IV.e:
https://resetdrogas.com.ar/index.php/2019/09/22/mas-de-40-millones-de-dolares-al-ano-gasta-el-estado-en-criminalizar-a-personas-usuarias-de-drogas/

| Ejercicio | Estimación de conductas vinculadas al uso | Pesos nominales reportados por la misma fuente | Referencia por causa de tenencia |
| --- | --- | --- | --- |
| 2016 | 42,5 millones USD | 621 millones ARS | 2.600 USD |
| 2017 | 45 millones USD | 782 millones ARS | 3.300 USD |
| 2018 | 34,4 millones USD | 971 millones ARS | 2.500 USD |

Estos importes son estimaciones del ámbito del MPF de la Nación. El estudio
distribuye el 80% del presupuesto devengado entre causas e introduce ponderaciones
de las figuras de la Ley 23.737. Excluye los sistemas provinciales desfederalizados,
policía, etapas ante tribunales y cárceles. No es un presupuesto auditado o una
medición actual de todo el Poder Judicial. No es exclusivamente cannabis.

El mismo apartado reporta, para cultivo/semillas/materias primas (art. 5.a),
0,786, 0,822 y 0,478 millones USD en esos tres ejercicios. Son subconjuntos de la
estimación amplia, no importes adicionales. La figura penal tampoco identifica
inequívocamente una sustancia. La conversión a USD es la publicada por RESET,
no una conversión del observatorio a una cotización actual.

Contraste público de las conclusiones:
https://celiv.untref.edu.ar/miradadelexperto-dic2019.html
https://idpc.net/es/news/2019/09/argentina-gasta-40-millones-de-dolares-al-ano-en-perseguir-a-usuarios-de-drogas

También se revisó el portal oficial de ejecución presupuestaria del MPF, que
publica ejercicios 2024–2026: https://www.mpf.gob.ar/transparencia-activa/ejecucion/
Se incorpora como fuente de contexto. El presupuesto general no identifica por
sí solo costos exclusivos de cannabis o Ley 23.737; no se lo convierte en ese
monto multiplicándolo por una proporción de causas.

## Argentina: SNEEP 2024

Catálogo oficial: https://datos.jus.gob.ar/dataset/sneep

CSV utilizado:
https://datos.jus.gob.ar/dataset/6c03af36-6a1d-4306-b2a8-dd39ad73afb3/resource/2fc756fc-e531-4562-8343-91f810b9fa1b/download/sneep-2024.csv

Metadatos de las variables:
https://github.com/datos-justicia-argentina/Sistema-Nacional-de-Estadisticas-sobre-Ejecucion-de-la-Pena-SNEEP/blob/master/Sistema-Nacional-de-Estadisticas-sobre-Ejecucion-de-la-Pena-SNEEP-metadata.md

El archivo contiene 120.700 registros del censo al 31/12/2024. Se seleccionan los
registros que contienen el delito 24 (Ley 23.737) en cualquiera de sus cinco
posiciones. Una fila se cuenta una sola vez, aunque el código se repita.

- 14.814 registros de personas privadas de libertad con alguna mención a esa ley.
- 7.399 con situación legal Procesado/a (código 2), dentro de esa población presa.
- 7.346 con situación Condenado/a (código 1), dentro de esa misma población.
- El resto tiene otras situaciones legales: no se calcula condenados por resta.
- 14.180 tienen el código 24 en el delito principal únicamente. Es una definición
  distinta de la selección en cualquiera de las cinco posiciones.
- Distribución completa del archivo seleccionado entre las 24 jurisdicciones por
  provincia del establecimiento, no por residencia o lugar del hecho.

No se conoce la sustancia específica ni se incluyen necesariamente comisarías,
arrestos domiciliarios y personas procesadas que permanecen en libertad. Por eso
no se etiqueta el dato como total de presos por cannabis ni total de procesados.

El SHA-256 del CSV se conserva en los JSON de respaldo y en la vista Fuentes.
La salida publicada solo contiene agregados, no los microdatos del censo.

### Detalle Municipal Parcial

Registro geográfico oficial:
https://catalogo.datos.gba.gob.ar/dataset/unidades-penitenciarias

Edición de unidades penitenciarias utilizada: agosto de 2026. Centroides y
polígonos: GeoRef/IGN, https://www.argentina.gob.ar/georef

Se vinculan números de unidad **provincial bonaerense** de coincidencia única
con el registro geográfico y se normaliza el municipio con GeoRef. No se usan
direcciones particulares ni se hace emparejamiento difuso de nombres personales.

El cruce permite publicar 21 municipios, 47 unidades coincidentes y 4.392 personas.
No se asignan a municipios 1.864 personas de unidades provinciales no emparejadas
ni las 1.191 de unidades federales de la provincia. Estas últimas sí permanecen
incluidas en el total provincial SNEEP de 7.447. Los municipios reflejan ubicación
del establecimiento según el registro geográfico utilizado, no residencia ni delito.
Las fechas de censo y registro geográfico son diferentes y se indican en pantalla.

Ejemplos del cruce: La Plata, 709 personas en prisión y 374 procesadas dentro de
ese universo; Florencio Varela, 684 y 395; Magdalena, 518 y 257. Son subconjuntos
de unidades vinculadas, no necesariamente censos completos de esos municipios.

Las celdas municipales menores de cinco no se publican. Los polígonos son de IGN;
los puntos municipales son centroides administrativos. Para Tierra del Fuego se
usa y declara el punto representativo de Ushuaia para no ubicar presos en el
centroide antártico de la provincia.

## Otros Conjuntos Territoriales

- **MPBA/RUD**: informe oficial 2025, página 30, 8.883 personas privadas de libertad
  por Ley 23.737 al 31/12/2025. Universo judicial provincial distinto al SNEEP:
  no sumar ni medir un cambio anual entre ambas fuentes.
  https://www.mpba.gov.ar/files/informes/Informe%20Estupefacientes%202025.pdf
- **Corbelle, Delito y Sociedad 60, e151 (2025)**: muestra no probabilística de
  42 causas de cultivo/derivados de cannabis entre 2010 y 2020, en 12 jurisdicciones.
  Involucra 59 personas únicas y 64 participaciones persona-causa. La distribución
  provincial es de causas, no de personas procesadas, y no es un total nacional.
  https://portal.amelica.org/ameli/journal/284/2845544002/html/
- **US Sentencing Commission FY2024**, nota 1: 471 personas sentenciadas por
  marihuana bajo USSG capítulo 2, parte D. Flujo federal, no un stock de presos ni
  un total que incluya tribunales estatales. No se calcula prisión multiplicando
  porcentajes de la publicación.
  https://www.ussc.gov/sites/default/files/pdf/research-and-publications/quick-facts/Marijuana_FY24.pdf
- **ABS, Criminal Courts Australia 2024/25**: 31.383 defendants finalised con
  delito principal de drogas. Se cuenta cada causa por separado; se incorpora como
  causas con imputado finalizadas, no como personas únicas o procesos pendientes.
  https://www.abs.gov.au/statistics/people/crime-and-justice/criminal-courts-australia/2024-25
- Los partes oficiales de CABA y José C. Paz y la noticia de ANÁLISIS sobre Paraná
  se mantienen en una colección documental separada, con fecha y presunción de
  inocencia. Involucran varias sustancias y no son estadísticas municipales anuales.
  En el caso Paraná/Oro Verde se ubica la sede judicial, sin atribuir todos los
  hechos a un único municipio. No se reproducen nombres, domicilios o identificadores.
- Se conserva el conector y respaldo previo de detenciones NYPD 2022–2025.

## Referencias Económicas Internacionales

Además de las referencias previas de Canadá y EE. UU., se incorporan:

- **Australia, UNSW/DPMP (publicación 2024)**: 3.500 millones AUD de enforcement
  en 2021/22, cifra nacional redondeada, no exclusiva de cannabis. Nueva Gales del
  Sur: 679,183754 millones AUD para el mismo período, subconjunto del nacional.
  La tabla estatal separa policía, tribunales, fiscalías, asistencia jurídica,
  prisiones y correcciones comunitarias. No sumar nacional y estado.
  https://www.unsw.edu.au/newsroom/news/2024/06/illicit-drugs-government-spending-lowest-on-prevention-and-harm-reduction-shows-new-report
- **Brasil, CESeC (2021)**: Rio de Janeiro, aproximadamente 1.000 millones BRL;
  São Paulo, aproximadamente 4.200 millones BRL; ejercicio 2017, valores constantes
  de noviembre 2020. Atribución a la Ley de Drogas en siete instituciones. No son
  un total brasileño ni gasto exclusivo de tribunales o cannabis.
  https://cesecseguranca.com.br/textodownload/um-tiro-no-pe-impactos-da-proibicao-das-drogas-no-orcamento-do-sistema-de-justica-criminal-do-rio-de-janeiro-e-sao-paulo/
- **Inglaterra, Review of Drugs (2020), diapositiva 14**: 733 millones GBP de
  costos de servicios de justicia penal en 2017/18. No todo Reino Unido, no solo
  delitos de posesión de cannabis. Se mantiene separado del rubro de 680 millones
  GBP de enforcement informado por la misma lámina.
  https://assets.publishing.service.gov.uk/media/5eafffedd3bf7f65363e4fda/Review_of_Drugs_Evidence_Pack.pdf
- **Alemania, Haucap y Knoke (2021)**: escenario de ahorro potencial de policía,
  fiscalías/tribunales y prisiones; componentes de 1.051,185370, 272,302843 y
  41,111200 millones EUR. La suma es 1.364,599413 millones. NO es gasto ejecutado
  ni ahorro observado después de la reforma de 2024. El tipo de evidencia se
  guarda como `scenario` y se puede excluir mediante filtros.
  https://www.wirtschaftsdienst.eu/inhalt/jahr/2021/heft/12/beitrag/fiskalische-effekte-der-cannabis-legalisierung.html

No se normalizan monedas o precios por inflación. No se comparan presupuestos,
costos atribuibles, estimaciones top-down, universos de causas y ahorros potenciales
como cifras intercambiables. Los países sin referencia incorporada muestran N/D;
eso no demuestra que no exista información ni que su gasto sea cero.

## Actualización Y Contrato

`scripts/update-argentina-data.py` usa la biblioteca estándar de Python. Descarga
el recurso SNEEP 2024 configurado, valida la estructura y publica únicamente:

- `src/data/snapshots/arg-justice.json`
- `public/data/arg-justice-snapshot.json`

Acepta `--input` para reutilizar un CSV oficial descargado y `--cache-dir` para
recursos geográficos. Los datos oficiales no se descargan de nuevo en el navegador.
La aplicación reconsulta el JSON agregado y retiene la última respuesta válida.
La acción semanal de GitHub incluye el script, pero requiere permisos y habilitación
en el repositorio. No descubre automáticamente censos futuros o estudios de gasto.

Cada registro territorial puede definir `seriesId`, `seriesName`, `period`,
`timeBasis`, `geographyBasis`, `geographySourceUrl`, `cases` y `sentenced` además
de los indicadores anteriores. `unit: cases` distingue causas de personas.
El atlas selecciona una colección y un ámbito por vez. Los padres reemplazan a
sus hijos solo en su misma fuente, año, unidad y base temporal, evitando doble conteo.

Los costos admiten `id`, `substanceScope`, `territory`, `evidenceType`,
`fiscalPeriod`, `publicationYear`, `prosecutionMillions`, `perCase` y el importe
original en ARS si también lo publica la fuente. Mantener el `id` al corregir una
referencia; `iso` y año ya no identifican de forma única referencias solapadas.