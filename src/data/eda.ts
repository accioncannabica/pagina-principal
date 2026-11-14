/**
 * DATASETS — Análisis exploratorio (EDA), mapa de calor y gradiente de peso.
 *
 * ⚠️ Dataset de DEMOSTRACIÓN (demo: true). Las series fueron generadas con un
 * generador pseudoaleatorio con semilla fija para que el mockup sea estable y
 * reproducible. Deben reemplazarse por los registros reales de la asociación
 * (consultas, acompañamientos, cultivos autorizados y agenda).
 */

/** Generador congruencial lineal con semilla (determinista). */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Box-Muller para distribución normal. */
function normal(rand: () => number, mu: number, sigma: number) {
  const u = Math.max(rand(), 1e-9);
  const v = rand();
  return mu + sigma * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export type Consulta = {
  id: number;
  semana: number;        // 1..52
  mes: number;           // 1..12
  anio: 2025 | 2026;
  tipo: string;          // tipo de consulta
  rango: string;         // rango etario
  provincia: string;
  derivado: string;      // formato de uso
  plantas: number;       // 1..9
  pesoFlor: number;      // gramos por ciclo
  thc: number;           // % THC analizado
  satisfaccion: number;  // 1..10
  dias: number;          // días de acompañamiento
};

export const TIPOS = ["Salud", "Legal", "Cultivo", "REPROCANN", "Cultura", "Industria"];
export const RANGOS = ["18-29", "30-44", "45-59", "60+"];
export const PROVINCIAS_EDA = ["CABA", "Buenos Aires", "Córdoba", "Santa Fe", "Mendoza", "Misiones", "Río Negro", "Otros"];
export const DERIVADOS = ["Flor seca", "Aceite", "Tintura", "Tópico", "Infusión"];

const rand = rng(20260101);

export const DATASET: Consulta[] = Array.from({ length: 220 }, (_, i) => {
  const tipo = TIPOS[Math.floor(rand() * TIPOS.length)];
  const rango = RANGOS[Math.floor(rand() * RANGOS.length)];
  const provincia = PROVINCIAS_EDA[Math.floor(rand() * PROVINCIAS_EDA.length)];
  const derivado = DERIVADOS[Math.floor(rand() * DERIVADOS.length)];
  const plantas = clamp(Math.round(normal(rand, 4.6, 1.9)), 1, 9);
  const thc = clamp(normal(rand, 17.4, 4.6), 4, 29);
  const pesoFlor = clamp(plantas * 42 * (thc / 18) * normal(rand, 1, 0.16), 25, 640);
  const satisfaccion = clamp(Math.round(normal(rand, 7.4, 1.7) + (tipo === "Salud" ? 0.6 : 0)), 1, 10);
  const dias = clamp(Math.round(normal(rand, 34, 21) + (tipo === "Legal" ? 26 : 0)), 2, 180);
  const semana = 1 + Math.floor(rand() * 52);
  return {
    id: i + 1,
    semana,
    mes: Math.min(12, Math.ceil(((semana - 1) % 52) / 4.34)),
    anio: rand() > 0.45 ? 2026 : 2025,
    tipo,
    rango,
    provincia,
    derivado,
    plantas,
    pesoFlor: Math.round(pesoFlor),
    thc: Math.round(thc * 10) / 10,
    satisfaccion,
    dias,
  };
});

export const EDA_META = {
  nombre: "Relevamiento de consultas y acompañamientos · ACCA",
  filas: DATASET.length,
  columnas: 11,
  demo: true,
  fuente: "Mockup — reemplazar por registros internos de la asociación",
};

/* ---------------- Estadísticos ---------------- */
export type Stats = { n: number; media: number; mediana: number; desvio: number; min: number; max: number; q1: number; q3: number };

function cuantil(sorted: number[], q: number) {
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  return sorted[base + 1] !== undefined ? sorted[base] + rest * (sorted[base + 1] - sorted[base]) : sorted[base];
}

export function stats(valores: number[]): Stats {
  const s = [...valores].sort((a, b) => a - b);
  const n = s.length;
  const media = s.reduce((a, b) => a + b, 0) / n;
  const varianza = s.reduce((a, b) => a + (b - media) ** 2, 0) / n;
  return {
    n,
    media: Math.round(media * 100) / 100,
    mediana: Math.round(cuantil(s, 0.5) * 100) / 100,
    desvio: Math.round(Math.sqrt(varianza) * 100) / 100,
    min: s[0],
    max: s[n - 1],
    q1: Math.round(cuantil(s, 0.25) * 100) / 100,
    q3: Math.round(cuantil(s, 0.75) * 100) / 100,
  };
}

export const NUMERICAS: { key: keyof Consulta; label: string; unidad: string }[] = [
  { key: "plantas", label: "Plantas florecidas", unidad: "u." },
  { key: "pesoFlor", label: "Peso de flor", unidad: "g" },
  { key: "thc", label: "THC analizado", unidad: "%" },
  { key: "satisfaccion", label: "Satisfacción", unidad: "/10" },
  { key: "dias", label: "Días de acompañamiento", unidad: "d" },
];

export const ESTADISTICOS = NUMERICAS.map((c) => ({ ...c, ...stats(DATASET.map((d) => d[c.key] as number)) }));

/* ---------------- Histogramas ---------------- */
export type Histograma = { label: string; desde: number; hasta: number; conteo: number };

export function histograma(valores: number[], bins = 8): Histograma[] {
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const ancho = (max - min) / bins;
  return Array.from({ length: bins }, (_, i) => {
    const desde = min + i * ancho;
    const hasta = desde + ancho;
    const conteo = valores.filter((v) => (i === bins - 1 ? v >= desde && v <= hasta : v >= desde && v < hasta)).length;
    return { label: `${Math.round(desde)}–${Math.round(hasta)}`, desde, hasta, conteo };
  });
}

/* ---------------- Correlación (Pearson) ---------------- */
export function correlacion(a: number[], b: number[]) {
  const n = a.length;
  const ma = a.reduce((x, y) => x + y, 0) / n;
  const mb = b.reduce((x, y) => x + y, 0) / n;
  let num = 0;
  let da = 0;
  let db = 0;
  for (let i = 0; i < n; i++) {
    num += (a[i] - ma) * (b[i] - mb);
    da += (a[i] - ma) ** 2;
    db += (b[i] - mb) ** 2;
  }
  return num / Math.sqrt(da * db);
}

export const MATRIZ_CORR = NUMERICAS.map((col) => ({
  fila: col.label,
  valores: NUMERICAS.map((otra) => Math.round(correlacion(DATASET.map((d) => d[col.key] as number), DATASET.map((d) => d[otra.key] as number)) * 100) / 100),
}));

/* ---------------- Conteos categóricos ---------------- */
export function conteo(clave: keyof Consulta) {
  const mapa = new Map<string, number>();
  DATASET.forEach((d) => {
    const k = String(d[clave]);
    mapa.set(k, (mapa.get(k) ?? 0) + 1);
  });
  return [...mapa.entries()].map(([label, valor]) => ({ label, valor })).sort((a, b) => b.valor - a.valor);
}

export const POR_TIPO = conteo("tipo");
export const POR_RANGO = conteo("rango");
export const POR_PROVINCIA = conteo("provincia");
export const POR_DERIVADO = conteo("derivado");

/* ---------------- Mapa de calor: agenda semanal (52 x 7) ---------------- */
export type CeldaCalor = { semana: number; dia: number; valor: number };

export const HEATMAP_AGENDA: CeldaCalor[] = (() => {
  const r = rng(77123);
  const celdas: CeldaCalor[] = [];
  for (let semana = 1; semana <= 52; semana++) {
    for (let dia = 0; dia < 7; dia++) {
      const finde = dia >= 5;
      const base = finde ? 0.35 : 1;
      const estacional = 0.6 + 0.4 * Math.sin((semana / 52) * Math.PI * 2);
      const pico = semana === 12 || semana === 38 ? 1.9 : 1;
      const v = base * estacional * pico * (0.4 + r() * 1.3);
      celdas.push({ semana, dia, valor: Math.round(v * 10) / 10 });
    }
  }
  return celdas;
})();

export const DIAS_SEMANA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

/* ---------------- Gradiente de peso ---------------- */
export type PuntoPeso = {
  id: number;
  genotipo: string;
  ambiente: "Interior" | "Exterior" | "Invernadero";
  semana: number;
  peso: number;   // gramos de flor seca por planta
  thc: number;    // %
  area: number;   // m²
};

const GENOTIPOS = ["G-1", "G-2", "G-3", "G-4", "G-5"];
const AMBIENTES: PuntoPeso["ambiente"][] = ["Interior", "Exterior", "Invernadero"];

export const PUNTOS_PESO: PuntoPeso[] = (() => {
  const r = rng(4242);
  return Array.from({ length: 96 }, (_, i) => {
    const genotipo = GENOTIPOS[i % GENOTIPOS.length];
    const ambiente = AMBIENTES[Math.floor(r() * AMBIENTES.length)];
    const base = ambiente === "Exterior" ? 240 : ambiente === "Invernadero" ? 300 : 190;
    const thc = clamp(normal(r, 18, 4.4), 5, 30);
    const peso = Math.round(clamp(base * (thc / 18) * normal(r, 1, 0.19), 40, 620));
    return { id: i + 1, genotipo, ambiente, semana: 1 + Math.floor(r() * 14), peso, thc: Math.round(thc * 10) / 10, area: Math.round((4 + r() * 11) * 10) / 10 };
  });
})();

export const PESO_POR_GENOTIPO = GENOTIPOS.map((g) => {
  const vals = PUNTOS_PESO.filter((p) => p.genotipo === g).map((p) => p.peso);
  return { genotipo: g, ...stats(vals) };
});

/* ---------------- Mapa de calor geográfico (intensidad por provincia) ---------------- */
export const GEO_CALOR = [
  { provincia: "CABA", x: 62, y: 88, intensidad: 1.0, organizaciones: 6 },
  { provincia: "Buenos Aires", x: 60, y: 72, intensidad: 0.92, organizaciones: 9 },
  { provincia: "Córdoba", x: 52, y: 66, intensidad: 0.78, organizaciones: 7 },
  { provincia: "Santa Fe", x: 57, y: 60, intensidad: 0.71, organizaciones: 6 },
  { provincia: "Mendoza", x: 40, y: 68, intensidad: 0.44, organizaciones: 3 },
  { provincia: "Misiones", x: 74, y: 40, intensidad: 0.55, organizaciones: 4 },
  { provincia: "Río Negro", x: 48, y: 92, intensidad: 0.48, organizaciones: 3 },
  { provincia: "San Luis", x: 52, y: 76, intensidad: 0.3, organizaciones: 2 },
  { provincia: "Corrientes", x: 68, y: 48, intensidad: 0.34, organizaciones: 2 },
  { provincia: "San Juan", x: 40, y: 60, intensidad: 0.26, organizaciones: 2 },
  { provincia: "Tucumán", x: 46, y: 46, intensidad: 0.2, organizaciones: 1 },
  { provincia: "Chubut", x: 48, y: 99, intensidad: 0.16, organizaciones: 1 },
];

/* ---------------- Serie temporal de actividad (área apilada) ---------------- */
export const SERIE_MENSUAL = Array.from({ length: 12 }, (_, i) => {
  const r = rng(1000 + i);
  return {
    mes: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][i],
    consultas: Math.round(120 + 90 * Math.sin((i / 12) * Math.PI * 2 - 1) + r() * 60),
    talleres: Math.round(18 + 14 * Math.sin((i / 12) * Math.PI * 2 + 0.6) + r() * 12),
    prensa: Math.round(10 + 9 * Math.cos((i / 12) * Math.PI * 2) + r() * 8),
  };
});

/* ---------------- Radar de capacidades ---------------- */
export const RADAR_ACCA = [
  { eje: "Militancia", valor: 92 },
  { eje: "Acompañamiento", valor: 88 },
  { eje: "Comunicación", valor: 95 },
  { eje: "Cultivo", valor: 74 },
  { eje: "Investigación", valor: 81 },
  { eje: "Jurídico", valor: 86 },
];
