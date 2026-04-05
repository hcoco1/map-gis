const BASE = 'https://gis-api-qxok.onrender.com';

// ============================
// GENERIC REQUEST
// ============================
async function request(url) {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();

  } catch (err) {
    console.error('API error:', err);
    return null;
  }
}

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
// ENDPOINTS
// ============================

// Boreholes (points)
export async function getBoreholes(map) {
  const params = buildBBoxParams(map);
  const query = toQuery(params);


  return request(`${BASE}/boreholes?${query}`);
}

// Pipelines (lines)
export async function getPipelines(map) {
  const params = buildBBoxParams(map);
  const query = toQuery(params);
  console.log("BBOX SENT:", params);
  return request(`${BASE}/pipelines?${query}`);
}

// Licenses (polygons)
export async function getLicenses(map) {
  const params = buildBBoxParams(map);
  const query = toQuery(params);


  return request(`${BASE}/licenses?${query}`);
}

// ============================
// UTILS  Helper to convert params → URL
// ============================

function toQuery(params) {
  return new URLSearchParams(params).toString();
}
