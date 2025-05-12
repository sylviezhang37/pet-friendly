import { Flex, Box } from "@chakra-ui/react";
import Map from "../components/Map";

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
        <Map />
      </Box>
      {/* Info/Search Panel */}
      <Box
        flex={{ base: "none", md: "0 0 480px" }}
        width={{ base: "100vw", md: "480px" }}
        height={{ base: "60vh", md: "100vh" }}
        bg="white"
        boxShadow={{ base: "none", md: "xl" }}
        p={8}
        overflowY="auto"
      >
        Info/Search Panel Placeholder
      </Box>
    </Flex>
  );
}
