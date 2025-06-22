"use client";

import { Box, Text, Spinner, useBreakpointValue } from "@chakra-ui/react";
// import { useEffect, useState } from "react";
import Map from "@/components/Map";
import WelcomePanel from "@/components/Welcome";
import PlacePanel from "@/components/place/Place";
import SearchBar from "@/components/SearchBar";
import UserProfile from "@/components/user/UserProfile";
import { usePlacesManagement } from "@/hooks/usePlacesManagement";

export default function Home() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { places, selectedPlaceId, handlePlaceSelect, handleMarkerClick } =
    usePlacesManagement();

  if (places.size === 0) {
    return (
      <Box
        p={8}
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        minH="400px"
      >
        <Spinner size="xl" color="brand.primary" mb={4} />
        <Text color="gray.500">Loading map...</Text>
      </Box>
    );
  }

  return (
    <Box height="100vh" overflow="hidden" position="relative">
      {/* Map fills the background */}
      <Box position="absolute" inset={0} zIndex={0}>
        <Map places={places} onMarkerClick={handleMarkerClick} />
      </Box>

      {/* User Profile */}
      <UserProfile />

      {/* Search Bar overlays everything */}
      <Box
        position="absolute"
        zIndex={2}
        top={5}
        left={{ base: 0, md: "auto" }}
        right={{ base: 0, md: 8 }}
        // base 80vw = 80% width on mobile
        width={{ base: "80vw", md: "400px" }}
        mx={{ base: 0, md: 2 }}
        display="flex"
        justifyContent="center"
      >
        <SearchBar onPlaceSelect={handlePlaceSelect} />
      </Box>

      {/* Welcome/Place Panel overlays the map */}
      <Box
        position="absolute"
        zIndex={1}
        // move panel to bottom of screen on mobile
        top={{ base: "auto", md: 75 }}
        bottom={isMobile ? { base: 0 } : undefined}
        left={{ base: 0, md: "auto" }}
        right={{ base: 0, md: 8 }}
        width={{ base: "100vw", md: "400px" }}
        maxWidth="100vw"
        maxHeight={{ base: "40vh", md: "80vh" }}
        mx={{ base: 0, md: 2 }}
        borderTopRadius="3xl"
        borderBottomRadius={{ base: "0", md: "3xl" }}
        boxShadow="md"
        bg="brand.background"
        overflowY="auto"
        display="flex"
        flexDirection="column"
      >
        {/* Drag handle for mobile */}
        {/* TODO: fix mobile experience including search bar position */}
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

        {/* TODO: add a close button to the top right of the panel */}
        {/* overflow auto makes panel scrollable */}
        <Box flex={1} overflowY="auto" className="hide-scrollbar">
          {selectedPlaceId ? (
            <PlacePanel place={places.get(selectedPlaceId)!} />
          ) : (
            <WelcomePanel />
          )}
        </Box>
      </Box>
    </Box>
  );
}
