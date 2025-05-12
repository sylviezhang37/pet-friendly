"use client";

import { Box } from "@chakra-ui/react";
import { useStore } from "@/hooks/useStore";
import { useCallback } from "react";
import Map from "@/components/Map";
import InfoPanel from "@/components/Welcome";
import PlacePanel from "@/components/Place";
import { Place } from "@/lib/place";

const samplePlaces: Place[] = [
  { id: "1", lat: 40.758, lng: -73.9855, name: "Barking Dog" },
  { id: "2", lat: 40.761, lng: -73.982, name: "Happy Feet Pet Shop" },
  { id: "3", lat: 40.755, lng: -73.99, name: "Spoiled Brats" },
];

export default function Home() {
  const selectedPlaceId = useStore((s) => s.selectedPlaceId);
  const setSelectedPlaceId = useStore((s) => s.setSelectedPlaceId);

  const handleMarkerClick = useCallback(
    (placeId: string) => {
      setSelectedPlaceId(placeId);
    },
    [setSelectedPlaceId]
  );

  const selectedPlace = samplePlaces.find((p) => p.id === selectedPlaceId);

  return (
    <Box position="relative" width="100vw" height="100vh" overflow="hidden">
      {/* Map fills the background */}
      <Box position="absolute" inset={0} zIndex={0}>
        <Map places={samplePlaces} onMarkerClick={handleMarkerClick} />
      </Box>
      {/* Info/Place Panel overlays the map */}
      <Box
        position="absolute"
        zIndex={1}
        right={{ base: 0, md: 8 }}
        left={{ base: 0, md: "auto" }}
        bottom={{ base: 0, md: 8 }}
        top={{ base: "auto", md: 8 }}
        width={{ base: "100vw", md: "450px" }}
        maxWidth="100vw"
        borderRadius={{ base: "2xl", md: "2xl 2xl 0 0" }}
        boxShadow="2xl"
        bg="white"
        overflowY="auto"
        maxHeight={{ base: "60vh", md: "calc(100vh - 4rem)" }}
        mx={{ base: 0, md: 4 }}
      >
        {selectedPlace ? <PlacePanel place={selectedPlace} /> : <InfoPanel />}
      </Box>
    </Box>
  );
}
