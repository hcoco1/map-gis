

export function addLayerControl(map, baseMaps, overlays) {
  L.control.layers(baseMaps, overlays).addTo(map);
}



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