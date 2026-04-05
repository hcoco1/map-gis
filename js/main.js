import { createMap } from './map.js';
import { getBaseMaps } from './basemaps.js';
import { addLayerControl } from './controls.js';
import { createCoordsControl } from './controls.js';
import { getBoreholes } from './api.js';
import { getPipelines } from './api.js';


// ============================
// INIT MAP
// ============================
const map = createMap();

async function updateData() {

  const zoom = map.getZoom();

  // ============================
  // BOREHOLES (points)
  // ============================
  const boreholes = await getBoreholes(map);

  if (boreholes) {
    boreholesLayer.clearLayers();
    boreholesLayer.addData(boreholes);
  }

  // ============================
  // PIPELINES (only zoom >= 10)
  // ============================
  if (zoom >= 10) {
    const pipelines = await getPipelines(map);
    console.log(pipelines.features[0]);

    if (pipelines) {
      pipelinesLayer.clearLayers();
      pipelinesLayer.addData(pipelines);
    }
  } else {
    pipelinesLayer.clearLayers();
  }
}


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

// Add default basemap
baseMaps["Esri Light Gray"].addTo(map);


// ============================
// CONTROLS
// ============================
addLayerControl(map, baseMaps);




//=============================
// COORDS CONTROL
//=============================
const coordsControl = createCoordsControl().addTo(map);

// update on mouse move
map.on('mousemove', (e) => {
  const div = coordsControl.getContainer();

  div.innerHTML =
    `Lat: ${e.latlng.lat.toFixed(5)} | Lng: ${e.latlng.lng.toFixed(5)}`;
});

// ============================
// DATA LAYERS
// ============================





map.once('moveend', updateData);   // first load
let timeout;

map.on('moveend', () => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    updateData();
  }, 200);
});

map.whenReady(() => {
  map.invalidateSize();

  // force a proper view reset
  map.setView([53.4911, 4.8449], 8);  // 👈 use lower zoom first
});

// initial load
updateData();