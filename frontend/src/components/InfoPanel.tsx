import { Box, Heading, Text, Input, Button, VStack } from "@chakra-ui/react";
import Support from "./Support";

export default function InfoPanel() {
  return (
    <Box
      flex={{ base: "none", md: "0 0 480px" }}
      width={{ base: "100vw", md: "480px" }}
      height={{ base: "60vh", md: "100vh" }}
      bg="white"
      boxShadow={{ base: "none", md: "xl" }}
      p={8}
      overflowY="auto"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      position="relative"
    >
      <VStack spacing={8} width="100%" maxW="340px">
        <Heading
          as="h1"
          size="2xl"
          fontWeight="bold"
          textAlign="left"
          width="100%"
        >
          Pet Friendly
        </Heading>
        <Text fontSize="md" color="gray.600" textAlign="left" width="100%">
          Discover pet friendly spots in your neighborhood and contribute to the
          community of maintaining the database of pet friendly locations.
        </Text>
        <Input placeholder="Find a place" size="lg" bg="gray.50" />
        <Button colorScheme="yellow" width="100%" size="lg" fontWeight="bold">
          SEARCH
        </Button>
      </VStack>
      <Support />
    </Box>
  );
}
