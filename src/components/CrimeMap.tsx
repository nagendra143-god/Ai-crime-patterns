
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { crimeData } from "@/data/crimeData";

export function CrimeMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [78.9629, 20.5937], // Center on India
      zoom: 4
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Add crime markers when map loads
    map.current.on('load', addCrimeMarkers);
  };

  const addCrimeMarkers = () => {
    if (!map.current) return;

    // Process crime data
    Object.entries(crimeData).forEach(([crimeType, records]) => {
      records.forEach((crime) => {
        // Only process records with Indian locations
        if (crime.location.includes('India')) {
          const coordinates = getCoordinatesForCity(crime.location);
          
          // Create a popup
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <strong>${crimeType}</strong>
            <p>${crime.description}</p>
            <p><small>${crime.date}</small></p>
          `);

          // Create marker element
          const el = document.createElement('div');
          el.className = 'marker';
          el.style.width = '20px';
          el.style.height = '20px';
          el.style.borderRadius = '50%';
          el.style.cursor = 'pointer';
          
          // Color code by crime type
          switch(crimeType) {
            case 'Theft':
              el.style.backgroundColor = '#ef4444';
              break;
            case 'Cybercrime':
              el.style.backgroundColor = '#3b82f6';
              break;
            case 'Drug Trafficking':
              el.style.backgroundColor = '#8b5cf6';
              break;
            default:
              el.style.backgroundColor = '#71717a';
          }

          // Add marker to map
          new mapboxgl.Marker(el)
            .setLngLat(coordinates)
            .setPopup(popup)
            .addTo(map.current);
        }
      });
    });
  };

  // Helper function to get coordinates for Indian cities
  const getCoordinatesForCity = (location: string): [number, number] => {
    const cityCoordinates: { [key: string]: [number, number] } = {
      'Delhi, India': [77.2090, 28.6139],
      'Mumbai, India': [72.8777, 19.0760],
      'Bangalore, India': [77.5946, 12.9716],
      'Chennai, India': [80.2707, 13.0827],
      'Kolkata, India': [88.3639, 22.5726],
      'Hyderabad, India': [78.4867, 17.3850],
      'Pune, India': [73.8567, 18.5204],
      'Gurgaon, India': [77.0266, 28.4595],
      'Amritsar, India': [74.8723, 31.6340],
      'Goa, India': [74.1240, 15.2993],
      'Manipur, India': [93.9063, 24.6637],
      'Gujarat, India': [71.1924, 22.2587],
    };

    // Extract city name from location string
    const city = Object.keys(cityCoordinates).find(key => location.includes(key));
    return city ? cityCoordinates[city] : [78.9629, 20.5937]; // Default to India center
  };

  useEffect(() => {
    if (mapboxToken) {
      initializeMap();
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken]);

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">
          Crime Hotspot Map
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!mapboxToken ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Please enter your Mapbox public token to view the crime map. You can get one at{" "}
              <a 
                href="https://www.mapbox.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                mapbox.com
              </a>
            </p>
            <Input
              type="text"
              placeholder="Enter Mapbox token"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="w-full"
            />
          </div>
        ) : (
          <div className="h-[500px] rounded-lg overflow-hidden">
            <div ref={mapContainer} className="w-full h-full" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
