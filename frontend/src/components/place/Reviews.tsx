import {
  Box,
  Heading,
  Text,
  HStack,
  VStack,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import { Review } from "@/models/frontend";
import { PetIcon } from "@/components/common/PetIcon";

interface ReviewsProps {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  currentUserId: string;
}

export function Reviews({
  reviews,
  isLoading,
  error,
  currentUserId,
}: ReviewsProps) {
  if (isLoading) {
    return (
      <Box
        p={8}
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        minH="400px"
      >
        <Spinner size="xl" color="brand.primary" mb={4} />
        <Text color="gray.500">Loading reviews...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={8} textAlign="center">
        <Text color="red.500">Error loading reviews :(</Text>
      </Box>
    );
  }
  console.log("current user: ", currentUserId, typeof currentUserId);

  return (
    <VStack align="stretch" spacing={3}>
      {reviews.length === 0 ? (
        <Text color="gray.400" textAlign="center">
          No reviews yet. Be the first to review!
        </Text>
      ) : (
        reviews.map((review) => (
          <ReviewItem
            key={review.id}
            review={review}
            isCurrentUser={review.userId === currentUserId}
          />
        ))
      )}
    </VStack>
  );
}

export function ReviewsSection({
  reviews,
  isLoading,
  error,
  currentUserId,
}: ReviewsProps) {
  return (
    <>
      <Divider my={4} />
      <Heading size="md" mb={2}>
        Reviews
      </Heading>
      <Reviews
        reviews={reviews}
        isLoading={isLoading}
        error={error}
        currentUserId={currentUserId}
      />
    </>
  );
}

interface ReviewItemProps {
  review: Review;
  isCurrentUser: boolean;
}

function ReviewItem({ review, isCurrentUser }: ReviewItemProps) {
  console.log("review: ", review);
  return (
    <HStack spacing={1} align="stretch">
      <Divider
        orientation="vertical"
        borderColor="brand.primary"
        opacity={isCurrentUser ? "1" : "0.5"}
        borderWidth={isCurrentUser ? "2px" : "1.5px"}
        h="auto"
      />
      <Box p={3} borderRadius="md" flex={1}>
        <HStack spacing={2} mb={1}>
          <PetIcon isPetFriendly={review.petFriendly} />
          <Text fontWeight="bold">by {review.username}</Text>
        </HStack>
        {review.comment && <Text fontSize="sm">{review.comment}</Text>}
      </Box>
    </HStack>
  );
}
