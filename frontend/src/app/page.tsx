import { Flex, Box } from "@chakra-ui/react";
import Map, { Place } from "@/components/Map";
import InfoPanel from "@/components/InfoPanel";

const samplePlaces: Place[] = [
  { id: "1", lat: 40.758, lng: -73.9855, name: "Barking Dog" },
  { id: "2", lat: 40.761, lng: -73.982, name: "Happy Feet Pet Shop" },
  { id: "3", lat: 40.755, lng: -73.99, name: "Spoiled Brats Pet Shop" },
];

export default function Home() {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      height="100vh"
      width="100vw"
      overflow="hidden"
    >
      {/* Map Panel */}
      <Box
        flex={{ base: "none", md: 1 }}
        height={{ base: "40vh", md: "100vh" }}
        width={{ base: "100vw", md: "60vw" }}
        position="relative"
      >
        <Map places={samplePlaces} />
      </Box>
      {/* Info/Search Panel */}
      <InfoPanel />
    </Flex>
  );
}
