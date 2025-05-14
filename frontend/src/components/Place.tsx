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
import { User, Place, Review } from "@/lib/models";
import { useStore } from "@/hooks/useStore";
import { PiThumbsUpBold, PiThumbsDownBold } from "react-icons/pi";
import { FaArrowLeft } from "react-icons/fa";
import { useState, useEffect } from "react";

const sampleUser: User = {
  id: "1",
  username: "hungry!",
};

const placeDetails: Place = {
  id: "12345",
  address: "329 W 49th St, New York, NY 10019",
  lat: 40.768731,
  lng: -73.985709,
  name: "The Standard, High Line",
  type: "restaurant",
  allowsPet: true,
  googleMapsUrl: "https://www.google.com/maps/place/?cid=12345",
  createdAt: "2025-05-10",
  updatedAt: "2025-05-10",
  numConfirm: 5,
  numDeny: 1,
  lastContributionType: "confirm",
  petFriendly: true,
};

const sampleReviews: Review[] = [
  {
    id: 1,
    placeId: "12345",
    userId: "12345",
    username: "hungry_beaver",
    petFriendly: true,
    comment:
      "Such a lovely spot! There's an outdoor area where your dog can hang out at.",
    createdAt: "2025-05-10",
  },
  {
    id: 2,
    placeId: "12345",
    userId: "12346",
    username: "short_giraffe",
    petFriendly: true,
    comment: "",
    createdAt: "2025-05-10",
  },
  {
    id: 3,
    placeId: "12345",
    userId: "12347",
    username: "fluffy_otter",
    petFriendly: true,
    comment: "Nice place to work at during the day with my pup.",
    createdAt: "2025-05-10",
  },
  {
    id: 4,
    placeId: "12345",
    userId: "12348",
    username: "fantastic_wombat",
    petFriendly: true,
    comment: "",
    createdAt: "2025-05-10",
  },
  {
    id: 5,
    placeId: "12345",
    userId: "12349",
    username: "extroverted_parrot",
    petFriendly: true,
    comment: "",
    createdAt: "2025-05-10",
  },
];

export default function PlacePanel({ place }: { place: Place }) {
  const setSelectedPlaceId = useStore((s) => s.setSelectedPlaceId);
  const [selected, setSelected] = useState<"confirm" | "deny" | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const currentUser = sampleUser;

  useEffect(() => {
    setLoading(true);
    setSelected(null);
    setComment("");
    setSubmitted(false);

    // simulate loading for 400ms
    setTimeout(() => {
      setReviews(sampleReviews);
      setLoading(false);
    }, 400);
  }, [place.id]);

  useEffect(() => {
    const found = reviews.find((r) => r.userId === currentUser.id);
    setUserReview(found || null);
  }, [reviews, currentUser.id]);

  const handleSelect = (type: "confirm" | "deny") => {
    setSelected(type);
    setSubmitted(false);
  };

  const handleCancel = () => {
    setSelected(null);
    setComment("");
    setSubmitted(false);
  };

  const handlePost = () => {
    // optimistically add new review
    const newReview = {
      id: reviews.length + 1,
      placeId: place.id,
      userId: currentUser.id,
      username: currentUser.username,
      petFriendly: selected === "confirm",
      createdAt: new Date().toISOString(),
      comment: comment,
    };

    // TODO: can i add to list without mutating the original?
    // update numConfirm and numDeny
    setReviews([newReview, ...reviews]);
    setSubmitted(true);
    setComment("");
    setSelected(null);
  };

  if (loading) {
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
        <Text color="gray.500">Loading place details...</Text>
      </Box>
    );
  }

  return (
    <Box p={10}>
      <IconButton
        aria-label="Back Arrow"
        icon={<FaArrowLeft />}
        colorScheme="gray"
        variant="ghost"
        justifyContent="flex-start"
        mb={4}
        onClick={() => setSelectedPlaceId(null)}
      />
      <Heading size="xl" mb={2}>
        {place.name}
      </Heading>
      <Text color="gray.600" mb={2}>
        {placeDetails.address}
      </Text>
      <Text
        fontSize="sm"
        color="yellow.800"
        bg="yellow.50"
        py={1}
        borderRadius="md"
        mb={2}
        display="inline-block"
      >
        Last confirmed on{" "}
        {userReview
          ? new Date(userReview.createdAt).toLocaleDateString()
          : placeDetails.updatedAt}
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
        <HStack spacing={4} mb={6} justifyContent="center">
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
          <Box mb={6} p={3} borderRadius="md" boxShadow="sm">
            <Textarea
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              mb={3}
              bg="white"
            />
            <HStack justify="flex-end">
              <Button onClick={handleCancel} variant="ghost">
                Cancel
              </Button>
              <Button
                onClick={handlePost}
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
      <VStack align="stretch" spacing={3}>
        {reviews.length === 0 ? (
          <Text color="gray.400" textAlign="center">
            No reviews yet. Be the first to review!
          </Text>
        ) : (
          // TODO: ping current user's review at top
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
    </Box>
  );
}
