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
  Fade,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { Place } from "@/lib/place";
import { useStore } from "@/hooks/useStore";
import { PiThumbsUpBold, PiThumbsDownBold } from "react-icons/pi";
import { FaArrowLeft } from "react-icons/fa";
import { useState, useEffect } from "react";

const sampleDetails = {
  address: "329 W 49th St, New York, NY 10019",
  lastConfirmed: "2025-05-10",
  numConfirm: 5,
  numDeny: 0,
  reviews: [
    {
      id: 1,
      username: "hungry_beaver",
      confirm: true,
      comment:
        "Such a lovely spot! There's an outdoor area where your dog can hang out at.",
    },
    { id: 2, username: "short_giraffe", confirm: true, comment: "" },
    {
      id: 3,
      username: "fluffy_otter",
      confirm: true,
      comment: "Nice place to work at during the day with my pup.",
    },
    { id: 4, username: "fantastic_wombat", confirm: true, comment: "" },
    { id: 5, username: "extroverted_parrot", confirm: true, comment: "" },
    {
      id: 6,
      username: "smol_rabbit",
      confirm: false,
      comment:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
  ],
};

export default function PlacePanel({ place }: { place: Place }) {
  const setSelectedPlaceId = useStore((s) => s.setSelectedPlaceId);
  const [selected, setSelected] = useState<"confirm" | "deny" | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simulate loading for 600ms
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [place.id]);

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
    setSubmitted(true);
    setComment("");
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
        aria-label="Left Arrow"
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
        {sampleDetails.address}
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
        Last confirmed on {sampleDetails.lastConfirmed}
      </Text>
      <HStack spacing={6} mb={4} mt={2}>
        <HStack>
          <Icon as={PiThumbsUpBold} color="green.500" />
          <Text>{sampleDetails.numConfirm} confirmed</Text>
        </HStack>
        <HStack>
          <Icon as={PiThumbsDownBold} color="red.400" />
          <Text>{sampleDetails.numDeny} denied</Text>
        </HStack>
      </HStack>
      <HStack spacing={4} mb={6} justifyContent="center">
        <IconButton
          aria-label="Confirm"
          icon={<PiThumbsUpBold />}
          colorScheme={selected === "confirm" ? "yellow" : undefined}
          variant={selected === "confirm" ? "solid" : "outline"}
          onClick={() => handleSelect("confirm")}
        />
        <IconButton
          aria-label="Deny"
          icon={<PiThumbsDownBold />}
          colorScheme={selected === "deny" ? "yellow" : undefined}
          variant={selected === "deny" ? "solid" : "outline"}
          onClick={() => handleSelect("deny")}
        />
      </HStack>
      <Fade in={!!selected && !submitted} unmountOnExit>
        <Box mb={6} p={4} borderRadius="md" boxShadow="sm">
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
            <Button onClick={handlePost} colorScheme="yellow" fontWeight="bold">
              Post
            </Button>
          </HStack>
        </Box>
      </Fade>
      <Fade in={submitted} unmountOnExit>
        <Box mb={6} p={4} bg="green.50" borderRadius="md" textAlign="center">
          <Text color="green.700">Review submitted</Text>
        </Box>
      </Fade>
      <Divider my={4} />
      <Heading size="md" mb={2}>
        Reviews
      </Heading>
      <VStack align="stretch" spacing={3}>
        {sampleDetails.reviews.length === 0 ? (
          <Text color="gray.400" textAlign="center">
            No reviews yet. Be the first to review!
          </Text>
        ) : (
          sampleDetails.reviews.map((review) => (
            <Box key={review.id} p={3} bg="gray.50" borderRadius="md">
              <HStack spacing={2} mb={1}>
                <Icon
                  as={review.confirm ? PiThumbsUpBold : PiThumbsDownBold}
                  color={review.confirm ? "green.500" : "red.400"}
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
