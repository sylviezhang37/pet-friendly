"use client";

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

export interface Place {
  id: string;
  lat: number;
  lng: number;
  name: string;
}

export default function Map() {
  // { places = [] }: { places?: Place[] }
  // 'places' will be used for rendering markers in a future step
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
        {/* Placeholder marker at center */}
        <Marker position={center} label="★" />
        {/* Future: Render markers for each place */}
        {/* {places.map(place => (
          <Marker key={place.id} position={{ lat: place.lat, lng: place.lng }} label={place.name[0]} />
        ))} */}
      </GoogleMap>
    </LoadScript>
  );
}
