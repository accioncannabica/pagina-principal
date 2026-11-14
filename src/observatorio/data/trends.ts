export interface YearPoint {
  year: number;
  users: number; // millones de consumidores en el último año
  prevalence: number; // % población 15-64
  medCountries: number; // países con acceso medicinal
  legalCountries: number; // países/jurisdicciones con uso adulto regulado
  arrests: number; // millones de detenciones/comunicaciones por cannabis
  acceptance: number; // índice global de aceptación cultural (0-100)
  seizures: number; // miles de toneladas incautadas (hierba + resina)
  legalMarket: number; // miles de millones de USD (mercado regulado)
}

/** Serie global 1990-2024 (estimaciones a partir de UNODC, EMCDDA, national surveys) */
export const SERIES: YearPoint[] = [
  { year: 1990, users: 88, prevalence: 2.4, medCountries: 0, legalCountries: 0, arrests: 1.6, acceptance: 21, seizures: 2450, legalMarket: 0 },
  { year: 1992, users: 101, prevalence: 2.7, medCountries: 0, legalCountries: 0, arrests: 1.8, acceptance: 23, seizures: 2900, legalMarket: 0 },
  { year: 1994, users: 118, prevalence: 3.0, medCountries: 0, legalCountries: 0, arrests: 1.95, acceptance: 26, seizures: 3400, legalMarket: 0 },
  { year: 1996, users: 132, prevalence: 3.2, medCountries: 1, legalCountries: 0, arrests: 2.05, acceptance: 28, seizures: 4100, legalMarket: 0.1 },
  { year: 1998, users: 141, prevalence: 3.4, medCountries: 4, legalCountries: 0, arrests: 2.1, acceptance: 30, seizures: 4700, legalMarket: 0.2 },
  { year: 2000, users: 147, prevalence: 3.4, medCountries: 6, legalCountries: 0, arrests: 2.15, acceptance: 31, seizures: 5100, legalMarket: 0.3 },
  { year: 2002, users: 154, prevalence: 3.5, medCountries: 9, legalCountries: 0, arrests: 2.3, acceptance: 32, seizures: 5400, legalMarket: 0.5 },
  { year: 2004, users: 160, prevalence: 3.6, medCountries: 11, legalCountries: 0, arrests: 2.5, acceptance: 34, seizures: 5900, legalMarket: 0.8 },
  { year: 2006, users: 164, prevalence: 3.6, medCountries: 13, legalCountries: 0, arrests: 2.7, acceptance: 35, seizures: 6300, legalMarket: 1.2 },
  { year: 2008, users: 169, prevalence: 3.7, medCountries: 15, legalCountries: 0, arrests: 2.8, acceptance: 37, seizures: 6800, legalMarket: 1.8 },
  { year: 2010, users: 176, prevalence: 3.8, medCountries: 17, legalCountries: 0, arrests: 2.9, acceptance: 39, seizures: 6600, legalMarket: 2.6 },
  { year: 2012, users: 178, prevalence: 3.8, medCountries: 19, legalCountries: 2, arrests: 3.0, acceptance: 42, seizures: 6500, legalMarket: 4.5 },
  { year: 2013, users: 183, prevalence: 3.9, medCountries: 21, legalCountries: 3, arrests: 3.0, acceptance: 43, seizures: 6400, legalMarket: 6.1 },
  { year: 2014, users: 182, prevalence: 3.8, medCountries: 23, legalCountries: 4, arrests: 2.95, acceptance: 44, seizures: 6300, legalMarket: 8 },
  { year: 2015, users: 183, prevalence: 3.8, medCountries: 26, legalCountries: 6, arrests: 2.9, acceptance: 45, seizures: 6100, legalMarket: 10.5 },
  { year: 2016, users: 187, prevalence: 3.9, medCountries: 29, legalCountries: 7, arrests: 2.9, acceptance: 46, seizures: 6000, legalMarket: 14 },
  { year: 2017, users: 190, prevalence: 3.9, medCountries: 33, legalCountries: 8, arrests: 2.85, acceptance: 48, seizures: 5900, legalMarket: 18 },
  { year: 2018, users: 192, prevalence: 3.9, medCountries: 38, legalCountries: 9, arrests: 2.8, acceptance: 50, seizures: 5700, legalMarket: 23 },
  { year: 2019, users: 199, prevalence: 4.0, medCountries: 44, legalCountries: 10, arrests: 2.75, acceptance: 51, seizures: 5600, legalMarket: 28 },
  { year: 2020, users: 209, prevalence: 4.1, medCountries: 50, legalCountries: 11, arrests: 2.6, acceptance: 53, seizures: 5200, legalMarket: 32 },
  { year: 2021, users: 219, prevalence: 4.3, medCountries: 55, legalCountries: 12, arrests: 2.5, acceptance: 54, seizures: 5000, legalMarket: 37 },
  { year: 2022, users: 228, prevalence: 4.4, medCountries: 60, legalCountries: 13, arrests: 2.45, acceptance: 55, seizures: 4900, legalMarket: 41 },
  { year: 2023, users: 236, prevalence: 4.5, medCountries: 64, legalCountries: 14, arrests: 2.42, acceptance: 56, seizures: 4800, legalMarket: 45 },
  { year: 2024, users: 243, prevalence: 4.6, medCountries: 68, legalCountries: 15, arrests: 2.38, acceptance: 57, seizures: 4700, legalMarket: 50 },
];

export interface Milestone {
  year: number;
  title: string;
  place: string;
  text: string;
  kind: 'legal' | 'medicinal' | 'despenalización' | 'represión' | 'internacional';
}

export const MILESTONES: Milestone[] = [
  { year: 1961, title: 'Convenio Único de Estupefacientes', place: 'ONU · Nueva York', text: 'El cannabis entra en la lista IV de sustancias sin utilidad médica. Nace la obligación internacional de prohibirlo.', kind: 'internacional' },
  { year: 1971, title: 'Controlled Substances Act', place: 'Estados Unidos', text: 'Nixon clasifica la marihuana como sustancia de Lista I, sin uso médico aceptado y alto potencial de abuso.', kind: 'represión' },
  { year: 1976, title: 'Política de tolerancia', place: 'Países Bajos', text: 'La doctrina de la "droga blanda" separa al consumidor del traficante: nacen los coffeeshops.', kind: 'despenalización' },
  { year: 1996, title: 'Proposición 215', place: 'California, EE. UU.', text: 'Primer marco medicinal moderno por votación popular. Abre la vía a 30 años de reformas estatales.', kind: 'medicinal' },
  { year: 2001, title: 'Despenalización integral', place: 'Portugal', text: 'Todas las drogas dejan de ser delito para el consumidor: comisiones de disuasión y tratamiento.', kind: 'despenalización' },
  { year: 2012, title: 'Colorado y Washington', place: 'Estados Unidos', text: 'Primeros estados con venta regulada de uso adulto. Ruptura del consenso de la "guerra contra las drogas".', kind: 'legal' },
  { year: 2013, title: 'Ley 19.172', place: 'Uruguay', text: 'Primer país del mundo en regular la cadena completa: farmacias, clubes sociales y cultivo doméstico.', kind: 'legal' },
  { year: 2015, title: 'Exención rastafari', place: 'Jamaica', text: 'Despenalización del uso religioso y medicinal en la isla que dio nombre al "ganja".', kind: 'despenalización' },
  { year: 2018, title: 'Ley del Cannabis', place: 'Canadá', text: 'Primera gran economía del G7 en legalizar el mercado recreativo nacional.', kind: 'legal' },
  { year: 2018, title: 'Sentencia del Tribunal Constitucional', place: 'Sudáfrica', text: 'El consumo y cultivo privados dejan de ser delito en el país africano más poblado con mercado informal.', kind: 'despenalización' },
  { year: 2020, title: 'Referéndum fallido (48,4 %)', place: 'Nueva Zelanda', text: 'La legalización adulta se queda a menos de dos puntos. En paralelo se aprueba el acceso medicinal.', kind: 'internacional' },
  { year: 2020, title: 'Reprogramación OMS', place: 'ONU · Viena', text: 'La Comisión de Estupefacientes retira al cannabis de la lista IV: se reconoce su uso médico.', kind: 'internacional' },
  { year: 2021, title: 'Primer Estado de la UE', place: 'Malta', text: 'Legaliza el uso adulto con asociaciones sin ánimo de lucro, evitando la venta comercial.', kind: 'legal' },
  { year: 2021, title: 'Cannabis del Rif', place: 'Marruecos', text: 'La Ley 13-21 permite el cultivo medicinal e industrial en la región de Ketama.', kind: 'medicinal' },
  { year: 2022, title: 'Deslistado y auge de dispensarios', place: 'Tailandia', text: 'Miles de tiendas abren en meses. En 2024 el gobierno intenta recomponer las restricciones.', kind: 'despenalización' },
  { year: 2023, title: 'Pilotos de venta regulada', place: 'Suiza', text: 'Basilea, Zúrich y Ginebra venden cannabis de calidad controlada a consumidores en estudio científico.', kind: 'legal' },
  { year: 2024, title: 'Ley CanG en vigor', place: 'Alemania', text: 'El mayor mercado de la UE permite posesión, cultivo doméstico y clubes sociales de 500 socios.', kind: 'legal' },
  { year: 2024, title: 'Posesión no es delito', place: 'Brasil', text: 'El STF decide que la posesión para consumo propio es infraestructura administrativa y no crimen.', kind: 'despenalización' },
  { year: 2024, title: 'Cannabis medicinal en guerra', place: 'Ucrania', text: 'Se aprueba el acceso medicinal para veteranos y pacientes oncológicos pese al conflicto.', kind: 'medicinal' },
  { year: 2025, title: 'Regulación de clubes', place: 'Chequia', text: 'Nuevo marco que permite hasta 50 g en seco, 5 plantas y clubes de cultivadores.', kind: 'legal' },
  { year: 2026, title: 'Debate en la agenda', place: 'Global', text: 'Revisión de las convenciones de la ONU, comercio transfronterizo del cáñamo y armonización en la UE.', kind: 'internacional' },
];

/** Índice de aceptación cultural por región (encuestas de opinión, 0-100) */
export const ACCEPTANCE_REGIONS = [
  { year: 2000, 'América del Norte': 44, 'América Latina': 22, 'Europa occidental': 34, 'Europa oriental': 12, 'África y Oriente Medio': 9, Asia: 7, Oceanía: 38 },
  { year: 2006, 'América del Norte': 49, 'América Latina': 25, 'Europa occidental': 41, 'Europa oriental': 15, 'África y Oriente Medio': 11, Asia: 8, Oceanía: 42 },
  { year: 2012, 'América del Norte': 57, 'América Latina': 30, 'Europa occidental': 48, 'Europa oriental': 19, 'África y Oriente Medio': 14, Asia: 10, Oceanía: 48 },
  { year: 2018, 'América del Norte': 68, 'América Latina': 38, 'Europa occidental': 58, 'Europa oriental': 24, 'África y Oriente Medio': 19, Asia: 13, Oceanía: 57 },
  { year: 2024, 'América del Norte': 75, 'América Latina': 43, 'Europa occidental': 65, 'Europa oriental': 29, 'África y Oriente Medio': 25, Asia: 17, Oceanía: 64 },
];

/** Evolución de la forma de consumo dominante (% de consumidores que la usaron en el año) */
export const MODES_EVOLUTION = [
  { year: 2010, Fumado: 91, Vaporizado: 6, Comestibles: 8, 'Aceites/CBD': 3, 'Hachís/concentrados': 9 },
  { year: 2014, Fumado: 89, Vaporizado: 12, Comestibles: 12, 'Aceites/CBD': 5, 'Hachís/concentrados': 10 },
  { year: 2018, Fumado: 86, Vaporizado: 19, Comestibles: 20, 'Aceites/CBD': 10, 'Hachís/concentrados': 11 },
  { year: 2024, Fumado: 80, Vaporizado: 24, Comestibles: 28, 'Aceites/CBD': 16, 'Hachís/concentrados': 12 },
];

/** Perfiles generacionales de consumo (distribución % de los consumidores) */
export const GENERATIONS = [
  { gen: 'Gen Z (18-27)', y2010: 8, y2024: 24, note: 'Vaporizan y prefieren comestibles; crece el uso de alto THC.' },
  { gen: 'Millennials (28-43)', y2010: 27, y2024: 38, note: 'Motor del mercado regulado: compra online y marcas de bienestar.' },
  { gen: 'Gen X (44-59)', y2010: 36, y2024: 26, note: 'Estabiliza su consumo; usa aceites para dormir y dolor crónico.' },
  { gen: 'Boomers (60-69)', y2010: 29, y2024: 12, note: 'Baja el peso relativo pese a crecer en números absolutos con el acceso medicinal.' },
];

export const LEGAL_MARKET_BY_FRAMEWORK = [
  { framework: 'Uso adulto regulado', users: 78, arrestsPer100k: 74, avgPrison: 0, acceptance: 71 },
  { framework: 'Tolerado / despenalizado', users: 52, arrestsPer100k: 46, avgPrison: 0.6, acceptance: 57 },
  { framework: 'Solo medicinal', users: 39, arrestsPer100k: 88, avgPrison: 1.9, acceptance: 47 },
  { framework: 'Ilegal — moderado', users: 21, arrestsPer100k: 108, avgPrison: 2.6, acceptance: 33 },
  { framework: 'Penal estricto', users: 14, arrestsPer100k: 96, avgPrison: 5.6, acceptance: 18 },
];

export const SOURCES = [
  'UNODC, World Drug Report 2024 (estimaciones de prevalencia 2019-2022)',
  'Precios: UNODC Drug Prices Portal, informes de reguladores (Health Canada, OCM, IRCCA) y relevamientos colaborativos tipo Cannabis Price Index',
  'Cáñamo: European Industrial Hemp Association (EIHA), USDA Hemp Production Report y registros nacionales de licencias',
  'OMS / Comité de Estupefacientes de la ONU, reprogramación 2020',
  'EMCDDA (EUDA), European Drug Report 2024-2025',
  'Encuestas nacionales: NSDUH, Canadian Cannabis Survey, ESS, AIHW, INEGI',
  'Registros legislativos nacionales y proyectos PINA/RIDLC de seguimiento normativo',
  'ONGs: registros públicos de asociaciones civiles, ENCOD, IDPC y relevamientos de federaciones nacionales',
  'Formación: catálogos de oferta académica universitaria y producción indexada en PubMed y Scopus',
];
