import type { CulturalEvent } from './research';

export interface LiteratureWork {
  id: string;
  title: string;
  year: number;
  publicationDate: string | null;
  citations: number;
  doi: string | null;
  openAccess: boolean;
  openAccessUrl: string | null;
  type: string;
  source: string;
  authors: string[];
  institutions: string[];
  countries: string[];
}
export interface LiteratureInstitution {
  id: string;
  name: string;
  countryCode: string;
  city: string;
  lat: number;
  lon: number;
  works: number;
}
export interface LiteratureSnapshot {
  retrievedAt: string;
  sourceUpdatedAt: string | null;
  topicId: string;
  topicName: string;
  fromDate: string;
  throughDate: string;
  totalWorks: number;
  works: LiteratureWork[];
  countryCounts: { code: string; name: string; count: number }[];
  yearCounts: { year: number; count: number }[];
  institutions: LiteratureInstitution[];
  queries: string[];
}

const verified = '2026-10-30';
export const SCIENCE_EVENTS: CulturalEvent[] = [
  {
    id: 'unaj-cannabis-2025', name: 'Congreso Internacional de Cáñamo Industrial y Cannabis Medicinal', iso: 'ARG', city: 'Florencio Varela',
    kind: 'Congreso científico', focus: 'Investigación', start: '2025-05-09', end: '2025-05-10', venue: 'Universidad Nacional Arturo Jauretche',
    description: 'Primera edición universitaria con ciencia, medicina, innovación, e-pósters y actas publicadas por la UNAJ.',
    url: 'https://www.unaj.edu.ar/congreso-internacional-cannabis/', sourceUrl: 'https://www.unaj.edu.ar/congreso-internacional-cannabis/', verifiedAt: verified, dateStatus: 'confirmed',
    lat: -34.78, lon: -58.27, modality: 'Presencial',
  },
  {
    id: 'unaj-cannabis-2026', name: 'II Congreso Internacional de Cáñamo Industrial y Cannabis Medicinal', iso: 'ARG', city: 'Florencio Varela',
    kind: 'Congreso científico', focus: 'Salud', start: '2026-05-08', end: '2026-05-09', venue: 'Universidad Nacional Arturo Jauretche',
    description: 'Segunda edición académica sobre desarrollo científico, médico, productivo y social; incluyó presentación de trabajos científicos.',
    url: 'https://www.unaj.edu.ar/ii-congreso-internacional-cannabis/', sourceUrl: 'https://enys.conicet.gov.ar/se-realizo-el-ii-congreso-internacional-de-canamo-industrial-y-cannabis-medicinal-en-la-unaj/', verifiedAt: verified, dateStatus: 'confirmed',
    lat: -34.78, lon: -58.27, modality: 'Presencial',
  },
  {
    id: 'unr-cannabis-salud-2026', name: '1° Congreso Internacional y 4° Congreso Argentino de Cannabis y Salud', iso: 'ARG', city: 'Rosario',
    kind: 'Congreso científico', focus: 'Salud', start: '2026-10-07', end: '2026-10-09', venue: 'Centro Universitario Rosario / UNR',
    description: 'Investigación básica y clínica, salud pública, educación, regulación, desarrollos tecnológicos y economía social.',
    url: 'https://unr.edu.ar/1-congreso-internacional-de-cannabis-y-salud/', sourceUrl: 'https://unr.edu.ar/1-congreso-internacional-de-cannabis-y-salud/', verifiedAt: verified, dateStatus: 'confirmed',
    lat: -32.95, lon: -60.63, modality: 'Presencial',
  },
  {
    id: 'binacional-roca-2026', name: 'Encuentro Binacional de Cannabis Medicinal y Cáñamo Industrial', iso: 'ARG', city: 'General Roca',
    kind: 'Jornada académica', focus: 'Investigación', start: '2026-04-16', end: '2026-04-16', venue: 'Auditorio Diario Río Negro',
    description: 'INTA, Embrapa y Universidad Nacional del Comahue presentaron avances de I+D de Argentina y Brasil.',
    url: 'https://uncoma.edu.ar/ultimas-noticias/encuentro-binacional-de-cannabis-medicinal-y-canamo-industrial/', sourceUrl: 'https://uncoma.edu.ar/ultimas-noticias/encuentro-binacional-de-cannabis-medicinal-y-canamo-industrial/', verifiedAt: verified, dateStatus: 'confirmed',
    lat: -39.03, lon: -67.58, modality: 'Presencial',
  },
  {
    id: 'med-cannabis-krakow-2026', name: '6th Congress on Controversies on Cannabis-Based Medicines', iso: 'POL', city: 'Cracovia',
    kind: 'Congreso científico', focus: 'Salud', start: '2026-03-09', end: '2026-03-10', venue: 'Hotel Metropolo Krakow',
    description: 'Congreso clínico sobre evidencia, controversias, dolor, cáncer, seguridad y medicamentos basados en cannabis.',
    url: 'https://med-cannabis2026.com/', sourceUrl: 'https://med-cannabis2026.com/', verifiedAt: verified, dateStatus: 'confirmed',
    lat: 50.06, lon: 19.94, modality: 'Presencial',
  },
  {
    id: 'mcc-berlin-2026', name: '7th Medicinal Cannabis Congress', iso: 'DEU', city: 'Berlín',
    kind: 'Congreso científico', focus: 'Salud', start: '2026-05-28', end: '2026-05-29', venue: 'Charité, CVK Forum 3',
    description: 'Intercambio médico y científico sobre mecanismos, indicaciones y práctica clínica; edición con certificación CME.',
    url: 'https://medicinal-cannabis-congress.org/', sourceUrl: 'https://medicinal-cannabis-congress.org/', verifiedAt: verified, dateStatus: 'confirmed',
    lat: 52.54, lon: 13.35, modality: 'Presencial',
  },
  {
    id: 'icrs-dijon-2026', name: '36th ICRS Annual Symposium on the Cannabinoids', iso: 'FRA', city: 'Dijon',
    kind: 'Simposio', focus: 'Investigación', start: '2026-06-28', end: '2026-07-02', venue: 'Parc des Expositions et Congrès de Dijon',
    description: 'Encuentro anual de la International Cannabinoid Research Society para investigación básica, traslacional y clínica.',
    url: 'https://www.icrs.com/registration', sourceUrl: 'https://www.icrs.com/registration', verifiedAt: verified, dateStatus: 'confirmed',
    lat: 47.32, lon: 5.04, modality: 'Presencial',
  },
  {
    id: 'rsmj-albuquerque-2026', name: '10th Annual Scientific Meeting of the Research Society on Marijuana', iso: 'USA', city: 'Albuquerque',
    kind: 'Congreso científico', focus: 'Investigación', start: '2026-07-17', end: '2026-07-19', venue: 'Hotel Albuquerque',
    description: 'Investigación multidisciplinaria sobre uso, consecuencias, contexto, evaluación, tratamiento y aplicaciones terapéuticas.',
    url: 'https://www.researchmj.org/event-details/2026-10th-annual-rsmj-meeting', sourceUrl: 'https://www.researchmj.org/event-details/2026-10th-annual-rsmj-meeting', verifiedAt: verified, dateStatus: 'confirmed',
    lat: 35.1, lon: -106.67, modality: 'Híbrida',
  },
  {
    id: 'cmcr-2026', name: 'CMCR Symposium: Cannabis & Sport', iso: 'USA', city: 'San Diego / virtual',
    kind: 'Simposio', focus: 'Salud', start: '2026-10-01', end: '2026-10-02', venue: 'Center for Medicinal Cannabis Research, UC San Diego',
    description: 'Conferencia científica virtual sobre cannabis, ejercicio, rendimiento, recuperación y estudios clínicos.',
    url: 'https://www.cmcr.ucsd.edu/index.php/news-2/symposiums', sourceUrl: 'https://www.cmcr.ucsd.edu/index.php/news-2/symposiums', verifiedAt: verified, dateStatus: 'confirmed',
    lat: 32.88, lon: -117.24, modality: 'Virtual',
  },
  {
    id: 'ccorc-orlando-2026', name: 'Cannabis Clinical Outcomes Research Conference', iso: 'USA', city: 'Orlando',
    kind: 'Congreso científico', focus: 'Salud', start: '2026-11-05', end: '2026-11-06', venue: 'UF Academic and Research Center, Lake Nona',
    description: 'Resultados clínicos, efectos sobre la salud, interacciones farmacológicas y seguridad; abstracts revisados y publicación anunciada por el consorcio.',
    url: 'https://ccorc.mmjoutcomes.org/', sourceUrl: 'https://ccorc.mmjoutcomes.org/', verifiedAt: verified, dateStatus: 'confirmed',
    lat: 28.37, lon: -81.28, modality: 'Híbrida',
  },
  {
    id: 'mcc-berlin-2027', name: '8th Medicinal Cannabis Congress', iso: 'DEU', city: 'Berlín',
    kind: 'Congreso científico', focus: 'Salud', start: '2027-05-20', end: '2027-05-21', venue: 'Harnack-Haus, Max-Planck-Gesellschaft',
    description: 'Edición anunciada para 2027, centrada en medicamentos cannabinoides, evidencia y práctica clínica.',
    url: 'https://medicinal-cannabis-congress.org/welcome-message/', sourceUrl: 'https://medicinal-cannabis-congress.org/welcome-message/', verifiedAt: verified, dateStatus: 'confirmed',
    lat: 52.45, lon: 13.28, modality: 'Presencial',
  },
];

export const OPENALEX_TOPIC = { id: 'T10414', name: 'Cannabis and Cannabinoid Research', from: '2020-01-01' };