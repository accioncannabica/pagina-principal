import { useCallback, useEffect, useState } from 'react';
import type { LiteratureSnapshot } from '../data/science';
import { loadOpenAlex } from './openAlex';
import fallback from '../data/snapshots/literature.json';

export function validateLiterature(value: unknown): LiteratureSnapshot {
  const v = value as LiteratureSnapshot;
  if (!v || v.topicId !== 'T10414' || !Number.isFinite(v.totalWorks) || v.totalWorks <= 0 || !Array.isArray(v.works) || !Array.isArray(v.countryCounts) || !Array.isArray(v.yearCounts) || !Array.isArray(v.institutions)) throw new Error('Instantánea bibliográfica inválida.');
  if (v.works.length > 100 || v.institutions.length > 100 || v.works.some(w => !w.id || !w.title || !Number.isFinite(w.year) || !Number.isFinite(w.citations) || w.citations < 0 || [w.doi, w.openAccessUrl].some(url => url !== null && !/^https?:\/\//.test(url))) || v.institutions.some(i => !Number.isFinite(i.lat) || !Number.isFinite(i.lon) || Math.abs(i.lat) > 90 || Math.abs(i.lon) > 180 || i.works < 0)) throw new Error('Metadatos bibliográficos fuera del contrato.');
  return v;
}
function cache(value: LiteratureSnapshot) { try { localStorage.setItem('ac-literature-v1', JSON.stringify(value)); } catch { /* Optional cache. */ } }
function initial() { try { const v = localStorage.getItem('ac-literature-v1'); return v ? validateLiterature(JSON.parse(v)) : validateLiterature(fallback); } catch { return validateLiterature(fallback); } }

export function useLiterature(active: boolean) {
  const [data, setData] = useState<LiteratureSnapshot>(initial);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  const refresh = useCallback(async () => {
    setSyncing(true);
    const abort = new AbortController();
    try { const next = validateLiterature(await loadOpenAlex(abort.signal)); setData(next); cache(next); setError(''); }
    catch (e) { setError(`OpenAlex no respondió${e instanceof Error && !/failed to fetch/i.test(e.message) ? `: ${e.message}` : ''}. Se conserva la instantánea.`); }
    finally { setSyncing(false); }
  }, []);
  useEffect(() => {
    if (!active) return;
    void refresh();
    const timer = window.setInterval(() => { if (document.visibilityState === 'visible') void refresh(); }, 15 * 60000);
    return () => window.clearInterval(timer);
  }, [active, refresh]);
  return { data, syncing, error, refresh };
}