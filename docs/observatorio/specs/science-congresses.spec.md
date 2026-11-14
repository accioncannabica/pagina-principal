# Especificación: Congresos, investigación y mapas de evidencia

Estado: implementado. Revisión: 2026-10-30.

## Objetivo

Incorporar congresos nacionales e internacionales sobre cannabis, cannabis y
salud e investigación publicada, manteniendo el observatorio anterior y la
trazabilidad de cada registro.

## Historias verificables

1. Una persona puede filtrar congresos por país, tipo, enfoque y edición.
2. Un congreso tiene fuente, período, modalidad, sede y coordenada o un nulo
   explícito. El mapa no inventa sedes.
3. El mapa cultural usa gradiente por cantidad de registros incorporados y calor
   por sedes, con peso 1 por edición. No representa asistencia.
4. Una persona puede explorar publicaciones 2020–fecha de corte por año, país de
   afiliación y acceso abierto.
5. El total bibliográfico y las agrupaciones provienen del tópico OpenAlex T10414;
   la lista es una muestra máxima de 100 trabajos ordenados por citas.
6. El mapa bibliográfico usa gradiente nacional por publicaciones y calor por las
   60 instituciones más frecuentes. “Citas” se calcula solo en la muestra visible.
7. Un trabajo con coautorías internacionales puede contar en más de un país.
8. No se presenta bibliometría como eficacia clínica ni como revisión sistemática.
9. Si OpenAlex falla, se mantiene la última instantánea válida y se informa el error.

## Fuentes

- OpenAlex, tópico T10414 “Cannabis and Cannabinoid Research”.
- UNAJ, UNR, CONICET/RACME, UNCo, ICRS, RSMj, CMCR, CCORC, MCC y
  Med-Cannabis, mediante sus páginas institucionales o de organización.

## Privacidad y seguridad

- Solo metadatos bibliográficos públicos; no se descarga texto completo.
- URL externas HTTPS y apertura con `noopener noreferrer`.
- No se publican correos de autores, perfiles privados o asistentes a congresos.
- Los mapas muestran instituciones o sedes, nunca domicilios personales.

## Criterios de aceptación

- `scripts/update-literature.ts` genera dos instantáneas equivalentes.
- El harness rechaza retractados, años fuera de rango, coordenadas imposibles y
  muestras de más de 100 trabajos.
- Las vistas anteriores siguen disponibles.
- Las pruebas unitarias, navegador, TypeScript y build deben finalizar sin error.