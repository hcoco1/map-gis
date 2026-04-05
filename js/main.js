import { createMap } from './map.js';
import { getBaseMaps } from './basemaps.js';
import { addLayerControl } from './controls.js';
import { createCoordsControl } from './controls.js';


// ============================
// INIT MAP
// ============================
const map = createMap();




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