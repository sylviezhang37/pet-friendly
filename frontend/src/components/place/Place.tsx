"use client";

import { Box, Heading, Text, HStack, Spinner } from "@chakra-ui/react";
import { Review, Place } from "@/models/frontend";
import { useState, useEffect } from "react";
import { usePlaceReviews } from "@/hooks/usePlaceReviews";
import { usePlaceUpdate } from "@/hooks/usePlaceUpdate";
import { useReviewSubmission } from "@/hooks/useReviewSubmission";
import { useStore } from "@/hooks/useStore";
import { GUEST_USER } from "@/lib/constants";
import { ReviewsSection } from "./Reviews";
import { ReviewSubmission } from "./ReviewSubmission";
import { ActionButton } from "@/components/common/ActionButton";
import { useAuthModal } from "@/hooks/useAuthModal";
import AuthModal from "../user/AuthModal";
import { PetIcon } from "../common/PetIcon";

export default function PlacePanel({ place }: { place: Place }) {
  const [isLoading, setIsLoading] = useState(true);
  const user = useStore((state) => state.user);
  const currentUser = user || GUEST_USER;
  const { isOpen, onOpen, onClose, handleSignIn, handleSignOut } =
    useAuthModal();

  const handleSignInClick = () => {
    onOpen();
  };

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
        <Spinner size="xl" color="brand.primary" mb={4} />
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
        fontWeight="bold"
        color="brand.primary"
        bg="brand.background"
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
          <PetIcon isPetFriendly={true} />
          <Text>{reviews.filter((r) => r.petFriendly).length} confirmed</Text>
        </HStack>
        <HStack>
          <PetIcon isPetFriendly={false} />
          <Text>{reviews.filter((r) => !r.petFriendly).length} denied</Text>
        </HStack>
      </HStack>

      {!user ? (
        <Box
          color="gray.600"
          textAlign="center"
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={1.5}
        >
          <ActionButton text="Sign in" onClick={handleSignInClick} />
          <Text>to contribute</Text>
        </Box>
      ) : (
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
      )}

      <ReviewsSection
        reviews={reviews}
        isLoading={reviewsLoading}
        error={reviewsError}
        currentUserId={currentUser.id}
      />

      {/* sign in pop-up */}
      <AuthModal
        isOpen={isOpen}
        onClose={onClose}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        currentUser={currentUser}
        isGuest={!user}
      />
    </Box>
  );
}
