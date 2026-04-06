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
      radius: 3,
      color: '#2563eb'
    })
}).addTo(map);

const pipelinesLayer = L.geoJSON(null, {
  style: {
    color: 'red',
    weight: 2
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

// ============================
// DATA FETCH
// ============================
async function updateData() {
  const zoom = map.getZoom();

  // Boreholes (always)
  const boreholes = await getBoreholes(map);
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