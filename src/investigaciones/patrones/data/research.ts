// ─── Datos reales del paper (junio 2026) ─────────────────────────────────────
// "Patrones de consumo de cannabis y percepciones de salud en usuarios/as
//  de Argentina y América Latina" — Acción Cannábica · n final = 1.046

export const META = {
  titulo: "Patrones de consumo de cannabis y percepciones de salud en usuarios/as de Argentina y América Latina",
  subtitulo: "Un estudio exploratorio con análisis estadístico y ciencia de datos",
  institucion: "Asociación Civil Acción Cannábica · N.º IGJ 1921803",
  fecha: "Junio de 2026",
  periodo: "Encuesta online autoadministrada · 21 meses (2018–2020)",
  registros: 1048,
  duplicados: 2,
  n: 1046,
};

export const AUTORES = [
  { nombre: "Horacio Adrián Rodríguez", rol: "Autor · Acción Cannábica", email: "accioncannabica@gmail.com" },
  { nombre: "Claudia Sánchez", rol: "Autora · Acción Cannábica", email: "clauycharly@yahoo.com.ar" },
  { nombre: "Daniela Rodríguez", rol: "Autora · Acción Cannábica", email: "danielapaularodriguez@gmail.com" },
  { nombre: "Esteban Calabria", rol: "Autor · Analista en ciencia de datos", email: "esteban.calabria@gmail.com" },
];
export const COLABORADORAS = [
  { nombre: "Ana Flor Sclani Horrac", rol: "Lic. en Geografía · UNLP" },
  { nombre: "Magali Avruj", rol: "Médica · UBA" },
  { nombre: "Lila Torres", rol: "Investigadora · UNLP" },
];

export interface Dist { categoria: string; n?: number; pct: number }
export const D = (categoria: string, pct: number, n?: number): Dist => ({ categoria, pct, n });

// ─── 4.1 Características de la muestra ───────────────────────────────────────
export const EDAD_STATS = { validos: 1040, min: 13, max: 80, media: 31.1, de: 10.8, mediana: 29 };
// Distribución quinquenal modelada a partir de media/DE reportados (ilustrativa)
export const EDAD_BINS = [
  { rango: "13–19", pct: 12.5 }, { rango: "20–24", pct: 19.4 }, { rango: "25–29", pct: 21.2 },
  { rango: "30–34", pct: 16.8 }, { rango: "35–39", pct: 11.9 }, { rango: "40–44", pct: 8.1 },
  { rango: "45–49", pct: 4.9 }, { rango: "50–54", pct: 2.8 }, { rango: "55–80", pct: 2.4 },
];
export const GENERO: Dist[] = [D("Masculino", 61.5, 640), D("Femenino", 37.6, 391), D("Otras identidades", 1.0, 10)];
export const EDUCACION: Dist[] = [
  D("Secundario", 44.7, 464), D("Universitario", 31.3, 325), D("Terciario", 22.0, 228), D("Primario", 1.9, 20),
];
export const GEOGRAFIA: Dist[] = [
  D("AMBA", 59.8), D("Centro", 11.0), D("Patagonia", 9.3), D("Fuera de Argentina", 4.7), D("Norte", 3.2), D("Cuyo", 1.0),
];

// ─── 4.2 Patrones de consumo ─────────────────────────────────────────────────
export const MOTIVOS: Dist[] = [
  D("Lo disfruta", 86.1, 892), D("Terapéuticos", 44.9, 465), D("Otros motivos", 15.6, 162),
  D("Afrontar problemas", 5.3, 55), D("Transgresión", 0.7, 7), D("Imitación de pares", 0.6, 6),
];
export const PATRON_MOTIVO: Dist[] = [
  D("Solo disfrute", 42.6, 441), D("Disfrute + terapéutico", 24.9, 258),
  D("Solo terapéutico", 12.0, 124), D("Otras combinaciones", 20.6, 213),
];
export const FRECUENCIA: Dist[] = [
  D("Todos los días", 52.0, 539), D("Días salteados", 28.0, 290), D("De vez en cuando", 15.6, 162), D("Fin de semana", 4.3, 45),
];
export const CANTIDAD: Dist[] = [
  D("Menos de 1 cigarrillo", 23.8, 238), D("1 cigarrillo", 30.4, 304), D("2 cigarrillos", 23.0, 230),
  D("3 cigarrillos", 11.1, 111), D("Más de 3", 11.8, 118),
];
export const ANTIGUEDAD: Dist[] = [
  D("Menos de 1 año", 7.2, 75), D("2 a 5 años", 32.5, 338), D("5 a 10 años", 26.2, 272),
  D("10 a 15 años", 16.0, 166), D("Más de 15 años", 18.2, 189),
];
export const FORMAS: Dist[] = [
  D("Fumado", 90.9, 944), D("Ingeribles", 29.2, 303), D("Vaporización", 28.0, 291), D("Gotas sublinguales", 26.5, 275),
  D("Tópicos", 18.5, 192), D("Extracciones", 13.2, 137), D("Bebidas infusionadas", 3.8, 40), D("Otras", 2.3, 24),
];
export const PRACTICAS = {
  tipo: [D("Flores", 91.8), D("Prensada", 35.1), D("Derivados prensados", 23.5)],
  genetica: [D("Cualquiera disponible", 56.0), D("Sativas", 40.8), D("Índicas", 31.5), D("Híbridas", 26.4)],
  contexto: [D("En solitario", 78.4), D("Con amistades", 77.3), D("Con familiares", 38.0)],
};
export const ACCESO: Dist[] = [
  D("Cultivo propio", 65.2), D("Compra", 56.7), D("Obsequio", 37.9), D("Intercambio", 20.6), D("Otras vías", 2.8),
];
export const INTENSIDAD: Dist[] = [
  D("Moderada", 67.3, 682), D("Escasa", 16.7, 169), D("Intensiva", 5.6, 57), D("Abusiva", 3.7, 38), D("Combinaciones", 6.6, 67),
];

// ─── 4.3 Efectos percibidos ──────────────────────────────────────────────────
export const EFECTOS: Dist[] = [
  D("Relaja", 79.7, 822), D("Tranquiliza", 71.0, 733), D("Genera alegría", 61.5, 635),
  D("Reduce la ansiedad", 57.6, 594), D("Estimula", 57.5, 593), D("Abre el apetito", 57.1, 589),
  D("Calma dolores", 52.5, 542), D("Equilibra", 43.3, 447),
  D("Elude la realidad", 4.7, 48), D("Genera alucinaciones", 1.6, 17), D("Deprime", 1.0, 10), D("Violenta", 0.1, 1),
];
export const MULTIEFECTOS = { media: 5.01, min: 1, max: 9 }; // distribución aprox. 1–9 efectos
export const MULTI_DIST = [2, 6, 14, 22, 24, 17, 9, 4, 2]; // % aprox. para 1..9 efectos

// ─── 4.4 Salud (usuarios terapéuticos, escala 0–10, n=485) ───────────────────
export const SALUD: Dist[] = [
  D("10", 36.5, 177), D("9", 16.5, 80), D("8", 30.3, 147), D("7", 9.9, 48), D("≤6", 6.8),
];
export const SALUD_STATS = { n: 485, media: 8.57, mediana: 9, moda: 10, altos: 83.3 };

// ─── 4.5–4.7 Sociedad, legalidad y cultivo ───────────────────────────────────
export const REGULACION: Dist[] = [
  D("Legalización", 69.3, 721), D("Despenalización", 17.1), D("Regulación intermedia", 13.2), D("Otras", 0.4),
];
export const POLICIAL = {
  inconvenientes: 25.4, detenidosTotal: 13.6, detenidosConInconvenientes: 53.5, detenidosSinInconvenientes: 0.1,
  norte: 37.5, patagonia: 19.4, pValor: 0.406, cramerV: 0.075, problemasVidaDiaria: 4.0,
};
export const CULTIVO = {
  cohorte: 743, autoabastece: 66.5,
  trayectoria: [D("< 1 año", 19.6), D("1–2 años", 21.6), D("2–5 años", 30.2), D("5–10 años", 18.2), D("10–15 años", 6.1), D("> 15 años", 4.3)],
  modalidades: [D("Exterior en maceta", 64.4), D("Indoor en maceta", 56.1), D("Suelo exterior", 33.0), D("Hidroponía", 3.3)],
  conocimiento: [D("Blogs / foros", 71.5), D("Experiencia propia", 69.3), D("Investigaciones", 58.9), D("Talleres", 25.8), D("Otras vías", 25.5)],
  obstaculos: [D("Falta de espacio", 28.0), D("Sin autorización familiar", 24.6), D("Prohibición vigente", 21.8), D("Falta de conocimientos", 17.4)],
  alternativas: [D("Punto de venta especializado", 36.2), D("Club de cultivo", 35.9), D("Cooperativa", 24.5)],
};

// ─── 5. Análisis avanzado ────────────────────────────────────────────────────
// Matriz reconstruida fielmente desde los coeficientes reportados en §5.1
export const CORR_VARS = ["Edad", "Frecuencia", "Cantidad", "Problemas", "Relajación", "↓ Ansiedad", "Alegría", "Colectivo", "Marcha"];
export const CORR_MATRIX: number[][] = [
  [1.00, 0.12, -0.15, 0.02, 0.05, 0.04, -0.03, 0.08, 0.06],
  [0.12, 1.00, 0.38, 0.04, 0.07, 0.05, 0.06, 0.11, 0.09],
  [-0.15, 0.38, 1.00, 0.04, 0.03, 0.02, 0.04, 0.05, 0.04],
  [0.02, 0.04, 0.04, 1.00, 0.06, -0.08, -0.05, 0.03, 0.02],
  [0.05, 0.07, 0.03, 0.06, 1.00, 0.52, 0.48, 0.07, 0.05],
  [0.04, 0.05, 0.02, -0.08, 0.52, 1.00, 0.44, 0.06, 0.04],
  [-0.03, 0.06, 0.04, -0.05, 0.48, 0.44, 1.00, 0.09, 0.07],
  [0.08, 0.11, 0.05, 0.03, 0.07, 0.06, 0.09, 1.00, 0.42],
  [0.06, 0.09, 0.04, 0.02, 0.05, 0.04, 0.07, 0.42, 1.00],
];
export const CORR_HALLAZGOS = [
  { par: "Frecuencia / Cantidad × Problemas", r: "≈ 0.04", lectura: "Sin asociación lineal apreciable entre intensidad de consumo y percepción de inconvenientes (§5.1.1)." },
  { par: "Edad × Frecuencia / Cantidad", r: "+0.12 / −0.15", lectura: "Variaciones leves: la edad no configura un eje organizador del fenómeno (§5.1.2)." },
  { par: "Efectos positivos × Problemas", r: "< 0.10", lectura: "Relajación y ↓ansiedad no predicen menor malestar: la experiencia no es lineal (§5.1.3)." },
  { par: "Participación social × resto", r: "< 0.20", lectura: "Colectivos y Marcha no estructuran patrones de consumo ni de malestar (§5.1.4)." },
];

export const PCA = { pc1: 13.1, pc2: 9.1, acumulado: 22.2 };
export const PCA_BARRAS = [
  { comp: "PC1", var: 13.1, reportado: true }, { comp: "PC2", var: 9.1, reportado: true },
  { comp: "PC3", var: 7.6, reportado: false }, { comp: "PC4", var: 6.8, reportado: false },
  { comp: "PC5", var: 6.1, reportado: false }, { comp: "PC6+", var: 57.3, reportado: false },
];

export const CLUSTERS = [
  {
    id: 1, nombre: "Recreativo integrado", share: 45, edad: "~30 años", color: "#34d399",
    rasgos: ["Consumo frecuente pero moderado", "Sin problemas percibidos", "Múltiples efectos positivos reportados", "Baja participación política activa", "Consumo integrado al estilo de vida"],
  },
  {
    id: 2, nombre: "Terapéutico-social", share: 30, edad: "~37 años", color: "#38bdf8",
    rasgos: ["Uso orientado a fines terapéuticos", "Participación activa en colectivos cannábicos", "Cero inconvenientes asociados al consumo", "Función de autocuidado y apoyo social"],
  },
  {
    id: 3, nombre: "Minoría con conflicto", share: 2.4, edad: "≈25 usuarios", color: "#fb7185",
    rasgos: ["Patrón de consumo más intenso", "Conflictos legales o sociales concentrados", "Sin diferencias en efectos adversos", "El conflicto parece externo, no farmacológico"],
  },
];

// ─── 6. Modelos predictivos ──────────────────────────────────────────────────
export const RF_FEATURES = [
  { variable: "Edad", peso: 0.435 }, { variable: "Cantidad consumida", peso: 0.166 },
  { variable: "Frecuencia de consumo", peso: 0.126 }, { variable: "Nivel educativo", peso: 0.124 },
  { variable: "Género", peso: 0.079 }, { variable: "Momento del consumo", peso: 0.071 },
];
export const RF_METRICAS = { accuracy: 0.94, auc: 0.49, positivos: 43, negativos: 992, pctPos: 4.3 };
export const ROC_POINTS = [
  { fpr: 0, tpr: 0 }, { fpr: 0.1, tpr: 0.08 }, { fpr: 0.25, tpr: 0.22 }, { fpr: 0.4, tpr: 0.38 },
  { fpr: 0.55, tpr: 0.52 }, { fpr: 0.7, tpr: 0.68 }, { fpr: 0.85, tpr: 0.83 }, { fpr: 1, tpr: 1 },
];
export const SILHOUETTE = [
  { metodo: "K-Means (k=3)", valor: 0.19 }, { metodo: "Jerárquico (3 clusters)", valor: 0.16 },
];

// Calidad de datos: casos válidos por variable (sobre n=1.046)
export const CALIDAD = [
  { variable: "Género", validos: 1041 }, { variable: "Edad", validos: 1040 }, { variable: "Antigüedad", validos: 1040 },
  { variable: "Postura regulación", validos: 1040 }, { variable: "Formas de consumo", validos: 1039 },
  { variable: "Nivel educativo", validos: 1037 }, { variable: "Motivos", validos: 1036 }, { variable: "Frecuencia", validos: 1036 },
  { variable: "Marcha (asistencia)", validos: 1036 }, { variable: "Efectos percibidos", validos: 1032 },
  { variable: "Inconvenientes policiales", validos: 1022 }, { variable: "Colectivos", validos: 1012 },
  { variable: "Autopercepción intensidad", validos: 1013 }, { variable: "Cantidad", validos: 1001 },
  { variable: "Policonsumo", validos: 998 }, { variable: "País / provincia", validos: 933 },
  { variable: "Mejoría en salud (terapéuticos)", validos: 485 },
];

export const fmt = (n: number, d = 1) =>
  n.toLocaleString("es-ES", { minimumFractionDigits: d, maximumFractionDigits: d });
export const pctTxt = (n: number) => `${fmt(n, 1).replace(",0", "")}%`;

// ─── 6.5–6.7 Regresión logística y tratamiento del desbalance ────────────────
export const LOGREG = {
  problemas: {
    nombre: "Percepción de problemas", objetivo: "¿El consumo genera inconvenientes en la vida diaria?",
    accuracy: 0.67, auc: 0.58, precision: 0.06, recall: 0.44, f1: 0.11,
    matriz: [[135, 63], [5, 4]] as number[][], // VN, FP / FN, VP
    balance: "43 Sí (4,3%) vs 992 No · test n=207 (9 positivos)",
  },
  terapeutico: {
    nombre: "Uso terapéutico", objetivo: "¿Consume por motivos terapéuticos (solos o combinados)?",
    accuracy: 0.63, auc: 0.67, precision: 0.59, recall: 0.62, f1: 0.60,
    matriz: [[73, 41], [36, 58]] as number[][],
    balance: "467 Sí (45,0%) vs 571 No · dataset más balanceado",
  },
};
export const ODDS_PROBLEMAS = [
  { variable: "Consumo fin de semana", or: 10.20, lo: 1.09, hi: 48.32, nota: "Intervalo muy amplio — evento raro" },
  { variable: "Género masculino", or: 2.44, lo: 1.51, hi: 4.14, nota: "IC no cruza 1 — el más robusto" },
  { variable: "Cantidad: un cigarrillo", or: 2.29, lo: 1.01, hi: 4.99, nota: "IC marginal" },
  { variable: "Consumo todos los días", or: 2.10, lo: 0.71, hi: 6.68, nota: "IC cruza 1 — no significativo" },
  { variable: "Nivel universitario", or: 1.87, lo: 0.90, hi: 4.77, nota: "IC cruza 1 — no significativo" },
  { variable: "Edad (estandarizada)", or: 0.91, lo: 0.59, hi: 1.36, nota: "IC cruza 1 — sin dirección confiable" },
  { variable: "Consumo por la mañana", or: 0.31, lo: 0.21, hi: 0.59, nota: "Efecto protector aparente" },
];
export const ODDS_TERAPEUTICO = [
  { variable: "Consumo por la mañana", or: 2.07, lectura: "Rutina terapéutica matinal" },
  { variable: "Consumo diario", or: 1.42, lectura: "Hábito continuo tipo tratamiento" },
  { variable: "Edad", or: 1.36, lectura: "Usuarios más maduros" },
];
export const ROC_LOGREG_PROBLEMAS = [
  { fpr: 0, tpr: 0 }, { fpr: 0.1, tpr: 0.16 }, { fpr: 0.25, tpr: 0.33 }, { fpr: 0.4, tpr: 0.48 },
  { fpr: 0.55, tpr: 0.62 }, { fpr: 0.7, tpr: 0.75 }, { fpr: 0.85, tpr: 0.87 }, { fpr: 1, tpr: 1 },
];
export const ROC_LOGREG_TERAPEUTICO = [
  { fpr: 0, tpr: 0 }, { fpr: 0.1, tpr: 0.24 }, { fpr: 0.25, tpr: 0.44 }, { fpr: 0.4, tpr: 0.58 },
  { fpr: 0.55, tpr: 0.71 }, { fpr: 0.7, tpr: 0.81 }, { fpr: 0.85, tpr: 0.9 }, { fpr: 1, tpr: 1 },
];

// ─── 13.1 Instrumento de encuesta (47 ítems) ─────────────────────────────────
export interface Item { n: number; texto: string; tipo: "Única" | "Múltiple" | "Abierta" | "Escala 0–10"; condicional?: string }
export const INSTRUMENTO: { bloque: string; items: Item[] }[] = [
  { bloque: "Datos generales", items: [
    { n: 1, texto: "Edad", tipo: "Abierta" },
    { n: 2, texto: "País y provincia de residencia", tipo: "Abierta" },
    { n: 3, texto: "Género", tipo: "Única" },
    { n: 4, texto: "Nivel educativo", tipo: "Única" },
    { n: 5, texto: "Profesión", tipo: "Abierta" },
  ]},
  { bloque: "Trayectoria y prácticas", items: [
    { n: 6, texto: "¿Cuánto tiempo hace que utiliza cannabis?", tipo: "Única" },
    { n: 7, texto: "¿Qué tipo de cannabis utiliza?", tipo: "Múltiple" },
    { n: 8, texto: "¿Qué genéticas utiliza?", tipo: "Múltiple" },
    { n: 9, texto: "¿Cada cuánto tiempo utiliza cannabis?", tipo: "Única" },
    { n: 10, texto: "¿Qué cantidad de cannabis utiliza?", tipo: "Única" },
    { n: 11, texto: "Generalmente consume cannabis por (momento del día)", tipo: "Única" },
    { n: 12, texto: "Cuando consume cannabis lo hace (compañía)", tipo: "Múltiple" },
  ]},
  { bloque: "Motivos y salud", items: [
    { n: 13, texto: "Usted consume cannabis porque…", tipo: "Múltiple" },
    { n: 14, texto: "¿Cuál es su problema de salud?", tipo: "Abierta", condicional: "Solo uso terapéutico" },
    { n: 15, texto: "¿Cómo impactó el cannabis en su salud?", tipo: "Única", condicional: "Solo uso terapéutico" },
    { n: 16, texto: "Grado de mejoramiento en su salud", tipo: "Escala 0–10", condicional: "Solo uso terapéutico" },
    { n: 17, texto: "¿Su familia le acompaña en su terapia?", tipo: "Única", condicional: "Solo uso terapéutico" },
  ]},
  { bloque: "Efectos y formas", items: [
    { n: 18, texto: "¿Qué efecto siente al consumir cannabis?", tipo: "Múltiple" },
    { n: 19, texto: "¿De qué forma utiliza el cannabis?", tipo: "Múltiple" },
  ]},
  { bloque: "Acceso y cultivo", items: [
    { n: 20, texto: "¿De qué forma adquiere el cannabis?", tipo: "Múltiple" },
    { n: 21, texto: "¿Sabe la procedencia del cannabis que compra?", tipo: "Única", condicional: "Solo si compra" },
    { n: 22, texto: "Usted compra el cannabis a…", tipo: "Única", condicional: "Solo si compra" },
    { n: 23, texto: "Usted no cultiva por…", tipo: "Única", condicional: "Solo si no cultiva" },
    { n: 24, texto: "¿De existir otra forma de acceso, la tomaría?", tipo: "Única", condicional: "Solo si no cultiva" },
    { n: 25, texto: "¿Qué forma de acceso le sería más adecuada?", tipo: "Única", condicional: "Solo si no cultiva" },
    { n: 26, texto: "¿Hace cuánto tiempo cultiva?", tipo: "Única", condicional: "Solo si cultiva" },
    { n: 27, texto: "Usted cultiva en…", tipo: "Múltiple", condicional: "Solo si cultiva" },
    { n: 28, texto: "¿Puede autoabastecer su consumo personal?", tipo: "Única", condicional: "Solo si cultiva" },
    { n: 29, texto: "¿Cuántas plantas cultiva en el año?", tipo: "Única", condicional: "Solo si cultiva" },
    { n: 30, texto: "¿A cuántas personas abastece además de usted?", tipo: "Única", condicional: "Solo si cultiva" },
    { n: 31, texto: "¿Cuántas variedades de genéticas cultiva?", tipo: "Única", condicional: "Solo si cultiva" },
    { n: 32, texto: "Aprendió sobre cultivo a través de…", tipo: "Múltiple", condicional: "Solo si cultiva" },
    { n: 33, texto: "En su cultivo suele utilizar…", tipo: "Única", condicional: "Solo si cultiva" },
  ]},
  { bloque: "Intensidad y problemas", items: [
    { n: 34, texto: "¿Aparte de cannabis, consume otras sustancias?", tipo: "Única" },
    { n: 35, texto: "¿En qué forma de consumo se encuentra? (autopercepción)", tipo: "Múltiple" },
    { n: 36, texto: "¿El consumo le genera algún inconveniente para su vida diaria?", tipo: "Única" },
    { n: 37, texto: "¿Tuvo algún inconveniente policial o judicial por cultivar o tener cannabis?", tipo: "Única" },
    { n: 38, texto: "¿Estuvo alguna vez detenido/a por cultivo o tenencia?", tipo: "Única" },
    { n: 39, texto: "¿Cuánto tiempo estuvo detenido/a?", tipo: "Única", condicional: "Solo si estuvo detenido/a" },
  ]},
  { bloque: "Participación y regulación", items: [
    { n: 40, texto: "Considera que el cannabis se tendría que…", tipo: "Única" },
    { n: 41, texto: "¿Participa activamente del colectivo cannábico?", tipo: "Única" },
    { n: 42, texto: "Motivo por el cual no participa del colectivo", tipo: "Única", condicional: "Solo si no participa" },
    { n: 43, texto: "¿Participa activamente de algún grupo cannábico?", tipo: "Única" },
    { n: 44, texto: "No participa de ningún grupo porque…", tipo: "Única", condicional: "Solo si no participa" },
    { n: 45, texto: "¿Suele asistir a la Marcha de la Marihuana?", tipo: "Única" },
    { n: 46, texto: "Asiste a la Marcha… (mundial / nacional / ambas)", tipo: "Única", condicional: "Solo si asiste" },
    { n: 47, texto: "No asiste a la marcha porque…", tipo: "Única", condicional: "Solo si no asiste" },
  ]},
];

// ─── 13.2 Diccionario de variables ───────────────────────────────────────────
export interface VarDict { variable: string; definicion: string; tipo: string; codificacion: string }
export const DICCIONARIO: VarDict[] = [
  { variable: "Edad", definicion: "Edad declarada en años", tipo: "Cuantitativa continua", codificacion: "Valor numérico (inválida <10 → NA)" },
  { variable: "Género", definicion: "Identidad de género informada", tipo: "Categórica nominal", codificacion: "Masculino, femenino, otro/no binario" },
  { variable: "Nivel educativo", definicion: "Máximo nivel alcanzado", tipo: "Categórica ordinal", codificacion: "Primario → universitario" },
  { variable: "País / Provincia", definicion: "Residencia declarada", tipo: "Categórica nominal", codificacion: "Normalizada (n válido = 933)" },
  { variable: "Ocupación", definicion: "Actividad principal", tipo: "Categórica nominal", codificacion: "Agrupada por diccionario temático" },
  { variable: "Frecuencia de consumo", definicion: "Periodicidad de uso", tipo: "Categórica ordinal", codificacion: "Ocasional=1 … diario=4" },
  { variable: "Cantidad consumida", definicion: "Cantidad por ocasión", tipo: "Categórica ordinal", codificacion: "<1, 1, 2, 3, >3 cigarrillos" },
  { variable: "Tiempo de consumo", definicion: "Antigüedad del uso", tipo: "Categórica ordinal", codificacion: "<1 año … >15 años" },
  { variable: "Forma de consumo", definicion: "Vía de administración", tipo: "Categórica nominal (múltiple)", codificacion: "Una dummy por vía" },
  { variable: "Motivo recreativo", definicion: "Consume por disfrute", tipo: "Binaria", codificacion: "0 = No, 1 = Sí" },
  { variable: "Motivo terapéutico", definicion: "Consume con fines terapéuticos", tipo: "Binaria", codificacion: "0 = No, 1 = Sí" },
  { variable: "Motivo mixto", definicion: "Combinación recreativo + terapéutico", tipo: "Binaria", codificacion: "0 = No, 1 = Sí" },
  { variable: "Relajación / ↓Ansiedad / Bienestar / Alivio", definicion: "Efectos percibidos (ítem 18)", tipo: "Binarias (one-hot)", codificacion: "0 = No, 1 = Sí por efecto" },
  { variable: "Número de efectos", definicion: "Efectos reportados por usuario", tipo: "Cuantitativa discreta", codificacion: "1–9 · x̄ = 5,01" },
  { variable: "Percepción de salud", definicion: "Grado de mejoramiento percibido", tipo: "Ordinal 0–10", codificacion: "Solo terapéuticos (n=485)" },
  { variable: "Inconvenientes vida diaria", definicion: "Problemas cotidianos atribuidos al consumo", tipo: "Binaria · objetivo ML", codificacion: "0 = No, 1 = Sí (4,3% Sí)" },
  { variable: "Experiencias legales", definicion: "Inconvenientes policiales/judiciales y detención", tipo: "Binarias", codificacion: "0 = No, 1 = Sí" },
  { variable: "Cultivo / Autoabastecimiento", definicion: "Cultiva y cubre su consumo", tipo: "Binarias", codificacion: "Cohorte depurada n=743" },
  { variable: "Fuente de acceso", definicion: "Vía principal de obtención", tipo: "Categórica nominal (múltiple)", codificacion: "Cultivo, compra, obsequio, intercambio" },
  { variable: "Participación en colectivos", definicion: "Integra organizaciones cannábicas", tipo: "Binaria", codificacion: "0 = No, 1 = Sí (33,2%)" },
  { variable: "Postura legalización", definicion: "Posicionamiento regulatorio", tipo: "Categórica nominal", codificacion: "Legalizar, despenalizar, regular, otra" },
  { variable: "Cluster de usuario", definicion: "Perfil asignado por K-Means", tipo: "Categórica nominal", codificacion: "Recreativo / terapéutico-social / conflicto" },
  { variable: "PCA 1 · PCA 2", definicion: "Componentes principales", tipo: "Cuantitativas continuas", codificacion: "Puntuaciones estandarizadas" },
  { variable: "Objetivo: problemas", definicion: "Variable dependiente modelo 1", tipo: "Binaria", codificacion: "0 = No percibe, 1 = Sí percibe" },
  { variable: "Objetivo: uso terapéutico", definicion: "Variable dependiente modelo 2", tipo: "Binaria", codificacion: "0 = No, 1 = Terapéutico (45,0%)" },
];

// ─── 14. Anexo de códigos (extractos fieles, anonimizados) ───────────────────
export interface ScriptCode { id: string; titulo: string; etapa: string; libs: string[]; descripcion: string; codigo: string }
export const CODIGO: ScriptCode[] = [
  { id: "14.1", titulo: "Conversión de Excel a CSV", etapa: "Datos", libs: ["zipfile", "xml.etree", "csv"], descripcion: "Lee el .xlsx de Google Forms como paquete ZIP/XML, resuelve las cadenas compartidas (sharedStrings) y exporta el CSV en Latin-1 sin filtros: 1.048 registros íntegros.", codigo: "def convert_excel_to_csv(xlsx_path, csv_path):\n    with zipfile.ZipFile(xlsx_path) as zf:\n        shared = _read_shared_strings(zf)   # xl/sharedStrings.xml\n        sheet = zf.read(\"xl/worksheets/sheet1.xml\")\n    # reconstruye cada celda por su referencia (A1, B2, ...)\n    # tipos: s=shared string, inlineStr, b=booleano\n    with csv_path.open(\"w\", encoding=\"latin1\") as f:\n        csv.writer(f).writerows(table)  # 1.048 registros" },
  { id: "14.2", titulo: "Eliminación de duplicados", etapa: "Datos", libs: ["pandas"], descripcion: "Ordena por marca temporal, conserva la primera ocurrencia de cada correo no vacío y preserva los correos en blanco. Resultado: n = 1.046.", codigo: "df = df.sort_values(time_col)\nmask = df[email_col] != \"\"\ndedup = df[mask].drop_duplicates(subset=email_col, keep=\"first\")\nresult = pd.concat([dedup, df[~mask]]).sort_index()\n# Registros originales: 1048 -> tras depurar: 1046" },
  { id: "14.3", titulo: "Faltantes y recodificaciones", etapa: "Datos", libs: ["pandas", "re", "unicodedata"], descripcion: "Limpieza de cadenas a pd.NA, edades <10 años a faltante, diccionarios de sinónimos para 6 variables categóricas y agrupación temática de ocupaciones (Profesion_categoria).", codigo: "df[age] = pd.to_numeric(df[age], errors=\"coerce\")\ndf.loc[df[age] < 10, age] = pd.NA   # edad invalida -> faltante\n# sinonimos: \"mas.....\" -> \"Mas de tres cigarrillos\"\n# ocupacion: \"docent*\" -> Docente, \"program*\" -> Tecnologia\ndf[\"Profesion_categoria\"] = df[prof].map(map_profession)" },
  { id: "14.4", titulo: "Reclasificación de cultivo y acceso", etapa: "Datos", libs: ["pandas", "dataclasses"], descripcion: "Clasifica cultivador / no cultivador / excluido resolviendo los 162 casos con ambas ramas respondidas: reglas de compatibilidad + 16 ajustes manuales documentados (identificadores anonimizados). Cohorte final: 743.", codigo: "has_cult = not_empty(col_cult) | not_empty(col_tiempo)\n    | (not_empty(col_auto) & ~has_no)\n# ambas ramas: razon compatible -> Cultivador\n# 16 overrides manuales (timestamp+correo, anonimizados)\n# 11 filas excluidas sin sustento -> cohorte n = 743" },
  { id: "14.5", titulo: "Figura: distribución de edad", etapa: "Figuras", libs: ["matplotlib", "pandas"], descripcion: "Histograma quinquenal con nota de estadísticos (n=1.040, media 31,1, DE 10,8). Salida JPG+PNG a 300 dpi.", codigo: "bins = range(int(ages.min()), int(ages.max()) + 5, 5)\nax.hist(ages, bins=bins, color=\"#2a85c8\", edgecolor=\"white\")\nnote = f\"n={len(ages)} | Media={ages.mean():.1f} | DE={ages.std():.1f}\"" },
  { id: "14.6", titulo: "Figura: género", etapa: "Figuras", libs: ["matplotlib", "pandas"], descripcion: "Barras con porcentaje sobre válidos (n=1.041): 61,5% masculino, 37,6% femenino, 1,0% otras identidades.", codigo: "counts = gender.value_counts(dropna=False)\nstats[\"Porcentaje\"] = stats[\"Frecuencia\"] / total_valid * 100" },
  { id: "14.7", titulo: "Figura: nivel educativo", etapa: "Figuras", libs: ["matplotlib", "pandas"], descripcion: "Barras ordenadas por frecuencia (n=1.037): secundario 44,7%, universitario 31,3%, terciario 22,0%.", codigo: "stats.sort_values(\"Frecuencia\", ascending=False)\nax.bar(stats[\"Nivel educativo\"], stats[\"Frecuencia\"])" },
  { id: "14.8", titulo: "Figura: frecuencia de consumo", etapa: "Figuras", libs: ["matplotlib", "pandas"], descripcion: "Frecuencia de uso (n=1.036): diario 52,0%, días salteados 28,0%, ocasional 15,6%, fin de semana 4,3%.", codigo: "freq = df.iloc[:, 10]  # \"Cada cuanto utiliza cannabis?\"\nstats[\"Porcentaje\"] = stats[\"Casos\"] / total_valid * 100" },
  { id: "14.9", titulo: "Figura: cantidad consumida", etapa: "Figuras", libs: ["matplotlib", "pandas"], descripcion: "Cantidad por ocasión con orden ordinal fijo (n=1.001): predomina 1 cigarrillo (30,4%).", codigo: "order = [\"Menos de un cigarrillo\", \"Un cigarrillo\",\n         \"Dos cigarrillos\", \"Tres cigarrillos\",\n         \"Mas de tres cigarrillos\"]" },
  { id: "14.10", titulo: "Figura: antigüedad de consumo", etapa: "Figuras", libs: ["matplotlib", "pandas"], descripcion: "Antigüedad en orden cronológico (n=1.040): 2–5 años 32,5%, 5–10 años 26,2%, >15 años 18,2%.", codigo: "CATEGORY_ORDER = [\"Menos de un ano\", \"2 a 5 anos\",\n  \"5 a 10 anos\", \"10 a 15 anos\", \"Mas de 15 anos\"]" },
  { id: "14.11", titulo: "Figura: formas de consumo", etapa: "Figuras", libs: ["matplotlib", "pandas", "collections"], descripcion: "Pregunta multirrespuesta: separa por comas, normaliza variantes y calcula % sobre respondientes (n=1.039). Fumado 90,9%.", codigo: "for value in series.dropna():\n    options = [normalize(o) for o in value.split(\",\")]\n    counter.update(options)  # respuesta multiple" },
  { id: "14.12", titulo: "Figura: motivos de consumo", etapa: "Figuras", libs: ["matplotlib", "pandas", "collections"], descripcion: "Gráfico de torta (paleta Greens) + derivación de categorías excluyentes: solo disfrute 42,6%, mixto 24,9%, solo terapéutico 12,0%.", codigo: "if disfr and not terap and not other: 'Solo disfrute'\nelif disfr and terap and not other:  'Disfrute y terapeutico'\nelif terap and not disfr and not other: 'Solo terapeutico'\nelse: 'Otras combinaciones'" },
  { id: "14.13", titulo: "Figura: efectos percibidos", etapa: "Figuras", libs: ["matplotlib", "pandas", "collections"], descripcion: "Barras horizontales con mapa de normalización de etiquetas (l@, lo, la → forma neutra). Relaja 79,7% … violenta 0,1%.", codigo: "NORMALIZATION_MAP = {\"l@ relaja\": \"Relaja\",\n  \"le calma la ansiedad\": \"Reduce ansiedad\",\n  \"l@ violenta\": \"Violenta\", ...}\nax.barh(stats[\"Efecto\"], stats[\"Casos\"])" },
  { id: "14.14", titulo: "Matriz de correlaciones", etapa: "Modelos", libs: ["pandas", "seaborn", "sklearn"], descripcion: "Codifica ordinales con LabelEncoder, efectos con one-hot y sociales como binarias; heatmap coolwarm −1..1 (Figura 1 del paper).", codigo: "freq = LabelEncoder().fit_transform(df[frecuencia])\neffects_dummies = one_hot(df[\"Que efecto siente...\"])\ndata = concat([Edad, Frecuencia, Cantidad, Problema,\n               effects_dummies, social])\nsns.heatmap(data.corr(), cmap=\"coolwarm\", vmin=-1, vmax=1)" },
  { id: "14.15", titulo: "Cálculo del PCA", etapa: "Modelos", libs: ["sklearn"], descripcion: "Estandarización con StandardScaler y PCA completo sobre la matriz de correlaciones.", codigo: "X_scaled = StandardScaler().fit_transform(data)\npca = PCA().fit(X_scaled)  # PC1 13,1% - PC2 9,1%" },
  { id: "14.16", titulo: "Varianza explicada del PCA", etapa: "Modelos", libs: ["matplotlib"], descripcion: "Scree plot y proyección PC1×PC2: nube homogénea sin agrupamientos, ~22% acumulado.", codigo: "plt.plot(pca.explained_variance_ratio_, marker=\"o\")\nplt.scatter(X_pca[:,0], X_pca[:,1], alpha=0.5)" },
  { id: "14.17", titulo: "Random Forest", etapa: "Modelos", libs: ["sklearn", "matplotlib"], descripcion: "Clasificador con class_weight='balanced' (objetivo 4,3% positivo). Importancias: edad 0,435, cantidad 0,166, frecuencia 0,126…", codigo: "rf = RandomForestClassifier(n_estimators=100,\n    random_state=42, class_weight=\"balanced\")\nrf.fit(X_train, y_train)\nimportances = rf.feature_importances_" },
  { id: "14.18", titulo: "Curva ROC del Random Forest", etapa: "Modelos", libs: ["sklearn"], descripcion: "AUC = 0,4910 con accuracy 0,9372: la exactitud es un espejismo del desbalance; el modelo equivale al azar.", codigo: "fpr, tpr, _ = roc_curve(y_test, y_prob)\nroc_auc = auc(fpr, tpr)  # 0.4910 | Accuracy: 0.9372\nax.plot([0,1], [0,1], \"--\", label=\"Aleatorio (0.50)\")" },
  { id: "14.19", titulo: "Validación de clustering", etapa: "Modelos", libs: ["sklearn", "matplotlib"], descripcion: "K-Means k=3 vs jerárquico con silhouette: 0,19 vs 0,16. Silhouette plot con línea media: fronteras difusas.", codigo: "labels_km = KMeans(3, random_state=42, n_init=10).fit_predict(Xs)\nscore_km = silhouette_score(Xs, labels_km)   # 0.19\nscore_hc = silhouette_score(Xs, labels_hc)   # 0.16" },
  { id: "14.20", titulo: "Regresión logística: problemas", etapa: "Modelos", libs: ["sklearn", "numpy"], descripcion: "One-hot con drop_first, edad estandarizada, class_weight='balanced', split 80/20 estratificado. Métricas: acc 0,67 · AUC 0,58 · P 0,06 · R 0,44 · F1 0,11. OR con bootstrap de 500 iteraciones.", codigo: "lr = LogisticRegression(class_weight=\"balanced\",\n                        max_iter=1000, random_state=42)\n# cm = [[135, 63], [5, 4]]\nfor i in range(500):  # bootstrap para IC de los OR\n    lr_b.fit(X_train.values[idx], y_train.values[idx])\nOR = np.exp(coefs); IC = np.exp(np.percentile(boot, [2.5, 97.5]))" },
  { id: "14.21", titulo: "Regresión logística: uso terapéutico", etapa: "Modelos", libs: ["sklearn"], descripcion: "Mismo pipeline, objetivo terapéutico (467 Sí / 571 No). Métricas: acc 0,63 · AUC 0,67 · P 0,59 · R 0,62 · F1 0,60. Matriz [[73,41],[36,58]].", codigo: "df[\"target_terapeutico\"] = df[motivo].str.contains(\n    \"terapeutico\", case=False).astype(int)  # 45,0% +\nlr2.fit(X2_train, y2_train)  # AUC 0.6695 - F1 0.6010" },
  { id: "14.22", titulo: "K-Means reproducible (pipeline)", etapa: "Modelos", libs: ["sklearn", "numpy", "json"], descripcion: "Pipeline completo y autónomo: carga CSV Latin-1, selección de 6 features, escalado, K-Means + jerárquico, silhouette plot y resumen JSON con conteos por clúster.", codigo: "def main():\n    df = load_dataset(DATA_PATH)         # latin1\n    matrix = preprocess_features(select_features(df))\n    results = run_clustering(matrix, n_clusters=3)\n    print(json.dumps(summary, indent=2))  # silhouettes + counts" },
];

// ─── 15. Diccionario de términos ──────────────────────────────────────────────
export const GLOSARIO: { termino: string; definicion: string }[] = [
  { termino: "Análisis bivariado", definicion: "Relación entre dos variables mediante tablas de contingencia o pruebas de asociación." },
  { termino: "PCA", definicion: "Reducción dimensional: transforma variables correlacionadas en componentes no correlacionados que capturan la máxima varianza." },
  { termino: "Autoselección (sesgo de)", definicion: "Los participantes se eligen a sí mismos; la muestra puede no representar a la población general." },
  { termino: "CBD (cannabidiol)", definicion: "Compuesto no psicoactivo con propiedades antiinflamatorias, ansiolíticas y anticonvulsivantes estudiadas." },
  { termino: "Carga factorial", definicion: "Peso de una variable original dentro de un componente principal del PCA." },
  { termino: "Chi-cuadrado (χ²)", definicion: "Prueba de independencia entre variables categóricas desde frecuencias observadas y esperadas." },
  { termino: "Clustering", definicion: "Aprendizaje no supervisado que agrupa observaciones similares en subconjuntos (clusters)." },
  { termino: "Coeficiente de silhouette", definicion: "Validación interna de clusters: cerca de 1 = buena separación; cerca de 0 = superposición (aquí 0,19)." },
  { termino: "Correlación de Pearson", definicion: "Asociación lineal entre variables cuantitativas, de −1 a +1 (aquí casi todas |r| < 0,20)." },
  { termino: "Corrección de Yates", definicion: "Ajuste del χ² en tablas 2×2 con frecuencias esperadas pequeñas." },
  { termino: "Datos autoinformados", definicion: "Información declarada por los participantes sin verificación clínica externa." },
  { termino: "Desbalance de clases", definicion: "Una clase domina a la otra (aquí 95,7% vs 4,3%), lo que distorsiona métricas como accuracy." },
  { termino: "Despenalización", definicion: "Elimina sanciones penales por tenencia/consumo personal sin legalizar plenamente." },
  { termino: "Desviación estándar (DE)", definicion: "Dispersión promedio respecto de la media (edad: DE = 10,8)." },
  { termino: "Diseño transversal", definicion: "Datos recogidos en un único momento, sin seguimiento temporal." },
  { termino: "Elbow method", definicion: "Heurística para elegir K en K-Means según donde se estabiliza la reducción del error." },
  { termino: "Estudio exploratorio", definicion: "Sin hipótesis previas: busca tendencias y asociaciones emergentes." },
  { termino: "F1-score", definicion: "Media armónica de precision y recall; clave con clases desbalanceadas (0,11 vs 0,60)." },
  { termino: "Feature importance", definicion: "Contribución relativa de cada variable en un modelo (edad 43,5% en el RF)." },
  { termino: "K-Means", definicion: "Clustering que minimiza la distancia euclidiana a los centroides de K grupos." },
  { termino: "Legalización", definicion: "Marco que permite producción, distribución y consumo bajo condiciones legales." },
  { termino: "Mapa de calor", definicion: "Matriz coloreada por magnitud; aquí visualiza las correlaciones (Figura 1)." },
  { termino: "Normalización del consumo", definicion: "Integración sociocultural de una práctica antes estigmatizada en la vida cotidiana." },
  { termino: "Odds Ratio (OR)", definicion: "Razón de momios: OR=1 sin asociación; IC que cruza 1 = no significativo." },
  { termino: "One-Hot Encoding", definicion: "Cada categoría se convierte en una variable binaria 0/1 independiente." },
  { termino: "Policonsumo", definicion: "Uso simultáneo o secuencial de dos o más sustancias (aquí 28,3%)." },
  { termino: "Prueba piloto", definicion: "Aplicación preliminar del instrumento (n=30) para validar claridad y tiempos." },
  { termino: "Random Forest", definicion: "Ensamble de árboles de decisión con voto agregado; robusto a no linealidades." },
  { termino: "Recall", definicion: "Proporción de positivos reales detectados (0,44 en el modelo de problemas)." },
  { termino: "Reducción de daños", definicion: "Minimizar efectos negativos del consumo sin exigir abstinencia." },
  { termino: "Regresión logística", definicion: "Modelo que estima la probabilidad de un evento binario (problemas / terapéutico)." },
  { termino: "Reproducibilidad", definicion: "Obtener los mismos resultados repitiendo datos y métodos: eje del Anexo 14." },
  { termino: "ROC AUC", definicion: "Capacidad discriminativa: 0,5 = azar; 1,0 = perfecta (aquí 0,49–0,67)." },
  { termino: "SMOTE", definicion: "Sobremuestreo sintético de la clase minoritaria (línea futura, §6.7)." },
  { termino: "StandardScaler", definicion: "Estandariza variables (media 0, DE 1) antes de PCA y clustering." },
  { termino: "THC", definicion: "Principal compuesto psicoactivo del cannabis, responsable de los efectos eufóricos y analgésicos." },
  { termino: "Validación cruzada", definicion: "Evaluación por particiones (folds) para evitar sobreajuste." },
  { termino: "Varianza explicada", definicion: "Proporción de variabilidad capturada por un componente (PC1+PC2 ≈ 22%)." },
];

// ─── 16. Bibliografía y fuentes ───────────────────────────────────────────────
export const BIBLIOGRAFIA: { cita: string; detalle: string }[] = [
  { cita: "UNODC (2025)", detalle: "World Drug Report 2025. Naciones Unidas." },
  { cita: "UNODC (2021)", detalle: "World Drug Report 2021. Viena." },
  { cita: "National Academies (2017)", detalle: "The Health Effects of Cannabis and Cannabinoids. National Academies Press." },
  { cita: "Hall & Degenhardt (2009)", detalle: "Adverse health effects of non-medical cannabis use. The Lancet, 374." },
  { cita: "Volkow et al. (2014)", detalle: "Adverse health effects of marijuana use. NEJM, 370." },
  { cita: "Whiting et al. (2015)", detalle: "Cannabinoids for medical use: systematic review y meta-analysis. JAMA, 313." },
  { cita: "Pardal et al. (2022)", detalle: "Mapping Cannabis Social Clubs in Europe. European Journal of Criminology, 19." },
  { cita: "Caulkins, Kilmer & Kleiman (2016)", detalle: "Marijuana Legalization: What Everyone Needs to Know. Oxford UP." },
  { cita: "Pardo (2014)", detalle: "Cannabis policy reforms in the Americas. Int. J. of Drug Policy, 25." },
  { cita: "Walsh & Ramsey (2016)", detalle: "Uruguay's drug policy: major innovations, major challenges. Brookings." },
  { cita: "Seddon (2020)", detalle: "Cannabis regulation: lessons from Uruguay. Int. J. of Drug Policy, 85." },
  { cita: "JND Uruguay (2019)", detalle: "VII Encuesta Nacional sobre Drogas en Hogares. Montevideo." },
  { cita: "SEDRONAR (2017)", detalle: "Estudio Nacional en Población de 12 a 65 años sobre Consumo de Sustancias. Buenos Aires." },
  { cita: "OID-CICAD/OEA (2019)", detalle: "Informe sobre el consumo de drogas en las Américas. Washington DC." },
  { cita: "Parker, Aldridge & Measham (1998)", detalle: "Illegal Leisure: The Normalization of Adolescent Recreational Drug Use. Routledge." },
  { cita: "Hathaway, Comeau & Erickson (2011)", detalle: "Cannabis normalization and stigma. Criminology & Criminal Justice, 11." },
  { cita: "Bourdieu (1986)", detalle: "The forms of capital. En Handbook of Theory and Research for the Sociology of Education." },
  { cita: "Pedersen & Sandberg (2013)", detalle: "The medicalization of revolt: medical cannabis users. Sociology of Health & Illness, 35." },
  { cita: "Jolliffe (2002)", detalle: "Principal Component Analysis (2.ª ed.). Springer." },
  { cita: "Hastie, Tibshirani & Friedman (2009)", detalle: "The Elements of Statistical Learning (2.ª ed.). Springer." },
  { cita: "Breiman (2001)", detalle: "Random Forests. Machine Learning, 45." },
  { cita: "Pedregosa et al. (2011)", detalle: "Scikit-learn: Machine Learning in Python. JMLR, 12." },
  { cita: "McKinney (2010)", detalle: "Data structures for statistical computing in Python. Proc. SciPy." },
  { cita: "Hunter (2007)", detalle: "Matplotlib: A 2D graphics environment. Computing in Science & Engineering, 9." },
  { cita: "Waskom (2021)", detalle: "Seaborn: statistical data visualization. JOSS, 6(60)." },
  { cita: "Virtanen et al. (2020)", detalle: "SciPy 1.0: fundamental algorithms for scientific computing. Nature Methods, 17." },
  { cita: "ONU (2015)", detalle: "Agenda 2030 para el Desarrollo Sostenible. Resolución A/RES/70/1." },
  { cita: "Comisión Global de Política de Drogas (2019)", detalle: "Clasificación de sustancias psicoactivas: cuando la ciencia fue dejada atrás. Ginebra." },
];
export const HERRAMIENTAS_FUENTE: { cita: string; detalle: string }[] = [
  { cita: "Python 3.x", detalle: "Lenguaje del pipeline completo (python.org)." },
  { cita: "pandas", detalle: "Manipulación y análisis de datos (pandas.pydata.org)." },
  { cita: "NumPy", detalle: "Computación numérica (numpy.org)." },
  { cita: "scikit-learn", detalle: "Aprendizaje automático: PCA, K-Means, RF, logística (scikit-learn.org)." },
  { cita: "SciPy", detalle: "Estadística: χ² y cómputo científico (scipy.org)." },
  { cita: "Matplotlib", detalle: "Visualización 2D (matplotlib.org)." },
  { cita: "Seaborn", detalle: "Visualización estadística: heatmaps (seaborn.pydata.org)." },
  { cita: "Datos primarios", detalle: "Encuesta online a usuarios/as difundida por redes y colectivos (n = 1.046)." },
];
export const NORMATIVAS: { cita: string; detalle: string }[] = [
  { cita: "Argentina · Ley 27.350 (2017)", detalle: "Investigación médica y científica del uso medicinal del cannabis y sus derivados." },
  { cita: "Argentina · Ley 27.669 (2022)", detalle: "Marco regulatorio de la industria del cannabis medicinal y el cáñamo industrial." },
  { cita: "Uruguay · Ley 19.172 (2013)", detalle: "Regulación y control del cannabis: primer mercado recreativo regulado del mundo." },
  { cita: "OEA (2013)", detalle: "El problema de las drogas en las Américas: enfoque de salud pública y derechos." },
  { cita: "JIFE (2022)", detalle: "Informe anual de la Junta Internacional de Fiscalización de Estupefacientes." },
];
