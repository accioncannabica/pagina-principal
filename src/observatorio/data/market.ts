export type HempStatus = 'industrial' | 'limitado' | 'piloto' | 'prohibido';
export type CbdRetail = 'libre' | 'farmacia' | 'restringido' | 'prohibido';
export type MarketModel = 'comercial' | 'clubes' | 'estatal' | 'farmacia' | 'ninguno';

export interface MarketRow {
  iso: string;
  /** Estatus del cáñamo industrial */
  hemp: HempStatus;
  /** Límite legal de THC para considerarse cáñamo (% en seco). 0 = sin marco */
  thcLimit: number;
  /** Hectáreas declaradas de cáñamo bajo licencia */
  hempHa: number;
  hempNote: string;
  /** Venta minorista de CBD */
  cbd: CbdRetail;
  /** Modelo comercial del cannabis con THC */
  model: MarketModel;
  /** Mercado legal estimado (millones de USD/año: medicinal + adulto + CBD) */
  marketUsd: number;
  /** % del consumo que sigue abasteciéndose en el mercado ilícito */
  illicitShare: number;
  /** Carga fiscal media sobre la venta legal (%) */
  tax: number;
  /** Crecimiento anual compuesto del mercado legal (%) */
  cagr: number;
  /** Tendencia comercial en una línea */
  trend: string;
  /** Precios estimados en USD. 0 = sin oferta legal/disponible */
  thcLegal: number; // flor THC en canal regulado, USD/gramo
  thcIllicit: number; // flor THC en mercado ilícito, USD/gramo
  cbdFlower: number; // flor de CBD/cáñamo, USD/gramo
  thcOil: number; // aceite con THC, USD por frasco de 10 ml
  cbdOil: number; // aceite de CBD, USD por frasco de 10 ml
}

export const HEMP_META: Record<HempStatus, { label: string; color: string; desc: string }> = {
  industrial: {
    label: 'Cáñamo industrial regulado',
    color: '#34d399',
    desc: 'Cultivo con licencia para fibra, grano, flor o extracción de CBD.',
  },
  limitado: {
    label: 'Cáñamo limitado',
    color: '#60a5fa',
    desc: 'Solo fibra y semilla, con cupos estatales o sin aprovechamiento de la flor.',
  },
  piloto: {
    label: 'Programa piloto / en implementación',
    color: '#fbbf24',
    desc: 'Ley aprobada o ensayos en curso, cadena comercial todavía incompleta.',
  },
  prohibido: {
    label: 'Sin marco de cáñamo',
    color: '#fb7185',
    desc: 'El cáñamo no se distingue legalmente del cannabis psicoactivo.',
  },
};

export const CBD_META: Record<CbdRetail, { label: string; color: string }> = {
  libre: { label: 'Venta libre', color: '#34d399' },
  farmacia: { label: 'Solo farmacia / receta', color: '#60a5fa' },
  restringido: { label: 'Restringido (flor prohibida)', color: '#fbbf24' },
  prohibido: { label: 'Prohibido', color: '#fb7185' },
};

export const MODEL_META: Record<MarketModel, { label: string; color: string }> = {
  comercial: { label: 'Venta comercial regulada', color: '#34d399' },
  clubes: { label: 'Clubes / asociaciones sin lucro', color: '#a3e635' },
  farmacia: { label: 'Canal farmacéutico', color: '#60a5fa' },
  estatal: { label: 'Monopolio o licencia estatal', color: '#818cf8' },
  ninguno: { label: 'Sin canal legal', color: '#fb7185' },
};

export const MARKET: MarketRow[] = [
  { iso: 'USA', hemp: 'industrial', thcLimit: 0.3, hempHa: 12000, hempNote: 'Farm Bill 2018: cáñamo federal ≤0,3 % THC; auge de cannabinoides semisintéticos.', cbd: 'libre', model: 'comercial', marketUsd: 32000, illicitShare: 48, tax: 25, cagr: 9, trend: 'Consolidación de operadores multiestado y guerra de precios por sobreoferta.', thcLegal: 9.5, thcIllicit: 10.5, cbdFlower: 6, thcOil: 45, cbdOil: 38 },
  { iso: 'CAN', hemp: 'industrial', thcLimit: 0.3, hempHa: 35000, hempNote: 'Cáñamo con licencia de Health Canada; grano y fibra con fuerte exportación.', cbd: 'farmacia', model: 'comercial', marketUsd: 4200, illicitShare: 28, tax: 21, cagr: 7, trend: 'Saturación minorista y caída del precio legal por debajo del ilícito.', thcLegal: 5.9, thcIllicit: 6.8, cbdFlower: 4.5, thcOil: 38, cbdOil: 32 },
  { iso: 'MEX', hemp: 'piloto', thcLimit: 1, hempHa: 500, hempNote: 'Reglamento pendiente pese a los fallos de la Corte; cáñamo sin cadena formal.', cbd: 'libre', model: 'farmacia', marketUsd: 60, illicitShare: 95, tax: 16, cagr: 12, trend: 'CBD en góndola de farmacias y suplementos, sin mercado adulto reglamentado.', thcLegal: 0, thcIllicit: 3.2, cbdFlower: 5, thcOil: 30, cbdOil: 28 },
  { iso: 'URY', hemp: 'industrial', thcLimit: 1, hempHa: 1800, hempNote: 'Cáñamo con licencia del IRCCA; polo exportador de flor y extractos.', cbd: 'libre', model: 'estatal', marketUsd: 55, illicitShare: 45, tax: 0, cagr: 11, trend: 'Precio de farmacia fijado por el Estado; clubes y autocultivo crecen más rápido.', thcLegal: 1.4, thcIllicit: 2.6, cbdFlower: 2.5, thcOil: 22, cbdOil: 18 },
  { iso: 'COL', hemp: 'industrial', thcLimit: 1, hempHa: 2500, hempNote: 'Licencias de cultivo no psicoactivo; exportación de extractos a la UE.', cbd: 'libre', model: 'farmacia', marketUsd: 120, illicitShare: 88, tax: 19, cagr: 18, trend: 'Exportador de bajo costo; la venta interna sigue atada al canal medicinal.', thcLegal: 0, thcIllicit: 1.8, cbdFlower: 2.2, thcOil: 20, cbdOil: 15 },
  { iso: 'BRA', hemp: 'piloto', thcLimit: 0.3, hempHa: 300, hempNote: 'Decisión judicial de 2024 habilita el cáñamo; falta reglamentación de ANVISA.', cbd: 'farmacia', model: 'farmacia', marketUsd: 180, illicitShare: 97, tax: 25, cagr: 30, trend: 'Asociaciones de pacientes y aceites importados empujan el mercado medicinal.', thcLegal: 0, thcIllicit: 2.5, cbdFlower: 4, thcOil: 55, cbdOil: 45 },
  { iso: 'ARG', hemp: 'industrial', thcLimit: 1, hempHa: 1200, hempNote: 'Ley 27.669 y agencia ARICCAME: licencias de cáñamo y cannabis medicinal.', cbd: 'farmacia', model: 'farmacia', marketUsd: 90, illicitShare: 92, tax: 21, cagr: 22, trend: 'REPROCANN y cultivo solidario sostienen la demanda; industria en formación.', thcLegal: 0, thcIllicit: 3, cbdFlower: 3.5, thcOil: 28, cbdOil: 22 },
  { iso: 'CHL', hemp: 'limitado', thcLimit: 1, hempHa: 400, hempNote: 'Cáñamo con autorización del SAG, solo semilla y fibra.', cbd: 'farmacia', model: 'farmacia', marketUsd: 45, illicitShare: 93, tax: 19, cagr: 10, trend: 'Aceites de receta en farmacias caros; clubes de cultivo en zona gris.', thcLegal: 0, thcIllicit: 4, cbdFlower: 4.5, thcOil: 35, cbdOil: 30 },
  { iso: 'PER', hemp: 'limitado', thcLimit: 1, hempHa: 150, hempNote: 'Registro de DIGEMID para derivados; cáñamo apenas incipiente.', cbd: 'farmacia', model: 'farmacia', marketUsd: 25, illicitShare: 96, tax: 18, cagr: 12, trend: 'Importación de aceites y primeras licencias de cultivo asociativo.', thcLegal: 0, thcIllicit: 2.2, cbdFlower: 4, thcOil: 32, cbdOil: 28 },
  { iso: 'ECU', hemp: 'industrial', thcLimit: 1, hempHa: 900, hempNote: 'Reforma de 2019: cáñamo hasta 1 % THC con licencia agrícola.', cbd: 'libre', model: 'farmacia', marketUsd: 30, illicitShare: 96, tax: 12, cagr: 15, trend: 'Expectativa exportadora frenada por costos de certificación.', thcLegal: 0, thcIllicit: 2, cbdFlower: 3.5, thcOil: 28, cbdOil: 24 },
  { iso: 'BOL', hemp: 'prohibido', thcLimit: 0, hempHa: 0, hempNote: 'Sin distinción legal entre cáñamo y cannabis psicoactivo.', cbd: 'prohibido', model: 'ninguno', marketUsd: 2, illicitShare: 99, tax: 13, cagr: 3, trend: 'Mercado íntegramente informal, abastecido desde Paraguay.', thcLegal: 0, thcIllicit: 1.5, cbdFlower: 0, thcOil: 0, cbdOil: 0 },
  { iso: 'PRY', hemp: 'limitado', thcLimit: 0.5, hempHa: 800, hempNote: 'Licencias de cáñamo y cannabis medicinal desde 2022.', cbd: 'farmacia', model: 'farmacia', marketUsd: 12, illicitShare: 98, tax: 10, cagr: 14, trend: 'Mayor productor informal del Cono Sur; precio más bajo de la región.', thcLegal: 0, thcIllicit: 0.9, cbdFlower: 2, thcOil: 18, cbdOil: 15 },
  { iso: 'JAM', hemp: 'industrial', thcLimit: 1, hempHa: 400, hempNote: 'Cannabis Licensing Authority habilita cáñamo y herb houses.', cbd: 'libre', model: 'comercial', marketUsd: 35, illicitShare: 85, tax: 15, cagr: 9, trend: 'Turismo cannábico y dispensarios con licencia junto al ganja tradicional.', thcLegal: 3, thcIllicit: 2.2, cbdFlower: 3, thcOil: 25, cbdOil: 20 },

  { iso: 'DEU', hemp: 'industrial', thcLimit: 0.3, hempHa: 7000, hempNote: 'Límite elevado a 0,3 % con la CanG; flor de cáñamo aún restringida.', cbd: 'libre', model: 'clubes', marketUsd: 1100, illicitShare: 70, tax: 19, cagr: 24, trend: 'Clubes sociales y receta electrónica disparan el canal legal desde 2024.', thcLegal: 9, thcIllicit: 11.5, cbdFlower: 7, thcOil: 60, cbdOil: 45 },
  { iso: 'MLT', hemp: 'industrial', thcLimit: 0.2, hempHa: 20, hempNote: 'Cáñamo marginal por superficie; foco en asociaciones de cultivo.', cbd: 'libre', model: 'clubes', marketUsd: 12, illicitShare: 72, tax: 0, cagr: 15, trend: 'Modelo sin ánimo de lucro: precio de costo y prohibición de publicidad.', thcLegal: 8, thcIllicit: 12, cbdFlower: 8, thcOil: 55, cbdOil: 48 },
  { iso: 'LUX', hemp: 'industrial', thcLimit: 0.3, hempHa: 150, hempNote: 'Cáñamo agrícola permitido; flor de CBD tolerada en comercios.', cbd: 'libre', model: 'ninguno', marketUsd: 9, illicitShare: 85, tax: 17, cagr: 12, trend: 'Autocultivo legal sin canal de venta: el mercado gris persiste.', thcLegal: 0, thcIllicit: 11, cbdFlower: 8, thcOil: 58, cbdOil: 46 },
  { iso: 'NLD', hemp: 'industrial', thcLimit: 0.2, hempHa: 3500, hempNote: 'Cáñamo de fibra tradicional; la flor de CBD sigue en zona gris.', cbd: 'libre', model: 'comercial', marketUsd: 950, illicitShare: 35, tax: 21, cagr: 5, trend: 'Experimento de cadena cerrada: coffeeshops con producto trazado desde 2024.', thcLegal: 11, thcIllicit: 9, cbdFlower: 7, thcOil: 50, cbdOil: 40 },
  { iso: 'ESP', hemp: 'industrial', thcLimit: 0.2, hempHa: 1200, hempNote: 'Cáñamo para fibra y semilla; la flor solo puede destinarse a exportación.', cbd: 'restringido', model: 'clubes', marketUsd: 220, illicitShare: 80, tax: 21, cagr: 8, trend: 'Clubes sociales bajo presión judicial y auge de tiendas de CBD.', thcLegal: 7.5, thcIllicit: 8, cbdFlower: 6, thcOil: 48, cbdOil: 35 },
  { iso: 'PRT', hemp: 'industrial', thcLimit: 0.2, hempHa: 900, hempNote: 'Infarmed licencia cultivo medicinal y cáñamo para exportación.', cbd: 'farmacia', model: 'farmacia', marketUsd: 140, illicitShare: 82, tax: 23, cagr: 14, trend: 'Polo exportador europeo: invernaderos de gran escala para la UE.', thcLegal: 0, thcIllicit: 8.5, cbdFlower: 7, thcOil: 52, cbdOil: 38 },
  { iso: 'FRA', hemp: 'industrial', thcLimit: 0.3, hempHa: 22000, hempNote: 'Mayor superficie de cáñamo de la UE; venta de flor de CBD validada en 2023.', cbd: 'libre', model: 'farmacia', marketUsd: 85, illicitShare: 94, tax: 20, cagr: 9, trend: 'Potencia agrícola del cáñamo con el mercado de THC totalmente ilícito.', thcLegal: 0, thcIllicit: 10.5, cbdFlower: 6.5, thcOil: 55, cbdOil: 40 },
  { iso: 'ITA', hemp: 'industrial', thcLimit: 0.6, hempHa: 4000, hempNote: 'Ley 242/2016 "cannabis light": tolerancia de 0,2 % a 0,6 % THC.', cbd: 'restringido', model: 'farmacia', marketUsd: 320, illicitShare: 86, tax: 22, cagr: 7, trend: 'El decreto de seguridad de 2025 amenaza la cadena de cannabis light.', thcLegal: 0, thcIllicit: 10, cbdFlower: 5.5, thcOil: 50, cbdOil: 35 },
  { iso: 'GBR', hemp: 'limitado', thcLimit: 0.2, hempHa: 800, hempNote: 'Licencia del Home Office solo para fibra y semilla: la flor debe destruirse.', cbd: 'restringido', model: 'farmacia', marketUsd: 690, illicitShare: 90, tax: 20, cagr: 11, trend: 'Mayor mercado de CBD de Europa con receta privada cara para el THC.', thcLegal: 0, thcIllicit: 12, cbdFlower: 0, thcOil: 75, cbdOil: 42 },
  { iso: 'BEL', hemp: 'industrial', thcLimit: 0.2, hempHa: 1100, hempNote: 'Cáñamo agrícola permitido; flor de CBD tolerada con etiquetado.', cbd: 'libre', model: 'ninguno', marketUsd: 70, illicitShare: 90, tax: 21, cagr: 8, trend: 'Tiendas de CBD en expansión sin reforma del canal con THC.', thcLegal: 0, thcIllicit: 10, cbdFlower: 7, thcOil: 55, cbdOil: 38 },
  { iso: 'CHE', hemp: 'industrial', thcLimit: 1, hempHa: 500, hempNote: 'Umbral propio de 1 % THC: el cannabis "legal" se vende como tabaco sustitutivo.', cbd: 'libre', model: 'comercial', marketUsd: 160, illicitShare: 65, tax: 7.7, cagr: 13, trend: 'Pilotos científicos de venta en farmacias y tiendas de Basilea y Zúrich.', thcLegal: 10, thcIllicit: 11, cbdFlower: 6, thcOil: 65, cbdOil: 45 },
  { iso: 'AUT', hemp: 'industrial', thcLimit: 0.3, hempHa: 1500, hempNote: 'Cáñamo agrícola e esquejes legales; la floración está prohibida.', cbd: 'restringido', model: 'farmacia', marketUsd: 95, illicitShare: 88, tax: 20, cagr: 9, trend: 'Aromaprodukte de CBD en estancos y farmacias, sin canal recreativo.', thcLegal: 0, thcIllicit: 10.5, cbdFlower: 6.5, thcOil: 58, cbdOil: 40 },
  { iso: 'IRL', hemp: 'limitado', thcLimit: 0.2, hempHa: 100, hempNote: 'Licencias escasas; la flor de cáñamo se considera controlada.', cbd: 'restringido', model: 'farmacia', marketUsd: 45, illicitShare: 93, tax: 23, cagr: 10, trend: 'Programa medicinal muy acotado y precios minoristas altos.', thcLegal: 0, thcIllicit: 13, cbdFlower: 8, thcOil: 70, cbdOil: 45 },
  { iso: 'DNK', hemp: 'industrial', thcLimit: 0.2, hempHa: 300, hempNote: 'Cáñamo agrícola autorizado; flor y vapeo de CBD restringidos.', cbd: 'farmacia', model: 'farmacia', marketUsd: 60, illicitShare: 88, tax: 25, cagr: 8, trend: 'Piloto medicinal prorrogado con producción local de alta calidad.', thcLegal: 0, thcIllicit: 11, cbdFlower: 0, thcOil: 65, cbdOil: 48 },
  { iso: 'SWE', hemp: 'limitado', thcLimit: 0.2, hempHa: 50, hempNote: 'Cáñamo de fibra permitido, pero los tribunales tratan la flor como droga.', cbd: 'prohibido', model: 'ninguno', marketUsd: 20, illicitShare: 97, tax: 25, cagr: 4, trend: 'Tolerancia cero: CBD con THC detectable equivale a estupefaciente.', thcLegal: 0, thcIllicit: 14, cbdFlower: 0, thcOil: 80, cbdOil: 55 },
  { iso: 'NOR', hemp: 'limitado', thcLimit: 0.2, hempHa: 40, hempNote: 'Cultivo de cáñamo autorizado desde 2019 solo para fibra y semilla.', cbd: 'prohibido', model: 'ninguno', marketUsd: 18, illicitShare: 97, tax: 25, cagr: 5, trend: 'Mercado de los más caros del mundo por la alta presión aduanera.', thcLegal: 0, thcIllicit: 16, cbdFlower: 0, thcOil: 85, cbdOil: 55 },
  { iso: 'CZE', hemp: 'industrial', thcLimit: 1, hempHa: 2000, hempNote: 'Umbral elevado a 1 % THC en 2024: el cáñamo "psicomodulador" es legal.', cbd: 'libre', model: 'clubes', marketUsd: 110, illicitShare: 68, tax: 21, cagr: 20, trend: 'Tiendas de HHC y flores de bajo THC previas al marco de clubes de 2025.', thcLegal: 7, thcIllicit: 8.5, cbdFlower: 5, thcOil: 45, cbdOil: 32 },
  { iso: 'GRC', hemp: 'industrial', thcLimit: 0.2, hempHa: 600, hempNote: 'Cáñamo agrícola y licencias de producción medicinal para exportación.', cbd: 'libre', model: 'farmacia', marketUsd: 55, illicitShare: 92, tax: 24, cagr: 11, trend: 'Inversión extranjera en invernaderos orientados a Alemania.', thcLegal: 0, thcIllicit: 8, cbdFlower: 6, thcOil: 45, cbdOil: 33 },
  { iso: 'POL', hemp: 'industrial', thcLimit: 0.3, hempHa: 3000, hempNote: 'Cáñamo en expansión con registro nacional de variedades.', cbd: 'libre', model: 'farmacia', marketUsd: 80, illicitShare: 93, tax: 23, cagr: 13, trend: 'Farmacias importan flor medicinal alemana y canadiense.', thcLegal: 0, thcIllicit: 9, cbdFlower: 5.5, thcOil: 50, cbdOil: 30 },
  { iso: 'HRV', hemp: 'industrial', thcLimit: 0.2, hempHa: 400, hempNote: 'Cáñamo con registro agrario; flor destinada a exportación.', cbd: 'libre', model: 'farmacia', marketUsd: 25, illicitShare: 93, tax: 25, cagr: 10, trend: 'Pequeños productores de CBD orientados al turismo costero.', thcLegal: 0, thcIllicit: 8.5, cbdFlower: 6, thcOil: 45, cbdOil: 32 },
  { iso: 'ROU', hemp: 'limitado', thcLimit: 0.2, hempHa: 800, hempNote: 'Tradición de cáñamo de fibra; sin aprovechamiento de la flor.', cbd: 'restringido', model: 'ninguno', marketUsd: 18, illicitShare: 97, tax: 19, cagr: 8, trend: 'Sin acceso medicinal: todo el consumo se abastece de forma ilícita.', thcLegal: 0, thcIllicit: 8, cbdFlower: 5, thcOil: 40, cbdOil: 28 },
  { iso: 'UKR', hemp: 'piloto', thcLimit: 0.3, hempHa: 1800, hempNote: 'Cáñamo industrial consolidado; cannabis medicinal en implementación.', cbd: 'farmacia', model: 'farmacia', marketUsd: 22, illicitShare: 96, tax: 20, cagr: 25, trend: 'Demanda de tratamientos para veteranos impulsa la apertura del canal.', thcLegal: 0, thcIllicit: 7, cbdFlower: 4.5, thcOil: 38, cbdOil: 25 },
  { iso: 'BLR', hemp: 'limitado', thcLimit: 0.2, hempHa: 1000, hempNote: 'Cáñamo estatal para fibra; cualquier otro uso está penado.', cbd: 'prohibido', model: 'ninguno', marketUsd: 4, illicitShare: 99, tax: 20, cagr: 2, trend: 'Mercado cerrado con control policial de envíos postales.', thcLegal: 0, thcIllicit: 9, cbdFlower: 0, thcOil: 0, cbdOil: 0 },
  { iso: 'RUS', hemp: 'limitado', thcLimit: 0.1, hempHa: 13000, hempNote: 'Programa estatal de cáñamo de fibra con umbral muy estricto.', cbd: 'prohibido', model: 'ninguno', marketUsd: 8, illicitShare: 99, tax: 20, cagr: 3, trend: 'Cáñamo agroindustrial creciente y prohibición total del CBD.', thcLegal: 0, thcIllicit: 10, cbdFlower: 0, thcOil: 0, cbdOil: 0 },
  { iso: 'GEO', hemp: 'limitado', thcLimit: 0.2, hempHa: 200, hempNote: 'Consumo despenalizado pero el cultivo, incluso de cáñamo, está limitado.', cbd: 'restringido', model: 'ninguno', marketUsd: 6, illicitShare: 97, tax: 18, cagr: 9, trend: 'Paradoja legal: se puede consumir pero no producir ni comprar.', thcLegal: 0, thcIllicit: 6, cbdFlower: 4, thcOil: 30, cbdOil: 22 },
  { iso: 'TUR', hemp: 'industrial', thcLimit: 0.2, hempHa: 3500, hempNote: 'Cultivo de cáñamo autorizado en 19 provincias bajo control estatal.', cbd: 'restringido', model: 'estatal', marketUsd: 40, illicitShare: 96, tax: 20, cagr: 12, trend: 'Plan estatal de fibra y semilla para sustituir importaciones.', thcLegal: 0, thcIllicit: 7, cbdFlower: 0, thcOil: 35, cbdOil: 25 },

  { iso: 'MAR', hemp: 'industrial', thcLimit: 1, hempHa: 3200, hempNote: 'Ley 13-21: licencias de cáñamo y cannabis medicinal en el Rif.', cbd: 'farmacia', model: 'estatal', marketUsd: 95, illicitShare: 93, tax: 20, cagr: 35, trend: 'Transición del hachís informal a cooperativas legales de exportación.', thcLegal: 0, thcIllicit: 1.5, cbdFlower: 2, thcOil: 18, cbdOil: 14 },
  { iso: 'ZAF', hemp: 'industrial', thcLimit: 0.2, hempHa: 2500, hempNote: 'Cáñamo como cultivo agrícola desde 2021 con permiso del DALRRD.', cbd: 'libre', model: 'clubes', marketUsd: 150, illicitShare: 87, tax: 15, cagr: 16, trend: 'Clubes privados de cultivo y plan estatal de cáñamo para empleo rural.', thcLegal: 4, thcIllicit: 3.5, cbdFlower: 3, thcOil: 30, cbdOil: 20 },
  { iso: 'NGA', hemp: 'prohibido', thcLimit: 0, hempHa: 0, hempNote: 'Sin marco de cáñamo; la NDLEA erradica todo cultivo.', cbd: 'prohibido', model: 'ninguno', marketUsd: 3, illicitShare: 99, tax: 7.5, cagr: 5, trend: 'Enorme mercado informal con precios de los más bajos del mundo.', thcLegal: 0, thcIllicit: 0.6, cbdFlower: 0, thcOil: 0, cbdOil: 0 },
  { iso: 'EGY', hemp: 'prohibido', thcLimit: 0, hempHa: 0, hempNote: 'Prohibición total; sin distinción entre cáñamo y cannabis.', cbd: 'prohibido', model: 'ninguno', marketUsd: 2, illicitShare: 99, tax: 14, cagr: 3, trend: 'Mercado del hachís abastecido desde el Líbano y Marruecos.', thcLegal: 0, thcIllicit: 1.8, cbdFlower: 0, thcOil: 0, cbdOil: 0 },
  { iso: 'GHA', hemp: 'industrial', thcLimit: 0.3, hempHa: 600, hempNote: 'Narcotics Control Act 2020: cáñamo ≤0,3 % THC con licencia.', cbd: 'restringido', model: 'estatal', marketUsd: 25, illicitShare: 96, tax: 15, cagr: 20, trend: 'Primeras licencias industriales en un mercado aún dominado por el "wee".', thcLegal: 0, thcIllicit: 0.8, cbdFlower: 2, thcOil: 20, cbdOil: 15 },
  { iso: 'KEN', hemp: 'prohibido', thcLimit: 0, hempHa: 0, hempNote: 'Proyectos de ley de cáñamo repetidamente archivados.', cbd: 'prohibido', model: 'ninguno', marketUsd: 4, illicitShare: 99, tax: 16, cagr: 6, trend: 'Debate parlamentario abierto sobre el cáñamo como cultivo de renta.', thcLegal: 0, thcIllicit: 1.2, cbdFlower: 0, thcOil: 0, cbdOil: 0 },
  { iso: 'ETH', hemp: 'prohibido', thcLimit: 0, hempHa: 0, hempNote: 'Sin marco legal de cáñamo pese al cultivo tradicional.', cbd: 'prohibido', model: 'ninguno', marketUsd: 2, illicitShare: 99, tax: 15, cagr: 3, trend: 'Producción campesina perseguida y sin canal formal.', thcLegal: 0, thcIllicit: 0.7, cbdFlower: 0, thcOil: 0, cbdOil: 0 },
  { iso: 'TZA', hemp: 'prohibido', thcLimit: 0, hempHa: 0, hempNote: 'Cáñamo no diferenciado; erradicación anual de cultivos.', cbd: 'prohibido', model: 'ninguno', marketUsd: 2, illicitShare: 99, tax: 18, cagr: 4, trend: 'Exportación informal hacia los países vecinos del corredor oriental.', thcLegal: 0, thcIllicit: 0.6, cbdFlower: 0, thcOil: 0, cbdOil: 0 },
  { iso: 'ZWE', hemp: 'industrial', thcLimit: 0.3, hempHa: 500, hempNote: 'Pionero africano: licencias de cáñamo y cannabis medicinal desde 2018.', cbd: 'restringido', model: 'estatal', marketUsd: 20, illicitShare: 95, tax: 14.5, cagr: 18, trend: 'Cáñamo promovido como sustituto del tabaco para exportación.', thcLegal: 0, thcIllicit: 1, cbdFlower: 2, thcOil: 18, cbdOil: 14 },
  { iso: 'ISR', hemp: 'industrial', thcLimit: 0.3, hempHa: 350, hempNote: 'Cáñamo autorizado para investigación y alimentación desde 2022.', cbd: 'farmacia', model: 'farmacia', marketUsd: 420, illicitShare: 72, tax: 17, cagr: 10, trend: 'Modelo de farmacias con precios regulados y fuerte I+D clínica.', thcLegal: 4.5, thcIllicit: 9, cbdFlower: 5, thcOil: 40, cbdOil: 30 },
  { iso: 'LBN', hemp: 'piloto', thcLimit: 1, hempHa: 1500, hempNote: 'Ley de 2020 para cáñamo y cannabis medicinal, sin reglamentar.', cbd: 'restringido', model: 'ninguno', marketUsd: 15, illicitShare: 98, tax: 11, cagr: 8, trend: 'La Bekaa sigue produciendo hachís informal ante la crisis económica.', thcLegal: 0, thcIllicit: 1.2, cbdFlower: 2, thcOil: 20, cbdOil: 15 },

  { iso: 'THA', hemp: 'industrial', thcLimit: 1, hempHa: 5000, hempNote: 'Cáñamo y cannabis deslistados en 2022: umbral de 0,2 % para extractos.', cbd: 'libre', model: 'comercial', marketUsd: 1200, illicitShare: 40, tax: 7, cagr: 15, trend: 'Miles de dispensarios en revisión por el nuevo proyecto restrictivo.', thcLegal: 5.5, thcIllicit: 6, cbdFlower: 4, thcOil: 30, cbdOil: 20 },
  { iso: 'IND', hemp: 'industrial', thcLimit: 0.3, hempHa: 4000, hempNote: 'Licencias estatales de cáñamo en Uttarakhand, Uttar Pradesh y Madhya Pradesh.', cbd: 'farmacia', model: 'farmacia', marketUsd: 120, illicitShare: 97, tax: 18, cagr: 22, trend: 'Cáñamo ayurvédico y bhang estatal conviven con la prohibición de la flor.', thcLegal: 0, thcIllicit: 1, cbdFlower: 2.5, thcOil: 22, cbdOil: 16 },
  { iso: 'PAK', hemp: 'piloto', thcLimit: 0.3, hempHa: 1000, hempNote: 'Licencias de cáñamo industrial aprobadas en 2020, despliegue lento.', cbd: 'restringido', model: 'estatal', marketUsd: 20, illicitShare: 98, tax: 17, cagr: 15, trend: 'Plan estatal para capturar el mercado global de fibra y CBD.', thcLegal: 0, thcIllicit: 0.8, cbdFlower: 0, thcOil: 0, cbdOil: 12 },
  { iso: 'AFG', hemp: 'prohibido', thcLimit: 0, hempHa: 0, hempNote: 'Prohibición del Emirato: erradicación del cannabis y del cáñamo.', cbd: 'prohibido', model: 'ninguno', marketUsd: 1, illicitShare: 100, tax: 0, cagr: 0, trend: 'Colapso del hachís rural tras la prohibición de 2022.', thcLegal: 0, thcIllicit: 0.5, cbdFlower: 0, thcOil: 0, cbdOil: 0 },
  { iso: 'NPL', hemp: 'prohibido', thcLimit: 0, hempHa: 500, hempNote: 'Cáñamo tradicional informal; proyectos de ley sin aprobar.', cbd: 'prohibido', model: 'ninguno', marketUsd: 3, illicitShare: 99, tax: 13, cagr: 6, trend: 'Presión para revivir el cáñamo himalayo como cultivo de montaña.', thcLegal: 0, thcIllicit: 0.7, cbdFlower: 0, thcOil: 0, cbdOil: 0 },
  { iso: 'LKA', hemp: 'limitado', thcLimit: 0, hempHa: 100, hempNote: 'Cultivo estatal para medicina ayurvédica, sin umbral de cáñamo definido.', cbd: 'farmacia', model: 'estatal', marketUsd: 6, illicitShare: 98, tax: 15, cagr: 10, trend: 'Propuesta de cultivo para exportación debatida desde 2019.', thcLegal: 0, thcIllicit: 2, cbdFlower: 0, thcOil: 0, cbdOil: 0 },
  { iso: 'KAZ', hemp: 'limitado', thcLimit: 0.2, hempHa: 2000, hempNote: 'Cáñamo de fibra estatal; la estepa de Chu se erradica cada año.', cbd: 'prohibido', model: 'ninguno', marketUsd: 5, illicitShare: 99, tax: 12, cagr: 5, trend: 'Enormes extensiones silvestres frente a un marco comercial inexistente.', thcLegal: 0, thcIllicit: 4, cbdFlower: 0, thcOil: 0, cbdOil: 0 },
  { iso: 'CHN', hemp: 'industrial', thcLimit: 0.3, hempHa: 70000, hempNote: 'Yunnan y Heilongjiang: líder mundial en fibra y extracción de CBD.', cbd: 'prohibido', model: 'ninguno', marketUsd: 60, illicitShare: 99, tax: 13, cagr: 6, trend: 'Exporta CBD pero lo prohibió en cosmética interna desde 2021.', thcLegal: 0, thcIllicit: 30, cbdFlower: 0, thcOil: 0, cbdOil: 0 },
  { iso: 'JPN', hemp: 'limitado', thcLimit: 0, hempHa: 25, hempNote: 'Cáñamo ritual casi extinto; reforma de 2023 fija límites de THC en productos.', cbd: 'restringido', model: 'farmacia', marketUsd: 180, illicitShare: 100, tax: 10, cagr: 14, trend: 'Mercado de CBD en auge junto a penas crecientes para el THC.', thcLegal: 0, thcIllicit: 55, cbdFlower: 0, thcOil: 0, cbdOil: 60 },
  { iso: 'KOR', hemp: 'limitado', thcLimit: 0.3, hempHa: 100, hempNote: 'Cáñamo de fibra en Andong; "zona franca" de cáñamo industrial desde 2020.', cbd: 'farmacia', model: 'farmacia', marketUsd: 45, illicitShare: 100, tax: 10, cagr: 12, trend: 'Importación medicinal puntual y CBD cosmético en expansión.', thcLegal: 0, thcIllicit: 42, cbdFlower: 0, thcOil: 0, cbdOil: 55 },
  { iso: 'VNM', hemp: 'prohibido', thcLimit: 0, hempHa: 0, hempNote: 'Sin marco de cáñamo; cultivo tradicional hmong perseguido.', cbd: 'prohibido', model: 'ninguno', marketUsd: 3, illicitShare: 100, tax: 10, cagr: 4, trend: 'Mercado informal urbano abastecido desde Laos y Camboya.', thcLegal: 0, thcIllicit: 8, cbdFlower: 0, thcOil: 0, cbdOil: 0 },
  { iso: 'PHL', hemp: 'prohibido', thcLimit: 0, hempHa: 0, hempNote: 'Cáñamo incluido en la prohibición general de la Ley 9165.', cbd: 'prohibido', model: 'ninguno', marketUsd: 5, illicitShare: 100, tax: 12, cagr: 5, trend: 'Proyecto de cannabis medicinal bloqueado en el Senado.', thcLegal: 0, thcIllicit: 9, cbdFlower: 0, thcOil: 0, cbdOil: 0 },
  { iso: 'IDN', hemp: 'prohibido', thcLimit: 0, hempHa: 0, hempNote: 'Cannabis en lista I: el cáñamo no tiene estatus diferenciado.', cbd: 'prohibido', model: 'ninguno', marketUsd: 2, illicitShare: 100, tax: 11, cagr: 3, trend: 'Aceh produce para el mercado interno bajo fuerte represión.', thcLegal: 0, thcIllicit: 7, cbdFlower: 0, thcOil: 0, cbdOil: 0 },
  { iso: 'MYS', hemp: 'limitado', thcLimit: 0, hempHa: 20, hempNote: 'Solo ensayos de investigación; la venta sigue bajo la ley de drogas peligrosas.', cbd: 'prohibido', model: 'ninguno', marketUsd: 8, illicitShare: 100, tax: 10, cagr: 6, trend: 'Debate sobre uso medicinal frente a la pena capital por tráfico.', thcLegal: 0, thcIllicit: 10, cbdFlower: 0, thcOil: 0, cbdOil: 0 },

  { iso: 'AUS', hemp: 'industrial', thcLimit: 1, hempHa: 1500, hempNote: 'Umbral de hasta 1 % THC según el estado; alimento con cáñamo legal desde 2017.', cbd: 'farmacia', model: 'farmacia', marketUsd: 480, illicitShare: 85, tax: 10, cagr: 25, trend: 'Telemedicina: más de un millón de recetas anuales de flor medicinal.', thcLegal: 10, thcIllicit: 19, cbdFlower: 0, thcOil: 70, cbdOil: 55 },
  { iso: 'NZL', hemp: 'industrial', thcLimit: 0.35, hempHa: 500, hempNote: 'Licencias de cáñamo del Ministerio de Salud; semilla alimentaria desde 2018.', cbd: 'farmacia', model: 'farmacia', marketUsd: 90, illicitShare: 88, tax: 15, cagr: 20, trend: 'Esquema medicinal con producción local tras el referéndum de 2020.', thcLegal: 11, thcIllicit: 16, cbdFlower: 0, thcOil: 75, cbdOil: 58 },
  { iso: 'PNG', hemp: 'piloto', thcLimit: 0.3, hempHa: 200, hempNote: 'Ensayos de cáñamo industrial como cultivo de sustitución.', cbd: 'prohibido', model: 'ninguno', marketUsd: 2, illicitShare: 99, tax: 10, cagr: 8, trend: 'Cáñamo promovido en las tierras altas pese a la prohibición del THC.', thcLegal: 0, thcIllicit: 1.5, cbdFlower: 0, thcOil: 0, cbdOil: 0 },
];

export const MARKET_BY_ISO: Record<string, MarketRow> = Object.fromEntries(
  MARKET.map((m) => [m.iso, m]),
);

/** Evolución del cáñamo industrial y del CBD a escala global */
export const HEMP_SERIES = [
  { year: 2014, hectares: 120, countries: 22, cbdMarket: 0.4, hempMarket: 2.1 },
  { year: 2016, hectares: 180, countries: 30, cbdMarket: 1.1, hempMarket: 2.8 },
  { year: 2018, hectares: 290, countries: 41, cbdMarket: 3.4, hempMarket: 3.9 },
  { year: 2019, hectares: 360, countries: 48, cbdMarket: 5.3, hempMarket: 4.6 },
  { year: 2020, hectares: 310, countries: 54, cbdMarket: 6.1, hempMarket: 5.0 },
  { year: 2021, hectares: 285, countries: 60, cbdMarket: 6.8, hempMarket: 5.6 },
  { year: 2022, hectares: 300, countries: 65, cbdMarket: 7.4, hempMarket: 6.3 },
  { year: 2023, hectares: 325, countries: 70, cbdMarket: 8.1, hempMarket: 7.0 },
  { year: 2024, hectares: 355, countries: 74, cbdMarket: 9.0, hempMarket: 7.8 },
];

export const PRICE_META = [
  { key: 'thcLegal', label: 'Flor THC — canal legal', color: '#34d399', unit: 'USD/g' },
  { key: 'thcIllicit', label: 'Flor THC — mercado ilícito', color: '#fb7185', unit: 'USD/g' },
  { key: 'cbdFlower', label: 'Flor de CBD / cáñamo', color: '#60a5fa', unit: 'USD/g' },
  { key: 'thcOil', label: 'Aceite con THC', color: '#a78bfa', unit: 'USD/10 ml' },
  { key: 'cbdOil', label: 'Aceite de CBD', color: '#22d3ee', unit: 'USD/10 ml' },
] as const;

export type PriceKey = (typeof PRICE_META)[number]['key'];
