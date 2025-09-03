import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, Phone, Clock, Bus, Hotel, Train, Mountain, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NotificationPanel } from "./NotificationPanel";
import monasteryImage1 from "@/assets/monastery-1.jpg";

const monasteries = [
  {
    id: 1,
    name: "Rumtek Monastery",
    lat: 27.3012,
    lng: 88.5584,
    description: "The largest monastery in Sikkim and seat of the Karmapa",
    contact: "+91-3592-252068",
    hours: "6:00 AM - 6:00 PM",
    founded: "1740",
    image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    name: "Enchey Monastery",
    lat: 27.3314,
    lng: 88.6138,
    description: "200-year-old monastery with stunning mountain views",
    contact: "+91-3592-205637",
    hours: "5:00 AM - 7:00 PM",
    founded: "1840",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Pemayangtse Monastery",
    lat: 27.2167,
    lng: 88.2167,
    description: "One of the oldest monasteries in Sikkim",
    contact: "+91-3595-250263",
    hours: "6:00 AM - 5:00 PM",
    founded: "1705",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    name: "Tashiding Monastery",
    lat: 27.3,
    lng: 88.15,
    description: "Sacred monastery overlooking the Rangit River",
    contact: "+91-3595-250124",
    hours: "5:30 AM - 6:30 PM",
    founded: "1717",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
  },
];

const busStops = [
  {
    id: 'bs1',
    name: "Gangtok Bus Terminal",
    lat: 27.3389,
    lng: 88.6065,
    description: "Main bus terminal in Gangtok",
    routes: [
      { to: "Siliguri", times: ["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "1:30 PM"] },
      { to: "Kalimpong", times: ["7:15 AM"] },
      { to: "Pakyong", times: ["2:30 PM", "2:00 PM"] }
    ],
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=300&fit=crop"
  },
  {
    id: 'bs2',
    name: "Siliguri Bus Stand",
    lat: 26.7271,
    lng: 88.3953,
    description: "Major bus terminal connecting to various destinations",
    routes: [
      { to: "Gangtok", times: ["8:30 AM", "9:30 AM", "10:30 AM", "11:00 AM", "12:30 PM", "1:30 PM", "3:00 PM"] },
      { to: "Pelling", times: ["10:30 PM"] },
      { to: "Ravongla", times: ["1:00 PM"] },
      { to: "Mangan", times: ["11:00 AM"] },
      { to: "Namchi", times: ["2:30 PM", "8:00 AM"] }
    ],
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=300&fit=crop"
  },
  {
    id: 'bs3',
    name: "Kalimpong Bus Stop",
    lat: 27.0669,
    lng: 88.4637,
    description: "Bus stop serving Kalimpong area",
    routes: [
      { from: "Gangtok", times: ["7:15 AM"] },
      { from: "Siliguri", times: ["7:30 AM"] }
    ],
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=300&fit=crop"
  },
  {
    id: 'bs4',
    name: "Mangan Bus Stop",
    lat: 27.5094,
    lng: 88.5281,
    description: "Bus stop in North Sikkim",
    routes: [
      { to: "Siliguri", times: ["7:00 AM"] },
      { from: "Siliguri", times: ["11:00 AM"] }
    ],
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=300&fit=crop"
  },
];

const hotels = [
  {
    id: 'h1',
    name: "Mayfair Spa Resort & Casino",
    lat: 27.3389,
    lng: 88.6065,
    description: "Luxury 5-star resort with spa and casino facilities",
    contact: "+91-3592-270101",
    rating: "5-star",
    amenities: ["Spa", "Casino", "Restaurant", "WiFi", "Pool"],
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop"
  },
  {
    id: 'h2',
    name: "The Elgin Nor-Khill",
    lat: 27.3314,
    lng: 88.6138,
    description: "Heritage hotel offering panoramic mountain views",
    contact: "+91-3592-205637",
    rating: "4-star",
    amenities: ["Restaurant", "Bar", "WiFi", "Mountain View"],
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop"
  },
  {
    id: 'h3',
    name: "Summit Namnang Courtyard & Spa",
    lat: 27.3012,
    lng: 88.5584,
    description: "Boutique hotel with traditional Sikkimese architecture",
    contact: "+91-3592-252068",
    rating: "4-star",
    amenities: ["Spa", "Restaurant", "WiFi", "Traditional Decor"],
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop"
  },
  {
    id: 'h4',
    name: "Hotel Pelling Residency",
    lat: 27.2167,
    lng: 88.2167,
    description: "Comfortable stay near Pelling attractions",
    contact: "+91-3595-250263",
    rating: "3-star",
    amenities: ["Restaurant", "WiFi", "Mountain View"],
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop"
  }
];

const railwayJunctions = [
  {
    id: 'rj1',
    name: "New Jalpaiguri Junction",
    lat: 26.7271,
    lng: 88.3953,
    description: "Major railway junction connecting to Sikkim",
    trains: ["Darjeeling Mail", "Kamrup Express", "Northeast Express"],
    distance: "114 km from Gangtok",
    facilities: ["Waiting Room", "Food Court", "ATM", "WiFi"],
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=300&fit=crop"
  },
  {
    id: 'rj2',
    name: "Siliguri Junction",
    lat: 26.7271,
    lng: 88.3953,
    description: "Important railway station near West Bengal-Sikkim border",
    trains: ["Darjeeling Himalayan Railway", "Kanchankanya Express"],
    distance: "110 km from Gangtok",
    facilities: ["Waiting Room", "Restaurant", "Parking"],
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop"
  },
  {
    id: 'rj3',
    name: "Kurseong Railway Station",
    lat: 26.8833,
    lng: 88.2833,
    description: "Hill station railway on Darjeeling Himalayan Railway",
    trains: ["Darjeeling Himalayan Railway", "Toy Train"],
    distance: "95 km from Gangtok",
    facilities: ["Heritage Station", "Tea Stalls", "Waiting Room"],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
  },
  {
    id: 'rj4',
    name: "Darjeeling Railway Station",
    lat: 27.0410,
    lng: 88.2663,
    description: "Terminus of the famous Darjeeling Himalayan Railway",
    trains: ["Darjeeling Himalayan Railway", "Heritage Toy Train"],
    distance: "75 km from Gangtok",
    facilities: ["Heritage Station", "Museum", "Gift Shop"],
    image: "https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?w=400&h=300&fit=crop"
  }
];

const famousPlaces = [
  {
    id: 'fp1',
    name: "Tsomgo Lake",
    lat: 27.3869,
    lng: 88.7576,
    description: "Sacred glacial lake at 12,313 ft elevation",
    type: "Natural Wonder",
    bestTime: "May to October",
    activities: ["Photography", "Yak Rides", "Cable Car"],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
  },
  {
    id: 'fp2',
    name: "Nathula Pass",
    lat: 27.3881,
    lng: 88.8414,
    description: "Mountain pass on India-China border at 14,140 ft",
    type: "Historical Site",
    bestTime: "May to October",
    activities: ["Border Viewing", "Photography", "Shopping"],
    image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&h=300&fit=crop"
  },
  {
    id: 'fp3',
    name: "Tiger Hill",
    lat: 27.0499, 
    lng: 88.2932,
    description: "Famous sunrise viewpoint overlooking Kanchenjunga",
    type: "Viewpoint",
    bestTime: "October to March",
    activities: ["Sunrise Viewing", "Photography", "Tea Gardens"],
    image: "https://images.unsplash.com/photo-1464822759844-d150baec3e5d?w=400&h=300&fit=crop"
  },
  {
    id: 'fp4',
    name: "Yuksom",
    lat: 27.3667,
    lng: 88.2167,
    description: "First capital of Sikkim and trekking base",
    type: "Historical Town",
    bestTime: "March to May, October to December",
    activities: ["Trekking", "Historical Sites", "Monastery Visits"],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
  },
  {
    id: 'fp5',
    name: "Gurudongmar Lake",
    lat: 27.7000,
    lng: 88.5167,
    description: "Sacred high-altitude lake at 17,800 ft",
    type: "Sacred Lake",
    bestTime: "May to October",
    activities: ["Photography", "Spiritual Experience", "High Altitude Trek"],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
  }
];

export const InteractiveMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const currentInfoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapLoadError, setMapLoadError] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedMonastery, setSelectedMonastery] = useState<typeof monasteries[0] | null>(null);
  const [selectedBusStop, setSelectedBusStop] = useState<typeof busStops[0] | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<typeof hotels[0] | null>(null);
  const [selectedRailway, setSelectedRailway] = useState<typeof railwayJunctions[0] | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<typeof famousPlaces[0] | null>(null);
  const { toast } = useToast();

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const clearAllSelections = () => {
    setSelectedMonastery(null);
    setSelectedBusStop(null);
    setSelectedHotel(null);
    setSelectedRailway(null);
    setSelectedPlace(null);
  };

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: "AIzaSyAjIeX51QqM7A4i69Pv3_ui4sn0Bn9g8a4",
        version: "weekly",
        libraries: ["maps", "marker"],
      });

      try {
        const { Map } = await loader.importLibrary("maps");
        const { AdvancedMarkerElement, PinElement } = await loader.importLibrary("marker");

        if (mapRef.current) {
          // Define Sikkim bounds
          const sikkimBounds = {
            north: 28.1,
            south: 27.0,
            east: 88.9,
            west: 88.0
          };

          const mapInstance = new Map(mapRef.current, {
            center: { lat: 27.4, lng: 88.6 },
            zoom: 11,
            minZoom: 10,
            maxZoom: 16,
            mapId: "monastery360-map",
            gestureHandling: "greedy", // Better for touch devices
            restriction: {
              latLngBounds: sikkimBounds,
              strictBounds: true
            },
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              },
              {
                featureType: "transit",
                elementType: "labels", 
                stylers: [{ visibility: "off" }]
              }
            ]
          });

          setMap(mapInstance);

          // Add monastery markers
          monasteries.forEach((monastery) => {
            const pin = new PinElement({
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              borderColor: "#92400e",
              glyph: "🏛️",
              glyphColor: "white",
              scale: 1.3,
            });

            const marker = new AdvancedMarkerElement({
              map: mapInstance,
              position: { lat: monastery.lat, lng: monastery.lng },
              title: monastery.name,
              content: pin.element,
            });

            const infoWindowContent = `
              <div class="p-4 max-w-xs">
                <img src="${monastery.image}" alt="${monastery.name}" class="w-full h-32 object-cover rounded-lg mb-3" />
                <h3 class="font-bold text-lg mb-2">${monastery.name}</h3>
                <p class="text-sm text-gray-600 mb-2">${monastery.description}</p>
                <div class="space-y-1 text-xs text-gray-500">
                  <div>Founded: ${monastery.founded}</div>
                  <div>Hours: ${monastery.hours}</div>
                  <div>Contact: ${monastery.contact}</div>
                </div>
              </div>
            `;

            const infoWindow = new google.maps.InfoWindow({
              content: infoWindowContent,
            });

            marker.addListener("click", () => {
              if (currentInfoWindowRef.current) {
                currentInfoWindowRef.current.close();
              }
              infoWindow.open(mapInstance, marker);
              currentInfoWindowRef.current = infoWindow;
              clearAllSelections();
              setSelectedMonastery(monastery);
            });
          });

          // Add bus stop markers
          busStops.forEach((busStop) => {
            const busPin = new PinElement({
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              borderColor: "#15803d",
              glyph: "🚌",
              glyphColor: "white",
              scale: 1.0,
            });

            const busMarker = new AdvancedMarkerElement({
              map: mapInstance,
              position: { lat: busStop.lat, lng: busStop.lng },
              title: busStop.name,
              content: busPin.element,
            });

            const routesList = busStop.routes.map(route => {
              const direction = route.to ? `To ${route.to}` : `From ${route.from}`;
              const times = route.times.join(', ');
              return `<div><strong>${direction}:</strong> ${times}</div>`;
            }).join('');

            const busInfoWindowContent = `
              <div class="p-4 max-w-xs">
                <img src="${busStop.image}" alt="${busStop.name}" class="w-full h-32 object-cover rounded-lg mb-3" />
                <h3 class="font-bold text-lg mb-2">🚌 ${busStop.name}</h3>
                <p class="text-sm text-gray-600 mb-2">${busStop.description}</p>
                <div class="text-xs text-gray-700">${routesList}</div>
              </div>
            `;

            const busInfoWindow = new google.maps.InfoWindow({
              content: busInfoWindowContent,
            });

            busMarker.addListener("click", () => {
              if (currentInfoWindowRef.current) {
                currentInfoWindowRef.current.close();
              }
              busInfoWindow.open(mapInstance, busMarker);
              currentInfoWindowRef.current = busInfoWindow;
              clearAllSelections();
              setSelectedBusStop(busStop);
            });
          });

          // Add hotel markers
          hotels.forEach((hotel) => {
            const hotelPin = new PinElement({
              background: "linear-gradient(135deg, #3b82f6, #1e40af)",
              borderColor: "#1e3a8a",
              glyph: "🏨",
              glyphColor: "white",
              scale: 1.2,
            });

            const hotelMarker = new AdvancedMarkerElement({
              map: mapInstance,
              position: { lat: hotel.lat, lng: hotel.lng },
              title: hotel.name,
              content: hotelPin.element,
            });

            const amenitiesList = hotel.amenities.join(', ');

            const hotelInfoWindowContent = `
              <div class="p-4 max-w-xs">
                <img src="${hotel.image}" alt="${hotel.name}" class="w-full h-32 object-cover rounded-lg mb-3" />
                <h3 class="font-bold text-lg mb-2">🏨 ${hotel.name}</h3>
                <p class="text-sm text-gray-600 mb-2">${hotel.description}</p>
                <div class="text-xs text-gray-500 space-y-1">
                  <div>Rating: ${hotel.rating}</div>
                  <div>Contact: ${hotel.contact}</div>
                  <div>Amenities: ${amenitiesList}</div>
                </div>
              </div>
            `;

            const hotelInfoWindow = new google.maps.InfoWindow({
              content: hotelInfoWindowContent,
            });

            hotelMarker.addListener("click", () => {
              if (currentInfoWindowRef.current) {
                currentInfoWindowRef.current.close();
              }
              hotelInfoWindow.open(mapInstance, hotelMarker);
              currentInfoWindowRef.current = hotelInfoWindow;
              clearAllSelections();
              setSelectedHotel(hotel);
            });
          });

          // Add railway junction markers
          railwayJunctions.forEach((railway) => {
            const railwayPin = new PinElement({
              background: "linear-gradient(135deg, #dc2626, #991b1b)",
              borderColor: "#7f1d1d",
              glyph: "🚂",
              glyphColor: "white",
              scale: 1.2,
            });

            const railwayMarker = new AdvancedMarkerElement({
              map: mapInstance,
              position: { lat: railway.lat, lng: railway.lng },
              title: railway.name,
              content: railwayPin.element,
            });

            const trainsList = railway.trains.join(', ');
            const facilitiesList = railway.facilities.join(', ');

            const railwayInfoWindowContent = `
              <div class="p-4 max-w-xs">
                <img src="${railway.image}" alt="${railway.name}" class="w-full h-32 object-cover rounded-lg mb-3" />
                <h3 class="font-bold text-lg mb-2">🚂 ${railway.name}</h3>
                <p class="text-sm text-gray-600 mb-2">${railway.description}</p>
                <div class="text-xs text-gray-500 space-y-1">
                  <div>Distance: ${railway.distance}</div>
                  <div>Trains: ${trainsList}</div>
                  <div>Facilities: ${facilitiesList}</div>
                </div>
              </div>
            `;

            const railwayInfoWindow = new google.maps.InfoWindow({
              content: railwayInfoWindowContent,
            });

            railwayMarker.addListener("click", () => {
              if (currentInfoWindowRef.current) {
                currentInfoWindowRef.current.close();
              }
              railwayInfoWindow.open(mapInstance, railwayMarker);
              currentInfoWindowRef.current = railwayInfoWindow;
              clearAllSelections();
              setSelectedRailway(railway);
            });
          });

          // Add famous places markers
          famousPlaces.forEach((place) => {
            const placePin = new PinElement({
              background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
              borderColor: "#4c1d95",
              glyph: "⛰️",
              glyphColor: "white",
              scale: 1.2,
            });

            const placeMarker = new AdvancedMarkerElement({
              map: mapInstance,
              position: { lat: place.lat, lng: place.lng },
              title: place.name,
              content: placePin.element,
            });

            const activitiesList = place.activities.join(', ');

            const placeInfoWindowContent = `
              <div class="p-4 max-w-xs">
                <img src="${place.image}" alt="${place.name}" class="w-full h-32 object-cover rounded-lg mb-3" />
                <h3 class="font-bold text-lg mb-2">⛰️ ${place.name}</h3>
                <p class="text-sm text-gray-600 mb-2">${place.description}</p>
                <div class="text-xs text-gray-500 space-y-1">
                  <div>Type: ${place.type}</div>
                  <div>Best Time: ${place.bestTime}</div>
                  <div>Activities: ${activitiesList}</div>
                </div>
              </div>
            `;

            const placeInfoWindow = new google.maps.InfoWindow({
              content: placeInfoWindowContent,
            });

            placeMarker.addListener("click", () => {
              if (currentInfoWindowRef.current) {
                currentInfoWindowRef.current.close();
              }
              placeInfoWindow.open(mapInstance, placeMarker);
              currentInfoWindowRef.current = placeInfoWindow;
              clearAllSelections();
              setSelectedPlace(place);
            });
          });
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
        setMapLoadError(true);
        
        if (!isOnline) {
          toast({
            title: "Offline Mode",
            description: "Map requires internet connection. Showing offline information.",
            variant: "default",
          });
        } else {
          toast({
            title: "Map Loading Error",
            description: "Unable to load the interactive map. Please try again later.",
            variant: "destructive",
          });
        }
      }
    };

    initMap();
  }, [toast]);

  const handleGetDirections = (location: { lat: number; lng: number }) => {
    // Try to get user's current location first
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Open Google Maps with current location as origin and selected location as destination
          const url = `https://www.google.com/maps/dir/${latitude},${longitude}/${location.lat},${location.lng}/@${location.lat},${location.lng},12z/data=!3m1!4b1!4m2!4m1!3e0`;
          window.open(url, "_blank");
        },
        (error) => {
          console.log("Location access denied, opening destination only");
          // If location access is denied, just open destination on Google Maps
          const url = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
          window.open(url, "_blank");
        }
      );
    } else {
      // If geolocation is not supported, just open destination
      const url = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
      window.open(url, "_blank");
    }
  };

  return (
    <div className="w-full h-screen relative">
      <NotificationPanel />
      
      {/* Offline/Map Error Fallback */}
      {(!isOnline || mapLoadError) && (
        <div className="absolute inset-0 bg-gradient-mountain flex items-center justify-center z-50">
          <Card className="shadow-monastery bg-gradient-card max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-center justify-center">
                <WifiOff className="w-6 h-6 text-muted-foreground" />
                <span>{!isOnline ? "You're Offline" : "Map Unavailable"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                {!isOnline 
                  ? "The interactive map requires an internet connection. You can still browse location information using the sidebar."
                  : "Unable to load the interactive map. Please check your internet connection and try again."
                }
              </p>
              
              <div className="text-sm bg-muted/50 p-3 rounded-lg">
                <h4 className="font-semibold mb-2">Available Offline:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Browse all monastery information</li>
                  <li>• View hotel details and amenities</li>
                  <li>• Check bus schedules and routes</li>
                  <li>• Access famous places information</li>
                </ul>
              </div>
              
              {!isOnline && (
                <p className="text-xs text-primary">
                  The app will automatically reconnect when you're back online.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className={`w-full h-full rounded-lg shadow-monastery ${(!isOnline || mapLoadError) ? 'opacity-50' : ''}`}
        style={{ minHeight: "600px" }}
      />
      
      {/* Locations Sidebar */}
      <div className="absolute top-4 left-4 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto space-y-4">
        <h2 className="text-xl font-bold text-foreground bg-card p-3 rounded-lg shadow-heritage">
          Explore Sikkim
        </h2>
        
        {/* Monasteries Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-primary bg-card p-2 rounded-lg flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Monasteries</span>
          </h3>
          {monasteries.map((monastery) => (
            <Card 
              key={monastery.id} 
              className={`cursor-pointer transition-all duration-300 hover:shadow-heritage ${
                selectedMonastery?.id === monastery.id ? 'ring-2 ring-primary shadow-glow' : ''
              }`}
              onClick={() => {
                clearAllSelections();
                setSelectedMonastery(monastery);
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{monastery.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{monastery.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Hotels Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-blue-600 bg-card p-2 rounded-lg flex items-center space-x-2">
            <Hotel className="w-5 h-5" />
            <span>Hotels</span>
          </h3>
          {hotels.map((hotel) => (
            <Card 
              key={hotel.id} 
              className={`cursor-pointer transition-all duration-300 hover:shadow-heritage ${
                selectedHotel?.id === hotel.id ? 'ring-2 ring-blue-500 shadow-glow' : ''
              }`}
              onClick={() => {
                clearAllSelections();
                setSelectedHotel(hotel);
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Hotel className="w-4 h-4 text-blue-600" />
                  <span>{hotel.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-1">{hotel.description}</p>
                <p className="text-xs font-medium text-blue-600">{hotel.rating}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Famous Places Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-purple-600 bg-card p-2 rounded-lg flex items-center space-x-2">
            <Mountain className="w-5 h-5" />
            <span>Famous Places</span>
          </h3>
          {famousPlaces.map((place) => (
            <Card 
              key={place.id} 
              className={`cursor-pointer transition-all duration-300 hover:shadow-heritage ${
                selectedPlace?.id === place.id ? 'ring-2 ring-purple-500 shadow-glow' : ''
              }`}
              onClick={() => {
                clearAllSelections();
                setSelectedPlace(place);
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Mountain className="w-4 h-4 text-purple-600" />
                  <span>{place.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-1">{place.description}</p>
                <p className="text-xs font-medium text-purple-600">{place.type}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Railway Junctions Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-red-600 bg-card p-2 rounded-lg flex items-center space-x-2">
            <Train className="w-5 h-5" />
            <span>Railway Junctions</span>
          </h3>
          {railwayJunctions.map((railway) => (
            <Card 
              key={railway.id} 
              className={`cursor-pointer transition-all duration-300 hover:shadow-heritage ${
                selectedRailway?.id === railway.id ? 'ring-2 ring-red-500 shadow-glow' : ''
              }`}
              onClick={() => {
                clearAllSelections();
                setSelectedRailway(railway);
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Train className="w-4 h-4 text-red-600" />
                  <span>{railway.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-1">{railway.description}</p>
                <p className="text-xs font-medium text-red-600">{railway.distance}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bus Stops Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-green-600 bg-card p-2 rounded-lg flex items-center space-x-2">
            <Bus className="w-5 h-5" />
            <span>Bus Stops</span>
          </h3>
          {busStops.map((busStop) => (
            <Card 
              key={busStop.id} 
              className={`cursor-pointer transition-all duration-300 hover:shadow-heritage ${
                selectedBusStop?.id === busStop.id ? 'ring-2 ring-green-500 shadow-glow' : ''
              }`}
              onClick={() => {
                clearAllSelections();
                setSelectedBusStop(busStop);
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Bus className="w-4 h-4 text-green-600" />
                  <span>{busStop.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{busStop.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Selected Item Details */}
      {(selectedMonastery || selectedHotel || selectedPlace || selectedRailway || selectedBusStop) && (
        <div className="absolute bottom-4 right-4 w-80">
           {selectedMonastery && (
            <Card className="shadow-monastery bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedMonastery.name}</span>
                  <Button variant="glass" size="sm" onClick={clearAllSelections}>×</Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <img 
                  src={selectedMonastery.image} 
                  alt={selectedMonastery.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <p className="text-sm">{selectedMonastery.description}</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Founded: {selectedMonastery.founded}</p>
                  <p>Hours: {selectedMonastery.hours}</p>
                  <p>Contact: {selectedMonastery.contact}</p>
                </div>
                <Button size="sm" onClick={() => handleGetDirections(selectedMonastery)} className="flex items-center space-x-1">
                  <Navigation className="w-4 h-4" />
                  <span>Directions</span>
                </Button>
              </CardContent>
            </Card>
          )}

          {selectedHotel && (
            <Card className="shadow-monastery bg-gradient-card border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Hotel className="w-5 h-5 text-blue-600" />
                    <span>{selectedHotel.name}</span>
                  </div>
                  <Button variant="glass" size="sm" onClick={clearAllSelections}>×</Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <img 
                  src={selectedHotel.image} 
                  alt={selectedHotel.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <p className="text-sm">{selectedHotel.description}</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Rating: {selectedHotel.rating}</p>
                  <p>Contact: {selectedHotel.contact}</p>
                  <p>Amenities: {selectedHotel.amenities.join(', ')}</p>
                </div>
                <Button size="sm" onClick={() => handleGetDirections(selectedHotel)} className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700">
                  <Navigation className="w-4 h-4" />
                  <span>Directions</span>
                </Button>
              </CardContent>
            </Card>
          )}

          {selectedPlace && (
            <Card className="shadow-monastery bg-gradient-card border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mountain className="w-5 h-5 text-purple-600" />
                    <span>{selectedPlace.name}</span>
                  </div>
                  <Button variant="glass" size="sm" onClick={clearAllSelections}>×</Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <img 
                  src={selectedPlace.image} 
                  alt={selectedPlace.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <p className="text-sm">{selectedPlace.description}</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Type: {selectedPlace.type}</p>
                  <p>Best Time: {selectedPlace.bestTime}</p>
                  <p>Activities: {selectedPlace.activities.join(', ')}</p>
                </div>
                <Button size="sm" onClick={() => handleGetDirections(selectedPlace)} className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700">
                  <Navigation className="w-4 h-4" />
                  <span>Directions</span>
                </Button>
              </CardContent>
            </Card>
          )}

          {selectedRailway && (
            <Card className="shadow-monastery bg-gradient-card border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Train className="w-5 h-5 text-red-600" />
                    <span>{selectedRailway.name}</span>
                  </div>
                  <Button variant="glass" size="sm" onClick={clearAllSelections}>×</Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <img 
                  src={selectedRailway.image} 
                  alt={selectedRailway.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <p className="text-sm">{selectedRailway.description}</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Distance: {selectedRailway.distance}</p>
                  <p>Trains: {selectedRailway.trains.join(', ')}</p>
                  <p>Facilities: {selectedRailway.facilities.join(', ')}</p>
                </div>
                <Button size="sm" onClick={() => handleGetDirections(selectedRailway)} className="flex items-center space-x-1 bg-red-600 hover:bg-red-700">
                  <Navigation className="w-4 h-4" />
                  <span>Directions</span>
                </Button>
              </CardContent>
            </Card>
          )}

          {selectedBusStop && (
            <Card className="shadow-monastery bg-gradient-card border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bus className="w-5 h-5 text-green-600" />
                    <span>{selectedBusStop.name}</span>
                  </div>
                  <Button variant="glass" size="sm" onClick={clearAllSelections}>×</Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{selectedBusStop.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-green-700">Bus Schedule</h4>
                  {selectedBusStop.routes.map((route, index) => (
                    <div key={index} className="bg-green-50 p-2 rounded text-xs">
                      <div className="font-medium text-green-700">
                        {route.to ? `To ${route.to}` : `From ${route.from}`}
                      </div>
                      <div className="text-green-600 mt-1">
                        Times: {route.times.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
                <Button size="sm" onClick={() => handleGetDirections(selectedBusStop)} className="flex items-center space-x-1 bg-green-600 hover:bg-green-700">
                  <Navigation className="w-4 h-4" />
                  <span>Directions</span>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};