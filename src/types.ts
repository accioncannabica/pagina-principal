export type Vista =
  | "inicio"
  | "quienes"
  | "recorrido"
  | "novedades"
  | "redes"
  | "reprocann"
  | "facc"
  | "eda"
  | "tienda"
  | "donaciones"
  | "contacto"
  | "harness";

export type ItemNav = {
  id: Vista;
  titulo: string;
  icono: string;
  grupo: "Tablero" | "Institucional" | "Redes" | "Programas" | "Datos" | "Acción";
  bajada: string;
  /** `false` oculta la sección del sitio público pero conserva su código y datos. Ausente = visible. */
  visible?: boolean;
};

export const NAV: ItemNav[] = [
  { id: "inicio", titulo: "Inicio", icono: "home", grupo: "Tablero", bajada: "Resumen general y accesos rápidos" },
  { id: "quienes", titulo: "Quiénes somos", icono: "users", grupo: "Institucional", bajada: "Manifiesto, pilares e historia" },
  { id: "recorrido", titulo: "Recorrido", icono: "calendar", grupo: "Institucional", bajada: "Actividades realizadas y agenda" },
  { id: "novedades", titulo: "Novedades", icono: "news", grupo: "Institucional", bajada: "Noticias locales e internacionales" },
  { id: "redes", titulo: "Redes", icono: "network", grupo: "Redes", bajada: "Organizaciones y contactos" },
  { id: "facc", titulo: "FACC", icono: "globe", grupo: "Redes", bajada: "Federación y organizaciones miembras" },
  { id: "reprocann", titulo: "REPROCANN", icono: "clipboard", grupo: "Programas", bajada: "Programa, normativa y contacto" },
  { id: "eda", titulo: "Datos & EDA", icono: "lab", grupo: "Datos", bajada: "EDA, mapa de calor y gradiente de peso" },
  { id: "harness", titulo: "Spec & Skills", icono: "code", grupo: "Datos", bajada: "Especificación, skills y mockups", visible: false },
  { id: "tienda", titulo: "Tienda", icono: "shop", grupo: "Acción", bajada: "Merchandising institucional", visible: false },
  { id: "donaciones", titulo: "Donaciones", icono: "gift", grupo: "Acción",   bajada: "Destino de los fondos", visible: false },
  { id: "contacto", titulo: "Contacto", icono: "mail", grupo: "Acción", bajada: "Escribinos y sumate" },
];

  export const NAV_VISIBLE: ItemNav[] = NAV.filter((n) => n.visible !== false);
