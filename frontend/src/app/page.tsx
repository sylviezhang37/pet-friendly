"use client";

import { Box, Text, Spinner, useBreakpointValue } from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import Map from "@/components/Map";
import WelcomePanel from "@/components/Welcome";
import PlacePanel from "@/components/place/Place";
import SearchBar from "@/components/SearchBar";
import UserProfile from "@/components/user/UserProfile";
import { usePlacesManagement } from "@/hooks/usePlacesManagement";

enum PanelHeight {
  MINIMIZED = 5,
  EXPANDED = 30,
  FULL_SCREEN = 75,
}

const SNAP_THRESHOLDS = {
  MINIMIZED: 30,
  EXPANDED: 75,
} as const;

export default function Home() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { places, selectedPlaceId, handlePlaceSelect, handleMarkerClick } =
    usePlacesManagement();

  const [dynamicMaxHeight, setDynamicMaxHeight] = useState("100vh");

  // calculate viewport height on mount
  useEffect(() => {
    if (isMobile) {
      setDynamicMaxHeight(`${window.innerHeight}px`);
      console.log("heights : ", dynamicMaxHeight, window.innerHeight);
    } else {
      setDynamicMaxHeight("100vh");
    }
  }, [isMobile, dynamicMaxHeight]);

  // Panel drag state
  const [panelHeight, setPanelHeight] = useState<number>(PanelHeight.EXPANDED); // percentage of viewport height
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  // Touch event handlers for drag
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;

    // Allow touches in the bottom 80% of the screen
    const touchY = e.touches[0].clientY;
    const screenHeight = window.innerHeight;
    const triggerZone = screenHeight * 0.2; // Top 20% is excluded

    if (touchY < triggerZone) return;

    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartHeight(panelHeight);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || !isDragging) return;

    const currentY = e.touches[0].clientY;
    const deltaY = startY - currentY; // positive when dragging up
    const newHeight = Math.max(
      PanelHeight.MINIMIZED,
      Math.min(
        PanelHeight.FULL_SCREEN,
        startHeight + (deltaY / window.innerHeight) * 100
      )
    );

    setPanelHeight(newHeight);

    // prevent default only when we're actually dragging
    if (Math.abs(deltaY) > 5) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;
    setIsDragging(false);

    if (panelHeight < SNAP_THRESHOLDS.MINIMIZED) {
      setPanelHeight(PanelHeight.MINIMIZED);
    } else if (panelHeight < SNAP_THRESHOLDS.EXPANDED) {
      setPanelHeight(PanelHeight.EXPANDED);
    } else {
      setPanelHeight(PanelHeight.FULL_SCREEN);
    }
  };

  /* 
  reset panel height when place selection changes
  expand to full screen if currently minimized, otherwise keep current size
  */
  useEffect(() => {
    if (selectedPlaceId) {
      setPanelHeight((prev) =>
        prev <= PanelHeight.MINIMIZED ? PanelHeight.FULL_SCREEN : prev
      );
    }
  }, [selectedPlaceId]);

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

  /* touch events attach to the main container instead of just the drag handle */
  return (
    <Box
      maxHeight={dynamicMaxHeight}
      height="100vh"
      overflow="hidden"
      position="relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
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
        right={{ base: 2, md: 8 }}
        width={{ base: "55vw", md: "400px" }}
        mx={{ base: 0, md: 2 }}
        // justifyContent="flex-end" // Changed: align content to the right
        // alignItems="center"
        // bg="red.200" // Temporary - to see the clickable area
        // onTouchStart={() => alert("Touch works!")} // Test touch events
        // onClick={() => alert("Click works!")} // Test click events
      >
        <SearchBar onPlaceSelect={handlePlaceSelect} />
      </Box>

      {/* Welcome/Place Panel overlays the map */}
      <Box
        ref={panelRef}
        position="absolute"
        zIndex={1}
        bottom={0}
        left={{ base: 0, md: "auto" }}
        right={{ base: 0, md: 8 }}
        width={{ base: "100vw", md: "400px" }}
        maxWidth="100vw"
        height={isMobile ? `${panelHeight}vh` : undefined}
        maxHeight={{ base: "80vh", md: "80vh" }}
        mx={{ base: 0, md: 2 }}
        borderTopRadius="3xl"
        borderBottomRadius={{ base: "0", md: "3xl" }}
        boxShadow="md"
        bg="brand.background"
        overflowY="auto"
        display="flex"
        flexDirection="column"
        transition={isDragging ? "none" : "height 0.3s ease-out"}
      >
        {/* Drag handle for mobile */}
        {isMobile && (
          <Box
            data-drag-handle
            w="40px"
            h="5px"
            bg="gray.400"
            borderRadius="full"
            mx="auto"
            mt={4}
            mb={4}
            cursor="grab"
            _active={{ cursor: "grabbing" }}
            position="relative"
          />
        )}

        {/* overflow auto makes panel scrollable */}
        <Box
          flex={1}
          overflowY="auto"
          className="hide-scrollbar"
          display={panelHeight <= PanelHeight.MINIMIZED ? "none" : "block"}
        >
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
