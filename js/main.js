import { createMap } from './map.js';
import { getBaseMaps } from './basemaps.js';
import { addLayerControl } from './controls.js';
import { createCoordsControl } from './controls.js';
import { getBoreholes, getPipelines } from './api.js';

// ============================
// INIT MAP
// ============================
const map = createMap();

// ============================
// DATA LAYERS (created once)
// ============================
const boreholesLayer = L.geoJSON(null, {
  pointToLayer: (feature, latlng) =>
    L.circleMarker(latlng, {
      radius: 4,
      color: '#2563eb',
      fillOpacity: 0.6
    }),

  onEachFeature: (feature, layer) => {
    layer.bindPopup(`
      <b>${feature.properties.name || "No name"}</b><br>
      Year: ${feature.properties.year || "N/A"}<br>
      Status: ${feature.properties.status || "Unknown"}
    `);
  }

}).addTo(map);

const pipelinesLayer = L.geoJSON(null, {
  style: {
    color: '#db8c8cee',
    weight: 1,
    fillOpacity: 0.6,
  }
}).addTo(map);

// ============================
// BASEMAPS
// ============================
const baseMaps = getBaseMaps();
baseMaps["Esri Light Gray"].addTo(map);

// ============================
// CONTROLS
// ============================
addLayerControl(map, baseMaps);

const coordsControl = createCoordsControl().addTo(map);
map.on('mousemove', (e) => {
  coordsControl.getContainer().innerHTML =
    `Lat: ${e.latlng.lat.toFixed(5)} | Lng: ${e.latlng.lng.toFixed(5)}`;
});
//===========================
//bbox caching
//============================

let lastBBox = null;

function getBBoxKey(map) {
  const b = map.getBounds();
  return [
    b.getWest().toFixed(2),
    b.getSouth().toFixed(2),
    b.getEast().toFixed(2),
    b.getNorth().toFixed(2)
  ].join(',');
}


// ============================
// DATA FETCH
// ============================
let requestId = 0;
async function updateData() {
  const id = ++requestId;

  const zoom = map.getZoom();
  const bboxKey = getBBoxKey(map);
  if (bboxKey === lastBBox) {
    console.log("⏸️ same bbox → skip");
    return;
  }

  lastBBox = bboxKey;

  // Boreholes (always)
  const boreholes = await getBoreholes(map);
  if (id !== requestId) return; // cancel old request
  if (boreholes) {
    boreholesLayer.clearLayers();
    boreholesLayer.addData(boreholes);
  }

  // Pipelines (only when zoomed in)
  if (zoom >= 8) {
    const pipelines = await getPipelines(map);
    if (pipelines?.features?.length) {
      pipelinesLayer.clearLayers();
      pipelinesLayer.addData(pipelines);
      console.log("✅ pipelines loaded:", pipelines.features.length);
    } else {
      console.log("❌ no pipelines in view");
    }
  } else {
    pipelinesLayer.clearLayers();
  }
}

// ============================
// EVENTS
// ============================
let timeout;

map.whenReady(() => {
  map.invalidateSize();
  updateData();
});

map.on('moveend', () => {
  clearTimeout(timeout);
  timeout = setTimeout(updateData, 200);
});