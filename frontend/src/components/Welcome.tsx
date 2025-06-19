import { Box, Heading, Text, VStack } from "@chakra-ui/react";
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
        {/* add a spacing */}
        <Box height="50px" />
        <Heading
          as="h1"
          size="xl"
          fontWeight="bold"
          textAlign="left"
          width="100%"
        >
          Pet Friendly
        </Heading>
        <Text fontSize="md" color="gray.600" textAlign="left" width="100%">
          Discover and contribute to a database of pet friendly places.
        </Text>
      </VStack>
      {/* Support section */}
      <Support />
    </Box>
  );
}
