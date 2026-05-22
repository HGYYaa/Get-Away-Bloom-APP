# Get Away Bloom Travel Planner

Get Away Bloom is a browser-based travel planning web application that helps users create and manage vacation routes. The app supports location search, route planning, points-of-interest selection, distance calculation, saved vacation plans, and detailed map-based itinerary review.

> This was originally developed as a Monash University Engineering Mobile Apps coursework project. The public repository is intended as a portfolio version with sensitive API keys removed.

## Features

- **Vacation planning workflow**: create a vacation plan by selecting starting location, destination, vehicle type, travel date, and route stops.
- **Interactive map experience**: use Mapbox to display maps, markers, selected points of interest, and planned route paths.
- **Location search and geocoding**: integrate geocoding services to convert user-entered locations into coordinates and display readable addresses.
- **POI discovery**: search for nearby attractions, lodging, food, and petrol stations around selected locations.
- **Route and distance calculation**: calculate route distance and compare it with vehicle endurance to support trip feasibility checks.
- **Vacation list management**: store planned vacations locally and display saved trips in a structured table.
- **Detailed itinerary page**: review saved plans with route map, starting point, destination, vehicle range, total distance, and number of stops.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **UI Framework**: Material Design Lite
- **Maps & Routing**: Mapbox GL JS, Mapbox Directions API
- **Geocoding**: OpenCage Geocoder
- **Storage**: Browser LocalStorage

## Project Structure

```text
.
├── index.html                  # Landing page
├── vacationPlanning.html        # Main planning workflow
├── vacationList.html            # Saved vacation list
├── vacationDetail.html          # Detailed itinerary page
├── css/
│   ├── index.css
│   ├── vacationPlanning.css
│   ├── list.css
│   └── detailed.css
├── js/
│   ├── config.js                # API key placeholders / configuration
│   ├── services.js              # Web service wrappers and LocalStorage helpers
│   ├── shared.js                # Shared data classes
│   ├── vacationPlanning.js      # Vacation planning logic
│   ├── vacationList.js          # Saved plan listing logic
│   └── vacationDetail.js        # Saved plan detail rendering logic
└── img/                         # Static image/video assets
```

## My Role

I contributed to the design and implementation of the travel planning web application, focusing on:

- building interactive pages with HTML, CSS, JavaScript, and Material Design Lite;
- implementing vacation planning logic and route-related user interactions;
- integrating map, geocoding, and points-of-interest services;
- using LocalStorage to persist planned vacation data across pages;
- improving UI layout and user flow for planning, listing, and viewing saved trips.

## How to Run

Because this is a static web application, it can be opened directly in a browser.

```bash
# Option 1: open index.html directly
open index.html

# Option 2: serve locally with Python
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## API Key Setup

The original coursework used Mapbox and OpenCage API keys. For a public GitHub repository, do not commit real API keys.

Create a local `js/config.js` file using this structure:

```javascript
const OPENCAGE_KEY = "your_opencage_api_key";
const MAPBOX_KEY = "your_mapbox_api_key";
const APP_DATA = "get-away-bloom-data";
```

For public repositories, it is recommended to provide a `config.example.js` file and keep the real `config.js` ignored by Git.

## Notes

- This project uses browser LocalStorage for prototype-level data persistence.
- This is a frontend coursework prototype and does not include a production backend.
- The public version should not include real API keys or private credentials.
