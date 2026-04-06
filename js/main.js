import { createMap } from './map.js';
import { getBaseMaps } from './basemaps.js';
import { addLayerControl } from './controls.js';
import { createCoordsControl } from './controls.js';
import { getBoreholes, getPipelines } from './api.js';

document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('loadingIndicator').style.display = 'block'; // show loader on start

  // ============================
  // INIT MAP
  // ============================

  const map = createMap();
  const statusSelect = document.getElementById('statusFilter');
  let currentStatus = '';

  statusSelect.addEventListener('change', () => {
    currentStatus = statusSelect.value;
    updateData();
  });

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
  <div style="font-size:13px">
    <b>${feature.properties.name || "No name"}</b><br>
    <hr style="margin:4px 0;">
    <b>Year:</b> ${feature.properties.year || "N/A"}<br>
    <b>Status:</b> ${feature.properties.status || "Unknown"}
  </div>
`);
      layer.on('mouseover', () => layer.setStyle({ radius: 6 }));
      layer.on('mouseout',  () => layer.setStyle({ radius: 4 }));
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

  // ============================
  // BBOX CACHING
  // ============================

  let lastRequestKey = null;

  function buildRequestKey(map, status) {
    const b = map.getBounds();
    const bboxKey = [
      b.getWest().toFixed(2),
      b.getSouth().toFixed(2),
      b.getEast().toFixed(2),
      b.getNorth().toFixed(2)
    ].join(',');
    return `${bboxKey}|${status || 'all'}|z${map.getZoom()}`;
  }

  // ============================
  // DATA FETCH
  // ============================

  const PIPELINE_MIN_ZOOM = 8; // named constant — change here if you need a different zoom threshold

  let requestId = 0;

  async function updateData() {

    const requestKey = buildRequestKey(map, currentStatus);

    if (requestKey === lastRequestKey) return; // same view → skip

    lastRequestKey = requestKey;
    const id = ++requestId;
    const zoom = map.getZoom();

    document.getElementById('loadingIndicator').style.display = 'block';

    // --- Boreholes ---
    const boreholes = await getBoreholes(map, { status: currentStatus });

    if (id !== requestId) {
      // A newer request arrived while we were waiting — discard this result
      document.getElementById('loadingIndicator').style.display = 'none';
      return;
    }

    if (boreholes) {
      boreholesLayer.clearLayers();
      boreholesLayer.addData(boreholes);
    } else {
      // API returned null (network error or server down)
      document.getElementById('uiStatus').textContent = '⚠️ API error – try again';
      document.getElementById('loadingIndicator').style.display = 'none';
      return;
    }

    // --- Pipelines (only when zoomed in enough) ---
    if (zoom >= PIPELINE_MIN_ZOOM) {
      const pipelines = await getPipelines(map);

      if (id !== requestId) {
        // Same guard as above — a newer request arrived
        document.getElementById('loadingIndicator').style.display = 'none';
        return;
      }

      if (pipelines?.features?.length) {
        pipelinesLayer.clearLayers();
        pipelinesLayer.addData(pipelines);
      }
    } else {
      pipelinesLayer.clearLayers();
    }

    // --- Update info panel ---
    document.getElementById('uiStatus').textContent = currentStatus || "All";
    document.getElementById('uiZoom').textContent   = map.getZoom();
    document.getElementById('uiCount').textContent  = boreholes?.features?.length || 0;

    document.getElementById('loadingIndicator').style.display = 'none'; // hide loader when done
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

});