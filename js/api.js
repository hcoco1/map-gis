import { mockGeoDB } from './mockGeoDB.js';

// ============================
// BBOX BUILDER
// ============================
export function buildBBoxParams(map) {

  const b = map.getBounds();

  return {
    minx: b.getWest(),
    miny: b.getSouth(),
    maxx: b.getEast(),
    maxy: b.getNorth()
  };
}

// ============================
// LOCAL DATA QUERIES
// ============================

// Boreholes (points)
export async function getBoreholes(map, filters = {}) {
  return queryCollection(mockGeoDB.boreholes, map, filters);
}

// Pipelines (lines)
export async function getPipelines(map) {
  return queryCollection(mockGeoDB.pipelines, map);
}

// Licenses (polygons)
export async function getLicenses(map) {
  return queryCollection(mockGeoDB.active_licenses, map);
}

// ============================
// UTILS
// ============================

function queryCollection(collection, map, filters = {}) {
  const bbox = buildBBoxParams(map);
  const features = collection.features
    .filter((feature) => featureIntersectsBBox(feature, bbox))
    .filter((feature) => matchesFilters(feature, filters));

  return Promise.resolve({
    ...collection,
    features
  });
}

function matchesFilters(feature, filters) {
  if (!filters.status) return true;

  return normalize(feature.properties?.status) === normalize(filters.status);
}

function featureIntersectsBBox(feature, bbox) {
  const featureBBox = getGeometryBBox(feature.geometry);
  if (!featureBBox) return false;

  return !(
    featureBBox.maxx < bbox.minx ||
    featureBBox.minx > bbox.maxx ||
    featureBBox.maxy < bbox.miny ||
    featureBBox.miny > bbox.maxy
  );
}

function getGeometryBBox(geometry) {
  if (!geometry) return null;

  const coordinates = flattenCoordinates(geometry.coordinates);
  if (!coordinates.length) return null;

  return coordinates.reduce((bbox, [x, y]) => ({
    minx: Math.min(bbox.minx, x),
    miny: Math.min(bbox.miny, y),
    maxx: Math.max(bbox.maxx, x),
    maxy: Math.max(bbox.maxy, y)
  }), {
    minx: Infinity,
    miny: Infinity,
    maxx: -Infinity,
    maxy: -Infinity
  });
}

function flattenCoordinates(coordinates) {
  if (!Array.isArray(coordinates)) return [];

  if (typeof coordinates[0] === 'number') {
    return [coordinates];
  }

  return coordinates.flatMap(flattenCoordinates);
}

function normalize(value) {
  return String(value).trim().toLowerCase();
}
