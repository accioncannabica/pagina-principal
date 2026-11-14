import { test } from 'node:test';
import assert from 'node:assert/strict';
import snapshot from '../../src/observatorio/data/snapshots/literature.json';
import { SCIENCE_EVENTS } from '../../src/observatorio/data/science';
import { validateLiterature } from '../../src/observatorio/lib/literature';
import { openAlexUrls } from '../../src/observatorio/lib/openAlex';
import { validateFeed } from '../../src/observatorio/lib/openData';

test('instantánea OpenAlex mantiene tópico, período y límites de muestra', () => {
  const data = validateLiterature(snapshot);
  assert.equal(data.topicId, 'T10414');
  assert.equal(data.fromDate, '2020-01-01');
  assert.ok(data.totalWorks > data.works.length);
  assert.ok(data.works.length <= 100);
  assert.ok(data.institutions.length <= 100);
  assert.ok(data.yearCounts.every(y => y.year >= 2020 && y.year <= Number(data.throughDate.slice(0, 4))));
});
test('consultas excluyen retractados y preservan mailto y tópico', () => {
  const urls = openAlexUrls('2026-10-30');
  for (const url of Object.values(urls)) {
    const decoded = decodeURIComponent(url);
    assert.match(decoded, /topics\.id:T10414/);
    assert.match(decoded, /is_retracted:false/);
    assert.match(decoded, /mailto=accioncannabica/);
  }
});
test('congresos científicos tienen fuentes y coordenadas públicas válidas', () => {
  validateFeed({ schemaVersion: 1, publishedAt: '2026-10-30', events: SCIENCE_EVENTS });
  assert.ok(SCIENCE_EVENTS.length >= 10);
  assert.ok(SCIENCE_EVENTS.some(e => e.iso === 'ARG' && e.focus === 'Salud'));
  assert.ok(SCIENCE_EVENTS.some(e => e.iso === 'USA' && e.kind === 'Simposio'));
  assert.ok(SCIENCE_EVENTS.every(e => typeof e.lat === 'number' && typeof e.lon === 'number'));
});
test('instituciones y países usan definiciones diferentes sin sumarse', () => {
  const data = validateLiterature(snapshot);
  assert.ok(data.countryCounts[0].count > data.institutions[0].works);
  assert.ok(data.institutions.every(i => i.works > 0 && Math.abs(i.lat) <= 90 && Math.abs(i.lon) <= 180));
  assert.ok(data.works.every(w => w.citations >= 0 && w.authors.length <= 8));
});