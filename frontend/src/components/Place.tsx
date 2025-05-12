import { Place } from "@/lib/place";
import { Box } from "@chakra-ui/react";

export default function PlacePanel({ place }: { place: Place }) {
  return (
    <Box p={8}>
      <Box fontWeight="bold" fontSize="2xl" mb={2}>
        {place.name}
      </Box>
      <Box color="gray.600">Sample address for {place.name}</Box>
      <Box mt={4} color="gray.500">
        Place details panel (sample data)
      </Box>
    </Box>
  );
}
