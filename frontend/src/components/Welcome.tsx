import { Box, Heading, Text, Input, Button, VStack } from "@chakra-ui/react";
import Support from "./Support";

export default function Welcome() {
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
        <Text
          fontSize="md"
          color="gray.600"
          textAlign="left"
          width="100%"
          mb={2}
        >
          Discover and contribute to a database of pet friendly places.
        </Text>
        <Input placeholder="Find a place" size="lg" bg="gray.50" mb={2} />
        <Button colorScheme="yellow" width="100%" size="lg" fontWeight="bold">
          SEARCH
        </Button>
      </VStack>
      {/* Support section */}
      <Support />
    </Box>
  );
}
