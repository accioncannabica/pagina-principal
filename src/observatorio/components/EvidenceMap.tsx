import { useEffect, useRef, useState } from 'react';
import * as L from 'leaflet';
import type { FeatureCollection } from 'geojson';
import type { Country } from '../data/countries';
import { localDataUrl } from '../lib/assets';
import { fmt } from './ui';

export interface MapPoint { id: string; name: string; lat: number; lon: number; value: number; note?: string; color?: string }
export interface CountryValue { iso: string; value: number; note?: string }
function color(value: number, max: number) {
  const t = max ? Math.sqrt(value / max) : 0;
  const a = [21, 55, 58], b = [45, 212, 191];
  return `rgb(${a.map((x, i) => Math.round(x + (b[i] - x) * t)).join(',')})`;
}
class HeatLayer extends L.Layer {
  private canvas = document.createElement('canvas'); private map?: L.Map;
  constructor(private points: MapPoint[], private radius: number) { super(); }
  onAdd(map: L.Map): this { this.map = map; this.canvas.className = 'leaflet-heat-canvas'; map.getPane('overlayPane')?.appendChild(this.canvas); map.on('moveend zoomend resize', this.draw); this.draw(); return this; }
  onRemove(map: L.Map): this { map.off('moveend zoomend resize', this.draw); this.canvas.remove(); return this; }
  private draw = () => { if (!this.map) return; const size = this.map.getSize(); this.canvas.width = size.x; this.canvas.height = size.y; L.DomUtil.setPosition(this.canvas, this.map.containerPointToLayerPoint([0, 0])); const ctx = this.canvas.getContext('2d'); if (!ctx) return; const max = Math.max(1, ...this.points.map(p => p.value)); ctx.clearRect(0, 0, size.x, size.y); ctx.globalCompositeOperation = 'screen'; for (const p of this.points) { const at = this.map.latLngToContainerPoint([p.lat, p.lon]); const g = ctx.createRadialGradient(at.x, at.y, 0, at.x, at.y, this.radius); const opacity = .2 + .65 * Math.sqrt(p.value / max); g.addColorStop(0, `rgba(34,211,238,${opacity})`); g.addColorStop(.38, `rgba(52,211,153,${opacity * .7})`); g.addColorStop(1, 'rgba(15,80,90,0)'); ctx.fillStyle = g; ctx.fillRect(at.x - this.radius, at.y - this.radius, this.radius * 2, this.radius * 2); } };
}

export default function EvidenceMap({ countries, values, points, heat = true, radius = 28, height = 430, label = 'Mapa de evidencia' }: { countries: Country[]; values: CountryValue[]; points: MapPoint[]; heat?: boolean; radius?: number; height?: number; label?: string }) {
  const ref = useRef<HTMLDivElement>(null); const mapRef = useRef<L.Map | null>(null); const [world, setWorld] = useState<FeatureCollection | null>(null); const [tileError, setTileError] = useState(false);
  useEffect(() => { const a = new AbortController(); fetch(localDataUrl('world.geojson'), { signal: a.signal }).then(r => r.json()).then(setWorld).catch(() => {}); return () => a.abort(); }, []);
  useEffect(() => { if (!ref.current) return; const map = L.map(ref.current, { center: [16, -25], zoom: 2, minZoom: 2, maxZoom: 12, scrollWheelZoom: false, worldCopyJump: true }); mapRef.current = map; L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors', className: 'territory-base-tiles' }).on('tileerror', () => setTileError(true)).addTo(map); map.attributionControl.setPrefix('Leaflet · Natural Earth'); const ro = new ResizeObserver(() => map.invalidateSize()); ro.observe(ref.current); return () => { ro.disconnect(); map.remove(); mapRef.current = null; }; }, []);
  useEffect(() => { const map = mapRef.current; if (!map) return; const layer = L.layerGroup().addTo(map); const normalized = values.map(v => ({ ...v, iso: countries.find(c => c.iso === v.iso || c.iso2 === v.iso)?.iso || v.iso })); const max = Math.max(1, ...normalized.map(v => v.value), ...points.map(v => v.value)); if (world) L.geoJSON(world, { style: f => { const v = normalized.find(x => x.iso === f?.properties?.ADM0_A3); return { weight: .6, color: '#4b5e68', fillColor: v ? color(v.value, max) : '#17242d', fillOpacity: v ? .78 : .38 }; }, onEachFeature: (f, p) => { const v = normalized.find(x => x.iso === f.properties?.ADM0_A3); const node = document.createElement('span'); node.textContent = `${f.properties?.NAME_ES || f.properties?.NAME}: ${v ? `${fmt(v.value)} · ${v.note || 'registros'}` : 'sin datos en la selección'}`; p.bindTooltip(node); } }).addTo(layer); if (heat && points.length) new HeatLayer(points, radius).addTo(layer); for (const p of points) { const marker = L.circleMarker([p.lat, p.lon], { radius: 4 + 13 * Math.sqrt(p.value / max), weight: 1, color: '#d5fff5', fillColor: p.color || '#34d399', fillOpacity: .78 }); const node = document.createElement('span'); node.textContent = `${p.name}: ${fmt(p.value)}${p.note ? ` · ${p.note}` : ''}`; marker.bindTooltip(node).addTo(layer); } return () => { layer.remove(); }; }, [world, countries, values, points, heat, radius]);
  return <div><div ref={ref} className="territory-map" style={{ height }} role="region" aria-label={label} />{tileError && <p className="mt-2 text-[10px] text-amber-200/70">Mapa base no disponible; los polígonos, puntos y datos locales siguen visibles.</p>}</div>;
}