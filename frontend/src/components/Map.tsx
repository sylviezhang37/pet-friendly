"use client";

import { Place } from "@/lib/domain";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

// default to NYC for V0
const center = {
  lat: 40.758,
  lng: -73.9855,
};

interface MapProps {
  places?: Place[];
  onMarkerClick?: (placeId: string) => void;
}

export default function Map({ places = [], onMarkerClick }: MapProps) {
  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        options={{ streetViewControl: false, mapTypeControl: false }}
      >
        {places.map((place) => (
          <Marker
            key={place.id}
            position={{ lat: place.lat, lng: place.lng }}
            label={place.name[0]}
            onClick={() => onMarkerClick?.(place.id)}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
