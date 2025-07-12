import { Box, Input, Text, HStack } from "@chakra-ui/react";
import { BiSearch } from "react-icons/bi";
import { FaTimes } from "react-icons/fa";
import { useSearchPlaces } from "@/hooks/useSearchPlaces";
import { useEffect, useRef, useCallback, useState } from "react";
import { Place } from "@/models/frontend";
import { useStore } from "@/hooks/useStore";
import { IconButton } from "@/components/common/IconButton";

interface SearchBarProps {
  onPlaceSelect: (place: Place) => void;
}

export default function SearchBar({ onPlaceSelect }: SearchBarProps) {
  const {
    searchQuery,
    setSearchQuery,
    isLoading,
    search,
    results,
    clearResults,
  } = useSearchPlaces();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [delayedLoading, setDelayedLoading] = useState(false);
  const selectedPlaceId = useStore((s) => s.selectedPlaceId);
  const setSelectedPlaceId = useStore((s) => s.setSelectedPlaceId);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const focusedRef = useRef<HTMLDivElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  // reset focused index when results change
  useEffect(() => {
    setFocusedIndex(-1);
  }, [results]);

  /* to make sure focus item stay in view,
   * need to scroll the item into view when the focus changes
   */
  useEffect(() => {
    if (
      focusedIndex >= 0 &&
      focusedRef.current &&
      resultsContainerRef.current
    ) {
      focusedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [focusedIndex]);

  // handle clicks outside of search component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node) &&
        results.length > 0
      ) {
        clearResults();
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [results.length, clearResults]);

  // Memoize the debounced search handler
  const debouncedSearch = useCallback(() => {
    const trimmedQuery = searchQuery.trim();

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If query is too short, clear results immediately
    if (trimmedQuery.length < 1) {
      clearResults();
      return;
    }

    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      search();
    }, 300); // 300ms delay
  }, [searchQuery, search, clearResults]);

  // Effect to handle the debounced search
  useEffect(() => {
    debouncedSearch();

    // Cleanup timeout on unmount or when searchQuery changes
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [debouncedSearch]);

  /*
   * only show spinner if search takes more than 100ms,
   * otherwise it looks like a glitch
   */
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setTimeout(() => {
        setDelayedLoading(true);
      }, 100);
    } else {
      setDelayedLoading(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (focusedIndex >= 0 && focusedIndex < results.length) {
        // if an item is focused, select it
        onPlaceSelect(results[focusedIndex]);
        clearResults();
      } else if (searchQuery.trim().length >= 1) {
        // Otherwise perform search
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
        search();
      }
    } else if (e.key === "Escape") {
      clearResults();
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault(); // prevent cursor from moving
      if (results.length > 0) {
        setFocusedIndex((prev) => (prev + 1) % results.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length > 0) {
        setFocusedIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
      }
    }
  };

  return (
    <Box position="relative" width="100%" ref={searchBarRef}>
      <Input
        placeholder="   Find a place"
        pl={4}
        size="lg"
        pr={selectedPlaceId ? "8rem" : "4rem"}
        bg="white"
        borderRadius="full"
        boxShadow="md"
        borderColor="transparent"
        focusBorderColor="brand.primary"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{ touchAction: "manipulation" }}
      />
      <HStack
        position="absolute"
        zIndex={2}
        right={2}
        top="50%"
        transform="translateY(-50%)"
        spacing={0}
      >
        <IconButton
          aria-label="Search"
          icon={<BiSearch size="24px" />}
          borderColor="transparent"
          isLoading={delayedLoading}
          onClick={() => searchQuery.trim().length >= 1 && search()}
        />
        {selectedPlaceId && (
          <IconButton
            aria-label="Close"
            icon={<FaTimes />}
            borderColor="transparent"
            onClick={() => {
              setSelectedPlaceId(null);
              clearResults();
              setSearchQuery("");
            }}
          />
        )}
      </HStack>
      {results.length > 0 && (
        <Box
          ref={resultsContainerRef}
          position="absolute"
          zIndex={1}
          top="100%"
          left={0}
          right={0}
          mt={1}
          maxH="300px"
          bg="white"
          boxShadow="lg"
          borderRadius="lg"
          overflowY="auto"
        >
          {results.map((place, index) => (
            <Box
              key={place.id}
              ref={focusedIndex === index ? focusedRef : undefined}
              p={3}
              cursor="pointer"
              bg={focusedIndex === index ? "gray.50" : "white"}
              borderBottom="1px"
              borderColor="gray.100"
              _hover={{ bg: "gray.50" }}
              _last={{ borderBottom: "none" }}
              onClick={() => {
                onPlaceSelect(place);
                clearResults();
              }}
            >
              <Text fontWeight="bold">{place.name}</Text>
              <Text fontSize="sm" color="gray.600">
                {place.address}
              </Text>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
