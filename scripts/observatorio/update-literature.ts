import { mkdir, writeFile } from 'node:fs/promises';
import { loadOpenAlex } from '../../src/observatorio/lib/openAlex';

const snapshot = await loadOpenAlex();
await mkdir('public/data', { recursive: true });
await mkdir('src/observatorio/data/snapshots', { recursive: true });
const content = `${JSON.stringify(snapshot, null, 2)}\n`;
await Promise.all([writeFile('public/data/literature-snapshot.json', content), writeFile('src/observatorio/data/snapshots/literature.json', content)]);
console.log(`OpenAlex: ${snapshot.totalWorks} trabajos; muestra ${snapshot.works.length}; ${snapshot.institutions.length} instituciones.`);