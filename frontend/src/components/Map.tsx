"use client";

import { Place } from "@/models/models";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// defaults to NYC
const defaultCenter = {
  lat: 40.758,
  lng: -73.9855,
};

interface MapProps {
  places: Place[];
  center?: { lat: number; lng: number };
  onMarkerClick?: (placeId: string) => void;
}

export default function Map({
  places = [],
  center = defaultCenter,
  onMarkerClick,
}: MapProps) {
  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
    >
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "100%",
        }}
        center={center}
        zoom={14}
        options={{ streetViewControl: false, mapTypeControl: false }}
      >
        {places.map((place) => (
          <Marker
            key={place.id}
            position={{
              lat: place.coordinates.lat,
              lng: place.coordinates.lng,
            }}
            label={place.name[0]}
            onClick={() => onMarkerClick?.(place.id)}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
