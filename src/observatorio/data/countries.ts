export type FrameworkKey = 'legal' | 'tolerado' | 'medicinal' | 'ilegal' | 'penal';

export type RegionKey =
  | 'América del Norte'
  | 'América Latina'
  | 'Europa occidental'
  | 'Europa oriental'
  | 'África y Oriente Medio'
  | 'Asia'
  | 'Oceanía';

export interface UsageModes {
  smoke: number;
  vape: number;
  edible: number;
  oil: number;
  hash: number;
  tea: number;
}

export interface Country {
  iso: string;
  iso2: string;
  name: string;
  region: RegionKey;
  pop: number; // millones de personas 15-64
  users: number; // millones de consumidores en el último año
  prevalence: number; // % de la población 15-64 (último año)
  framework: FrameworkKey;
  lawYear: number;
  lawNote: string;
  arrests: number; // detenciones/comunicaciones por cannabis por cada 100k hab. y año
  shareDrugOffences: number; // % de todos los delitos/detencciones por drogas que son de cannabis
  maxPrison: number; // años máximos de prisión por posesión simple
  seizures: number; // toneladas incautadas por año
  acceptance: number; // índice de aceptación cultural 0-100
  trend: number; // cambio en puntos porcentuales de prevalencia 2010 -> 2024
  modes: UsageModes;
  grid: [number, number]; // posición en el mapa de mosaicos [col, row]
}

export const FRAMEWORKS: Record<
  FrameworkKey,
  { label: string; short: string; color: string; desc: string }
> = {
  legal: {
    label: 'Uso adulto regulado',
    short: 'Legal',
    color: '#34d399',
    desc: 'Venta regulada y posesión permitida para adultos (mercado recreativo).',
  },
  tolerado: {
    label: 'Tolerado / despenalizado',
    short: 'Tolerado',
    color: '#a3e635',
    desc: 'Posesión pequeña no se castiga penalmente o no se persigue; sin mercado regulado.',
  },
  medicinal: {
    label: 'Solo uso medicinal',
    short: 'Medicinal',
    color: '#60a5fa',
    desc: 'Acceso legal con receta y licencia; el uso no médico sigue prohibido.',
  },
  ilegal: {
    label: 'Ilegal — aplicación moderada',
    short: 'Ilegal',
    color: '#fbbf24',
    desc: 'Delito, pero con sanciones leves, suspensiones o escasa prioridad policial.',
  },
  penal: {
    label: 'Ilegal — régimen penal estricto',
    short: 'Penal',
    color: '#fb7185',
    desc: 'Prisión para la posesión y aplicación policial intensa.',
  },
};

export const MODE_META: { key: keyof UsageModes; label: string; color: string }[] = [
  { key: 'smoke', label: 'Fumado (porro/pipa)', color: '#34d399' },
  { key: 'vape', label: 'Vaporizado', color: '#22d3ee' },
  { key: 'edible', label: 'Comestibles', color: '#a78bfa' },
  { key: 'oil', label: 'Aceites / sublingual', color: '#f472b6' },
  { key: 'hash', label: 'Hachís / concentrados', color: '#f59e0b' },
  { key: 'tea', label: 'Té / oral tradicional', color: '#94a3b8' },
];

export const COUNTRIES: Country[] = [
  // ─── América del Norte ───────────────────────────────────────────────
  {
    iso: 'USA', iso2: 'US', name: 'Estados Unidos', region: 'América del Norte',
    pop: 214, users: 43.9, prevalence: 20.5, framework: 'legal', lawYear: 2012,
    lawNote: '24 estados + D.C. con mercado regulado; sigue siendo delito federal.',
    arrests: 145, shareDrugOffences: 45, maxPrison: 1, seizures: 1300, acceptance: 72, trend: 6.5,
    modes: { smoke: 79, vape: 23, edible: 31, oil: 15, hash: 13, tea: 2 },
    grid: [4, 2],
  },
  {
    iso: 'CAN', iso2: 'CA', name: 'Canadá', region: 'América del Norte',
    pop: 26.5, users: 5.7, prevalence: 21.5, framework: 'legal', lawYear: 2018,
    lawNote: 'Ley del Cannabis (2018): tiendas reguladas y hasta 4 plantas por hogar.',
    arrests: 25, shareDrugOffences: 38, maxPrison: 0, seizures: 60, acceptance: 79, trend: 7.0,
    modes: { smoke: 74, vape: 27, edible: 29, oil: 21, hash: 9, tea: 3 },
    grid: [4, 1],
  },
  {
    iso: 'MEX', iso2: 'MX', name: 'México', region: 'América del Norte',
    pop: 87, users: 5.9, prevalence: 6.8, framework: 'tolerado', lawYear: 2021,
    lawNote: 'La Suprema Corte avaló el uso recreativo, pero no hay mercado regulado.',
    arrests: 22, shareDrugOffences: 33, maxPrison: 0, seizures: 2200, acceptance: 43, trend: 1.8,
    modes: { smoke: 88, vape: 8, edible: 9, oil: 5, hash: 6, tea: 2 },
    grid: [4, 3],
  },

  // ─── América Latina ──────────────────────────────────────────────────
  {
    iso: 'URY', iso2: 'UY', name: 'Uruguay', region: 'América Latina',
    pop: 2.3, users: 0.19, prevalence: 8.2, framework: 'legal', lawYear: 2013,
    lawNote: 'Primer país en regular toda la cadena: farmacias, clubes y cultivo doméstico.',
    arrests: 8, shareDrugOffences: 28, maxPrison: 0, seizures: 8, acceptance: 55, trend: 2.2,
    modes: { smoke: 90, vape: 10, edible: 8, oil: 9, hash: 5, tea: 2 },
    grid: [7, 8],
  },
  {
    iso: 'COL', iso2: 'CO', name: 'Colombia', region: 'América Latina',
    pop: 35, users: 3.1, prevalence: 8.8, framework: 'tolerado', lawYear: 2022,
    lawNote: 'Posesión hasta 20 g despenalizada; cupos de cultivo no psicoactivo.',
    arrests: 60, shareDrugOffences: 40, maxPrison: 0, seizures: 340, acceptance: 46, trend: 2.5,
    modes: { smoke: 91, vape: 7, edible: 6, oil: 4, hash: 4, tea: 2 },
    grid: [4, 5],
  },
  {
    iso: 'BRA', iso2: 'BR', name: 'Brasil', region: 'América Latina',
    pop: 144, users: 4.3, prevalence: 3.0, framework: 'tolerado', lawYear: 2024,
    lawNote: 'El STF (2024) define la posesión para consumo como infraestructura administrativa, no delito.',
    arrests: 210, shareDrugOffences: 55, maxPrison: 0, seizures: 300, acceptance: 38, trend: 0.9,
    modes: { smoke: 93, vape: 5, edible: 4, oil: 6, hash: 3, tea: 2 },
    grid: [6, 6],
  },
  {
    iso: 'ARG', iso2: 'AR', name: 'Argentina', region: 'América Latina',
    pop: 33, users: 1.85, prevalence: 5.6, framework: 'tolerado', lawYear: 2022,
    lawNote: 'Doctrina Arriola (2009) protege el consumo privado; ley medicinal 27.350.',
    arrests: 75, shareDrugOffences: 34, maxPrison: 2, seizures: 90, acceptance: 44, trend: 1.6,
    modes: { smoke: 90, vape: 9, edible: 8, oil: 8, hash: 6, tea: 2 },
    grid: [6, 8],
  },
  {
    iso: 'CHL', iso2: 'CL', name: 'Chile', region: 'América Latina',
    pop: 13.5, users: 1.07, prevalence: 7.9, framework: 'medicinal', lawYear: 2015,
    lawNote: 'Ley 20.000 con exenciones; clubes de cultivo compartido en zona gris.',
    arrests: 95, shareDrugOffences: 44, maxPrison: 0, seizures: 40, acceptance: 47, trend: 2.0,
    modes: { smoke: 88, vape: 10, edible: 7, oil: 8, hash: 5, tea: 2 },
    grid: [5, 8],
  },
  {
    iso: 'PER', iso2: 'PE', name: 'Perú', region: 'América Latina',
    pop: 23, users: 0.71, prevalence: 3.1, framework: 'medicinal', lawYear: 2017,
    lawNote: 'Registro nacional de productos derivados; el uso recreativo es delito.',
    arrests: 40, shareDrugOffences: 30, maxPrison: 2, seizures: 60, acceptance: 35, trend: 0.7,
    modes: { smoke: 92, vape: 5, edible: 4, oil: 4, hash: 3, tea: 3 },
    grid: [4, 6],
  },
  {
    iso: 'ECU', iso2: 'EC', name: 'Ecuador', region: 'América Latina',
    pop: 12, users: 0.31, prevalence: 2.6, framework: 'ilegal', lawYear: 2019,
    lawNote: 'Posesión pequeña es delito con pena atenuada; solo importación medicinal.',
    arrests: 120, shareDrugOffences: 45, maxPrison: 2, seizures: 70, acceptance: 30, trend: 0.5,
    modes: { smoke: 94, vape: 4, edible: 3, oil: 3, hash: 3, tea: 2 },
    grid: [3, 5],
  },
  {
    iso: 'BOL', iso2: 'BO', name: 'Bolivia', region: 'América Latina',
    pop: 8, users: 0.19, prevalence: 2.4, framework: 'ilegal', lawYear: 2017,
    lawNote: 'Prohibición general; bandalización del cultivo en el Chapare.',
    arrests: 30, shareDrugOffences: 25, maxPrison: 1, seizures: 30, acceptance: 33, trend: 0.4,
    modes: { smoke: 93, vape: 3, edible: 3, oil: 3, hash: 5, tea: 3 },
    grid: [5, 6],
  },
  {
    iso: 'PRY', iso2: 'PY', name: 'Paraguay', region: 'América Latina',
    pop: 4.8, users: 0.17, prevalence: 3.6, framework: 'medicinal', lawYear: 2022,
    lawNote: 'Ley medicinal de 2022; gran productor informal de prensado para la región.',
    arrests: 55, shareDrugOffences: 38, maxPrison: 2, seizures: 30, acceptance: 36, trend: 0.6,
    modes: { smoke: 90, vape: 4, edible: 4, oil: 4, hash: 12, tea: 3 },
    grid: [5, 7],
  },
  {
    iso: 'JAM', iso2: 'JM', name: 'Jamaica', region: 'América Latina',
    pop: 2.0, users: 0.26, prevalence: 13.0, framework: 'tolerado', lawYear: 2015,
    lawNote: 'Despenalización (2015) con exención religiosa rastafari y licencias galleras.',
    arrests: 45, shareDrugOffences: 50, maxPrison: 0, seizures: 15, acceptance: 62, trend: 1.2,
    modes: { smoke: 95, vape: 4, edible: 5, oil: 4, hash: 3, tea: 6 },
    grid: [5, 4],
  },

  // ─── Europa occidental ───────────────────────────────────────────────
  {
    iso: 'DEU', iso2: 'DE', name: 'Alemania', region: 'Europa occidental',
    pop: 60, users: 5.0, prevalence: 8.4, framework: 'legal', lawYear: 2024,
    lawNote: 'Ley CanG: 25 g en público, 3 plantas y clubes sociales de hasta 500 socios.',
    arrests: 85, shareDrugOffences: 33, maxPrison: 0, seizures: 90, acceptance: 68, trend: 3.4,
    modes: { smoke: 82, vape: 16, edible: 12, oil: 12, hash: 18, tea: 3 },
    grid: [13, 3],
  },
  {
    iso: 'MLT', iso2: 'MT', name: 'Malta', region: 'Europa occidental',
    pop: 0.34, users: 0.022, prevalence: 6.5, framework: 'legal', lawYear: 2021,
    lawNote: 'Primer Estado de la UE en legalizar el uso adulto: 7 g en público, 50 g en casa.',
    arrests: 3, shareDrugOffences: 25, maxPrison: 0, seizures: 0.1, acceptance: 62, trend: 1.5,
    modes: { smoke: 84, vape: 15, edible: 12, oil: 10, hash: 9, tea: 2 },
    grid: [9, 5],
  },
  {
    iso: 'LUX', iso2: 'LU', name: 'Luxemburgo', region: 'Europa occidental',
    pop: 0.45, users: 0.025, prevalence: 5.5, framework: 'legal', lawYear: 2023,
    lawNote: 'Uso doméstico legal desde 2023; cultivo doméstico de 4 plantas.',
    arrests: 12, shareDrugOffences: 27, maxPrison: 0, seizures: 0.1, acceptance: 60, trend: 1.1,
    modes: { smoke: 83, vape: 15, edible: 11, oil: 11, hash: 14, tea: 2 },
    grid: [11, 2],
  },
  {
    iso: 'NLD', iso2: 'NL', name: 'Países Bajos', region: 'Europa occidental',
    pop: 12.3, users: 1.13, prevalence: 9.2, framework: 'tolerado', lawYear: 1976,
    lawNote: 'Tolerancia desde 1976 (criterio AHOJ-G); experimento de café legal desde 2024.',
    arrests: 20, shareDrugOffences: 22, maxPrison: 0, seizures: 30, acceptance: 70, trend: 1.2,
    modes: { smoke: 85, vape: 14, edible: 9, oil: 9, hash: 21, tea: 2 },
    grid: [12, 3],
  },
  {
    iso: 'ESP', iso2: 'ES', name: 'España', region: 'Europa occidental',
    pop: 34, users: 3.88, prevalence: 11.4, framework: 'tolerado', lawYear: 1992,
    lawNote: 'Consumo privado y clubes sociales en zona gris; la regulación estatal está estancada.',
    arrests: 30, shareDrugOffences: 28, maxPrison: 0, seizures: 500, acceptance: 63, trend: 2.4,
    modes: { smoke: 88, vape: 12, edible: 7, oil: 7, hash: 34, tea: 2 },
    grid: [9, 3],
  },
  {
    iso: 'PRT', iso2: 'PT', name: 'Portugal', region: 'Europa occidental',
    pop: 7.4, users: 0.53, prevalence: 7.2, framework: 'tolerado', lawYear: 2001,
    lawNote: 'Despenalización de todas las drogas (2001): comisiones de disuasión, no cárcel.',
    arrests: 8, shareDrugOffences: 15, maxPrison: 0, seizures: 12, acceptance: 58, trend: 1.0,
    modes: { smoke: 87, vape: 13, edible: 8, oil: 8, hash: 27, tea: 2 },
    grid: [8, 3],
  },
  {
    iso: 'FRA', iso2: 'FR', name: 'Francia', region: 'Europa occidental',
    pop: 46, users: 5.06, prevalence: 11.0, framework: 'ilegal', lawYear: 2025,
    lawNote: 'Marco represivo (1 año y 3.750 €); acceso medicinal ampliado en 2025 tras el experimento.',
    arrests: 220, shareDrugOffences: 79, maxPrison: 1, seizures: 130, acceptance: 45, trend: 2.8,
    modes: { smoke: 91, vape: 10, edible: 4, oil: 4, hash: 52, tea: 1 },
    grid: [10, 3],
  },
  {
    iso: 'ITA', iso2: 'IT', name: 'Italia', region: 'Europa occidental',
    pop: 43, users: 4.09, prevalence: 9.5, framework: 'medicinal', lawYear: 2013,
    lawNote: 'Cannabis medicinal en farmacias; los clubes sociales sufren redadas desde 2019.',
    arrests: 55, shareDrugOffences: 40, maxPrison: 0, seizures: 250, acceptance: 52, trend: 1.6,
    modes: { smoke: 89, vape: 11, edible: 6, oil: 7, hash: 30, tea: 2 },
    grid: [9, 4],
  },
  {
    iso: 'GBR', iso2: 'GB', name: 'Reino Unido', region: 'Europa occidental',
    pop: 47, users: 3.95, prevalence: 8.4, framework: 'medicinal', lawYear: 2018,
    lawNote: 'Cannabis medicinal con receta privada desde 2018; posesión: hasta 5 años.',
    arrests: 105, shareDrugOffences: 63, maxPrison: 5, seizures: 110, acceptance: 50, trend: 1.1,
    modes: { smoke: 90, vape: 11, edible: 7, oil: 6, hash: 22, tea: 1 },
    grid: [10, 2],
  },
  {
    iso: 'BEL', iso2: 'BE', name: 'Bélgica', region: 'Europa occidental',
    pop: 8.4, users: 0.57, prevalence: 6.8, framework: 'tolerado', lawYear: 2003,
    lawNote: 'Nota ministerial de 2003: hasta 3 g y una planta no se persiguen.',
    arrests: 35, shareDrugOffences: 25, maxPrison: 0, seizures: 25, acceptance: 55, trend: 1.0,
    modes: { smoke: 86, vape: 13, edible: 8, oil: 8, hash: 24, tea: 2 },
    grid: [11, 3],
  },
  {
    iso: 'CHE', iso2: 'CH', name: 'Suiza', region: 'Europa occidental',
    pop: 6.3, users: 0.54, prevalence: 8.5, framework: 'tolerado', lawYear: 2023,
    lawNote: 'Pilotos científicos de venta regulada en Basilea, Zúrich y Ginebra.',
    arrests: 45, shareDrugOffences: 40, maxPrison: 1, seizures: 10, acceptance: 61, trend: 1.9,
    modes: { smoke: 84, vape: 16, edible: 10, oil: 10, hash: 20, tea: 2 },
    grid: [10, 4],
  },
  {
    iso: 'AUT', iso2: 'AT', name: 'Austria', region: 'Europa occidental',
    pop: 6.6, users: 0.32, prevalence: 4.9, framework: 'medicinal', lawYear: 2008,
    lawNote: 'Dronabinol con receta; la posesión pequeña se castiga según la cantidad.',
    arrests: 60, shareDrugOffences: 45, maxPrison: 0, seizures: 12, acceptance: 48, trend: 0.8,
    modes: { smoke: 88, vape: 11, edible: 5, oil: 6, hash: 16, tea: 2 },
    grid: [11, 4],
  },
  {
    iso: 'IRL', iso2: 'IE', name: 'Irlanda', region: 'Europa occidental',
    pop: 3.5, users: 0.18, prevalence: 5.0, framework: 'medicinal', lawYear: 2019,
    lawNote: 'Programa de cannabis medicinal de 2019; <100 € se tramita como multa.',
    arrests: 70, shareDrugOffences: 55, maxPrison: 0, seizures: 8, acceptance: 47, trend: 0.9,
    modes: { smoke: 91, vape: 9, edible: 6, oil: 6, hash: 15, tea: 1 },
    grid: [9, 2],
  },
  {
    iso: 'DNK', iso2: 'DK', name: 'Dinamarca', region: 'Europa occidental',
    pop: 4.2, users: 0.29, prevalence: 6.9, framework: 'medicinal', lawYear: 2018,
    lawNote: 'Piloto medicinal de 4 años (prorrogado); debate sobre la Freetown Christiania.',
    arrests: 55, shareDrugOffences: 38, maxPrison: 0, seizures: 12, acceptance: 54, trend: 0.9,
    modes: { smoke: 86, vape: 13, edible: 8, oil: 8, hash: 22, tea: 2 },
    grid: [12, 2],
  },
  {
    iso: 'SWE', iso2: 'SE', name: 'Suecia', region: 'Europa occidental',
    pop: 7.4, users: 0.34, prevalence: 4.6, framework: 'penal', lawYear: 2022,
    lawNote: 'Política de tolerancia cero: el consumo mismo es delito leve; pruebas de orina obligatorias.',
    arrests: 95, shareDrugOffences: 40, maxPrison: 3, seizures: 6, acceptance: 30, trend: 0.3,
    modes: { smoke: 87, vape: 12, edible: 5, oil: 6, hash: 14, tea: 1 },
    grid: [13, 2],
  },
  {
    iso: 'NOR', iso2: 'NO', name: 'Noruega', region: 'Europa occidental',
    pop: 3.8, users: 0.23, prevalence: 6.0, framework: 'ilegal', lawYear: 2021,
    lawNote: 'Multas administrativas para la posesión pequeña; sin programa medicinal regular.',
    arrests: 110, shareDrugOffences: 45, maxPrison: 2, seizures: 8, acceptance: 33, trend: 0.5,
    modes: { smoke: 88, vape: 11, edible: 5, oil: 6, hash: 18, tea: 1 },
    grid: [14, 2],
  },
  {
    iso: 'CZE', iso2: 'CZ', name: 'Chequia', region: 'Europa occidental',
    pop: 7.6, users: 0.90, prevalence: 11.8, framework: 'tolerado', lawYear: 2025,
    lawNote: 'Regulación del cannabis para adultos (2025): 50 g en seco, 5 plantas y clubes.',
    arrests: 25, shareDrugOffences: 22, maxPrison: 0, seizures: 15, acceptance: 66, trend: 3.1,
    modes: { smoke: 85, vape: 17, edible: 11, oil: 9, hash: 15, tea: 3 },
    grid: [12, 4],
  },
  {
    iso: 'GRC', iso2: 'GR', name: 'Grecia', region: 'Europa occidental',
    pop: 7.6, users: 0.43, prevalence: 5.7, framework: 'medicinal', lawYear: 2017,
    lawNote: 'Producción y exportación medicinal autorizadas; uso recreativo penalizado.',
    arrests: 60, shareDrugOffences: 45, maxPrison: 0, seizures: 30, acceptance: 42, trend: 0.7,
    modes: { smoke: 90, vape: 8, edible: 5, oil: 6, hash: 18, tea: 2 },
    grid: [11, 5],
  },
  {
    iso: 'POL', iso2: 'PL', name: 'Polonia', region: 'Europa occidental',
    pop: 27, users: 1.08, prevalence: 4.0, framework: 'medicinal', lawYear: 2017,
    lawNote: 'Farmacias venden cannabis medicinal importado; posesión simple: hasta 3 años.',
    arrests: 65, shareDrugOffences: 40, maxPrison: 3, seizures: 25, acceptance: 40, trend: 0.6,
    modes: { smoke: 90, vape: 8, edible: 4, oil: 5, hash: 12, tea: 1 },
    grid: [14, 3],
  },
  {
    iso: 'HRV', iso2: 'HR', name: 'Croacia', region: 'Europa occidental',
    pop: 2.8, users: 0.15, prevalence: 5.5, framework: 'tolerado', lawYear: 2013,
    lawNote: 'Hasta 5 g es falta administrativa, no delito penal.',
    arrests: 40, shareDrugOffences: 35, maxPrison: 0, seizures: 5, acceptance: 46, trend: 0.8,
    modes: { smoke: 90, vape: 8, edible: 5, oil: 5, hash: 14, tea: 2 },
    grid: [10, 5],
  },
  {
    iso: 'ROU', iso2: 'RO', name: 'Rumanía', region: 'Europa oriental',
    pop: 13, users: 0.38, prevalence: 2.9, framework: 'penal', lawYear: 2022,
    lawNote: 'Sin acceso medicinal; la posesión simple se castiga con prisión (3 meses–2 años).',
    arrests: 45, shareDrugOffences: 42, maxPrison: 3, seizures: 12, acceptance: 28, trend: 0.4,
    modes: { smoke: 91, vape: 7, edible: 4, oil: 4, hash: 10, tea: 1 },
    grid: [14, 4],
  },
  {
    iso: 'UKR', iso2: 'UA', name: 'Ucrania', region: 'Europa oriental',
    pop: 29, users: 0.64, prevalence: 2.2, framework: 'medicinal', lawYear: 2024,
    lawNote: 'Ley de cannabis medicinal aprobada en 2024, en fase de implementación.',
    arrests: 50, shareDrugOffences: 35, maxPrison: 5, seizures: 15, acceptance: 38, trend: 0.4,
    modes: { smoke: 89, vape: 9, edible: 5, oil: 6, hash: 12, tea: 2 },
    grid: [15, 4],
  },
  {
    iso: 'BLR', iso2: 'BY', name: 'Bielorrusia', region: 'Europa oriental',
    pop: 6.6, users: 0.10, prevalence: 1.5, framework: 'penal', lawYear: 2015,
    lawNote: 'Listas estatales de drogas; prisión por posesión, incluso para pequeños vuelos.',
    arrests: 80, shareDrugOffences: 45, maxPrison: 5, seizures: 4, acceptance: 20, trend: 0.2,
    modes: { smoke: 90, vape: 8, edible: 4, oil: 4, hash: 10, tea: 2 },
    grid: [16, 3],
  },
  {
    iso: 'RUS', iso2: 'RU', name: 'Rusia', region: 'Europa oriental',
    pop: 100, users: 2.5, prevalence: 2.5, framework: 'penal', lawYear: 2022,
    lawNote: 'Umbral de 6 g; hasta 10 años por tráfico y endurecimiento en 2022.',
    arrests: 130, shareDrugOffences: 65, maxPrison: 3, seizures: 30, acceptance: 18, trend: 0.2,
    modes: { smoke: 88, vape: 10, edible: 3, oil: 4, hash: 16, tea: 2 },
    grid: [17, 3],
  },
  {
    iso: 'GEO', iso2: 'GE', name: 'Georgia', region: 'Europa oriental',
    pop: 2.4, users: 0.16, prevalence: 6.5, framework: 'tolerado', lawYear: 2018,
    lawNote: 'El Tribunal Constitucional despenalizó el consumo (2018); cultivo aún ilegal.',
    arrests: 5, shareDrugOffences: 25, maxPrison: 0, seizures: 3, acceptance: 44, trend: 1.1,
    modes: { smoke: 90, vape: 8, edible: 4, oil: 4, hash: 12, tea: 2 },
    grid: [17, 4],
  },
  {
    iso: 'TUR', iso2: 'TR', name: 'Turquía', region: 'Europa oriental',
    pop: 58, users: 2.03, prevalence: 3.5, framework: 'medicinal', lawYear: 2016,
    lawNote: 'Licencias estatales de cultivo para medicinal e industrial; uso recreativo penalizado.',
    arrests: 150, shareDrugOffences: 60, maxPrison: 2, seizures: 70, acceptance: 30, trend: 0.5,
    modes: { smoke: 89, vape: 7, edible: 4, oil: 4, hash: 20, tea: 3 },
    grid: [15, 5],
  },

  // ─── África y Oriente Medio ──────────────────────────────────────────
  {
    iso: 'MAR', iso2: 'MA', name: 'Marruecos', region: 'África y Oriente Medio',
    pop: 25, users: 1.45, prevalence: 5.8, framework: 'medicinal', lawYear: 2021,
    lawNote: 'Cannabis medicinal e industrial regulado (2021) en el Rif; uso recreativo prohibido.',
    arrests: 130, shareDrugOffences: 55, maxPrison: 1, seizures: 200, acceptance: 32, trend: 0.4,
    modes: { smoke: 87, vape: 6, edible: 5, oil: 4, hash: 55, tea: 8 },
    grid: [8, 6],
  },
  {
    iso: 'ZAF', iso2: 'ZA', name: 'Sudáfrica', region: 'África y Oriente Medio',
    pop: 38, users: 3.61, prevalence: 9.5, framework: 'tolerado', lawYear: 2018,
    lawNote: 'Tribunal Constitucional (2018): consumo y cultivo privados no son delito.',
    arrests: 150, shareDrugOffences: 62, maxPrison: 0, seizures: 40, acceptance: 48, trend: 1.4,
    modes: { smoke: 93, vape: 5, edible: 6, oil: 5, hash: 8, tea: 4 },
    grid: [12, 10],
  },
  {
    iso: 'NGA', iso2: 'NG', name: 'Nigeria', region: 'África y Oriente Medio',
    pop: 110, users: 11.9, prevalence: 10.8, framework: 'penal', lawYear: 2019,
    lawNote: 'La NDLEA persigue la posesión; la ley medicinal de Edo (2019) quedó sin aplicación.',
    arrests: 190, shareDrugOffences: 70, maxPrison: 4, seizures: 230, acceptance: 25, trend: 1.9,
    modes: { smoke: 96, vape: 3, edible: 4, oil: 3, hash: 6, tea: 3 },
    grid: [11, 7],
  },
  {
    iso: 'EGY', iso2: 'EG', name: 'Egipto', region: 'África y Oriente Medio',
    pop: 70, users: 3.15, prevalence: 4.5, framework: 'penal', lawYear: 2022,
    lawNote: 'Tráfico hasta cadena perpetua; consumo con prisión y multa.',
    arrests: 160, shareDrugOffences: 65, maxPrison: 5, seizures: 120, acceptance: 15, trend: 0.4,
    modes: { smoke: 92, vape: 6, edible: 4, oil: 3, hash: 18, tea: 2 },
    grid: [12, 6],
  },
  {
    iso: 'GHA', iso2: 'GH', name: 'Ghana', region: 'África y Oriente Medio',
    pop: 21, users: 1.26, prevalence: 6.0, framework: 'medicinal', lawYear: 2020,
    lawNote: 'Narcotics Commission Act (2020): cultivo industrial y medicinal bajo licencia.',
    arrests: 120, shareDrugOffences: 60, maxPrison: 5, seizures: 30, acceptance: 30, trend: 0.8,
    modes: { smoke: 95, vape: 3, edible: 4, oil: 3, hash: 5, tea: 3 },
    grid: [10, 7],
  },
  {
    iso: 'KEN', iso2: 'KE', name: 'Kenia', region: 'África y Oriente Medio',
    pop: 30, users: 1.14, prevalence: 3.8, framework: 'penal', lawYear: 2020,
    lawNote: 'Posesión hasta 10 años; el debate parlamentario sobre el cáñamo sigue abierto.',
    arrests: 140, shareDrugOffences: 60, maxPrison: 5, seizures: 25, acceptance: 24, trend: 0.6,
    modes: { smoke: 94, vape: 4, edible: 4, oil: 3, hash: 5, tea: 3 },
    grid: [14, 7],
  },
  {
    iso: 'ETH', iso2: 'ET', name: 'Etiopía', region: 'África y Oriente Medio',
    pop: 80, users: 2.56, prevalence: 3.2, framework: 'penal', lawYear: 2015,
    lawNote: 'Prohibición desde 2015 del cultivo tradicional; sin acceso medicinal.',
    arrests: 90, shareDrugOffences: 50, maxPrison: 5, seizures: 20, acceptance: 22, trend: 0.3,
    modes: { smoke: 93, vape: 3, edible: 4, oil: 3, hash: 6, tea: 6 },
    grid: [13, 7],
  },
  {
    iso: 'TZA', iso2: 'TZ', name: 'Tanzania', region: 'África y Oriente Medio',
    pop: 35, users: 1.05, prevalence: 3.0, framework: 'penal', lawYear: 2019,
    lawNote: 'Delito de posesión con prisión; erradicaciones anuales de cultivos.',
    arrests: 150, shareDrugOffences: 65, maxPrison: 5, seizures: 45, acceptance: 20, trend: 0.3,
    modes: { smoke: 95, vape: 3, edible: 3, oil: 2, hash: 5, tea: 3 },
    grid: [14, 8],
  },
  {
    iso: 'ZWE', iso2: 'ZW', name: 'Zimbabue', region: 'África y Oriente Medio',
    pop: 10, users: 0.35, prevalence: 3.5, framework: 'medicinal', lawYear: 2018,
    lawNote: 'Pionero africano en licencias de cannabis medicinal y cáñamo (2018).',
    arrests: 130, shareDrugOffences: 60, maxPrison: 5, seizures: 12, acceptance: 28, trend: 0.5,
    modes: { smoke: 94, vape: 3, edible: 4, oil: 3, hash: 6, tea: 4 },
    grid: [13, 9],
  },
  {
    iso: 'ISR', iso2: 'IL', name: 'Israel', region: 'África y Oriente Medio',
    pop: 6.5, users: 0.59, prevalence: 9.0, framework: 'medicinal', lawYear: 2019,
    lawNote: 'Líder mundial en investigación clínica; multas civiles por uso doméstico desde 2019.',
    arrests: 30, shareDrugOffences: 35, maxPrison: 3, seizures: 6, acceptance: 58, trend: 1.7,
    modes: { smoke: 85, vape: 14, edible: 10, oil: 12, hash: 8, tea: 2 },
    grid: [17, 6],
  },
  {
    iso: 'LBN', iso2: 'LB', name: 'Líbano', region: 'África y Oriente Medio',
    pop: 4.6, users: 0.14, prevalence: 3.0, framework: 'medicinal', lawYear: 2020,
    lawNote: 'Cultivo medicinal legalizado (2020) en medio de la crisis económica.',
    arrests: 60, shareDrugOffences: 45, maxPrison: 3, seizures: 15, acceptance: 28, trend: 0.3,
    modes: { smoke: 88, vape: 6, edible: 4, oil: 4, hash: 30, tea: 3 },
    grid: [16, 6],
  },

  // ─── Asia ────────────────────────────────────────────────────────────
  {
    iso: 'THA', iso2: 'TH', name: 'Tailandia', region: 'Asia',
    pop: 50, users: 1.6, prevalence: 3.2, framework: 'tolerado', lawYear: 2022,
    lawNote: 'Deslistado de 2022: auge de 18.000 dispensarios; la nueva ley vuelve a restringir el uso recreativo.',
    arrests: 25, shareDrugOffences: 30, maxPrison: 0, seizures: 18, acceptance: 45, trend: 1.6,
    modes: { smoke: 78, vape: 18, edible: 26, oil: 30, hash: 8, tea: 10 },
    grid: [20, 6],
  },
  {
    iso: 'IND', iso2: 'IN', name: 'India', region: 'Asia',
    pop: 900, users: 25.0, prevalence: 2.8, framework: 'ilegal', lawYear: 1985,
    lawNote: 'NDPS (1985) prohíbe la flor y la resina; el bhang y el uso ritual siguen tolerados.',
    arrests: 8, shareDrugOffences: 45, maxPrison: 10, seizures: 180, acceptance: 35, trend: 0.5,
    modes: { smoke: 90, vape: 4, edible: 8, oil: 4, hash: 12, tea: 9 },
    grid: [20, 5],
  },
  {
    iso: 'PAK', iso2: 'PK', name: 'Pakistán', region: 'Asia',
    pop: 150, users: 6.0, prevalence: 4.0, framework: 'ilegal', lawYear: 2001,
    lawNote: 'Charas de consumo generalizado; licencias de cáñamo medicinal desde 2020.',
    arrests: 60, shareDrugOffences: 55, maxPrison: 2, seizures: 130, acceptance: 30, trend: 0.6,
    modes: { smoke: 89, vape: 4, edible: 4, oil: 4, hash: 28, tea: 5 },
    grid: [19, 5],
  },
  {
    iso: 'AFG', iso2: 'AF', name: 'Afganistán', region: 'Asia',
    pop: 22, users: 0.77, prevalence: 3.5, framework: 'penal', lawYear: 2022,
    lawNote: 'El Emirato (2022) extiende la erradicación al cannabis; el hashish era un pilar rural.',
    arrests: 25, shareDrugOffences: 40, maxPrison: 5, seizures: 40, acceptance: 35, trend: 0.2,
    modes: { smoke: 84, vape: 3, edible: 5, oil: 3, hash: 45, tea: 12 },
    grid: [18, 5],
  },
  {
    iso: 'NPL', iso2: 'NP', name: 'Nepal', region: 'Asia',
    pop: 20, users: 0.50, prevalence: 2.5, framework: 'ilegal', lawYear: 2019,
    lawNote: 'Prohibida desde 1976; los sadhus pueden consumir en Shivaratri por tolerancia religiosa.',
    arrests: 20, shareDrugOffences: 40, maxPrison: 1, seizures: 6, acceptance: 40, trend: 0.3,
    modes: { smoke: 87, vape: 3, edible: 6, oil: 4, hash: 22, tea: 11 },
    grid: [21, 5],
  },
  {
    iso: 'LKA', iso2: 'LK', name: 'Sri Lanka', region: 'Asia',
    pop: 15, users: 0.38, prevalence: 2.5, framework: 'ilegal', lawYear: 2019,
    lawNote: 'Propuesta estatal de cultivo medicinal para exportación, aún sin ley.',
    arrests: 100, shareDrugOffences: 65, maxPrison: 2, seizures: 20, acceptance: 30, trend: 0.3,
    modes: { smoke: 90, vape: 4, edible: 5, oil: 4, hash: 12, tea: 4 },
    grid: [19, 6],
  },
  {
    iso: 'KAZ', iso2: 'KZ', name: 'Kazajistán', region: 'Asia',
    pop: 13, users: 0.23, prevalence: 1.8, framework: 'penal', lawYear: 2019,
    lawNote: 'Umbrales muy bajos; el consumo es delito administrativo y penal según la dosis.',
    arrests: 90, shareDrugOffences: 60, maxPrison: 3, seizures: 5, acceptance: 20, trend: 0.2,
    modes: { smoke: 89, vape: 8, edible: 4, oil: 4, hash: 14, tea: 2 },
    grid: [18, 4],
  },
  {
    iso: 'CHN', iso2: 'CN', name: 'China', region: 'Asia',
    pop: 1000, users: 2.0, prevalence: 0.2, framework: 'penal', lawYear: 2021,
    lawNote: 'Prohibición total: detención administrativa por consumo y test positivo.',
    arrests: 5, shareDrugOffences: 40, maxPrison: 15, seizures: 8, acceptance: 8, trend: 0.1,
    modes: { smoke: 88, vape: 9, edible: 4, oil: 4, hash: 8, tea: 2 },
    grid: [19, 4],
  },
  {
    iso: 'JPN', iso2: 'JP', name: 'Japón', region: 'Asia',
    pop: 85, users: 0.26, prevalence: 0.3, framework: 'penal', lawYear: 2023,
    lawNote: 'Ley de Control del Cannabis: hasta 7 años; endurecimiento en 2023 tras récord de detenciones juveniles.',
    arrests: 5, shareDrugOffences: 100, maxPrison: 7, seizures: 1, acceptance: 12, trend: 0.1,
    modes: { smoke: 86, vape: 10, edible: 6, oil: 5, hash: 4, tea: 1 },
    grid: [22, 4],
  },
  {
    iso: 'KOR', iso2: 'KR', name: 'Corea del Sur', region: 'Asia',
    pop: 36, users: 0.14, prevalence: 0.4, framework: 'penal', lawYear: 2019,
    lawNote: 'Solo importación medicinal (2019); se castiga el consumo incluso en el extranjero.',
    arrests: 6, shareDrugOffences: 45, maxPrison: 5, seizures: 1, acceptance: 10, trend: 0.1,
    modes: { smoke: 87, vape: 11, edible: 6, oil: 6, hash: 4, tea: 1 },
    grid: [21, 4],
  },
  {
    iso: 'VNM', iso2: 'VN', name: 'Vietnam', region: 'Asia',
    pop: 65, users: 0.65, prevalence: 1.0, framework: 'penal', lawYear: 2021,
    lawNote: 'Reeducación obligatoria y prisión; campañas de test en la calle.',
    arrests: 60, shareDrugOffences: 40, maxPrison: 5, seizures: 10, acceptance: 12, trend: 0.2,
    modes: { smoke: 92, vape: 5, edible: 4, oil: 3, hash: 6, tea: 2 },
    grid: [21, 6],
  },
  {
    iso: 'PHL', iso2: 'PH', name: 'Filipinas', region: 'Asia',
    pop: 60, users: 1.32, prevalence: 2.2, framework: 'penal', lawYear: 2002,
    lawNote: 'Posesión >10 g: cadena perpetua; la reforma medicinal está bloqueada en el Senado.',
    arrests: 90, shareDrugOffences: 45, maxPrison: 12, seizures: 15, acceptance: 14, trend: 0.3,
    modes: { smoke: 93, vape: 5, edible: 4, oil: 3, hash: 5, tea: 2 },
    grid: [22, 6],
  },
  {
    iso: 'IDN', iso2: 'ID', name: 'Indonesia', region: 'Asia',
    pop: 180, users: 3.24, prevalence: 1.8, framework: 'penal', lawYear: 2022,
    lawNote: 'Posesión >5 g hasta 12 años o cadena perpetua; sin acceso medicinal.',
    arrests: 70, shareDrugOffences: 55, maxPrison: 12, seizures: 20, acceptance: 15, trend: 0.2,
    modes: { smoke: 94, vape: 4, edible: 3, oil: 3, hash: 5, tea: 2 },
    grid: [20, 7],
  },
  {
    iso: 'MYS', iso2: 'MY', name: 'Malasia', region: 'Asia',
    pop: 22, users: 0.33, prevalence: 1.5, framework: 'penal', lawYear: 2023,
    lawNote: 'Pena de muerte para el tráfico; debate parlamentario sobre uso medicinal desde 2023.',
    arrests: 60, shareDrugOffences: 50, maxPrison: 5, seizures: 8, acceptance: 12, trend: 0.1,
    modes: { smoke: 93, vape: 4, edible: 4, oil: 3, hash: 6, tea: 2 },
    grid: [21, 7],
  },

  // ─── Oceanía ─────────────────────────────────────────────────────────
  {
    iso: 'AUS', iso2: 'AU', name: 'Australia', region: 'Oceanía',
    pop: 19, users: 2.38, prevalence: 12.5, framework: 'tolerado', lawYear: 2016,
    lawNote: 'Medicinal nacional desde 2016; esquemas de infracción y licencias de cultivo en ACT (2024).',
    arrests: 130, shareDrugOffences: 64, maxPrison: 2, seizures: 30, acceptance: 64, trend: 1.4,
    modes: { smoke: 84, vape: 17, edible: 12, oil: 11, hash: 8, tea: 2 },
    grid: [22, 9],
  },
  {
    iso: 'NZL', iso2: 'NZ', name: 'Nueva Zelanda', region: 'Oceanía',
    pop: 3.5, users: 0.51, prevalence: 14.6, framework: 'tolerado', lawYear: 2020,
    lawNote: 'Referéndum 2020: 48,4 % a favor de la legalización; medicinal legal desde 2020.',
    arrests: 90, shareDrugOffences: 55, maxPrison: 3, seizures: 5, acceptance: 62, trend: 1.0,
    modes: { smoke: 85, vape: 16, edible: 12, oil: 10, hash: 7, tea: 2 },
    grid: [23, 10],
  },
  {
    iso: 'PNG', iso2: 'PG', name: 'Papúa Nueva Guinea', region: 'Oceanía',
    pop: 5, users: 0.30, prevalence: 6.0, framework: 'penal', lawYear: 2021,
    lawNote: 'Delito de posesión; el cáñamo se promueve como cultivo de sustitución.',
    arrests: 40, shareDrugOffences: 45, maxPrison: 5, seizures: 2, acceptance: 25, trend: 0.4,
    modes: { smoke: 95, vape: 3, edible: 3, oil: 2, hash: 4, tea: 2 },
    grid: [23, 9],
  },
];

export const REGIONS: RegionKey[] = [
  'América del Norte',
  'América Latina',
  'Europa occidental',
  'Europa oriental',
  'África y Oriente Medio',
  'Asia',
  'Oceanía',
];

export const REGION_COLORS: Record<RegionKey, string> = {
  'América del Norte': '#34d399',
  'América Latina': '#a3e635',
  'Europa occidental': '#60a5fa',
  'Europa oriental': '#818cf8',
  'África y Oriente Medio': '#fbbf24',
  Asia: '#fb7185',
  Oceanía: '#22d3ee',
};

/** Detenciones por cada 1.000 consumidores (aplicación policial relativa) */
export function arrestsPerKUsers(c: Country): number {
  if (c.users <= 0) return 0;
  const arrestsTotal = c.arrests * c.pop * 10; // pop en millones -> total anual
  const usersTotal = c.users * 1_000_000;
  return (arrestsTotal / usersTotal) * 1000;
}

/** Presión policial relativa: usuarios por cada detención */
export function usersPerArrest(c: Country): number {
  const k = arrestsPerKUsers(c);
  return k > 0 ? 1000 / k : 0;
}

export const REGION_AGG = REGIONS.map((r) => {
  const list = COUNTRIES.filter((c) => c.region === r);
  const users = list.reduce((s, c) => s + c.users, 0);
  const pop = list.reduce((s, c) => s + c.pop, 0);
  return {
    region: r,
    users,
    pop,
    prevalence: pop ? (users / pop) * 100 : 0,
    countries: list.length,
    arrests: list.reduce((s, c) => s + c.arrests * c.pop, 0) / (pop || 1),
    acceptance: list.reduce((s, c) => s + c.acceptance * c.pop, 0) / (pop || 1),
    maxPrison: Math.max(...list.map((c) => c.maxPrison)),
    modes: MODE_META.reduce(
      (acc, m) => {
        acc[m.key] =
          list.reduce((s, c) => s + c.modes[m.key] * c.users, 0) / (users || 1);
        return acc;
      },
      {} as UsageModes,
    ),
  };
});
