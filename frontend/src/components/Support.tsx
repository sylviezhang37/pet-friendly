import { Box, Text, HStack } from "@chakra-ui/react";

export default function Support() {
  return (
    <Box width="calc(100% - 32px)" margin={6}>
      <HStack spacing={2} align="center" justify="center">
        <Box as="span" display="inline-block" boxSize={5} color="gray.500">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="20"
              height="20"
              rx="4"
              fill="currentColor"
              fillOpacity="0.08"
            />
            <path
              d="M5 7.5L10 11.25L15 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="3.75"
              y="6.25"
              width="12.5"
              height="7.5"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </Box>
        <Text fontSize="sm" color="gray.500">
          Support
        </Text>
        <Text
          fontSize="sm"
          color="gray.600"
          as="a"
          href="mailto:oatsmoothie.apps@gmail.com"
          _hover={{ textDecoration: "underline" }}
        >
          oatsmoothie.apps@gmail.com
        </Text>
      </HStack>
    </Box>
  );
}
