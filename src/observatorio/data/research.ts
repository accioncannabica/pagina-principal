export type GeographyLevel = 'country' | 'province' | 'municipality';
export type JudicialMetric = 'arrests' | 'prosecuted' | 'imprisoned' | 'sentenced' | 'cases';

export interface TerritoryRecord {
  id: string;
  iso: string;
  province: string;
  municipality: string;
  district?: string;
  level: GeographyLevel;
  lat: number;
  lon: number;
  year: number;
  arrests: number | null;
  prosecuted: number | null;
  imprisoned: number | null;
  sentenced?: number | null;
  cases?: number | null;
  seriesId?: string;
  seriesName?: string;
  period?: string;
  timeBasis?: 'stock' | 'flow' | 'sample' | 'case-report';
  geographyBasis?: 'custody-location' | 'incident-location' | 'judicial-seat' | 'judicial-jurisdiction';
  geographySourceUrl?: string;
  scope: 'cannabis' | 'all-drugs';
  unit: 'arrest-records' | 'people' | 'cases';
  sourceUrl: string;
  sourceName: string;
  note: string;
}

export interface HeatPoint {
  id: string;
  year: number;
  borough: string;
  lat: number;
  lon: number;
  value: number;
}

export interface NycSnapshot {
  retrievedAt: string;
  sourceUpdatedAt: string | null;
  through: string;
  records: TerritoryRecord[];
  points: HeatPoint[];
  queries: string[];
}

export interface CulturalEvent {
  id: string;
  name: string;
  iso: string;
  city: string;
  kind: 'Exposición' | 'Festival' | 'Copa' | 'Encuentro' | 'Congreso científico' | 'Simposio' | 'Jornada académica';
  start: string | null;
  end: string | null;
  venue: string;
  description: string;
  url: string;
  sourceUrl: string;
  verifiedAt: string;
  dateStatus: 'confirmed' | 'check';
  focus?: 'Cultura' | 'Salud' | 'Investigación' | 'Industria y regulación';
  lat?: number | null;
  lon?: number | null;
  modality?: 'Presencial' | 'Virtual' | 'Híbrida';
}

export interface JusticeCost {
  id?: string;
  iso: string;
  year: number;
  currency: 'USD' | 'CAD' | 'EUR' | 'ARS' | 'AUD' | 'BRL' | 'GBP' | 'NZD';
  totalMillions: number;
  courtsMillions: number | null;
  policingMillions: number | null;
  correctionsMillions: number | null;
  prosecutionMillions?: number | null;
  substanceScope?: 'cannabis' | 'all-drugs';
  territory?: string;
  evidenceType?: 'estimate' | 'executed' | 'budget' | 'scenario';
  fiscalPeriod?: string;
  publicationYear?: number;
  perCase?: number;
  originalCurrency?: 'ARS';
  originalMillions?: number;
  scope: string;
  method: string;
  sourceName: string;
  sourceUrl: string;
  verifiedAt: string;
}

export const METRIC_LABELS: Record<JudicialMetric, string> = {
  arrests: 'Detenciones',
  prosecuted: 'Personas procesadas',
  imprisoned: 'Personas privadas de libertad',
  sentenced: 'Personas condenadas (según fuente)',
  cases: 'Causas / expedientes',
};

export const BOROUGHS: Record<string, { name: string; lat: number; lon: number }> = {
  B: { name: 'Bronx', lat: 40.85, lon: -73.87 },
  K: { name: 'Brooklyn', lat: 40.65, lon: -73.95 },
  M: { name: 'Manhattan', lat: 40.78, lon: -73.97 },
  Q: { name: 'Queens', lat: 40.73, lon: -73.79 },
  S: { name: 'Staten Island', lat: 40.58, lon: -74.15 },
};

export const CULTURAL_EVENTS: CulturalEvent[] = [
  {
    id: 'expo-arg-2026', name: 'Expo Cannabis Argentina', iso: 'ARG', city: 'Buenos Aires',
    kind: 'Exposición', start: '2026-10-23', end: '2026-10-25', venue: 'Sede: confirmar con la organización',
    description: 'Talleres, conferencias, exposiciones, salud y cultivo. La web conserva información de sedes de distintas ediciones; revisar antes de viajar.',
    url: 'https://expocannabis.com.ar/', sourceUrl: 'https://expocannabis.com.ar/', verifiedAt: '2026-10-30', dateStatus: 'confirmed',
  },
  {
    id: 'cannafest-2026', name: 'Cannafest', iso: 'CZE', city: 'Praga', kind: 'Exposición',
    start: '2026-11-06', end: '2026-11-08', venue: 'PVA EXPO Praha Letňany',
    description: 'Exposición internacional de cannabis y plantas medicinales, con espacios de formación e intercambio.',
    url: 'https://cannafest.com/', sourceUrl: 'https://cannafest.com/', verifiedAt: '2026-10-30', dateStatus: 'confirmed',
  },
  {
    id: 'spannabis-2027', name: 'Spannabis', iso: 'ESP', city: 'Bilbao', kind: 'Exposición',
    start: '2027-03-12', end: '2027-03-14', venue: 'Consultar sede en la web oficial',
    description: 'Feria del cáñamo con expositores, intercambio profesional y cultura cannábica.',
    url: 'https://spannabis.es/', sourceUrl: 'https://spannabis.es/', verifiedAt: '2026-10-30', dateStatus: 'confirmed',
  },
  {
    id: 'maryjane-2027', name: 'Mary Jane Berlin', iso: 'DEU', city: 'Berlín', kind: 'Festival',
    start: '2027-06-03', end: '2027-06-06', venue: 'Messe Berlin, entrada norte',
    description: 'Exposición, charlas, talleres y festival. Acceso para mayores de 18 años según el organizador.',
    url: 'https://www.maryjane-berlin.com/', sourceUrl: 'https://www.maryjane-berlin.com/', verifiedAt: '2026-10-30', dateStatus: 'confirmed',
  },
  {
    id: 'montana-cup-2026', name: 'High Times Cannabis Cup', iso: 'USA', city: 'Billings, Montana', kind: 'Copa',
    start: '2026-09-05', end: '2026-09-05', venue: 'The Pub Station',
    description: 'Competencia y entrega de premios con evaluación comunitaria. Edición histórica publicada por el organizador; no equivale a una agenda futura.',
    url: 'https://cannabiscup.com/montana-2026/', sourceUrl: 'https://cannabiscup.com/montana-2026/', verifiedAt: '2026-10-30', dateStatus: 'confirmed',
  },
  {
    id: 'expouruguay', name: 'ExpoCannabis Uruguay', iso: 'URY', city: 'Montevideo', kind: 'Encuentro',
    start: null, end: null, venue: 'Confirmar con la organización',
    description: 'Espacio de educación e intercambio sobre cannabis medicinal e industrial. No se publica una fecha en este tablero porque los calendarios secundarios difieren.',
    url: 'https://expocannabis.uy/', sourceUrl: 'https://expocannabis.uy/', verifiedAt: '2026-10-30', dateStatus: 'check',
  },
];

// These are published research estimates, not current government budget lines.
export const JUSTICE_COSTS: JusticeCost[] = [
  {
    iso: 'CAN', year: 2020, currency: 'CAD', totalMillions: 1066.8,
    policingMillions: 535.6, courtsMillions: 198.3, correctionsMillions: 332.9,
    scope: 'Costos de justicia penal atribuibles al cannabis, incluidos delitos parcialmente atribuibles al uso. No es solo persecución de la posesión.',
    method: 'Estimación de costos atribuibles, dólares canadienses de 2020. No es una partida presupuestaria ejecutada.',
    sourceName: 'CCSA / CSiUR, Canadian Substance Use Costs and Harms 2007–2020, tabla 2',
    sourceUrl: 'https://csuch.ca/assets/documents/reports/english/Canadian-Substance-Use-Costs-and-Harms-Report-2007-2020-en.pdf',
    verifiedAt: '2026-10-30',
  },
  {
    iso: 'USA', year: 2010, currency: 'USD', totalMillions: 3600,
    policingMillions: null, courtsMillions: null, correctionsMillions: null,
    scope: 'Estimación histórica del costo de aplicar las leyes de posesión de marihuana. No representa el gasto actual ni el presupuesto total del Poder Judicial.',
    method: 'Estimación publicada por ACLU en 2013, referida a 2010. Valor redondeado; no extrapolar a otros años.',
    sourceName: 'ACLU, The War on Marijuana in Black and White (2013)',
    sourceUrl: 'https://www.aclu.org/publications/report-war-marijuana-black-and-white',
    verifiedAt: '2026-10-30',
  },
];

export const CONTEXT_TERRITORY: TerritoryRecord[] = [
  {
    id: 'arg-ba-2023-drugs', iso: 'ARG', province: 'Buenos Aires', municipality: '', level: 'province',
    lat: -36.67, lon: -60.56, year: 2023, arrests: null, prosecuted: null, imprisoned: 7567,
    scope: 'all-drugs', unit: 'people',
    seriesId: 'mpba-rud', seriesName: 'MPBA / RUD Ley 23.737', period: '31/12/2023',
    timeBasis: 'stock', geographyBasis: 'judicial-jurisdiction',
    sourceName: 'MPBA / Registro Único de Detenidos, informe 2023',
    sourceUrl: 'https://www.mpba.gov.ar/files/informes/Informe%20Estupefacientes%202023.pdf',
    note: 'Stock al 31/12/2023 por la Ley 23.737. Incluye todas las sustancias; NO puede atribuirse al cannabis. No es un flujo anual de detenciones.',
  },
];

export const RESEARCH_SOURCES = [
  { name: 'OpenAlex · Cannabis and Cannabinoid Research', url: 'https://openalex.org/topics/T10414', domain: 'Investigación publicada', mode: 'API bibliográfica abierta + instantánea respaldada', note: 'Tópico T10414, desde 2020, retractados excluidos. Agregados por afiliación; muestra de 100 trabajos ordenada por citas.' },
  { name: 'UNAJ · congresos de cannabis y cáñamo', url: 'https://www.unaj.edu.ar/congreso-internacional-cannabis/', domain: 'Congresos / Argentina', mode: 'Fuente universitaria, actas y e-pósters', note: 'Ediciones 2025 y 2026 del Congreso Internacional de Cáñamo Industrial y Cannabis Medicinal.' },
  { name: 'UNR · Cannabis y Salud', url: 'https://unr.edu.ar/1-congreso-internacional-de-cannabis-y-salud/', domain: 'Congresos / Argentina', mode: 'Fuente universitaria', note: '1° Congreso Internacional y 4° Congreso Argentino de Cannabis y Salud, octubre de 2026.' },
  { name: 'ICRS · Annual Symposium', url: 'https://www.icrs.com/registration', domain: 'Congresos internacionales', mode: 'Sociedad científica', note: '36th Annual Symposium on the Cannabinoids, Dijon, 2026.' },
  { name: 'CCORC · Clinical Outcomes', url: 'https://ccorc.mmjoutcomes.org/', domain: 'Cannabis y salud', mode: 'Consorcio universitario de Florida', note: 'Conferencia sobre resultados clínicos, seguridad e interacciones de cannabis medicinal.' },
  { name: 'NYC Open Data · NYPD histórico', url: 'https://data.cityofnewyork.us/d/8h9b-rp9u', domain: 'Territorio', mode: 'API pública, sin credenciales', note: 'Detenciones registradas; filtro textual MARIJUANA/CANNABIS. No aporta condenas ni personas únicas.' },
  { name: 'NYC DCP · Borough Boundaries', url: 'https://data.cityofnewyork.us/d/gthc-hcne', domain: 'Cartografía', mode: 'Geometría pública, copia local simplificada', note: 'Polígonos administrativos de los cinco distritos de NYC; no contienen coordenadas individuales de detención.' },
  { name: 'CSUCH · costos de justicia', url: 'https://csuch.ca/substance-use-costs/criminal-justice/', domain: 'Gasto judicial', mode: 'Estudio publicado', note: 'Canadá, 2020. Costos atribuibles, no gasto exclusivo en causas de posesión.' },
  { name: 'ACLU · The War on Marijuana', url: 'https://www.aclu.org/publications/report-war-marijuana-black-and-white', domain: 'Gasto judicial', mode: 'Estudio publicado', note: 'Estados Unidos, 2010. Referencia histórica no comparable directamente con Canadá.' },
  { name: 'MPBA · informe de estupefacientes 2023', url: 'https://www.mpba.gov.ar/files/informes/Informe%20Estupefacientes%202023.pdf', domain: 'Territorio', mode: 'Informe oficial', note: 'Provincia de Buenos Aires. Todas las drogas; capa contextual separada.' },
  { name: 'UNODC · World Drug Report', url: 'https://www.unodc.org/unodc/en/data-and-analysis/world-drug-report.html', domain: 'Consumo y regulación', mode: 'Catálogo público', note: 'Fuente para revisión. Las cifras previas de este prototipo no tienen trazabilidad individual validada.' },
  { name: 'Datos Argentina · Justicia', url: 'https://datos.gob.ar/', domain: 'Datos abiertos', mode: 'Catálogo público', note: 'Portal de descubrimiento; no implica una conexión automática a todos sus conjuntos.' },
];