import { mkdir, writeFile } from 'node:fs/promises';
import { loadNyc } from '../../src/observatorio/lib/nyc';

// Only aggregated records are stored; no arrest identifiers or personal data.
const snapshot = await loadNyc();
await mkdir('public/data', { recursive: true });
await mkdir('src/observatorio/data/snapshots', { recursive: true });
await writeFile('public/data/nyc-snapshot.json', `${JSON.stringify(snapshot, null, 2)}\n`);
await writeFile('src/observatorio/data/snapshots/nyc.json', `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`NYC: ${snapshot.records.length} territorial aggregates, ${snapshot.points.length} protected centroids, through ${snapshot.through}.`);