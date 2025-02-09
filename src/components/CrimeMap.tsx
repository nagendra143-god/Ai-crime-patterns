
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import Overlay from 'ol/Overlay';
import 'ol/ol.css';
import { crimeData } from "@/data/crimeData";

export function CrimeMap() {
  const mapElement = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const popup = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapElement.current) return;

    // Create popup overlay
    const popupOverlay = new Overlay({
      element: popup.current!,
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [0, -10],
    });

    // Initialize map
    map.current = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([78.9629, 20.5937]), // Center on India
        zoom: 4,
      }),
    });

    map.current.addOverlay(popupOverlay);

    // Create markers for each crime location
    const features: Feature[] = [];
    
    Object.entries(crimeData).forEach(([crimeType, records]) => {
      records.forEach((crime) => {
        if (crime.location.includes('India')) {
          const coordinates = getCoordinatesForCity(crime.location);
          const feature = new Feature({
            geometry: new Point(fromLonLat(coordinates)),
            properties: {
              crimeType,
              description: crime.description,
              date: crime.date,
            },
          });

          // Style based on crime type
          let color: string;
          switch(crimeType) {
            case 'Theft':
              color = '#ef4444';
              break;
            case 'Cybercrime':
              color = '#3b82f6';
              break;
            case 'Drug Trafficking':
              color = '#8b5cf6';
              break;
            default:
              color = '#71717a';
          }

          feature.setStyle(new Style({
            image: new CircleStyle({
              radius: 6,
              fill: new Fill({ color }),
              stroke: new Stroke({
                color: '#fff',
                width: 2,
              }),
            }),
          }));

          features.push(feature);
        }
      });
    });

    // Add vector layer with markers
    const vectorSource = new VectorSource({
      features,
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    map.current.addLayer(vectorLayer);

    // Add click handler for popups
    map.current.on('click', (evt) => {
      const feature = map.current!.forEachFeatureAtPixel(evt.pixel, (feature) => feature);
      
      if (feature) {
        const props = feature.get('properties');
        const coordinates = (feature.getGeometry() as Point).getCoordinates();
        
        const content = `
          <div class="bg-card text-card-foreground p-2 rounded-lg shadow-lg">
            <strong class="text-primary">${props.crimeType}</strong>
            <p class="text-sm">${props.description}</p>
            <p class="text-xs text-muted-foreground">${props.date}</p>
          </div>
        `;
        
        popup.current!.innerHTML = content;
        popupOverlay.setPosition(coordinates);
      } else {
        popupOverlay.setPosition(undefined);
      }
    });

    return () => {
      if (map.current) {
        map.current.setTarget(undefined);
      }
    };
  }, []);

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

    const city = Object.keys(cityCoordinates).find(key => location.includes(key));
    return city ? cityCoordinates[city] : [78.9629, 20.5937]; // Default to India center
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">
          Crime Hotspot Map
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-[500px] rounded-lg overflow-hidden relative">
          <div ref={mapElement} className="w-full h-full" />
          <div ref={popup} className="absolute" />
        </div>
      </CardContent>
    </Card>
  );
}
