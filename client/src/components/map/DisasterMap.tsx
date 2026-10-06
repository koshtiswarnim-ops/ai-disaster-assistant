// DisasterOS Interactive Emergency Operations Map
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useDisaster } from '../../context/DisasterContext';
import { Incident, Hospital, Shelter, RescueTeam, Warehouse, RoadHazard } from '../../types';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { Filter, Eye, Navigation, AlertOctagon } from 'lucide-react';

// Custom SVG Leaflet Markers
const createIcon = (bg: string, emoji: string, ring = 'ring-white') => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="background-color: ${bg};" class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md ring-2 ${ring} cursor-pointer transition-transform hover:scale-110">
      ${emoji}
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
};

const icons = {
  critical: createIcon('#e11d48', '⚠️', 'ring-rose-300'),
  high: createIcon('#f59e0b', '⚡', 'ring-amber-300'),
  medium: createIcon('#2563eb', '🚨', 'ring-blue-300'),
  resolved: createIcon('#10b981', '✓', 'ring-emerald-300'),
  team: createIcon('#0284c7', '🚒', 'ring-sky-300'),
  hospital: createIcon('#dc2626', '🏥', 'ring-red-300'),
  shelter: createIcon('#059669', '🏕️', 'ring-emerald-300'),
  warehouse: createIcon('#475569', '🏭', 'ring-slate-300'),
  hazard: createIcon('#991b1b', '⛔', 'ring-red-400')
};

interface DisasterMapProps {
  height?: string;
  selectedIncident?: Incident | null;
  onSelectIncident?: (incident: Incident) => void;
  activeRoutePolyline?: [number, number][];
}

export const DisasterMap: React.FC<DisasterMapProps> = ({
  height = '560px',
  selectedIncident,
  onSelectIncident,
  activeRoutePolyline
}) => {
  const { incidents, hospitals, shelters, rescueTeams, warehouses, hazards, disaster } = useDisaster();

  const [layers, setLayers] = useState({
    incidents: true,
    teams: true,
    hospitals: true,
    shelters: true,
    warehouses: true,
    hazards: true,
    zones: true
  });

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const center: [number, number] = [37.7749, -122.4194];

  // Flood zone polygon coordinates
  const floodZoneA: [number, number][] = [
    [37.795, -122.435],
    [37.808, -122.410],
    [37.798, -122.390],
    [37.780, -122.420]
  ];

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
      
      {/* Top Filter Bar Overlay */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 shadow-sm p-1.5 flex flex-wrap items-center gap-1 text-xs">
        <span className="px-2 font-semibold text-slate-500 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          Layers:
        </span>
        <button
          onClick={() => toggleLayer('incidents')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            layers.incidents ? 'bg-blue-50 text-blue-700 border border-blue-200/60' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          Incidents ({incidents.length})
        </button>
        <button
          onClick={() => toggleLayer('teams')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            layers.teams ? 'bg-sky-50 text-sky-700 border border-sky-200/60' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          Responders ({rescueTeams.length})
        </button>
        <button
          onClick={() => toggleLayer('hospitals')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            layers.hospitals ? 'bg-red-50 text-red-700 border border-red-200/60' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          Hospitals ({hospitals.length})
        </button>
        <button
          onClick={() => toggleLayer('shelters')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            layers.shelters ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          Shelters ({shelters.length})
        </button>
        <button
          onClick={() => toggleLayer('hazards')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            layers.hazards ? 'bg-rose-50 text-rose-700 border border-rose-200/60' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          Hazards ({hazards.length})
        </button>
      </div>

      {/* Main Leaflet Map */}
      <div style={{ height }}>
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Active Flood Zone Polygon */}
          {layers.zones && (
            <Polygon
              positions={floodZoneA}
              pathOptions={{
                color: '#2563eb',
                fillColor: '#3b82f6',
                fillOpacity: 0.18,
                weight: 2,
                dashArray: '4, 8'
              }}
            >
              <Popup>
                <div className="p-1">
                  <p className="font-bold text-blue-900 text-xs">Zone A - Marina & Waterfront Inundation Basin</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">Category 3 Storm Surge Risk. Mandatory Evacuation Active.</p>
                </div>
              </Popup>
            </Polygon>
          )}

          {/* Active Emergency Routing Overlay */}
          {activeRoutePolyline && activeRoutePolyline.length > 0 && (
            <Polyline
              positions={activeRoutePolyline}
              pathOptions={{
                color: '#2563eb',
                weight: 5,
                opacity: 0.85
              }}
            />
          )}

          {/* Road Hazards */}
          {layers.hazards && hazards.map(h => (
            <Marker key={h.id} position={[h.latitude, h.longitude]} icon={icons.hazard}>
              <Popup>
                <div className="p-1 text-xs">
                  <span className="font-bold text-rose-700 uppercase tracking-wider text-[10px]">ROAD BLOCKED</span>
                  <h4 className="font-bold text-slate-900 mt-0.5">{h.road_name}</h4>
                  <p className="text-slate-600 mt-1">{h.description || 'Hazard impassable.'}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Incidents Markers */}
          {layers.incidents && incidents.map(inc => {
            let icon = icons.medium;
            if (inc.severity === 'critical') icon = icons.critical;
            else if (inc.severity === 'high') icon = icons.high;
            else if (inc.status === 'resolved') icon = icons.resolved;

            return (
              <Marker
                key={inc.id}
                position={[inc.latitude, inc.longitude]}
                icon={icon}
                eventHandlers={{
                  click: () => onSelectIncident && onSelectIncident(inc)
                }}
              >
                <Popup>
                  <div className="p-1 max-w-xs text-xs space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <PriorityBadge priority={inc.severity} score={inc.priority_score} />
                      <span className="font-mono text-[10px] text-slate-400">#{inc.tracking_code}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{inc.title}</h4>
                    <p className="text-slate-600 line-clamp-2">{inc.description}</p>
                    <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Status: <strong className="text-slate-800">{inc.status}</strong></span>
                      {onSelectIncident && (
                        <button
                          onClick={() => onSelectIncident(inc)}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          View Details &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Rescue Teams */}
          {layers.teams && rescueTeams.map(t => (
            <Marker key={t.id} position={[t.current_lat, t.current_lng]} icon={icons.team}>
              <Popup>
                <div className="p-1 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-sky-700">RESCUE TASKFORCE</span>
                  <h4 className="font-bold text-slate-900">{t.name}</h4>
                  <StatusBadge status={t.status} />
                  <p className="text-slate-500 text-[11px]">Lead: {t.lead_name} · {t.phone}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {t.skills.map(s => (
                      <span key={s} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700">{s}</span>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Hospitals */}
          {layers.hospitals && hospitals.map(h => (
            <Marker key={h.id} position={[h.latitude, h.longitude]} icon={icons.hospital}>
              <Popup>
                <div className="p-1 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-red-600">TRAUMA CENTER</span>
                  <h4 className="font-bold text-slate-900">{h.name}</h4>
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <div>Beds Free: <strong className="text-slate-900">{h.available_beds}</strong> / {h.total_beds}</div>
                    <div>ICU Free: <strong className="text-slate-900">{h.icu_available}</strong> / {h.icu_total}</div>
                  </div>
                  <p className="text-[11px] text-slate-500">Trauma Level: {h.trauma_level} · Helipad: {h.has_helipad ? 'Available' : 'None'}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Shelters */}
          {layers.shelters && shelters.map(s => (
            <Marker key={s.id} position={[s.latitude, s.longitude]} icon={icons.shelter}>
              <Popup>
                <div className="p-1 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-700">EVACUATION REFUGE</span>
                  <h4 className="font-bold text-slate-900">{s.name}</h4>
                  <div className="text-[11px] bg-emerald-50/60 p-1.5 rounded-lg border border-emerald-100 text-emerald-950">
                    Occupancy: <strong>{s.current_occupancy}</strong> / {s.capacity} ({Math.round((s.current_occupancy / s.capacity) * 100)}%)
                  </div>
                  <p className="text-[11px] text-slate-500">Food/Water Reserve: {s.food_supplies_days} days · Pets: {s.pet_friendly ? 'Allowed' : 'No'}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Warehouses */}
          {layers.warehouses && warehouses.map(w => (
            <Marker key={w.id} position={[w.latitude, w.longitude]} icon={icons.warehouse}>
              <Popup>
                <div className="p-1 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-600">SUPPLY DEPOT</span>
                  <h4 className="font-bold text-slate-900">{w.name}</h4>
                  <p className="text-slate-500">{w.address}</p>
                  <p className="text-[11px] text-slate-600">Contact: {w.contact_person} ({w.phone})</p>
                </div>
              </Popup>
            </Marker>
          ))}

        </MapContainer>
      </div>
    </div>
  );
};
