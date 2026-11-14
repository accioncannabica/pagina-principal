"""Build only aggregate justice data from public Argentine sources. No microdata is published."""
import argparse
import collections
import csv
import datetime
import hashlib
import io
import json
import pathlib
import re
import unicodedata
import urllib.request

SNEEP_URL = 'https://datos.jus.gob.ar/dataset/6c03af36-6a1d-4306-b2a8-dd39ad73afb3/resource/2fc756fc-e531-4562-8343-91f810b9fa1b/download/sneep-2024.csv'
SNEEP_PAGE = 'https://datos.jus.gob.ar/dataset/sneep'
GBA_PAGE = 'https://catalogo.datos.gba.gob.ar/dataset/unidades-penitenciarias'
GEO_BASE = 'https://apis.datos.gob.ar/georef/api/v2.0/'


def normal(value):
    return ''.join(c for c in unicodedata.normalize('NFKD', value).casefold() if not unicodedata.combining(c)).strip()


def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'AccionCannabica-OpenData/1.0 (accioncannabica@gmail.com)'})
    with urllib.request.urlopen(req, timeout=120) as response:
        return response.read()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', help='Previously downloaded official SNEEP CSV, for reproducible local verification')
    parser.add_argument('--cache-dir', help='Previously downloaded public geography resources')
    args = parser.parse_args()
    cache = pathlib.Path(args.cache_dir) if args.cache_dir else None

    def resource(filename, url):
        path = cache / filename if cache else None
        return path.read_bytes() if path and path.exists() else fetch(url)

    raw = pathlib.Path(args.input).read_bytes() if args.input else fetch(SNEEP_URL)
    provinces = json.loads(resource('georef-prov.json', GEO_BASE + 'provincias?campos=id,nombre,centroide&max=100'))['provincias']
    municipalities = json.loads(resource('georef-muni.json', GEO_BASE + 'municipios?provincia=06&campos=id,nombre,centroide&max=200'))['municipios']
    registry = json.loads(resource('gba-prisons.json', 'https://catalogo.datos.gba.gob.ar/api/3/action/package_show?id=unidades-penitenciarias'))
    registry_url = next(r['url'] for r in registry['result']['resources'] if r['format'].upper() == 'CSV')
    registry_date = re.search(r'-(\d{2})(\d{4})\.csv', registry_url)
    registry_period = f'{registry_date[1]}/{registry_date[2]}' if registry_date else 'edición indicada en la URL'
    registry_text = resource('gba-prisons.csv', registry_url).decode('utf-8-sig')
    dialect = csv.Sniffer().sniff(registry_text[:3000])
    prison_numbers = collections.defaultdict(list)
    for row in csv.DictReader(io.StringIO(registry_text), dialect=dialect):
        match = re.search(r'n[\u00ba\u00b0o]?\s*(\d+)', normal(row['nombre']))
        if match:
            prison_numbers[int(match[1])].append(row)
    province_by_name = {normal(p['nombre']): p for p in provinces}
    province_by_name['ciudad de buenos aires'] = next(p for p in provinces if p['id'] == '02')
    province_by_name['tierra del fuego'] = next(p for p in provinces if p['id'] == '94')
    # Use the provincial capital as a disclosed representative point, not Antarctica's centroid.
    tierra = province_by_name['tierra del fuego']
    if tierra['centroide']['lat'] < -60:
        capital = json.loads(resource('georef-ushuaia.json', GEO_BASE + 'localidades?provincia=94&nombre=Ushuaia&campos=id,nombre,centroide&max=10'))
        tierra['centroide'] = next(x['centroide'] for x in capital['localidades'] if normal(x['nombre']) == 'ushuaia')
    municipality_by_name = {normal(m['nombre']): m for m in municipalities}
    province_totals = collections.defaultdict(collections.Counter)
    municipal_totals = collections.defaultdict(collections.Counter)
    matched_facilities = set()
    unmapped_facilities = collections.Counter()
    years = set()
    raw_count = 0
    primary_count = 0

    for row in csv.DictReader(io.StringIO(raw.decode('utf-8-sig'))):
        raw_count += 1
        years.add(int(row['censo_anio']))
        # Count a person once even when code 24 occurs in multiple offence columns.
        if not any(row.get(f'delito{i}_id') == '24' for i in range(1, 6)):
            continue
        p = province_by_name.get(normal(row['provincia_descripcion']))
        if not p:
            raise ValueError('Province without official centroid: ' + row['provincia_descripcion'])
        values = {'imprisoned': 1, 'prosecuted': int(row['situacion_legal_id'] == '2'), 'sentenced': int(row['situacion_legal_id'] == '1')}
        province_totals[p['id']].update(values)
        primary_count += int(row['delito1_id'] == '24')
        if row['provincia_descripcion'] == 'Buenos Aires' and row['reparticion_descripcion'] == 'Provincial':
            number = re.match(r'^unidad\s+(\d+)', normal(row['establecimiento_descripcion']))
            matches = prison_numbers[int(number[1])] if number else []
            m = municipality_by_name.get(normal(matches[0]['municipio_nombre'])) if len(matches) == 1 else None
            if m:
                municipal_totals[m['id']].update(values)
                matched_facilities.add(row['establecimiento_id'])
            else:
                unmapped_facilities[row['establecimiento_descripcion']] += 1

    if len(years) != 1 or raw_count < 1000 or len(province_totals) != 24:
        raise ValueError('Unexpected census structure. Retaining the last valid snapshot.')
    year = next(iter(years))
    records = []
    base = dict(iso='ARG', year=year, arrests=None, cases=None, scope='all-drugs', unit='people',
                seriesId='arg-sneep', seriesName='SNEEP / Ley 23.737', period=f'31/12/{year}',
                timeBasis='stock', geographyBasis='custody-location', sourceUrl=SNEEP_URL,
                sourceName=f'Ministerio de Justicia / SNEEP {year}',
                geographySourceUrl=GEO_BASE + 'provincias.json')
    note = ('Censo de personas alojadas en unidades penitenciarias. Selección: código de delito 24 en cualquiera '
            'de las cinco posiciones, una sola vez por registro. Incluye todas las drogas, NO solo cannabis. '
            'Procesadas es el subconjunto con situación legal Procesado/a (código 2) dentro de la población presa; '
            'NO el total de personas procesadas en libertad. Ubicación de la cárcel, no del hecho ni del domicilio. '
            'No incluye todo el universo de arrestos domiciliarios o detenciones en comisarías.')
    totals = collections.Counter()
    for values in province_totals.values():
        totals.update(values)
    records.append(dict(base, id=f'arg-sneep-{year}-national', province='', municipality='', level='country',
                        lat=-38.4, lon=-63.6, note=note, **totals))
    for p in provinces:
        values = province_totals[p['id']]
        records.append(dict(base, id=f'arg-sneep-{year}-province-{p["id"]}', province=p['nombre'], municipality='',
                            level='province', lat=p['centroide']['lat'], lon=p['centroide']['lon'],
                            note=note + (' Punto representativo provincial: Ushuaia (GeoRef), no el centroide antártico.' if p['id'] == '94' else ''), **values))
    published_municipalities = 0
    mapped_people = sum(v['imprisoned'] for v in municipal_totals.values())
    for m in municipalities:
        values = municipal_totals.get(m['id'])
        if not values or values['imprisoned'] < 5:
            continue
        published_municipalities += 1
        records.append(dict(base, id=f'arg-sneep-{year}-municipality-{m["id"]}', province='Buenos Aires',
                            municipality=m['nombre'], level='municipality', lat=m['centroide']['lat'], lon=m['centroide']['lon'],
                            imprisoned=values['imprisoned'], prosecuted=values['prosecuted'] if values['prosecuted'] >= 5 else None,
                            sentenced=values['sentenced'] if values['sentenced'] >= 5 else None,
                            geographySourceUrl=GBA_PAGE,
                            note=note + ' Detalle municipal PARCIAL: solo unidades provinciales con número coincidente único '
                            f'en el registro georreferenciado PBA (edición {registry_period}) y municipio normalizado por GeoRef/IGN. '
                            'Se excluyen unidades federales, unidades no emparejadas y celdas menores a 5. No es un censo completo municipal.'))
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    snapshot = dict(retrievedAt=now, censusYear=year, rawRows=raw_count, selectedPeople=totals['imprisoned'],
                    processedInCustody=totals['prosecuted'], sentencedInCustody=totals['sentenced'],
                    primaryOffencePeople=primary_count, provinceCount=len(province_totals),
                    municipalMappedPeople=mapped_people, municipalityCount=published_municipalities,
                    matchedFacilities=len(matched_facilities), unmatchedProvincialPeople=sum(unmapped_facilities.values()),
                    sourceSha256=hashlib.sha256(raw).hexdigest(), sourceUrl=SNEEP_URL, catalogUrl=SNEEP_PAGE,
                    registryUrl=registry_url, registryPeriod=registry_period, records=records)
    content = json.dumps(snapshot, ensure_ascii=False, indent=2) + '\n'
    for target in ['public/data/arg-justice-snapshot.json', 'src/observatorio/data/snapshots/arg-justice.json']:
        path = pathlib.Path(target)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content)
    print(json.dumps({k: v for k, v in snapshot.items() if k != 'records'}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()