export function getBaseMaps() {

  const osm = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { attribution: '&copy; OpenStreetMap contributors' }
  );

  const esri = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    { attribution: '&copy; OpenStreetMap' }
  );

  const topo = L.tileLayer(
    'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    { attribution: '&copy; OpenTopoMap contributors' }
  );

  return {
    "OpenStreetMap": osm,
    "Topo Map": topo,
    "Esri Light Gray": esri
  };
}