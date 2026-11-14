# Observatorio Global de Cannabis: documentación de desarrollo

Estos documentos provienen del proyecto independiente `global-cannabis-usage-dashboard`, que se fusionó en este repositorio ([PLAN-002](../../plan/PLAN-002-incorporar-observatorio-global-cannabis.md)). Se conservan sin cambios de contenido, por lo que citan las rutas del proyecto original. Equivalencias en este repositorio:

| Ruta citada en los documentos | Ruta en este repositorio |
|---|---|
| `src/data/…`, `src/lib/…`, `src/components/…` | `src/observatorio/data/…`, `src/observatorio/lib/…`, `src/observatorio/components/…` |
| `src/data/snapshots/*.json` | `src/observatorio/data/snapshots/*.json` |
| `public/data/*` | `public/data/*` (sin cambios) |
| `scripts/<script>` | `scripts/observatorio/<script>` |
| `tests/*.test.ts` | `tests/observatorio/*.test.ts` |
| `specs/`, `skills/`, `harness/`, `mockups/` | `docs/observatorio/specs/`, `skills/`, `harness/`, `mockups/` |
| `npx tsx scripts/update-open-data.ts` | `npm run observatorio:update-data` |
| `npx tsx scripts/update-literature.ts` | `npm run observatorio:update-literature` |
| `npx tsx scripts/validate-science-harness.ts` | `npm run observatorio:validate-science` |
| `npx tsx --test tests/*.test.ts` | `npm run test:observatorio` |
| `python3 scripts/update-argentina-data.py` | `python3 scripts/observatorio/update-argentina-data.py` (desde la raíz del repositorio) |

Notas:
- La pestaña activa del observatorio se guarda en la URL como `#observatorio/<pestaña>` (por ejemplo `#observatorio/territorio`).
- `DATOS_ABIERTOS.md` menciona `.github/workflows/open-data.yml` y pruebas de navegador con Playwright. Ninguno de los dos se incorporó a este repositorio.
