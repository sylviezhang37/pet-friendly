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
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? true;
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

  // panel drag state
  const [panelHeight, setPanelHeight] = useState<number>(PanelHeight.EXPANDED);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // touch event handlers for drag
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;

    // allow swipe up/down to trigger drag in the bottom 90% of the screen
    const touchY = e.touches[0].clientY;
    const screenHeight = window.innerHeight;
    const triggerZone = screenHeight * 0.1;

    if (touchY < triggerZone) return;

    // Don't set isDragging immediately - wait for movement
    setStartY(e.touches[0].clientY);
    setStartHeight(panelHeight);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || startY === 0) return;

    const currentY = e.touches[0].clientY;
    const deltaY = startY - currentY; // positive when dragging up

    // Only start dragging if there's significant vertical movement
    if (!isDragging && Math.abs(deltaY) > 25) {
      setIsDragging(true);
    }

    if (!isDragging) return;

    const newHeight = Math.max(
      PanelHeight.MINIMIZED,
      Math.min(
        PanelHeight.FULL_SCREEN,
        startHeight + (deltaY / window.innerHeight) * 100
      )
    );

    setPanelHeight(newHeight);

    if (Math.abs(deltaY) > 10) {
      try {
        e.preventDefault();
      } catch (error) {
        console.error("Error preventing default touch event:", error);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;

    if (isDragging) {
      if (panelHeight < SNAP_THRESHOLDS.MINIMIZED) {
        setPanelHeight(PanelHeight.MINIMIZED);
      } else if (panelHeight < SNAP_THRESHOLDS.EXPANDED) {
        setPanelHeight(PanelHeight.EXPANDED);
      } else {
        setPanelHeight(PanelHeight.FULL_SCREEN);
      }
    }

    setIsDragging(false);
    setStartY(0);
  };

  /* 
  reset panel height when place selection changes
  expand to full screen when a place is selected
  */
  useEffect(() => {
    if (selectedPlaceId) {
      console.log(
        "Setting panel to full screen, selectedPlaceId:",
        selectedPlaceId
      );
      setPanelHeight(PanelHeight.FULL_SCREEN);
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

  return (
    <Box
      maxHeight={dynamicMaxHeight}
      height="100vh"
      overflow="hidden"
      position="relative"
      /* touch events attach to the main container instead of just the drag handle */
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Map fills the background */}
      <Box position="absolute" inset={0} zIndex={0}>
        <Map places={places} onMarkerClick={handleMarkerClick} />
      </Box>

      {/* User Profile */}
      <UserProfile isMobile={isMobile} />

      {/* Search Bar overlays everything */}
      <Box
        position="absolute"
        zIndex={2}
        top={4}
        right={{ base: 2, md: 8 }}
        width={{ base: "80vw", md: "400px" }}
        mx={{ base: 0, md: 2 }}
      >
        <SearchBar onPlaceSelect={handlePlaceSelect} />
      </Box>

      {/* Welcome/Place Panel overlays the map */}
      <Box
        ref={panelRef}
        position="absolute"
        zIndex={1}
        top={isMobile ? undefined : "75px"}
        bottom={isMobile ? 0 : undefined}
        left={{ base: 0, md: "auto" }}
        right={{ base: 0, md: 8 }}
        width={{ base: "100vw", md: "400px" }}
        height={isMobile ? `${panelHeight}vh` : undefined}
        maxHeight={!isMobile && selectedPlaceId ? "90vh" : "80vh"}
        mx={{ base: 0, md: 2 }}
        borderTopRadius="3xl"
        borderBottomRadius={{ base: 0, md: "3xl" }}
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
            // mb={4}
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
