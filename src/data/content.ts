/**
 * CONTENIDO INSTITUCIONAL — Asociación Civil Acción Cannábica (@accannabica)
 *
 * Fuentes relevadas (investigación documental):
 *  - Instagram/Facebook @accannabica (bio: "✊Asociación Civil establecida en 2014 🌿 N° correlativo IGJ 1921803.
 *    ONG Vinculada a la Salud"; 13 K seguidores, 1.786 seguidos, 895 publicaciones).
 *  - Directorio Marimba (marimba.com.ar/mapa/accioncannabica) — email accioncannabica@gmail.com, CABA.
 *  - Idealist — N° correlativo IGJ 1921803 / Resolución 08/03/2018 / Registro de inscripción N°374 (IGJ Nación).
 *  - Revista "Cannabis y Salud" CONICET-CIM, Edición #5 (oct. 2025) — entrevista FACC.
 *  - cannabicaargentina.com, elplanteo.com, izquierdadiario.es (asambleas FACC 2023 / 2025).
 *  - InfoLEG / Boletín Oficial: Ley 27.350, Decreto 883/2020, Res. MS 800/2021, 3132/2024, 1780/2025,
 *    Ley 27.669, Res. ARICCAME 1/2024, 41/2026 y 69/2026, Decreto 1147/2026.
 *
 * Los bloques marcados como `demo: true` son datos de demostración para los mockups interactivos
 * (EDA, mapa de calor, gradiente de peso, agenda) y deben reemplazarse por series reales.
 */

export const ORG = {
  nombre: "Asociación Civil Acción Cannábica",
  sigla: "ACCA",
  alias: "@accannabica",
  anio: 2014,
  lema: "Accionamos política, social y culturalmente para la regulación integral del cannabis",
  descripcion:
    "Asociación Civil sin fines de lucro integrada por activistas, usuaries terapéutiques y recreativas, cultivadores, investigadores, familiares de pacientes y profesionales de distintas áreas. Activamos por el reconocimiento del derecho a todos los usos y aplicaciones responsables del cannabis.",
  cuit: "30-71629859-7",
  igj: "N° correlativo IGJ 1921803 · Resolución 08/03/2018 · Registro de inscripción N°374",
  tipo: "ONG vinculada a la salud · Derechos Humanos y Libertades Civiles",
  sede: "Ciudad Autónoma de Buenos Aires (CABA), Argentina",
  domicilio: "Av. Entre Ríos 50 — CABA (referencia de dominio público en directorios)",
  email: "accioncannabica@gmail.com",
  miembro: "Miembro fundadora de la FACC — Federación Argentina de Cannabis y Cáñamo",
  socials: [
    { red: "Instagram", handle: "@accannabica", url: "https://www.instagram.com/accannabica/", seguidores: "13 K", publicaciones: 895, siguiendo: "1.786" },
    { red: "Facebook", handle: "@accannabica", url: "https://www.facebook.com/accannabica?locale=es_LA", seguidores: "Comunidad activa", publicaciones: null, siguiendo: null },
    { red: "YouTube", handle: "Canal institucional", url: "https://www.youtube.com/channel/UCZ-k7AYk0N46MQ_EV_Joavw", seguidores: "Archivo audiovisual", publicaciones: null, siguiendo: null },
  ],
};

export const KPIS = [
  { label: "Años de activismo", display: "12+", nota: "Desde 2014 · personería IGJ 1921803 (2018)" },
  { label: "Organizaciones en la FACC", display: "25", nota: "En 9-10 provincias (Rev. Cannabis y Salud, 2025)" },
  { label: "Publicaciones en Instagram", display: "895", nota: "@accannabica · 13 K seguidores" },
  { label: "Plantas florecidas por paciente", display: "9", nota: "REPROCANN · Decreto 883/2020 (Anexo II)" },
];

/* ---------------- SPEC DRIVEN ---------------- */
export type SpecItem = { id: string; titulo: string; criterio: string; estado: "listo" | "en curso" | "backlog"; seccion: string };

export const SPEC: SpecItem[] = [
  { id: "S-01", titulo: "Harness de navegación", criterio: "Shell con rail lateral, buscador global y router por estado; profundo enlazable y accesible por teclado.", estado: "listo", seccion: "Plataforma" },
  { id: "S-02", titulo: "Quiénes somos", criterio: "Manifiesto, hitos fundacionales y datos verificables de la organización (IGJ, CUIT, contacto).", estado: "listo", seccion: "Institucional" },
  { id: "S-03", titulo: "Recorrido / Agenda", criterio: "Timeline de actividades y agenda de próximos eventos con filtros por tipo y alcance.", estado: "listo", seccion: "Institucional" },
  { id: "S-04", titulo: "Novedades", criterio: "Muro de noticias locales e internacionales con etiquetas (investigación, legislación, agronomía, cultura) y fuente.", estado: "listo", seccion: "Institucional" },
  { id: "S-05", titulo: "Redes de organizaciones", criterio: "Grafo interactivo local/provincial/internacional con ficha de contacto por organización.", estado: "listo", seccion: "Redes" },
  { id: "S-06", titulo: "REPROCANN", criterio: "Enunciado del programa, normativa citada y espacio de contacto/inscripción.", estado: "listo", seccion: "Programas" },
  { id: "S-07", titulo: "FACC", criterio: "Referenciar e interconectar a todas las organizaciones miembras de la Federación.", estado: "listo", seccion: "Redes" },
  { id: "S-08", titulo: "Tienda / Merch", criterio: "Catálogo mockup con carrito interactivo, variantes y total calculado.", estado: "listo", seccion: "Comercial" },
  { id: "S-09", titulo: "Donaciones", criterio: "Estructura de destino de fondos, calculadora de impacto y estados de cuenta (datos reales a incorporar).", estado: "en curso", seccion: "Comercial" },
  { id: "S-10", titulo: "Vista y contacto", criterio: "Formulario validado, canales y mapa de referencia de la sede.", estado: "listo", seccion: "Plataforma" },
  { id: "S-11", titulo: "EDA + mapa de calor", criterio: "Análisis exploratorio del dataset con distribuciones, correlaciones y heatmap de agenda.", estado: "listo", seccion: "Datos" },
  { id: "S-12", titulo: "Gradiente de peso", criterio: "Scatter de rendimiento (g) con gradiente por peso y selector de genotipo/ambiente.", estado: "listo", seccion: "Datos" },
  { id: "S-13", titulo: "Animaciones", criterio: "Fondo reactivo, reveals por scroll, contadores y transiciones; respeta prefers-reduced-motion.", estado: "listo", seccion: "Plataforma" },
  { id: "S-14", titulo: "Series reales", criterio: "Reemplazar datasets demo por registros internos (REPROCANN, agenda, tesorería).", estado: "backlog", seccion: "Datos" },
];

export const SKILLS = [
  { titulo: "Visualización de datos", detalle: "Gráficos SVG a medida: radiales, heatmap, red de fuerza, gradiente de peso.", icono: "chart", nivel: 95 },
  { titulo: "Análisis exploratorio (EDA)", detalle: "Perfilado del dataset, estadísticos, outliers y matriz de correlación interpretada.", icono: "flask", nivel: 90 },
  { titulo: "Diseño de interacción", detalle: "Micro-interacciones, estados hover/focus, tooltips y navegación por teclado.", icono: "cursor", nivel: 92 },
  { titulo: "Animación y motion", detalle: "Canvas reactivo, reveals por scroll, transiciones con curva de easing curada.", icono: "spark", nivel: 88 },
  { titulo: "Accesibilidad", detalle: "Contraste AA, foco visible, reduced-motion, textos alternativos en gráficos.", icono: "eye", nivel: 85 },
  { titulo: "Marco normativo", detalle: "Ley 27.350, Decreto 883/2020, Ley 27.669, resoluciones ARICCAME y REPROCANN.", icono: "scale", nivel: 93 },
  { titulo: "Comunicación institucional", detalle: "Contenido verificado, fuentes citadas y distinción entre dato real y demo.", icono: "megaphone", nivel: 90 },
  { titulo: "Ingeniería front-end", detalle: "React + TypeScript + Tailwind, componentes puros y tipado estricto.", icono: "code", nivel: 94 },
];

/* ---------------- QUIÉNES SOMOS ---------------- */
export const PILARES = [
  { titulo: "Derechos", texto: "Defensa del derecho al acceso, al cultivo y al uso responsable del cannabis, con perspectiva de derechos humanos.", icono: "scale" },
  { titulo: "Salud", texto: "Acompañamiento a pacientes y familias, articulación con profesionales y vínculo con el ecosistema científico.", icono: "heart" },
  { titulo: "Cultura", texto: "Educación popular, comunicación y desestigmatización: salir de la clandestinidad con información.", icono: "book" },
  { titulo: "Agroecología", texto: "Cultivo asociativo, semillas y soberanía productiva desde una matriz agroecológica y feminista.", icono: "leaf" },
];

export const HITOS = [
  { anio: "2014", titulo: "Fundación del colectivo", texto: "Activistas, usuaries y profesionales se organizan para reclamar el reconocimiento de los usos responsables del cannabis." },
  { anio: "2017", titulo: "Ley 27.350", texto: "Se sanciona la ley de investigación médica y científica del uso medicinal de la planta de cannabis y sus derivados." },
  { anio: "2018", titulo: "Personería jurídica", texto: "IGJ Nación: N° correlativo 1921803, Resolución del 08/03/2018 y Registro de inscripción N°374." },
  { anio: "2020", titulo: "Decreto 883/2020", texto: "Reglamentación de la Ley 27.350: se crea el REPROCANN y se habilitan autocultivo y organizaciones cultivadoras." },
  { anio: "2022", titulo: "Nace la FACC", texto: "16 organizaciones de todo el país fundan la Federación Argentina de Cannabis y Cáñamo; Acción Cannábica es miembro fundador." },
  { anio: "2023", titulo: "1ª Asamblea FACC", texto: "Encuentro federal en El Trapiche (San Luis) con 12 organizaciones y 55 participantes; secretarías y mesa consultiva ARICCAME." },
  { anio: "2025", titulo: "3ª Asamblea FACC", texto: "San Ignacio (Misiones): 15 organizaciones, propuestas a la Mesa Interinstitucional provincial y el “Pacto del Río Paraná”." },
  { anio: "2026", titulo: "Agenda regulatoria", texto: "ARICCAME publica la Resolución 69/2026 (cáñamo hortícola) y el Decreto 1147/2026 prorroga la intervención de la Agencia." },
];

/* ---------------- RECORRIDO / AGENDA ---------------- */
export type Actividad = {
  fecha: string;
  tipo: "Jornada" | "Capacitación" | "Militancia" | "Cultivo" | "Investigación" | "Internacional";
  titulo: string;
  lugar: string;
  provincia: string;
  detalle: string;
  alcance: "Local" | "Provincial" | "Nacional" | "Internacional";
  demo?: boolean;
};

export const ACTIVIDADES: Actividad[] = [
  { fecha: "2025-03-15", tipo: "Militancia", titulo: "3ª Asamblea General Ordinaria de la FACC", lugar: "San Ignacio", provincia: "Misiones", detalle: "15 organizaciones de todas las regiones. Estrategias de despenalización, nueva Ley de Drogas e industria del cáñamo.", alcance: "Nacional" },
  { fecha: "2025-05-09", tipo: "Capacitación", titulo: "Congreso Internacional de Cáñamo Industrial y Cannabis Medicinal", lugar: "UNAJ — Buenos Aires", provincia: "Buenos Aires", detalle: "Participación de ONGs de todo el país, mesas de legislación, agronomía y uso veterinario.", alcance: "Internacional" },
  { fecha: "2025-08-09", tipo: "Jornada", titulo: "Jornada de Cannabis Terapéutico, Adaptógenos y Psilocibina", lugar: "Sala Luz y Fuerza — Córdoba", provincia: "Córdoba", detalle: "Endocannabinología y alternativas terapéuticas para profesionales de la salud y público general.", alcance: "Provincial" },
  { fecha: "2025-09-16", tipo: "Investigación", titulo: "Relevamiento a usuaries y cultivadores (Ley 23.737)", lugar: "CABA", provincia: "CABA", detalle: "Instrumento de 32 preguntas implementado junto a Ciencia Sativa y AUPAC; análisis de causas y perfiles.", alcance: "Nacional" },
  { fecha: "2026-02-26", tipo: "Militancia", titulo: "Red Federal de Abogacía Cannábica", lugar: "Encuentro nacional", provincia: "CABA", detalle: "25 miembros, 19 fundadores en 11 provincias. Contención jurídica federal para casos por cultivo.", alcance: "Nacional" },
  { fecha: "2026-06-30", tipo: "Investigación", titulo: "ARICCAME — Resolución 41/2026", lugar: "Nación", provincia: "Nacional", detalle: "Régimen especial de adecuación para licencias de órganos de propagación de Cannabis sativa L. con fines medicinales.", alcance: "Nacional" },
  { fecha: "2026-09-03", tipo: "Investigación", titulo: "ARICCAME — Resolución 69/2026", lugar: "Nación", provincia: "Nacional", detalle: "Licencias de cáñamo con fin hortícola (inflorescencias y biomasa, THC ≤ 1%): 4 categorías, 5 años de vigencia.", alcance: "Nacional" },
  { fecha: "2026-10-06", tipo: "Militancia", titulo: "Decreto 1147/2026 — intervención ARICCAME", lugar: "Nación", provincia: "Nacional", detalle: "Prórroga por un año de la intervención del organismo; pendientes de licenciamiento y trazabilidad.", alcance: "Nacional" },
  /* --- Agenda próxima (estructura; a confirmar por la organización) --- */
  { fecha: "2026-11-21", tipo: "Jornada", titulo: "Jornada de formación para organizaciones miembras", lugar: "Sede a confirmar — CABA", provincia: "CABA", detalle: "Taller de requisitos REPROCANN para asociaciones civiles y fundaciones (Res. 1780/2025).", alcance: "Local", demo: true },
  { fecha: "2026-12-05", tipo: "Capacitación", titulo: "Clínica de cultivo: control de THC y buenas prácticas", lugar: "Encuentro agroecológico", provincia: "Buenos Aires", detalle: "Buenas prácticas agrícolas, identificación de lotes y manejo de muestras según Anexos ARICCAME.", alcance: "Provincial", demo: true },
  { fecha: "2027-03-12", tipo: "Militancia", titulo: "4ª Asamblea Anual de la FACC", lugar: "Sede a definir por asamblea", provincia: "Nacional", detalle: "Revisión de estatuto, secretarías y estrategia federal para la nueva Ley de Drogas.", alcance: "Nacional", demo: true },
];

export const AGENDA_FILTROS = ["Todos", "Jornada", "Capacitación", "Militancia", "Cultivo", "Investigación", "Internacional"] as const;

/* ---------------- NOVEDADES ---------------- */
export type Noticia = {
  fecha: string;
  categoria: "Legislación" | "Investigación" | "Agronomía" | "Cultura" | "Internacional" | "Salud";
  titular: string;
  bajada: string;
  fuente: string;
  url?: string;
  etiquetas: string[];
};

export const NOTICIAS: Noticia[] = [
  {
    fecha: "2026-10-20",
    categoria: "Legislación",
    titular: "ARICCAME seguirá intervenida por un año más",
    bajada: "El Decreto 1147/2026 prorroga la intervención de la Agencia Regulatoria de la Industria del Cáñamo y del Cannabis Medicinal y ratifica a Ignacio Ferrari. El propio Gobierno reconoce pendientes en licenciamiento, revisión de autorizaciones, coordinación con provincias y trazabilidad.",
    fuente: "Cannábica Argentina / Marimba",
    url: "https://cannabicaargentina.com/",
    etiquetas: ["ARICCAME", "Ley 27.669", "licencias"],
  },
  {
    fecha: "2026-09-03",
    categoria: "Legislación",
    titular: "Argentina habilita la producción de flores de cáñamo con hasta 1% de THC",
    bajada: "La Resolución 69/2026 crea un régimen de licencias para producir, acondicionar y comercializar inflorescencias y biomasa de Cannabis sativa L. no psicoactivo. Cuatro categorías (producción agrícola, elaboración de derivados, servicios conexos y comercio exterior), 5 años de vigencia, validación anual y arancel de evaluación de $150.000. Se prohíbe el cultivo a cielo abierto y el destino a combustión.",
    fuente: "Boletín Oficial / Cannábica Argentina",
    url: "https://cannabicaargentina.com/2026/09/04/ariccame-oficializo-el-regimen-de-licencias-para-la-produccion-y-comercializacion-de-canamo-con-fin-horticola/",
    etiquetas: ["ARICCAME", "cáñamo", "CBD", "trazabilidad"],
  },
  {
    fecha: "2026-06-30",
    categoria: "Agronomía",
    titular: "Nuevo régimen para licencias de órganos de propagación",
    bajada: "Resolución 41/2026: régimen especial de adecuación para semillas, plantines y esquejes con fines medicinales. Excluye expresamente inflorescencias y biomasa floral y articula con INASE, SENASA, Salud y ARCA.",
    fuente: "Indicadores.ar / ARICCAME",
    etiquetas: ["semillas", "INASE", "fitomejoramiento"],
  },
  {
    fecha: "2025-11-01",
    categoria: "Investigación",
    titular: "“La unión hace la fuerza”: la FACC en la revista Cannabis y Salud",
    bajada: "La revista del CONICET-CIM publica la edición #5 con una entrevista a Roxana Aguirre (presidenta de Ciencia Sativa y de la FACC) y a Nicolás Millione (expresidente e integrante de Acción Cannábica): federalismo, secretarías y 25 organizaciones en red.",
    fuente: "Revista Cannabis y Salud — CONICET CIM",
    url: "https://cim.conicet.gov.ar/wp-content/uploads/sites/174/2025/11/Revista-CyS-N-5-1.pdf",
    etiquetas: ["FACC", "CONICET", "entrevista"],
  },
  {
    fecha: "2025-05-23",
    categoria: "Legislación",
    titular: "REPROCANN: nuevos requisitos de inscripción",
    bajada: "Resolución 1780/2025: la formación en cannabis medicinal (diplomatura o maestría) pasa a ser requisito excluyente para profesionales; se ajustan rangos de cultivo y declaraciones juradas de domicilio de las personas jurídicas.",
    fuente: "Ministerio de Salud — legisalud.gov.ar",
    url: "http://www.legisalud.gov.ar/pdf/msres1780_2025anexo1.pdf",
    etiquetas: ["REPROCANN", "Res. 1780/2025", "REFEPS"],
  },
  {
    fecha: "2025-05-10",
    categoria: "Legislación",
    titular: "Consejo Federal para el Desarrollo de la Industria del Cáñamo",
    bajada: "Cuarta reunión del organismo creado por la Ley 27.669 con delegados provinciales y ARICCAME. Se informó el avance en emisión de licencias por provincia y los obstáculos en importación de semillas.",
    fuente: "Agencia Provincial de Noticias (La Pampa)",
    etiquetas: ["Consejo Federal", "Ley 27.669", "semillas"],
  },
  {
    fecha: "2025-04-07",
    categoria: "Legislación",
    titular: "Conformación de la Red Federal de Abogacía Cannábica",
    bajada: "Primera asociación civil de distintas ramas del derecho con especialistas en marcos regulatorios de cannabis y cáñamo: 25 miembros, 19 fundadores, en 11 provincias.",
    fuente: "Foro de Abogados de San Juan",
    url: "https://www.fasj.org.ar/wp/2025/04/07/conformacion-de-la-red-federal-de-abogacia-cannabica/",
    etiquetas: ["abogacía", "derechos", "federal"],
  },
  {
    fecha: "2026-09-03",
    categoria: "Internacional",
    titular: "Nueva Zelanda deja de tratar al cáñamo como droga",
    bajada: "El país eliminó las licencias de cultivo y elevó el límite permitido de THC al 1%, aunque mantiene restricciones sobre flores, hojas y productos fumables.",
    fuente: "Marimba / Cannábica Argentina",
    etiquetas: ["Nueva Zelanda", "THC 1%", "regulación"],
  },
  {
    fecha: "2025-03-18",
    categoria: "Legislación",
    titular: "Misiones impulsa el “Pacto del Río Paraná”",
    bajada: "El ministro de Agro y Producción, Facundo López Sartori, propuso articular a las provincias de la cuenca para consolidar una legislación nacional que ordene la producción y garantice el acceso al cannabis y al cáñamo.",
    fuente: "Economis / Noticias del 6",
    etiquetas: ["Misiones", "Pacto del Río Paraná", "industria"],
  },
];

/* ---------------- REDES ---------------- */
export type Organizacion = {
  nombre: string;
  sigla: string;
  ambito: "Local" | "Provincial" | "Nacional" | "Internacional";
  territorio: string;
  eje: string;
  contacto: string;
  web?: string;
  instagram?: string;
  facc: boolean;
  demo?: boolean;
};

export const ORGANIZACIONES: Organizacion[] = [
  { nombre: "Asociación Civil Acción Cannábica", sigla: "ACCA", ambito: "Nacional", territorio: "CABA", eje: "Derechos · Salud · Cultura", contacto: "accioncannabica@gmail.com", instagram: "https://www.instagram.com/accannabica/", facc: true },
  { nombre: "Asociación de Usuaries y Profesionales para el Abordaje del Cannabis", sigla: "AUPAC", ambito: "Provincial", territorio: "Rosario, Santa Fe", eje: "Clínica · Formación · Políticas públicas", contacto: "aupac.org.ar", web: "https://aupac.org.ar/", facc: true },
  { nombre: "Asociación Civil Ciencia Sativa", sigla: "Ciencia Sativa", ambito: "Provincial", territorio: "Río Negro", eje: "Cultivo · Convenio INTA", contacto: "Presidencia de la FACC", facc: true },
  { nombre: "Cogollos Córdoba", sigla: "Cogollos", ambito: "Provincial", territorio: "Córdoba", eje: "Pionera del movimiento · CD FACC", contacto: "Referente: Nicolás Costamagna", facc: true },
  { nombre: "Proyecto Cáñamo", sigla: "PC", ambito: "Provincial", territorio: "Buenos Aires", eje: "Industria · Agroecología", contacto: "Miembro fundador FACC", facc: true },
  { nombre: "Doing Canna", sigla: "DC", ambito: "Provincial", territorio: "Buenos Aires", eje: "Investigación · Cultivo", contacto: "Miembro fundador FACC", facc: true },
  { nombre: "Cannabicultores del Sur", sigla: "CdS", ambito: "Provincial", territorio: "Sur argentino", eje: "Cultivo asociativo", contacto: "Miembro FACC", facc: true },
  { nombre: "Asociación Correntina Cannábica", sigla: "ACC", ambito: "Provincial", territorio: "Corrientes", eje: "Acompañamiento · Derechos", contacto: "Miembro FACC", facc: true },
  { nombre: "Club de Cultivo Brotar", sigla: "Brotar", ambito: "Provincial", territorio: "El Trapiche, San Luis", eje: "Cultivo · Anfitrión asamblea 2023", contacto: "Miembro FACC", facc: true },
  { nombre: "Colectivo Cannábico Traslasierra", sigla: "CCT", ambito: "Provincial", territorio: "Traslasierra, Córdoba", eje: "Comunitario · Agroecología", contacto: "Miembro FACC", facc: true },
  { nombre: "Misiones Activa", sigla: "MA", ambito: "Provincial", territorio: "Misiones", eje: "Mesa provincial de cannabis", contacto: "Anfitrión asamblea 2025", facc: true },
  { nombre: "Madres Cultivadoras Argentinas", sigla: "MCA", ambito: "Nacional", territorio: "Federal", eje: "Género · Cuidados", contacto: "Miembro FACC", facc: true },
  { nombre: "Laboratorio Popular Argentino", sigla: "LPA", ambito: "Nacional", territorio: "Federal", eje: "Extracción · Control de calidad", contacto: "Miembro FACC", facc: true },
  { nombre: "Raíces de Fuego", sigla: "RF", ambito: "Provincial", territorio: "Noroeste argentino", eje: "Cultura · Militancia", contacto: "Miembro FACC", facc: true },
  { nombre: "Venado Planta Salud", sigla: "VPS", ambito: "Provincial", territorio: "Venado Tuerto, Santa Fe", eje: "Salud · Cultivo solidario", contacto: "Miembro FACC", facc: true },
  { nombre: "Centro de Estudios sobre la Cultura Cannábica Argentina", sigla: "CECCa", ambito: "Nacional", territorio: "Federal", eje: "Cultura · Historia · Archivo", contacto: "Primera personería sin alterar nombre (2013)", facc: false },
  { nombre: "Cannabis Medicinal Origen San Juan", sigla: "CANME", ambito: "Provincial", territorio: "San Juan", eje: "Medicinal · Producción", contacto: "Presente en Congreso UNAJ 2025", facc: false },
  { nombre: "Comunidad Cannábica Córdoba", sigla: "CCC", ambito: "Provincial", territorio: "Córdoba", eje: "Personería 2020 · 8.000 firmas", contacto: "Sandra Bertea (presidenta)", facc: false },
  { nombre: "Frente de Organizaciones Cannábicas Argentinas", sigla: "FOCA", ambito: "Nacional", territorio: "Federal", eje: "Antecedente histórico de la FACC", contacto: "Consejo Consultivo Honorario Ley 27.350", facc: false },
  { nombre: "Federación Argentina de Cannabis y Cáñamo", sigla: "FACC", ambito: "Nacional", territorio: "25 organizaciones · 9-10 provincias", eje: "Federación · Mesa consultiva ARICCAME", contacto: "facc.info", web: "https://facc.info/", instagram: "https://www.instagram.com/faccarg/", facc: true },
  { nombre: "Red Federal de Abogacía Cannábica", sigla: "RFAC", ambito: "Nacional", territorio: "11 provincias", eje: "Jurídico · 25 miembros", contacto: "fasj.org.ar", web: "https://www.fasj.org.ar/", facc: false },
  { nombre: "Red de Cannabis Medicinal del CONICET", sigla: "RCMC", ambito: "Nacional", territorio: "Federal", eje: "Ciencia · Evidencia", contacto: "CONICET", facc: false },
  { nombre: "Consejo Consultivo Honorario (Ley 27.350)", sigla: "CCH", ambito: "Nacional", territorio: "Nación", eje: "CONICET · ANMAT · Ministerio de Salud · 3 ONG", contacto: "Órgano consultivo nacional", facc: false },
  { nombre: "ENCyD — European Coalition for Just and Effective Drug Policies", sigla: "ENCOD", ambito: "Internacional", territorio: "Europa", eje: "Red europea de consumidores y cultivadores", contacto: "encod.org", web: "https://encod.org/", facc: false, demo: true },
  { nombre: "Federación de Clubes Cannábicos de la Argentina", sigla: "FCCA", ambito: "Nacional", territorio: "Federal", eje: "Clubes de cultivadores", contacto: "Directorio nacional", facc: false },
];

export const FACC = {
  nombre: "Federación Argentina de Cannabis y Cáñamo",
  sigla: "FACC",
  web: "https://facc.info/",
  instagram: "https://www.instagram.com/faccarg/",
  fundacion: 2022,
  miembros: 25,
  provincias: "9-10 provincias con personería jurídica",
  fundadoras: ["AUPAC (Rosario)", "Ciencia Sativa (Río Negro)", "Acción Cannábica (Buenos Aires)", "Proyecto Cáñamo (Buenos Aires)", "Cogollos Córdoba (Córdoba)", "Doing Canna (Buenos Aires)"],
  presidencia: "Roxana Aguirre (Ciencia Sativa)",
  secretariaGeneral: "Integrante de Acción Cannábica",
  antecedente: "Frente de Organizaciones Cannábicas Argentinas (FOCA)",
  identidad: "Federación verdadera, feminista y agroecológica: más de 20 organizaciones con personería jurídica en más de 9-10 provincias.",
  asambleas: [
    { n: "1ª Asamblea", fecha: "26 de marzo de 2023", lugar: "El Trapiche, San Luis", org: "Club de Cultivo Brotar", asistentes: "12 organizaciones · 55 participantes" },
    { n: "3ª Asamblea General Ordinaria", fecha: "15 y 16 de marzo de 2025", lugar: "San Ignacio, Misiones", org: "Misiones Activa", asistentes: "15 organizaciones de todas las regiones" },
  ],
  lineas: [
    { titulo: "Nueva Ley de Drogas", texto: "Estrategia federal por una ley respetuosa de les usuaries, con perspectiva de derechos humanos y desarrollo sustentable." },
    { titulo: "Mesa consultiva ARICCAME", texto: "Composición de secretarías para intervenir en la creación e implementación de políticas públicas de la Agencia." },
    { titulo: "Industria y cáñamo", texto: "Articulación con provincias, cooperativa semillera, fitomejoramiento y nodos productivos." },
    { titulo: "Género y cuidados", texto: "Talleres de formación para las grupalidades que componen la federación, con mirada feminista." },
  ],
};

/* ---------------- REPROCANN ---------------- */
export const REPROCANN = {
  titulo: "REPROCANN — Registro del Programa de Cannabis",
  definicion:
    "Registro creado en el ámbito del Ministerio de Salud de la Nación por el artículo 8° del Anexo del Decreto 883/2020, que reglamenta la Ley 27.350. Registra a las personas que acceden a la planta de cannabis y sus derivados como tratamiento medicinal, terapéutico y/o paliativo del dolor a través del cultivo controlado, a partir de la indicación de un profesional médico responsable.",
  normativa: [
    { norma: "Ley 27.350", anio: "2017", detalle: "Investigación médica y científica del uso medicinal de la planta de cannabis y sus derivados. Crea el Programa Nacional." },
    { norma: "Decreto 883/2020", anio: "2020", detalle: "Reglamentación. Crea el REPROCANN, deroga el Decreto 738/2017 y fija los rangos de cultivo del Anexo II." },
    { norma: "Resolución 800/2021", anio: "2021", detalle: "Requisitos de inscripción: usuaries, terceres cultivadores y personas jurídicas permitidas." },
    { norma: "Resolución 3132/2024", anio: "2024", detalle: "Ajuste de requisitos: certificado de vigencia anual, nómina de usuaries y declaraciones juradas." },
    { norma: "Resolución 1780/2025", anio: "2025", detalle: "La formación en cannabis medicinal (diplomatura o maestría) pasa a ser requisito excluyente para profesionales; nuevas declaraciones de domicilio." },
    { norma: "Ley 27.669", anio: "2022", detalle: "Base para el desarrollo de la industria del cannabis medicinal y el cáñamo; crea la ARICCAME y el Consejo Federal." },
  ],
  roles: [
    { rol: "Usuarie / Paciente", detalle: "Persona física con indicación médica para uso medicinal, terapéutico y/o paliativo del dolor." },
    { rol: "Autocultivo", detalle: "La persona cultiva para sí y registra el domicilio del cultivo (editable ante mudanzas)." },
    { rol: "Familiar / Responsable", detalle: "Madre, padre, tutore, curadore judicial o hije a cargo, buscable por DNI en “Mis personas a cargo”." },
    { rol: "Tercere cultivadore", detalle: "Cultiva para sí y para une únique usuarie; representa como máximo 2 personas (ella incluida)." },
    { rol: "Persona jurídica permitida", detalle: "Asociación Civil, Fundación o persona jurídica con proyectos de I+D aprobados en el marco de la Ley 27.350." },
  ],
  requisitos: [
    "Indicación médica de profesional registrado en REFEPS con formación académica en cannabis medicinal.",
    "Consentimiento informado bilateral suscripto por paciente y profesional.",
    "Validación de identidad a través de la plataforma Mi Argentina (roles: paciente, responsable, profesional, persona jurídica).",
    "Firma digital del profesional registrada ante el Ministerio de Salud de la Nación.",
    "Para personas jurídicas: nómina de usuaries, declaración jurada de cada usuarie y certificado de vigencia anual.",
    "Declaración jurada del domicilio de cultivo y notificación a la autoridad municipal o de CABA.",
    "Germoplasma declarado con origen genético cierto ante INASE.",
  ],
  rangos: [
    { item: "Plantas florecidas", valor: "1 a 9", detalle: "por paciente" },
    { item: "Cultivo interior", valor: "hasta 6 m²", detalle: "superficie cultivada" },
    { item: "Cultivo exterior", valor: "hasta 15 m²", detalle: "superficie cultivada" },
    { item: "Transporte", valor: "1-6 frascos de 30 ml", detalle: "o hasta 40 g de flores secas" },
    { item: "Tercere cultivadore", valor: "máx. 2 personas", detalle: "incluyéndose a sí mismo" },
  ],
  pasos: [
    { paso: "1", titulo: "Indicación profesional", texto: "El profesional (REFEPS) indica cannabis y suscribe el consentimiento informado." },
    { paso: "2", titulo: "Mi Argentina", texto: "La persona se valida en Mi Argentina y elige su rol: paciente, responsable o profesional." },
    { paso: "3", titulo: "Vinculación", texto: "Se genera un código de vinculación. En autocultivo se vincula solo con el profesional; con cultivador o persona jurídica se hacen dos vinculaciones." },
    { paso: "4", titulo: "Registro y autorización", texto: "Se completa el registro y se obtiene la autorización de cultivo controlado con su credencial." },
  ],
};

/* ---------------- TIENDA ---------------- */
export type Producto = {
  id: string;
  nombre: string;
  categoria: "Indumentaria" | "Papelería" | "Hogar" | "Cultivo" | "Libros";
  precio: number;
  colores: string[];
  talles: string[];
  descripcion: string;
  emoji: string;
  stock: "Alto" | "Medio" | "Bajo";
};

export const PRODUCTOS: Producto[] = [
  { id: "p1", nombre: "Remera “Accionamos”", categoria: "Indumentaria", precio: 28000, colores: ["Negro", "Crudo", "Verde lima"], talles: ["S", "M", "L", "XL", "XXL"], descripcion: "Algodón orgánico, serigrafía con tinta al agua. Diseño colectivo.", emoji: "👕", stock: "Alto" },
  { id: "p2", nombre: "Buzo canguro agroecológico", categoria: "Indumentaria", precio: 62000, colores: ["Verde musgo", "Gris"], talles: ["S", "M", "L", "XL"], descripcion: "Friza rústica con bordado del N° correlativo IGJ 1921803.", emoji: "🧥", stock: "Medio" },
  { id: "p3", nombre: "Cuaderno de campo A5", categoria: "Papelería", precio: 12000, colores: ["Kraft", "Negro"], talles: ["Único"], descripcion: "96 hojas rayadas, papel reciclado y lomo cocido.", emoji: "📓", stock: "Alto" },
  { id: "p4", nombre: "Set de stickers institucionales", categoria: "Papelería", precio: 6000, colores: ["Pack x6"], talles: ["Único"], descripcion: "Vinilo resistente al agua con la iconografía de la asociación.", emoji: "🏷️", stock: "Alto" },
  { id: "p5", nombre: "Semillero de escritorio", categoria: "Cultivo", precio: 34000, colores: ["Terracota", "Blanco"], talles: ["Único"], descripcion: "Kit didáctico para germinación (no incluye semillas reguladas).", emoji: "🪴", stock: "Bajo" },
  { id: "p6", nombre: "Taza “Cultivo y resistencia”", categoria: "Hogar", precio: 15000, colores: ["Blanco", "Negro"], talles: ["Único"], descripcion: "Cerámica esmaltada 350 ml, apta microondas y lavavajillas.", emoji: "☕", stock: "Medio" },
  { id: "p7", nombre: "Libro: Cannabis y Salud (edición demo)", categoria: "Libros", precio: 0, colores: ["Descarga"], talles: ["Único"], descripcion: "Biblioteca abierta: revista del CONICET-CIM y materiales de la FACC.", emoji: "📚", stock: "Alto" },
  { id: "p8", nombre: "Gorra bordada ACCA", categoria: "Indumentaria", precio: 22000, colores: ["Negro", "Verde"], talles: ["Único"], descripcion: "Bordado de la sigla en hilo de algodón, cierre metálico.", emoji: "🧢", stock: "Medio" },
];

export const TIENDA_NOTA = "Mockup interactivo: los precios, el stock y los medios de pago son de demostración hasta integrar la pasarela real. La recaudación se destina al fondo de actividades de la asociación.";

/* ---------------- DONACIONES ---------------- */
export const DONACION_DESTINOS = [
  { titulo: "Acompañamiento a pacientes", pct: 34, detalle: "Asesoría, vinculación con profesionales y seguimiento de trámites REPROCANN." },
  { titulo: "Acción jurídica", pct: 26, detalle: "Patrocinio y contención legal en causas por cultivo y tenencia (Ley 23.737)." },
  { titulo: "Educación y cultura", pct: 20, detalle: "Jornadas, talleres, materiales de divulgación y comunicación." },
  { titulo: "Agroecología", pct: 12, detalle: "Ensayos de cultivo, semillas y buenas prácticas con organizaciones aliadas." },
  { titulo: "Administración", pct: 8, detalle: "Contabilidad, personería, certificados de vigencia y plataforma." },
];

export const DONACION_MONTOS = [5000, 15000, 30000, 60000, 120000];

export const DONACION_NOTA = "Estructura preparada para incorporar datos reales: CBU/Alias, entidad receptora, rendición de cuentas y frecuencia de publicación. Los porcentajes son la propuesta de destino de fondos a validar por la Comisión Directiva.";

/* ---------------- CONTACTO ---------------- */
export const CONTACTO = {
  email: "accioncannabica@gmail.com",
  sede: "Ciudad Autónoma de Buenos Aires — Argentina",
  horarios: "Atención por agenda · Lunes a viernes (referencia de directorios 8:00 a 17:00 h)",
  areas: [
    { area: "Prensa y comunicación", detalle: "Notas, entrevistas y materiales de divulgación." },
    { area: "REPROCANN y pacientes", detalle: "Orientación sobre inscripción, roles y requisitos." },
    { area: "Organizaciones y FACC", detalle: "Adhesiones, secretarías y articulación federal." },
    { area: "Donaciones y alianzas", detalle: "Destino de fondos, convenios y patrocinios." },
  ],
};
