"use client";

import { Box, Text, Spinner, useBreakpointValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Map from "@/components/Map";
import WelcomePanel from "@/components/Welcome";
import PlacePanel from "@/components/Place";
import { usePlaceManagement } from "@/hooks/usePlaceManagement";

// default to NYC for V0
// const center = {
//   lat: 40.758,
//   lng: -73.9855,
// };

export default function Home() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [dynamicMaxHeight, setDynamicMaxHeight] = useState("100vh");
  const { places, selectedPlaceId, handlePlaceSelect, handleMarkerClick } =
    usePlaceManagement();

  // calculate viewport height on mount
  useEffect(() => {
    if (isMobile) {
      setDynamicMaxHeight(`${window.innerHeight}px`);
    } else {
      setDynamicMaxHeight("100vh");
    }
  }, [isMobile]);

  if (places.length === 0) {
    return (
      <Box
        p={8}
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        minH="400px"
      >
        <Spinner size="xl" color="yellow.500" mb={4} />
        <Text color="gray.500">Loading map...</Text>
      </Box>
    );
  }

  return (
    <Box
      maxHeight={dynamicMaxHeight}
      height="100vh"
      overflow="hidden"
      position="relative"
    >
      {/* Map fills the background */}
      <Box position="absolute" inset={0} zIndex={0}>
        <Map places={places} onMarkerClick={handleMarkerClick} />
      </Box>
      {/* Info/Place Panel overlays the map */}
      <Box
        position="absolute"
        zIndex={1}
        right={{ base: 0, md: 8 }}
        left={{ base: 0, md: "auto" }}
        bottom={{ base: 0, md: 8 }}
        top={{ base: "auto", md: 8 }}
        width={{ base: "100vw", md: "430px" }}
        maxWidth="100vw"
        maxHeight={{ base: "40vh", md: "85vh" }}
        borderTopRadius="2xl"
        borderBottomRadius={{ base: "0", md: "2xl" }}
        boxShadow="2xl"
        bg="white"
        overflowY="auto"
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
            mb={2}
          />
        )}
        {/* overflow auto makes panel scrollable */}
        <Box flex={1} overflowY="auto">
          {selectedPlaceId ? (
            <PlacePanel place={places.find((p) => p.id === selectedPlaceId)!} />
          ) : (
            <WelcomePanel onPlaceSelect={handlePlaceSelect} />
          )}
        </Box>
      </Box>
    </Box>
  );
}
