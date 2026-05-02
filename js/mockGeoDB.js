export const mockGeoDB = {
  active_licenses: {
    type: "FeatureCollection",
    name: "active_licenses",
    crs: {
      type: "name",
      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" }
    },
    features: [
      {
        type: "Feature",
        id: "lic_001",
        properties: {
          name: "License A",
          operator: "Shell",
          status: "active",
          country: "NL",
          area_km2: 120
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[4.0,52.0],[4.2,52.0],[4.2,52.2],[4.0,52.2],[4.0,52.0]]]
        }
      },
      {
        type: "Feature",
        id: "lic_002",
        properties: {
          name: "License B",
          operator: "Total",
          status: "active",
          country: "NL",
          area_km2: 95
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[4.3,52.1],[4.5,52.1],[4.5,52.3],[4.3,52.3],[4.3,52.1]]]
        }
      },
      {
        type: "Feature",
        id: "lic_003",
        properties: {
          name: "License C",
          operator: "BP",
          status: "inactive",
          country: "DE",
          area_km2: 150
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[4.6,52.0],[4.8,52.0],[4.8,52.2],[4.6,52.2],[4.6,52.0]]]
        }
      }
    ]
  },

  pipelines: {
    type: "FeatureCollection",
    name: "pipelines",
    crs: {
      type: "name",
      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" }
    },
    features: [
      {
        type: "Feature",
        id: "pipe_001",
        properties: {
          name: "Pipeline X",
          diameter_in: 36,
          material: "steel",
          status: "operational",
          pressure_bar: 85
        },
        geometry: {
          type: "LineString",
          coordinates: [[4.1,52.1],[4.3,52.15],[4.5,52.2]]
        }
      },
      {
        type: "Feature",
        id: "pipe_002",
        properties: {
          name: "Pipeline Y",
          diameter_in: 24,
          material: "steel",
          status: "maintenance",
          pressure_bar: 60
        },
        geometry: {
          type: "LineString",
          coordinates: [[4.0,52.2],[4.2,52.25],[4.4,52.3]]
        }
      },
      {
        type: "Feature",
        id: "pipe_003",
        properties: {
          name: "Pipeline Z",
          diameter_in: 12,
          material: "PVC",
          status: "operational",
          pressure_bar: 40
        },
        geometry: {
          type: "LineString",
          coordinates: [[4.5,52.05],[4.7,52.1],[4.9,52.15]]
        }
      }
    ]
  },

  boreholes: {
    type: "FeatureCollection",
    name: "boreholes",
    crs: {
      type: "name",
      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" }
    },
    features: [
      {
        type: "Feature",
        id: "bh_001",
        properties: {
          name: "Borehole 1",
          depth_m: 3200,
          status: "completed",
          year: 2018,
          operator: "Shell"
        },
        geometry: {
          type: "Point",
          coordinates: [4.25,52.12]
        }
      },
      {
        type: "Feature",
        id: "bh_002",
        properties: {
          name: "Borehole 2",
          depth_m: 2800,
          status: "drilling",
          year: 2022,
          operator: "BP"
        },
        geometry: {
          type: "Point",
          coordinates: [4.35,52.18]
        }
      },
      {
        type: "Feature",
        id: "bh_003",
        properties: {
          name: "Borehole 3",
          depth_m: 4100,
          status: "completed",
          year: 2015,
          operator: "Total"
        },
        geometry: {
          type: "Point",
          coordinates: [4.6,52.22]
        }
      },
      {
        type: "Feature",
        id: "bh_004",
        properties: {
          name: "Borehole 4",
          depth_m: 1500,
          status: "abandoned",
          year: 2010,
          operator: "Exxon"
        },
        geometry: {
          type: "Point",
          coordinates: [4.8,52.1]
        }
      }
    ]
  }
};
