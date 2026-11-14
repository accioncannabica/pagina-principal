import harness from '../../docs/observatorio/harness/science-evidence.harness.json';
import snapshot from '../../src/observatorio/data/snapshots/literature.json';
import { SCIENCE_EVENTS } from '../../src/observatorio/data/science';
import { validateLiterature } from '../../src/observatorio/lib/literature';
import { validateFeed } from '../../src/observatorio/lib/openData';

const data = validateLiterature(snapshot);
validateFeed({ schemaVersion: 1, publishedAt: data.retrievedAt, events: SCIENCE_EVENTS });
if (data.topicId !== harness.topic.id) throw new Error('El tópico no coincide con el harness.');
if (data.works.length > harness.literature.maxSampleWorks) throw new Error('La muestra excede el límite.');
if (data.institutions.length > harness.literature.maxMappedInstitutions) throw new Error('Demasiadas instituciones mapeadas.');
if (data.works.some(work => work.year < harness.literature.fromYear)) throw new Error('Año fuera del contrato.');
const scientific = new Set(harness.events.scientificKinds);
if (!SCIENCE_EVENTS.every(event => scientific.has(event.kind))) throw new Error('El catálogo científico contiene un tipo no previsto.');
console.log(`Harness válido: ${data.totalWorks} trabajos, muestra ${data.works.length}, ${SCIENCE_EVENTS.length} congresos/simposios.`);