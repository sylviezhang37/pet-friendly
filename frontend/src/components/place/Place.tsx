"use client";

import { Box, Heading, Text, HStack, Icon, Spinner } from "@chakra-ui/react";
import { Review, Place } from "@/models/frontend";
import { PiThumbsUpBold, PiThumbsDownBold } from "react-icons/pi";
import { useState, useEffect } from "react";
import { usePlaceReviews } from "@/hooks/usePlaceReviews";
import { usePlaceUpdate } from "@/hooks/usePlaceUpdate";
import { useReviewSubmission } from "@/hooks/useReviewSubmission";
import { useStore } from "@/hooks/useStore";
import { GUEST_USER } from "@/lib/constants";
import { ReviewsSection } from "./Reviews";
import { ReviewSubmission } from "./ReviewSubmission";

export default function PlacePanel({ place }: { place: Place }) {
  const [isLoading, setIsLoading] = useState(true);
  const user = useStore((state) => state.user);
  const currentUser = user || GUEST_USER;

  const {
    reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
    addReview,
  } = usePlaceReviews(place.id);

  const { updatePlaceStatus } = usePlaceUpdate(place.id);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [place.id]);

  function handleReviewSubmit(review: Review, isPetFriendly: boolean) {
    addReview(review);
    updatePlaceStatus(place, isPetFriendly);
  }

  const reviewSubmission = useReviewSubmission({
    place,
    currentUser,
    reviews,
    onReviewSubmit: handleReviewSubmit,
  });

  if (isLoading) {
    return (
      <Box
        position="relative"
        mx={10}
        my={8}
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        minH="400px"
      >
        <Spinner size="xl" color="yellow.300" mb={4} />
      </Box>
    );
  }

  return (
    <Box position="relative" mx={10} my={8}>
      <Heading size="lg" mt={8} mb={2}>
        {place.name}
      </Heading>
      <Text color="gray.600" mb={2}>
        {place.address}
      </Text>

      <Text
        fontSize="sm"
        color="yellow.800"
        bg="yellow.50"
        borderRadius="md"
        py={1}
        display="inline-block"
      >
        Last updated on{" "}
        {(reviewSubmission.submitted && reviewSubmission.userReview
          ? new Date()
          : place.updatedAt
        ).toLocaleDateString()}
      </Text>

      <HStack spacing={6} mb={4} mt={2}>
        <HStack>
          <Icon as={PiThumbsUpBold} color="green.500" />
          <Text>{reviews.filter((r) => r.petFriendly).length} confirmed</Text>
        </HStack>
        <HStack>
          <Icon as={PiThumbsDownBold} color="red.400" />
          <Text>{reviews.filter((r) => !r.petFriendly).length} denied</Text>
        </HStack>
      </HStack>

      <ReviewSubmission
        selected={reviewSubmission.selected}
        comment={reviewSubmission.comment}
        submitted={reviewSubmission.submitted}
        userReview={reviewSubmission.userReview}
        onSelect={reviewSubmission.handleSelect}
        onCancel={reviewSubmission.handleCancelReview}
        onAddReview={reviewSubmission.handleAddReview}
        onCommentChange={reviewSubmission.setComment}
      />

      <ReviewsSection
        reviews={reviews}
        isLoading={reviewsLoading}
        error={reviewsError}
        currentUserId={currentUser.id}
      />
    </Box>
  );
}
