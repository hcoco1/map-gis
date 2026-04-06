import { createMap } from './map.js';
import { getBaseMaps } from './basemaps.js';
import { addLayerControl } from './controls.js';
import { createCoordsControl } from './controls.js';
import { getBoreholes, getPipelines, getLicenses } from './api.js';

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
pointToLayer: (feature, latlng) => {

  const status = feature.properties.status;

  let color = '#2563eb'; // default (blue)
  let radius = 4;

  if (status === "Active") {
    color = '#16a34a'; // green
    radius = 5;
  } else if (status === "Abandoned") {
    color = '#d46868'; // red
    radius = 3;
  } else if (status === "Suspended") {
    color = '#f59e0b'; // orange
  }

  return L.circleMarker(latlng, {
    radius: radius,
    color: color,
    fillColor: color,
    fillOpacity: 0.7
  });
},

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
      layer.on('mouseout', () => layer.setStyle({ radius: 4 }));
    }

  }).addTo(map);

  if (!map.hasLayer(boreholesLayer)) {
    boreholesControls.style.display = 'none';
  }

  const pipelinesLayer = L.geoJSON(null, {
    style: {
      color: '#ff01c8ee',
      weight: 1,
      fillOpacity: 0.6,
    }
  }).addTo(map);

  // ADD THIS BLOCK right after line 57:
  const licensesLayer = L.geoJSON(null, {
    style: {
      color: '#616161',      // green border
      weight: 1,
      fillColor: '#dafae5',  // light green fill
      fillOpacity: 0.3,
    },
    onEachFeature: (feature, layer) => {
      layer.bindPopup(`
        <div style="font-size:13px">
          <b>${feature.properties.name || "No name"}</b><br>
          <hr style="margin:4px 0;">
          <b>License:</b> ${feature.properties.license || "N/A"}<br>
          <b>Status:</b> ${feature.properties.status || "Unknown"}
        </div>
      `);
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

const overlayMaps = {
  "<i class='fas fa-bore-hole'></i> Boreholes": boreholesLayer,
  "<i class='fas fa-route'></i> Pipelines": pipelinesLayer,
  "<i class='fas fa-file-contract'></i> Licenses": licensesLayer,
};
  addLayerControl(map, baseMaps, overlayMaps);

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

  const PIPELINE_MIN_ZOOM = 8; // named constant — change here fora different zoom threshold
  const LICENSE_MIN_ZOOM = 7;

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

    // ADD THIS BLOCK right after line 150:
    // --- Licenses (polygons, shown from zoom 7+) ---
    if (zoom >= LICENSE_MIN_ZOOM) {
      const licenses = await getLicenses(map);

      if (id !== requestId) {
        // stale response — a newer request arrived, discard this
        document.getElementById('loadingIndicator').style.display = 'none';
        return;
      }

      if (licenses?.features?.length) {
        licensesLayer.clearLayers();
        licensesLayer.addData(licenses);
      }
    } else {
      licensesLayer.clearLayers(); // hide when zoomed out too far
    }




    // --- Update info panel ---

  const statusEl = document.getElementById('uiStatus');

  statusEl.textContent = currentStatus || "All";

  if (currentStatus === "Active") {
    statusEl.style.color = "#16a34a"; // green
  } else if (currentStatus === "Abandoned") {
    statusEl.style.color = "#dc2626"; // red
  } else if (currentStatus === "Suspended") {
    statusEl.style.color = "#f59e0b"; // orange
  } else {
    statusEl.style.color = "#000";
  }
    //document.getElementById('uiZoom').textContent   = map.getZoom();
    document.getElementById('uiCount').textContent = boreholes?.features?.length || 0;

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


  const boreholesControls = document.getElementById('boreholesControls');

  // when layer is turned ON
  map.on('overlayadd', (e) => {
    if (e.layer === boreholesLayer) {
      boreholesControls.style.display = 'block';
    }
  });

  // when layer is turned OFF
  map.on('overlayremove', (e) => {
    if (e.layer === boreholesLayer) {
      boreholesControls.style.display = 'none';
    }
  });

  

});