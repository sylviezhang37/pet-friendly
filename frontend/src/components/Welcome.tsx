import { Box, Heading, Text, Input, Button, VStack } from "@chakra-ui/react";
import { useSearchPlaces } from "@/hooks/useSearchPlaces";
import Support from "./Support";
import { useStore } from "@/hooks/useStore";
import { useEffect, useRef, useCallback } from "react";

export default function Welcome() {
  const {
    searchQuery,
    setSearchQuery,
    isLoading,
    search,
    results,
    clearResults,
  } = useSearchPlaces();
  const { setSelectedPlaceId } = useStore();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchQuery.trim().length >= 2) {
      // Clear the timeout and search immediately on Enter
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      search();
    }
  };

  const handlePlaceSelect = (placeId: string) => {
    setSelectedPlaceId(placeId);
  };

  return (
    <Box
      flex={{ base: "none", md: "0 0 450px" }}
      width={{ base: "100vw", md: "auto" }}
      height="100%"
      maxWidth="100vw"
      boxShadow={{ base: "none", md: "xl" }}
      p={2}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      position="relative"
      overflow="auto"
    >
      <VStack
        spacing={4}
        width="100%"
        maxW="340px"
        height="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Heading
          as="h1"
          size="2xl"
          fontWeight="bold"
          textAlign="left"
          width="100%"
        >
          Pet Friendly
        </Heading>
        {/* only display greeting if a user is set */}
        {/* {!!username && (
          <Text
            fontSize="md"
            color="orange.600"
            textAlign="left"
            width="100%"
            mb={0}
          >
            Hi, {username} :)
          </Text>
        )} */}
        <Text fontSize="md" color="gray.600" textAlign="left" width="100%">
          Discover and contribute to a database of pet friendly places.
        </Text>
        <Box position="relative" width="100%">
          <Input
            placeholder="Find a place"
            size="lg"
            bg="gray.50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {results.length > 0 && (
            <Box
              position="absolute"
              top="100%"
              left={0}
              right={0}
              zIndex={1}
              bg="white"
              boxShadow="lg"
              borderRadius="md"
              mt={1}
              maxH="300px"
              overflowY="auto"
            >
              {results.map((place) => (
                <Box
                  key={place.id}
                  p={3}
                  cursor="pointer"
                  _hover={{ bg: "gray.50" }}
                  onClick={() => handlePlaceSelect(place.id)}
                  borderBottom="1px"
                  borderColor="gray.100"
                  _last={{ borderBottom: "none" }}
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
        <Button
          colorScheme="yellow"
          width="100%"
          size="lg"
          fontWeight="bold"
          onClick={() => searchQuery.trim().length >= 2 && search()}
          isLoading={isLoading}
          isDisabled={searchQuery.trim().length < 2}
        >
          SEARCH
        </Button>
      </VStack>
      {/* Support section */}
      <Support />
    </Box>
  );
}
