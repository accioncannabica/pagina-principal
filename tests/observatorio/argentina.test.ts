import { test } from 'node:test';
import assert from 'node:assert/strict';
import argentina from '../../src/observatorio/data/snapshots/arg-justice.json';
import { COUNTRIES } from '../../src/observatorio/data/countries';
import { JUSTICE_COSTS, type TerritoryRecord } from '../../src/observatorio/data/research';
import { ADDITIONAL_JUSTICE_COSTS, ARGENTINA_RESEARCH_TERRITORY, costKey } from '../../src/observatorio/data/justiceEvidence';
import { aggregateTerritory } from '../../src/observatorio/lib/territory';
import { validateArgentinaSnapshot, validateFeed } from '../../src/observatorio/lib/openData';

const records = argentina.records as TerritoryRecord[];

test('SNEEP: selección reproducible por cualquier delito 24, no solo el principal', () => {
  const snapshot = validateArgentinaSnapshot(argentina);
  assert.equal(snapshot.rawRows, 120700);
  assert.equal(snapshot.selectedPeople, 14814);
  assert.equal(snapshot.primaryOffencePeople, 14180);
  assert.equal(snapshot.processedInCustody, 7399);
  assert.equal(snapshot.sentencedInCustody, 7346);
  assert.equal(snapshot.provinceCount, 24);
  assert.ok(snapshot.records.every(r => r.scope === 'all-drugs' && r.arrests === null));
});
test('un total padre reemplaza a sus hijos sin sumar país, provincias y municipios', () => {
  const national = aggregateTerritory(records, 'imprisoned', 'country', COUNTRIES);
  const provinces = aggregateTerritory(records, 'imprisoned', 'province', COUNTRIES);
  const municipalities = aggregateTerritory(records, 'imprisoned', 'municipality', COUNTRIES);
  assert.equal(national.length, 1); assert.equal(national[0].value, 14814);
  assert.equal(provinces.length, 24); assert.equal(provinces.reduce((s, r) => s + r.value, 0), 14814);
  assert.equal(municipalities.length, 21); assert.equal(municipalities.reduce((s, r) => s + r.value, 0), 4392);
  assert.equal(aggregateTerritory(records, 'prosecuted', 'country', COUNTRIES)[0].value, 7399);
});
test('no oculta ni suma otros universos con un total SNEEP', () => {
  const other: TerritoryRecord = { ...records[0], id: 'test-other-universe', seriesId: 'other', imprisoned: 7 };
  const nextYear: TerritoryRecord = { ...records[0], id: 'test-next-year', year: 2025, imprisoned: 11 };
  const result = aggregateTerritory([...records, other, nextYear], 'imprisoned', 'country', COUNTRIES);
  assert.equal(result.length, 3);
  assert.deepEqual(result.map(r => r.value).sort((a, b) => a - b), [7, 11, 14814]);
});
test('el cruce municipal es parcial, protege celdas y no publica establecimientos o personas individuales', () => {
  assert.equal(argentina.municipalMappedPeople, 4392);
  assert.equal(argentina.matchedFacilities, 47);
  const rows = records.filter(r => r.level === 'municipality');
  assert.ok(rows.every(r => (r.imprisoned ?? 0) >= 5));
  assert.ok(rows.every(r => r.prosecuted === null || (r.prosecuted ?? 0) >= 5));
  assert.ok(!JSON.stringify(argentina).includes('fecha_detencion'));
  assert.ok(!JSON.stringify(argentina).includes('establecimiento_descripcion'));
  const corrupted = structuredClone(argentina); corrupted.records[0].imprisoned = 1;
  assert.throws(() => validateArgentinaSnapshot(corrupted));
});
test('la muestra de cannabis tiene 42 causas y no se transforma en 59 procesados', () => {
  const rows = ARGENTINA_RESEARCH_TERRITORY.filter(r => r.seriesId === 'arg-cannabis-sample');
  assert.equal(rows.length, 12);
  assert.ok(rows.every(r => r.unit === 'cases' && r.timeBasis === 'sample'));
  assert.equal(aggregateTerritory(rows, 'cases', 'country', COUNTRIES)[0].value, 42);
  assert.equal(aggregateTerritory(rows, 'prosecuted', 'country', COUNTRIES).length, 0);
});
test('las referencias económicas conservan identificadores, tipos y subconjuntos', () => {
  const rows = [...JUSTICE_COSTS, ...ADDITIONAL_JUSTICE_COSTS];
  validateFeed({ schemaVersion: 1, publishedAt: '2026-10-30', costs: rows });
  assert.equal(new Set(rows.map(costKey)).size, rows.length);
  assert.equal(new Set(rows.map(r => r.iso)).size, 7);
  assert.equal(rows.find(r => r.id === 'arg-reset-users-2018')?.totalMillions, 34.4);
  assert.equal(rows.find(r => r.id === 'arg-reset-users-2018')?.originalMillions, 971);
  assert.equal(rows.find(r => r.iso === 'DEU')?.evidenceType, 'scenario');
  assert.ok(rows.filter(r => r.iso === 'BRA').every(r => r.territory?.includes('NO es el total de Brasil')));
});
test('todos los nuevos territorios cumplen el contrato y no convierten sentencias o causas en stock de presos', () => {
  validateFeed({ schemaVersion: 1, publishedAt: '2026-10-30', territory: [...records, ...ARGENTINA_RESEARCH_TERRITORY] });
  const ussc = ARGENTINA_RESEARCH_TERRITORY.find(r => r.seriesId === 'usa-ussc')!;
  assert.equal(ussc.sentenced, 471); assert.equal(ussc.imprisoned, null); assert.equal(ussc.arrests, null);
  const abs = ARGENTINA_RESEARCH_TERRITORY.find(r => r.seriesId === 'aus-abs-courts')!;
  assert.equal(abs.cases, 31383); assert.equal(abs.unit, 'cases'); assert.equal(abs.prosecuted, null);
});