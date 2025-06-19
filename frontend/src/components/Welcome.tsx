import {
  Box,
  Heading,
  Text,
  Input,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import { useSearchPlaces } from "@/hooks/useSearchPlaces";
import Support from "./Support";
import { useEffect, useRef, useCallback, useState } from "react";
import { Place } from "@/models/models";
import { BiSearch } from "react-icons/bi";

export default function Welcome({
  onPlaceSelect,
}: {
  onPlaceSelect: (place: Place) => void;
}) {
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
    if (e.key === "Enter" && searchQuery.trim().length >= 2) {
      // Clear the timeout and search immediately on Enter
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      search();
    }
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
            pr="4rem"
          />
          <IconButton
            icon={<BiSearch size="24px" />}
            position="absolute"
            right={3}
            top="50%"
            transform="translateY(-50%)"
            background="transparent"
            _hover={{ background: "transparent" }}
            aria-label="Search"
            isLoading={delayedLoading}
            onClick={() => searchQuery.trim().length >= 1 && search()}
            // isDisabled={searchQuery.trim().length < 1}
            zIndex={2}
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
                  onClick={() => {
                    onPlaceSelect(place);
                    clearResults();
                  }}
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
      </VStack>
      {/* Support section */}
      <Support />
    </Box>
  );
}
