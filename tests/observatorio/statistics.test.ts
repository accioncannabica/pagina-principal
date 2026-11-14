import { test } from 'node:test';
import assert from 'node:assert/strict';
import { correlation, describe, histogram, quantile } from '../../src/observatorio/lib/eda';
import { publicUrl, validateFeed } from '../../src/observatorio/lib/openData';
import { nycQuery } from '../../src/observatorio/lib/nyc';
import snapshot from '../../public/data/nyc-snapshot.json';
import { CONTEXT_TERRITORY } from '../../src/observatorio/data/research';
import { CULTURAL_EVENTS } from '../../src/observatorio/data/research';
import { dateLabel } from '../../src/observatorio/components/ResearchUI';
import { eventStatus } from '../../src/observatorio/lib/culture';

test('EDA omite nulos sin convertirlos en ceros y usa desviación muestral', () => {
  const s = describe([{ x: 1 }, { x: 2 }, { x: 3 }, { x: null }, { x: '' }], 'x');
  assert.equal(s.n, 3); assert.equal(s.missing, 2); assert.equal(s.mean, 2);
  assert.equal(s.median, 2); assert.equal(s.sd, 1); assert.equal(s.q1, 1.5);
});
test('cuartiles, atípicos e histogramas', () => {
  assert.equal(quantile([1, 2, 3, 4], 0.25), 1.75);
  assert.equal(quantile([], 0.5), null);
  const rows = [1, 2, 3, 4, 100].map(x => ({ x }));
  assert.equal(describe(rows, 'x').outliers, 1);
  const h = histogram([1, 1, 2, 4, 100]);
  assert.equal(h.reduce((sum, bin) => sum + bin.count, 0), 5);
  assert.equal(histogram([7, 7, 7])[0].count, 3);
  assert.equal(histogram([]).length, 0);
});
test('correlación por pares completos y varianza nula', () => {
  const p = correlation([{ x: 1, y: 2 }, { x: 2, y: 4 }, { x: null, y: 6 }], 'x', 'y');
  assert.equal(p.r, 1); assert.equal(p.n, 2);
  assert.equal(correlation([{ x: 2, y: 1 }, { x: 2, y: 8 }], 'x', 'y').r, null);
  assert.equal(correlation([], 'x', 'y').r, null);
});
test('catálogo válido y actualizaciones trazables', () => {
  const base = { schemaVersion: 1, publishedAt: '2026-10-30T00:00:00Z' };
  assert.deepEqual(validateFeed(base).countryUpdates, []);
  const feed = validateFeed({ ...base, countryUpdates: [{ iso: 'ARG', sourceUrl: 'https://example.org/data', period: '2025', values: { prevalence: 5.5 } }], territory: CONTEXT_TERRITORY });
  assert.equal(feed.countryUpdates[0].values.prevalence, 5.5);
  assert.equal(feed.territory[0].arrests, null);
});
test('rechaza URLs ejecutables, valores inválidos y campos identificables', () => {
  assert.equal(publicUrl('javascript:alert(1)'), false);
  assert.equal(publicUrl('https://user:secret@example.org'), false);
  assert.throws(() => validateFeed({ schemaVersion: 3, publishedAt: '2026-10-30' }));
  assert.throws(() => validateFeed({ schemaVersion: 1, publishedAt: '2026-10-30', countryUpdates: [{ iso: 'ARG', sourceUrl: 'https://example.org', period: '2026', values: { prevalence: 101 } }] }));
  assert.throws(() => validateFeed({ schemaVersion: 1, publishedAt: '2026-10-30', territory: [{ ...CONTEXT_TERRITORY[0], person_name: 'not accepted' }] }));
});
test('instantánea real de NYC no publica microdatos y preserva mínimos de privacidad', () => {
  assert.ok(snapshot.records.length > 0);
  assert.ok(snapshot.points.length > 0);
  assert.ok(snapshot.points.every(p => p.value >= 5));
  assert.ok(snapshot.points.every(p => Math.abs(p.lat * 100 - Math.round(p.lat * 100)) < 1e-8));
  assert.ok(snapshot.records.every(r => r.prosecuted === null && r.imprisoned === null));
  assert.ok(!JSON.stringify(snapshot.records).includes('arrest_key'));
  const query = new URL(nycQuery('heat'));
  assert.equal(query.searchParams.get('$having'), 'count(*) >= 5');
  assert.ok(!query.searchParams.get('$select')?.includes('arrest_key'));
});

test('fechas de agenda conservan el día civil en Argentina', () => {
  assert.match(dateLabel('2026-10-23'), /^23/);
  const event = { ...CULTURAL_EVENTS[0], start: '2026-10-31', end: '2026-10-31' };
  assert.equal(eventStatus(event, new Date(2026, 9, 30, 23, 0)), 'Próxima edición');
});
test('rechaza días inexistentes en eventos del catálogo', () => {
  assert.throws(() => validateFeed({ schemaVersion: 1, publishedAt: '2026-10-30', events: [{ ...CULTURAL_EVENTS[0], start: '2026-02-30', end: '2026-03-02' }] }));
});