
//=============================
// COORDS CONTROL
//=============================
export function createCoordsControl() {

  const CoordsControl = L.Control.extend({

    options: {
      position: 'bottomleft' // or 'bottomright'
    },

    onAdd: function () {
      const div = L.DomUtil.create('div', 'coords-control');
      div.innerHTML = 'Lat: -, Lng: -';
      return div;
    }

  });

  return new CoordsControl();
}

// In controls.js — find your addLayerControl function and update it:
export function addLayerControl(map, baseMaps, overlayMaps = {}) {
  L.control.layers(baseMaps, overlayMaps).addTo(map);
}