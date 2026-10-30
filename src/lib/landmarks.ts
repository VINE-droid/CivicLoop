// ── Landmark list for location-sensitivity scoring ────────
// MOCKED: These are fictional landmarks for the demo ward.
// In production this would come from OSM / a real gazetteer.
// Labelled "Mocked" in LIMITATIONS.md.

export interface Landmark {
  name: string;
  lat: number;
  lng: number;
  type: 'school' | 'hospital' | 'main_road' | 'market';
}

// Fictional names, coordinates scattered around the demo map centre (12.9716, 77.5946)
export const LANDMARKS: Landmark[] = [
  { name: 'Maple Lane Primary School',   lat: 12.9728, lng: 77.5951, type: 'school'    },
  { name: 'Canal Road Secondary School', lat: 12.9702, lng: 77.5930, type: 'school'    },
  { name: 'Green Ward Community Clinic',  lat: 12.9740, lng: 77.5960, type: 'hospital'  },
  { name: 'Riverside Market',            lat: 12.9710, lng: 77.5965, type: 'market'    },
  { name: 'Canal Road (Main)',            lat: 12.9700, lng: 77.5946, type: 'main_road' },
  { name: 'Elm Street Junction',         lat: 12.9730, lng: 77.5920, type: 'main_road' },
  { name: 'North Ward Market',           lat: 12.9755, lng: 77.5955, type: 'market'    },
];
