import type { LiteratureSnapshot, LiteratureWork } from '../data/science';
import { OPENALEX_TOPIC } from '../data/science';

const API = 'https://api.openalex.org';
const EMAIL = 'accioncannabica@gmail.com';
const pickId = (v: string) => v.split('/').pop() || v;
export function openAlexUrls(through: string) {
  const filter = `topics.id:${OPENALEX_TOPIC.id},from_publication_date:${OPENALEX_TOPIC.from},to_publication_date:${through},is_retracted:false`;
  const common = `filter=${encodeURIComponent(filter)}&mailto=${encodeURIComponent(EMAIL)}`;
  return {
    works: `${API}/works?${common}&sort=cited_by_count:desc&per-page=100&select=id,title,publication_year,publication_date,cited_by_count,doi,open_access,type,authorships,primary_location`,
    countries: `${API}/works?${common}&group_by=authorships.institutions.country_code`,
    years: `${API}/works?${common}&group_by=publication_year`,
    institutions: `${API}/works?${common}&group_by=authorships.institutions.id`,
  };
}
async function json(url: string, signal?: AbortSignal) {
  const response = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`OpenAlex HTTP ${response.status}`);
  return response.json();
}
export async function loadOpenAlex(signal?: AbortSignal): Promise<LiteratureSnapshot> {
  const through = new Date().toISOString().slice(0, 10);
  const urls = openAlexUrls(through);
  const [works, countries, years, institutionGroups] = await Promise.all([json(urls.works, signal), json(urls.countries, signal), json(urls.years, signal), json(urls.institutions, signal)]);
  const groups = (institutionGroups.group_by || []).slice(0, 60);
  const ids = groups.map((g: any) => pickId(g.key)).join('|');
  const institutionsUrl = `${API}/institutions?filter=${encodeURIComponent(`openalex:${ids}`)}&per-page=100&select=id,display_name,country_code,geo&mailto=${encodeURIComponent(EMAIL)}`;
  const institutions = ids ? await json(institutionsUrl, signal) : { results: [] };
  const countByInstitution = new Map(groups.map((g: any) => [pickId(g.key), Number(g.count)]));
  const mappedWorks: LiteratureWork[] = (works.results || []).map((work: any) => ({
    id: pickId(work.id), title: work.title || 'Sin título', year: Number(work.publication_year), publicationDate: work.publication_date || null,
    citations: Number(work.cited_by_count || 0), doi: work.doi || null, openAccess: Boolean(work.open_access?.is_oa),
    openAccessUrl: work.open_access?.oa_url || null, type: work.type || 'other', source: work.primary_location?.source?.display_name || 'Fuente no informada',
    authors: (work.authorships || []).slice(0, 8).map((a: any) => a.author?.display_name).filter(Boolean),
    institutions: [...new Set((work.authorships || []).flatMap((a: any) => a.institutions || []).map((i: any) => i.display_name).filter(Boolean))] as string[],
    countries: [...new Set((work.authorships || []).flatMap((a: any) => a.institutions || []).map((i: any) => i.country_code).filter(Boolean))] as string[],
  })).filter((w: LiteratureWork) => w.year >= 2020 && w.year <= Number(through.slice(0, 4)));
  const snapshot: LiteratureSnapshot = {
    retrievedAt: new Date().toISOString(), sourceUpdatedAt: null, topicId: OPENALEX_TOPIC.id, topicName: OPENALEX_TOPIC.name,
    fromDate: OPENALEX_TOPIC.from, throughDate: through, totalWorks: Number(works.meta?.count || 0), works: mappedWorks,
    countryCounts: (countries.group_by || []).map((g: any) => ({ code: pickId(g.key), name: g.key_display_name, count: Number(g.count) })).filter((g: any) => /^[A-Z]{2}$/.test(g.code)),
    yearCounts: (years.group_by || []).map((g: any) => ({ year: Number(g.key), count: Number(g.count) })).filter((g: any) => g.year >= 2020 && g.year <= Number(through.slice(0, 4))).sort((a: any, b: any) => a.year - b.year),
    institutions: (institutions.results || []).flatMap((i: any) => Number.isFinite(i.geo?.latitude) && Number.isFinite(i.geo?.longitude) ? [{ id: pickId(i.id), name: i.display_name, countryCode: i.country_code || '', city: i.geo.city || '', lat: i.geo.latitude, lon: i.geo.longitude, works: countByInstitution.get(pickId(i.id)) || 0 }] : []).sort((a: any, b: any) => b.works - a.works),
    queries: [...Object.values(urls), institutionsUrl],
  };
  if (!snapshot.totalWorks || snapshot.works.length < 10 || snapshot.countryCounts.length < 5) throw new Error('Respuesta bibliográfica incompleta.');
  return snapshot;
}