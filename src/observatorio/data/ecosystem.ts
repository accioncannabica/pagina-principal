/** Tejido civil y académico del cannabis por país */
export interface EcoRow {
  iso: string;
  /** ONGs, asociaciones civiles y cámaras sectoriales registradas */
  ngos: number;
  /** Asociaciones de pacientes / cultivo solidario dentro del total */
  patientOrgs: number;
  /** Universidades e institutos con formación formal en cannabis */
  universities: number;
  /** Programas, diplomaturas, cátedras o posgrados activos */
  programs: number;
  /** Publicaciones científicas sobre cannabis en la última década (aprox.) */
  papers: number;
  /** Año en el que surge la primera organización o cátedra relevante */
  since: number;
  /** Organización o casa de estudios emblemática */
  highlight: string;
}

export const ECOSYSTEM: EcoRow[] = [
  { iso: 'USA', ngos: 420, patientOrgs: 150, universities: 62, programs: 180, papers: 31000, since: 1970, highlight: 'NORML, MPP y Drug Policy Alliance; UC Davis, Colorado State y Northern Michigan University con grados en cannabis.' },
  { iso: 'CAN', ngos: 95, patientOrgs: 38, universities: 21, programs: 46, papers: 9800, since: 1997, highlight: 'Canadians for Fair Access to Medical Marijuana; Universidad de McGill y Niagara College con programas de producción.' },
  { iso: 'MEX', ngos: 60, patientOrgs: 24, universities: 9, programs: 14, papers: 1200, since: 2013, highlight: 'México Unido Contra la Delincuencia y ReverdeSer; UNAM con seminarios de política de drogas.' },
  { iso: 'URY', ngos: 42, patientOrgs: 18, universities: 5, programs: 12, papers: 900, since: 2006, highlight: 'Asociación de Estudios del Cannabis del Uruguay (AECU); Universidad de la República con diplomatura en cannabis medicinal.' },
  { iso: 'COL', ngos: 48, patientOrgs: 17, universities: 11, programs: 19, papers: 1100, since: 2014, highlight: 'Asociación Colombiana de Industrias del Cannabis; Universidad Nacional y Bosque con especializaciones.' },
  { iso: 'BRA', ngos: 180, patientOrgs: 120, universities: 18, programs: 34, papers: 4200, since: 2014, highlight: 'ABRACE y Apepi, pioneras en cultivo solidario; USP y UNIFESP con investigación clínica en CBD.' },
  { iso: 'ARG', ngos: 210, patientOrgs: 140, universities: 24, programs: 52, papers: 1500, since: 2015, highlight: 'Mamá Cultiva y CAMEDA; UBA, UNLP y UNR con diplomaturas en cannabis medicinal y cáñamo.' },
  { iso: 'CHL', ngos: 55, patientOrgs: 28, universities: 8, programs: 15, papers: 800, since: 2009, highlight: 'Fundación Daya, referencia regional en investigación clínica y cultivo colectivo.' },
  { iso: 'PER', ngos: 22, patientOrgs: 12, universities: 4, programs: 6, papers: 320, since: 2016, highlight: 'Buscando Esperanza, colectivo de madres que impulsó la ley medicinal de 2017.' },
  { iso: 'ECU', ngos: 14, patientOrgs: 7, universities: 3, programs: 4, papers: 180, since: 2017, highlight: 'Ecuador Cannábico y mesas técnicas con la Universidad Central del Ecuador.' },
  { iso: 'BOL', ngos: 6, patientOrgs: 3, universities: 1, programs: 1, papers: 60, since: 2018, highlight: 'Colectivos de pacientes incipientes sin reconocimiento legal.' },
  { iso: 'PRY', ngos: 11, patientOrgs: 6, universities: 2, programs: 3, papers: 90, since: 2017, highlight: 'Mamá Cultiva Paraguay, impulsora de la ley de cannabis medicinal.' },
  { iso: 'JAM', ngos: 18, patientOrgs: 5, universities: 3, programs: 7, papers: 450, since: 1976, highlight: 'Ganja Growers Association; University of the West Indies con investigación histórica en cannabis.' },

  { iso: 'DEU', ngos: 160, patientOrgs: 45, universities: 26, programs: 58, papers: 7600, since: 1994, highlight: 'Deutscher Hanfverband y ACM; Universidad de Hohenheim y Charité con cátedras de cannabinoides.' },
  { iso: 'MLT', ngos: 12, patientOrgs: 4, universities: 2, programs: 3, papers: 110, since: 2018, highlight: 'ReLeaf Malta, clave en la ley de uso adulto de 2021.' },
  { iso: 'LUX', ngos: 7, patientOrgs: 2, universities: 1, programs: 2, papers: 70, since: 2015, highlight: 'Chanvre Lëtzebuerg y mesas de diálogo con el Ministerio de Salud.' },
  { iso: 'NLD', ngos: 55, patientOrgs: 14, universities: 12, programs: 26, papers: 5400, since: 1970, highlight: 'Stichting Drugsbeleid; Universidad de Wageningen y Maastricht con investigación en cultivo y política.' },
  { iso: 'ESP', ngos: 380, patientOrgs: 70, universities: 19, programs: 41, papers: 4300, since: 1991, highlight: 'FAC, Observatorio Español de Cannabis Medicinal; Universidad Complutense con el grupo de Manuel Guzmán.' },
  { iso: 'PRT', ngos: 24, patientOrgs: 8, universities: 7, programs: 12, papers: 1300, since: 1996, highlight: 'APCM y el legado del modelo de despenalización; Universidade do Porto con farmacología de cannabinoides.' },
  { iso: 'FRA', ngos: 70, patientOrgs: 20, universities: 14, programs: 22, papers: 4100, since: 1993, highlight: 'NORML France y Chanvre & Libertés; INSERM y Université de Bordeaux con investigación en adicciones.' },
  { iso: 'ITA', ngos: 120, patientOrgs: 35, universities: 16, programs: 30, papers: 3900, since: 1995, highlight: 'Associazione Luca Coscioni; Universidad de Bolonia y Padua con cursos de cannabis terapéutico.' },
  { iso: 'GBR', ngos: 110, patientOrgs: 40, universities: 23, programs: 44, papers: 8700, since: 1967, highlight: 'Release, Transform Drug Policy Foundation; Imperial College y King\u2019s College con centros de investigación.' },
  { iso: 'BEL', ngos: 28, patientOrgs: 9, universities: 6, programs: 10, papers: 1200, since: 2003, highlight: 'Trekt Uw Plant, club pionero; Universidad de Gante con estudios de cáñamo industrial.' },
  { iso: 'CHE', ngos: 45, patientOrgs: 12, universities: 9, programs: 18, papers: 2100, since: 1992, highlight: 'Legalize it! y Medical Cannabis Verein; ETH Zúrich y Universidad de Basilea con los pilotos de venta regulada.' },
  { iso: 'AUT', ngos: 22, patientOrgs: 7, universities: 5, programs: 9, papers: 1000, since: 2004, highlight: 'Hanf Institut; Universidad de Viena con investigación en cannabinoides sintéticos.' },
  { iso: 'IRL', ngos: 18, patientOrgs: 8, universities: 4, programs: 7, papers: 700, since: 2015, highlight: 'Martin Condon Foundation y Cannabis Risk Alliance; University College Cork con farmacología.' },
  { iso: 'DNK', ngos: 20, patientOrgs: 6, universities: 5, programs: 9, papers: 900, since: 2001, highlight: 'Cannabisforeningen; Universidad de Copenhague con el programa de cannabis medicinal.' },
  { iso: 'SWE', ngos: 12, patientOrgs: 3, universities: 6, programs: 8, papers: 1400, since: 2008, highlight: 'Predominan organizaciones prohibicionistas como RNS; Karolinska Institutet lidera la investigación de riesgos.' },
  { iso: 'NOR', ngos: 14, patientOrgs: 4, universities: 4, programs: 6, papers: 800, since: 2010, highlight: 'Normal Norge; Universidad de Oslo con estudios sobre reforma de políticas.' },
  { iso: 'CZE', ngos: 35, patientOrgs: 12, universities: 8, programs: 16, papers: 1500, since: 1999, highlight: 'KOPAC, asociación de pacientes; Universidad Carolina y Palacký con investigación en cannabis medicinal.' },
  { iso: 'GRC', ngos: 16, patientOrgs: 5, universities: 5, programs: 8, papers: 600, since: 2016, highlight: 'Mastiha Cannabis Network; Universidad de Tesalónica con agronomía del cáñamo.' },
  { iso: 'POL', ngos: 30, patientOrgs: 11, universities: 7, programs: 12, papers: 1100, since: 2012, highlight: 'Wolne Konopie; Universidad Médica de Varsovia con estudios de cannabis medicinal.' },
  { iso: 'HRV', ngos: 15, patientOrgs: 6, universities: 3, programs: 5, papers: 350, since: 2013, highlight: 'Udruga Hum; Universidad de Zagreb con investigación en cáñamo.' },
  { iso: 'ROU', ngos: 8, patientOrgs: 3, universities: 2, programs: 3, papers: 280, since: 2015, highlight: 'Asociación Canabis Medicinal, en lucha por el acceso terapéutico.' },
  { iso: 'UKR', ngos: 17, patientOrgs: 9, universities: 3, programs: 5, papers: 220, since: 2019, highlight: 'Movimiento de veteranos que impulsó la ley medicinal de 2024.' },
  { iso: 'BLR', ngos: 2, patientOrgs: 1, universities: 1, programs: 1, papers: 60, since: 2016, highlight: 'Iniciativas en el exilio por la amnistía de presos por drogas.' },
  { iso: 'RUS', ngos: 5, patientOrgs: 2, universities: 4, programs: 4, papers: 900, since: 2012, highlight: 'Investigación estatal de cáñamo de fibra; activismo civil prácticamente ilegalizado.' },
  { iso: 'GEO', ngos: 9, patientOrgs: 3, universities: 2, programs: 3, papers: 110, since: 2015, highlight: 'Girchi, partido que litigó la despenalización ante el Tribunal Constitucional.' },
  { iso: 'TUR', ngos: 7, patientOrgs: 2, universities: 6, programs: 9, papers: 700, since: 2016, highlight: 'Programa estatal de cáñamo con la Universidad de Ondokuz Mayıs.' },

  { iso: 'MAR', ngos: 14, patientOrgs: 3, universities: 4, programs: 7, papers: 320, since: 2014, highlight: 'Collectif Marocain pour l\u2019Usage Médical du Kif; ANRAC y universidades del Rif en la reconversión legal.' },
  { iso: 'ZAF', ngos: 48, patientOrgs: 15, universities: 11, programs: 20, papers: 1400, since: 2000, highlight: 'Fields of Green for All; Universidad de Ciudad del Cabo y KwaZulu-Natal con programas de cáñamo.' },
  { iso: 'NGA', ngos: 9, patientOrgs: 2, universities: 5, programs: 6, papers: 400, since: 2016, highlight: 'YouthRISE Nigeria; Universidad de Lagos con estudios de salud pública.' },
  { iso: 'EGY', ngos: 3, patientOrgs: 1, universities: 3, programs: 3, papers: 350, since: 2015, highlight: 'Investigación académica aislada en un marco de prohibición estricta.' },
  { iso: 'GHA', ngos: 11, patientOrgs: 3, universities: 4, programs: 6, papers: 220, since: 2017, highlight: 'POS Foundation, clave en la reforma de 2020; KNUST con agronomía del cáñamo.' },
  { iso: 'KEN', ngos: 7, patientOrgs: 2, universities: 3, programs: 4, papers: 260, since: 2017, highlight: 'Movimiento liderado por activistas por el cáñamo como cultivo de renta.' },
  { iso: 'ETH', ngos: 3, patientOrgs: 1, universities: 2, programs: 2, papers: 120, since: 2018, highlight: 'Investigación agronómica incipiente sin marco regulatorio.' },
  { iso: 'TZA', ngos: 4, patientOrgs: 1, universities: 2, programs: 2, papers: 140, since: 2017, highlight: 'Organizaciones de reducción de daños centradas en consumo urbano.' },
  { iso: 'ZWE', ngos: 8, patientOrgs: 2, universities: 3, programs: 5, papers: 180, since: 2018, highlight: 'Zimbabwe Industrial Hemp Trust; Universidad de Zimbabue con ensayos de cáñamo.' },
  { iso: 'ISR', ngos: 38, patientOrgs: 16, universities: 14, programs: 32, papers: 6200, since: 1964, highlight: 'Cuna de la investigación cannabinoide con Raphael Mechoulam; Hebrew University y Technion.' },
  { iso: 'LBN', ngos: 6, patientOrgs: 2, universities: 3, programs: 4, papers: 190, since: 2018, highlight: 'Skoun y la Universidad Americana de Beirut en el diseño de la ley de 2020.' },

  { iso: 'THA', ngos: 32, patientOrgs: 14, universities: 15, programs: 38, papers: 1100, since: 2018, highlight: 'Highland Network; Rangsit University y Mae Fah Luang con grados en cannabis medicinal.' },
  { iso: 'IND', ngos: 26, patientOrgs: 9, universities: 17, programs: 24, papers: 3100, since: 2015, highlight: 'Great Legalisation Movement India; IIT Bombay y CSIR-IIIM con investigación en cannabinoides.' },
  { iso: 'PAK', ngos: 5, patientOrgs: 1, universities: 4, programs: 5, papers: 320, since: 2020, highlight: 'Consejo de Investigación Científica e Industrial con el programa estatal de cáñamo.' },
  { iso: 'AFG', ngos: 1, patientOrgs: 0, universities: 0, programs: 0, papers: 40, since: 2015, highlight: 'Sin tejido civil ni académico tras la prohibición de 2022.' },
  { iso: 'NPL', ngos: 6, patientOrgs: 2, universities: 2, programs: 3, papers: 130, since: 2019, highlight: 'Nepal Cannabis Initiative, por la restitución del cultivo tradicional.' },
  { iso: 'LKA', ngos: 4, patientOrgs: 2, universities: 3, programs: 4, papers: 160, since: 2017, highlight: 'Programa estatal de cannabis ayurvédico con universidades de medicina indígena.' },
  { iso: 'KAZ', ngos: 2, patientOrgs: 1, universities: 2, programs: 2, papers: 90, since: 2018, highlight: 'Investigación agronómica sobre el cáñamo silvestre de la estepa de Chu.' },
  { iso: 'CHN', ngos: 1, patientOrgs: 0, universities: 12, programs: 14, papers: 5800, since: 2010, highlight: 'Sin activismo civil; la Academia China de Ciencias Agrícolas lidera la genética del cáñamo.' },
  { iso: 'JPN', ngos: 6, patientOrgs: 3, universities: 8, programs: 10, papers: 1900, since: 2016, highlight: 'Green Zone Japan; Universidad de Tokio con farmacología de cannabinoides y CBD.' },
  { iso: 'KOR', ngos: 4, patientOrgs: 2, universities: 6, programs: 8, papers: 1200, since: 2018, highlight: 'Korea Medical Cannabis Organization; zona franca de cáñamo de Andong con universidades locales.' },
  { iso: 'VNM', ngos: 2, patientOrgs: 0, universities: 2, programs: 2, papers: 150, since: 2019, highlight: 'Investigación mínima bajo un marco de reeducación obligatoria.' },
  { iso: 'PHL', ngos: 7, patientOrgs: 4, universities: 4, programs: 5, papers: 210, since: 2014, highlight: 'Philippine Cannabis Compassion Society, impulsora del proyecto medicinal.' },
  { iso: 'IDN', ngos: 8, patientOrgs: 4, universities: 4, programs: 4, papers: 240, since: 2015, highlight: 'Lingkar Ganja Nusantara, litigante ante el Tribunal Constitucional.' },
  { iso: 'MYS', ngos: 5, patientOrgs: 2, universities: 4, programs: 5, papers: 280, since: 2018, highlight: 'Malaysian Society of Cannabis Advocacy junto a facultades de farmacia.' },

  { iso: 'AUS', ngos: 62, patientOrgs: 24, universities: 19, programs: 40, papers: 6800, since: 1993, highlight: 'Legalise Cannabis Party y MCUA; Universidad de Sídney con el Lambert Initiative.' },
  { iso: 'NZL', ngos: 26, patientOrgs: 10, universities: 7, programs: 14, papers: 1600, since: 1996, highlight: 'NORML NZ y Drug Foundation; Universidad de Otago con investigación longitudinal.' },
  { iso: 'PNG', ngos: 2, patientOrgs: 0, universities: 1, programs: 1, papers: 40, since: 2019, highlight: 'Ensayos de cáñamo con la Universidad de Tecnología de Papúa Nueva Guinea.' },
];

export const ECO_BY_ISO: Record<string, EcoRow> = Object.fromEntries(
  ECOSYSTEM.map((e) => [e.iso, e]),
);

/* ── Diccionario de términos ──────────────────────────────────────── */
export type GlossaryCat =
  | 'Botánica y cultivo'
  | 'Química y farmacología'
  | 'Formas de consumo'
  | 'Derecho y política'
  | 'Mercado y comercio'
  | 'Cultura y jerga'
  | 'Salud y reducción de daños';

export interface Term {
  term: string;
  cat: GlossaryCat;
  def: string;
  also?: string;
}

export const GLOSSARY_CATS: { key: GlossaryCat; color: string }[] = [
  { key: 'Botánica y cultivo', color: '#34d399' },
  { key: 'Química y farmacología', color: '#22d3ee' },
  { key: 'Formas de consumo', color: '#a78bfa' },
  { key: 'Derecho y política', color: '#fbbf24' },
  { key: 'Mercado y comercio', color: '#a3e635' },
  { key: 'Cultura y jerga', color: '#f472b6' },
  { key: 'Salud y reducción de daños', color: '#fb7185' },
];

export const GLOSSARY: Term[] = [
  // Botánica y cultivo
  { term: 'Cannabis sativa L.', cat: 'Botánica y cultivo', def: 'Especie vegetal única que agrupa todas las variedades de cannabis y cáñamo; la distinción legal entre ambos es jurídica, no botánica.' },
  { term: 'Cáñamo industrial', cat: 'Botánica y cultivo', def: 'Variedad de cannabis cultivada para fibra, grano o extracción, cuyo contenido de THC no supera el umbral legal (0,2 %, 0,3 % o 1 % según el país).', also: 'hemp, cannabis no psicoactivo' },
  { term: 'Cogollo / flor', cat: 'Botánica y cultivo', def: 'Inflorescencia de la planta hembra sin polinizar, donde se concentran los tricomas y la mayor parte de los cannabinoides.', also: 'bud, cola' },
  { term: 'Tricoma', cat: 'Botánica y cultivo', def: 'Glándula resinosa en la superficie de la flor que produce y almacena cannabinoides y terpenos. Su color indica el momento de cosecha.' },
  { term: 'Sinsemilla', cat: 'Botánica y cultivo', def: 'Flor sin semillas obtenida al separar las plantas macho; técnica que elevó la potencia media del cannabis desde los años setenta.' },
  { term: 'Fenotipo y genotipo', cat: 'Botánica y cultivo', def: 'El genotipo es la carga genética de la variedad; el fenotipo, su expresión concreta según el ambiente de cultivo.' },
  { term: 'Autocultivo', cat: 'Botánica y cultivo', def: 'Cultivo doméstico para consumo propio. Es la vía legal en Uruguay, Canadá, Alemania, Malta, Sudáfrica y buena parte de EE. UU.' },
  { term: 'Esqueje / clon', cat: 'Botánica y cultivo', def: 'Fragmento de planta madre enraizado para reproducir una genética idéntica sin recurrir a semillas.' },
  { term: 'Cultivo solidario', cat: 'Botánica y cultivo', def: 'Modalidad en la que cultivadores producen sin fines de lucro para pacientes que no pueden cultivar; central en Argentina, Brasil y Chile.' },

  // Química y farmacología
  { term: 'THC (delta-9-tetrahidrocannabinol)', cat: 'Química y farmacología', def: 'Principal cannabinoide psicoactivo; responsable de los efectos euforizantes y del valor legal que define la frontera cáñamo/cannabis.' },
  { term: 'CBD (cannabidiol)', cat: 'Química y farmacología', def: 'Cannabinoide no embriagante con usos en epilepsia refractaria, ansiedad y dolor; motor del mercado de aceites y cosmética.' },
  { term: 'CBG, CBN, THCV', cat: 'Química y farmacología', def: 'Cannabinoides minoritarios con perfiles propios: el CBG es precursor de otros, el CBN aparece por degradación del THC y el THCV se estudia en metabolismo.' },
  { term: 'Terpenos', cat: 'Química y farmacología', def: 'Compuestos aromáticos (mirceno, limoneno, pineno) que definen el olor y modulan el efecto de cada variedad.' },
  { term: 'Efecto séquito', cat: 'Química y farmacología', def: 'Hipótesis según la cual cannabinoides y terpenos actúan de forma sinérgica, haciendo que el extracto completo difiera de la molécula aislada.', also: 'entourage effect' },
  { term: 'Sistema endocannabinoide', cat: 'Química y farmacología', def: 'Red de receptores CB1 y CB2 y moléculas propias (anandamida, 2-AG) que regula dolor, apetito, sueño, memoria e inmunidad.' },
  { term: 'Espectro completo / amplio / aislado', cat: 'Química y farmacología', def: 'Clasificación de extractos: completo conserva todos los compuestos incluido el THC; amplio lo elimina; el aislado es cannabidiol puro.' },
  { term: 'Cannabinoides semisintéticos', cat: 'Química y farmacología', def: 'Moléculas como HHC o THC-O obtenidas en laboratorio a partir del cáñamo, que explotan vacíos legales y preocupan a los reguladores.' },

  // Formas de consumo
  { term: 'Vaporización', cat: 'Formas de consumo', def: 'Calentamiento del material por debajo del punto de combustión, lo que libera cannabinoides sin humo ni alquitranes.' },
  { term: 'Comestibles', cat: 'Formas de consumo', def: 'Alimentos infusionados; su efecto tarda entre 30 y 120 minutos y es más prolongado e intenso por el metabolismo hepático.', also: 'edibles' },
  { term: 'Tintura y aceite sublingual', cat: 'Formas de consumo', def: 'Extracto diluido que se administra bajo la lengua, con dosificación precisa en gotas y absorción intermedia.' },
  { term: 'Hachís', cat: 'Formas de consumo', def: 'Resina prensada obtenida separando los tricomas. Dominante en Europa occidental, Marruecos, Líbano y Afganistán.', also: 'chocolate, costo, charas' },
  { term: 'Concentrados / extractos', cat: 'Formas de consumo', def: 'Productos de alta potencia (BHO, rosin, hash de agua, shatter) con concentraciones de THC muy superiores a la flor.' },
  { term: 'Bhang', cat: 'Formas de consumo', def: 'Preparado tradicional indio de hojas molidas en leche o yogur, legal y de venta estatal en varios estados de la India.' },
  { term: 'Tópico', cat: 'Formas de consumo', def: 'Crema, bálsamo o parche de aplicación cutánea, generalmente sin efecto psicoactivo sistémico.' },

  // Derecho y política
  { term: 'Despenalización', cat: 'Derecho y política', def: 'Eliminación de la sanción penal para la posesión de pequeñas cantidades, que pasa a ser falta administrativa o deja de perseguirse.' },
  { term: 'Legalización / regulación', cat: 'Derecho y política', def: 'Creación de un mercado lícito con reglas de producción, venta, calidad e impuestos. Implica más que despenalizar.' },
  { term: 'Umbral de posesión', cat: 'Derecho y política', def: 'Cantidad por debajo de la cual se presume consumo personal. Varía de 5 g a 50 g y determina si hay o no proceso penal.' },
  { term: 'Convención Única de 1961', cat: 'Derecho y política', def: 'Tratado de la ONU que globalizó la prohibición. En 2020 la Comisión de Estupefacientes retiró al cannabis de su lista IV.' },
  { term: 'Club social de cannabis', cat: 'Derecho y política', def: 'Asociación sin fines de lucro de personas adultas que cultivan de forma colectiva para sus socios. Modelo de España, Malta, Alemania y Uruguay.' },
  { term: 'REPROCANN', cat: 'Derecho y política', def: 'Registro argentino del Programa de Cannabis que autoriza el cultivo controlado para uso medicinal de pacientes, familiares y ONGs.' },
  { term: 'Personería jurídica', cat: 'Derecho y política', def: 'Reconocimiento estatal que habilita a una asociación civil a actuar legalmente, firmar convenios y recibir financiamiento.' },
  { term: 'Reducción de daños', cat: 'Derecho y política', def: 'Enfoque de política pública que busca minimizar los riesgos del consumo sin exigir la abstinencia como condición previa.' },
  { term: 'Expurgo de antecedentes', cat: 'Derecho y política', def: 'Borrado de condenas previas por delitos de cannabis cuando la conducta deja de ser delito; aplicado en Canadá y varios estados de EE. UU.', also: 'expungement' },

  // Mercado y comercio
  { term: 'Dispensario', cat: 'Mercado y comercio', def: 'Punto de venta autorizado de cannabis medicinal o de uso adulto, con trazabilidad y control de edad.' },
  { term: 'Trazabilidad semilla a venta', cat: 'Mercado y comercio', def: 'Sistema que registra cada planta desde la siembra hasta el mostrador para evitar desvíos al mercado ilícito.', also: 'seed to sale' },
  { term: 'Mercado gris', cat: 'Mercado y comercio', def: 'Zona intermedia donde la actividad no está claramente prohibida ni regulada: clubes, flores de CBD o cannabinoides semisintéticos.' },
  { term: 'GACP y GMP', cat: 'Mercado y comercio', def: 'Estándares de buenas prácticas agrícolas y de manufactura exigidos para que un producto pueda venderse como medicamento.' },
  { term: 'Integración vertical', cat: 'Mercado y comercio', def: 'Modelo en el que una misma empresa cultiva, procesa y vende; frecuente en Canadá y criticado por concentrar el mercado.' },
  { term: 'Carga fiscal', cat: 'Mercado y comercio', def: 'Impuestos específicos más IVA sobre la venta legal. Si es muy alta, el precio regulado pierde frente al mercado ilícito.' },

  // Cultura y jerga
  { term: '420', cat: 'Cultura y jerga', def: 'Código cultural asociado al consumo; el 20 de abril se celebra como jornada global de movilización por la reforma.' },
  { term: 'Ganja', cat: 'Cultura y jerga', def: 'Término de origen sánscrito popularizado por la cultura rastafari jamaicana para nombrar la flor de cannabis.' },
  { term: 'Marcha Mundial de la Marihuana', cat: 'Cultura y jerga', def: 'Movilización simultánea en cientos de ciudades desde 1999 que reclama la regulación y el fin del castigo al consumidor.' },
  { term: 'Faso, porro, bareto', cat: 'Cultura y jerga', def: 'Denominaciones regionales del cigarrillo de cannabis en el español rioplatense, ibérico y andino.', also: 'churro, canuto, bate' },
  { term: 'Cultura cannábica', cat: 'Cultura y jerga', def: 'Conjunto de prácticas, símbolos, ferias, medios y organizaciones construidas alrededor de la planta y de la lucha por su regulación.' },
  { term: 'Estigma', cat: 'Cultura y jerga', def: 'Carga social negativa sobre quien consume o cultiva, que obstaculiza el acceso a la salud, el empleo y la vivienda.' },

  // Salud y reducción de daños
  { term: 'Uso problemático', cat: 'Salud y reducción de daños', def: 'Patrón de consumo que genera consecuencias negativas sostenidas en la salud, los vínculos o las obligaciones cotidianas.' },
  { term: 'Tolerancia', cat: 'Salud y reducción de daños', def: 'Necesidad de dosis mayores para obtener el mismo efecto tras un consumo frecuente; revierte con pausas de abstinencia.' },
  { term: 'Dosificación titulada', cat: 'Salud y reducción de daños', def: 'Estrategia clínica de comenzar con una dosis baja y aumentar gradualmente ("start low, go slow") hasta el efecto buscado.' },
  { term: 'Interacción farmacológica', cat: 'Salud y reducción de daños', def: 'El CBD y el THC se metabolizan por el citocromo P450 y pueden alterar los niveles de anticoagulantes, antiepilépticos y otros fármacos.' },
  { term: 'Conducción y THC', cat: 'Salud y reducción de daños', def: 'El THC afecta el tiempo de reacción; los test de saliva o sangre detectan presencia, pero no miden el grado real de afectación.' },
  { term: 'Cannabis y adolescencia', cat: 'Salud y reducción de daños', def: 'El uso frecuente antes de los 18 años se asocia a mayor riesgo sobre el desarrollo cognitivo y la salud mental.' },
];
