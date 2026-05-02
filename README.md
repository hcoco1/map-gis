## Overview

This project is a **frontend Web GIS application** designed to visualize and interact with local mock oil & gas infrastructure data, including:

* Boreholes (points)
* Pipelines (lines)
* Licenses (polygons)

The app is built using **Leaflet (Vanilla JS)**. It uses a local GeoJSON-style mock database in `js/mockGeoDB.js`, with the former API boundary in `js/api.js` now filtering local data by the current map view.

---

## Key Features

* **Viewport-Based Loading**
  Only loads data inside the visible map area (bounding box queries)

* **Dynamic Filtering**
  Filter boreholes by status (Completed, Drilling, Abandoned)

* **Layer Control**
  Toggle boreholes, pipelines, and licenses using Leaflet controls

* **Smart Rendering by Zoom Level**

  * Boreholes → always visible
  * Pipelines → visible from zoom level 8+
  * Licenses → visible from zoom level 7+

* **Color-Coded Data Visualization**
  Boreholes styled by status:

  * 🟢 Completed
  * 🔴 Abandoned
  * 🟠 Drilling
  * 🔵 Other

* **Interactive Popups**
  Click features to view detailed attributes

* **Live UI Feedback Panel**

  * Current filter status
  * Feature count
  * Loading indicator
  * Legend

* **Performance Optimization**

  * Local bounding box filtering
  * Request deduplication
  * Debounced map events
  * Lightweight GeoJSON rendering

---

## Tech Stack

### Frontend

* JavaScript (Vanilla)
* Leaflet
* HTML5 + CSS3

### Data

* Local JavaScript module
* GeoJSON FeatureCollections

---

## How It Works

1. User moves the map
2. Frontend reads the current bounding box
3. `js/api.js` filters the local mock FeatureCollections
4. Filtered GeoJSON is returned through the same async functions
5. Map updates dynamically

---

## Local Data API

```js
const boreholes = await getBoreholes(map, { status: "completed" });
```

---

## Installation

### 1. Clone repository

```sh
git clone https://github.com/hcoco1/map-gis.git
cd map-gis
```

---

### 2. Run frontend

Serve the frontend (example):

```sh
python3 -m http.server
```

Open:

```text
http://localhost:8000
```

---

## Project Structure

```sh
.
├── index.html
├── js
│   ├── main.js
│   ├── api.js
│   ├── mockGeoDB.js
│   ├── map.js
│   └── controls.js
└── css
    └── style.css
```

---

## What I Learned

* Designing **viewport-based GIS systems**
* Mocking backend contracts with local GeoJSON data
* Managing async data flows in frontend apps
* Separating concerns between UI, API, and database
* Building scalable geospatial applications from scratch

---

## Future Improvements

* Marker clustering for large datasets
* Vector tiles for better performance at scale
* Advanced filtering (year, company, depth)
* User authentication & saved views

---
