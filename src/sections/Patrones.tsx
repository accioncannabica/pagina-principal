import { useEffect, useState } from "react";

import { PatronesPage, type SectionId } from "../investigaciones/patrones/PatronesPage";

const DEFAULT_SECTION: SectionId = "resumen";

const isSection = (value: string | undefined): value is SectionId =>
  value ? (["resumen", "harness", "specs", "skills", "encuesta", "eda", "avanzado", "presentacion", "conclusiones", "codigo", "referencias", "contacto"] as const).includes(value as SectionId) : false;

const readHashSection = (): SectionId => {
  if (typeof window === "undefined") {
    return DEFAULT_SECTION;
  }
  const [vista, subvista] = window.location.hash.replace(/^#/, "").split("/");
  if (vista === "patrones" && isSection(subvista)) {
    return subvista;
  }
  return DEFAULT_SECTION;
};

export default function Patrones() {
  const [section, setSection] = useState<SectionId>(() => readHashSection());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const handleHash = () => {
      const next = readHashSection();
      setSection(next);
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  return (
    <div className="space-y-6">
      <PatronesPage initialSection={section} onSectionChange={setSection} />
    </div>
  );
}
