import type { JusticeCost, TerritoryRecord } from './research';
import argentinaSnapshot from './snapshots/arg-justice.json';

export const RESET_URL = 'https://resetdrogas.com.ar/index.php/2019/09/22/mas-de-40-millones-de-dolares-al-ano-gasta-el-estado-en-criminalizar-a-personas-usuarias-de-drogas/';
export const CORBELLE_URL = 'https://portal.amelica.org/ameli/journal/284/2845544002/html/';
const UNSW_URL = 'https://www.unsw.edu.au/newsroom/news/2024/06/illicit-drugs-government-spending-lowest-on-prevention-and-harm-reduction-shows-new-report';
const NSW_URL = 'https://www.unsw.edu.au/content/dam/pdfs/ada/sprc/research-reports/dpmp-drug-summit-2024-explainers/2024-10-how-much-does-the-nsw-government-spend-on-law-enforcement-responses-to-illicit-drugs-dpmp-2024-v3.pdf';
const BRAZIL_URL = 'https://cesecseguranca.com.br/textodownload/um-tiro-no-pe-impactos-da-proibicao-das-drogas-no-orcamento-do-sistema-de-justica-criminal-do-rio-de-janeiro-e-sao-paulo/';
const GERMANY_URL = 'https://www.wirtschaftsdienst.eu/inhalt/jahr/2021/heft/12/beitrag/fiskalische-effekte-der-cannabis-legalisierung.html';
const UK_URL = 'https://assets.publishing.service.gov.uk/media/5eafffedd3bf7f65363e4fda/Review_of_Drugs_Evidence_Pack.pdf';

export const EVIDENCE_TYPE_LABELS = {
  estimate: 'Estimación de costo', executed: 'Gasto ejecutado', budget: 'Presupuesto asignado', scenario: 'Ahorro potencial / escenario',
};
export const COST_CURRENCIES = ['USD', 'CAD', 'EUR', 'ARS', 'AUD', 'BRL', 'GBP', 'NZD'];
export const costKey = (row: JusticeCost) => row.id || `${row.iso}-${row.year}`;
export const costScope = (row: JusticeCost) => row.substanceScope || 'cannabis';

const resetMethod = 'Estimación de RESET publicada en 2019: 80% del presupuesto devengado del MPF dividido por causas iniciadas, con ponderaciones de los arts. 5 y 14. Conversión a USD por los autores. No es una partida contable específica ni un gasto auditado; excluye policías, tribunales, prisiones y jurisdicciones provinciales desfederalizadas.';
export const ADDITIONAL_JUSTICE_COSTS: JusticeCost[] = [
  ...[
    { year: 2016, amount: 42.5, perCase: 2600, pesos: 621 },
    { year: 2017, amount: 45, perCase: 3300, pesos: 782 },
    { year: 2018, amount: 34.4, perCase: 2500, pesos: 971 },
  ].map(row => ({
    id: `arg-reset-users-${row.year}`, iso: 'ARG', year: row.year, currency: 'USD' as const,
    totalMillions: row.amount, prosecutionMillions: row.amount, courtsMillions: null, policingMillions: null, correctionsMillions: null,
    substanceScope: 'all-drugs' as const, territory: 'Ámbito del Ministerio Público Fiscal de la Nación; no total nacional consolidado',
    evidenceType: 'estimate' as const, fiscalPeriod: String(row.year), publicationYear: 2019, perCase: row.perCase,
    originalCurrency: 'ARS' as const, originalMillions: row.pesos,
    scope: 'Persecución fiscal de conductas vinculadas al uso de drogas, Ley 23.737. Incluye tenencia y fracciones estimadas de otras figuras; no exclusivamente cannabis. El costo unitario citado corresponde a causas por tenencia, no a cada persona ni a todo el sistema judicial.',
    method: resetMethod, sourceName: 'RESET, Costo económico en la persecución de personas que usan drogas, apartado IV.e',
    sourceUrl: RESET_URL, verifiedAt: '2026-10-30',
  })),
  ...[
    { year: 2016, amount: 0.786 }, { year: 2017, amount: 0.822 }, { year: 2018, amount: 0.478 },
  ].map(row => ({
    id: `arg-reset-cultivation-${row.year}`, iso: 'ARG', year: row.year, currency: 'USD' as const,
    totalMillions: row.amount, prosecutionMillions: row.amount, courtsMillions: null, policingMillions: null, correctionsMillions: null,
    substanceScope: 'all-drugs' as const, territory: 'MPF federal / art. 5 inciso a de la Ley 23.737',
    evidenceType: 'estimate' as const, fiscalPeriod: String(row.year), publicationYear: 2019,
    scope: 'Cultivo, siembra, semillas y materias primas (art. 5.a). El estudio considera el 90% de estas causas por su vinculación predominante al cannabis, pero no demuestra exclusividad de sustancia. SUBCONJUNTO ya contenido en la estimación de conductas vinculadas al uso: no sumar ambas referencias.',
    method: resetMethod, sourceName: 'RESET, Costo económico en la persecución de personas que usan drogas, apartado IV.e',
    sourceUrl: RESET_URL, verifiedAt: '2026-10-30',
  })),
  {
    id: 'aus-dpmp-2022-national', iso: 'AUS', year: 2022, currency: 'AUD', totalMillions: 3500,
    policingMillions: 1800, courtsMillions: null, correctionsMillions: null,
    substanceScope: 'all-drugs', territory: 'Gobiernos federal, estatales y territoriales de Australia', evidenceType: 'estimate',
    fiscalPeriod: '2021/22', publicationYear: 2024,
    scope: 'Respuesta de aplicación de la ley frente a drogas ilícitas: aduanas, policía, fiscalías, tribunales, prisiones y correcciones comunitarias. Cifras nacionales redondeadas por la publicación; no son exclusivas de cannabis ni de tribunales.',
    method: 'Drug Policy Modelling Program, UNSW. Estimación top-down del gasto proactivo sobre presupuestos y actividad relacionada con drogas. No incluye los costos sociales indirectos del consumo.',
    sourceName: 'UNSW / DPMP, Australian drug budget 2021/22 (publicado en junio de 2024)', sourceUrl: UNSW_URL, verifiedAt: '2026-10-30',
  },
  {
    id: 'aus-nsw-dpmp-2022', iso: 'AUS', year: 2022, currency: 'AUD', totalMillions: 679.183754,
    policingMillions: 334.57, courtsMillions: 41.780598, prosecutionMillions: 25.548134, correctionsMillions: 238.494443,
    substanceScope: 'all-drugs', territory: 'Nueva Gales del Sur, Australia (subnacional)', evidenceType: 'estimate',
    fiscalPeriod: '2021/22', publicationYear: 2024,
    scope: 'Respuesta penal estatal frente a todas las drogas ilícitas. Incluye además asistencia jurídica y correcciones comunitarias. Es un SUBCONJUNTO del valor nacional australiano, no un gasto adicional.',
    method: 'DPMP / UNSW, tabla 1: presupuesto por proporción de actividad y duración de causas, sentencias y órdenes. La suma de barras seleccionadas no incluye todas las categorías del total.',
    sourceName: 'UNSW, How much does the NSW government spend on Law enforcement responses to illicit drugs? (octubre 2024), tabla 1',
    sourceUrl: NSW_URL, verifiedAt: '2026-10-30',
  },
  ...[
    { id: 'rj', name: 'Rio de Janeiro', amount: 1000 }, { id: 'sp', name: 'São Paulo', amount: 4200 },
  ].map(row => ({
    id: `bra-cesec-2017-${row.id}`, iso: 'BRA', year: 2017, currency: 'BRL' as const, totalMillions: row.amount,
    policingMillions: null, courtsMillions: null, correctionsMillions: null, substanceScope: 'all-drugs' as const,
    territory: `Estado de ${row.name}; NO es el total de Brasil`, evidenceType: 'estimate' as const,
    fiscalPeriod: '2017, valores constantes de noviembre de 2020', publicationYear: 2021,
    scope: 'Aplicación de la Ley de Drogas 11.343/2006 en siete instituciones: policías, Ministerio Público, defensa pública, tribunales, sistema penitenciario y socioeducativo. Valor redondeado por CESeC; no es solo cannabis ni solo Poder Judicial.',
    method: 'CESeC, Um tiro no pé (2021). Atribución de ejecución presupuestaria institucional a la política de drogas con indicadores de actividad. Se preserva el año de precios de la publicación, sin convertir a USD ni actualizar por inflación.',
    sourceName: 'CESeC, Um tiro no pé; publicación y síntesis institucional de marzo de 2021', sourceUrl: BRAZIL_URL, verifiedAt: '2026-10-30',
  })),
  {
    id: 'gbr-black-cjs-2018', iso: 'GBR', year: 2018, currency: 'GBP', totalMillions: 733,
    policingMillions: null, courtsMillions: null, correctionsMillions: null, substanceScope: 'all-drugs',
    territory: 'Inglaterra; no todo el Reino Unido', evidenceType: 'estimate', fiscalPeriod: '2017/18', publicationYear: 2020,
    scope: 'Costos de servicios de justicia penal dentro de los costos de delitos relacionados con usuarios de drogas. No es el presupuesto judicial completo ni un costo exclusivo de posesión de cannabis.',
    method: 'Review of Drugs, evidence pack, página PDF 15 (diapositiva 14). Estimación de Public Health England. La fuente separa otros 680 M GBP de enforcement; no se suman aquí para evitar presentar otra delimitación como idéntica.',
    sourceName: 'Gobierno británico, Dame Carol Black, Review of Drugs evidence pack (2020), diapositiva 14',
    sourceUrl: UK_URL, verifiedAt: '2026-10-30',
  },
  {
    id: 'deu-haucap-scenario-2021', iso: 'DEU', year: 2021, currency: 'EUR', totalMillions: 1364.599413,
    policingMillions: 1051.18537, courtsMillions: 272.302843, correctionsMillions: 41.1112,
    substanceScope: 'cannabis', territory: 'Alemania, escenario previo a la reforma de 2024', evidenceType: 'scenario',
    fiscalPeriod: 'Modelo anual publicado en 2021', publicationYear: 2021,
    scope: 'AHORRO POTENCIAL de aplicación de leyes de cannabis bajo un escenario de legalización. NO es gasto ejecutado en 2021 ni un ahorro observado tras la ley de 2024. El rubro judicial agrupa fiscalías y tribunales.',
    method: 'Haucap y Knoke, Wirtschaftsdienst 2021, tabla 1. Total mostrado = suma de los tres componentes de ahorro publicados. Los autores advierten que liberar recursos no implica necesariamente reducir puestos o presupuesto.',
    sourceName: 'Haucap y Knoke (2021), Fiskalische Effekte der Cannabis-Legalisierung, tabla 1',
    sourceUrl: GERMANY_URL, verifiedAt: '2026-10-30',
  },
];

export const ARGENTINA_RESEARCH_TERRITORY: TerritoryRecord[] = [
  {
    id: 'arg-ba-2025-rud', iso: 'ARG', province: 'Buenos Aires', municipality: '', level: 'province',
    lat: -36.67, lon: -60.56, year: 2025, arrests: null, prosecuted: null, imprisoned: 8883,
    scope: 'all-drugs', unit: 'people', seriesId: 'mpba-rud', seriesName: 'MPBA / RUD Ley 23.737',
    period: '31/12/2025', timeBasis: 'stock', geographyBasis: 'judicial-jurisdiction',
    sourceName: 'MPBA, Informe en materia de estupefacientes 2025, página 30',
    sourceUrl: 'https://www.mpba.gov.ar/files/informes/Informe%20Estupefacientes%202025.pdf',
    note: '8.883 personas privadas de libertad a disposición del fuero provincial por Ley 23.737. Todas las sustancias; NO solo cannabis. Universo RUD por jurisdicción judicial, distinto al SNEEP por ubicación de la unidad; puede incluir modalidades de coerción fuera de unidades penitenciarias. No sumar RUD y SNEEP ni interpretar el stock como detenciones anuales.',
  },
  {
    id: 'usa-ussc-2024-marijuana', iso: 'USA', province: '', municipality: '', level: 'country',
    lat: 39, lon: -98, year: 2024, arrests: null, prosecuted: null, imprisoned: null, sentenced: 471,
    scope: 'cannabis', unit: 'people', seriesId: 'usa-ussc', seriesName: 'USSC / sentencias federales de marihuana',
    period: 'FY2024 (01/10/2023–30/09/2024)', timeBasis: 'flow', geographyBasis: 'judicial-jurisdiction',
    sourceName: 'US Sentencing Commission, Marijuana Trafficking FY2024, nota 1',
    sourceUrl: 'https://www.ussc.gov/sites/default/files/pdf/research-and-publications/quick-facts/Marijuana_FY24.pdf',
    note: 'La nota 1 informa 471 personas sentenciadas por delitos de marihuana bajo USSG capítulo 2, parte D. Es un flujo federal de casos de sentencia, no un censo de personas presas ni un total estadounidense incluyendo justicia estatal. No se calcula un número de personas en prisión aplicando porcentajes a este total.',
  },
  {
    id: 'aus-abs-2025-drug-cases', iso: 'AUS', province: '', municipality: '', level: 'country',
    lat: -25.3, lon: 133.8, year: 2025, arrests: null, prosecuted: null, imprisoned: null, cases: 31383,
    scope: 'all-drugs', unit: 'cases', seriesId: 'aus-abs-courts', seriesName: 'ABS / causas con imputado finalizadas',
    period: '2024/25 (año fiscal australiano)', timeBasis: 'flow', geographyBasis: 'judicial-jurisdiction',
    sourceName: 'Australian Bureau of Statistics, Criminal Courts Australia 2024–25, Principal offence',
    sourceUrl: 'https://www.abs.gov.au/statistics/people/crime-and-justice/criminal-courts-australia/2024-25',
    note: '31.383 defendants finalised por delito principal de drogas. La metodología cuenta cada causa finalizada por separado, incluso de una misma persona: se muestra como causas con imputado, NO como personas únicas ni procesados pendientes. Incluye todas las drogas y excluye transferencias entre instancias; no equivale a personas detenidas o encarceladas.',
  },
  ...[
    { province: 'Buenos Aires', lat: -36.68, lon: -60.56, n: 20 }, { province: 'Catamarca', lat: -27.34, lon: -66.95, n: 2 },
    { province: 'Chubut', lat: -43.79, lon: -68.53, n: 1 }, { province: 'Córdoba', lat: -32.14, lon: -63.8, n: 3 },
    { province: 'Entre Ríos', lat: -32.06, lon: -59.2, n: 5 }, { province: 'Jujuy', lat: -23.32, lon: -65.76, n: 2 },
    { province: 'Mendoza', lat: -34.63, lon: -68.58, n: 1 }, { province: 'Misiones', lat: -26.88, lon: -54.65, n: 1 },
    { province: 'Río Negro', lat: -40.41, lon: -67.23, n: 1 }, { province: 'Salta', lat: -24.3, lon: -64.81, n: 3 },
    { province: 'Santa Fe', lat: -30.7, lon: -60.95, n: 2 }, { province: 'Ciudad Autónoma de Buenos Aires', lat: -34.61, lon: -58.45, n: 1 },
  ].map((p, i) => ({
    id: `arg-corbelle-2020-${i}`, iso: 'ARG', province: p.province, municipality: '', level: 'province' as const,
    lat: argentinaSnapshot.records.find(r => r.level === 'province' && r.province === p.province)!.lat,
    lon: argentinaSnapshot.records.find(r => r.level === 'province' && r.province === p.province)!.lon,
    year: 2020, arrests: null, prosecuted: null, imprisoned: null, cases: p.n,
    scope: 'cannabis' as const, unit: 'cases' as const, seriesId: 'arg-cannabis-sample', seriesName: 'Corbelle / causas de cultivo de cannabis',
    period: '2010–2020 (intervalo completo, no un año)', timeBasis: 'sample' as const, geographyBasis: 'judicial-jurisdiction' as const,
    sourceName: 'Florencia Corbelle, Delito y Sociedad 60, e151 (2025), apartado 3', sourceUrl: CORBELLE_URL,
    geographySourceUrl: 'https://www.argentina.gob.ar/georef',
    note: 'MUESTRA no probabilística de 42 causas de cultivo/derivados de cannabis en 2010–2020; no es un censo ni una estimación de prevalencia. Entrevistas en 2022–2023; publicación en 2025. El conjunto involucra 59 personas únicas y 64 participaciones persona-causa, pero la distribución provincial publicada es de CAUSAS: no se transforma en personas procesadas. Puntos provinciales aproximados, no ubicaciones de personas.',
  })),
  {
    id: 'arg-case-caba-2025-04-24', iso: 'ARG', province: 'Ciudad Autónoma de Buenos Aires', municipality: 'Ciudad Autónoma de Buenos Aires',
    level: 'municipality', lat: -34.61, lon: -58.45, year: 2025, arrests: 6, prosecuted: null, imprisoned: null,
    scope: 'all-drugs', unit: 'people', seriesId: 'arg-case-reports', seriesName: 'Argentina / partes de prensa documentados',
    period: '24/04/2025; parte de un operativo', timeBasis: 'case-report', geographyBasis: 'incident-location',
    sourceName: 'Gendarmería Nacional / Argentina.gob.ar, 24 de abril de 2025',
    sourceUrl: 'https://www.argentina.gob.ar/noticias/detienen-seis-personas-por-narcomenudeo-en-el-barrio-padre-mugica-ex-31',
    note: 'Seis personas detenidas en un operativo publicado. Se informan marihuana Y cocaína: no se atribuyen exclusivamente al cannabis. No es un total municipal anual; punto de la ciudad, no domicilios ni ubicación exacta del procedimiento. Detención no implica condena.',
  },
  {
    id: 'arg-case-josecpaz-2024-10-19', iso: 'ARG', province: 'Buenos Aires', municipality: 'José C. Paz',
    level: 'municipality', lat: -34.52, lon: -58.75, year: 2024, arrests: 9, prosecuted: null, imprisoned: null,
    scope: 'all-drugs', unit: 'people', seriesId: 'arg-case-reports', seriesName: 'Argentina / partes de prensa documentados',
    period: '19/10/2024; parte de un operativo', timeBasis: 'case-report', geographyBasis: 'incident-location',
    sourceName: 'PSA / Ministerio de Seguridad, 19 de octubre de 2024',
    sourceUrl: 'https://www.argentina.gob.ar/noticias/desmantelamos-una-banda-narco-y-secuestramos-gran-cantidad-de-drogas-y-armas',
    note: 'Nueve personas detenidas en un operativo que informa marihuana y cocaína, además de otros delitos. Es un parte de prensa, NO un censo anual de detenidos. Coordenadas representativas del municipio, no del domicilio intervenido. Presunción de inocencia.',
  },
  {
    id: 'arg-case-parana-2025-03-29', iso: 'ARG', province: 'Entre Ríos', municipality: 'Paraná (sede judicial)',
    level: 'municipality', lat: -31.74, lon: -60.52, year: 2025, arrests: null, prosecuted: 6, imprisoned: 6,
    scope: 'all-drugs', unit: 'people', seriesId: 'arg-case-reports', seriesName: 'Argentina / partes de prensa documentados',
    period: 'Resolución informada el 29/03/2025; no stock anual', timeBasis: 'case-report', geographyBasis: 'judicial-seat',
    sourceName: 'ANÁLISIS Digital, 29 de marzo de 2025 (fuente periodística privada)',
    sourceUrl: 'https://www.analisisdigital.com.ar/judiciales/2025/03/29/seis-procesados-por-cultivo-y-venta-de-marihuana-gran-escala-en-parana',
    note: 'La noticia informa seis procesamientos con prisión preventiva por una causa vinculada al cultivo/comercio de cannabis; también informa otras sustancias. Hechos en Paraná y Oro Verde: se ubica la SEDE JUDICIAL, no se adjudican todos los hechos a un municipio. No implica condena ni que la medida siguiera vigente al cierre del año. No representa un total de procesados.',
  },
];

export const NEW_JUSTICE_SOURCES = [
  { name: 'RESET · costo económico', url: RESET_URL, domain: 'Gasto / Argentina', mode: 'Estudio de organización civil, publicado en 2019', note: 'Estimaciones de fiscalías federales para 2016–2018, con supuestos explícitos. No son cifras actuales ni gasto total del sistema.' },
  { name: 'MPF · ejecución presupuestaria general', url: 'https://www.mpf.gob.ar/transparencia-activa/ejecucion/', domain: 'Contexto presupuestario / Argentina', mode: 'Portal oficial con ejecución 2024–2026 y años anteriores', note: 'Publica la ejecución general del organismo. No se atribuye este presupuesto completo a cannabis o Ley 23.737 ni se lo distribuye por cantidad de causas sin un estudio de costos.' },
  { name: 'SNEEP · censo y metadatos', url: 'https://datos.jus.gob.ar/dataset/sneep', domain: 'Argentina / prisión', mode: 'Microdatos oficiales agregados antes de publicar', note: 'Ley 23.737 en cualquiera de cinco delitos, una vez por registro. Todas las drogas; procesados es un subconjunto de personas en prisión.' },
  { name: 'PBA · unidades penitenciarias', url: 'https://catalogo.datos.gba.gob.ar/dataset/unidades-penitenciarias', domain: 'Argentina / geografía', mode: 'Registro público georreferenciado', note: 'Cruce por número de unidad provincial único, no por domicilios de personas; edición de agosto de 2026 aplicada al censo 2024. Cobertura municipal parcial.' },
  { name: 'GeoRef / IGN', url: 'https://www.argentina.gob.ar/georef', domain: 'Argentina / cartografía', mode: 'API pública de unidades territoriales', note: 'Provincias, municipios y centroides oficiales. Los puntos representan áreas administrativas; no ubicaciones personales.' },
  { name: 'Corbelle · procesos por cannabis', url: CORBELLE_URL, domain: 'Cannabis / Argentina', mode: 'Artículo académico, 2025', note: '42 causas de cultivo/derivados (2010–2020), 59 personas únicas. Muestra no probabilística; la distribución provincial publicada es de causas.' },
  { name: 'MPBA · RUD / estupefacientes 2025', url: 'https://www.mpba.gov.ar/files/informes/Informe%20Estupefacientes%202025.pdf', domain: 'Argentina / prisión', mode: 'Informe oficial, página 30', note: '8.883 personas al 31/12/2025. Todas las drogas. Universo distinto del censo SNEEP; no sumar las dos fuentes.' },
  { name: 'USSC · sentencias de marihuana FY2024', url: 'https://www.ussc.gov/sites/default/files/pdf/research-and-publications/quick-facts/Marijuana_FY24.pdf', domain: 'Cannabis / Estados Unidos', mode: 'Informe oficial, nota 1', note: '471 personas sentenciadas bajo USSG capítulo 2D: flujo de jurisdicción federal, no stock de presos ni total de justicia estatal.' },
  { name: 'ABS · Criminal Courts 2024/25', url: 'https://www.abs.gov.au/statistics/people/crime-and-justice/criminal-courts-australia/2024-25', domain: 'Australia / justicia', mode: 'Estadística oficial de causas con imputado finalizadas', note: '31.383 por delito principal de drogas. No personas únicas; cada causa finalizada se cuenta por separado.' },
  { name: 'UNSW · Australian drug budget', url: UNSW_URL, domain: 'Gasto / Australia', mode: 'Estudio académico de presupuestos públicos', note: '2021/22: 3.500 M AUD estimados en enforcement; no es solo cannabis ni solo tribunales.' },
  { name: 'UNSW · gasto en Nueva Gales del Sur', url: NSW_URL, domain: 'Gasto / subnacional', mode: 'Estudio académico, tabla 1', note: '679,18 M AUD en 2021/22. Parte del total australiano, no monto adicional.' },
  { name: 'CESeC · Um tiro no pé', url: BRAZIL_URL, domain: 'Gasto / Brasil', mode: 'Estudio de ejecución y actividad, 2021', note: 'Rio de Janeiro y São Paulo, ejercicio 2017 a precios de noviembre 2020. No es un total brasileño.' },
  { name: 'Gobierno británico · Review of Drugs', url: UK_URL, domain: 'Gasto / Inglaterra', mode: 'Informe oficial, 2020, diapositiva 14', note: 'Costos de servicios de justicia penal 2017/18. No son exclusivos de cannabis ni de todo el Reino Unido.' },
  { name: 'Haucap y Knoke · escenario fiscal', url: GERMANY_URL, domain: 'Escenario / Alemania', mode: 'Artículo académico, 2021', note: 'Ahorro potencial modelado por legalización; NO gasto ejecutado ni ahorro observado después de 2024.' },
];