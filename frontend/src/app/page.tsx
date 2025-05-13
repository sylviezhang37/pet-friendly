"use client";

import { Box, useBreakpointValue } from "@chakra-ui/react";
import { useStore } from "@/hooks/useStore";
import { useCallback } from "react";
import Map from "@/components/Map";
import InfoPanel from "@/components/Welcome";
import PlacePanel from "@/components/Place";
import { Place } from "@/models/models";

const samplePlaces: Place[] = [
  {
    id: "1",
    lat: 40.758,
    lng: -73.9855,
    name: "Barking Dog",
    address: "123 Main St, New York, NY 10001",
    createdAt: "2021-01-01",
    updatedAt: "2021-01-01",
    numConfirm: 10,
    numDeny: 5,
    lastContributionType: "confirm",
    allowsPet: false,
    googleMapsUrl: "https://www.google.com/maps/place/Barking+Dog",
    type: "resturant",
    petFriendly: true,
  },
  {
    id: "2",
    lat: 40.761,
    lng: -73.982,
    name: "Happy Feet Pet Shop",
    address: "456 Second Ave, New York, NY 10002",
    createdAt: "2021-01-01",
    updatedAt: "2021-01-01",
    numConfirm: 10,
    numDeny: 5,
    lastContributionType: "confirm",
    allowsPet: true,
    googleMapsUrl: "https://www.google.com/maps/place/Happy+Feet+Pet+Shop",
    type: "pet shop",
    petFriendly: true,
  },
];

export default function Home() {
  const selectedPlaceId = useStore((s) => s.selectedPlaceId);
  const setSelectedPlaceId = useStore((s) => s.setSelectedPlaceId);
  const isMobile = useBreakpointValue({ base: true, md: false });

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
        borderRadius={{ base: "2xl", md: "2xl" }}
        boxShadow="2xl"
        bg="white"
        overflowY="auto"
        maxHeight={{ base: "40vh", md: "85vh" }}
        mx={{ base: 0, md: 2 }}
        display="flex"
        flexDirection="column"
      >
        {/* Drag handle for mobile */}
        {isMobile && (
          <Box
            w="40px"
            h="4px"
            bg="gray.300"
            borderRadius="full"
            mx="auto"
            mt={2}
            mb={4}
          />
        )}
        <Box flex={1} overflowY="auto">
          {selectedPlace ? <PlacePanel place={selectedPlace} /> : <InfoPanel />}
        </Box>
      </Box>
    </Box>
  );
}
