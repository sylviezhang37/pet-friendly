import {
  Box,
  Heading,
  Text,
  HStack,
  VStack,
  Icon,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import { Review } from "@/models/models";
import { PiThumbsUpBold, PiThumbsDownBold } from "react-icons/pi";

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
        <Spinner size="xl" color="yellow.500" mb={4} />
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
  return (
    <Box p={3} bg={isCurrentUser ? "green.50" : "gray.50"} borderRadius="md">
      <HStack spacing={2} mb={1}>
        <Icon
          as={review.petFriendly ? PiThumbsUpBold : PiThumbsDownBold}
          color={review.petFriendly ? "green.500" : "red.400"}
        />
        <Text fontWeight="bold">by {review.username}</Text>
      </HStack>
      {review.comment && <Text fontSize="sm">{review.comment}</Text>}
    </Box>
  );
}
