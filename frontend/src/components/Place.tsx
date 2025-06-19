"use client";

import {
  Box,
  Heading,
  Text,
  HStack,
  Button,
  VStack,
  Icon,
  Divider,
  Textarea,
  Collapse,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { User, Review, Place } from "@/models/models";
import { useStore } from "@/hooks/useStore";
import { PiThumbsUpBold, PiThumbsDownBold } from "react-icons/pi";
import { FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";
import { usePlaceReviews } from "@/hooks/usePlaceReviews";
import { usePlaceUpdate } from "@/hooks/usePlaceUpdate";

const sampleUser: User = {
  id: "1",
  username: "noodle_doodle",
};

export default function PlacePanel({ place }: { place: Place }) {
  const setSelectedPlaceId = useStore((s) => s.setSelectedPlaceId);
  const [selected, setSelected] = useState<"confirm" | "deny" | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const currentUser = sampleUser;

  const {
    reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
    addReview,
  } = usePlaceReviews(place.id);

  const { updatePlaceStatus } = usePlaceUpdate(place.id);

  useEffect(() => {
    setSelected(null);
    setComment("");
    setSubmitted(false);
  }, [place.id]);

  useEffect(() => {
    const found = reviews.find((r) => r.userId === currentUser.id);
    setUserReview(found || null);
  }, [reviews, currentUser.id]);

  const handleSelect = (type: "confirm" | "deny") => {
    if (selected === type) {
      setSelected(null);
      return;
    }
    setSelected(type);
  };

  const handleCancelReview = () => {
    setSelected(null);
    setComment("");
    setSubmitted(false);
  };

  const handleAddReview = () => {
    // optimistically add new review
    const newReview: Review = {
      id: (reviews.length + 1).toString(),
      placeId: place.id,
      userId: currentUser.id,
      username: currentUser.username,
      petFriendly: selected === "confirm",
      createdAt: new Date(),
      comment: comment,
    };

    addReview(newReview);
    updatePlaceStatus(place, selected === "confirm");

    setSubmitted(true);
    setComment("");
    setSelected(null);
  };

  return (
    <Box position="relative" mx={10} my={4}>
      <Box
        position="sticky"
        zIndex={1}
        top={0}
        mx={-5}
        pt={1}
        display="flex"
        justifyContent="flex-end"
        pr={2}
        bg="whiteAlpha.800"
        backdropFilter="blur(8px)"
      >
        <IconButton
          aria-label="Close"
          icon={<FaTimes />}
          size="lg"
          variant="ghost"
          colorScheme="gray"
          _hover={{
            bg: "whiteAlpha.800",
            transform: "scale(1.1)",
            transition: "all 0.2s",
          }}
          onClick={() => setSelectedPlaceId(null)}
        />
      </Box>

      <Heading size="xl" mt={4} mb={2}>
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
        {(submitted && userReview
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

      {/* User Review Section */}
      {/* case 1: user has submitted a review in a previous session */}
      {userReview && !submitted && (
        <Box mb={6} p={4} bg="green.50" borderRadius="md" textAlign="center">
          <Text color="green.700">
            You&apos;ve submitted a review for this place.
          </Text>
        </Box>
      )}

      {/* case 2: user has not submitted a review yet */}
      <Collapse in={!userReview} unmountOnExit>
        <HStack spacing={4} mb={2} justifyContent="center">
          {/* TODO: add accessibility attributes */}
          <IconButton
            aria-label="Confirm"
            icon={<PiThumbsUpBold />}
            colorScheme={selected === "confirm" ? "yellow" : undefined}
            variant={selected === "confirm" ? "solid" : "outline"}
            onClick={() => handleSelect("confirm")}
            isDisabled={!!userReview}
          />
          <IconButton
            aria-label="Deny"
            icon={<PiThumbsDownBold />}
            colorScheme={selected === "deny" ? "yellow" : undefined}
            variant={selected === "deny" ? "solid" : "outline"}
            onClick={() => handleSelect("deny")}
            isDisabled={!!userReview}
          />
        </HStack>
        <Collapse in={!!selected} animateOpacity>
          <Box p={3} borderRadius="md">
            <Textarea
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              mb={3}
              bg="white"
            />
            <HStack justify="flex-end">
              <Button onClick={handleCancelReview} variant="ghost">
                Cancel
              </Button>
              <Button
                onClick={handleAddReview}
                colorScheme="yellow"
                fontWeight="bold"
              >
                Post
              </Button>
            </HStack>
          </Box>
        </Collapse>
      </Collapse>

      {/* case 3: user submits a review in current session*/}
      {userReview && submitted && (
        <Collapse in={submitted} unmountOnExit>
          <Box mb={6} p={4} bg="green.50" borderRadius="md" textAlign="center">
            <Text color="green.700">Review submitted</Text>
          </Box>
        </Collapse>
      )}

      {/* Reviews Section */}
      <Divider my={4} />
      <Heading size="md" mb={2}>
        Reviews
      </Heading>

      {reviewsLoading && (
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
      )}

      {reviewsError && (
        <Box p={8} textAlign="center">
          <Text color="red.500">Error loading reviews :(</Text>
        </Box>
      )}

      {!reviewsLoading && !reviewsError && (
        <VStack align="stretch" spacing={3}>
          {reviews.length === 0 ? (
            // If no reviews, show a CTA to submit a review
            <Text color="gray.400" textAlign="center">
              No reviews yet. Be the first to review!
            </Text>
          ) : (
            reviews.map((review) => (
              <Box
                key={review.id}
                p={3}
                bg={review.userId === currentUser.id ? "green.50" : "gray.50"}
                borderRadius="md"
              >
                <HStack spacing={2} mb={1}>
                  <Icon
                    as={review.petFriendly ? PiThumbsUpBold : PiThumbsDownBold}
                    color={review.petFriendly ? "green.500" : "red.400"}
                  />
                  <Text fontWeight="bold">by {review.username}</Text>
                </HStack>
                {review.comment && <Text fontSize="sm">{review.comment}</Text>}
              </Box>
            ))
          )}
        </VStack>
      )}
    </Box>
  );
}
